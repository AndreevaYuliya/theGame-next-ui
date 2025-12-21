import React, { useEffect, useMemo, useState } from "react";

import { createUseStyles } from "react-jss";
import { useIntl } from "react-intl";

import useTheme from "misc/hooks/useTheme";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import actionsMovieDetails from "app/actions/movieDetails";

import Typography from "components/Typography";
import Button from "components/Button";
import TextField from "components/TextField";
import Select from "components/Select";
import MenuItem from "components/MenuItem";
import pagesURLs from "constants/pagesURLs";
import * as pages from "constants/pages";
import IconButton from "components/IconButton";
import IconBack from "components/icons/Back";
import IconEdit from "components/icons/Edit";
import * as errorCodes from "../constants/errorCodes";

const getClasses = createUseStyles((theme) => ({
  container: ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    color: theme.colors.text.primary,
  }),

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  content: {
    display: "flex",
    flexDirection: "row",
    gap: 36,
    marginTop: 16,
    marginBottom: 16,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 16,
    maxWidth: 600,
  },

  rightContent: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  buttons: {
    display: "flex",
    gap: `${theme.spacing(1)}px`,
    justifyContent: "space-between",
  },

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
}));

const minMovieYear = 1880;
const maxMovieYear = new Date().getFullYear();
const minMovieRating = 0.0;
const maxMovieRating = 10.0;

function MovieDetailsPage() {
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { movieId } = useParams();

  const isNew = movieId === "new";
  const [mode, setMode] = useState(isNew ? "edit" : "view");

  const {
    title,
    image,
    description,
    genres,
    director,
    rating,
    year,
    loading,
    errors,
  } = useSelector((s) => s.movieDetails);
  const toast = useSelector((s) => s.toast);

  const [form, setForm] = useState({
    title: "",
    image: "",
    rating: "",
    year: "",
    directorId: null,
    country: "",
    genres: "",
    description: "",
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [externalErrors, setExternalErrors] = useState([]);
  const [directors, setDirectors] = useState([]);

  const backToList = () => {
    const search =
      location.state?.fromSearch || location.search.replace(/^\?/, "");
    navigate(
      {
        pathname: pagesURLs[pages.moviesPage],
        search: search ? `?${search}` : "",
      },
      { replace: true }
    );
  };

  const hasError = (code) =>
    validationErrors.some((err) => (err?.code || err) === code);

  const getFormatError = (target) =>
    validationErrors.find(
      (err) =>
        err?.code === errorCodes.INVALID_MOVIE_DATA_FORMAT &&
        err.target === target
    );

  const getMovieValidationErrors = () => {
    const errs = [];
    if (!form.title) {
      errs.push({ code: errorCodes.EMPTY_MOVIE_TITLE });
    }
    if (!form.directorId) {
      errs.push({ code: errorCodes.EMPTY_MOVIE_DIRECTOR });
    }

    if (!form.year) {
      errs.push({ code: errorCodes.INVALID_MOVIE_YEAR });
    } else if (Number.isNaN(Number(form.year))) {
      errs.push({
        code: errorCodes.INVALID_MOVIE_DATA_FORMAT,
        field: formatMessage({ id: "field.year" }),
        format: "number",
        target: "year",
      });
    } else {
      const yearNum = Number(form.year);
      if (yearNum < minMovieYear) {
        errs.push({ code: errorCodes.MOVIE_YEAR_TOO_LOW });
      } else if (yearNum > maxMovieYear) {
        errs.push({ code: errorCodes.MOVIE_YEAR_TOO_HIGH });
      }
    }

    if (!form.rating && form.rating !== 0) {
      errs.push({ code: errorCodes.INVALID_MOVIE_RATING });
    } else if (Number.isNaN(Number(form.rating))) {
      errs.push({
        code: errorCodes.INVALID_MOVIE_DATA_FORMAT,
        field: formatMessage({ id: "field.rating" }),
        format: "number",
        target: "rating",
      });
    } else {
      const ratingNum = Number(form.rating);
      if (ratingNum < minMovieRating) {
        errs.push({ code: errorCodes.MOVIE_RATING_TOO_LOW });
      } else if (ratingNum > maxMovieRating) {
        errs.push({ code: errorCodes.MOVIE_RATING_TOO_HIGH });
      }
    }
    return errs;
  };

  const tError = (code, values) =>
    formatMessage({ id: `movie.error.${code}`, defaultMessage: code }, values);

  /* ----------- EFFECTS ----------- */
  useEffect(() => {
    dispatch(actionsMovieDetails.fetchDirectors()).then((res) => {
      if (Array.isArray(res)) {
        setDirectors(res);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (!isNew) {
      dispatch(actionsMovieDetails.fetchMovieDetails(movieId));
    } else {
      dispatch(actionsMovieDetails.receiveMovieDetails({}));
    }
  }, [dispatch, isNew, movieId]);

  useEffect(() => {
    return () => {
      dispatch(actionsMovieDetails.requestMovieDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!errors || errors.length === 0) {
      setExternalErrors([]);
      return;
    }
    const errorCodeValues = Object.values(errorCodes);
    const messages = errors.map((error) =>
      errorCodeValues.includes(error.code)
        ? formatMessage(
            { id: `movie.error.${error.code}` },
            error.values || error
          )
        : error.description
    );
    setExternalErrors(messages);
  }, [errors, formatMessage]);

  useEffect(() => {
    setForm({
      title: title || "",
      image: image || "",
      rating: rating?.toString() ?? "",
      year: year || "",
      directorId: director?.id ?? null,
      country: director?.country || "",
      genres: genres || "",
      description: description || "",
    });
  }, [title, image, rating, year, director, genres, description]);

  const handleCancel = () => {
    if (isNew) {
      backToList();
    } else {
      setValidationErrors([]);
      setExternalErrors([]);
      setForm({
        title: title || "",
        image: image || "",
        rating: rating?.toString() ?? "",
        year: year || "",
        directorId: director?.id ?? null,
        genres: genres || "",
        description: description || "",
      });
      setMode("view");
    }
  };

  const handleSave = async () => {
    const vErrors = getMovieValidationErrors();
    if (vErrors.length) {
      setValidationErrors(vErrors);
      return;
    }
    setValidationErrors([]);
    setExternalErrors([]);

    if (isNew) {
      const res = await dispatch(
        actionsMovieDetails.fetchCreateMovie({
          title: form.title,
          image: form.image,
          rating: Number(form.rating),
          yearReleased: Number(form.year),
          directorId: form.directorId,
          genres: form.genres,
          description: form.description,
        })
      );
      if (res?.id) {
        navigate(
          {
            pathname: `${pagesURLs[pages.movieDetailsPage]}/${res.id}`,
            search: location.state?.fromSearch
              ? `?${location.state.fromSearch}`
              : location.search,
          },
          {
            state: {
              fromSearch:
                location.state?.fromSearch ||
                location.search.replace(/^\?/, ""),
            },
          }
        );
        setMode("view");
      }
    } else {
      const res = await dispatch(
        actionsMovieDetails.fetchUpdateMovie(movieId, {
          title: form.title,
          image: form.image,
          rating: Number(form.rating),
          yearReleased: Number(form.year),
          directorId: form.directorId,
          genres: form.genres,
          description: form.description,
        })
      );
      if (res) {
        setMode("view");
      }
    }
  };

  const ratingHelper = useMemo(() => {
    if (hasError(errorCodes.INVALID_MOVIE_RATING))
      return tError(errorCodes.INVALID_MOVIE_RATING);
    if (hasError(errorCodes.MOVIE_RATING_TOO_LOW))
      return tError(errorCodes.MOVIE_RATING_TOO_LOW, { min: minMovieRating });
    if (hasError(errorCodes.MOVIE_RATING_TOO_HIGH))
      return tError(errorCodes.MOVIE_RATING_TOO_HIGH, { max: maxMovieRating });
    return "";
  }, [validationErrors, formatMessage]);

  const yearHelper = useMemo(() => {
    if (hasError(errorCodes.INVALID_MOVIE_YEAR))
      return tError(errorCodes.INVALID_MOVIE_YEAR);
    if (hasError(errorCodes.MOVIE_YEAR_TOO_LOW))
      return tError(errorCodes.MOVIE_YEAR_TOO_LOW, { min: minMovieYear });
    if (hasError(errorCodes.MOVIE_YEAR_TOO_HIGH))
      return tError(errorCodes.MOVIE_YEAR_TOO_HIGH, { max: maxMovieYear });
    return "";
  }, [validationErrors, formatMessage]);

  return (
    <div className={classes.container}>
      <div className={classes.headerRow}>
        <IconButton onClick={backToList}>
          <IconBack />
        </IconButton>

        {mode === "view" && !isNew && (
          <IconButton onClick={() => setMode("edit")}>
            <IconEdit />
          </IconButton>
        )}
      </div>

      {loading ? (
        <div>
          {formatMessage({ id: "movieDetails.loading" }) || "Loading..."}
        </div>
      ) : mode === "view" ? (
        <div>
          <Typography variant="title" color="inherit">
            <strong>
              {title || formatMessage({ id: "movieDetails.title" })}
            </strong>
          </Typography>
          <div className={classes.content}>
            {image && <img src={image} alt={title} width={400} />}
            <div className={classes.rightContent}>
              {rating && (
                <Typography>
                  <strong>
                    {formatMessage({ id: "movieDetails.rating" })}
                  </strong>
                  {rating}
                </Typography>
              )}

              {year && (
                <Typography>
                  <strong>{formatMessage({ id: "movieDetails.year" })}</strong>
                  {year}
                </Typography>
              )}

              {director?.country && (
                <Typography>
                  <strong>
                    {formatMessage({ id: "movieDetails.country" })}
                  </strong>
                  {director?.country}
                </Typography>
              )}

              {director?.name && (
                <Typography>
                  <strong>
                    {formatMessage({ id: "movieDetails.director" })}
                  </strong>
                  {director?.name}
                </Typography>
              )}

              {genres && (
                <Typography>
                  <strong>
                    {formatMessage({ id: "movieDetails.genres" })}
                  </strong>
                  {genres}
                </Typography>
              )}
            </div>
          </div>

          {description && (
            <Typography>
              <strong>
                {formatMessage({ id: "movieDetails.description" })}
              </strong>
              <br />
              {description}
            </Typography>
          )}
        </div>
      ) : (
        <div className={classes.form}>
          <TextField
            required
            label={formatMessage({ id: "field.title" })}
            isError={hasError(errorCodes.EMPTY_MOVIE_TITLE)}
            helperText={
              hasError(errorCodes.EMPTY_MOVIE_TITLE)
                ? tError(errorCodes.EMPTY_MOVIE_TITLE)
                : ""
            }
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, title: target.value }))
            }
            value={form.title}
          />
          <TextField
            label={formatMessage({ id: "field.image" })}
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, image: target.value }))
            }
            value={form.image}
          />
          <TextField
            required
            label={formatMessage({ id: "field.rating" })}
            isError={
              hasError(errorCodes.INVALID_MOVIE_RATING) ||
              hasError(errorCodes.MOVIE_RATING_TOO_LOW) ||
              hasError(errorCodes.MOVIE_RATING_TOO_HIGH) ||
              !!getFormatError("rating")
            }
            helperText={
              getFormatError("rating")
                ? formatMessage(
                    { id: "movie.error.INVALID_MOVIE_DATA_FORMAT" },
                    getFormatError("rating")
                  )
                : ratingHelper
            }
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, rating: target.value }))
            }
            value={form.rating}
          />
          <TextField
            required
            label={formatMessage({ id: "field.year" })}
            isError={
              hasError(errorCodes.INVALID_MOVIE_YEAR) ||
              hasError(errorCodes.MOVIE_YEAR_TOO_LOW) ||
              hasError(errorCodes.MOVIE_YEAR_TOO_HIGH) ||
              !!getFormatError("year")
            }
            helperText={
              getFormatError("year")
                ? formatMessage(
                    { id: "movie.error.INVALID_MOVIE_DATA_FORMAT" },
                    getFormatError("year")
                  )
                : yearHelper
            }
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, year: target.value }))
            }
            value={form.year}
          />

          <TextField
            label={formatMessage({ id: "field.country" })}
            value={form.country}
            disabled
          />

          <Select
            required
            fullWidth
            value={form.directorId ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                directorId: Number(e.target.value),
                country:
                  directors.find((d) => d.id === Number(e.target.value))
                    ?.country || "",
              }))
            }
            placeholder={formatMessage({ id: "field.director" })}
            renderValue={(selected) => {
              const dir = directors.find((d) => d.id === selected);
              if (!dir) {
                return (
                  <Typography color={theme.input.color.primary.placeholder}>
                    *{formatMessage({ id: "field.director" })}
                  </Typography>
                );
              }
              return (
                <Typography color={theme.input.color.primary.text.primary}>
                  {dir.name}
                </Typography>
              );
            }}
          >
            {directors.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
          {hasError(errorCodes.EMPTY_MOVIE_DIRECTOR) && (
            <Typography color="error">
              {tError(errorCodes.EMPTY_MOVIE_DIRECTOR)}
            </Typography>
          )}

          <TextField
            label={formatMessage({ id: "field.genres" })}
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, genres: target.value }))
            }
            value={form.genres}
          />

          <TextField
            label={formatMessage({ id: "field.description" })}
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, description: target.value }))
            }
            value={form.description}
          />

          {externalErrors.length > 0 &&
            externalErrors.map((errorMessage) => (
              <Typography color="error" key={errorMessage}>
                {errorMessage}
              </Typography>
            ))}

          <div className={classes.buttons}>
            <Button
              colorVariant="secondary"
              onClick={handleCancel}
              variant="secondary"
            >
              <Typography>{formatMessage({ id: "btn.cancel" })}</Typography>
            </Button>
            <Button onClick={handleSave} variant="primary">
              <Typography color="inherit">
                <strong>
                  {formatMessage({
                    id: isNew ? "btn.create" : "btn.save",
                  })}
                </strong>
              </Typography>
            </Button>
          </div>
        </div>
      )}

      {toast?.visible && <div className={classes.toast}>{toast.message}</div>}
    </div>
  );
}

export default MovieDetailsPage;
