export const formatEmbedLink = link => {
  try {
    const url = new URL(link);
    url.search = '';
    url.hash = '';
    const cleanedUrl = url.toString();
    const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/p\/[a-zA-Z0-9_-]+\/?$/;
    return instagramRegex.test(cleanedUrl) ? cleanedUrl : null;
  } catch {
    return null;
  }
};
