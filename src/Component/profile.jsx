import React from 'react'

export default function Profile({ userData }) {

  console.log(userData)

  return (
    <div className="container py-5">

      <h4>  Name: {userData?.user?.name}</h4>

      <h4>username: {userData?.user?.username}</h4>

      <h4>Email: {userData?.user?.email}</h4>

      <h4>DateOfBirth: {userData?.user?.dateOfBirth}</h4>

      <h4>Gender: {userData?.user?.gender}</h4>

    </div>
  )
}