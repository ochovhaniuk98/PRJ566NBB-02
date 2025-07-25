import Image from '@tiptap/extension-image';

export const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      public_id: {
        default: null,
        parseHTML: element => element.getAttribute('public_id'),
        renderHTML: attributes => {
          return {
            public_id: attributes.public_id,
          };
        },
      },
    };
  },
});

export default BlogImage;
