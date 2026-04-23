export const generateId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return (
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)] +
    Math.floor(Math.random() * 9000 + 1000)
  );
};

export const calcTotal = (items = []) =>
  items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB");

export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};