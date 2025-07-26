// Displays TipTap Simple Rich Text Editor
// Reference: https://tiptap.dev/docs/ui-components/templates/simple-editor
'use client';
import { SimpleEditor } from '@/components/tiptap-rich-text-editor/tiptap-templates/simple/simple-editor';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import ReadOnlyEditor from '@/components/tiptap-rich-text-editor/ReadOnlyEditor';

export default function Page() {
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info

  const [editorContent, setEditorContent] = useState(null);
  const [displayPost, setPost] = useState(null);

  // Save the content
  const handleSave = async () => {
    console.log('Content', editorContent);
    console.log('User: ', user);

    setPost(editorContent);
  };

  return (
    <div className="h-screen overflow-y-auto w-full mt-50">
      <button onClick={handleSave} className="mt-30 mb-20 ml-20 bg-blue-600 text-white py-2 px-4 rounded">
        Save to MongoDB
      </button>

      {/* Call ReadOnlyEditor to display the Blog Post Content */}
      {displayPost && <ReadOnlyEditor content={editorContent} />}

      <SimpleEditor onContentChange={setEditorContent} />
    </div>
  );
}
