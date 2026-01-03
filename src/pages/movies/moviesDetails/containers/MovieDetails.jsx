import React, { useEffect, useMemo, useState, useCallback } from "react";

import { createUseStyles } from "react-jss";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import useTheme from "misc/hooks/useTheme";

import actionsMovieDetails from "app/actions/movieDetails";
import actionsReviews from "app/actions/reviews";
import { RECEIVE_REVIEWS } from "app/constants/actionTypes";

import Typography from "components/Typography";
import Button from "components/Button";
import TextField from "components/TextField";
import Select from "components/Select";
import MenuItem from "components/MenuItem";
import IconButton from "components/IconButton";
import IconBack from "components/icons/Back";
import IconEdit from "components/icons/Edit";

import pagesURLs from "constants/pagesURLs";
import * as pages from "constants/pages";

import * as errorCodes from "../constants/errorCodes";
import {
  MIN_MOVIE_YEAR,
  MAX_MOVIE_YEAR,
  MIN_MOVIE_RATING,
  MAX_MOVIE_RATING,
} from "../constants/validationConstants";

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

  reviewsBox: ({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: 12,
    border: `1px solid ${theme.pageContainer.border}`,
    background: theme.colors.background.secondary,
  }),

  reviewList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
    marginBottom: 12,
  },

  reviewCard: ({ theme }) => ({
    padding: 10,
    borderRadius: 10,
    border: `1px solid ${theme.pageContainer.border}`,
    background: theme.colors.background.edit,
  }),

  reviewForm: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 10,
    alignItems: "center",
    marginTop: 12,
  },
}));

function MovieDetailsPage() {
  const { formatMessage } = useIntl();

  const { theme } = useTheme();
  const classes = getClasses({ theme });

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const { movieId } = useParams();

  const isNew = movieId === "new";

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

  const { items: reviewItems, counts } = useSelector((s) => s.reviews);

  const [mode, setMode] = useState(isNew ? "edit" : "view");

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
  const [reviewForm, setReviewForm] = useState({
    author: "",
    comment: "",
    rating: "",
  });

  const [reviewsFrom, setReviewsFrom] = useState(0);
  const [reviewErrors, setReviewErrors] = useState({});

  useEffect(() => {
    dispatch(actionsMovieDetails.fetchDirectors()).then((res) => {
      if (Array.isArray(res)) {
        setDirectors(res);
      }
    });

    return () => {
      dispatch(actionsMovieDetails.clearMovieDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isNew) {
      dispatch(actionsMovieDetails.fetchMovieDetails(movieId));

      dispatch({
        type: RECEIVE_REVIEWS,
        payload: { items: [], from: 0 },
      });

      dispatch(actionsReviews.fetchCounts([movieId])).then((c) => {
        if (!c || c[movieId] === undefined) {
          setReviewsFrom(0);
        }
      });

      dispatch(
        actionsReviews.fetchReviews({
          movieId,
          from: 0,
          size: 5,
          errorMessage: formatMessage({
            id: "toast.reviewLoadError",
            defaultMessage: "Failed to load reviews",
          }),
        })
      ).then((data) => setReviewsFrom(data?.length ?? 0));
    } else {
      dispatch(actionsMovieDetails.receiveMovieDetails({}));

      dispatch({
        type: RECEIVE_REVIEWS,
        payload: { items: [], from: 0 },
      });
    }
  }, [dispatch, isNew, movieId, formatMessage]);

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

  const loadMoreReviews = () => {
    dispatch(
      actionsReviews.fetchReviews({
        movieId,
        from: reviewsFrom,
        size: 5,
        errorMessage: formatMessage({
          id: "toast.reviewLoadError",
          defaultMessage: "Failed to load reviews",
        }),
      })
    ).then((data) => setReviewsFrom((prev) => prev + (data?.length ?? 0)));
  };

  const handleCreateReview = async () => {
    const errs = {};

    if (!reviewForm.author.trim()) {
      errs.author = formatMessage({
        id: "review.error.authorRequired",
        defaultMessage: "Author is required",
      });
    }

    const ratingNum = Number(reviewForm.rating);

    if (reviewForm.rating === "" || Number.isNaN(ratingNum)) {
      errs.rating = formatMessage({
        id: "review.error.ratingRequired",
        defaultMessage: "Rating is required",
      });
    } else if (ratingNum < 0 || ratingNum > 10) {
      errs.rating = formatMessage({
        id: "review.error.ratingRange",
        defaultMessage: "Rating must be 0-10",
      });
    }

    if (Object.keys(errs).length) {
      setReviewErrors(errs);

      return;
    }

    setReviewErrors({});

    try {
      await dispatch(
        actionsReviews.createReview(
          {
            movieId,
            author: reviewForm.author.trim(),
            comment: reviewForm.comment,
            rating: Number(reviewForm.rating),
          },

          {
            successMessage: formatMessage({
              id: "toast.reviewCreateSuccess",
              defaultMessage: "Review added",
            }),

            errorMessage: formatMessage({
              id: "toast.reviewCreateError",
              defaultMessage: "Failed to add review",
            }),
          }
        )
      );

      setReviewForm({ author: "", comment: "", rating: "" });

      setReviewsFrom(0);

      await dispatch(actionsReviews.fetchCounts([movieId]));

      await dispatch(
        actionsReviews.fetchReviews({
          movieId,
          from: 0,
          size: 5,
          errorMessage: formatMessage({
            id: "toast.reviewLoadError",
            defaultMessage: "Failed to load reviews",
          }),
        })
      ).then((data) => setReviewsFrom(data?.length ?? 0));
    } catch {}
  };

  const hasError = useCallback(
    (code) => validationErrors.some((err) => (err?.code || err) === code),
    [validationErrors]
  );

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

      if (yearNum < MIN_MOVIE_YEAR) {
        errs.push({ code: errorCodes.MOVIE_YEAR_TOO_LOW });
      } else if (yearNum > MAX_MOVIE_YEAR) {
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

      if (ratingNum < MIN_MOVIE_RATING) {
        errs.push({ code: errorCodes.MOVIE_RATING_TOO_LOW });
      } else if (ratingNum > MAX_MOVIE_RATING) {
        errs.push({ code: errorCodes.MOVIE_RATING_TOO_HIGH });
      }
    }

    return errs;
  };

  const tError = useCallback(
    (code, values) =>
      formatMessage(
        { id: `movie.error.${code}`, defaultMessage: code },
        values
      ),

    [formatMessage]
  );

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
        actionsMovieDetails.fetchCreateMovie(
          {
            title: form.title,
            image: form.image,
            rating: Number(form.rating),
            yearReleased: Number(form.year),
            directorId: form.directorId,
            genres: form.genres,
            description: form.description,
          },
          {
            successMessage: formatMessage({
              id: "toast.movieCreateSuccess",
              defaultMessage: "Movie created successfully",
            }),
            errorMessage: formatMessage({
              id: "toast.movieCreateError",
              defaultMessage: "Failed to create movie",
            }),
          }
        )
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
        actionsMovieDetails.fetchUpdateMovie(
          movieId,
          {
            title: form.title,
            image: form.image,
            rating: Number(form.rating),
            yearReleased: Number(form.year),
            directorId: form.directorId,
            genres: form.genres,
            description: form.description,
          },
          {
            successMessage: formatMessage({
              id: "toast.movieUpdateSuccess",
              defaultMessage: "Movie updated successfully",
            }),
            errorMessage: formatMessage({
              id: "toast.movieUpdateError",
              defaultMessage: "Failed to update movie",
            }),
          }
        )
      );

      if (res) {
        setMode("view");
      }
    }
  };

  const ratingHelper = useMemo(() => {
    if (hasError(errorCodes.INVALID_MOVIE_RATING)) {
      return tError(errorCodes.INVALID_MOVIE_RATING);
    }

    if (hasError(errorCodes.MOVIE_RATING_TOO_LOW)) {
      return tError(errorCodes.MOVIE_RATING_TOO_LOW, { min: MIN_MOVIE_RATING });
    }

    if (hasError(errorCodes.MOVIE_RATING_TOO_HIGH)) {
      return tError(errorCodes.MOVIE_RATING_TOO_HIGH, {
        max: MAX_MOVIE_RATING,
      });
    }

    return "";
  }, [hasError, tError]);

  const yearHelper = useMemo(() => {
    if (hasError(errorCodes.INVALID_MOVIE_YEAR)) {
      return tError(errorCodes.INVALID_MOVIE_YEAR);
    }

    if (hasError(errorCodes.MOVIE_YEAR_TOO_LOW)) {
      return tError(errorCodes.MOVIE_YEAR_TOO_LOW, { min: MIN_MOVIE_YEAR });
    }

    if (hasError(errorCodes.MOVIE_YEAR_TOO_HIGH)) {
      return tError(errorCodes.MOVIE_YEAR_TOO_HIGH, { max: MAX_MOVIE_YEAR });
    }

    return "";
  }, [hasError, tError]);

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
        <>
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

          {!isNew && (
            <div className={classes.reviewsBox}>
              <Typography variant="subtitle">
                <strong>
                  {formatMessage({
                    id: "review.section.title",
                    defaultMessage: "Reviews",
                  })}
                </strong>

                {counts && counts[movieId] !== undefined
                  ? ` - ${formatMessage(
                      {
                        id: "review.section.total",
                        defaultMessage: "total {count}",
                      },
                      { count: counts[movieId] }
                    )}`
                  : ""}
              </Typography>

              <div className={classes.reviewList}>
                {reviewItems.length === 0 && (
                  <Typography color="inherit">
                    {formatMessage({
                      id: "review.empty",
                      defaultMessage: "No reviews yet",
                    })}
                  </Typography>
                )}

                {reviewItems.map((rev) => (
                  <div key={rev._id} className={classes.reviewCard}>
                    <Typography>
                      <strong>{rev.author}</strong> - {rev.rating}/10
                    </Typography>

                    {rev.comment && (
                      <Typography color="inherit">{rev.comment}</Typography>
                    )}

                    <Typography variant="caption" color="inherit">
                      {new Date(rev.createdAt).toLocaleString()}
                    </Typography>
                  </div>
                ))}
              </div>

              <Button
                colorVariant="primary"
                onClick={loadMoreReviews}
                variant="secondary"
                disabled={reviewItems.length >= (counts?.[movieId] || 0)}
              >
                <Typography color="inherit">
                  {formatMessage({
                    id: "review.btn.more",
                    defaultMessage: "Show more",
                  })}
                </Typography>
              </Button>

              <div className={classes.reviewForm}>
                <div>
                  <TextField
                    required
                    label={formatMessage({
                      id: "review.field.author",
                      defaultMessage: "Name",
                    })}
                    value={reviewForm.author}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                  />

                  {reviewErrors.author && (
                    <Typography color="error" variant="caption">
                      {reviewErrors.author}
                    </Typography>
                  )}
                </div>

                <div>
                  <TextField
                    label={formatMessage({
                      id: "review.field.comment",
                      defaultMessage: "Comment",
                    })}
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <TextField
                    required
                    label={formatMessage({
                      id: "review.field.rating",
                      defaultMessage: "Rating",
                    })}
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        rating: e.target.value,
                      }))
                    }
                  />

                  {reviewErrors.rating && (
                    <Typography color="error" variant="caption">
                      {reviewErrors.rating}
                    </Typography>
                  )}
                </div>

                <Button
                  colorVariant="primary"
                  variant="primary"
                  onClick={handleCreateReview}
                >
                  <Typography color="inherit">
                    {formatMessage({
                      id: "review.btn.add",
                      defaultMessage: "Add",
                    })}
                  </Typography>
                </Button>
              </div>
            </div>
          )}
        </>
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
            <Typography color="error" variant="caption">
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
