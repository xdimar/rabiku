import { useState, useCallback } from "react";

interface UseUndoRedoOptions {
  maxHistory?: number;
}

export function useUndoRedo<T>(
  initialState: T,
  options: UseUndoRedoOptions = {}
) {
  const { maxHistory = 30 } = options;
  const [history, setHistory] = useState<{ past: T[]; present: T; future: T[] }>({
    past: [],
    present: initialState,
    future: [],
  });

  const pushState = useCallback(
    (newState: T) => {
      setHistory((curr) => {
        const currentJson = JSON.stringify(curr.present);
        const newJson = JSON.stringify(newState);
        if (currentJson === newJson) {
          return curr;
        }
        return {
          past: [...curr.past.slice(-(maxHistory - 1)), curr.present],
          present: newState,
          future: [],
        };
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    let restored: T | undefined;
    setHistory((curr) => {
      if (curr.past.length === 0) return curr;
      const previous = curr.past[curr.past.length - 1];
      restored = previous;
      return {
        past: curr.past.slice(0, -1),
        present: previous,
        future: [curr.present, ...curr.future],
      };
    });
    return restored;
  }, []);

  const redo = useCallback(() => {
    let restored: T | undefined;
    setHistory((curr) => {
      if (curr.future.length === 0) return curr;
      const next = curr.future[0];
      restored = next;
      return {
        past: [...curr.past, curr.present],
        present: next,
        future: curr.future.slice(1),
      };
    });
    return restored;
  }, []);

  const resetHistory = useCallback((newState: T) => {
    setHistory({
      past: [],
      present: newState,
      future: [],
    });
  }, []);

  return {
    state: history.present,
    pushState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    resetHistory,
  };
}
