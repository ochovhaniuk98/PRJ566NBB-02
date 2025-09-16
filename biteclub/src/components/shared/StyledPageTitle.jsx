export default function StyledPageTitle({ textString }) {
  return (
    <div className="font-secondary capitalize">
      <div className="absolute top-0 left-0 md:text-5xl text-3xl text-left md:w-auto w-60">{textString}</div>
      <div className="absolute md:top-[2px] top-[1.25px] text-brand-green md:text-5xl text-3xl text-left md:[-webkit-text-stroke:0.75px_black] [-webkit-text-stroke:0.5px_black] md:w-auto w-60">
        {textString}
      </div>
    </div>
  );
}
