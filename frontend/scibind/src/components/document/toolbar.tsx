import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ChromePicker } from "react-color";
import { ToolbarProp } from "@/libs/toolbarprop";

interface ToolbarProps {
  methods: ToolbarProp;
}

export default function Toolbar({ methods }: ToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const colorPickerRef = useRef(null);
  const highlightPickerRef = useRef(null);

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
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Insert Table"
        onClick={methods.onInsertTable}
      >
        <FontAwesomeIcon icon={fas.faTable} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Insert Image"
        onClick={() => methods.onInsertImage(prompt("Enter image URL:"))}
      >
        <FontAwesomeIcon icon={fas.faImage} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Insert Link"
        onClick={() => methods.onInsertLink(prompt("Enter link URL:"))}
      >
        <FontAwesomeIcon icon={fas.faLink} />
      </button>
      <div className="relative">
        <button
          className="btn btn-sm btn-ghost text-neutral-content"
          title="Text Color"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <FontAwesomeIcon icon={fas.faPalette} />
        </button>
        {showColorPicker && (
          <div ref={colorPickerRef} className="absolute z-10">
            <ChromePicker
              color="#000000"
              onChange={(color) => methods.onSetColor(color.hex)}
            />
          </div>
        )}
      </div>
      <div className="relative">
        <button
          className="btn btn-sm btn-ghost text-neutral-content"
          title="Highlight"
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
        >
          <FontAwesomeIcon icon={fas.faHighlighter} />
        </button>
        {showHighlightPicker && (
          <div ref={highlightPickerRef} className="absolute z-10">
            <ChromePicker
              color="#ffff00"
              onChange={(color) => methods.onSetHighlight(color.hex)}
            />
          </div>
        )}
      </div>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Undo"
        onClick={methods.onUndo}
      >
        <FontAwesomeIcon icon={fas.faUndo} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Redo"
        onClick={methods.onRedo}
      >
        <FontAwesomeIcon icon={fas.faRedo} />
      </button>
    </div>
  );
}