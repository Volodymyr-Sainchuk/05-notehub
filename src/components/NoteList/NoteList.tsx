import css from "./NoteList.module.css";
import { Note } from "../../types/note";
import { useDeleteNote } from "../../services/noteService";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const deleteMutation = useDeleteNote();
  const queryClient = useQueryClient();

  const handleDelete = (note: Note) => {
    if (window.confirm(`Видалити нотатку "${note.title}"?`)) {
      deleteMutation.mutate(note.id, {
        onSuccess: () => {
          toast.success("Нотатку видалено.");
          queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
        onError: () => {
          toast.error("Не вдалося видалити нотатку.");
        },
      });
    }
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button onClick={() => handleDelete(note)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
