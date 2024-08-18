import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import CustomColorPicker from "@/components/document/ColorPicker";
import { ToolbarProp } from "@/libs/toolbarprop";

interface ToolbarProps {
  methods: ToolbarProp;
}

export default function Toolbar({ methods }: ToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const highlightPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
      if (
        highlightPickerRef.current &&
        !highlightPickerRef.current.contains(event.target as Node)
      ) {
        setShowHighlightPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTextColorChange = (color: { hex: string }) => {
    setTextColor(color.hex);
    methods.onSetColor(color.hex);
  };

  const handleHighlightColorChange = (color: { hex: string }) => {
    setHighlightColor(color.hex);
    methods.onSetHighlight(color.hex);
  };

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
        onClick={() => {
          const imageUrl = prompt("Enter image URL:");
          if (imageUrl !== null) {
            methods.onInsertImage(imageUrl);
          }
        }}
      >
        <FontAwesomeIcon icon={fas.faImage} />
      </button>
      <button
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Insert Link"
        onClick={() => {
          const linkUrl = prompt("Enter link URL:");
          if (linkUrl !== null) {
            methods.onInsertLink(linkUrl);
          }
        }}
      >
        <FontAwesomeIcon icon={fas.faLink} />
      </button>
      <CustomColorPicker
        onColorChange={methods.onSetColor}
        initialColor="#000000"
        title="Text Color"
        icon={<FontAwesomeIcon icon={fas.faPalette} />}
        showClearHighlight={false}
      />

      <CustomColorPicker
        onColorChange={(color) => methods.onSetHighlight(color)}
        initialColor="transparent"
        title="Highlight Color"
        icon={<FontAwesomeIcon icon={fas.faHighlighter} />}
      />
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
