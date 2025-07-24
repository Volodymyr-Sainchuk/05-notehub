export default interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
}

export interface NoteListProps {
  notes: Note[];
  onDelete: (note: Note) => void;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
