import StarRating from '@/components/shared/StarRating';
import Image from 'next/image';
export default function ReviewCard({ imageSrc }) {
  return (
    <div
      className={`border rounded-md border-brand-yellow flex flex-col ${
        imageSrc?.length > 0 ? 'row-span-2' : 'row-span-1'
      }`}
    >
      {/* text div*/}
      <div className="p-4">
        <StarRating colour={'text-brand-green'} iconSize={'icon-lg'} ratingNum={3} />
        <h3>Review Title</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam velit libero, vehicula sed cursus non, blandit
          et neque. Ut interdum tincidunt nibh, et pellentesque ligula tincidunt eget. Maecenas eget pulvinar massa,
          eget interdum nisi. Nulla gravida tincidunt tortor ac aliquet. Aliquam aliquam sem quam, eget volutpat magna
          imperdiet id ...
        </p>
        <div className="flex mt-4 gap-x-2">
          <div className="relative w-10 h-10">
            <Image src="/img/profilepic.jpg" alt="profile pic" className="object-cover rounded-full" fill={true} />
          </div>
          <div>
            <a href="#">
              <h4 className="font-semibold">Authour Name</h4>
            </a>
            <h4 className="text-brand-grey">— May 20, 2025</h4>
          </div>
        </div>
      </div>
      {imageSrc?.length > 0 && (
        <div className="flex mt-auto gap-x-1 h-1/3">
          <div className="relative w-1/2 aspect-[3/2] overflow-hidden">
            <Image src={imageSrc[0]} alt="profile pic" className="object-cover rounded-bl-md" fill={true} />
          </div>
          <div className="relative w-1/2 aspect-[3/2] overflow-hidden">
            <Image src={imageSrc[1]} alt="profile pic" className="object-cover rounded-br-md" fill={true} />
          </div>
        </div>
      )}
    </div>
  );
}
