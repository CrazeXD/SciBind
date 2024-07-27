import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import React from "react";
export default function Toolbar() {
  return (
    <div className="bg-base-200 p-2 flex items-center space-x-2">
      <button className="btn btn-sm btn-ghost" title="Bold">
        <FontAwesomeIcon icon={fas.faBold} />
      </button>
      <button className="btn btn-sm btn-ghost" title="Italic">
        <FontAwesomeIcon icon={fas.faItalic} />
      </button>
      <button className="btn btn-sm btn-ghost" title="Underline">
        <FontAwesomeIcon icon={fas.faUnderline} />
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
        className="select select-sm select-bordered max-w-xs"
        title="Font Size"
      >
        <option>8</option>
        <option>10</option>
        <option>12</option>
        <option>14</option>
        <option>16</option>
      </select>
      <button className="btn btn-sm btn-ghost" title="Align Left">
        <FontAwesomeIcon icon={fas.faAlignLeft} />
      </button>
      <button className="btn btn-sm btn-ghost" title="Align Center">
        <FontAwesomeIcon icon={fas.faAlignCenter} />
      </button>
      <button className="btn btn-sm btn-ghost" title="Align Right">
        <FontAwesomeIcon icon={fas.faAlignRight} />
      </button>
    </div>
  );
}
