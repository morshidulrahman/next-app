// src/components/FormattedTime.jsx

import { formatTimeCompact } from "@/utils/formatTime";
import PropTypes from "prop-types";

const FormattedTime = ({ seconds, hideZeroUnits = true }) => {
  try {
    const display = formatTimeCompact(seconds, { hideZeroUnits });
    return <span>{display}</span>;
  } catch (err) {
    return <span>Invalid time</span>;
  }
};

FormattedTime.propTypes = {
  seconds: PropTypes.number.isRequired,
  hideZeroUnits: PropTypes.bool,
};

export default FormattedTime;
