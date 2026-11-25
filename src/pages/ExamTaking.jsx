import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Bookmark, Box, Check, ChevronLeft, ChevronRight, Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import { useI18n } from "../i18n";
import ConfirmModal from "../Component/ConfirmModal";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const ANSWERS_KEY = (id) => `opream_exam_answers_${id}`;
const RESULT_KEY = (id) => `opream_exam_result_${id}`;

function readAnswers(id) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(ANSWERS_KEY(id)) || "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function getPayload(response) {
  const payload = response?.data?.data ?? response?.data ?? {};
  return payload.exam ?? payload;
}

function normalizeQuestion(question, index) {
  const options = Array.isArray(question.options) ? question.options : [];
  return {
    id: question.id ?? question.question_id ?? index,
    text: question.text ?? question.question ?? question.prompt ?? "",
    points: Number(question.points ?? question.weight ?? 1),
    options: options.map((option, optionIndex) => ({
      value: String(typeof option === "object" ? option.id ?? option.value ?? optionIndex : optionIndex),
      label: String(typeof option === "object" ? option.text ?? option.label ?? "" : option),
    })),
  };
}

function formatTime(total) {
  const minutes = Math.floor(total / 60).toString().padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function ExamTaking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const isAr = language === "ar";
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(() => readAnswers(id));
  const [marked, setMarked] = useState([]);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const deadlineRef = useRef(null);
  const submitStarted = useRef(false);
  const autoSubmitTriggered = useRef(false);

  useEffect(() => {
    let active = true;
    async function loadExam() {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(`${API_BASE_URL}/api/exams/${encodeURIComponent(id)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const payload = getPayload(response);
        const status = String(payload.status ?? "").toLowerCase();
        const endTime = payload.attempt?.expires_at ?? payload.expires_at ?? payload.ends_at;
        const loadedQuestions = Array.isArray(payload.questions) ? payload.questions.map(normalizeQuestion) : [];

        if (!active) return;
        if (status !== "available" || !endTime || loadedQuestions.length === 0) {
          navigate("/exams", { replace: true });
          return;
        }

        const deadline = new Date(endTime).getTime();
        if (!Number.isFinite(deadline) || deadline <= Date.now()) {
          navigate("/exams", { replace: true });
          return;
        }

        deadlineRef.current = deadline;
        setExam(payload);
        setQuestions(loadedQuestions);
        setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
        setPhase("taking");
      } catch {
        if (active) {
          setError(t("examLoadError"));
          setPhase("error");
        }
      }
    }
    loadExam();
    return () => { active = false; };
  }, [id, navigate, t]);

  const finishExam = useCallback(async () => {
    if (submitStarted.current || phase === "submitted" || phase === "result") return;
    submitStarted.current = true;
    setPhase("submitting");
    setError("");
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/exams/${encodeURIComponent(id)}/submit`,
        { answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })) },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );
      const payload = getPayload(response);
      setResult(payload.result ?? payload);
      sessionStorage.removeItem(ANSWERS_KEY(id));
      sessionStorage.setItem(RESULT_KEY(id), JSON.stringify(payload.result ?? payload));
      setPhase("submitted");
    } catch (submitError) {
      submitStarted.current = false;
      setError(submitError.response?.data?.message || t("examSubmitError"));
      setPhase("taking");
    }
  }, [answers, id, phase, t]);

  useEffect(() => {
    if ((phase !== "taking" && phase !== "confirm") || !deadlineRef.current) return undefined;
    const tick = () => setRemaining(Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if ((phase === "taking" || phase === "confirm") && remaining === 0 && deadlineRef.current && !autoSubmitTriggered.current) {
      autoSubmitTriggered.current = true;
      finishExam();
    }
  }, [finishExam, phase, remaining]);

  useEffect(() => {
    if (phase === "taking") sessionStorage.setItem(ANSWERS_KEY(id), JSON.stringify(answers));
  }, [answers, id, phase]);

  if (phase === "loading") {
    return <div className="mx-auto flex min-h-[50vh] items-center justify-center text-sm text-slate-500" role="status">{t("loadingExam")}</div>;
  }

  if (phase === "error") {
    return <div className="mx-auto max-w-2xl rounded-xl border border-rose-200 bg-white p-8 text-center"><p role="alert" className="text-sm text-rose-700">{error}</p><button type="button" onClick={() => navigate("/exams")} className="mt-5 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white">{t("backToMyExam")}</button></div>;
  }

  if (phase === "submitted" || phase === "result") {
    return <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-5 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-teal-700 text-teal-700"><Check size={48} /></span>
      <h1 className="text-2xl font-bold text-slate-900">{t("submittedSuccessfully")}</h1>
      {result && <div className="space-y-2 text-sm text-slate-600">
        {result.score !== undefined && <p>{t("score")}: <strong>{result.score}%</strong></p>}
        {result.correct_count !== undefined && <p>{t("correctAnswers")}: {result.correct_count}</p>}
        {result.passed !== undefined && <p>{result.passed ? t("passed") : t("failed")}</p>}
      </div>}
      <button type="button" onClick={() => navigate("/exams", { replace: true })} className="rounded-lg bg-blue-700 px-8 py-3 text-sm font-semibold text-white">{t("backToMyExam")}</button>
    </div>;
  }

  const question = questions[index];
  const answeredCount = Object.keys(answers).length;
  const totalPoints = questions.reduce((sum, item) => sum + item.points, 0);
  const progress = Math.round(((index + 1) / questions.length) * 100);

  function choose(optionValue) {
    setAnswers((previous) => ({ ...previous, [question.id]: optionValue }));
  }

  function toggleMark() {
    setMarked((previous) => previous.includes(index) ? previous.filter((item) => item !== index) : [...previous, index]);
  }

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="mx-auto w-full max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white"><Box size={26} /></span><div><p className="text-sm font-bold text-slate-900">{t("examPortal")}</p><p className="text-sm text-slate-700">{exam?.title || exam?.name}</p></div></div>
        <div className="flex flex-wrap items-center gap-5"><div className="min-w-35"><p className="mb-1 text-xs font-bold text-slate-800">{t("examQuestion")} {index + 1} {t("of")} {questions.length}</p><div className="h-2 w-full overflow-hidden rounded-full bg-blue-100"><div className="h-full rounded-full bg-blue-700" style={{ width: `${progress}%` }} /></div><p className="mt-1 text-[10px] text-slate-500">{progress}% · {t("totalPoints")}: {totalPoints}</p></div>
          <span className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${remaining <= 60 ? "border-rose-200 bg-rose-50 text-rose-700" : "border-blue-100 bg-blue-50 text-blue-800"}`} role="timer"><Clock3 size={14} /> {t("timeRemaining")}: {formatTime(remaining)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><span className="me-2 text-[11px] font-semibold text-slate-500">{t("questionPalette")}:</span>
        {questions.map((item, i) => <button key={item.id} type="button" onClick={() => setIndex(i)} title={`${t("examQuestion")} ${i + 1}`} className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold ${i === index ? "bg-blue-700 text-white" : marked.includes(i) ? "bg-amber-100 text-amber-800" : answers[item.id] !== undefined ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-500"}`}>{i + 1}</button>)}
        <span className="ms-auto text-[10px] text-slate-500">{t("answered")}: {answeredCount}</span>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">{t("multipleChoice")}</span><button type="button" onClick={toggleMark} className="flex items-center gap-2 text-xs font-semibold text-slate-600"><Bookmark size={15} fill={marked.includes(index) ? "currentColor" : "none"} />{marked.includes(index) ? t("markedForReview") : t("markForReview")}</button></div>
        <div className="p-5 sm:p-8"><p className="mb-2 text-xs text-slate-500">{t("examQuestion")} {index + 1}</p><h2 dir="ltr" style={{ unicodeBidi: "isolate" }} className="mb-7 text-start text-lg font-semibold leading-8 text-slate-900">{question.text}</h2><div className="space-y-3">
          {question.options.map((option) => { const chosen = String(answers[question.id]) === option.value; return <button key={option.value} type="button" onClick={() => choose(option.value)} className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-start text-sm ${chosen ? "border-blue-500 bg-blue-50 text-slate-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${chosen ? "border-blue-700 bg-blue-700" : "border-slate-400"}`}>{chosen && <span className="h-2 w-2 rounded-full bg-white" />}</span><span dir="ltr" style={{ unicodeBidi: "isolate" }} className="flex-1 text-start font-medium">{option.label}</span></button>; })}
        </div></div><div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-600">{t("answerSaved")}</div></article>

      {error && <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6"><button type="button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50">{isAr ? <ChevronRight size={16} /> : <ChevronLeft size={16} />} {t("previousQuestion")}</button><div className="flex gap-3"><button type="button" disabled={index === questions.length - 1} onClick={() => setIndex((value) => value + 1)} className="flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{t("nextQuestion")} {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</button><button type="button" onClick={() => setPhase("confirm")} className="flex items-center gap-2 rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white"><ShieldCheck size={16} /> {t("submitExam")}</button></div></div>

      <ConfirmModal open={phase === "confirm"} title={t("submitAssessment")} body={t("submitExamConfirm")} confirmLabel={t("confirmAndSubmit")} onCancel={() => setPhase("taking")} onConfirm={finishExam}><div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm"><span><strong>{t("answered")}:</strong> {answeredCount} / {questions.length}</span><span className="flex items-center gap-2 font-semibold text-blue-800"><LockKeyhole size={14} />{formatTime(remaining)}</span></div></ConfirmModal>
      {phase === "submitting" && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30"><p className="rounded-lg bg-white px-6 py-4 text-sm font-semibold text-slate-700" role="status">{t("submittingExam")}</p></div>}
    </div>
  );
}
