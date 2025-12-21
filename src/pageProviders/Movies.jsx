import MoviesPage from "pages/movies/movies";
import React from "react";

import PageContainer from "./components/PageContainer";

const Movies = (props) => {
  return (
    <PageContainer>
      <MoviesPage {...props} />
    </PageContainer>
  );
};

export default Movies;
