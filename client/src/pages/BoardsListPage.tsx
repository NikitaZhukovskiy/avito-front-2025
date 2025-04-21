//страница со всеми проектами

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Board } from "../types/board";

type BoardsResponse = {
  data: Board[];
};

export default function BoardsListPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/boards");
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const result: BoardsResponse = await response.json();
        setBoards(result.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-600">Загрузка...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Ошибка: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Список проектов</h1>
      {boards.length === 0 ? (
        <p className="text-center text-gray-500">Нет доступных проектов.</p>
      ) : (
        <ul className="space-y-4">
          {boards.map((board) => (
            <li key={board.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold">{board.name}</h2>
              <p className="text-gray-600">{board.description}</p>
              <p className="text-sm text-gray-500 mt-1">Задач: {board.taskCount}</p>
              <Link
                to={`/board/${board.id}`}
                state={{ name: board.name, description: board.description }}
                className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                Перейти к доске →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
