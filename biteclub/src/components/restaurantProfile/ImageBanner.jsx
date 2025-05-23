export default function ImageBanner({ images = [] }) {
  return (
    <div className="grid grid-cols-4 gap-0">
      {images.map((elem, i) => (
        <img key={i} src={elem.url} alt={elem.caption} className="w-full h-80 object-cover" />
      ))}
    </div>
  );
}
