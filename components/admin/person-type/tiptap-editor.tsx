'use client';

import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import {
   Bold,
   Italic,
   UnderlineIcon,
   Strikethrough,
   List,
   ListOrdered,
   Quote,
   Undo,
   Redo,
   AlignLeft,
   AlignCenter,
   AlignRight,
   LinkIcon,
   Unlink,
} from 'lucide-react';
import { tiptapStyles } from './tiptap-editor-style';

interface TiptapEditorProps {
   content: string;
   onChange: (html: string) => void;
   placeholder?: string;
}

export function TiptapEditor({
   content,
   onChange,
   placeholder = 'Bắt đầu viết...',
}: TiptapEditorProps) {
   const editor = useEditor({
      extensions: [
         StarterKit, // Dùng mặc định, không tắt bulletList, orderedList, listItem
         Underline,
         Link.configure({
            openOnClick: false,
            HTMLAttributes: {
               class: 'text-blue-500 underline cursor-pointer',
            },
         }),
         TextAlign.configure({
            types: ['heading', 'paragraph'],
         }),
      ],
      content,
      editorProps: {
         attributes: {
            class:
               'ProseMirror min-h-[200px] p-4 border rounded-md focus:outline-none',
         },
      },
   });

   // Hàm custom để loại bỏ <p> trong <li> khi xuất HTML
   const cleanListHtml = useCallback((html: string) => {
      if (!html) return '';

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Duyệt tất cả <li>
      const listItems = doc.querySelectorAll('li');

      listItems.forEach((li) => {
         // Nếu li chỉ có 1 child là <p>, thay thế li innerHTML bằng p.innerHTML
         if (
            li.childElementCount === 1 &&
            li.firstElementChild?.tagName.toLowerCase() === 'p'
         ) {
            li.innerHTML = li.firstElementChild.innerHTML;
         }
      });

      return doc.body.innerHTML;
   }, []);

   useEffect(() => {
      if (editor && content !== editor.getHTML()) {
         editor.commands.setContent(content);
      }
   }, [content, editor]);

   // Khi nội dung thay đổi, lọc bỏ p trong li rồi gọi onChange
   useEffect(() => {
      if (!editor) return;

      const handleUpdate = () => {
         const rawHtml = editor.getHTML();
         const cleanHtml = cleanListHtml(rawHtml);
         onChange(cleanHtml);
      };

      editor.on('update', handleUpdate);
      return () => {
         editor.off('update', handleUpdate);
      };
   }, [editor, onChange, cleanListHtml]);

   const setLink = useCallback(() => {
      if (!editor) return;

      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);

      if (url === null) return;

      if (url === '') {
         editor.chain().focus().extendMarkRange('link').unsetLink().run();
         return;
      }

      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
   }, [editor]);

   if (!editor) return null;

   return (
      <>
         {/* Inject global CSS styles for Tiptap */}
         <style>{tiptapStyles}</style>

         <div className="border rounded-lg">
            {/* Toolbar */}
            <div className="border-b p-2 flex flex-wrap items-center gap-1">
               {/* Text Formatting */}
               <Button
                  variant={editor.isActive('bold') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
               >
                  <Bold className="h-4 w-4" />
               </Button>
               <Button
                  variant={editor.isActive('italic') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
               >
                  <Italic className="h-4 w-4" />
               </Button>
               <Button
                  variant={editor.isActive('underline') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  disabled={!editor.can().chain().focus().toggleUnderline().run()}
               >
                  <UnderlineIcon className="h-4 w-4" />
               </Button>
               <Button
                  variant={editor.isActive('strike') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  disabled={!editor.can().chain().focus().toggleStrike().run()}
               >
                  <Strikethrough className="h-4 w-4" />
               </Button>

               <Separator orientation="vertical" className="h-6" />

               {/* Lists */}
               <Button
                  variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
               >
                  <List className="h-4 w-4" />
               </Button>
               <Button
                  variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
               >
                  <ListOrdered className="h-4 w-4" />
               </Button>
               <Button
                  variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
               >
                  <Quote className="h-4 w-4" />
               </Button>

               <Separator orientation="vertical" className="h-6" />

               {/* Text Alignment */}
               <Button
                  variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
               >
                  <AlignLeft className="h-4 w-4" />
               </Button>
               <Button
                  variant={
                     editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'
                  }
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
               >
                  <AlignCenter className="h-4 w-4" />
               </Button>
               <Button
                  variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
               >
                  <AlignRight className="h-4 w-4" />
               </Button>

               <Separator orientation="vertical" className="h-6" />

               {/* Links */}
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={setLink}
                  className={editor.isActive('link') ? 'bg-gray-200' : ''}
               >
                  <LinkIcon className="h-4 w-4" />
               </Button>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  disabled={!editor.isActive('link')}
               >
                  <Unlink className="h-4 w-4" />
               </Button>

               <Separator orientation="vertical" className="h-6" />

               {/* Undo/Redo */}
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().chain().focus().undo().run()}
               >
                  <Undo className="h-4 w-4" />
               </Button>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().chain().focus().redo().run()}
               >
                  <Redo className="h-4 w-4" />
               </Button>
            </div>

            {/* Editor Content */}
            <EditorContent
               editor={editor}
               className="min-h-[200px] max-h-[400px] overflow-y-auto"
               placeholder={placeholder}
            />
         </div>
      </>
   );
}
