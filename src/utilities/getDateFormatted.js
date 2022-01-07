const getDateFormatted = (dateString) => {
  const dateObject = new Date(dateString);
  let dateOnly = dateObject.toLocaleDateString();
  let hourAndMin = dateObject.toLocaleTimeString('en-US', { hour12: false }).slice(0, -3);

  return `${dateOnly} ${hourAndMin}`;
  // 2021. 11. 5. 22:02
};

export default getDateFormatted;
