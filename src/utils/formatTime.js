export const formatTimeCompact = (
  totalSeconds,
  { hideZeroUnits = true } = {}
) => {
  if (typeof totalSeconds !== "number" || totalSeconds < 0) {
    throw new Error(
      "Invalid input: totalSeconds must be a non-negative number"
    );
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (!hideZeroUnits || hours > 0) parts.push(`${hours}h`);
  if (!hideZeroUnits || minutes > 0) parts.push(`${minutes}m`);
  if (!hideZeroUnits || seconds > 0) parts.push(`${seconds}s`);

  return parts.join(" ") || "0s";
};

export function formatToTimeOnly(isoString) {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
