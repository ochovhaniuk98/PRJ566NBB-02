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
  faHeart as faHeartRegular,
} from '@fortawesome/free-regular-svg-icons';

import {
  faThumbsUp as faThumbsUpSolid,
  faThumbsDown as faThumbsDownSolid,
  faHeart as faHeartSolid,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';
import FavouriteButton from '../shared/FavouriteButton';

export default function BlogPost({ id }) {
  const [blogPost, setBlogPost] = useState(null);
  const [postContent, setPostContent] = useState(null);
  const [postTitle, setPostTitle] = useState(null);
  const [numOfFavourites, setNumOfFavourites] = useState(0);

  // for reporting a post
  const [openReportForm, setOpenReportForm] = useState(false);
  const [reportedUser, setReportedUser] = useState(null);

  // for changing icons depending on if user liked/disliked/favourited
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);

  const { user } = useUser() ?? { user: null }; // Current logged-in user's Supabase info
  const userType = user?.user_metadata.user_type;
  const { refreshUserData } = useUserData();

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      try {
        const [postRes, favouritesRes] = await Promise.all([
          fetch(`/api/blog-posts/get-post-by-id/${id}`),
          fetch(`/api/blog-posts/num-of-favourites/${id}`),
        ]);

        if (!postRes.ok || !favouritesRes.ok) {
          throw new Error('Fetch failed');
        }

        const postData = await postRes.json();
        const favouritesData = await favouritesRes.json();

        setPostContent(postData?.body || null);
        setPostTitle(postData?.title || null);
        setNumOfFavourites(favouritesData.numOfFavourites);
        setBlogPost(postData);

        // for reporting a post
        fetchReportedUser(postData.user_id);
      } catch (error) {
        console.error('Error fetching blog post or favourites:', error);
      }
    };
    fetchAll();
  }, [id]);

  useEffect(() => {
    const checkFavouriteStatus = async () => {
      try {
        if (!user?.id) return;

        const res = await fetch(`/api/blog-posts/is-favourited?authId=${user.id}&blogId=${id}`);
        const result = await res.json();
        if (res.ok) setIsFavourited(result.isFavourited);
      } catch (err) {
        console.error('Error checking favourite status:', err.message);
      }
    };
    checkFavouriteStatus();
  }, [id, user?.id]);

  // for reporting a post
  // get reported user object
  const fetchReportedUser = async id => {
    try {
      if (id && user?.id) {
        const res = await fetch(`/api/users/get-general-user-by-MgId?id=${id}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const reportedUser = await res.json();

        setReportedUser(reportedUser);
        console.log('reportedUser', reportedUser);
      }
    } catch (error) {
      console.error('Failed to fetch reported User:', error);
    }
  };

  // handle like/dislike/favourite
  const handleLike = () => {
    setHasLiked(prev => !prev);
    setHasDisliked(false);
    // NOT CONNECTED TO BACKEND YET
  };

  const handleDislike = () => {
    setHasDisliked(prev => !prev);
    setHasLiked(false);
    // NOT CONNECTED TO BACKEND YET
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
      setIsFavourited(result.isFavourited);
      if(userType === 'general') refreshUserData();

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

  return (
    <div className="flex w-full">
      <div className="flex-3/8 mt-20">
        <div className="w-full text-center">
          {postTitle && (
            <div className="simple-editor-content align-center font-primary text-4xl font-medium">{postTitle}</div>
          )}
        </div>
        {/* author + engagement icons*/}
        <div className="m-auto mt-8 border-b-1 border-brand-peach py-1 w-xl flex justify-between items-center cursor-pointer">
          {/* author */}
          <AuthorDateBlurb
            authorPic={'https://i.pravatar.cc/80?u=placeholder'}
            authorName={'Blogpost Authorname'}
            date={blogPost?.date_posted}
          />
          <div className="flex flex-row gap-x-2 font-primary font-medium text-brand-grey">
            {/* thumbs up */}
            <div className="flex items-center w-10" onClick={handleLike}>
              <FontAwesomeIcon
                icon={hasLiked ? faThumbsUpSolid : faThumbsUpRegular}
                className="icon-lg text-brand-navy mr-1"
              />
              0
            </div>
            {/* thumbs down */}
            <div className="flex items-center w-10" onClick={handleDislike}>
              <FontAwesomeIcon
                icon={hasDisliked ? faThumbsDownSolid : faThumbsDownRegular}
                className="icon-lg text-brand-navy mr-1"
              />
              0
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
  );
}
