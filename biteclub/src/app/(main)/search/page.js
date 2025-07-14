import { Suspense } from 'react';
import Search from '@/components/searchResults/Search';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mb-8 p-16">
          <p>Loading search results...</p>
        </div>
      }
    >
      <Search />
    </Suspense>
  );
}
