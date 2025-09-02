// pages/favorites.js
import { useState, useEffect } from "react";
import MusicCard from "./Music";
import Sidebar from "../components/Sidebar";
import BottomPlayerBar from "../components/BottomPlayerBar";
import { FaHeart } from "react-icons/fa";
import Liked from "./components/Liked";
import { fetchFavorites } from "../lib/music-api";

export default function FavoritesPage() {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch all liked songs using music-api function
  const fetchFavoritesData = async () => {
    setLoading(true);
    try {
      const data = await fetchFavorites();
      setSongs(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      if (err.message.includes('Authentication required')) {
        setError("Please log in to view your favorites.");
        setSongs([]);
      } else {
        setError("Failed to load favorites. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritesData();
  }, []);

  const handleSongPlay = (song) => {
    const index = songs.findIndex(s => s.id === song.id);
    if (index !== -1) setCurrentIndex(index);
  };

  // Refresh favorites when a song is liked/unliked
  const handleLikeChange = () => {
    fetchFavoritesData(); // re-fetch favorites list
  };


  return (
    <div className="flex min-h-screen bg-[#24293E]">
      <Sidebar />
      <main className="flex-1 pl-56 bg-cover min-h-screen pb-28">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#F4F5FC] flex items-center gap-3">
              <FaHeart className="text-red-500" />
              My Favorites
            </h1>
            {songs.length > 0 && (
              <div className="text-[#8EBBFF]">
                {songs.length} favorite{songs.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-[#8EBBFF] text-lg">Loading favorites...</div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <FaHeart className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-[#F4F5FC] mb-2">{error}</p>
              <p className="text-[#8EBBFF]">Please log in to view your favorites</p>
            </div>
          ) : songs.length === 0 ? (
            <div className="text-center py-16">
              <FaHeart className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-[#F4F5FC] mb-2">No favorite songs yet</p>
              <p className="text-[#8EBBFF]">Start adding songs to your favorites!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {songs.map((song) => (
                <MusicCard
                  key={song.id}
                  id={song.id}
                  src={song.storage_url}
                  title={song.title}
                  image={song.cover_url}
                  artist={song.artist}
                  album={song.album}
                  onPlay={() => handleSongPlay(song)}
                >
                  <Liked songId={song.id} onChange={handleLikeChange} />
                </MusicCard>
              ))}
            </div>
          )}
        </div>
      </main>
    {currentIndex !== null && (
  <BottomPlayerBar
    playlist={songs}
    currentIndex={currentIndex}
    setCurrentIndex={setCurrentIndex}
    artist={songs[currentIndex]?.artist}
    onClose={() => setCurrentIndex(null)}
  />
)}
    </div>
  );
}
