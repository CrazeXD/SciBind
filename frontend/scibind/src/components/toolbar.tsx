// components/Toolbar.tsx
import React from "react";
export default function Toolbar() {
  return (
    <div className="bg-base-200 p-2 flex items-center space-x-2">
      <button className="btn btn-sm btn-ghost" title="Bold">
        <i className="fas fa-bold"></i>
      </button>
      <button className="btn btn-sm btn-ghost" title="Italic">
        <i className="fas fa-italic"></i>
      </button>
      <button className="btn btn-sm btn-ghost" title="Underline">
        <i className="fas fa-underline"></i>
      </button>
      <select
        className="select select-sm select-bordered w-full max-w-xs"
        title="Font"
      >
        <option>Arial</option>
        <option>Times New Roman</option>
        <option>Calibri</option>
      </select>
      <select
        className="select select-sm select-bordered w-full max-w-xs"
        title="Font Size"
      >
        <option>8</option>
        <option>10</option>
        <option>12</option>
        <option>14</option>
        <option>16</option>
      </select>
      <button className="btn btn-sm btn-ghost" title="Align Left">
        <i className="fas fa-align-left"></i>
      </button>
      <button className="btn btn-sm btn-ghost" title="Align Center">
        <i className="fas fa-align-center"></i>
      </button>
      <button className="btn btn-sm btn-ghost" title="Align Right">
        <i className="fas fa-align-right"></i>
      </button>
    </div>
  );
}
