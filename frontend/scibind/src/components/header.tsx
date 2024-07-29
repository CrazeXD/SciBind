// components/Header.tsx
import React from "react";

export default function Header() {
  return (
    <header className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <a
          className="btn btn-ghost normal-case text-xl text-primary"
          href="/dashboard"
        >
          SciBind
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a className="text-neutral-content">File</a>
          </li>
          <li>
            <a className="text-neutral-content">Edit</a>
          </li>
          <li>
            <a className="text-neutral-content">View</a>
          </li>
          <li>
            <a className="text-neutral-content">Insert</a>
          </li>
          <li>
            <a className="text-neutral-content">Format</a>
          </li>
          <li>
            <a className="text-neutral-content">Tools</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
