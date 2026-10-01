import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * Tryb "Pełny ekran (Bez skrолu)" dla panelu recepcji.
 *
 * Dwa niezalezne, ale powiązane mechanizmy:
 * 1. `isFullscreenMode` - układ dopasowany do 100% wysokości i szerokości okna
 *    (h-screen, overflow-hidden, elastyczne wiersze siatki). Zapisywany
 *    w localStorage, żeby monitor recepcji po odświeżeniu nadal pracował
 *    w trybie bez przewijania.
 * 2. `isBrowserFullscreen` - natywny Fullscreen API przeglądarki
 *    (document.documentElement.requestFullscreen()).
 *
 * Stan współdzielony, bo App.tsx musi znać tryb, żeby wyłączyć przewijanie
 * strony, a ReceptionHeader - żeby narysować przycisk przełącznika.
 */
const DISPLAY_MODE_STORAGE_KEY = 'gravitacja_reception_display_mode';

interface ReceptionDisplayModeValue {
  /** Tryb TV: panel wypełnia 100% ekranu, bez pionowych/poziomych scrollbarów. */
  isFullscreenMode: boolean;
  /** Czy przeglądarka jest w natywnym trybie pełnoekranowym. */
  isBrowserFullscreen: boolean;
  /** Przełącza tryb układu oraz natywny Fullscreen API. */
  toggleDisplayMode: () => void;
}

const ReceptionDisplayModeContext = createContext<ReceptionDisplayModeValue>({
  isFullscreenMode: false,
  isBrowserFullscreen: false,
  toggleDisplayMode: () => {},
});

export const ReceptionDisplayModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DISPLAY_MODE_STORAGE_KEY) === 'fullscreen';
    } catch {
      return false;
    }
  });

  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState<boolean>(
    () => typeof document !== 'undefined' && !!document.fullscreenElement
  );

  // Ref zamiast updatera useState, żeby wywołania Fullscreen API nie biegły
  // w środku setState (Strict Mode woła updater dwukrotnie).
  const modeRef = useRef(isFullscreenMode);
  modeRef.current = isFullscreenMode;

  // Zapamiętuj wybór trybu - po F5 monitor recepcji wraca do tego samego układu.
  useEffect(() => {
    try {
      localStorage.setItem(
        DISPLAY_MODE_STORAGE_KEY,
        isFullscreenMode ? 'fullscreen' : 'compact'
      );
    } catch (err) {
      console.error('Error saving reception display mode:', err);
    }
  }, [isFullscreenMode]);

  // Użytkownik może wyjść z pełnego ekranu klawiszem ESC - przycisk musi to odzwierciedlać.
  useEffect(() => {
    const handleFullscreenChange = () => setIsBrowserFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterBrowserFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen API rejected:', err);
    }
  }, []);

  const exitBrowserFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Exit fullscreen rejected:', err);
    }
  }, []);

  const toggleDisplayMode = useCallback(() => {
    const next = !modeRef.current;
    modeRef.current = next;
    setIsFullscreenMode(next);
    if (next) {
      void enterBrowserFullscreen();
    } else {
      void exitBrowserFullscreen();
    }
  }, [enterBrowserFullscreen, exitBrowserFullscreen]);

  const value = useMemo(
    () => ({ isFullscreenMode, isBrowserFullscreen, toggleDisplayMode }),
    [isFullscreenMode, isBrowserFullscreen, toggleDisplayMode]
  );

  return (
    <ReceptionDisplayModeContext.Provider value={value}>
      {children}
    </ReceptionDisplayModeContext.Provider>
  );
};

/** Zwraca tryb wyświetlania recepcji. Bez providera działa neutralnie (tryb kompaktowy). */
export const useReceptionDisplayMode = (): ReceptionDisplayModeValue =>
  useContext(ReceptionDisplayModeContext);