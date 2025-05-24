export default function AddInstagramEmbed({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Write a Review</h2>
        <textarea className="w-full border rounded-md p-2 h-24 resize-none" placeholder="Your review..." />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="text-gray-500 hover:underline">
            Cancel
          </button>
          <button className="bg-brand-yellow text-white px-4 py-1 rounded">Submit</button>
        </div>
      </div>
    </div>
  );
}
