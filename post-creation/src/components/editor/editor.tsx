"use client";
import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { $generateHtmlFromNodes } from "@lexical/html";
import type { EditorState, LexicalEditor } from "lexical";
import { Toolbar } from "@/components/editor/toolbar";
import { AutoEmbedPlugin } from "@/components/editor/auto-embed-plugin";
import { EmbedNode } from "@/components/editor/embed-node";
import { usePostStore } from "@/lib/post-store";

const theme = {
  paragraph: "mb-2 leading-relaxed",
  heading: {
    h1: "text-3xl font-bold mb-3 mt-4",
    h2: "text-2xl font-bold mb-2 mt-3",
    h3: "text-xl font-semibold mb-2 mt-2",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
  list: {
    ul: "list-disc pl-6",
    ol: "list-decimal pl-6",
  },
  link: "text-[var(--brand)] underline",
  quote: "border-l-4 border-[var(--border)] pl-3 italic text-[var(--muted-foreground)]",
};

function HydrateFromStorePlugin() {
  const [editor] = useLexicalComposerContext();
  const bodyJson = usePostStore.getState().bodyJson;
  useEffect(() => {
    if (bodyJson) {
      queueMicrotask(() => {
        try {
          const state = editor.parseEditorState(bodyJson);
          editor.setEditorState(state);
        } catch {
          // ignore stale state
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);
  return null;
}

export function Editor() {
  const setField = usePostStore((s) => s.setField);

  const onChange = (state: EditorState, editor: LexicalEditor) => {
    state.read(() => {
      const html = $generateHtmlFromNodes(editor, null);
      setField("bodyHtml", html);
      setField("bodyJson", JSON.stringify(state.toJSON()));
    });
  };

  return (
    <div className="rounded-md border border-[var(--border)] overflow-hidden">
      <LexicalComposer
        initialConfig={{
          namespace: "post",
          theme,
          onError: (e) => {
            console.error(e);
          },
          nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, EmbedNode],
        }}
      >
        <Toolbar />
        <div className="relative px-4 py-3 min-h-[260px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-[240px] prose-sm" />
            }
            placeholder={
              <div className="absolute left-4 top-3 text-[var(--muted-foreground)] pointer-events-none">
                Start writing your post...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
        <AutoEmbedPlugin />
        <HydrateFromStorePlugin />
      </LexicalComposer>
    </div>
  );
}
