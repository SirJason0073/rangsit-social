'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { cn } from '@/utils/cn';

const DropdownContext = createContext(null);

export function Dropdown({ children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  useEffect(() => {
    function handlePointerDown(event) { if (!rootRef.current?.contains(event.target)) setOpen(false); }
    function handleKeyDown(event) {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);
  return <DropdownContext.Provider value={{ open, setOpen, align, triggerRef }}><div ref={rootRef} className="relative">{children}</div></DropdownContext.Provider>;
}

export function DropdownTrigger({ children, className = '', label = 'Open menu' }) {
  const { open, setOpen, triggerRef } = useContext(DropdownContext);
  return <button ref={triggerRef} type="button" className={cn('inline-flex min-h-11 items-center gap-2 rounded-control px-3 py-2 transition duration-fast hover:bg-surface-muted', className)} onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open} aria-label={label}>{children}<Icon name="chevronDown" size="sm" className={cn('transition-transform duration-fast', open && 'rotate-180')} /></button>;
}

export function DropdownContent({ children, className = '' }) {
  const { open, align } = useContext(DropdownContext);
  const contentRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    contentRef.current?.querySelector('[role="menuitem"]')?.focus();
  }, [open]);
  function handleKeyDown(event) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const items = Array.from(contentRef.current?.querySelectorAll('[role="menuitem"]') || []);
    if (!items.length) return;
    const currentIndex = items.indexOf(document.activeElement);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % items.length;
    if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = items.length - 1;
    items[nextIndex]?.focus();
  }
  if (!open) return null;
  return <div ref={contentRef} role="menu" onKeyDown={handleKeyDown} className={cn('absolute top-[calc(100%+0.5rem)] z-50 min-w-56 rounded-card border border-border bg-surface-elevated p-2 text-foreground shadow-3', align === 'left' ? 'left-0' : 'right-0', className)}>{children}</div>;
}

export function DropdownItem({ children, onSelect, className = '', disabled = false }) {
  const { setOpen } = useContext(DropdownContext);
  return <button type="button" role="menuitem" disabled={disabled} className={cn('flex min-h-11 w-full items-center gap-3 rounded-control px-3 py-2 text-left text-sm text-foreground-secondary transition duration-fast hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50', className)} onClick={() => { onSelect?.(); setOpen(false); }}>{children}</button>;
}
