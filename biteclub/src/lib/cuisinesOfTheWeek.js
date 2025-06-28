// lib/cuisinesOfTheWeek.js
import { getAllCuisines } from './db/dbOperations';

export const fallbackCuisines = [
  'Burmese',
  'Laotian',
  'Somali',
  'Uyghur',
  'Georgian',
  'Tibetan',
  'Malagasy',
  'Armenian',
  'Sri Lankan',
  'Ethiopian',
  'Nepalese',
  'Japanese',
];

// calculates week number of the year
export function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1); // January 1st of this year
  const diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000; //  time difference between now and Jan 1st (in milliseconds)
  const oneWeek = 7 * 24 * 60 * 60 * 1000; // milliseconds in one week
  return Math.floor(diff / oneWeek) + 1;
}

export async function getCuisinesOfTheWeek(count = 12) {
  const allCuisines = await getAllCuisines();

  if (!allCuisines || allCuisines.length < count) {
    allCuisines = fallbackCuisines;
  }

  const weekNumber = getWeekNumber();
  const startIndex = (weekNumber * count) % allCuisines.length; // remainder

  const cuisinesOfTheWeek = [];
  for (let i = 0; i < count; i++) {
    cuisinesOfTheWeek.push(allCuisines[(startIndex + i) % allCuisines.length]);
  }
  return cuisinesOfTheWeek;
}
