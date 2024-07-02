import React, { useState, useEffect } from 'react';
import { FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";



const MovieCard = ({ movie, onDelete }) => {
  return (
    <div className="movie-card w-[280px]">
      {movie && (
        <div className='border border-gray-200'>
          <div
          className="movie-thumbnail bg-cover h-[200px] "
          style={{backgroundImage: `url(${movie.thumbnail})`}}
        >  
        </div>
        <div className="movie-details bg-gray-800 flex flex-col h-[90px] justify-evenly p-2 overflow-hidden">
            <h2 className='text-gray-200 font-bold text-start text-[14px] trancate'>{movie.title}</h2>
            <div className='flex justify-between gap-8 items-center'>
              <div className='w-4/12 flex justify-center items-center gap-4'>
              <p className='text-gray-500 text-sm font-medium trancate'>{movie.year}</p>
            <p className='text-gray-300 text-ms font-regular w-[40px] gap-2 flex justify-center items-center h-[40px]'><span className='flex text-orange-500 justify-center items-center'><FaStar /></span> {movie.rating}</p>
            </div>
            <MdDelete className='text-gray-500 cursor-pointer hover:text-gray-200' onClick={() => onDelete(movie.id)}  />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;