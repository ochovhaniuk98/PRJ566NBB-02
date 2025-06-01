export default function ProfileStat({ statNum, statLabel }) {
  return (
    <div className="flex items-center gap-1 pt-1 pb-2">
      <div>
        <div className="rounded-full bg-brand-green w-12 aspect-square"></div>
      </div>
      <div>
        <span className="font-secondary text-3xl">{statNum}</span>
        <p className="leading-none text-sm">{statLabel}</p>
      </div>
    </div>
  );
}
