'use client';
import { useState } from 'react';
//import { faLocationDot, faHeart, faUtensils, faPen } from '@fortawesome/free-solid-svg-icons';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
//import ProfileStat from '@/components/generalProfile/ProfileStat';
//import { Button } from '@/components/shared/Button';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
//import reviewCardIconArr from '@/app/data/iconData';
//import EngagementIconStat from '@/components/shared/EngagementIconStat';
//import { SimpleEditor } from '@/components/tiptap-rich-text-editor/tiptap-templates/simple/simple-editor';
//import SingleTabWithIcon from '@/components/shared/SingleTabWithIcon';
import BlogPostCard from '@/components/shared/BlogPostCard';
import GeneralUserBanner from '@/components/generalProfile/GeneralUserBanner';
import TextEditorStyled from '@/components/generalProfile/TextEditorStyled';
import ReviewCard from '@/components/shared/ReviewCard';
import GeneralUserCard from '@/components/shared/GeneralUserCard';
import { fakeBlogPost, fakeReviews, fakeUser } from '@/app/data/fakeData';

// GENERAL USER DASHBOARD
export default function GeneralUserProfile() {
  const isOwner = true; // flag for showing certain components for profile owner

  const profileTabs = [
    'Blog Posts',
    'Reviews',
    'Favourite Restaurants',
    'Favourite Blog Posts',
    'Visited',
    'My Followers',
    'Following',
  ];
  const [selectedTab, setSelectedTab] = useState(profileTabs[0]);
  const [showTextEditor, setShowTextEditor] = useState(false);

  return (
    <MainBaseContainer>
      <GeneralUserBanner
        showTextEditor={showTextEditor}
        setShowTextEditor={setShowTextEditor}
        generalUserData={fakeUser}
        isOwner={isOwner}
      />
      <div className="main-side-padding w-full py-8">
        {/**** Tab menu and contents - START ****/}
        {!showTextEditor && (
          <>
            <ProfileTabBar tabs={profileTabs} onTabChange={setSelectedTab} />
            {/* Blog Posts */}
            {selectedTab === profileTabs[0] && (
              <GridCustomCols numOfCols={4}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <BlogPostCard key={i} blogPostData={fakeBlogPost} writtenByOwner={isOwner} isFavourited={false} />
                ))}
              </GridCustomCols>
            )}
            {/* Reviews*/}
            {selectedTab === profileTabs[1] && (
              <GridCustomCols numOfCols={4}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <ReviewCard key={i} review={fakeReviews[0]} photos={fakeReviews[0].photos} isOwner={isOwner} />
                ))}
              </GridCustomCols>
            )}
            {/* Favourite Blog Posts */}
            {selectedTab === profileTabs[3] && (
              <GridCustomCols numOfCols={4}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <BlogPostCard key={i} blogPostData={fakeBlogPost} writtenByOwner={false} isFavourited={true} />
                ))}
              </GridCustomCols>
            )}
            {/* My Followers (users who follow owner )*/}
            {selectedTab === profileTabs[5] && (
              <GridCustomCols numOfCols={6}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <GeneralUserCard key={i} generalUserData={fakeUser} isFollowing={false} />
                ))}{' '}
              </GridCustomCols>
            )}
            {/* Following (users who are followed by owner )*/}
            {selectedTab === profileTabs[6] && (
              <GridCustomCols numOfCols={6}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <GeneralUserCard key={i} generalUserData={fakeUser} isFollowing={true} />
                ))}
              </GridCustomCols>
            )}
          </>
        )}
        {/**** Tab menu and contents - END ****/}
        {showTextEditor && (
          /* Blog Text Editor */
          <TextEditorStyled setShowTextEditor={setShowTextEditor} />
        )}
      </div>
    </MainBaseContainer>
  );
}
