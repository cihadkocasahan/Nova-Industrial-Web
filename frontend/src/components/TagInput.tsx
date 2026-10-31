import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

function TagInput({ value = [], onChange, placeholder = 'Anahtar kelime ekleyin...', maxTags = 20 }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const tags = pastedText
      .split(/[,\n\r;]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    tags.forEach(tag => {
      if (!value.includes(tag.toLowerCase()) && value.length < maxTags) {
        addTag(tag);
      }
    });
  };

  return (
    <div style={{
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      padding: '0.5rem',
      backgroundColor: 'white',
      minHeight: '60px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'text',
    }}
    onClick={() => {
      const input = document.getElementById('tag-input');
      input?.focus();
    }}
    >
      {value.map((tag, index) => (
        <span
          key={index}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: '#16a34a',
            color: 'white',
            borderRadius: '16px',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'default',
          }}
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: 0,
              marginLeft: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              fontSize: '1rem',
              lineHeight: 1,
            }}
            title="Kaldır"
          >
            ×
          </button>
        </span>
      ))}
      <input
        id="tag-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={value.length === 0 ? placeholder : ''}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          padding: '0.25rem',
          fontSize: '1rem',
          minWidth: '150px',
          backgroundColor: 'transparent',
        }}
      />
      {value.length >= maxTags && (
        <span style={{ fontSize: '0.75rem', color: '#999', padding: '0 0.5rem' }}>
          Maksimum {maxTags} kelime
        </span>
      )}
    </div>
  );
}

export default TagInput;

