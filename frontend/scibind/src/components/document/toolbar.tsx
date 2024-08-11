// components/Toolbar.tsx
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ChromePicker } from "react-color";
import { ToolbarProp } from "@/libs/toolbarprop";

interface ToolbarProps {
  methods: ToolbarProp;
}

export default function Toolbar({ methods }: ToolbarProps) {

  return (
    <div className="bg-neutral p-2 flex items-center space-x-2 shadow-sm">
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Bold"
        onClick={methods.onBold}
      >
        <FontAwesomeIcon icon={fas.faBold} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Italic"
        onClick={methods.onItalic}
      >
        <FontAwesomeIcon icon={fas.faItalic} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Underline"
        onClick={methods.onUnderline}
      >
        <FontAwesomeIcon icon={fas.faUnderline} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Align Left"
        onClick={methods.onAlignLeft}
      >
        <FontAwesomeIcon icon={fas.faAlignLeft} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Align Center"
        onClick={methods.onAlignCenter}
      >
        <FontAwesomeIcon icon={fas.faAlignCenter} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Align Right"
        onClick={methods.onAlignRight}
      >
        <FontAwesomeIcon icon={fas.faAlignRight} />
      </button>
    </div>
  );
}
