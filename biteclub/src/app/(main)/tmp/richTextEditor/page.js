// Displays TipTap Simple Rich Text Editor
// Reference: https://tiptap.dev/docs/ui-components/templates/simple-editor
import { SimpleEditor } from '@/components/tiptap-rich-text-editor/tiptap-templates/simple/simple-editor';

export default function Page() {
  return (
    <div className="h-screen overflow-y-auto w-full mt-20">
      <SimpleEditor />
    </div>
  );
}
