import Image from 'next/image';
import { photosList } from '@/app/data/fakeData';
import GridCustomCols from '@/components/shared/GridCustomCols';

export default function PhotoGallery() {
  const getRandomSpan = () => {
    const spans = [1, 1, 2];
    return spans[Math.floor(Math.random() * spans.length)];
  };
  return (
    <GridCustomCols numOfCols={6}>
      {photosList.map((src, i) => {
        const colSpan = getRandomSpan();
        const rowSpan = i > photosList.length - 5 ? 1 : getRandomSpan();
        return (
          <div key={i} className={`relative col-span-${colSpan} row-span-${rowSpan}`}>
            <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" />
          </div>
        );
      })}
    </GridCustomCols>
  );
}
