// src/hooks/useHighContrast.ts
import { useState, useEffect, useCallback } from "react";
import { storage } from "@/utils/storage";

const STORAGE_KEY = "accessibility_high_contrast";

export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.getItemAsync(STORAGE_KEY).then((val) => {
      setIsHighContrast(val === "true");
      setIsLoading(false);
    });
  }, []);

  const toggle = useCallback(async () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    await storage.setItemAsync(STORAGE_KEY, String(next));
  }, [isHighContrast]);

  return { isHighContrast, toggle, isLoading };
}
