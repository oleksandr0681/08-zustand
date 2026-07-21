'use client';

import css from './NoteForm.module.css';
import type { NewNoteData } from '@/types/note';
import { useId, useState } from 'react';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title too short')
    .max(50, 'Title too long')
    .matches(
      /^[^\s].*[^\s]$/,
      'Spaces at the beginning and end are not allowed'
    )
    .required('Title is required'),
  content: Yup.string().max(500, 'Content too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Select tag'),
});

interface NoteError {
  path?: string;
  message: string;
}

export default function NoteForm() {
  const fieldId = useId();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const [noteError, setNoteError] = useState<NoteError | null>(null);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const queryClient = useQueryClient();

  const postNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['notes'],
        refetchType: 'all',
      });
      clearDraft();
      router.push('/notes/filter/all');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const handleCancel = () => {
    router.push('/notes/filter/all');
  };

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData) as unknown as NewNoteData;
    let isValid: boolean = true;
    setNoteError(null);
    try {
      NoteFormSchema.validateSync(values);
    } catch (error) {
      isValid = false;
      if (error instanceof Yup.ValidationError) {
        setNoteError({ path: error.path, message: error.message });
      }
    }
    if (isValid === true) {
      postNoteMutation.mutate(values);
    }
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          defaultValue={draft?.title}
          onChange={handleChange}
          className={css.input}
        />
        {noteError !== null && noteError.path === 'title' && (
          <p className={css.error}>{noteError.message}</p>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          defaultValue={draft?.content}
          onChange={handleChange}
          className={css.textarea}
        />
        {noteError !== null && noteError.path === 'content' && (
          <p className={css.error}>{noteError.message}</p>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          defaultValue={draft?.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {noteError !== null && noteError.path === 'tag' && (
          <p className={css.error}>{noteError.message}</p>
        )}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={postNoteMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
