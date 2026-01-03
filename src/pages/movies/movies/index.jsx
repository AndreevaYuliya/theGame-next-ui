import React, { useMemo } from "react";

import IntlProvider from "misc/providers/IntlProvider";
import useLocationSearch from "misc/hooks/useLocationSearch";

import getMessages from "./intl";
import MoviesList from "./containers/MoviesList";

function Index(props) {
  const { lang } = useLocationSearch();

  const messages = useMemo(() => getMessages(lang), [lang]);

  return (
    <IntlProvider messages={messages}>
      <MoviesList {...props} />
    </IntlProvider>
  );
}

export default Index;
