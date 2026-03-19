import { createUseStyles } from "react-jss";
import { useIntl } from "react-intl";
import useTheme from "misc/hooks/useTheme";
import Button from "components/Button";
import Card from "components/Card";
import CardActions from "components/CardActions";
import CardContent from "components/CardContent";
import CardTitle from "components/CardTitle";
import Dialog from "components/Dialog";
import IconButton from "components/IconButton";
import IconClose from "components/icons/Close";
import IconVisibilityOff from "components/icons/VisibilityOff";
import IconVisibilityOn from "components/icons/VisibilityOn";
import md5 from "md5";
import React, { useEffect, useState } from "react";
import TextField from "components/TextField";
import Typography from "components/Typography";

import * as errorCodes from "../constants/errorCodes";

const getClasses = createUseStyles((theme) => ({
  buttons: {
    display: "flex",
    gap: `${theme.spacing(1)}px`,
    justifyContent: "center",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: `${theme.spacing(2)}px`,
    width: "300px",
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    gap: `${theme.spacing(2)}px`,
  },
}));

const errorTypes = {
  EMPTY_SIGN_UP_EMAIL: "EMPTY_SIGN_UP_EMAIL",
  EMPTY_SIGN_UP_LOGIN: "EMPTY_SIGN_UP_LOGIN",
  EMPTY_SIGN_UP_PASSWORD: "EMPTY_SIGN_UP_PASSWORD",
  EMPTY_SIGN_UP_PASSWORD_CONFIRM: "EMPTY_SIGN_UP_PASSWORD_CONFIRM",
  INVALID_EMAIL: "INVALID_EMAIL",
  PASSWORDS_MISMATCHES: "PASSWORDS_MISMATCHES",
};

const isEmail = (text) => {
  const re = /\S+@\S+\.\S+/;

  return re.test(text.toLowerCase());
};

function Login({
  errors, // [{ code: <string>, description: <string> }]
  isAutoSignInAfterSignUp = true,
  isFailedSignIn,
  isFailedSignUp,
  isFetchingSignIn,
  isFetchingSignUp,
  onSignIn,
  onSignUp,
}) {
  const { formatMessage } = useIntl();

  const { theme } = useTheme();
  const classes = getClasses({ theme });

  const [state, setState] = useState({
    emailOrLogin: "",
    externalErrors: [],
    password: "",
    isShowPassword: false,
    isSignUpDialogOpened: false,
    signInValidationErrors: [],
    signUpEmail: "",
    signUpFirstName: "",
    signUpLastName: "",
    signUpLogin: "",
    signUpPassword: "",
    signUpPasswordConfirm: "",
    signUpValidationErrors: [],
  });

  const onCancelSignUp = () =>
    setState({
      ...state,
      externalErrors: [],
      signUpEmail: "",
      signUpFirstName: "",
      signUpLastName: "",
      signUpLogin: "",
      signUpPassword: "",
      signUpPasswordConfirm: "",
      signUpValidationErrors: [],
      isSignUpDialogOpened: false,
    });

  useEffect(() => {
    const errorCodeValues = Object.values(errorCodes);

    const messages = errors.map((error) =>
      errorCodeValues.includes(error.code)
        ? formatMessage({ id: `error.${error.code}` })
        : error.description,
    );

    setState({
      ...state,
      externalErrors: messages,
    });
  }, [errors]);

  useEffect(() => {
    if (state.isSignUpDialogOpened && !isFetchingSignUp && !isFailedSignUp) {
      if (isAutoSignInAfterSignUp) {
        onSignIn({
          login: state.signUpLogin,
          password: md5(state.signUpPassword),
        });
      }

      onCancelSignUp();
    }
  }, [isFetchingSignUp, isFailedSignUp]);

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <CardTitle>
          <Typography variant="subTitle">
            {formatMessage({ id: "page.login" })}
          </Typography>
        </CardTitle>

        <CardContent className={classes.buttonWrapper}>
          <Button
            isLoading={isFetchingSignIn}
            onClick={() => onSignIn?.({})}
            variant="primary"
          >
            <Typography color="inherit">
              <strong>{formatMessage({ id: "page.loginWithGoogle" })}</strong>
            </Typography>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
