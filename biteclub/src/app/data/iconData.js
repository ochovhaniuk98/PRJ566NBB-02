//import { faMicroblog } from '@fortawesome/free-brands-svg-icons';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import {
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
} from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons';

const reviewCardIconArr = [
  { filled: faThumbsUpSolid, outlined: faThumbsUpRegular }, // Like
  { filled: faThumbsDownSolid, outlined: faThumbsDownRegular }, // Dislike
  { filled: faCommentDots, outlined: faCommentDots }, // Comments (no filled variant, just solid)
];
export default reviewCardIconArr;
