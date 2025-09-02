// components/Liked.js
import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";

export default function Liked({ songId, onChange }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch initial like status (GET) using localStorage authentication
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        // Get auth token from localStorage (same as playlists)
        const session = localStorage.getItem('session');
        if (!session) return;

        const sessionData = JSON.parse(session);
        if (!sessionData.access_token) return;

        const res = await fetch(`/api/songs/${songId}/like-status`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionData.access_token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            // User not authenticated, don't show like status
            return;
          }
          throw new Error("Failed to fetch like status");
        }
        
        const data = await res.json();
        setLiked(data.user_liked);
      } catch (err) {
        console.error("Error fetching like status:", err);
      }
    };

    if (songId) fetchLikeStatus();
  }, [songId]);

  // Toggle like/unlike using localStorage authentication
  const toggleLike = async () => {
    setLoading(true);
    try {
      // Get auth token from localStorage (same as playlists)
      const session = localStorage.getItem('session');
      if (!session) {
        throw new Error("Authentication required. Please log in.");
      }

      const sessionData = JSON.parse(session);
      if (!sessionData.access_token) {
        throw new Error("Authentication required. Please log in.");
      }

      const res = await fetch(`/api/songs/${songId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.access_token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Authentication required. Please log in.");
        }
        throw new Error("Failed to toggle like");
      }

      const data = await res.json();
      setLiked(data.user_liked);

      // ✅ Notify parent (FavoritesPage)
      if (onChange) onChange(data.user_liked, songId);
    } catch (err) {
      console.error("Error toggling like:", err);
      if (err.message.includes('Authentication required')) {
        alert('Please log in to like songs');
      } else {
        alert('Failed to update like status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className="p-3 rounded-full transition duration-300"
    >
      <FaHeart
        className={`text-3xl transition duration-300 ${
          liked ? "text-red-500 scale-110" : "text-gray-400"
        }`}
      />
    </button>
  );
}
