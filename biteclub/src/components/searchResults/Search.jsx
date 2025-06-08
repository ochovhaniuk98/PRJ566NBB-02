// src/components/searchResults/Search.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import SearchResults from './SearchResults';

export default function Search() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  return <SearchResults searchType={0} searchQuery={searchQuery} />;
}
