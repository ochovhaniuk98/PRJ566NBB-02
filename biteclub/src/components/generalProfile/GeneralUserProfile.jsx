'use client';

import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import Masonry from 'react-masonry-css';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import TextEditorStyled from '@/components/generalProfile/TextEditorStyled';
import GeneralUserBanner from '@/components/generalProfile/GeneralUserBanner';
import GeneralUserCard from '@/components/generalProfile/GeneralUserCard';
import BlogPostCard from '@/components/shared/BlogPostCard';
import ReviewCard from '@/components/shared/ReviewCard';
import StarRating from '../shared/StarRating';
import AddReviewForm from '../shared/AddReviewForm';
import { Button } from '../shared/Button';
import RestaurantCard from '../restaurantProfile/RestaurantCard';
import ReviewCardExpanded from '../restaurantProfile/ReviewCardExpanded';
import InstagramEmbed from '../restaurantProfile/InstagramEmbed';
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
    'Followers', // instead of 'My Followers', the profile might not be yours.
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
  const [favouritedBlogs, setFavouritedBlogs] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  // Display on Public Toggle (Yes / No)
  const [displayFavouriteRestaurants, setDisplayFavouriteRestaurants] = useState(false);
  const [displayFavouriteBlogPosts, setDisplayFavouriteBlogPosts] = useState(false);
  const [displayVisitedPlaces, setDisplayVisitedPlaces] = useState(false);

  const [showInstaReview, setShowInstaReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  /* States below are for MANAGING/EDITING general profile */
  const [editMode, setEditMode] = useState(false); // tracks whether owner wants to manage CONTENT on profile (displays edit/delete panel on each card)
  const [editReviewForm, setEditReviewForm] = useState(false); // for opening/closing form to edit a SPECIFIC REVIEW
  const [reviewRating, setReviewRating] = useState({ value: 0, message: '' }); // stores the updated rating value the owner gives when editing a review
  const [editBlogPost, setEditBlogPost] = useState(false); // tracks whether text editor is adding a NEW post or EDITING an existing one
  const [editBlogPostData, setEditBlogPostData] = useState(null);

  const [selectedBlogPosts, setSelectedBlogPosts] = useState([]);

  const filteredTabs = profileTabs.filter((tab, index) => {
    if (index === 2 && !displayVisitedPlaces) return false; // Tab 2 - visited places
    if (index === 3 && !displayFavouriteRestaurants) return false; // Tab 3 - favourite restaurants
    if (index === 4 && !displayFavouriteBlogPosts) return false; // Tab 4 - favourite blog posts
    return true;
  });

  // TAB 0 -- BLOG POSTS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          fetch(`/api/generals/get-profile-by-dbId?dbId=${generalUserId}`),
          fetch(`/api/blog-posts/get-posts-by-userId/${generalUserId}`),
        ]);

        if (!profileRes.ok || !postsRes.ok) {
          console.error('One or both requests failed');
          return;
        }

        const [profileData, postsData] = await Promise.all([profileRes.json(), postsRes.json()]);

        setUserProfile(profileData.profile);
        setMyBlogPosts(postsData);
        setDisplayFavouriteRestaurants(profileData.profile.displayFavouriteRestaurants);
        setDisplayFavouriteBlogPosts(profileData.profile.displayFavouriteBlogPosts);
        setDisplayVisitedPlaces(profileData.profile.displayVisitedPlaces);
      } catch (err) {
        console.error('(GeneralUserProfile) Failed to fetch user data: ', err);
      }
    };

    if (generalUserId) fetchData();
  }, [generalUserId, showTextEditor]);

  // THEN: Load data ONLY when the tab is selected
  useEffect(() => {
    if (!generalUserId || !selectedTab) return;

    const fetchTabData = async () => {
      try {
        // TAB 1 -- REVIEWS
        if (selectedTab === profileTabs[1]) {
          const res = await fetch(`/api/user-reviews/${generalUserId}`);
          if (res.ok) {
            const reviews = await res.json();
            // add user data to each review
            reviews.internalReviews = reviews.internalReviews.map(review => ({
              ...review,
              user_id: {
                _id: userProfile?._id,
                username: userProfile?.username,
                userProfilePicture: userProfile?.userProfilePicture,
              },
            }));
            reviews.externalReviews = reviews.externalReviews.map(review => ({
              ...review,
              user_id: {
                _id: userProfile?._id,
                username: userProfile?.username,
              },
            }));
            setMyReviews(reviews);
          } else {
            console.error('Failed to fetch reviews');
          }
          return;
        }

        // TAB 3 -- FAVOURITE RESTAURANT
        if (selectedTab === profileTabs[3]) {
          const profileRes = await fetch(`/api/generals/get-profile-by-dbId?dbId=${generalUserId}`);
          if (!profileRes.ok) {
            console.error('Failed to fetch profile');
            return;
          }

          const profileData = await profileRes.json();
          setUserProfile(profileData.profile);

          const restaurantIds = profileData.profile?.favouriteRestaurants;
          if (!Array.isArray(restaurantIds) || restaurantIds.length === 0) {
            setFavouritedRestaurants([]);
            return;
          }

          const res = await fetch(`/api/restaurants/by-ids`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: restaurantIds }),
          });

          if (res.ok) {
            const data = await res.json();
            // Might use setTimeout to delay the UI update later,
            // so the user can immediately favourite it again if they mistakenly unfavourited it.
            // setTimeout(() => {
            setFavouritedRestaurants(data.restaurants);
            // }, 1000);
          }
          return;
        }

        // TAB 4 -- FAVOURITE BLOG POSTS
        if (selectedTab === profileTabs[4]) {
          const profileRes = await fetch(`/api/generals/get-profile-by-dbId?dbId=${generalUserId}`);
          if (!profileRes.ok) {
            console.error('Failed to fetch profile');
            return;
          }

          const profileData = await profileRes.json();
          setUserProfile(profileData.profile);

          const blogIds = profileData.profile?.favouriteBlogs;
          if (!Array.isArray(blogIds) || blogIds.length === 0) {
            setFavouritedBlogs([]);
            return;
          }

          const postsRes = await fetch(`/api/blog-posts/by-ids`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: blogIds }),
          });

          if (postsRes.ok) {
            const postsData = await postsRes.json();
            // setTimeout(() => {
            setFavouritedBlogs(postsData);
            // }, 1000);
          }
          return;
        }

        // TAB 5 -- FOLLOWERS
        if (selectedTab === profileTabs[5]) {
          const profileRes = await fetch(`/api/generals/get-profile-by-dbId?dbId=${generalUserId}`);
          if (!profileRes.ok) {
            console.error('Failed to fetch profile');
            return;
          }

          const profileData = await profileRes.json();
          setUserProfile(profileData.profile);

          const followerIds = profileData.profile?.followers;
          if (!Array.isArray(followerIds) || followerIds.length === 0) {
            setFollowers([]);
            return;
          }

          const followerRes = await fetch(`/api/generals/get-profiles-by-dbIds`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: followerIds }),
          });

          if (followerRes.ok) {
            const followersData = await followerRes.json();
            // setTimeout(() => {
            setFollowers(followersData.users);
            // }, 1000); // Delay UI update
          }
          return;
        }

        // TAB 6 -- FOLLOWINGS
        if (selectedTab === profileTabs[6]) {
          const profileRes = await fetch(`/api/generals/get-profile-by-dbId?dbId=${generalUserId}`);
          if (!profileRes.ok) {
            console.error('Failed to fetch profile');
            return;
          }

          const profileData = await profileRes.json();
          setUserProfile(profileData.profile);

          const followingIds = profileData.profile?.followings;
          if (!Array.isArray(followingIds) || followingIds.length === 0) {
            setFollowings([]);
            return;
          }

          const followingsRes = await fetch(`/api/generals/get-profiles-by-dbIds`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: followingIds }),
          });

          if (followingsRes.ok) {
            const followingsData = await followingsRes.json();
            // setTimeout(() => {
            setFollowings(followingsData.users);
            // }, 1000); // Delay UI update
          }
          return;
        }
      } catch (err) {
        console.error(`Failed to fetch data for tab: ${selectedTab}`, err);
      }
    };

    fetchTabData();
  }, [selectedTab, generalUserId]);

  // Masonry breakpoints for internal reviews and expanded review side panel
  const breakpointColumnsObj = useMemo(() => {
    return selectedReview
      ? { default: 2, 1024: 2, 640: 1 } // 2 column + expanded panel view
      : { default: 3, 1024: 2, 640: 1 }; // 3 column default view
  }, [selectedReview]);

  // Masonry breakpoints for external reviews (Instagram) and blog posts
  const breakpointColumnsObjInsta = {
    default: 3,
    1024: 3,
    768: 2,
    0: 1,
  };

  if (!userProfile) return <div>Loading profile...</div>;

  // HANDLE DELETE: Blog Post
  const handleDeleteSelectedBlogPost = async () => {
    if (selectedBlogPosts.length === 0) return;
    const res = await fetch('/api/blog-posts/delete-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedBlogPosts, userId: generalUserId }),
    });

    if (res.ok) {
      const updatedPosts = myBlogPosts.filter(post => !selectedBlogPosts.includes(post._id));
      setMyBlogPosts(updatedPosts);
      setSelectedBlogPosts([]);
    }
  };

  const handleDeleteAllBlogPost = async () => {
    const allIds = myBlogPosts.map(post => post._id);
    const res = await fetch('/api/blog-posts/delete-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: allIds, userId: generalUserId }),
    });

    if (res.ok) {
      setMyBlogPosts([]);
      setSelectedBlogPosts([]);
    }
  };

  const handleDeleteSingle = async blogId => {
    const res = await fetch('/api/blog-posts/delete-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [blogId], userId: generalUserId }),
    });

    if (res.ok) {
      setMyBlogPosts(prev => prev.filter(post => post._id !== blogId));
      setSelectedBlogPosts(prev => prev.filter(id => id !== blogId));
    }
  };

  return (
    <MainBaseContainer>
      <GeneralUserBanner
        showTextEditor={showTextEditor}
        setShowTextEditor={setShowTextEditor}
        generalUserData={userProfile}
        isOwner={isOwner}
        editMode={editMode}
        setEditMode={setEditMode}
        handleDeleteSelectedBlogPost={handleDeleteSelectedBlogPost}
        handleDeleteAllBlogPost={handleDeleteAllBlogPost}
        blogPostsCount={myBlogPosts.length}
      />
      <div className="main-side-padding w-full py-8">
        {/**** Tab menu and contents - START ****/}
        {!showTextEditor && (
          <>
            {isOwner ? (
              <ProfileTabBar tabs={profileTabs} onTabChange={setSelectedTab} />
            ) : (
              <ProfileTabBar tabs={filteredTabs} onTabChange={setSelectedTab} />
            )}
            {/* Blog Posts */}
            {selectedTab === profileTabs[0] &&
              (!myBlogPosts || myBlogPosts.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500">No blog posts yet.</div>
              ) : (
                <Masonry breakpointCols={breakpointColumnsObjInsta} className="flex gap-2" columnClassName="space-y-2">
                  {myBlogPosts.map((post, i) => {
                    // Check if this blog post's ID is currently in the list of selected posts
                    const isSelected = selectedBlogPosts.includes(post._id);
                    // Toggle selection on checkbox click
                    const toggleSelect = () => {
                      setSelectedBlogPosts(prev =>
                        // If this post is already selected, remove it from the list
                        prev.includes(post._id)
                          ? prev.filter(id => id !== post._id)
                          : // If it's not selected yet, add it to the list
                            [...prev, post._id]
                      );
                    };

                    return (
                      <BlogPostCard
                        key={post._id || i}
                        blogPostData={post}
                        writtenByOwner={isOwner}
                        setShowTextEditor={setShowTextEditor}
                        setEditBlogPost={() => {
                          setEditBlogPost(true);
                          setEditBlogPostData(post);
                        }}
                        isEditModeOn={editMode}
                        isSelected={isSelected}
                        onSelect={toggleSelect}
                        onDeleteClick={() => handleDeleteSingle(post._id)}
                      />
                    );
                  })}
                </Masonry>
              ))}
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
                    <div className="col-span-3 text-center text-gray-500">No internal reviews yet.</div>
                  ) : (
                    /* internal reviews */
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Masonry
                          breakpointCols={breakpointColumnsObj}
                          className="flex gap-2"
                          columnClassName="space-y-2"
                        >
                          {
                            /* sort reviews by most recently posted */
                            [...myReviews.internalReviews]
                              .sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted))
                              .map((review, i) => (
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
                              ))
                          }
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
                    <div className="col-span-3 text-center text-gray-500">No Instagram reviews yet.</div>
                  ) : (
                    <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-2" columnClassName="space-y-2">
                      {myReviews?.externalReviews.map((review, i) => (
                        <div key={review._id || i} className="mb-4 break-inside-avoid">
                          <InstagramEmbed key={review._id} url={review.content?.embedLink} isEditModeOn={editMode} />
                        </div>
                      ))}
                    </Masonry>
                  ))}
              </>
            )}
            {/* Favourite Restaurants */}
            {selectedTab === profileTabs[3] &&
              (favouritedRestaurants.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500">No favourite restaurants yet.</div>
              ) : (
                <GridCustomCols numOfCols={5}>
                  {favouritedRestaurants.map(restaurant => (
                    <RestaurantCard key={restaurant._id} restaurantData={restaurant} />
                  ))}
                </GridCustomCols>
              ))}
            {/* Favourite Blog Posts */}
            {selectedTab === profileTabs[4] &&
              (favouritedBlogs.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500">No favourite blog posts yet.</div>
              ) : (
                <Masonry breakpointCols={breakpointColumnsObjInsta} className="flex gap-2" columnClassName="space-y-2">
                  {/* {favouritedBlogs.map(blog => (
                  // The "Favourite Blog Posts" should not display posts written by the owner (i.e. isOwner should be false / !isOwner).
                  // However, users may still favourite their own posts — so this logic (false) might be adjusted later.
                  <BlogPostCard key={blog._id} blogPostData={blog} userId={userProfile._id} />
                ))} */}
                  {favouritedBlogs.map((post, i) => (
                    <BlogPostCard
                      key={post._id || i}
                      blogPostData={post}
                      writtenByOwner={isOwner}
                      setShowTextEditor={setShowTextEditor}
                      // Users should not be able to delete or edit anything in favBlogs tab
                      // setEditBlogPost={setEditBlogPost}
                      isEditModeOn={false}
                      isSelected={false} // no selection needed
                      onSelect={() => {}} // do nothing on checkbox click
                      // onDeleteClick={() => {}} // Do NOT show delete functionality in this tab.
                    />
                  ))}
                </Masonry>
              ))}
            {/* My Followers (users who follow owner )*/}
            {selectedTab === profileTabs[5] &&
              (followers.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500">No followers yet.</div>
              ) : (
                <GridCustomCols numOfCols={5}>
                  {followers.map((follower, i) => (
                    <GeneralUserCard key={follower._id} generalUserData={follower} isFollowing={false} />
                  ))}
                </GridCustomCols>
              ))}

            {/* Following (users who are followed by owner )*/}
            {selectedTab === profileTabs[6] &&
              (followings.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500">No followings yet.</div>
              ) : (
                <GridCustomCols numOfCols={5}>
                  {followings.map((following, i) => (
                    <GeneralUserCard key={following._id} generalUserData={following} isFollowing={true} />
                  ))}
                </GridCustomCols>
              ))}
          </>
        )}
        {/**** Tab menu and contents - END ****/}

        {showTextEditor && (
          /* Blog Text Editor */
          <TextEditorStyled
            setShowTextEditor={setShowTextEditor}
            generalUserId={generalUserId}
            editBlogPost={editBlogPost}
            blogPostData={editBlogPostData} // ADDED
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
