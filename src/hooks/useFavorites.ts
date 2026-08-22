'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Favorites persisted in localStorage, exposed as an external store.
 *
 * useSyncExternalStore is the React-sanctioned way to read external systems
 * (localStorage) without hydration mismatches or set-state-in-effect cascades:
 * the server snapshot is always empty and real values stream in after mount.
 */
const STORAGE_KEY = 'project_dna_favs';
const EMPTY: string[] = [];

let cachedSnapshot: string[] | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    // corrupted JSON or storage unavailable
    return [];
  }
}

function getSnapshot(): string[] {
  if (cachedSnapshot === null) cachedSnapshot = readFromStorage();
  return cachedSnapshot;
}

// Server / first-hydration snapshot: nothing favorited yet.
function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function writeFavorites(next: string[]): void {
  cachedSnapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // quota / privacy-mode errors: keep the in-memory value only
  }
  listeners.forEach((listener) => listener());
}

/**
 * Returns `[favorites, toggleFavorite]`.
 * Toggling persists immediately and notifies every subscribed component.
 */
export function useFavorites(): [string[], (projectId: string) => void] {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleFavorite = useCallback((projectId: string) => {
    const current = getSnapshot();
    writeFavorites(
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    );
  }, []);

  return [favorites, toggleFavorite];
}
