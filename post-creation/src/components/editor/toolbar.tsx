"use client";
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  type ElementFormatType,
} from "lexical";
import { mergeRegister, $findMatchingParent } from "@lexical/utils";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Redo,
  Underline,
  Undo,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type BlockType = "paragraph" | "h1" | "h2" | "h3" | "quote";

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Normal",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  quote: "Quote",
};

const ToolbarButton = ({
  active,
  disabled,
  onClick,
  children,
  ariaLabel,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "h-8 w-8 inline-flex items-center justify-center rounded hover:bg-[var(--accent)] text-[var(--foreground)] disabled:opacity-40",
      active && "bg-[var(--accent)]"
    )}
  >
    {children}
  </button>
);

const Sep = () => <div className="w-px self-stretch bg-[var(--border)] mx-1" />;

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const sel = $getSelection();
          if (!$isRangeSelection(sel)) return;

          setBold(sel.hasFormat("bold"));
          setItalic(sel.hasFormat("italic"));
          setUnderline(sel.hasFormat("underline"));

          const anchorNode = sel.anchor.getNode();
          const block =
            anchorNode.getKey() === "root"
              ? anchorNode
              : $findMatchingParent(
                  anchorNode,
                  (n) => n.getParent()?.getKey() === "root"
                ) ?? anchorNode.getTopLevelElementOrThrow();

          if ($isHeadingNode(block)) {
            setBlockType(block.getTag() as BlockType);
          } else if ($isQuoteNode(block)) {
            setBlockType("quote");
          } else {
            setBlockType("paragraph");
          }
        });
      }),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => false, 1),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (v) => {
          setCanUndo(v);
          return false;
        },
        1
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (v) => {
          setCanRedo(v);
          return false;
        },
        1
      )
    );
  }, [editor]);

  const align = (a: ElementFormatType) =>
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, a);

  const setBlock = (next: BlockType) => {
    editor.update(() => {
      const sel = $getSelection();
      if (!$isRangeSelection(sel)) return;
      if (next === "paragraph") {
        $setBlocksType(sel, () => $createParagraphNode());
      } else if (next === "quote") {
        $setBlocksType(sel, () => $createQuoteNode());
      } else {
        $setBlocksType(sel, () =>
          $createHeadingNode(next as HeadingTagType)
        );
      }
    });
  };

  return (
    <div className="flex items-center gap-1 border-b border-[var(--border)] bg-[var(--secondary)] px-2 py-1">
      <Select
        value={blockType}
        onValueChange={(v) => setBlock(v as BlockType)}
      >
        <SelectTrigger
          className="h-8 w-32 border-transparent bg-transparent shadow-none focus:ring-0"
          onMouseDown={(e) => e.preventDefault()}
        >
          <SelectValue>{BLOCK_LABELS[blockType]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Normal</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="quote">Quote</SelectItem>
        </SelectContent>
      </Select>
      <Sep />
      <ToolbarButton
        ariaLabel="Undo"
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Undo className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Redo"
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Redo className="size-4" />
      </ToolbarButton>
      <Sep />
      <ToolbarButton
        ariaLabel="Bold"
        active={bold}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Italic"
        active={italic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Underline"
        active={underline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <Underline className="size-4" />
      </ToolbarButton>
      <Sep />
      <ToolbarButton ariaLabel="Align left" onClick={() => align("left")}>
        <AlignLeft className="size-4" />
      </ToolbarButton>
      <ToolbarButton ariaLabel="Align center" onClick={() => align("center")}>
        <AlignCenter className="size-4" />
      </ToolbarButton>
      <ToolbarButton ariaLabel="Align right" onClick={() => align("right")}>
        <AlignRight className="size-4" />
      </ToolbarButton>
      <ToolbarButton ariaLabel="Justify" onClick={() => align("justify")}>
        <AlignJustify className="size-4" />
      </ToolbarButton>
    </div>
  );
}
