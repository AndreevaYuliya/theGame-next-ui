import { useContext } from "react";
import { MoviesContext } from "misc/providers/MoviesProvider";

/**
@return {
  id,
  title,
  director,
  year,
  genres,
  images,
}
**/

const useMovies = () => useContext(MoviesContext);

export default useMovies;
