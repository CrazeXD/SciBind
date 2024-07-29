export type ToolbarProp = {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onHighlight: (color: string) => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
};
