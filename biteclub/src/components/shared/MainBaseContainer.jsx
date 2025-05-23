export default function MainBaseContainer({ children }) {
  return (
    <div className="absolute top-0 left-12 right-0">
      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
}
