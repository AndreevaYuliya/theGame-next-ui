import React, { useEffect, useState } from "react";

import { createUseStyles } from "react-jss";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router-dom";

import actionsMovies from "app/actions/movies";

import useTheme from "misc/hooks/useTheme";

import Button from "components/Button";
import IconButton from "components/IconButton";
import IconTrash from "components/icons/Trash";
import IconBack from "components/icons/Back";
import IconForward from "components/icons/Forward";
import TextField from "components/TextField";
import Typography from "components/Typography";
import Link from "components/Link";

import pagesURLs from "constants/pagesURLs";
import * as pages from "constants/pages";
import {
  DEFAULT_MOVIES_PAGE,
  DEFAULT_MOVIES_SIZE,
} from "../constants/moviesConstants";

const getClasses = createUseStyles({
  container: ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    color: theme.colors.text.primary,
  }),

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  filterBox: ({ theme }) => ({
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(2),
    border: `1px solid ${theme.pageContainer.border}`,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    background: theme.colors.background.edit,
  }),

  filterFields: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12,
  },

  filterActions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
  },

  list: {
    marginTop: 16,
    height: "100%",
  },

  row: ({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    border: `1px solid ${theme.pageContainer.border}`,
    borderRadius: 8,
    marginBottom: 10,
    cursor: "pointer",
    background: theme.colors.background.secondary,

    "&:hover": {
      background: theme.hover.background,
    },

    "&:hover $trash": {
      opacity: 1,
    },
  }),

  contentContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },

  right: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  button: {
    display: "flex",
    gap: 10,
  },

  trash: {
    opacity: 0,
    transition: "opacity 0.15s ease",
  },

  pagination: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: "auto",
    justifyContent: "space-between",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: ({ theme }) => ({
    width: 420,
    background: theme.colors.background.secondary,
    color: theme.colors.text.primary,
    borderRadius: 12,
    padding: 16,
    border: `1px solid ${theme.pageContainer.border}`,
  }),

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },

  errorText: ({ theme }) => ({
    color: theme.colors.text.error,
    marginTop: 8,
  }),

  toast: ({ theme }) => ({
    position: "fixed",
    top: 80,
    right: 150,
    padding: "10px 14px",
    borderRadius: 10,
    background: theme.colors.background.tertiary,
    color: theme.colors.text.primary,
    border: `1px solid ${theme.pageContainer.border}`,
    zIndex: 1100,
  }),
});

function MoviesListPage() {
  const { theme } = useTheme();
  const classes = getClasses({ theme });

  const { formatMessage } = useIntl();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? DEFAULT_MOVIES_PAGE);
  const titleFromUrl = searchParams.get("title") ?? "";
  const yearFromUrl = searchParams.get("yearFrom") ?? "";
  const yearToUrl = searchParams.get("yearTo") ?? "";

  const { items, totalPages, loading, deleteError, deletingId } = useSelector(
    (s) => s.movies
  );
  const toast = useSelector((s) => s.toast);

  const [title, setTitle] = useState(titleFromUrl);
  const [yearFrom, setYearFrom] = useState(yearFromUrl);
  const [yearTo, setYearTo] = useState(yearToUrl);

  const [deleteMovie, setDeleteMovie] = useState(null);

  useEffect(() => {
    setTitle(titleFromUrl);
    setYearFrom(yearFromUrl);
    setYearTo(yearToUrl);
  }, [titleFromUrl, yearFromUrl, yearToUrl]);

  useEffect(() => {
    const filters = {};

    if (titleFromUrl) {
      filters.title = titleFromUrl;
    }

    if (yearFromUrl) {
      filters.yearFrom = yearFromUrl;
    }

    if (yearToUrl) {
      filters.yearTo = yearToUrl;
    }

    dispatch(
      actionsMovies.fetchMovies({
        page,
        DEFAULT_MOVIES_SIZE,
        filters,
      })
    );
  }, [dispatch, page, titleFromUrl, yearFromUrl, yearToUrl]);

  const applyFilter = () => {
    const params = {
      page: String(DEFAULT_MOVIES_PAGE),
      size: String(DEFAULT_MOVIES_SIZE),
    };

    if (title.trim()) {
      params.title = title.trim();
    }

    if (yearFrom.trim()) {
      params.yearFrom = yearFrom.trim();
    }

    if (yearTo.trim()) {
      params.yearTo = yearTo.trim();
    }

    setSearchParams(params);
  };

  const resetFilter = () => {
    setTitle("");
    setYearFrom("");
    setYearTo("");
    setSearchParams({
      page: String(DEFAULT_MOVIES_PAGE),
      size: String(DEFAULT_MOVIES_SIZE),
    });
  };

  const goPrev = () => {
    if (page === DEFAULT_MOVIES_PAGE) {
      return;
    }

    const params = {
      page: String(page - 1),
      size: String(DEFAULT_MOVIES_SIZE),
    };

    if (titleFromUrl) {
      params.title = titleFromUrl;
    }

    if (yearFromUrl) {
      params.yearFrom = yearFromUrl;
    }

    if (yearToUrl) {
      params.yearTo = yearToUrl;
    }
    setSearchParams(params);
  };

  const goNext = () => {
    if (page + 1 >= totalPages) {
      return;
    }

    const params = {
      page: String(page + 1),
      size: String(DEFAULT_MOVIES_SIZE),
    };

    if (titleFromUrl) {
      params.title = titleFromUrl;
    }

    if (yearFromUrl) {
      params.yearFrom = yearFromUrl;
    }

    if (yearToUrl) {
      params.yearTo = yearToUrl;
    }
    setSearchParams(params);
  };

  const confirmDelete = async () => {
    const ok = await dispatch(actionsMovies.fetchDeleteMovie(deleteMovie.id));

    if (ok) {
      setDeleteMovie(null);

      if (items.length === 1 && page > DEFAULT_MOVIES_PAGE) {
        const params = {
          page: String(page - 1),
          size: String(DEFAULT_MOVIES_SIZE),
        };

        if (titleFromUrl) {
          params.title = titleFromUrl;
        }

        if (yearFromUrl) {
          params.yearFrom = yearFromUrl;
        }

        if (yearToUrl) {
          params.yearTo = yearToUrl;
        }

        setSearchParams(params);
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerRow}>
        <Typography variant="title">
          <strong>{formatMessage({ id: "movies.title" })}</strong>
        </Typography>

        <Link
          to={{
            pathname: `${pagesURLs[pages.movieDetailsPage]}/new`,
            search: searchParams.toString()
              ? `?${searchParams.toString()}`
              : "",
          }}
          state={{ fromSearch: searchParams.toString() }}
        >
          <Button colorVariant="primary" variant="primary">
            <Typography color="inherit">
              {formatMessage({ id: "btn.addEntity" })}
            </Typography>
          </Button>
        </Link>
      </div>

      <div className={classes.filterBox}>
        <div className={classes.filterFields}>
          <TextField
            fullWidth
            label={formatMessage({ id: "filters.label.title" })}
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            fullWidth
            label={formatMessage({ id: "filters.label.yearFrom" })}
            variant="outlined"
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
          />

          <TextField
            fullWidth
            label={formatMessage({ id: "filters.label.yearTo" })}
            variant="outlined"
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
          />
        </div>

        <div className={classes.filterActions}>
          <Button
            colorVariant="secondary"
            onClick={resetFilter}
            variant="secondary"
          >
            <Typography>{formatMessage({ id: "filters.clear" })}</Typography>
          </Button>

          <Button
            colorVariant="primary"
            onClick={applyFilter}
            variant="primary"
          >
            <Typography color="inherit">
              {formatMessage({ id: "filters.apply" })}
            </Typography>
          </Button>
        </div>
      </div>

      <div className={classes.list}>
        {loading && <div>{formatMessage({ id: "movies.loading" })}</div>}

        {!loading &&
          items.map((movie) => (
            <div
              key={movie.id}
              className={classes.row}
              onClick={() =>
                navigate(
                  {
                    pathname: `${pagesURLs[pages.movieDetailsPage]}/${
                      movie.id
                    }`,
                    search: searchParams.toString()
                      ? `?${searchParams.toString()}`
                      : "",
                  },
                  { state: { fromSearch: searchParams.toString() } }
                )
              }
            >
              <div className={classes.contentContainer}>
                <img src={movie.image} alt={movie.title} height="215" />

                <div>
                  <b>{movie.title}</b>

                  <div>{movie.yearReleased}</div>
                </div>
              </div>
              <div
                className={classes.right}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={classes.trash}>
                  <IconButton onClick={() => setDeleteMovie(movie)}>
                    <IconTrash size={32} />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className={classes.pagination}>
        <Button
          colorVariant="primary"
          disabled={page === DEFAULT_MOVIES_PAGE || loading}
          onClick={goPrev}
          variant="secondary"
          className={classes.button}
        >
          <IconBack color="primary" size={24} />

          <Typography color="inherit">
            {formatMessage({ id: "btn.prevPage" })}
          </Typography>
        </Button>

        <span>
          {page + 1} / {totalPages || 1}
        </span>

        <Button
          colorVariant="primary"
          disabled={loading || page + 1 >= totalPages}
          onClick={goNext}
          variant="primary"
          className={classes.button}
        >
          <Typography color="inherit">
            {formatMessage({ id: "btn.nextPage" })}
          </Typography>

          <IconForward color="primary" size={24} />
        </Button>
      </div>

      {deleteMovie && (
        <div
          className={classes.modalOverlay}
          onClick={() => setDeleteMovie(null)}
        >
          <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{formatMessage({ id: "delete.confirmTitle" })}</h3>

            <p>
              {formatMessage(
                { id: "delete.confirmationMessage" },
                { movieTitle: deleteMovie.title }
              )}
            </p>

            {deleteError && (
              <div className={classes.errorText}>{deleteError.message}</div>
            )}

            <div className={classes.modalActions}>
              <Button
                colorVariant="secondary"
                onClick={() => setDeleteMovie(null)}
                variant="secondary"
              >
                <Typography>{formatMessage({ id: "btn.cancel" })}</Typography>
              </Button>

              <Button
                colorVariant="primary"
                onClick={confirmDelete}
                variant="primary"
                disabled={deletingId === deleteMovie.id}
              >
                <Typography color="inherit">
                  {deletingId === deleteMovie.id
                    ? "Deleting..."
                    : formatMessage({ id: "btn.confirm" })}
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast?.visible && <div className={classes.toast}>{toast.message}</div>}
    </div>
  );
}

export default MoviesListPage;
