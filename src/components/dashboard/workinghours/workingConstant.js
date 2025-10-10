export const formatTime = (seconds) => {
  if (!seconds || seconds === 0) return "0h 0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export const formatTimeToHours = (seconds) => {
  return Math.round((seconds / 3600) * 10) / 10;
};
