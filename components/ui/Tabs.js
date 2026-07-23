'use client';

import { useId, useRef, useState } from 'react';

export default function Tabs({ items, defaultValue, value, onValueChange, label = 'Content sections' }) {
  const [internalValue, setInternalValue] = useState(defaultValue || items[0]?.id);
  const tabRefs = useRef([]);
  const idPrefix = useId();
  const activeValue = value ?? internalValue;
  function select(nextValue) { if (value === undefined) setInternalValue(nextValue); onValueChange?.(nextValue); }
  function handleKeyDown(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const enabledIndexes = items.map((item, itemIndex) => item.disabled ? null : itemIndex).filter((itemIndex) => itemIndex !== null);
    if (!enabledIndexes.length) return;
    const enabledPosition = enabledIndexes.indexOf(index);
    let nextIndex;
    if (event.key === 'Home') nextIndex = enabledIndexes[0];
    else if (event.key === 'End') nextIndex = enabledIndexes[enabledIndexes.length - 1];
    else if (event.key === 'ArrowRight') nextIndex = enabledIndexes[(enabledPosition + 1) % enabledIndexes.length];
    else nextIndex = enabledIndexes[(enabledPosition - 1 + enabledIndexes.length) % enabledIndexes.length];
    select(items[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }
  const activeItem = items.find((item) => item.id === activeValue);
  return (
    <div>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-border">
        {items.map((item, index) => <button key={item.id} ref={(node) => { tabRefs.current[index] = node; }} type="button" role="tab" id={`${idPrefix}-tab-${item.id}`} aria-selected={activeValue === item.id} aria-controls={`${idPrefix}-panel-${item.id}`} aria-disabled={item.disabled || undefined} disabled={item.disabled} tabIndex={activeValue === item.id ? 0 : -1} onClick={() => select(item.id)} onKeyDown={(event) => handleKeyDown(event, index)} className={`min-h-11 whitespace-nowrap border-b-2 px-4 py-2 text-sm font-semibold transition duration-fast disabled:cursor-not-allowed disabled:opacity-50 ${activeValue === item.id ? 'border-brand text-brand-strong' : 'border-transparent text-foreground-muted hover:text-foreground'}`}>{item.label}</button>)}
      </div>
      <div role="tabpanel" id={`${idPrefix}-panel-${activeItem?.id}`} aria-labelledby={`${idPrefix}-tab-${activeItem?.id}`} className="pt-5">{activeItem?.content}</div>
    </div>
  );
}
