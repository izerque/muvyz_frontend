import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import { MdOutlineSort } from "react-icons/md";

const ListContainer = () => {
  const [muvies, setMuvies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newMovie, setNewMovie] = useState({ title: '', year: '', rating: '', thumbnail: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchMuvies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/muvies');
        const data = response.data;
        setMuvies(data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching muvies:', error);
      }
    };

    fetchMuvies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/muvies', newMovie);
      setShowForm(false);
      setNewMovie({ title: '', year: '', rating: '', thumbnail: '' });
      const response = await axios.get('http://localhost:5000/muvies');
      setMuvies(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=1d5e0453`);
        setSearchResults(response.data.Search || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleMovieSelect = async (movie) => {
    setSearchQuery(movie.Title);
    setSearchResults([]);
    setSelectedMovie(movie);

    try {
      const response = await axios.get(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=1d5e0453`);
      const data = response.data;
      setNewMovie({
        title: data.Title,
        year: data.Year,
        rating: data.imdbRating || '',
        thumbnail: data.Poster,
      });
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/muvies/${id}`);
      setMuvies((prevMuvies) => prevMuvies.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const handleSort = () => {
    const sortedMuvies = [...muvies].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setMuvies(sortedMuvies);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className='w-9/12 mx-auto p-4'>
     
      <div className='flex justify-between px-10'>
        <p className='text-gray-400 text-start'>Favourite Movies</p>
        <div className='flex w-[200px] justify-between items-center'>
          <MdOutlineSort
            className='text-gray-600 flex w-[30px] h-[30px] justify-between items-center cursor-pointer'
            onClick={handleSort}
          />
          <button
            className="bg-[#3a6ed6] text-white font-bold rounded-full w-[150px] h-[40px] border-none"
            type="button"
            onClick={() => setShowForm(!showForm)}
          >
            + Add movie
          </button>
        </div>
      </div>

      {showForm && (
        <div className='mt-4 w-7/12 mx-auto p-4 border rounded bg-gray-900'>
          <p className='text-white font-md'>Add a Movie to the database</p>
          <form onSubmit={handleFormSubmit} className='gap-6'>
            <div className='mb-4'>
              <label className='block text-gray-700'>Movie Title</label>
              <input
                type='text'
                name='title'
                value={searchQuery}
                placeholder='Search for a movie'
                onChange={handleSearchChange}
                className='mt-1 p-2 border rounded w-10/12 px-4 py-2 border-gray-300 text-white bg-gray-900'
                required
              />
              {searchResults.length > 0 && (
                <ul className='mt-2 bg-gray-800 border border-gray-600 rounded list-none'>
                  {searchResults.map((result) => (
                    <li
                      key={result.imdbID}
                      onClick={() => handleMovieSelect(result)}
                      className='p-2 mx-auto hover:bg-gray-700 border-b border-gray-6 cursor-pointer text-gray-400'
                    >
                      {result.Title} ({result.Year})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Movie Year</label>
              <input
                type='number'
                name='year'
                value={newMovie.year}
                placeholder='Enter year of release "2021"'
                onChange={handleInputChange}
                className='mt-1 p-2 border rounded w-10/12 px-4 py-2 border-gray-300 text-white bg-gray-900'
                required
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Rating</label>
              <input
                type='number'
                step='0.1'
                name='rating'
                value={newMovie.rating}
                placeholder='Enter rating'
                onChange={handleInputChange}
                className='mt-1 p-2 border rounded w-10/12 px-4 py-2 border-gray-300 text-white bg-gray-900'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Thumbnail Link</label>
              <input
                type='text'
                name='thumbnail'
                value={newMovie.thumbnail}
                placeholder='Enter movie poster link'
                onChange={handleInputChange}
                className='mt-1 p-2 border rounded w-10/12 px-4 py-2 border-gray-300 text-white bg-gray-900'
                required
              />
            </div>
            <div className='flex justify-center'>
              <button
                type='submit'
                className='text-white py-2 px-4 bg-[#3a6ed6] font-bold rounded-full w-[150px] h-[40px] border-none'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="list-container flex gap-4 w-full mx-auto mt-10" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
        {muvies.map((muvy) => (
          <MovieCard key={muvy.id} movie={muvy} onDelete={handleDeleteMovie} />
        ))}
      </div>
    </div>
  );
};

export default ListContainer;
