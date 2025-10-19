import { createEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { TextNode, RootNode } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { editorTheme } from "@/components/editor/themes/editor-theme"
import DOMPurify from "isomorphic-dompurify";

const editor = createEditor({
  namespace: "OnlyNotesViewer",
  editable: false,
  theme: editorTheme,
  nodes: [
    RootNode,
    TextNode,
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
  ],
});

/**
 * createNoteHTML safely converts Lexical serialized editor JS state into HTML.
 */
export function createNoteHTML(serializedState: any): string {
  const editorState = editor.parseEditorState(serializedState);
  editor.setEditorState(editorState);

  let html = "";
  editor.update(() => {
    html = $generateHtmlFromNodes(editor);
  });
  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
  return cleanHtml;
}
