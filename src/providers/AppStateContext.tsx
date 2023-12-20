import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";

interface AppState {
  input1: string;
  input2: string;
  error: string | null;
  result: string | null;
  setInput1: React.Dispatch<React.SetStateAction<string>>;
  setInput2: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setResult: React.Dispatch<React.SetStateAction<string | null>>;
}

const getAppStateFromLocalStorage = (): AppState => {
  const storedState = localStorage.getItem("appState");
  return storedState ? JSON.parse(storedState) : null;
};

const setAppStateToLocalStorage = (state: AppState): void => {
  localStorage.setItem("appState", JSON.stringify(state));
};

const AppStateContext = createContext<AppState | undefined>(
  getAppStateFromLocalStorage()
);

interface AppStateProviderProps {
  children: ReactNode;
}

export const useAppState = (): AppState => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};

export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}: AppStateProviderProps) => {
  const storedState = getAppStateFromLocalStorage();

  const [input1, setInput1] = useState<string>(storedState?.input1 || "");
  const [input2, setInput2] = useState<string>(storedState?.input2 || "");
  const [error, setError] = useState<string | null>(storedState?.error || null);
  const [result, setResult] = useState<string | null>(
    storedState?.result || null
  );

  const state: AppState = useMemo(() => {
    return {
      input1,
      input2,
      error,
      result,
      setInput1,
      setInput2,
      setError,
      setResult,
    };
  }, [input1, input2, error, result]);

  useEffect(() => {
    setAppStateToLocalStorage(state);
  }, [state]);

  return (
    <AppStateContext.Provider value={state}>
      {children}
    </AppStateContext.Provider>
  );
};
