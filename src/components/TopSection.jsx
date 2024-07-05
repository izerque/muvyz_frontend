import React, { useState } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';

const TopSection = ({ setMuvies }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [searchedMovie, setSearchedMovie] = useState(null); // State to store the found movie

  // Handle input change
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchedMovie(null); // Clear the movie card when the input is cleared
      setSearchMessage('');
    }
  };

  // Handle search logic
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setSearchMessage('Please enter a movie title to search.');
      return;
    }

    try {
      const response = await axios.get(`{process.env.REACT_APP_API_URL}/muvies?title=${searchInput}`);
      const data = response.data;

      if (data.length > 0) {
        setSearchedMovie(data[0]); // Assuming the first movie is the one we're looking for
        setSearchMessage('');
      } else {
        setSearchedMovie(null); // Clear any previous search results
        setSearchMessage('Movie not available in the database.');
      }
    } catch (error) {
      console.error('Error searching movie:', error);
      setSearchMessage('An error occurred while searching for the movie.');
    }
  };

  return (
    <div className="h-[300px] border-2 border-white w-full bg-cover bg-center relative" style={{ backgroundImage: 'url("/cover.jpg")' }}>
      <div className="bg-gray-900 opacity-90 w-full h-full justify-center items-center flex flex-col text-center">
        <h1 className="text-4xl text-white font-bold">
          Movie <span className='text-[#3a6ed6]'> . Hub</span>
        </h1>
        <p className="text-font-light text-gray-200 mt-4">create your Faverate movie Database </p>
        <p className='font-thin text-gray-400'> click add button to add movies and they will display</p>
        <div className="p-4 text-white flex gap-4 w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search movies in database..."
            value={searchInput}
            onChange={handleInputChange}
            className="px-4 py-2 w-full rounded-full border border-gray-300 text-white bg-gray-900"
          />
          <button
            className="bg-[#3a6ed6] text-white font-bold py-2 px-4 rounded-full w-[150px] border-none"
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {searchMessage && <p className="text-white mt-4">{searchMessage}</p>}
        {/* Render the movie card here if a movie is found */}
        {searchedMovie && (
          <div className="mt-4 flex justify-center">
            <MovieCard movie={searchedMovie} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSection;

