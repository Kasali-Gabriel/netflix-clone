'use client';

import useChangePage from '@/hooks/useChangePage';
import { fetchMovies } from '@/lib/movieFetcher';
import { GenreDropdownProps } from '@/types/Movie';
import { useEffect, useState } from 'react';

import { faTag, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '../ui/sheet';

// ✅ Strong typing
type Genre = {
  id: number;
  name: string;
};

const GenreDropdown = ({
  showBackground,
  isHome,
  isSheetOpen,
  setIsSheetOpen,
}: GenreDropdownProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const changePage = useChangePage();

  // ✅ Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await fetchMovies();
        setGenres(data?.genres ?? []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // ✅ Keep id as number
  const handleNavigation = (id: number, name: string) => {
    changePage(`/genre/${id}?genre=${encodeURIComponent(name)}`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className={`mt-1 flex h-auto flex-row items-center justify-center rounded-3xl bg-transparent p-0 text-2xl hover:bg-transparent sm:border sm:px-2 sm:py-1 sm:text-base md:px-3 lg:text-lg ${
            isSheetOpen
              ? 'text-black dark:text-white'
              : isHome || showBackground
                ? 'border-white text-white sm:hover:bg-zinc-600'
                : 'border-black text-black sm:hover:bg-slate-200 dark:border-white dark:text-white sm:dark:hover:bg-zinc-600'
          }`}
        >
          <div className="flex sm:hidden">
            <FontAwesomeIcon icon={faTag} className="mr-5 pt-2" />
          </div>

          <span>Categories</span>

          <div className="hidden sm:flex">
            <ChevronDownIcon className="ml-2 mt-0.5" />
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="top"
        className="flex h-screen items-center justify-center bg-black/10"
      >
        <ScrollArea className="h-[70vh] w-full">
          <SheetHeader>
            <SheetClose asChild>
              <button
                onClick={() => changePage('/')}
                className="flex w-full items-center justify-center text-2xl text-white md:text-3xl lg:text-4xl"
              >
                Home
              </button>
            </SheetClose>
          </SheetHeader>

          {/* ✅ Clean mapping, no nested buttons */}
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="mt-4 flex w-full items-center justify-center"
            >
              <SheetClose asChild>
                <button
                  onClick={() => {
                    handleNavigation(genre.id, genre.name);
                    setIsSheetOpen(false);
                  }}
                  className="text-lg text-white md:text-2xl lg:mt-6 lg:text-3xl"
                >
                  {genre.name}
                </button>
              </SheetClose>
            </div>
          ))}
        </ScrollArea>

        <SheetFooter className="absolute bottom-5">
          <SheetClose asChild>
            <Button className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <FontAwesomeIcon icon={faX} className="text-3xl text-black" />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default GenreDropdown;
