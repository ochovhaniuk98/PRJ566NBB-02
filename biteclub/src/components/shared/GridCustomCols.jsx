export default function GridCustomCols({ children, numOfCols }) {
  return (
    <div className={`grid lg:grid-cols-${numOfCols} md:grid-cols-2 gap-3 auto-rows-[minmax(12rem, auto)]`}>
      {children}
    </div>
  );
}
