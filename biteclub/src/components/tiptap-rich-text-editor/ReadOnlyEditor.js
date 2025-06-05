// components/tiptap-rich-text-editor/tmp/ReadOnlyEditor.js
// used to display blog post
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Underline } from '@tiptap/extension-underline';

// --- Custom Extensions ---
import { Link } from '@/components/tiptap-rich-text-editor/tiptap-extension/link-extension';
import { Selection } from '@/components/tiptap-rich-text-editor/tiptap-extension/selection-extension';
import { TrailingNode } from '@/components/tiptap-rich-text-editor/tiptap-extension/trailing-node-extension';

// --- Tiptap Node ---
import { ImageUploadNode } from '@/components/tiptap-rich-text-editor/tiptap-node/image-upload-node/image-upload-node-extension';
import '@/components/tiptap-rich-text-editor/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-rich-text-editor/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap-rich-text-editor/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap-rich-text-editor/tiptap-node/paragraph-node/paragraph-node.scss';

// Instagram
import { InstagramNode } from './tiptap-extension/InstagramNode';

// Restaurant Mentions
import { RestaurantMention } from './tiptap-node/restaurant-mention-node/RestaurantMention';

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils';

// --- Styles ---
import '@/components/tiptap-rich-text-editor/tiptap-templates/simple/simple-editor.scss';

export default function ReadOnlyEditor({ content }) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      InstagramNode,
      RestaurantMention,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,

      Selection,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: error => console.error('Upload failed:', error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    content,
  });

  return (
    // <div className="content-wrapper">
    <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
    // </div>
  );
}
