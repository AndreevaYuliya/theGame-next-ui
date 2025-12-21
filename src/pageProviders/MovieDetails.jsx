import MovieDetailsPage from "pages/movies/moviesDetails";
import React from "react";

import PageContainer from "./components/PageContainer";

const MovieDetails = (props) => {
  return (
    <PageContainer>
      <MovieDetailsPage {...props} />
    </PageContainer>
  );
};

export default MovieDetails;
