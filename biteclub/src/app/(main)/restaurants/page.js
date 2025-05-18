import Link from 'next/link';
import MainBaseContainer from '@/components/shared/MainBaseContainer';

export default function RestaurantResults() {
  return (
    <MainBaseContainer>
      <div className="main-side-margins mb-16 w-full flex flex-col items-center">
        {/* Add contents/components here */}
        <Link href="/restaurants/12345" className="mt-12">
          Click here to see The Pomegranate Restaurant’s profile.
        </Link>
      </div>
    </MainBaseContainer>
  );
}
