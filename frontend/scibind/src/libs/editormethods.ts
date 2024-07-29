export interface EditorMethods {
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  toggleHighlight: (color: string) => void;
  insertTable: () => void;
  insertImage: (url: string) => void;
  insertLink: (url: string) => void;
  alignLeft: () => void;
  alignCenter: () => void;
  alignRight: () => void;
}
