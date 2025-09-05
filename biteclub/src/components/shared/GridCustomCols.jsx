export default function GridCustomCols({ children, numOfCols = 3, className = '', responsiveHeight, rowMinHeight }) {
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
      className={`grid lg:grid-cols-${numOfCols} grid-cols-1 gap-2 grid-flow-dense ${
        rowMinHeight
          ? `md:w-4xl w-full lg:auto-rows-[minmax(200px,_auto)] auto-rows-[minmax(${rowMinHeight},_auto)]`
          : 'w-full auto-rows-[minmax(200px,_auto)]'
      } ${className}`}
      style={responsiveHeight ? { gridAutoRows: `${'315'}px` } : {}}
    >
      {children}
    </div>
  );
}
