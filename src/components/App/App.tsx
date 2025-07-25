import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import type { FormikHelpers } from "formik";

import { fetchNotes, NewNote, FetchNotesResponse } from "../../services/noteService";
import useCreateNote from "../../services/noteService";

import css from "./App.module.css";

export default function App() {
  // Тепер для вводу пошуку
  const [searchTerm, setSearchTerm] = useState("");
  // Дебаунс значення пошуку з затримкою 500 мс
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isPending } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", debouncedSearchTerm, currentPage],
    queryFn: () => fetchNotes({ query: debouncedSearchTerm, page: currentPage, perPage: 12 }),
    placeholderData: (prev) => prev,
  });

  const createMutation = useCreateNote();

  const handleCreateNote = (values: NewNote, actions: FormikHelpers<NewNote>) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Нотатку створено.");
        queryClient.invalidateQueries({ queryKey: ["notes"] });
        actions.resetForm();
        actions.setSubmitting(false);
        closeModal();
      },
      onError: () => {
        toast.error("Не вдалося створити нотатку.");
        actions.setSubmitting(false);
      },
    });
  };

  const handleSearch = (newValue: string) => {
    setSearchTerm(newValue);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination total={data.totalPages} page={currentPage} onChange={setCurrentPage} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isPending && <p>Завантаження...</p>}

      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} onSubmit={handleCreateNote} />
        </Modal>
      )}
    </div>
  );
}
