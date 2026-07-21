'use client';

import { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from './NotesPage.module.css';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import Loader from '@/components/Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

interface NotesPageProps {
  tag: string | undefined;
}

function NotesClient({ tag }: NotesPageProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      setCurrentPage(1);
    },
    1000
  );

  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ['notes', search, currentPage, tag],
    queryFn: () => fetchNotes({ search: search, page: currentPage, tag: tag }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (isSuccess === true && data.notes.length === 0) {
      toast('No notes were found for your search.');
    }
  }, [isSuccess, data, tag]);

  useEffect(() => {
    if (isError === true && error !== undefined) {
      toast.error(error.message);
    }
  }, [isError, error]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      {isLoading && <Loader />}
      {data !== null &&
        data !== undefined &&
        data.notes !== undefined &&
        data.notes.length > 0 && <NoteList notes={data.notes} />}
      <Toaster />
    </div>
  );
}

export default NotesClient;
