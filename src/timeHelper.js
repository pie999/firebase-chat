function toHours(timeInMill) {
  return Math.floor((timeInMill / 3600000 + 2) % 24);
}

function toMinutes(timeInMill) {
  return Math.floor((timeInMill / 60000) % 60);
}

export default function toReadableTime(timeInMill) {
  let hours = toHours(timeInMill).toString();
  let minutes = toMinutes(timeInMill).toString();
  if (minutes.length === 1) minutes = "0" + minutes;
  return `${hours}:${minutes}`;
}
