import React from "react";
import useTheme from "misc/hooks/useTheme";

import SvgIcon from "../SvgIcon";

/* eslint-disable max-len */
const Edit = ({
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
      viewBox="0 0 24.00 24.00"
    >
      <path
        fill={actualColor}
        d="M18.3785 8.44975L11.4637 15.3647C11.1845 15.6439 10.8289 15.8342 10.4417 15.9117L7.49994 16.5L8.08829 13.5582C8.16572 13.1711 8.35603 12.8155 8.63522 12.5363L15.5501 5.62132M18.3785 8.44975L19.7927 7.03553C20.1832 6.64501 20.1832 6.01184 19.7927 5.62132L18.3785 4.20711C17.988 3.81658 17.3548 3.81658 16.9643 4.20711L15.5501 5.62132M18.3785 8.44975L15.5501 5.62132"
        stroke={theme.icon.color["success"]}
        stroke-width="0.9600000000000002"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill={actualColor}
        d="M5 20H19"
        stroke={theme.icon.color["success"]}
        stroke-width="0.9600000000000002"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
};

export default Edit;
