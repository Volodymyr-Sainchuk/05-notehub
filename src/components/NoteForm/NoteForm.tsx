import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { NewNote } from "../../services/noteService";

interface NoteFormProps {
  onClose: () => void;
  onSubmit?: (values: NewNote) => void;
}

const initialValues: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be at most 50 characters")
    .required("Required"),
  content: Yup.string().max(500, "Must be at most 500 characters").notRequired(),
  tag: Yup.string().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag").required("Required"),
});

export default function NoteForm({ onClose, onSubmit }: NoteFormProps) {
  const handleSubmit = (values: NewNote, actions: FormikHelpers<NewNote>) => {
    onSubmit?.(values);
    actions.setSubmitting(false);
    actions.resetForm();
    onClose();
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isSubmitting || !isValid}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
