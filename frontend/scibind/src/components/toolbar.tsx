// components/Toolbar.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { BlockPicker, ColorResult } from "react-color";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { ToolbarProp } from "@/libs/toolbarprop";

interface ToolbarProps {
  methods: ToolbarProp;
}

export default function Toolbar({ methods }: ToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [highlightColor, setHighlightColor] = useState("#ffff00"); // Default yellow
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const highlightButtonRef = useRef<HTMLButtonElement>(null);

  const handleHighlightClick = () => {
    setShowColorPicker((prev) => !prev);
  };

  const handleColorChange = useCallback(
    (color: ColorResult) => {
      setHighlightColor(color.hex);
      methods.onHighlight(color.hex);
    },
    [methods]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target as Node) &&
      highlightButtonRef.current &&
      !highlightButtonRef.current.contains(event.target as Node)
    ) {
      setShowColorPicker(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const {
    onBold,
    onItalic,
    onUnderline,
    onAlignLeft,
    onAlignCenter,
    onAlignRight,
  } = methods;

  const presetColors = [
    "#D0021B",
    "#F5A623",
    "#F8E71C",
    "#8B572A",
    "#7ED321",
    "#417505",
    "#BD10E0",
    "#9013FE",
    "#4A90E2",
    "#50E3C2",
    "#B8E986",
    "#000000",
    "#4A4A4A",
    "#9B9B9B",
    "#FFFFFF",
  ];

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
      <button
        ref={highlightButtonRef}
        className="btn btn-sm btn-ghost text-neutral-content"
        title="Highlight"
        id="highlight"
        onClick={handleHighlightClick}
        style={{ color: highlightColor }}
      >
        <FontAwesomeIcon icon={fas.faHighlighter} />
      </button>
      { // TODO: Custom color picker component
      showColorPicker && (
        <div
          ref={colorPickerRef}
          className="absolute z-10 top-full left-20 mt-2"
        >
          <BlockPicker
            color={highlightColor}
            onChangeComplete={handleColorChange}
            colors={presetColors}
          />
        </div>
      )}
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
