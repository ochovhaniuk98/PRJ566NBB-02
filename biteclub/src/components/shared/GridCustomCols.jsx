export default function GridCustomCols({ children, numOfCols = 3, className = '', responsiveHeight }) {
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
      className={`grid lg:grid-cols-${numOfCols} md:grid-cols-2 gap-2 grid-flow-dense w-full auto-rows-[minmax(200px,_auto)] ${className}`}
      style={responsiveHeight ? { gridAutoRows: `${'315'}px` } : {}}
    >
      {children}
    </div>
  );
}
