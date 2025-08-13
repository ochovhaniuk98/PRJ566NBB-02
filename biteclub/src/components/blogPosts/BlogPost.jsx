// src/components/blogPosts/BlogPost.jsx
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserData } from '@/context/UserDataContext';
import ReadOnlyEditor from '../tiptap-rich-text-editor/ReadOnlyEditor';
import ReportForm from '../shared/ReportForm';
import CommentThread from '../shared/CommentThread';
import AuthorDateBlurb from '../shared/AuthorDateBlurb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
} from '@fortawesome/free-regular-svg-icons';

import {
  faThumbsUp as faThumbsUpSolid,
  faThumbsDown as faThumbsDownSolid,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';
import FavouriteButton from '../shared/FavouriteButton';

export default function BlogPost({ id }) {
  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info
  const userType = user?.user_metadata.user_type; // Check userType, Business users should not see or interact with blog post
  const { userData, refreshUserData } = useUserData(); // e.g. refresh after Favouriting the post
  const isFavourited = userData?.favouriteBlogs?.includes(id);

  const [blogPost, setBlogPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [postContent, setPostContent] = useState(null);
  const [postTitle, setPostTitle] = useState(null);
  const [numOfFavourites, setNumOfFavourites] = useState(0);

  // author details
  const [username, setUsername] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [fetchedAuthor, setFetchedAuthor] = useState(false);

  // likes/dislikes
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  // for reporting a post
  const [openReportForm, setOpenReportForm] = useState(false);
  const [reportedUser, setReportedUser] = useState(null);

  // for changing icons depending on if user liked/disliked/favourited
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchUserDetails = async id => {
      try {
        if (id) {
          const res = await fetch(`/api/users/get-general-user-by-MgId?id=${id}`);
          if (!res.ok) throw new Error(`Status ${res.status}`);
          const userFromDb = await res.json();

          setUsername(userFromDb.username);
          setProfilePic(userFromDb.userProfilePicture);
          setFetchedAuthor(true);
        }
      } catch (error) {
        console.error('Failed to fetch reported User:', error);
      }
    };

    const fetchAll = async () => {
      try {
        const [postRes, favouritesRes] = await Promise.all([
          fetch(`/api/blog-posts/get-post-by-id/${id}`),
          fetch(`/api/blog-posts/num-of-favourites/${id}`),
        ]);

        if (postRes.status === 404) {
          setNotFound(true);
          return;
        }

        if (!postRes.ok || !favouritesRes.ok) {
          throw new Error('Fetch failed');
        }

        const postData = await postRes.json();
        const favouritesData = await favouritesRes.json();

        setPostContent(postData?.body || null);
        setPostTitle(postData?.title || null);
        setNumOfFavourites(favouritesData.numOfFavourites);
        setBlogPost(postData);

        // set likes
        setLikes(postData?.likes?.count || 0);
        console.log('Likes count: ', postData?.likes?.count || 0);

        // Check if current user has liked the post
        if (postData?.likes?.users?.includes(postData.user_id)) {
          setHasLiked(true);
        } else {
          setHasLiked(false);
        }

        // Check if current user has disliked the post
        if (postData?.dislikes?.users?.includes(postData.user_id)) {
          setHasDisliked(true);
        } else {
          setHasDisliked(false);
        }

        fetchUserDetails(postData.user_id);

        // for reporting a post
        fetchReportedUser(postData.user_id);
      } catch (error) {
        console.error('Error fetching blog post or favourites:', error);
      }
    };
    fetchAll();
  }, [id]);

  // for reporting a post
  // get reported user object
  const fetchReportedUser = async id => {
    try {
      if (id && user?.id) {
        const res = await fetch(`/api/users/get-general-user-by-MgId?id=${id}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const reportedUser = await res.json();

        setReportedUser(reportedUser);
        // console.log('reportedUser', reportedUser);
      }
    } catch (error) {
      console.error('Failed to fetch reported User:', error);
    }
  };

  // TODO: Make filled if already liked/disliked
  // handle like/dislike/favourite
  const handleLike = async () => {
    const res = await fetch('/api/blog-posts/add-like-dislike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: blogPost._id,
        like: true,
        dislike: false,
        userId: blogPost.user_id,
      }),
    });
    if (!res.ok) throw new Error(`Could not add like to a post ${res.status}`);

    const data = await res.json();

    setLikes(data.comment.likes.count);
    setDislikes(data.comment.dislikes.count);

    setHasLiked(true);
    setHasDisliked(false);
  };

  const handleDislike = async () => {
    const res = await fetch('/api/blog-posts/add-like-dislike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: blogPost._id,
        like: false,
        dislike: true,
        userId: blogPost.user_id,
      }),
    });
    if (!res.ok) throw new Error(`Could not add dislike to a post ${res.status}`);

    const data = await res.json();

    setLikes(data.comment.likes.count);
    setDislikes(data.comment.dislikes.count);

    setHasDisliked(true);
    setHasLiked(false);
  };

  // When user save blog-post as favourite
  const handleFavouriteBlogPostClick = async () => {
    try {
      if (!user?.id) return;

      const res = await fetch('/api/blog-posts/save-as-favourite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId: id,
          supabaseUserId: user.id,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to toggle favourite');
      if (userType === 'general') refreshUserData();

      // Re-fetch the updated Favourite count immediately from backend
      const countRes = await fetch(`/api/blog-posts/num-of-favourites/${id}`);
      if (!countRes.ok) {
        throw new Error('Failed to fetch updated favourite count');
      }

      const countData = await countRes.json();
      setNumOfFavourites(countData.numOfFavourites);
    } catch (err) {
      console.error('Error toggling favourite:', err.message);
    }
  };

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Blog post not found</h1>
        <p>The blog post you are trying to visit has been removed or does not exist.</p>
      </div>
    );
  }

  return (
    <>
      {fetchedAuthor && (
        <div className="flex w-full">
          <div className="flex-3/8 mt-20">
            <div className="w-full text-center">
              {postTitle && (
                <div className="simple-editor-content align-center font-primary text-4xl font-medium">{postTitle}</div>
              )}
            </div>
            {/* author + engagement icons*/}
            <div className="m-auto mt-8 border-b-1 border-brand-peach py-1 w-xl flex justify-between items-end cursor-pointer">
              {/* author */}
              <AuthorDateBlurb authorPic={profilePic.url} authorName={username} date={blogPost?.date_posted} />
              <div className="flex flex-row gap-x-2 font-primary font-medium text-brand-grey">
                {/* thumbs up */}
                <div className="flex items-center w-10" onClick={handleLike}>
                  <FontAwesomeIcon
                    icon={hasLiked ? faThumbsUpSolid : faThumbsUpRegular}
                    className="icon-lg text-brand-navy mr-1"
                  />
                  {likes}
                </div>
                {/* thumbs down */}
                <div className="flex items-center w-10" onClick={handleDislike}>
                  <FontAwesomeIcon
                    icon={hasDisliked ? faThumbsDownSolid : faThumbsDownRegular}
                    className="icon-lg text-brand-navy mr-1"
                  />
                </div>
                {/* favourite */}
                <FavouriteButton
                  handleFavouriteToggle={handleFavouriteBlogPostClick}
                  isFavourited={isFavourited}
                  numOfFavourites={numOfFavourites}
                />
                {/*<div className="flex items-center w-10" onClick={handleFavouriteToggle}>
              <FontAwesomeIcon
                icon={isFavourited ? faHeartSolid : faHeartRegular}
                className={`icon-lg mr-1 ${isFavourited ? 'text-brand-red' : 'text-brand-navy'}`}
              />
              {numOfFavourites ?? 0}
            </div>*/}
                {/* 
            <SingleTabWithIcon
              icon={faHeart}
              detailText={numOfFavourites ?? 0}
            />*/}
                {/* show Report form when flag icon is clicked */}
                <FontAwesomeIcon
                  icon={faFlag}
                  className={`icon-lg text-brand-navy`}
                  onClick={e => {
                    setOpenReportForm(prev => !prev);
                  }}
                />
              </div>
            </div>
            {postContent && <ReadOnlyEditor content={postContent} />}

            {/* Report Content Form */}
            {openReportForm && (
              <ReportForm
                onClose={() => setOpenReportForm(false)}
                contentTitle={postTitle}
                contentType="BlogPost"
                contentId={blogPost._id}
                reportedUser={reportedUser}
              />
            )}
          </div>
          {/* comments thread for blog post */}
          <div className="flex-[1]">
            <CommentThread post={blogPost} />
          </div>
        </div>
      )}
    </>
  );
}
