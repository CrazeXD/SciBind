"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [profilePicture, setProfilePicture] = useState<File[]>([]);
  const [isImageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/picture/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.blob().then((data) => {
            return setProfilePicture([new File([data], "profile_picture.jpg")]);
          });
        } else {
          throw new Error("An error occurred");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    location.href = "/";
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-2xl">SciBind</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex justify-center items-center">
              {profilePicture.length > 0 ? (
                <img
                  alt="Profile Picture"
                  src={URL.createObjectURL(profilePicture[0])}
                  onLoad={() => setImageLoading(false)}
                  style={{
                    display: isImageLoading ? "none" : "block",
                    width: "auto",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm"></span>
                </div>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a onClick={logout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
