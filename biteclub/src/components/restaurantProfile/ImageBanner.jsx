export default function ImageBanner({ images = [] }) {
  return (
    <div className="grid grid-cols-4 gap-0">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Banner Image ${i + 1}`}
          className="w-full h-80 object-cover"
        />
      ))}
    </div>
  );
}
