'use client';
import Link from 'next/link';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import InstagramEmbedFull from '@/components/restaurantProfile/InstagramEmbedFull';
import GridCustomCols from '@/components/shared/GridCustomCols';
import { useState } from 'react';

export default function RestaurantResults() {
  const [instagramHeight, setInstagramHeight] = useState(0);
  // dynamically store insta post container's height so that the 3-col grid's rows can resize accordingly

  const embedList = [
    { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
    { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
    { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
    { embedLink: 'https://www.instagram.com/p/DCZlEDqy2to/' },
  ];
  return (
    <MainBaseContainer>
      <div className="main-side-padding mb-16 w-full flex flex-col items-center">
        {/* Add contents/components here */}
        <Link href="/restaurants/12345" className="mt-12">
          Click here to see The Pomegranate Restaurant’s profile.
        </Link>

        <GridCustomCols numOfCols={4} responsiveHeight={instagramHeight}>
          <InstagramEmbedFull postUrl={embedList[0].embedLink} onHeightChange={height => setInstagramHeight(height)} />
          <InstagramEmbedFull postUrl={embedList[0].embedLink} onHeightChange={height => setInstagramHeight(height)} />
          <InstagramEmbedFull postUrl={embedList[0].embedLink} onHeightChange={height => setInstagramHeight(height)} />
          <InstagramEmbedFull postUrl={embedList[0].embedLink} onHeightChange={height => setInstagramHeight(height)} />
          <InstagramEmbedFull postUrl={embedList[0].embedLink} onHeightChange={height => setInstagramHeight(height)} />
          <InstagramEmbedFull postUrl={embedList[0].embedLink} onHeightChange={height => setInstagramHeight(height)} />
          <InstagramEmbedFull postUrl={embedList[0].embedLink} onHeightChange={height => setInstagramHeight(height)} />
          <InstagramEmbedFull postUrl={embedList[0].embedLink} onHeightChange={height => setInstagramHeight(height)} />
          <InstagramEmbedFull postUrl={embedList[0].embedLink} onHeightChange={height => setInstagramHeight(height)} />
        </GridCustomCols>
      </div>
    </MainBaseContainer>
  );
}
