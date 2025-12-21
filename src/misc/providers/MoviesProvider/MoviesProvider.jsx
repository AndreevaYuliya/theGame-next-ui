import React, { createContext } from "react";
import { useSelector } from "react-redux";

export const MoviesContext = createContext({});

const MoviesProvider = ({ children }) => {
  const movies = useSelector(({ movies }) => movies);
  return (
    <MoviesContext.Provider
      value={{
        id: movies.id,
        title: movies.title,
        director: movies.director,
        year: movies.year,
        genres: movies.genres,
        images: movies.images,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export default MoviesProvider;
