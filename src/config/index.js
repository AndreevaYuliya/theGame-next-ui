const config = {
  // Services
  USERS_SERVICE: process.env.REACT_APP_GATEWAY_URL || "http://localhost:8080",
  MOVIES_SERVICE: process.env.REACT_APP_MOVIES_SERVICE,
  REVIEWS_SERVICE: process.env.REACT_APP_REVIEWS_SERVICE,
  // USERS_SERVICE: "http://localhost:8080/api",

  UI_URL_PREFIX: process.env.REACT_APP_UI_URL_PREFIX || "",
};

export default config;
