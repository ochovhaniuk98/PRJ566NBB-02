// !!!!!!!!!!!!!!! NOT IN USE !!!!!!!!!!!!!!!
//
// Description: Expanded mode of review that appears when a review is clicked on a 3-col grid.
export default function ExpandedReviewCard({ review, onClose }) {
  return (
    <div className="border border-brand-peach rounded-md p-4 bg-white h-screen">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Expanded Review</h2>
        <button onClick={() => onClose(null)} className="text-sm text-blue-600 hover:underline">
          Close
        </button>
      </div>
      <h3>{review.title}</h3>
      {review.imageSrc && <img src={review.imageSrc[0]} alt="full" className="mt-4 rounded-md" />}
    </div>
  );
}
