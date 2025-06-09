import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../shared/Button';
import InstagramEmbed from './InstagramEmbed';

export default function DeleteInstagramForm({ setShowDeleteInstaModal }) {
  return (
    <div className="fixed w-screen h-screen bg-black/50 left-0 top-0 z-200 py-12 px-60">
      <div className={`box-border bg-white h-full w-full  rounded-lg  z-210 p-8 flex flex-col shadow-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Delete Instagram Embeds</h2>
          <div className="flex justify-between items-center gap-8">
            <Button type="button" className="w-40" variant="danger" disabled={false}>
              Delete Selected
            </Button>
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="icon-2xl text-brand-navy cursor-pointer"
              onClick={() => setShowDeleteInstaModal(false)}
            />
          </div>
        </div>
        <div className="w-full h-full bg-brand-blue-lite  p-4 mt-4 rounded-lg overflow-y-scroll grid grid-cols-4 gap-2 shadow-inner">
          {Array.from({ length: 12 }).map((_, i) => (
            <InstagramEmbed
              key={i}
              postUrl={
                'https://www.instagram.com/p/CokYC2Jr20p/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA%3D%3D&img_index=1'
              }
              isEditModeOn={true}
              forEditRestaurant={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
