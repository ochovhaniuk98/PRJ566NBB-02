export default function StyledPageTitle({
  textString,
  p_fontSize = 'md:text-5xl text-4xl',
  shadowPos = 'md:top-[2px] top-[1.25px]',
  outlineWidth = 'md:[-webkit-text-stroke:0.75px_black] [-webkit-text-stroke:0.5px_black]',
  txtColour = 'text-brand-green',
  textAlign = 'text-left',
  className = '',
}) {
  const widthOnMd = p_fontSize == 'md:text-5xl text-4xl' ? 'md:w-full w-[16rem]' : 'md:w-auto w-auto';
  return (
    <div className={`font-secondary capitalize relative inline-block w-auto ${className}`}>
      <div className={`block ${p_fontSize}  ${widthOnMd}  ${textAlign}`}>{textString}</div>
      <div
        className={`absolute text-brand-green  ${textAlign} md:w-auto ${p_fontSize} ${shadowPos} ${outlineWidth} ${txtColour}  ${widthOnMd}`}
      >
        {textString}
      </div>
    </div>
  );
}
