import React from 'react';

export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-[18px] w-[32px] shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${
        checked ? 'bg-emerald-500' : 'bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-[15px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}