import React, { useRef, useEffect } from 'react';

const TOOLBAR = [
  { cmd: 'bold', icon: 'B' },
  { cmd: 'italic', icon: 'I' },
  { cmd: 'underline', icon: 'U' },
  { cmd: 'insertUnorderedList', icon: '•' },
];

export default function RichTextEditor({ value, onChange, className }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);
  const exec = (cmd) => document.execCommand(cmd, false, null);
  const handleInput = () => {
    if (onChange) onChange(ref.current.innerHTML);
  };
  return (
    <div className={className}>
      <div className="border rounded-t p-1 bg-gray-50 flex space-x-2 rtl:space-x-reverse">
        {TOOLBAR.map(t => (
          <button key={t.cmd} type="button" onClick={() => exec(t.cmd)} className="px-2 py-1 text-sm hover:bg-gray-200 rounded">
            {t.icon}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        onInput={handleInput}
        contentEditable
        className="border border-t-0 rounded-b p-2 min-h-[100px] focus:outline-none"
      />
    </div>
  );
}
