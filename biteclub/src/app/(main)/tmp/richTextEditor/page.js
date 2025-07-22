// Displays TipTap Simple Rich Text Editor
// Reference: https://tiptap.dev/docs/ui-components/templates/simple-editor
'use client';
import { SimpleEditor } from '@/components/tiptap-rich-text-editor/tiptap-templates/simple/simple-editor';
import { useState, useEffect } from 'react';

// import { createClient } from '@/lib/auth/client'; //to get user
import { useUser } from '@/context/UserContext';

import ReadOnlyEditor from '@/components/tiptap-rich-text-editor/ReadOnlyEditor';

export default function Page() {
  const [editorContent, setEditorContent] = useState(null);

  // to get user
  // const [user, setUser] = useState(null);
  const { user } = useUser();
  // const supabase = createClient();

  const [displayPost, setPost] = useState(null);

  // Get User
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data } = await supabase.auth.getUser();
  //     if (!data?.user) return;

  //     setUser(data.user);
  //     console.log('User: ', data?.user);
  //   };
  //   fetchData();
  // }, [supabase]);

  // Save the content
  const handleSave = async () => {
    console.log('Content', editorContent);
    console.log('User: ', user);

    setPost(editorContent);

    // const res = await fetch('/api/blogs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content: editorContent }),
    // });

    // if (res.ok) {
    //   alert('Saved!');
    // } else {
    //   alert('Failed to save');
    // }
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
