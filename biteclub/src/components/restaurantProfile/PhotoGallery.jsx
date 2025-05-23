import Image from 'next/image';
import GridCustomCols from '@/components/shared/GridCustomCols';

export default function PhotoGallery({ photos }) {
  const getRandomSpan = () => {
    const spans = [1, 1, 2];
    return spans[Math.floor(Math.random() * spans.length)];
  };
  return (
    <GridCustomCols numOfCols={6}>
      {photos.map((elem, i) => {
        const colSpan = getRandomSpan();
        const rowSpan = i > photos.length - 5 ? 1 : getRandomSpan();
        return (
          <div key={i} className={`relative col-span-${colSpan} row-span-${rowSpan}`}>
            <Image src={elem.url} alt={elem.caption} fill className="object-cover" />
          </div>
        );
      })}
    </GridCustomCols>
  );
}
