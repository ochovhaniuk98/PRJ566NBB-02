import { useState } from 'react';

export function useSubmitExternalReview({ restaurantId, userId, onSuccess }) {
  const [embedLink, setEmbedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatEmbedLink = link => {
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

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formattedLink = formatEmbedLink(embedLink);
    if (!formattedLink) {
      setError('Invalid Instagram post link format');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/submit-external-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embedLink: formattedLink, userId, restaurantId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit Instagram link');
      }

      onSuccess?.();
    } catch (err) {
      setError(err.message);
      console.error('Error submitting Instagram link:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    embedLink,
    setEmbedLink,
    loading,
    error,
    handleSubmit,
  };
}
