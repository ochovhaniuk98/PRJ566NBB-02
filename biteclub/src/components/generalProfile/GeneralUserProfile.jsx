'use client';

import { useEffect, useState, useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import Masonry from 'react-masonry-css';
import GridCustomCols from '@/components/shared/GridCustomCols';
import MainBaseContainer from '@/components/shared/MainBaseContainer';
import ProfileTabBar from '@/components/shared/ProfileTabBar';
import GeneralUserBanner from '@/components/generalProfile/GeneralUserBanner';
import GeneralUserCard from '@/components/generalProfile/GeneralUserCard';
import RestaurantCard from '../restaurantProfile/RestaurantCard';
import BlogPostCard from '@/components/shared/BlogPostCard';
import ReviewCard from '@/components/shared/ReviewCard';
import ReviewCardExpanded from '../restaurantProfile/ReviewCardExpanded';
import InstagramEmbed from '../restaurantProfile/InstagramEmbed';
import AddReviewForm from '../shared/AddReviewForm';
import StarRating from '../shared/StarRating';
import TextEditorStyled from '@/components/generalProfile/TextEditorStyled';
import Spinner from '@/components/shared/Spinner';
import { Button } from '../shared/Button';

// GENERAL USER DASHBOARD
export default function GeneralUserProfile({ isOwner = false, generalUserId }) {
  // =============
  // USERS RELATED
  // =============
  const { user } = useUser(); // Current logged-in user's Supabase info
  const { userData, loadingData, refreshUserData } = useUserData(); // Current logged-in user's MongoDB data (User / BusinessUser Object)
  const [userProfile, setUserProfile] = useState(null); // could be current user or another general user

  // Display on Public Toggle (Yes / No)
  const [displayFavouriteRestaurants, setDisplayFavouriteRestaurants] = useState(false);
  const [displayFavouriteBlogPosts, setDisplayFavouriteBlogPosts] = useState(false);
  const [displayVisitedPlaces, setDisplayVisitedPlaces] = useState(false);

  // All tabs data
  const [myBlogPosts, setMyBlogPosts] = useState([]);
  const [myReviews, setMyReviews] = useState({
    internalReviews: [],
    externalReviews: [],
  });
  const [showInstaReview, setShowInstaReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [favouritedRestaurants, setFavouritedRestaurants] = useState([]);
  const [favouritedBlogs, setFavouritedBlogs] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  // General profile Management
  const [editMode, setEditMode] = useState(false); // tracks whether owner wants to manage CONTENT on profile (displays edit/delete panel on each card)
  const [selectedInternalReviews, setSelectedInternalReviews] = useState([]);
  const [selectedExternalReviews, setSelectedExternalReviews] = useState([]);
  const [editReviewForm, setEditReviewForm] = useState(false); // for opening/closing form to edit a SPECIFIC REVIEW
  const [reviewRating, setReviewRating] = useState({ value: 0, message: '' }); // stores the updated rating value the owner gives when editing a review
  const [editReviewData, setEditReviewData] = useState(null);
  const [triggerReviewRefresh, setTriggerReviewRefresh] = useState(false); // help with update the review tabs after Adding or Editing a review

  const [selectedBlogPosts, setSelectedBlogPosts] = useState([]);
  const [editBlogPost, setEditBlogPost] = useState(false); // tracks whether text editor is adding a NEW post or EDITING an existing one
  const [editBlogPostData, setEditBlogPostData] = useState(null);

  // Ask for user confirmation: on "DELETE ALL" for Blog Posts or Reviews
  const [showModal, setShowModal] = useState(false);
  const [deleteAllTarget, setDeleteAllTarget] = useState(''); // 'reviews' or 'blogPosts'
  const [confirmationText, setConfirmationText] = useState('');

  // States
  const [loading, setLoading] = useState(true);

  // ===============
  // TABS MANAGEMENT
  // ===============

  const profileTabs = [
    'Blog Posts',
    'Reviews',
    'Visited',
    'Favourite Restaurants',
    'Favourite Blog Posts',
    'Followers', // instead of 'My Followers', the profile might not be yours.
    'Following',
  ];
  const [selectedTab, setSelectedTab] = useState(profileTabs[0]);
  const [showTextEditor, setShowTextEditor] = useState(false);

  // Loading states for each tabs
  const [loadingStates, setLoadingStates] = useState({
    blogs: true,
    reviews: false,
    favRestaurants: false,
    favBlogs: false,
    followers: false,
    followings: false,
  });

  const filteredTabs = profileTabs.filter((tab, index) => {
    if (index === 2 && !displayVisitedPlaces) return false; // Tab 2 - visited places
    if (index === 3 && !displayFavouriteRestaurants) return false; // Tab 3 - favourite restaurants
    if (index === 4 && !displayFavouriteBlogPosts) return false; // Tab 4 - favourite blog posts
    return true;
  });

  // =============
  // DATA FETCHING
  // =============
  // USER PROFILE PREFERENCE & TAB 0 -- BLOG POSTS
  useEffect(() => {
    const fetchProfileAndBlogs = async () => {
      setLoadingStates(prev => ({ ...prev, blogs: true }));

      try {
        let profile = isOwner ? userData : userProfile;

        // Fetch profile if needed
        if (!isOwner && !profile && generalUserId) {
          const res = await fetch(`/api/generals/get-profile-by-dbId?dbId=${generalUserId}`);
          if (!res.ok) {
            console.error('Failed to fetch profile');
            return;
          }
          const { profile: fetchedProfile } = await res.json();
          profile = fetchedProfile;
          setUserProfile(profile); // cache
        }

        // If owner and not yet cached, cache it
        if (isOwner && !userProfile) {
          setUserProfile(userData);
        }

        if (!profile) return;

        // Fetch blog posts
        const postsRes = await fetch(`/api/blog-posts/get-posts-by-userId/${profile._id}`);
        if (!postsRes.ok) {
          console.error('Failed to fetch blog posts');
          return;
        }
        const postsData = await postsRes.json();
        setMyBlogPosts(postsData);

        // Update display toggles
        setDisplayFavouriteRestaurants(profile.displayFavouriteRestaurants);
        setDisplayFavouriteBlogPosts(profile.displayFavouriteBlogPosts);
        setDisplayVisitedPlaces(profile.displayVisitedPlaces);
      } catch (err) {
        console.error('(GeneralUserProfile) Failed to fetch blog post data:', err);
      } finally {
        setLoadingStates(prev => ({ ...prev, blogs: false }));
        setLoading(false);
      }
    };

    // Run only when Blog tab is selected
    if ((generalUserId || isOwner) && selectedTab === profileTabs[0]) {
      fetchProfileAndBlogs();
    }
  }, [selectedTab, generalUserId, isOwner, userData, loadingData, showTextEditor, userProfile]);

  // THEN: Load data ONLY when the tab is selected
  useEffect(() => {
    if (!userProfile?._id || !selectedTab) return;

    const fetchTabData = async () => {
      try {
        // TAB 1 -- REVIEWS
        if (selectedTab === profileTabs[1]) {
          setLoadingStates(prev => ({ ...prev, reviews: true }));
          try {
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
          } catch (err) {
            console.error('Error fetching reviews:', err);
          } finally {
            setLoadingStates(prev => ({ ...prev, reviews: false }));
          }
          return;
        }

        // TAB 2 -- VISITED
        /*
      if (selectedTab === profileTabs[2]) {
        return;
      }
      */

        // TAB 3 -- FAVOURITE RESTAURANT
        if (selectedTab === profileTabs[3]) {
          setLoadingStates(prev => ({ ...prev, favRestaurants: true }));
          try {
            if (!userProfile?.favouriteRestaurants) return;
            const restaurantIds = userProfile.favouriteRestaurants;
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
              const { restaurants } = await res.json();
              // Might use setTimeout to delay the UI update later,
              // so the user can immediately favourite it again if they mistakenly unfavourited it.
              // setTimeout(() => {
              setFavouritedRestaurants(restaurants);
              // }, 1000);
            }
          } catch (err) {
            console.error('Error fetching favourite restaurants:', err);
          } finally {
            setLoadingStates(prev => ({ ...prev, favRestaurants: false }));
          }
          return;
        }

        // TAB 4 -- FAVOURITE BLOG POSTS
        if (selectedTab === profileTabs[4]) {
          setLoadingStates(prev => ({ ...prev, favBlogs: true }));
          try {
            if (!userProfile?.favouriteBlogs) return;
            const blogIds = userProfile.favouriteBlogs;

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
          } catch (err) {
            console.error('Error fetching favourite blog posts:', err);
          } finally {
            setLoadingStates(prev => ({ ...prev, favBlogs: false }));
          }
          return;
        }

        // TAB 5 -- FOLLOWERS
        if (selectedTab === profileTabs[5]) {
          setLoadingStates(prev => ({ ...prev, followers: true }));
          try {
            if (!userProfile?.followers) return;
            const followerIds = userProfile.followers;
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
          } catch (err) {
            console.error('Error fetching followers:', err);
          } finally {
            setLoadingStates(prev => ({ ...prev, followers: false }));
          }
          return;
        }

        // TAB 6 -- FOLLOWINGS
        if (selectedTab === profileTabs[6]) {

          setLoadingStates(prev => ({ ...prev, followings: true }));
          try {
            if (!userProfile?.followings) return;
            const followingIds = userProfile.followings;
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
          } catch (err) {
            console.error('Error fetching followings:', err);
          } finally {
            setLoadingStates(prev => ({ ...prev, followings: false }));
          }
          return;
        }
      } catch (err) {
        console.error(`Failed to fetch data for tab: ${selectedTab}`, err);
      }
    };

    fetchTabData();
  }, [selectedTab, generalUserId, triggerReviewRefresh]);

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

  if (loading || !userProfile) return <Spinner message="Loading Profile..." />;

  // =======
  // HANDLES
  // =======

  // DELETE BLOG POSTS
  // -----------------
  const handleDeleteSelectedBlogPosts = async () => {
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

  const handleDeleteAllBlogPosts = async () => {
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

  const handleDeleteSingleBlogPost = async blogId => {
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

  // DELETE REVIEWS -- INTERNAL AND EXTERNAL
  // ---------------------------------------
  const handleDeleteSelectedReviews = async () => {
    if (selectedInternalReviews.length === 0 && selectedExternalReviews.length === 0) return;

    const res = await fetch('/api/user-reviews/delete-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: generalUserId,
        internalReviewIds: selectedInternalReviews,
        externalReviewIds: selectedExternalReviews,
      }),
    });

    if (res.ok) {
      setMyReviews(prev => ({
        internalReviews: prev.internalReviews.filter(review => !selectedInternalReviews.includes(review._id)),
        externalReviews: prev.externalReviews.filter(review => !selectedExternalReviews.includes(review._id)),
      }));
      setSelectedInternalReviews([]);
      setSelectedExternalReviews([]);
    }
  };

  const handleDeleteAllReviews = async () => {
    const allInternalIds = myReviews.internalReviews.map(review => review._id);
    const allExternalIds = myReviews.externalReviews.map(review => review._id);

    const res = await fetch('/api/user-reviews/delete-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: generalUserId,
        internalReviewIds: allInternalIds,
        externalReviewIds: allExternalIds,
      }),
    });

    if (res.ok) {
      setMyReviews({ internalReviews: [], externalReviews: [] });
      setSelectedInternalReviews([]);
      setSelectedExternalReviews([]);
    }
  };

  const handleDeleteSingleReview = async (reviewId, type = 'internal') => {
    const body = {
      userId: generalUserId,
      internalReviewIds: type === 'internal' ? [reviewId] : [],
      externalReviewIds: type === 'external' ? [reviewId] : [],
    };

    const res = await fetch('/api/user-reviews/delete-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMyReviews(prev => ({
        internalReviews:
          type === 'internal' ? prev.internalReviews.filter(r => r._id !== reviewId) : prev.internalReviews,
        externalReviews:
          type === 'external' ? prev.externalReviews.filter(r => r._id !== reviewId) : prev.externalReviews,
      }));
      if (type === 'internal') {
        setSelectedInternalReviews(prev => prev.filter(id => id !== reviewId));
      } else {
        setSelectedExternalReviews(prev => prev.filter(id => id !== reviewId));
      }
    }
  };

  return (
    <MainBaseContainer>
      <GeneralUserBanner
        showTextEditor={showTextEditor}
        setShowTextEditor={setShowTextEditor}
        generalUserData={userProfile}
        isOwner={isOwner}
        // editMode={editMode}
        editMode={
          editMode && (selectedTab === profileTabs[0] || selectedTab === profileTabs[1]) // Show only when it is Blog Posts or Reviews tab
        }
        setEditMode={setEditMode}
        selectedTab={selectedTab}
        handleDeleteSelectedBlogPosts={handleDeleteSelectedBlogPosts}
        handleDeleteAllBlogPosts={handleDeleteAllBlogPosts}
        blogPostsCount={myBlogPosts.length}
        handleDeleteSelectedReviews={handleDeleteSelectedReviews}
        handleDeleteAllReviews={handleDeleteAllReviews}
        setShowModal={setShowModal}
        setDeleteAllTarget={setDeleteAllTarget}
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
              (loadingStates.blogs ? (
                <Spinner message="Loading blog posts..." />
              ) : myBlogPosts?.length === 0 ? (
                <div className="col-span-3 text-center">
                  <p>No blog posts yet.</p>
                </div>
              ) : (
                <Masonry breakpointCols={breakpointColumnsObjInsta} className="flex gap-2" columnClassName="space-y-2">
                  {myBlogPosts.map((post, i) => {
                    const isSelected = selectedBlogPosts.includes(post._id);
                    const toggleSelect = () => {
                      setSelectedBlogPosts(prev =>
                        prev.includes(post._id) ? prev.filter(id => id !== post._id) : [...prev, post._id]
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
                        onDeleteClick={() => handleDeleteSingleBlogPost(post._id)}
                      />
                    );
                  })}
                </Masonry>
              ))}

            {/* Reviews */}
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
                {loadingStates.reviews ? (
                  <Spinner message="Loading reviews..." />
                ) : !showInstaReview ? (
                  myReviews?.internalReviews.length === 0 ? (
                    <div className="col-span-3 text-center">
                      <p>No internal reviews yet.</p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Masonry
                          breakpointCols={breakpointColumnsObj}
                          className="flex gap-2"
                          columnClassName="space-y-2"
                        >
                          {[...myReviews.internalReviews]
                            .sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted))
                            .map((review, i) => (
                              <ReviewCard
                                key={review._id || i}
                                review={review}
                                photos={review.photos}
                                isOwner={isOwner}
                                setEditReviewForm={() => {
                                  setEditReviewForm(true);
                                  setEditReviewData(review);
                                }}
                                onClick={() => setSelectedReview(review)}
                                isEditModeOn={editMode && selectedTab === profileTabs[1]}
                                isSelected={selectedInternalReviews.includes(review._id)}
                                onSelect={() => {
                                  setSelectedInternalReviews(prev =>
                                    prev.includes(review._id)
                                      ? prev.filter(id => id !== review._id)
                                      : [...prev, review._id]
                                  );
                                }}
                                onDeleteClick={() => handleDeleteSingleReview(review._id, 'internal')}
                              />
                            ))}
                        </Masonry>
                      </div>
                      {selectedReview && (
                        <ReviewCardExpanded
                          selectedReview={selectedReview}
                          onClose={() => setSelectedReview(null)}
                          isOwner={isOwner}
                        />
                      )}
                    </div>
                  )
                ) : myReviews?.externalReviews.length === 0 ? (
                  <div className="col-span-3 text-center">
                    <p>No Instagram reviews yet.</p>
                  </div>
                ) : (
                  <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-2" columnClassName="space-y-2">
                    {myReviews?.externalReviews.map((review, i) => (
                      <div key={review._id || i} className="mb-4 break-inside-avoid">
                        <InstagramEmbed
                          key={review._id}
                          url={review.content?.embedLink}
                          isEditModeOn={editMode}
                          isSelected={selectedExternalReviews.includes(review._id)}
                          onSelect={() => {
                            setSelectedExternalReviews(prev =>
                              prev.includes(review._id) ? prev.filter(id => id !== review._id) : [...prev, review._id]
                            );
                          }}
                          onDeleteClick={() => handleDeleteSingleReview(review._id, 'external')}
                        />
                      </div>
                    ))}
                  </Masonry>
                )}
              </>
            )}

            {/* Favourite Restaurants */}
            {selectedTab === profileTabs[3] &&
              (loadingStates.favRestaurants ? (
                // <div className="col-span-3 text-center">
                //   <p>Loading favourite restaurants...</p>
                // </div>
                <Spinner message="Loading favourite restaurants..." />
              ) : favouritedRestaurants.length === 0 ? (
                <div className="col-span-3 text-center">
                  <p>No favourite restaurants yet.</p>
                </div>
              ) : (
                <GridCustomCols numOfCols={5}>
                  {favouritedRestaurants.map(restaurant => (
                    <RestaurantCard key={restaurant._id} restaurantData={restaurant} />
                  ))}
                </GridCustomCols>
              ))}

            {/* Favourite Blog Posts */}
            {selectedTab === profileTabs[4] &&
              (loadingStates.favBlogs ? (
                <Spinner message="Loading favourite blog posts..." />
              ) : favouritedBlogs.length === 0 ? (
                <div className="col-span-3 text-center">
                  <p>No favourite blog posts yet.</p>
                </div>
              ) : (
                <Masonry breakpointCols={breakpointColumnsObjInsta} className="flex gap-2" columnClassName="space-y-2">
                  {favouritedBlogs.map((post, i) => (
                    <BlogPostCard
                      key={post._id || i}
                      blogPostData={post}
                      writtenByOwner={isOwner}
                      setShowTextEditor={setShowTextEditor}
                      isEditModeOn={false}
                      isSelected={false}
                      onSelect={() => {}}
                    />
                  ))}
                </Masonry>
              ))}

            {/* My Followers */}
            {selectedTab === profileTabs[5] &&
              (loadingStates.followers ? (
                <Spinner message="Loading followers..." />
              ) : followers.length === 0 ? (
                <div className="col-span-3 text-center">
                  <p>No followers yet.</p>
                </div>
              ) : (
                <GridCustomCols numOfCols={5}>
                  {followers.map((follower, i) => (
                    <GeneralUserCard key={follower._id} generalUserData={follower} isFollowing={false} />
                  ))}
                </GridCustomCols>
              ))}

            {/* Followings */}
            {selectedTab === profileTabs[6] &&
              (loadingStates.followings ? (
                <Spinner message="Loading followings..." />
              ) : followings.length === 0 ? (
                <div className="col-span-3 text-center">
                  <p>No followings yet.</p>
                </div>
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
        <AddReviewForm
          onCancel={() => {
            setEditReviewForm(false);
            setEditReviewData(null);
          }}
          editReviewMode={true}
          reviewData={editReviewData}
          onReviewSaved={() => setTriggerReviewRefresh(prev => !prev)}
        >
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

      {/* ASK FOR CONFIRMATION: If user would like to use "DELETE ALL" */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">Confirm Content Deletion</h2>
            <p className="mb-4 text-sm text-gray-700">
              Are you sure you want to delete{' '}
              <strong>
                all {deleteAllTarget === 'reviews' ? 'reviews (Both BiteClub and Instagram)' : 'blog posts'}
              </strong>
              ? This action is
              <strong> irreversible</strong>. Please type <code>DELETE</code> to confirm.
            </p>

            <input
              type="text"
              className="w-full border px-3 py-2 mb-4"
              value={confirmationText}
              onChange={e => setConfirmationText(e.target.value)}
              placeholder="Type DELETE"
            />

            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={confirmationText !== 'DELETE'}
                onClick={() => {
                  if (deleteAllTarget === 'reviews') {
                    handleDeleteAllReviews();
                  } else if (deleteAllTarget === 'blogPosts') {
                    handleDeleteAllBlogPosts();
                  }
                  setShowModal(false);
                  setConfirmationText('');
                }}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainBaseContainer>
  );
}
