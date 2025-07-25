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

  // set date to the nearest Monday at midnight
  const day = now.getDay(); // 0 = sunday, 1 = Monday, ..., 6 = Saturday
  const diffToMonday = (day + 6) % 7; // converts Sunday (0) - 6, Monday (1) - 0,...
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const start = new Date(now.getFullYear(), 0, 1); // Jan 1st of this year
  const dayOfWeekStart = start.getDay(); // Day of the week of Jan 1st
  const diffToFirstMonday = (dayOfWeekStart + 6) % 7;
  const firstMonday = new Date(start); // get monday
  firstMonday.setDate(start.getDate() - diffToFirstMonday);
  firstMonday.setHours(0, 0, 0, 0);

  const diff = monday - firstMonday;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

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
