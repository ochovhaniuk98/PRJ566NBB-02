export function getDaysRemaining(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diffInMs = end - now;
  return Math.max(0, Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));
}
