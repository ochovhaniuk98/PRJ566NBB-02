export default function StyledPageTitle({
  textString,
  p_fontSize = 'md:text-5xl text-3xl',
  shadowPos = 'md:top-[2px] top-[1.25px]',
  outlineWidth = 'md:[-webkit-text-stroke:0.75px_black] [-webkit-text-stroke:0.5px_black]',
  txtColour = 'text-brand-green',
}) {
  const widthOnMd = p_fontSize == 'md:text-5xl text-3xl' ? 'w-60' : 'w-auto';
  return (
    <div className="font-secondary capitalize">
      <div className={`absolute top-0 left-0 text-left md:w-auto ${p_fontSize} ${widthOnMd}`}>{textString}</div>
      <div
        className={`absolute text-brand-green text-left md:w-auto ${p_fontSize} ${shadowPos} ${outlineWidth} ${txtColour}  ${widthOnMd}`}
      >
        {textString}
      </div>
    </div>
  );
}
