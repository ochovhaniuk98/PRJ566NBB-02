import { Button } from '../shared/Button';
import { SimpleEditor } from '../tiptap-rich-text-editor/tiptap-templates/simple/simple-editor';
import { Input } from '../shared/Input';
import { Label } from '../shared/Label';

export default function TextEditorStyled({ setShowTextEditor }) {
  return (
    <>
      <div className=" pt-0 text-center">
        <div className="flex gap-2 justify-end fixed bottom-5 right-25">
          <Button type="submit" className="w-30" variant="default">
            Save
          </Button>
          <Button type="button" className="w-30" variant="secondary" onClick={() => setShowTextEditor(false)}>
            Cancel
          </Button>
        </div>
        <h3>WRITE A BLOG POST</h3>
        <div className=" flex gap-2 items-center justify-center mb-2">
          <Label>Title</Label>
          <Input type="text" className={'w-[50%]'} />
        </div>
        <div className=" w-full h-700 border border-brand-yellow-lite">
          <SimpleEditor />
        </div>
      </div>
    </>
  );
}
