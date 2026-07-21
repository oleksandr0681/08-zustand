import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];

  if (tag === 'all') {
    return {
      title: 'Notes - All Tags',
      description: 'Browse notes tagged with all tags. NoteHub allows you to filter and view notes based on specific tags for better organization.',
      openGraph: {
        title: 'Notes - All Tags',
        description: 'Browse notes tagged with all tags. NoteHub allows you to filter and view notes based on specific tags for better organization.',
        url: `https://08-zustand-eight-self.vercel.app/notes/filter/${tag}`,
        siteName: 'NoteHub',
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
            width: 1200,
            height: 630,
            alt: `Notes - All Tags`,
          },
        ],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Notes - All Tags',
        description: 'Browse notes tagged with all tags. NoteHub allows you to filter and view notes based on specific tags for better organization.',
        images: ['https://ac.goit.global/fullstack/react/og-meta.jpg'],
      },
    };
  }

  return {
    title: `Notes - ${tag}`,
    description: `Browse notes tagged with ${tag} tags. NoteHub allows you to filter and view notes based on specific tags for better organization.`,
    openGraph: {
      title: `Notes - ${tag}`,
      description: `Browse notes tagged with ${tag} tags. NoteHub allows you to filter and view notes based on specific tags for better organization.`,
      url: `https://08-zustand-eight-self.vercel.app/notes/filter/${tag}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes - ${tag}`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Notes - ${tag}`,
      description: `Browse notes tagged with ${tag} tags. NoteHub allows you to filter and view notes based on specific tags for better organization.`,
      images: ['https://ac.goit.global/fullstack/react/og-meta.jpg'],
    },
  };
}

async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag, 1],
    queryFn: () => fetchNotes({ search: '', page: 1, tag: tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}

export default Notes;
