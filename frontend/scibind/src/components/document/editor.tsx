import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { EditorMethods } from "@/libs/editormethods";

const PAGE_HEIGHT = 1056; // A4 height in pixels at 96 DPI
const PAGE_WIDTH = 816; // A4 width in pixels at 96 DPI

interface EditorProps {
  onEditorReady: (methods: EditorMethods) => void;
  initialContent: string;
  onEditorUpdate: (content: string) => void;
}

export default function Editor({
  onEditorReady,
  initialContent,
  onEditorUpdate,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: "<h1>Start typing your document here...</h1>",
    editorProps: {
      attributes: {
        class:
          "w-full p-8 bg-base-100 rounded shadow-md border border-gray-300 outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl",
        style: `min-height: ${PAGE_HEIGHT}px; color: black;`,
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onEditorUpdate(JSON.stringify(json));
    },
  });

  useEffect(() => {
    if (editor) {
      const methods: EditorMethods = {
        toggleBold: () => editor.chain().focus().toggleBold().run(),
        toggleItalic: () => editor.chain().focus().toggleItalic().run(),
        toggleUnderline: () => editor.chain().focus().toggleUnderline().run(),
        insertTable: () =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run(),
        insertImage: (url: string) =>
          editor.chain().focus().setImage({ src: url }).run(),
        insertLink: (url: string) =>
          editor.chain().focus().setLink({ href: url }).run(),
        alignLeft: () => editor.chain().focus().setTextAlign("left").run(),
        alignCenter: () => editor.chain().focus().setTextAlign("center").run(),
        alignRight: () => editor.chain().focus().setTextAlign("right").run(),
        addColor: (color: string) =>
          editor.chain().focus().setColor(color).run(),
        addHighlight: (color: string | null) => {
          if (color === null) {
            editor.chain().focus().unsetHighlight().run();
          } else {
            editor.chain().focus().setHighlight({ color }).run();
          }
        },
        undoAction: () => editor.chain().focus().undo().run(),
        redoAction: () => editor.chain().focus().redo().run(),
      };
      onEditorReady(methods);
    }
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (editor && initialContent) {
      try {
        editor.commands.setContent(JSON.parse(initialContent));
      } catch (error) {
        editor.commands.setContent("<p></p>");
      }
    }
  }, [editor, initialContent]);

  return (
    <div className="flex-grow bg-base-200 p-4 overflow-auto">
      <div className="w-full max-w-[816px] mx-auto">
        {editor && <EditorContent editor={editor} />}
      </div>
      <style jsx>{`
        .ProseMirror {
          min-height: ${PAGE_HEIGHT}px;
          width: ${PAGE_WIDTH}px;
          padding: 40px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          background-color: white;
        }
      `}</style>
    </div>
  );
}
