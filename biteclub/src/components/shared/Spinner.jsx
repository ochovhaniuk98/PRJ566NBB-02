// components/shared/Spinner.jsx
export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center mt-26 gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-4 border-r-4 border-b-2 border-brand-green border-r-brand-navy border-l-brand-navy"></div>
      <p className='text-brand-navy'>{message}</p>
    </div>
  );
}
