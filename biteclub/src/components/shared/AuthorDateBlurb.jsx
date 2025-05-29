import Image from 'next/image';

// Description: Author's name, pic and date that appears on reviews and blog posts.
export default function AuthorDateBlurb({ authorPic, authorName, date }) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div className="flex mt-4 gap-x-2">
      <div className="relative w-10 h-10 outline-1 outline-white rounded-full">
        <Image src={authorPic} alt="profile pic" className="object-cover rounded-full" fill={true} />
      </div>
      <div>
        <a href="#">
          <h4 className="font-semibold">{authorName}</h4>
        </a>
        <h4 className="text-brand-grey">{formattedDate}</h4>
      </div>
    </div>
  );
}
