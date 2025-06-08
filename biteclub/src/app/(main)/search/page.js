'use client';
import SearchResults from '@/components/searchResults/SearchResults';
import { useSearchParams } from 'next/navigation';

export default function RestaurantResults() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // shows restuarant type results by default (0)
  return <SearchResults searchType={0} searchQuery={searchQuery} />;
}
