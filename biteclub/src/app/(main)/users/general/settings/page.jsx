import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Input } from '@/components/shared/Input';
import { Label } from '@/components/shared/Label';
import { Switch } from '@/components/shared/Switch';
import { Button } from '@/components/shared/Button';

export default function Settings() {
  return (
    <MainBaseContainer>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center m-16 bg-white">
        {/* Add contents/components here */}
        <form>
          <GridCustomCols numOfCols={2}>
            <div className="aspect-5/4 w-md py-1 px-12 flex flex-col gap-2">
              <h2>ACCOUNT DETAILS</h2>
              <div>
                <Label htmlFor="email">
                  <h4>Email</h4>
                </Label>
                <Input id="email" type="email" placeholder="janedoe@myemail.com" required className="w-full" />
              </div>
              <div>
                <Label htmlFor="email">
                  <h4>Email</h4>
                </Label>
                <Input id="email" type="email" placeholder="janedoe@myemail.com" required className="w-full" />
              </div>
              <div>
                <Label htmlFor="email">
                  <h4>Email</h4>
                </Label>
                <textarea className="w-full p-2 border rounded-md h-32 resize-none" />
              </div>
            </div>

            <div className="bg-white aspect-5/4 py-1 px-12 flex flex-col gap-2">
              <h2>Display Preferences</h2>
              <p>You can modify what page to show the public.</p>

              <div className="flex items-center justify-between mb-4">
                <label htmlFor="user-role">
                  <h5>I am a restaurant business.</h5>
                </label>
                <Switch id="user-role" checked={true} />
              </div>
              <div className="flex items-center justify-between mb-8">
                <label htmlFor="user-role">
                  <h5>I am a restaurant business.</h5>
                </label>
                <Switch id="user-role" checked={true} />
              </div>
            </div>
          </GridCustomCols>
          <div className="flex flex-col items-center">
            <Button type="submit" className="w-60" variant="default" disabled={false}>
              Save
            </Button>
          </div>
        </form>
        <div></div>

        <Button type="submit" className="w-60" variant="destructive" disabled={false}>
          Save
        </Button>
        <Button type="submit" className="w-60" variant="outline" disabled={false}>
          Save
        </Button>
        <Button type="submit" className="w-60" variant="secondary" disabled={false}>
          Save
        </Button>
        <Button type="submit" className="w-60" variant="link" disabled={false}>
          Save
        </Button>
        <Button type="submit" className="w-60" variant="ghost" disabled={false}>
          Save
        </Button>
      </div>
    </MainBaseContainer>
  );
}
