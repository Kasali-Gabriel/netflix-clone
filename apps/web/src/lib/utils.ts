import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
}

export const getImagePath = (imagePath?: string, fullsize?: boolean) => {
  return imagePath
    ? `http://image.tmdb.org/t/p/${fullsize ? 'original' : 'w500'}${imagePath}`
    : 'https://links.papareact.com/o8z';
};
