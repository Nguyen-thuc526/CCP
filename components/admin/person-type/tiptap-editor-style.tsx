"use client"

// Global styles for Tiptap editor
export const tiptapStyles = `
  .ProseMirror {
    outline: none;
    padding: 1rem;
    min-height: 200px;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  .ProseMirror h1 {
    font-size: 1.875rem;
    font-weight: 700;
    line-height: 2.25rem;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .ProseMirror h2 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2rem;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .ProseMirror h3 {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.75rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .ProseMirror ul, .ProseMirror ol {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }

  .ProseMirror li {
    margin: 0.25rem 0;
  }

  .ProseMirror blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    color: #6b7280;
  }

  .ProseMirror strong {
    font-weight: 700;
  }

  .ProseMirror em {
    font-style: italic;
  }

  .ProseMirror u {
    text-decoration: underline;
  }

  .ProseMirror s {
    text-decoration: line-through;
  }

  .ProseMirror a {
    color: #3b82f6;
    text-decoration: underline;
    cursor: pointer;
  }

  .ProseMirror a:hover {
    color: #1d4ed8;
  }

  .ProseMirror code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.875rem;
  }

  .ProseMirror pre {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  .ProseMirror pre code {
    background-color: transparent;
    padding: 0;
  }
`
