import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import TextField from "../TextField/TextField";
import "./styles/EditableField.css";

const EditableField = ({
  value,
  onSave,
  type = "text",
  prefix = "",
  className = "",
  placeholder = "",
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

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

  const handleKeyDown = (e) => {
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
          onChange={(e) => setDraft(e.target.value)}
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

EditableField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSave: PropTypes.func.isRequired,
  type: PropTypes.string,
  prefix: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default EditableField;
