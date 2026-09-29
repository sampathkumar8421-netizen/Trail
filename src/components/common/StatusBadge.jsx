import React from 'react';

export default function StatusBadge({ status, size = 'default' }) {
  const configs = {
    active: {
      label: 'Active',
      container: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
    unused: {
      label: 'Unused tool',
      container: 'bg-red-50 text-red-700 border-red-200/90 font-medium',
      dot: 'bg-red-500 animate-pulse',
    },
    duplicates: {
      label: 'Duplicate',
      container: 'bg-purple-50 text-purple-700 border-purple-200/80',
      dot: 'bg-purple-500',
    },
    underutilization: {
      label: 'Underutilized',
      container: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500',
    },
  };

  const config = configs[status] || configs.active;
  const isSmall = size === 'small';

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-[3px] tracking-tight ${
        isSmall ? 'text-[10px] px-1.5 py-0.5 leading-none' : 'text-[11px] px-2 py-0.5 leading-tight'
      } ${config.container}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
