export default function FormattedDate({ yyyymmdd }) {
  const fDate = new Date(yyyymmdd).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return <h4 className="text-brand-grey mt-4">{fDate}</h4>;
}
