import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import TextField from "../TextField/TextField";
import "./styles/EditableField.css";

export interface EditableFieldProps {
  value: string | number;
  onSave: (val: string | number) => void;
  type?: string;
  prefix?: string;
  className?: string;
  placeholder?: string;
}

const EditableField = ({
  value,
  onSave,
  type = "text",
  prefix = "",
  className = "",
  placeholder = "",
}: EditableFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string | number>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    setEditing(false);
    onSave(draft);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      cancel();
    }
  };

  if (editing) {
    return (
      <div
        className={`editable-field editable-field--editing ${className}`.trim()}
      >
        {prefix && <span className="editable-field__prefix">{prefix}</span>}
        <TextField
          ref={inputRef}
          id={`editable-${type}-${Date.now()}`}
          type={type}
          value={draft}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDraft(e.target.value)
          }
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="editable-field__input"
          placeholder={placeholder}
          autoFocus
        />
      </div>
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={`editable-field__text ${className}`.trim()}
      title="Click to edit"
    >
      {prefix}
      {value}
    </span>
  );
};

export default EditableField;
