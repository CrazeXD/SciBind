import React, { useState, useRef, useEffect } from "react";

interface CustomColorPickerProps {
  onColorChange: (color: string | null) => void;
  initialColor: string;
  title: string;
  icon: React.ReactNode;
  showClearHighlight?: boolean;
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({
  onColorChange,
  initialColor,
  title,
  icon,
  showClearHighlight = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [customColor, setCustomColor] = useState(initialColor);
  const pickerRef = useRef<HTMLDivElement>(null);

  const colors = [
    "#000000",
    "#808080",
    "#C0C0C0",
    "#FFFFFF",
    "#FF0000",
    "#800000",
    "#FFFF00",
    "#808000",
    "#00FF00",
    "#008000",
    "#00FFFF",
    "#008080",
    "#0000FF",
    "#000080",
    "#FF00FF",
    "#800080",
  ];

  useEffect(() => {
    // sourcery skip: avoid-function-declarations-in-blocks
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorChange = (color: string | null) => {
    if (color === null) {
      setCurrentColor("transparent");
      setCustomColor("");
      onColorChange(null);
    } else {
      setCurrentColor(color);
      setCustomColor(color);
      onColorChange(color);
    }
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };

  const handleCustomColorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleColorChange(customColor);
  };

  const clearHighlight = () => {
    handleColorChange("transparent");
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        className="btn btn-sm btn-ghost text-neutral-content flex items-center"
        title={title}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className="w-4 h-4 rounded-full mr-2"
          style={{
            backgroundColor:
              currentColor === "transparent" ? "transparent" : currentColor,
            border: currentColor === "transparent" ? "1px solid #ccc" : "none",
          }}
        ></span>
        {icon}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 p-4 bg-white shadow-lg rounded">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {colors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
          <form
            onSubmit={handleCustomColorSubmit}
            className="flex items-center mb-2"
          >
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-8 h-8 p-0 border-0"
              style={{ backgroundColor: "white", borderColor: "transparent" }}
            />
            <input
              type="text"
              value={customColor}
              onChange={handleCustomColorChange}
              className="flex-grow ml-2 px-2 py-1 border rounded background-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              placeholder="Enter hex color"
              style={{ backgroundColor: "white" }}
            />
            <button
              type="submit"
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply
            </button>
          </form>
          {showClearHighlight && (
          <button
            onClick={clearHighlight}
            className="w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Clear Highlight
          </button>
          )
          }
        </div>
      )}
    </div>
  );
};

export default CustomColorPicker;
