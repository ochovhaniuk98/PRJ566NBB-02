import { Suspense } from 'react';
import Search from '@/components/searchResults/Search';
import Spinner from '@/components/shared/Spinner';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Spinner message='Loading search results...'/>
      }
    >
      <Search />
    </Suspense>
  );
}
