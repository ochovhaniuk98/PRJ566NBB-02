'use client';

import * as React from 'react';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';

// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit';
// import { Image } from '@tiptap/extension-image'; // Removed as we are using custom BlogImage extension
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
import { BlogImage } from '@/components/tiptap-rich-text-editor/tiptap-extension/image-extension';

// --- UI Primitives ---
import { Button } from '@/components/tiptap-rich-text-editor/tiptap-ui-primitive/button';
import { Spacer } from '@/components/tiptap-rich-text-editor/tiptap-ui-primitive/spacer';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '@/components/tiptap-rich-text-editor/tiptap-ui-primitive/toolbar';

// --- Tiptap Node ---
import { ImageUploadNode } from '@/components/tiptap-rich-text-editor/tiptap-node/image-upload-node/image-upload-node-extension';
import '@/components/tiptap-rich-text-editor/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-rich-text-editor/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap-rich-text-editor/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap-rich-text-editor/tiptap-node/paragraph-node/paragraph-node.scss';

// --- Tiptap UI ---
import { HeadingDropdownMenu } from '@/components/tiptap-rich-text-editor/tiptap-ui/heading-dropdown-menu';
import { ImageUploadButton } from '@/components/tiptap-rich-text-editor/tiptap-ui/image-upload-button';
import { ListDropdownMenu } from '@/components/tiptap-rich-text-editor/tiptap-ui/list-dropdown-menu';
import { BlockQuoteButton } from '@/components/tiptap-rich-text-editor/tiptap-ui/blockquote-button';
import { CodeBlockButton } from '@/components/tiptap-rich-text-editor/tiptap-ui/code-block-button';
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from '@/components/tiptap-rich-text-editor/tiptap-ui/color-highlight-popover';
import { LinkPopover, LinkContent, LinkButton } from '@/components/tiptap-rich-text-editor/tiptap-ui/link-popover';
import { MarkButton } from '@/components/tiptap-rich-text-editor/tiptap-ui/mark-button';
import { TextAlignButton } from '@/components/tiptap-rich-text-editor/tiptap-ui/text-align-button';
import { UndoRedoButton } from '@/components/tiptap-rich-text-editor/tiptap-ui/undo-redo-button';

// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap-rich-text-editor/tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from '@/components/tiptap-rich-text-editor/tiptap-icons/highlighter-icon';
import { LinkIcon } from '@/components/tiptap-rich-text-editor/tiptap-icons/link-icon';

// --- Hooks ---
import { useMobile } from '@/hooks/use-mobile';
import { useWindowSize } from '@/hooks/use-window-size';
import { useCursorVisibility } from '@/hooks/use-cursor-visibility';

// --- Components ---
import { ThemeToggle } from '@/components/tiptap-rich-text-editor/tiptap-templates/simple/theme-toggle';

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils';

// --- Styles ---
import '@/components/tiptap-rich-text-editor/tiptap-templates/simple/simple-editor.scss';

import content from '@/components/tiptap-rich-text-editor/tiptap-templates/simple/data/content.json';

import { InstagramNode } from '../../tiptap-extension/InstagramNode';
import { RestaurantMention } from '../../tiptap-node/restaurant-mention-node/RestaurantMention';
import { useCallback } from 'react';
import { formatEmbedLink } from '@/lib/utils/utility-functions';

const MainToolbarContent = ({ onHighlighterClick, onLinkClick, isMobile, onInstagramClick }) => {
  return (
    <>
      <Spacer />
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} />
        <BlockQuoteButton />
        <CodeBlockButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? <ColorHighlightPopover /> : <ColorHighlightPopoverButton onClick={onHighlighterClick} />}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ImageUploadButton text="Add" />
        <button
          onClick={onInstagramClick}
          type="button"
          title="Embed Instagram Post"
          className="p-2 rounded hover:bg-gray-100"
        >
          📸 Add Instagram Post
        </button>
      </ToolbarGroup>
      <Spacer />
      {isMobile && <ToolbarSeparator />}
    </>
  );
};

const MobileToolbarContent = ({ type, onBack }) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === 'highlighter' ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' ? <ColorHighlightPopoverContent /> : <LinkContent />}
  </>
);

export function SimpleEditor({ onContentChange, onImageUpload, content = null }) {
  const isMobile = useMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState('main');
  const toolbarRef = React.useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
      },
    },
    extensions: [
      StarterKit,
      InstagramNode,
      RestaurantMention,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      // Image,
      BlogImage,
      Typography,

      Selection,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onSuccess: image => {
          onImageUpload?.(image.public_id);
        },
        onError: error => console.error('Upload failed:', error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onContentChange?.(json); // emit new content
    },
  });

  React.useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const bodyRect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main');
    }
  }, [isMobile, mobileView]);

  const insertInstagram = useCallback(() => {
    const url = prompt('Paste Instagram post URL:');
    if (!url) {
      alert('No URL provided. Please try again.');
      return;
    }
    const formattedLink = formatEmbedLink(url);
    if (formattedLink) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'instagram',
          attrs: { url },
        })
        .run();
    } else {
      alert('Invalid Instagram post link format. Please try again.');
    }
  }, [editor]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar
        ref={toolbarRef}
        style={
          isMobile
            ? {
                bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`,
              }
            : {}
        }
      >
        {mobileView === 'main' ? (
          <MainToolbarContent
            onHighlighterClick={() => setMobileView('highlighter')}
            onLinkClick={() => setMobileView('link')}
            onInstagramClick={insertInstagram}
            isMobile={isMobile}
          />
        ) : (
          <MobileToolbarContent
            type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
            onBack={() => setMobileView('main')}
          />
        )}
      </Toolbar>
      <div className="content-wrapper">
        <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
      </div>
    </EditorContext.Provider>
  );
}
