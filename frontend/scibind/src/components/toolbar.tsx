// components/Toolbar.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { ToolbarProp } from "@/libs/toolbarprop";

interface ToolbarProps {
  methods: ToolbarProp;
}

export default function Toolbar({ methods }: ToolbarProps) {
  const {
    onBold,
    onItalic,
    onUnderline,
    onAlignLeft,
    onAlignCenter,
    onAlignRight,
  } = methods;
  return (
    <div className="bg-neutral p-2 flex items-center space-x-2 shadow-sm">
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Bold"
        onClick={onBold}
      >
        <FontAwesomeIcon icon={fas.faBold} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Italic"
        onClick={onItalic}
      >
        <FontAwesomeIcon icon={fas.faItalic} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Underline"
        onClick={onUnderline}
      >
        <FontAwesomeIcon icon={fas.faUnderline} />
      </button>
      <select
        className="select select-sm select-bordered w-full max-w-xs bg-base-100 text-neutral-content"
        title="Font"
      >
        <option>Arial</option>
        <option>Times New Roman</option>
        <option>Calibri</option>
      </select>
      <select
        className="select select-sm select-bordered max-w-xs bg-base-100 text-neutral-content"
        title="Font Size"
      >
        <option>8</option>
        <option>10</option>
        <option>12</option>
        <option>14</option>
        <option>16</option>
      </select>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Align Left"
        onClick={onAlignLeft}
      >
        <FontAwesomeIcon icon={fas.faAlignLeft} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Align Center"
        onClick={onAlignCenter}
      >
        <FontAwesomeIcon icon={fas.faAlignCenter} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Align Right"
        onClick={onAlignRight}
      >
        <FontAwesomeIcon icon={fas.faAlignRight} />
      </button>
    </div>
  );
}
