import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';

export default function Settings() {
  return (
    <MainBaseContainer>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center m-16 bg-brand-yellow">
        {/* Add contents/components here */}
        <GridCustomCols numOfCols={2}>
          <div className="bg-brand-green aspect-square w-full"></div>
          <div className="bg-brand-green aspect-square w-full"></div>
        </GridCustomCols>
      </div>
    </MainBaseContainer>
  );
}
