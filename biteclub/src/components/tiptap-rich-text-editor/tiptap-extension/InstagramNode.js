'use client';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import InstagramEmbed from '@/components/tiptap-rich-text-editor/InstagramEmbed';
import { NodeViewWrapper } from '@tiptap/react';

// used for Instagram Embed in Blog Post

const InstagramNodeComponent = ({ node }) => {
  const url = node.attrs.url;

  return (
    <NodeViewWrapper as="div" className="my-4">
      <InstagramEmbed postUrl={url} />
    </NodeViewWrapper>
  );
};

export const InstagramNode = Node.create({
  name: 'instagram',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      url: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-instagram-url]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-instagram-url': HTMLAttributes.url,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InstagramNodeComponent);
  },
});

export default InstagramNodeComponent;
