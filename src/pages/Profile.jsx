import React from "react";

export default function Profile({ userData }) {
  const user = userData?.user || userData;

  return (
    <div className="py-4">
      <h2 className="mb-4">Profile</h2>
      <div className="card p-4">
        <h5>Name: {user?.name || "-"}</h5>
        <h5>Username: {user?.username || "-"}</h5>
        <h5>Email: {user?.email || "-"}</h5>
        <h5>Date of Birth: {user?.dateOfBirth || "-"}</h5>
        <h5>Gender: {user?.gender || "-"}</h5>
      </div>
    </div>
  );
}
