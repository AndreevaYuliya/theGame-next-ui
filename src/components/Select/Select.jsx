import React from "react";
import SelectMui from "@mui/material/Select";
import Typography from "components/Typography";
import useTheme from "misc/hooks/useTheme";

const variants = {
  standard: "standard",
  outlined: "outlined",
};

const sizes = {
  medium: "medium",
  small: "small",
};

const colorVariants = {
  header: "header",
  primary: "primary",
};

const REQUIRED_CHAR = "*";

const Select = ({
  disabled = false,
  disableUnderline = false,
  children,
  fullHeight = true,
  fullWidth = false,
  multiple = false,
  onChange,
  renderValue,
  size = sizes.medium,
  value,
  variant = variants.standard,
  colorVariant = colorVariants.primary,
  displayEmpty = false,
  placeholder = "",
  required = false,
}) => {
  const { theme } = useTheme();
  const isEmptyValue = (selected) =>
    selected === undefined ||
    selected === null ||
    selected === "" ||
    (Array.isArray(selected) && selected.length === 0);

  const resolvedRenderValue =
    placeholder && !renderValue
      ? (selected) =>
          isEmptyValue(selected) ? (
            <Typography color={theme.input.color[colorVariant].placeholder}>
              {required ? `${REQUIRED_CHAR}${placeholder}` : placeholder}
            </Typography>
          ) : (
            <Typography color={theme.input.color[colorVariant].text.primary}>
              {selected}
            </Typography>
          )
      : renderValue;

  const standardStyles = {
    "&:before, &:after": {
      display: "none",
    },
    "&.MuiInputBase-root": {
      background: disabled && "rgba(0, 0, 0, 0.05) !important",
      borderBottom: `1px solid ${theme.input.color[colorVariant].border}`,
      color: theme.input.color[colorVariant].text.primary,
      opacity: disabled && "0.4",
      marginTop: `${theme.spacing(1.5)}px`,
      "&:hover": !disabled
        ? {
            marginBottom: "-0.5px !important",
            borderBottom: `2px solid ${theme.input.color[colorVariant].border}`,
          }
        : {},
    },
  };

  const outlinedStyles = {
    "& .MuiOutlinedInput-root": {
      background: disabled
        ? "rgba(0, 0, 0, 0.05)"
        : theme.colors.background.secondary,
      borderRadius: 4,
      color: theme.input.color[colorVariant].text.primary,
      "& fieldset": {
        borderRadius: 4,
        borderColor: theme.input.color[colorVariant].border,
      },
      "&:hover fieldset": {
        borderColor: theme.input.color[colorVariant].border,
      },
      "&.Mui-focused fieldset": {
        borderWidth: 2,
        borderColor: theme.input.color[colorVariant].border,
      },
    },
  };

  return (
    <SelectMui
      disabled={disabled}
      disableUnderline={disableUnderline}
      required={required}
      fullWidth={fullWidth}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: fullHeight ? "100%" : "300px",
            background: theme.colors.background.secondary,

            "& .MuiMenuItem-root": {
              background: theme.colors.background.secondary,
              color: theme.input.color[colorVariant].text.secondary,
              "&:hover": {
                background: theme.hover.background,
                color: theme.input.color[colorVariant].text.secondary,
              },
            },
          },
        },
      }}
      multiple={multiple}
      onChange={onChange}
      renderValue={resolvedRenderValue}
      sx={{
        ".MuiSelect-select": {
          alignItems: "center",
          display: "flex",
          color: isEmptyValue(value)
            ? theme.input.color[colorVariant].placeholder
            : theme.input.color[colorVariant].text.primary,
          "&:focus": {
            background: "transparent",
          },
        },
        ".MuiSelect-icon": {
          color: theme.input.color[colorVariant].text.primary,
        },
        ...(variant === variants.outlined ? outlinedStyles : standardStyles),
      }}
      size={size}
      value={value}
      variant={variant}
      displayEmpty={displayEmpty || !!placeholder}
    >
      {children}
    </SelectMui>
  );
};

export default Select;
