export interface ToolbarProp {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onInsertTable: () => void;
  onInsertImage: (url: string) => void;
  onInsertLink: (url: string) => void;
  onSetColor: (color: string | null) => void;
  onSetHighlight: (color: string | null) => void;
  onUndo: () => void;
  onRedo: () => void;
}
