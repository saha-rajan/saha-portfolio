import { createContext, useContext, useState, ReactNode } from 'react';

interface CursorContextType {
  hideCursor: boolean;
  setHideCursor: (hide: boolean) => void;
  isTextCursor: boolean;
  setIsTextCursor: (isText: boolean) => void;
  cursorText: string;
  setCursorText: (text: string) => void;
  cursorProgress: number | null;
  setCursorProgress: (progress: number | null) => void;
  cursorTimeLeft: number | null;
  setCursorTimeLeft: (time: number | null) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [hideCursor, setHideCursor] = useState(false);
  const [isTextCursor, setIsTextCursor] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorProgress, setCursorProgress] = useState<number | null>(null);
  const [cursorTimeLeft, setCursorTimeLeft] = useState<number | null>(null);

  const value = {
    hideCursor,
    setHideCursor,
    isTextCursor,
    setIsTextCursor,
    cursorText,
    setCursorText,
    cursorProgress,
    setCursorProgress,
    cursorTimeLeft,
    setCursorTimeLeft,
  };

  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}
