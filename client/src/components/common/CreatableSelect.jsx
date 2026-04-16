import { useState, useRef, useEffect } from 'react';
import './CreatableSelect.css';

/**
 * Props:
 *   options      — [{ id, name, color? }]
 *   value        — { id, name } | null
 *   onChange     — (option) => void
 *   onCreate     — (name: string) => Promise<option | null>
 *   placeholder  — string
 *   isCreating   — bool (from store, disables while API call in-flight)
 *   renderOption — optional (option) => JSX for custom row rendering
 */
export default function CreatableSelect({
  options = [],
  value,
  onChange,
  onCreate,
  placeholder = 'Select or create...',
  isCreating = false,
  renderOption,
}) {
  const [inputValue,  setInputValue]  = useState('');
  const [isOpen,      setIsOpen]      = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  const containerRef = useRef(null);
  const inputRef     = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setIsOpen(false);
        setInputValue('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reset highlight when filtered list changes
  useEffect(() => { setHighlighted(0); }, [inputValue]);

  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const showCreate =
    inputValue.trim().length > 0 &&
    !options.some(o =>
      o.name.toLowerCase() === inputValue.trim().toLowerCase()
    );

  const allOptions = showCreate
    ? [...filtered, { __isNew: true, name: inputValue.trim() }]
    : filtered;

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSelect = async (option) => {
    if (option.__isNew) {
      const created = await onCreate(option.name);
      if (created) {
        onChange(created);
        setInputValue('');
        setIsOpen(false);
      }
      return;
    }
    onChange(option);
    setInputValue('');
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key !== 'Tab') handleOpen();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, allOptions.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (allOptions[highlighted]) handleSelect(allOptions[highlighted]);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setInputValue('');
    }
  };

  return (
    <div className="cs-container" ref={containerRef}>

      {/* Control row */}
      <div
        className={`cs-control ${isOpen ? 'cs-control--open' : ''} ${!value && !isOpen ? 'cs-control--empty' : ''}`}
        onClick={handleOpen}
      >
        {/* Show selected value chip when closed */}
        {!isOpen && value ? (
          <span className="cs-value">
            {value.color && (
              <span className="cs-value-dot" style={{ background: value.color }} />
            )}
            {value.name}
          </span>
        ) : (
          <input
            ref={inputRef}
            className="cs-input"
            value={inputValue}
            placeholder={isOpen ? (value?.name ?? placeholder) : placeholder}
            onChange={e => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={isCreating}
            autoComplete="off"
          />
        )}

        <div className="cs-indicators">
          {/* Clear button */}
          {value && !isOpen && (
            <button
              type="button"
              className="cs-clear"
              onMouseDown={handleClear}
            >
              ×
            </button>
          )}
          {/* Chevron */}
          <span className={`cs-chevron ${isOpen ? 'cs-chevron--open' : ''}`}>
            ›
          </span>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul className="cs-menu" role="listbox">
          {allOptions.length === 0 && (
            <li className="cs-empty">No options found</li>
          )}

          {allOptions.map((option, i) =>
            option.__isNew ? (
              <li
                key="__create"
                role="option"
                className={`cs-option cs-option--create ${highlighted === i ? 'cs-option--highlighted' : ''}`}
                onMouseEnter={() => setHighlighted(i)}
                onMouseDown={() => handleSelect(option)}
              >
                {isCreating
                  ? <span className="cs-creating">Creating "{option.name}"...</span>
                  : <><span className="cs-create-plus">+</span> Create "{option.name}"</>
                }
              </li>
            ) : (
              <li
                key={option.id}
                role="option"
                aria-selected={value?.id === option.id}
                className={[
                  'cs-option',
                  highlighted === i      && 'cs-option--highlighted',
                  value?.id === option.id && 'cs-option--selected',
                ].filter(Boolean).join(' ')}
                onMouseEnter={() => setHighlighted(i)}
                onMouseDown={() => handleSelect(option)}
              >
                {renderOption ? renderOption(option) : (
                  <>
                    {option.color && (
                      <span className="cs-dot" style={{ background: option.color }} />
                    )}
                    <span className="cs-option-label">{option.name}</span>
                    {value?.id === option.id && (
                      <span className="cs-check">✓</span>
                    )}
                  </>
                )}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}