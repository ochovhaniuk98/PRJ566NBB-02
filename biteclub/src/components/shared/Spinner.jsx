// components/shared/Spinner.jsx
export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center mt-26 gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-green"></div>
      <p>{message}</p>
    </div>
  );
}
