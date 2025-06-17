import { Button } from '../shared/Button';
import { SimpleEditor } from '../tiptap-rich-text-editor/tiptap-templates/simple/simple-editor';
import { Input } from '../shared/Input';
import { Label } from '../shared/Label';

import { useState, useEffect } from 'react';

export default function TextEditorStyled({
  setShowTextEditor,
  generalUserId,
  editBlogPost = false,
  blogPostData = null, // ADDED
}) {
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState(null);

  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  // useEffect(() => {
  //   // ADDEd
  //   if (editBlogPost && blogPostData) {
  //     setTitle(blogPostData.previewTitle || '');
  //     // setContent(blogPostData.previewText || '');
  //      setContent(blogPostData.content || blogPostData.previewText || '');
  //   }
  // }, [editBlogPost, blogPostData]);

  useEffect(() => {
  if (editBlogPost && blogPostData) {
    setTitle(blogPostData.previewTitle || '');

    const fullContent = blogPostData.body || blogPostData.content;

    if (fullContent && typeof fullContent === 'object' && fullContent.type === 'doc') {
      setContent(fullContent); // ✅ loads the real Tiptap JSON with images
    } else {
      setContent(null); // fallback (still safe)
    }
  }
}, [editBlogPost, blogPostData]);


  const handlePublish = async () => {
    if (!content || !title) return;

    // get title and content
    // create a blog post
    try {
      // const response = await fetch(`/api/blog-posts/create-post/${generalUserId}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title,
      //     content,
      //   }),
      // });
      console.log('blogPostData._id', blogPostData._id);
      const url = editBlogPost
        ? `/api/blog-posts/update-post/${blogPostData._id}` // blogPostData must contain `_id`
        : `/api/blog-posts/create-post/${generalUserId}`;

      const method = editBlogPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      // ---------------------------------------

      if (!response.ok) {
        const errorData = await response.json();
        setStatusType('error');
        setStatusMessage('Something went wrong! Post was not created');
        console.error('Failed to create a post:', errorData.error);
        return;
      }

      const data = await response.json();

      // setStatusType('success');
      // setStatusMessage('Blog post created successfully!');
      setStatusType('success');
      setStatusMessage(editBlogPost ? 'Blog post updated successfully!' : 'Blog post created successfully!');
      // ADDED
      if (!editBlogPost) {
        setTitle(null);
        setContent(null);
      }

      // ADDED
      if (!editBlogPost) {
        setTitle(null);
        setContent(null);
      }

      setTitle(null);
      setContent(null);

      console.log('Blog post created:', data.blogPost);
    } catch (error) {
      console.error('Error publishing blog post:', error);
    }

    // clear after 3 seconds
    setTimeout(() => {
      setStatusMessage('');
      setStatusType('');
      setShowTextEditor(false);
    }, 4000);
  };

  return (
    <>
      <div className=" pt-0 text-center">
        <div className="flex gap-2 justify-end fixed bottom-5 right-25">
          <Button onClick={handlePublish} type="submit" className="w-30" variant="default">
            Publish
          </Button>
          <Button type="button" className="w-30" variant="secondary" onClick={() => setShowTextEditor(false)}>
            Cancel
          </Button>
        </div>
        <h6
          className={`mb-2 ${
            statusType === 'success' ? 'text-green-700' : statusType === 'error' ? 'text-red-700' : ''
          }`}
        >
          {statusMessage}
        </h6>
        {/* Display caption depending on wether blog post is being added OR edited */}
        <h3>{editBlogPost ? 'EDIT BLOG POST' : 'WRITE A BLOG POST'}</h3>
        <div className=" flex gap-2 items-center justify-center mb-2">
          <Label>Title</Label>
          {/* <Input type="text" className={'w-[50%]'} onChange={e => setTitle(e.target.value)} /> */}
          <Input type="text" className="w-[50%]" value={title || ''} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className=" w-full h-700 border border-brand-yellow-lite">
          {/* <SimpleEditor onContentChange={setContent} /> */}
          <SimpleEditor onContentChange={setContent} content={content} />
        </div>
      </div>
    </>
  );
}
