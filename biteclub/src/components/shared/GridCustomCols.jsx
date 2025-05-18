export default function GridCustomCols({ children, numOfCols = 3 }) {
  /*
  const colsClass = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  };*/

  return (
    <div
      className={`grid lg:grid-cols-${numOfCols} md:grid-cols-2 gap-2 grid-flow-dense auto-rows-[minmax(200px,_auto)]`}
    >
      {children}
    </div>
  );
}
