import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bookmark, Box, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, CloudUpload, LockKeyhole, ShieldCheck, XCircle } from "lucide-react";
import { useI18n } from "../i18n";
import ConfirmModal from "../Component/ConfirmModal";

const PASS_MARK = 60;

const QUESTIONS = [
  { q: "Which of the following is a valid React hook for managing component state?", options: ["A. useState()", "B. useStyle()", "C. useRender()", "D. useComponent()"], correct: 0, points: 2 },
  { q: "Which HTML element is used to embed JavaScript in a page?", options: ["A. <js>", "B. <script>", "C. <code>", "D. <javascript>"], correct: 1, points: 2 },
  { q: "What does CSS stand for?", options: ["A. Computer Style Sheets", "B. Creative Style System", "C. Cascading Style Sheets", "D. Colorful Style Sheets"], correct: 2, points: 2 },
  { q: "Which CSS property is used to specify whether an element should be sized including its padding and border?", options: ["A. box-sizing:border-box", "B. box-sizing:content-box", "C. outline-style", "D. padding-box"], correct: 0, points: 2.5 },
  { q: "Which JavaScript keyword declares a block-scoped variable?", options: ["A. var", "B. let", "C. function", "D. global"], correct: 1, points: 2 },
  { q: "Which array method creates a new array by transforming every element?", options: ["A. forEach()", "B. push()", "C. map()", "D. filter()"], correct: 2, points: 2 },
  { q: "Which HTTP status code means 'Not Found'?", options: ["A. 200", "B. 404", "C. 500", "D. 301"], correct: 1, points: 2 },
  { q: "Which React hook runs a side effect after render?", options: ["A. useEffect()", "B. useState()", "C. useMemo()", "D. useRef()"], correct: 0, points: 2 },
  { q: "What does DOM stand for?", options: ["A. Data Object Model", "B. Document Oriented Markup", "C. Document Object Model", "D. Dynamic Object Module"], correct: 2, points: 2 },
  { q: "Which operator checks both value and type in JavaScript?", options: ["A. ==", "B. =", "C. !=", "D. ==="], correct: 3, points: 2 },
  { q: "Which CSS layout system arranges items in rows and columns?", options: ["A. Flexbox only", "B. CSS Grid", "C. Float", "D. Inline-block"], correct: 1, points: 2 },
  { q: "Which array method adds an element to the end of an array?", options: ["A. shift()", "B. slice()", "C. push()", "D. concat()"], correct: 2, points: 2 },
  { q: "Which HTML attribute specifies alternative text for an image?", options: ["A. alt", "B. title", "C. src", "D. placeholder"], correct: 0, points: 2 },
  { q: "What is the default port for HTTPS?", options: ["A. 80", "B. 443", "C. 8080", "D. 21"], correct: 1, points: 2 },
  { q: "Which keyword defines a constant in JavaScript?", options: ["A. var", "B. let", "C. const", "D. static"], correct: 2, points: 2 },
  { q: "Which React prop gives list items a unique identifier?", options: ["A. key", "B. id", "C. ref", "D. name"], correct: 0, points: 2 },
  { q: "Which CSS unit is relative to the root element font size?", options: ["A. px", "B. em", "C. rem", "D. vh"], correct: 2, points: 2 },
  { q: "Which method converts a JSON string into a JavaScript object?", options: ["A. JSON.stringify()", "B. Object.parse()", "C. JSON.parse()", "D. String.toJSON()"], correct: 2, points: 2 },
  { q: "Which React event fires when a form is submitted?", options: ["A. onSubmit", "B. onClick", "C. onsubmit", "D. onFormSubmit"], correct: 0, points: 2 },
  { q: "Which protocol supports real-time bidirectional communication?", options: ["A. HTTP", "B. WebSocket", "C. FTP", "D. SMTP"], correct: 1, points: 2 },
];

const STORAGE_KEY = (id) => `opream_exam_${id}`;
const RESULT_KEY = (id) => `opream_exam_result_${id}`;

function loadSaved(id) {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY(id)) || "null");
  } catch {
    return null;
  }
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

  const [initial] = useState(() => loadSaved(id));
  const [index, setIndex] = useState(initial?.index ?? 0);
  const [answers, setAnswers] = useState(initial?.answers ?? {});
  const [marked, setMarked] = useState(initial?.marked ?? []);
  const [remaining, setRemaining] = useState(initial?.remaining ?? 45 * 60);
  const [phase, setPhase] = useState(initial?.phase ?? "taking");

  useEffect(() => {
    if (phase === "taking" || phase === "confirm") {
      sessionStorage.setItem(STORAGE_KEY(id), JSON.stringify({ index, answers, marked, remaining, phase }));
    }
  }, [id, index, answers, marked, remaining, phase]);

  useEffect(() => {
    if (phase !== "taking") return undefined;
    const timer = window.setInterval(() => {
      setRemaining((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const question = QUESTIONS[index];
  const answeredCount = Object.keys(answers).length;
  const totalPoints = QUESTIONS.reduce((sum, item) => sum + item.points, 0);
  const earnedPoints = QUESTIONS.reduce((sum, item, i) => sum + (answers[i] === item.options[item.correct] ? item.points : 0), 0);
  const correctCount = QUESTIONS.reduce((count, item, i) => count + (answers[i] === item.options[item.correct] ? 1 : 0), 0);
  const score = Math.round((earnedPoints / totalPoints) * 100);
  const pass = score >= PASS_MARK;
  const progress = Math.round(((index + 1) / QUESTIONS.length) * 100);

  function finishExam() {
    sessionStorage.setItem(RESULT_KEY(id), JSON.stringify({
      score, correctCount, earnedPoints, totalPoints, answeredCount,
      answers, submittedAt: new Date().toISOString(), passed: pass,
    }));
    sessionStorage.removeItem(STORAGE_KEY(id));
    setPhase("submitted");
  }

  function choose(option) {
    setAnswers((previous) => ({ ...previous, [index]: option }));
  }

  function toggleMark() {
    setMarked((previous) => (previous.includes(index) ? previous.filter((item) => item !== index) : [...previous, index]));
  }

  if (phase === "submitted") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 rounded-2xl border-2 border-teal-700 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{t("submittedSuccessfully")}</h1>
        <span className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-teal-700 text-teal-700"><Check size={52} strokeWidth={2.5} /></span>
        <button type="button" onClick={() => setPhase("result")} className="rounded-lg bg-blue-700 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-800">
          {t("results")}
        </button>
      </div>
    );
  }

  if (phase === "result" || phase === "passed") {
    const outcome = phase === "passed";
    const wrongAnswers = QUESTIONS.map((item, i) => ({ ...item, i })).filter((item) => answers[item.i] !== item.options[item.correct]);
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        {outcome ? (
          <>
            <h1 className={`text-xl font-medium ${pass ? "text-slate-700" : "text-rose-700"}`}>{pass ? t("passed") : t("failed")}</h1>
            <span className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${pass ? "border-blue-700 text-blue-700" : "border-rose-700 text-rose-700"}`}>
              {pass ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
            </span>
            <p className="text-4xl font-bold text-slate-900">{score}%</p>
            <p className="text-sm text-slate-500">
              {t("correctAnswers")}: {correctCount} / {QUESTIONS.length}
            </p>
          </>
        ) : (
          <>
            <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-4 border-blue-700">
              <div className="text-center">
                <p className="text-base text-slate-700">{t("score")}</p>
                <p className="text-4xl font-bold text-blue-700">{score}%</p>
              </div>
              <span className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#1d4ed8 ${score}%, transparent ${score}% 100%)`, maskImage: "radial-gradient(transparent 62%, black 63%)", WebkitMaskImage: "radial-gradient(transparent 62%, black 63%)" }} />
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-slate-600">
              <span><strong className="text-slate-900">{t("answered")}:</strong> {answeredCount} / {QUESTIONS.length}</span>
              <span><strong className="text-slate-900">{t("correctAnswers")}:</strong> {correctCount}</span>
              <span><strong className="text-slate-900">{t("earnedPoints")}:</strong> {earnedPoints} / {totalPoints}</span>
              <span>{t("passMark")}</span>
            </div>
            {wrongAnswers.length > 0 && (
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-start">
                <p className="mb-3 text-xs font-bold text-slate-800">{t("reviewAnswers")}</p>
                <div className="space-y-2">
                  {wrongAnswers.slice(0, 5).map((item) => (
                    <div key={item.i} className="grid gap-1 border-b border-slate-200 pb-2 text-[11px] last:border-0 sm:grid-cols-3">
                      <span className="font-semibold text-slate-800">Q{item.i + 1}</span>
                      <span className="text-rose-700">{t("yourAnswer")}: {answers[item.i] || t("noAnswer")}</span>
                      <span className="text-teal-700">{t("correctAnswer")}: {item.options[item.correct]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <button type="button" onClick={() => (outcome ? navigate("/exams") : setPhase("passed"))} className="rounded-lg bg-blue-700 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-800">
          {t("backToMyExam")}
        </button>
      </div>
    );
  }

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="mx-auto w-full max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white"><Box size={26} /></span>
          <div>
            <p className="text-sm font-bold text-slate-900">{t("examPortal")}</p>
            <p className="text-sm text-slate-700">{t("internshipFrontend")}</p>
          </div>
          <span className="hidden rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold text-teal-800 sm:inline">{t("proctoredSession")}</span>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <div className="min-w-[140px]">
            <p className="mb-1 text-xs font-bold text-slate-800">{t("examQuestion")} {index + 1} {t("of")} {QUESTIONS.length}</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100"><div className="h-full rounded-full bg-blue-700 transition-all" style={{ width: `${progress}%` }} /></div>
            <p className="mt-1 text-[10px] text-slate-500">{progress}% · {t("totalPoints")}: {totalPoints}</p>
          </div>
          <span className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${remaining <= 60 ? "border-rose-200 bg-rose-50 text-rose-700" : "border-blue-100 bg-blue-50 text-blue-800"}`} role="timer">
            <Clock3 size={14} /> {t("timeRemaining")}: {formatTime(remaining)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="me-2 text-[11px] font-semibold text-slate-500">{t("questionPalette")}:</span>
        {QUESTIONS.map((item, i) => {
          const isCurrent = i === index;
          const isMarked = marked.includes(i);
          const isAnswered = answers[i] !== undefined;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              title={`${t("examQuestion")} ${i + 1}${isMarked ? ` · ${t("markedCount")}` : ""}`}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold transition ${
                isCurrent
                  ? "bg-blue-700 text-white"
                  : isMarked
                  ? "bg-amber-100 text-amber-800 ring-1 ring-amber-300"
                  : isAnswered
                  ? "bg-teal-100 text-teal-800"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
        <span className="ms-auto flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-teal-500" />{t("answered")}: {answeredCount}</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />{t("markedCount")}: {marked.length}</span>
        </span>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">{t("multipleChoice")}</span>
            <span className="text-xs text-slate-500">{t("weight")} {question.points} {t("points")}</span>
          </div>
          <button type="button" onClick={toggleMark} className={`flex items-center gap-2 text-xs font-semibold ${marked.includes(index) ? "text-blue-700" : "text-slate-500 hover:text-slate-800"}`}>
            <Bookmark size={15} fill={marked.includes(index) ? "currentColor" : "none"} />
            {marked.includes(index) ? t("markedForReview") : t("markForReview")}
          </button>
        </div>

        <div className="p-5 sm:p-8">
          <p className="mb-2 text-xs text-slate-500">{t("examQuestion")} {index + 1}</p>
          <h2 className="mb-7 text-lg font-semibold leading-8 text-slate-900">{question.q}</h2>
          <div className="space-y-3">
            {question.options.map((option) => {
              const chosen = answers[index] === option;
              return (
                <button key={option} type="button" onClick={() => choose(option)} className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-start text-sm transition ${chosen ? "border-blue-500 bg-blue-50 text-slate-900" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50"}`}>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${chosen ? "border-blue-700 bg-blue-700" : "border-slate-400"}`}>
                    {chosen && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  <span className="flex-1 font-medium">{option}</span>
                  {chosen && <span className="text-xs font-semibold text-blue-700">{t("selected")}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-xs text-slate-600">
          <span className="flex items-center gap-2"><CloudUpload size={14} /> {t("answerSaved")}</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-600" /> {t("onlineProctored")}</span>
        </div>
      </article>

      <div className="flex flex-wrap items-center justify-between gap-3 pb-6">
        <button type="button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
          {isAr ? <ChevronRight size={16} /> : <ChevronLeft size={16} />} {t("previousQuestion")}
        </button>
        <div className="flex gap-3">
          <button type="button" disabled={index === QUESTIONS.length - 1} onClick={() => setIndex((value) => value + 1)} className="flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50">
            {t("nextQuestion")} {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          <button type="button" onClick={() => (remaining === 0 ? finishExam() : setPhase("confirm"))} className="flex items-center gap-2 rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800">
            <ShieldCheck size={16} /> {t("submitExam")}
          </button>
        </div>
      </div>

      <ConfirmModal
        open={phase === "confirm"}
        title={t("submitAssessment")}
        body={t("submitExamConfirm")}
        confirmLabel={t("confirmAndSubmit")}
        onCancel={() => setPhase("taking")}
        onConfirm={finishExam}
      >
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm">
          <span><strong className="text-slate-900">{t("answered")}:</strong> {answeredCount} / {QUESTIONS.length}</span>
          <span className="flex items-center gap-2 font-semibold text-blue-800"><LockKeyhole size={14} /> {t("timeRemaining")}: <strong>{formatTime(remaining)}</strong></span>
        </div>
      </ConfirmModal>
    </div>
  );
}
