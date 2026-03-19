import React from "react";
import useTheme from "misc/hooks/useTheme";

import SvgIcon from "../SvgIcon";

/* eslint-disable max-len */
const Back = ({
  color = "default", // default | header | error | success | warning | info | <string>
  size = 32,
}) => {
  const { theme } = useTheme();
  const actualColor = theme.icon.color[color] || color;
  return (
    <SvgIcon
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
      viewBox="0 0 24 24"
    >
      <path
        fill={actualColor}
        d="M5 13h11.17l-5.59 5.59L12 20l8-8-8-8-1.41 1.41L16.17 11H5v2z"
      />
    </SvgIcon>
  );
};

export default Back;
