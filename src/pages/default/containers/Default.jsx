import { useIntl } from "react-intl";

import { createUseStyles } from "react-jss";
import useTheme from "misc/hooks/useTheme";

import React from "react";
import Typography from "components/Typography";
import Button from "components/Button";
import Link from "components/Link";
import pagesURLs from "constants/pagesURLs";
import * as pages from "constants/pages";

const getClasses = createUseStyles((theme) => ({
  content: ({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(5),
  }),
}));

function Default() {
  const { formatMessage } = useIntl();

  const { theme } = useTheme();
  const classes = getClasses({ theme });

  return (
    <>
      <Typography>{formatMessage({ id: "title" })}</Typography>

      <div className={classes.content}>
        <Link
          to={{
            pathname: `${pagesURLs[pages.moviesPage]}`,
          }}
        >
          <Button colorVariant="primary" variant="text">
            <Typography color="inherit" variant="subtitle">
              {formatMessage({ id: "clickMe" })}
            </Typography>
          </Button>
        </Link>
      </div>
    </>
  );
}

export default Default;
