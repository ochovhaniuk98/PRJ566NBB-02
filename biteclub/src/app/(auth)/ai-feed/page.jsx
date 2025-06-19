// app/page.jsx   – Next 13/14 (App Router, client component)
// Demo: user rates 3 restaurants *and* answers preference questions,
// then asks the Flask recommender for 5 suggestions.

'use client';

import { useState } from 'react';

const RESTAURANTS = [
  "Burger's Priest (Yonge & Eglinton)",
  'Sushi Zone',
  'Kung Fu Tea (Broadview)',
];

export default function HomePage() {
  /* ----------------------------------------------------- form state */
  const [ratings, setRatings] = useState({});
  const [favCuisines, setFavCuisines] = useState('');
  const [dietaryPrefs, setDietaryPrefs] = useState('');
  const [likeliness, setLikeliness] = useState(3);
  const [frequency, setFrequency] = useState(3);
  const [difficulty, setDifficulty] = useState(3);
  const [diversity, setDiversity] = useState(3);

  /* --------------------------------------------------- result state */
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ---------------------------------------------------- handlers */
  const handleRatingChange = (name, value) =>
    setRatings((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRecommendations([]);
    setLoading(true);

    const ratedItems = Object.entries(ratings)
      .filter(([, v]) => v >= 1 && v <= 5)
      .map(([restaurant, rating]) => ({ restaurant, rating: Number(rating) }));

    if (ratedItems.length === 0) {
      setError('Rate at least one restaurant (1-5).');
      setLoading(false);
      return;
    }

    const payload = {
      ratings: ratedItems,
      favouriteCuisines: favCuisines
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      dietaryPreferences: dietaryPrefs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      likelinessToTryFood: Number(likeliness),
      restaurantFrequency: Number(frequency),
      decisionDifficulty: Number(difficulty),
      openToDiversity: Number(diversity),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_RECOMMENDER_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------- UI */
  return (
    <main className="flex min-h-screen flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-semibold">Restaurant Recommender Demo</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        {/* ratings */}
        <h2 className="font-medium">Rate these restaurants (1-5)</h2>
        {RESTAURANTS.map((name) => (
          <label key={name} className="flex flex-col">
            <span className="mb-1">{name}</span>
            <input
              type="number"
              min="1"
              max="5"
              value={ratings[name] ?? ''}
              onChange={(e) => handleRatingChange(name, e.target.value)}
              className="rounded border px-2 py-1"
              placeholder="1-5"
            />
          </label>
        ))}

        {/* preferences */}
        <h2 className="font-medium mt-4">Your preferences</h2>

        <label className="flex flex-col">
          <span className="mb-1">Favourite cuisines (comma-separated)</span>
          <input
            type="text"
            value={favCuisines}
            onChange={(e) => setFavCuisines(e.target.value)}
            className="rounded border px-2 py-1"
            placeholder="e.g. Thai, Mexican"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1">Dietary preferences (comma-separated)</span>
          <input
            type="text"
            value={dietaryPrefs}
            onChange={(e) => setDietaryPrefs(e.target.value)}
            className="rounded border px-2 py-1"
            placeholder="e.g. Vegan, Halal"
          />
        </label>

        {/* numeric prefs 1-5 */}
        {[
          ['Likeliness to try new food', likeliness, setLikeliness],
          ['Restaurant visit frequency', frequency, setFrequency],
          ['Decision difficulty', difficulty, setDifficulty],
          ['Open-mindedness to diversity', diversity, setDiversity],
        ].map(([label, val, setter]) => (
          <label key={label} className="flex flex-col">
            <span className="mb-1">{label} (1-5)</span>
            <input
              type="number"
              min="1"
              max="5"
              value={val}
              onChange={(e) => setter(e.target.value)}
              className="rounded border px-2 py-1"
            />
          </label>
        ))}

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50 mt-2"
          disabled={loading}
        >
          {loading ? 'Finding...' : 'Get Recommendations'}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {recommendations.length > 0 && (
        <section className="mt-4 w-full max-w-md">
          <h2 className="text-xl mb-2">Recommendations</h2>
          <ul className="list-disc list-inside">
            {recommendations.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
