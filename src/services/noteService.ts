import axios from "axios";
import Note from "../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FetchNotesResponse } from "../types/note";

export type NewNote = Omit<Note, "id">;

export async function fetchNotes(params: {
  query: string;
  page: number;
  perPage: number;
}): Promise<FetchNotesResponse> {
  const { query, page, perPage } = params;

  const url = new URL("https://notehub-public.goit.study/api/notes");

  if (query.trim()) {
    url.searchParams.append("search", query);
  }

  url.searchParams.append("page", String(page));
  url.searchParams.append("perPage", String(perPage));

  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  const res = await fetch(url.toString(), {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch notes: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}

export async function createNote(note: NewNote): Promise<Note> {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  console.log("Token (POST):", token);

  const res = await axios.post("https://notehub-public.goit.study/api/notes", note, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

export default function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, NewNote>({
    mutationFn: createNote,
    onSuccess: () => {
      console.log("Note created successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export async function deleteNote(id: string): Promise<void> {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  console.log("Token (DELETE):", token);

  const res = await fetch(`https://notehub-public.goit.study/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete note: ${res.status} ${res.statusText} - ${errorText}`);
  }
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      console.log("Note deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
