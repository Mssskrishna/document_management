export const calculateDaysAgo = (createdAt: string | Date): string => {
  const currentDate = new Date();
  const notificationDate = new Date(createdAt);
  const timeDiff = currentDate.getTime() - notificationDate.getTime(); // in milliseconds

  const secondsAgo = Math.floor(timeDiff / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);

  // Return the appropriate text based on the time difference
  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  } else if (minutesAgo < 60) {
    return `${minutesAgo} minutes ago`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo} hours ago`;
  } else {
    return `${daysAgo} days ago`;
  }
};
