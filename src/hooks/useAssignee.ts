//хук для проброса данных об пользователях 

import { useEffect, useState } from "react";
import { Assignee } from "../types/assignee";


export function useAssignee() {
  const [assignees, setAssignee] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users");
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const result = await response.json();
        setAssignee(result.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  return { assignees, loading, error };
}
