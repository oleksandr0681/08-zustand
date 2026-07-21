import { Metadata } from 'next';
import css from './CreateNote.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create New Note | NoteHub',
  description:
    'Quickly create a new note in NoteHub - the efficient app for organizing your thoughts and ideas.',
  openGraph: {
    title: 'Create New Note | NoteHub',
    description:
      'Quickly create a new note in NoteHub - the efficient app for organizing your thoughts and ideas.',
    url: `${process.env.SITE_URL}/notes/action/create`,
    siteName: 'NoteHub',
    images: [
      {
        url: `${process.env.IMAGES_URL}/fullstack/react/og-meta.jpg`,
        width: 1200,
        height: 630,
        alt: 'Create New Note | NoteHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create New Note | NoteHub',
    description:
      'Quickly create a new note in NoteHub - the efficient app for organizing your thoughts and ideas.',
    images: [`${process.env.IMAGES_URL}/fullstack/react/og-meta.jpg`],
  },
};

export default function CreateNote() {
  return (
    
      <main className={css.main}>
        <div className={css.container}>
          <h1 className={css.title}>Create note</h1>
          <NoteForm />
        </div>
      </main>
  );
}
