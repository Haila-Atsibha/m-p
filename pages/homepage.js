"use client"; 
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import ImageCard from "./Card";
import MusicCard from "./Music";

export default function Homepage({ songs, onSongPlay, searchQuery,setSearchQuery }) {
  return (
    <>

      <div className="bg-black bg-cover flex flex-col min-h-screen relative">

       
        <p className="text-amber-50 text-[40px] font-bold p-3 rounded-2xl absolute left-1 top-1">
          Muzio
        </p>

      
        <div className="relative mb-[50px] mt-[20px]">
          <div className="absolute right-3">
            <Link
              href={"/signup"}
              className="text-amber-50 text-[20px] font-bold bg-transparent border-2 border-amber-50 max-h-[100px] p-3 m-2 rounded-2xl hover:bg-amber-50 hover:text-black transition-colors duration-300"
            >
              Create An Account
            </Link>
            <Link
              href={"/login"}
              className="text-amber-50 text-[20px] font-bold bg-transparent border-2 border-amber-50 max-h-[100px] p-3 m-2 rounded-2xl hover:bg-amber-50 hover:text-black transition-colors duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

       
        <div
          className="relative w-full min-h-[500px] p-6 flex flex-col bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/img4.jpg')",
          }}
        >
          
          <p className="text-[3.5rem] font-bold text-amber-50 mb-8 max-w-2xl animate-fadeIn">
            The world&apos;s Finest Music Streaming Platform
          </p>

          
          <div className="flex flex-wrap justify-center gap-6 w-full">
            
            <ImageCard className="bg-white/10 backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300" />
          </div>
        </div>

        <div className="flex justify-center w-full mt-10">
          <div className="relative w-full max-w-[400px]">
            <input
              type="text"
              className="w-full h-[50px] rounded-2xl border-2 border-amber-50 bg-cyan-950 text-white pl-4 pr-12 placeholder-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 transition-shadow duration-300"
              placeholder="Search..."
             value={searchQuery} 
             onChange={e => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 transition-colors duration-300">
              <FaSearch />
            </button>
          </div>
        </div>

<div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {(Array.isArray(songs) && songs.length > 0) ? (
    songs.map((song) => (
      <MusicCard
        key={song.id}
        id={song.id}
        src={song.storage_url}
        title={song.title}
        image={song.cover_url}
        artist={song.artist}
        album={song.album}
        onPlay={() => onSongPlay(song)}
      />
    ))
  ) : (
    <div className="text-[#8EBBFF] text-lg col-span-3 text-center">
      {searchQuery ? `No songs found for "${searchQuery}"` : "Loading songs..."}
    </div>
  )}
</div>
<div className="flex justify-center items-center w-full">
  <p className="text-[2.5rem] font-bold text-amber-50 max-w-2xl animate-fadeIn text-center">
    <Link  href={"/login"} className="hover:text-amber-300 transition-colors duration-200">Login</Link> for more songs
  </p>
</div>

        <footer className="bg-cyan-950 text-white py-10 mt-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-bold text-amber-400">MusicWave</h1>
              <p className="text-gray-300">
                Stream your favorite music anytime, anywhere.
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <h2 className="font-semibold text-lg text-amber-400">Navigation</h2>
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Home</a>
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Browse</a>
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Genres</a>
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Radio</a>
            </div>

            <div className="flex flex-col space-y-2">
              <h2 className="font-semibold text-lg text-amber-400">Support</h2>
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Help Center</a>
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-amber-300 transition-colors duration-200">Contact</a>
            </div>

            <div className="flex flex-col space-y-2">
              <h2 className="font-semibold text-lg text-amber-400">Follow Us</h2>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="hover:text-amber-300 transition-colors duration-200">Facebook</a>
                <a href="#" className="hover:text-amber-300 transition-colors duration-200">Twitter</a>
                <a href="#" className="hover:text-amber-300 transition-colors duration-200">Instagram</a>
                <a href="#" className="hover:text-amber-300 transition-colors duration-200">YouTube</a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} MusicWave. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
