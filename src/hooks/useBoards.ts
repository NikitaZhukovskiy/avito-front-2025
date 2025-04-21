////хук для проброса данных о всех проектах

import { useEffect, useState } from "react";
import { Board } from "../types/board";


export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/boards");
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const result = await response.json();
        setBoards(result.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  return { boards, loading, error };
}
