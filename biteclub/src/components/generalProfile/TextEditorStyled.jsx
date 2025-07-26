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

  // Image tracking setup
  const [currentImageIds, setCurrentImageIds] = useState(editBlogPost && blogPostData ? blogPostData.images || [] : []);
  const [newImageIds, setNewImageIds] = useState([]);

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

  // Handle image uploads during the session
  const handleImageUpload = public_id => {
    if (!public_id || newImageIds.find(id => id === public_id)) return;
    setNewImageIds(prev => [...prev, public_id]);
  };

  const handlePublish = async () => {
    if (!content || !title) return;

    // Extract all images used in final content
    const finalImagePublicIds = new Set();
    const walkContent = node => {
      if (node.type === 'image' && node.attrs && node.attrs.public_id) {
        finalImagePublicIds.add(node.attrs.public_id);
      }
      if (node.content) {
        node.content.forEach(childNode => walkContent(childNode));
      }
    };
    walkContent(content);

    // Combine all images tracked (existing + new)
    const trackedImageIds = [...currentImageIds, ...newImageIds];

    // Find images to delete (tracked but NOT in final content)
    const imagesToDelete = trackedImageIds.filter(id => !finalImagePublicIds.has(id));

    // Delete images NOT used in final content
    if (imagesToDelete.length > 0) {
      try {
        const response = await fetch('/api/images', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: imagesToDelete,
            type: 'blog-image',
          }),
        });
        if (response.ok) {
          console.log('Unused images deleted successfully');
        } else {
          console.error('Failed to delete unused images');
        }
      } catch (error) {
        console.error('Error deleting unused images:', error);
      }
    }

    // Send blog post data to server (create or edit)
    try {
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
          images: [...finalImagePublicIds], // Use only images present in final content
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

      setStatusType('success');
      setStatusMessage(editBlogPost ? 'Blog post updated successfully!' : 'Blog post created successfully!');

      setTitle(null);
      setContent(null);
      setNewImageIds([]);

      if (!editBlogPost) {
        setCurrentImageIds([]);
      } else {
        setCurrentImageIds(data.blogPost.images || []);
      }
    } catch (error) {
      console.error('Error publishing blog post:', error);
      setStatusType('error');
      setStatusMessage('Error publishing blog post');
    }

    // Hide editor after delay
    setTimeout(() => {
      setStatusMessage('');
      setStatusType('');
      setShowTextEditor(false);
    }, 2000);
  };

  const handleCancel = async () => {
    // Delete only new images uploaded during this session
    if (newImageIds.length > 0) {
      try {
        const response = await fetch('/api/images/', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: newImageIds,
            type: 'blog-image',
          }),
        });

        if (response.ok) {
          console.log('New images uploaded in this session deleted successfully');
        } else {
          console.error('Failed to delete new images');
        }
      } catch (error) {
        console.error('Error deleting new images:', error);
      }
    }
    // Clear editor and close
    setTitle(null);
    setContent(null);
    setCurrentImageIds([]);
    setNewImageIds([]);
    setShowTextEditor(false);
  };

  return (
    <>
      <div className=" pt-0 text-center">
        <div className="flex gap-2 justify-end fixed bottom-5 right-25">
          <Button onClick={handlePublish} type="submit" className="w-30" variant="default">
            Publish
          </Button>
          <Button type="button" className="w-30" variant="secondary" onClick={handleCancel}>
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
          <SimpleEditor onContentChange={setContent} onImageUpload={handleImageUpload} content={content} />
        </div>
      </div>
    </>
  );
}
