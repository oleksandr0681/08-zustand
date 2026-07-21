'use client';

import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import css from './NotePreview.module.css';
import { useRouter } from 'next/navigation';

export default function NotePreviewClient() {
  const router = useRouter();
  const closeModal = () => {
    router.back();
  };

  const { id } = useParams<{ id: string }>();

  const { data: note, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => {
      return fetchNoteById(id);
    },
    refetchOnMount: false,
  });

  if (isError || note === undefined) {
    return <p>Something went wrong.</p>;
  }

  return (
    <Modal onClose={closeModal}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </Modal>
  );
}
