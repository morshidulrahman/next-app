// KEEP YOUR ORIGINAL DHAKA FUNCTION - IT WORKS CORRECTLY
export function getUTCDateRangeForLocalDates(
  startLocalDateString,
  endLocalDateString
) {
  const startLocal = new Date(`${startLocalDateString}T00:00:00`);
  const endLocal = new Date(`${endLocalDateString}T23:59:59.999`);

  return {
    startUTC: startLocal.toISOString(),
    endUTC: endLocal.toISOString(),
  };
}

export function getFloridaDateRangeFromLocalDates(
  startLocalDateString,
  endLocalDateString
) {
  // FIXED version for America/New_York timezone

  function convertToUTC(dateString, isEnd = false) {
    const [year, month, day] = dateString.split("-").map(Number);

    // Create the local time in America/New_York timezone
    const timeString = isEnd ? "23:59:59.999" : "00:00:00.000";
    const localDateTime = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}T${timeString}`;

    // Parse as if it's in America/New_York timezone
    // Method 1: Using Intl.DateTimeFormat to get the correct offset
    const date = new Date(
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}T${timeString}`
    );

    // Get what this date/time would be in America/New_York
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // Create a date representing the same moment in UTC
    const parts = formatter.formatToParts(date);
    const utcEquivalent = new Date(
      `${parts.find((p) => p.type === "year").value}-${
        parts.find((p) => p.type === "month").value
      }-${parts.find((p) => p.type === "day").value}T${
        parts.find((p) => p.type === "hour").value
      }:${parts.find((p) => p.type === "minute").value}:${
        parts.find((p) => p.type === "second").value
      }`
    );

    // Calculate the offset
    const offset = date.getTime() - utcEquivalent.getTime();

    // Apply the offset correctly
    return new Date(date.getTime() + offset);
  }

  return {
    startUTC: convertToUTC(startLocalDateString, false).toISOString(),
    endUTC: convertToUTC(endLocalDateString, true).toISOString(),
  };
}
