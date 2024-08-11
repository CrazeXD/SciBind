import { useEffect, useState } from "react";
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
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { WebsocketProvider } from "y-websocket";
import { EditorMethods } from "@/libs/editormethods";
import * as Y from "yjs";

const PAGE_HEIGHT = 1056; // A4 height in pixels at 96 DPI
const PAGE_WIDTH = 816; // A4 width in pixels at 96 DPI

interface EditorProps {
  slug: string;
  onEditorReady: (methods: EditorMethods) => void;
}

export default function Editor({ slug, onEditorReady }: EditorProps) {
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      `ws://${window.location.host}/ws/${slug}/`,
      slug,
      doc
    );
    setYdoc(doc);
    setProvider(wsProvider);
    return () => {
      wsProvider.destroy();
      doc.destroy();
    };
  }, [slug]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false,
        }),      
        Typography,
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
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
        ...(ydoc && provider
          ? [
              Collaboration.configure({
                document: ydoc,
              }),
              CollaborationCursor.configure({
                provider: provider,
              }),
            ]
          : []),
      ],
      content: "<p>Start typing your document here...</p>",
      editorProps: {
        attributes: {
          class:
            "w-full p-8 bg-base-100 rounded shadow-md border border-gray-300 outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl",
          style: `min-height: ${PAGE_HEIGHT}px; color: black;`,
        },
      },
      onUpdate: ({ editor }) => {
        // Save content logic here
      },
    },
    [ydoc, provider]
  );

  useEffect(() => {
    if (editor) {
      const methods: EditorMethods = {
        toggleBold: () => editor.chain().focus().toggleBold().run(),
        toggleItalic: () => editor.chain().focus().toggleItalic().run(),
        toggleUnderline: () => editor.chain().focus().toggleUnderline().run(),
        insertTable: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
        insertImage: (url: string) => editor.chain().focus().setImage({ src: url }).run(),
        insertLink: (url: string) => editor.chain().focus().setLink({ href: url }).run(),
        alignLeft: () => editor.chain().focus().setTextAlign("left").run(),
        alignCenter: () => editor.chain().focus().setTextAlign("center").run(),
        alignRight: () => editor.chain().focus().setTextAlign("right").run(),
      };
      onEditorReady(methods);
    }
  }, [editor, onEditorReady]);

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