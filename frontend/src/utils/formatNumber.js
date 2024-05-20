export const formatNumber = (view) => {
  let returnView;
  if (!view) {
    returnView = 0;
  } else {
    returnView = view.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return returnView;
};
export const formatPercentNumberOfDetailAnalytics = (number) => {
  let percentNumber;
  if (number === 'NaN') {
    percentNumber = 0;
  } else if (!number) {
    percentNumber = 0;
  } else {
    percentNumber = number;
  }
  return percentNumber;
};
