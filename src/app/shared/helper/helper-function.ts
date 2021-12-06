import { localStorageOption } from "./LocalAction";

export const calculateTimeSince = (date: string) => {
  const seconds = Math.floor((+new Date() - +new Date(date)) / 1000);

  let period = seconds / 31536000;

  if (period > 1) {
    return Math.floor(period) + ' years ago';
  }
  period = seconds / 2592000;
  if (period > 1) {
    return Math.floor(period) + ' months ago';
  }
  period = seconds / 86400;
  if (period > 1) {
    return Math.floor(period) + ' days ago';
  }
  period = seconds / 3600;
  if (period > 1) {
    return Math.floor(period) + ' hours ago';
  }
  period = seconds / 60;
  if (period > 1) {
    return Math.floor(period) + ' minutes ago';
  }
  return ' just now';
};

export const formatNumber = (number: number) => {
  switch (true) {
    case number < 1e3:
      return number;
    case number < 1e6:
      return +(number / 1e3).toFixed(1) + 'K';
    case number < 1e9:
      return +(number / 1e3).toFixed(1) + 'M';
    case number < 1e12:
      return +(number / 1e3).toFixed(1) + 'B';
  }
};

export const convertFromStringToDate = (responseDate: string) => {
  const dateComponents = responseDate.replace('Z', '').split('T');
  const datePieces = dateComponents[0].split('-');
  const timePieces = dateComponents[1].split(':');
  return `${datePieces[2]}/${parseInt(datePieces[1])}/${datePieces[0]} ${
    timePieces[0]
  }:${timePieces[1]}`;
};

export const getToken = () => {
  return localStorage.getItem('USER_TOKEN')
};
