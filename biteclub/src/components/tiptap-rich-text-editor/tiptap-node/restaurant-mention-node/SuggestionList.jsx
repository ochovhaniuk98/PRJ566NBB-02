export default function SuggestionList({ items, command }) {
  const selectItem = item => {
    command(item);
  };

  return (
    <ul className="bg-white shadow-lg border rounded p-2 space-y-1 max-h-60 overflow-y-auto">
      {items.length ? (
        items.map(item => (
          <li key={item.id} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => selectItem(item)}>
            {item.label}
          </li>
        ))
      ) : (
        <li className="p-2 text-gray-500">No matches</li>
      )}
    </ul>
  );
}
