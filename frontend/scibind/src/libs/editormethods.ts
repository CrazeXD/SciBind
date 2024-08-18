export interface EditorMethods {
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  insertTable: () => void;
  insertImage: (url: string) => void;
  insertLink: (url: string) => void;
  alignLeft: () => void;
  alignCenter: () => void;
  alignRight: () => void;
  addColor: (color: string) => void;
  addHighlight: (color: string) => void;
  undoAction: () => void;
  redoAction: () => void;
}
