'use client';
import { useEffect, useState } from 'react';
import { faPenClip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import { Button } from '@/components/shared/Button';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import BlogPostCard from '@/components/shared/BlogPostCard';
import GeneralUserBanner from '@/components/generalProfile/GeneralUserBanner';
import TextEditorStyled from '@/components/generalProfile/TextEditorStyled';
import ReviewCard from '@/components/shared/ReviewCard';
import GeneralUserCard from '@/components/shared/GeneralUserCard';
import StarRating from '../shared/StarRating';
import { fakeBlogPost, fakeReviews, fakeUser } from '@/app/data/fakeData';
import { Label } from '../shared/Label';
import { Input } from '../shared/Input';
import ReviewImageUpload from '../shared/ReviewImageUpload';
import AddReviewForm from '../shared/AddReviewForm';
// GENERAL USER DASHBOARD
export default function GeneralUserProfile({ isOwner = false, generalUserId }) {
  // userId: from MongoDB, not supabase. By default "false" just in-case.
  //   const isOwner = true; // flag for showing certain components for profile owner
  const profileTabs = [
    'Blog Posts',
    'Reviews',
    'Favourite Restaurants',
    'Favourite Blog Posts',
    'Visited',
    'My Followers',
    'Following',
  ];

  const [userProfile, setUserProfile] = useState(null);
  const [selectedTab, setSelectedTab] = useState(profileTabs[0]);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [myBlogPosts, setMyBlogPosts] = useState([]);
  const [reviewRating, setReviewRating] = useState({ value: 0, message: '' }); // to edit rating on review

  useEffect(() => {
    const fetchData = async () => {
      // get user profile
      try {
        const res = await fetch('/api/get-general-user-profile-by-mongoId', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ generalUserId }),
        });

        const { profile } = await res.json();
        setUserProfile(profile);
        console.log('USER profile:', profile);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }

      // get user's blog posts
      try {
        const res = await fetch(`/api/blog-posts/get-posts-by-userId/${generalUserId}`);

        if (!res.ok) {
          console.log('Failed to fetch blog posts');
          return;
        }

        const posts = await res.json();
        setMyBlogPosts(posts);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    if (generalUserId) fetchData();
  }, [generalUserId, showTextEditor]);

  if (!userProfile) return <div>Loading profile...</div>;

  return (
    <MainBaseContainer>
      <GeneralUserBanner
        showTextEditor={showTextEditor}
        setShowTextEditor={setShowTextEditor}
        generalUserData={userProfile}
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
                {myBlogPosts.map((post, i) => (
                  <BlogPostCard key={post._id || i} blogPostData={post} writtenByOwner={isOwner} isFavourited={false} />
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
                  // The "Favourite Blog Posts" should not display posts written by the owner (i.e. isOwner should be false / !isOwner).
                  // However, users may still favourite their own posts — so this logic (false) might be adjusted later.
                  <BlogPostCard key={i} blogPostData={fakeBlogPost} writtenByOwner={false} isFavourited={true} />
                ))}
              </GridCustomCols>
            )}
            {/* My Followers (users who follow owner )*/}
            {selectedTab === profileTabs[5] && (
              <GridCustomCols numOfCols={6}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <GeneralUserCard key={i} generalUserData={userProfile} isFollowing={false} />
                ))}{' '}
              </GridCustomCols>
            )}
            {/* Following (users who are followed by owner )*/}
            {selectedTab === profileTabs[6] && (
              <GridCustomCols numOfCols={6}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <GeneralUserCard key={i} generalUserData={userProfile} isFollowing={true} />
                ))}
              </GridCustomCols>
            )}
          </>
        )}
        {/**** Tab menu and contents - END ****/}
        {showTextEditor && (
          /* Blog Text Editor */
          <TextEditorStyled setShowTextEditor={setShowTextEditor} generalUserId={generalUserId} />
        )}
      </div>
      {/* review form + interactive star rating */}
      <AddReviewForm>
        <StarRating
          iconSize="text-4xl cursor-pointer"
          interactive={true}
          onChange={(val, msg) => setReviewRating({ value: val, message: msg })}
        />
        {reviewRating.value > 0 && <p>{reviewRating.message}</p>}
      </AddReviewForm>
    </MainBaseContainer>
  );
}
