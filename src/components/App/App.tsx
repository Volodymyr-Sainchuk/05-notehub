import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";

import { fetchNotes, FetchNotesResponse } from "../../services/noteService";

import css from "./App.module.css";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isPending } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", debouncedSearchTerm, currentPage],
    queryFn: () => fetchNotes({ query: debouncedSearchTerm, page: currentPage, perPage: 12 }),
    placeholderData: (prev) => prev,
  });

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
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
