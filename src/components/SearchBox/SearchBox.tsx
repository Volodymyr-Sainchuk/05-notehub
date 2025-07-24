import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onSubmit: (value: string) => void;
}

export default function SearchBox({ value, onSubmit }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={(e) => onSubmit(e.target.value)}
    />
  );
}
