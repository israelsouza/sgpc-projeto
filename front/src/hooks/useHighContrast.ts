// src/hooks/useHighContrast.ts
import { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "accessibility_high_contrast";

export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY).then((val) => {
      setIsHighContrast(val === "true");
      setIsLoading(false);
    });
  }, []);

  const toggle = useCallback(async () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    await SecureStore.setItemAsync(STORAGE_KEY, String(next));
  }, [isHighContrast]);

  return { isHighContrast, toggle, isLoading };
}