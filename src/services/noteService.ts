import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../types/note";

export type NewNote = Omit<Note, "id" | "createdAt" | "updatedAt">;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const API_BASE = "https://notehub-public.goit.study/api/notes";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export async function fetchNotes(params: {
  query: string;
  page: number;
  perPage: number;
}): Promise<FetchNotesResponse> {
  const { query, page, perPage } = params;

  const res = await axiosInstance.get<FetchNotesResponse>("", {
    params: {
      ...(query.trim() && { search: query }),
      page,
      perPage,
    },
  });

  return res.data;
}

// ➕ POST note
export async function createNote(note: NewNote): Promise<Note> {
  const res = await axiosInstance.post<Note>("", note);
  return res.data;
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, NewNote>({
    mutationFn: createNote,
    onSuccess: () => {
      console.log("Note created successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export async function deleteNote(id: number): Promise<Note> {
  const res = await axiosInstance.delete<Note>(`/${id}`);
  return res.data;
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, number>({
    mutationFn: deleteNote,
    onSuccess: () => {
      console.log("Note deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
