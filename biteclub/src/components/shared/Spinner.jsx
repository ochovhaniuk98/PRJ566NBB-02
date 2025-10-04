// components/shared/Spinner.jsx
export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center mt-26 gap-4 h-40">
      <div className="animate-spin rounded-full h-16 w-16 border-8 border-brand-green border-r-brand-aqua border-b-brand-yellow border-l-brand-navy"></div>
      <h2 className="text-brand-grey capitalize">{message}</h2>
    </div>
  );
}
