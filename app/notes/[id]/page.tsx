import { fetchNoteById } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: note.title,
    description: `${note.content.slice(0, 120)}...`,
    openGraph: {
      title: note.title,
      description: `${note.content.slice(0, 120)}...`,
      url: `${process.env.SITE_URL}/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: `${process.env.IMAGES_URL}/fullstack/react/og-meta.jpg`,
          width: 1200,
          height: 630,
          alt: `NOte: ${note.title}`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: note.title,
      description: `${note.content.slice(0, 120)}...`,
      images: [`${process.env.IMAGES_URL}/fullstack/react/og-meta.jpg`],
    },
  };
}

export default async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => {
      return fetchNoteById(id);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
