// Shows message depending on search results
export default function SearchResultsNumMessage({ numResults, searchTypeNum = 0, searchString }) {
  const searchTypes = ['restaurant', 'blog post', 'user'];
  const pluralType = numResults === 1 ? searchTypes[searchTypeNum] : searchTypes[searchTypeNum] + 's';

  return (
    <p>
      {numResults > 0 ? (
        <>
          <span className="font-semibold">{numResults}</span> {pluralType} {numResults === 1 ? 'matches ' : 'match '}
          <span className="font-semibold italic">{searchString}</span>.
        </>
      ) : (
        <>
          No results found for <span className="font-semibold italic">{searchString}</span>.
        </>
      )}
    </p>
  );
}
