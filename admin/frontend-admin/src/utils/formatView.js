export const formatView = (view) => {
  return view.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
