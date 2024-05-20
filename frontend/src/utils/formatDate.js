export const formatDate = (dateString) => {
  const date = new Date(dateString);
  let year = date.getUTCFullYear();
  let month = String(date.getUTCMonth() + 1).padStart(2, '0');
  let day = String(date.getUTCDate()).padStart(2, '0');
  let hour = String(date.getUTCHours()).padStart(2, '0');
  let minute = String(date.getUTCMinutes()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}, ${hour}:${minute}`;
  return formattedDate;
};
export const formatDateVideoAna = (stringDate) => {
  const date = new Date(stringDate);

  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = date.toLocaleString('en-US', options);

  return formattedDate;
};
export const formatSecond = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};
export const formatRating = (rating) => {
  let roundedRating;
  if (typeof rating === 'string') {
    rating = parseFloat(rating);
    roundedRating = parseFloat(rating.toFixed(1));
  } else {
    roundedRating = 0;
  }
  return `${roundedRating}`;
};
