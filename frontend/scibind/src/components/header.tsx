// components/Header.tsx
import React from "react";

export default function Header() {
  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl" href="/dashboard">SciBind</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>File</a>
          </li>
          <li>
            <a>Edit</a>
          </li>
          <li>
            <a>View</a>
          </li>
          <li>
            <a>Insert</a>
          </li>
          <li>
            <a>Format</a>
          </li>
          <li>
            <a>Tools</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
