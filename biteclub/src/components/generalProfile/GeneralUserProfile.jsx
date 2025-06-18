'use client';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import Masonry from 'react-masonry-css';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import BlogPostCard from '@/components/shared/BlogPostCard';
import GeneralUserBanner from '@/components/generalProfile/GeneralUserBanner';
import TextEditorStyled from '@/components/generalProfile/TextEditorStyled';
import ReviewCard from '@/components/shared/ReviewCard';
import GeneralUserCard from '@/components/generalProfile/GeneralUserCard';
import StarRating from '../shared/StarRating';
import { fakeBlogPost, fakeReviews, fakeRestaurantData } from '@/app/data/fakeData';
import AddReviewForm from '../shared/AddReviewForm';
import { Button } from '../shared/Button';
import InstagramEmbedOld from '../restaurantProfile/InstagramEmbedOld';
import RestaurantCard from '../restaurantProfile/RestaurantCard';
import ReviewCardExpanded from '../restaurantProfile/ReviewCardExpanded';

// GENERAL USER DASHBOARD
export default function GeneralUserProfile({ isOwner = false, generalUserId }) {
  // userId: from MongoDB, not supabase. By default "false" just in-case.
  // const isOwner = true; // flag for showing certain components for profile owner
  const profileTabs = [
    'Blog Posts',
    'Reviews',
    'Visited',
    'Favourite Restaurants',
    'Favourite Blog Posts',
    'My Followers',
    'Following',
  ];

  const [userProfile, setUserProfile] = useState(null);
  const [selectedTab, setSelectedTab] = useState(profileTabs[0]);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [myBlogPosts, setMyBlogPosts] = useState([]);
  const [myReviews, setMyReviews] = useState({
    internalReviews: [],
    externalReviews: [],
  });
  const [favouritedRestaurants, setFavouritedRestaurants] = useState([]);
  const [showInstaReview, setShowInstaReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  /* States below are for MANAGING/EDITING general profile */
  const [editMode, setEditMode] = useState(false); // tracks whether owner wants to manage CONTENT on profile (displays edit/delete panel on each card)
  const [editReviewForm, setEditReviewForm] = useState(false); // for opening/closing form to edit a SPECIFIC REVIEW
  const [reviewRating, setReviewRating] = useState({ value: 0, message: '' }); // stores the updated rating value the owner gives when editing a review
  const [editBlogPost, setEditBlogPost] = useState(false); // tracks whether text editor is adding a NEW post or EDITING an existing one

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch general user profile and their blog posts concurrently
        const [profileRes, postsRes] = await Promise.all([
          fetch('/api/get-general-user-profile-by-mongoId', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ generalUserId }),
          }),
          fetch(`/api/blog-posts/get-posts-by-userId/${generalUserId}`),
        ]);

        // If either request fails, log and stop execution
        if (!profileRes.ok || !postsRes.ok) {
          console.error('One or both requests failed');
          return;
        }

        // Parse both JSON responses
        const [profileData, postsData] = await Promise.all([profileRes.json(), postsRes.json()]);

        // Set user profile and blog posts to state
        setUserProfile(profileData.profile); // profileData = { profile: { ... } }
        setMyBlogPosts(postsData);
        console.log('USER profile:', profileData.profile);

        // If favouriteRestaurants exist, fetch full restaurant objects by IDs
        const restaurantIds = profileData.profile.favouriteRestaurants;
        if (restaurantIds?.length > 0) {
          const res = await fetch('/api/restaurants/by-ids', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: restaurantIds }),
          });

          // Parse and store the full restaurant documents
          const data = await res.json();
          setFavouritedRestaurants(data.restaurants);
        }
      } catch (err) {
        // Catch any unexpected errors in the fetch chain
        console.error('Failed to fetch user profile or blog posts:', err);
      }
    };

    // Ensure we have a valid generalUserId before starting fetch
    if (generalUserId) fetchData();
  }, [generalUserId, showTextEditor]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const res = await fetch(`/api/user-reviews/${generalUserId}`);

        if (!res.ok) {
          console.log('Failed to fetch reviews');
          return;
        }

        const reviews = await res.json();
        setMyReviews(reviews);
      } catch (err) {
        console.error('Failed to fetch user reviews:', err);
      }
    };
    // Fetch user review only when the user selects the "Reviews" tab
    if (selectedTab === profileTabs[1] && generalUserId) {
      fetchUserReviews();
    }
  }, [selectedTab, generalUserId]);

  // breakpoints for internal reviews and expanded review side panel
  const breakpointColumnsObj = useMemo(() => {
    return selectedReview
      ? { default: 2, 1024: 2, 640: 1 } // 2 column + expanded panel view
      : { default: 3, 1024: 2, 640: 1 }; // 3 column default view
  }, [selectedReview]);

  if (!userProfile) return <div>Loading profile...</div>;

  return (
    <MainBaseContainer>
      <GeneralUserBanner
        showTextEditor={showTextEditor}
        setShowTextEditor={setShowTextEditor}
        generalUserData={userProfile}
        isOwner={isOwner}
        editMode={editMode}
        setEditMode={setEditMode}
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
                  <BlogPostCard
                    key={post._id || i}
                    blogPostData={post}
                    writtenByOwner={isOwner}
                    isFavourited={false}
                    isEditModeOn={editMode}
                    setShowTextEditor={setShowTextEditor}
                    setEditBlogPost={setEditBlogPost}
                  />
                ))}
              </GridCustomCols>
            )}
            {/* Reviews*/}
            {selectedTab === profileTabs[1] && (
              <>
                <div className="flex gap-x-2 mb-4">
                  <Button onClick={() => setShowInstaReview(false)} type="button" className="w-30" variant={'roundTab'}>
                    From BiteClub
                  </Button>
                  <Button onClick={() => setShowInstaReview(true)} type="button" className="w-30" variant={'roundTab'}>
                    From Instagram
                  </Button>
                </div>
                {!showInstaReview &&
                  (myReviews?.internalReviews.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-500">No internal review yet.</div>
                  ) : (
                    /* internal reviews */
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Masonry
                          breakpointCols={breakpointColumnsObj}
                          className="flex gap-2"
                          columnClassName="space-y-2"
                        >
                          {myReviews?.internalReviews.map((review, i) => (
                            /* internal reviews */
                            <ReviewCard
                              key={review._id || i}
                              review={review}
                              photos={review.photos}
                              isOwner={isOwner}
                              isEditModeOn={editMode}
                              setEditReviewForm={setEditReviewForm}
                              onClick={() => setSelectedReview(review)}
                              isSelected={selectedReview?._id === review._id}
                            />
                          ))}
                        </Masonry>
                      </div>
                      {/* Expanded side panel (visible when internal review is selected) */}
                      {selectedReview && (
                        <ReviewCardExpanded
                          selectedReview={selectedReview}
                          onClose={() => setSelectedReview(null)}
                          isOwner={isOwner}
                        />
                      )}
                    </div>
                    /*
                    <GridCustomCols numOfCols={4}>
                      {myReviews?.internalReviews.map((review, i) => (
                        <ReviewCard
                          key={review._id || i}
                          review={review}
                          photos={review.photos}
                          isOwner={isOwner}
                          isEditModeOn={editMode}
                          setEditReviewForm={setEditReviewForm}
                        />
                      ))}
                    </GridCustomCols> */
                  ))}
                {/* Instagram Reviews */}
                {showInstaReview &&
                  (myReviews?.externalReviews.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-500">No Instagram review yet.</div>
                  ) : (
                    <GridCustomCols numOfCols={4}>
                      {myReviews?.externalReviews.map((review, i) => (
                        <InstagramEmbedOld
                          key={review._id || i}
                          postUrl={review.content?.embedLink}
                          isEditModeOn={editMode}
                        />
                      ))}
                    </GridCustomCols>
                  ))}
              </>
            )}
            {/* Favourite Restaurants */}
            {selectedTab === profileTabs[3] && (
              <GridCustomCols numOfCols={6}>
                {favouritedRestaurants.map(restaurant => (
                  // isFavourited here will always be true. isFavourited={true}
                  <RestaurantCard key={restaurant._id} restaurantData={restaurant} />
                ))}
              </GridCustomCols>
            )}
            {/* Favourite Blog Posts */}
            {selectedTab === profileTabs[4] && (
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
          <TextEditorStyled
            setShowTextEditor={setShowTextEditor}
            generalUserId={generalUserId}
            editBlogPost={editBlogPost}
          />
        )}
      </div>

      {/* review form + interactive star rating */}
      {editReviewForm && (
        /* NOTE: "AddReviewForm" has two modes: Adding NEW reviews, and EDITING existing reviews.
         The paramter "editReviewMode" is false by default, but TRUE when user wants to edit review.*/
        <AddReviewForm onCancel={() => setEditReviewForm(false)} editReviewMode={true}>
          {/* StarRating also has two modes: STATIC (for just viewing on review cards) and INTERACTIVE for inputting ratings in the AddReviewForm.
          Parameters "interactive" and "onChange" are false or empty by default, but need values when StarRating is being used for rating input.*/}
          <StarRating
            iconSize="text-4xl cursor-pointer"
            interactive={true}
            onChange={(val, msg) => setReviewRating({ value: val, message: msg })}
          />
          {reviewRating.value > 0 && <p>{reviewRating.message}</p>}
        </AddReviewForm>
      )}
    </MainBaseContainer>
  );
}
