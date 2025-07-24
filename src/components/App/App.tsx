import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { FetchNotesResponse } from "../../types/note";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import { useDeleteNote } from "../../services/noteService";
import { fetchNotes } from "../../services/noteService";
import NoteForm from "../NoteForm/NoteForm";
import useCreateNote from "../../services/noteService";
import { NewNote } from "../../services/noteService";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isPending } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", query, currentPage],
    queryFn: () => fetchNotes({ query, page: currentPage, perPage: 12 }),
    placeholderData: (prev) => prev,
  });
  const deleteMutation = useDeleteNote();

  const handleDelete = (note: { id: string; title: string }) => {
    if (window.confirm(`Видалити нотатку "${note.title}"?`)) {
      deleteMutation.mutate(note.id);
    }
  };

  const createMutation = useCreateNote();

  const handleCreateNote = (values: NewNote) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Нотатку створено.");
        queryClient.invalidateQueries({ queryKey: ["notes"] });
        closeModal();
      },
      onError: () => {
        toast.error("Не вдалося створити нотатку.");
      },
    });
  };

  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast.error("Нотатки не знайдено.");
    }
  }, [data]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onSubmit={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination total={data.totalPages} page={currentPage} onChange={setCurrentPage} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isPending && <p>Завантаження...</p>}

      {data?.notes && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} onDelete={handleDelete} />
        </>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} onSubmit={handleCreateNote} />
        </Modal>
      )}
    </div>
  );
}
