//import { faMicroblog } from '@fortawesome/free-brands-svg-icons';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
} from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons';

const reviewCardIconArr = [
  { filled: faThumbsUpSolid, outlined: faThumbsUpRegular }, // Like
  { filled: faCommentDots, outlined: faCommentDots }, // Comments (no filled variant, just solid)
  { filled: faThumbsDownSolid, outlined: faThumbsDownRegular }, // Dislike
];
export default reviewCardIconArr;
