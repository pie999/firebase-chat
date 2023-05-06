function toHours(timeInMill) {
  return Math.floor(((timeInMill / 1000) % 86400) / 3600) + 2;
}

function toMinutes(timeInMill) {
  return Math.floor(((timeInMill / 1000) % 3600) / 60);
}

export default function toReadableTime(timeInMill) {
  let hours = toHours(timeInMill).toString();
  let minutes = toMinutes(timeInMill).toString();
  if (minutes.length === 1) minutes = "0" + minutes;
  return `${hours}:${minutes}`;
}
