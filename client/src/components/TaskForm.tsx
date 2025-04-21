//Форм для создания/редактирования задачи

import { useState, useEffect } from "react";
import { useBoards } from "../hooks/useBoards";
import { useAssignee } from "../hooks/useAssignee";
import { Board } from "../types/board";
import { Task } from "../types/Task";
import { useLocation, useNavigate } from "react-router-dom";

type TaskFormProps = {
  mode: "create" | "edit"; //выбирается режим либо "создание задачи", либо "редактирование задачи"
  initialData?: Task;
  onClose: () => void;
};

type TasksResponse = {
  data: Task;
};

export default function TaskForm({ mode, initialData, onClose }: TaskFormProps) {
  const { boards, loading: boardsLoading, error: boardsError } = useBoards();
  const { assignees, loading: assigneeLoading, error: assigneeError } = useAssignee();

  const [taskId] = useState(initialData?.id);
  const [task, setTask] = useState<Task | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [status, setStatus] = useState<"Backlog" | "InProgress" | "Done">("Backlog");
  const [assigneeId, setAssigneeId] = useState(0);

  //api запрос для получения данные о задаче по taskId
  useEffect(() => {
    if (mode === "edit" && taskId) {
      const fetchTask = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8080/api/v1/tasks/${taskId}`);
          if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
          }
          const result: TasksResponse = await response.json();
          setTask(result.data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }
  }, [mode, taskId]);

  // после успешного запроса присваивает значения переменным
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setAssigneeId(task.assignee?.id || 0);
    }
  }, [task]);

  const [boardId, setBoardId] = useState(initialData?.boardId || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isOnBoardPage = location.pathname === `/board/${boardId}`;
  
  //переход на доску по boardId
  const handleGoToBoard = () => {
    if (!isOnBoardPage) {
      navigate(`/board/${boardId}`);
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      description,
      priority,
      status,
      assigneeId,
      boardId
    };

    try {
      const url =
        mode === "create"
          ? "http://localhost:8080/api/v1/tasks/create"
          : `http://localhost:8080/api/v1/tasks/update/${initialData?.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const body = mode === "create"
        ? JSON.stringify(payload)
        : JSON.stringify(payload);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        throw new Error(mode === "create" ? "Ошибка при создании задачи" : "Ошибка при обновлении задачи");
      }

      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  

  if (boardsLoading || assigneeLoading) return <div>Загрузка данных...</div>;
  if (boardsError) return <div>Ошибка загрузки досок: {boardsError}</div>;
  if (assigneeError) return <div>Ошибка загрузки исполнителей: {assigneeError}</div>;

  //код формы со стилями (tailwindcss)
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "create" ? "Создать задачу" : "Редактировать задачу"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
            className="w-full border p-2 rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {mode === "edit" && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Backlog" | "InProgress" | "Done")}
              className="w-full border p-2 rounded"
            >
              <option value="Backlog">Бэклог</option>
              <option value="InProgress">В работе</option>
              <option value="Done">Готово</option>
            </select>
          )}

          {mode === "create" ? (
            <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Проект (доска)</label>
            <select
              value={boardId}
              onChange={(e) => setBoardId(Number(e.target.value))}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Выберите проект</option>
              {boards.map((board: Board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>
          ) : (
            <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Проект (доска)</label>
            <select value={boardId} onChange={(e) => setBoardId(Number(e.target.value))} className="w-full border px-3 py-2 rounded" disabled>
            {boards.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          </div>
          )}
          

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Исполнитель</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(Number(e.target.value))}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Выберите исполнителя</option>
              {assignees.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.description})
                </option>
              ))}
            </select>

            {assigneeId !== 0 && (
              <div className="mt-2 flex items-center gap-3 border rounded p-3 bg-gray-50">
                <img
                  src={assignees.find((a) => a.id === assigneeId)?.avatarUrl}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">
                    {assignees.find((a) => a.id === assigneeId)?.fullName} -{" "}
                    {assignees.find((a) => a.id === assigneeId)?.teamName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {assignees.find((a) => a.id === assigneeId)?.email}
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && <div className="text-red-500">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded ml-14 hover:bg-gray-400"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
          {boardId !== 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGoToBoard}
                  disabled={isOnBoardPage}
                  className={`px-4 py-2 rounded text-sm transition ${
                    isOnBoardPage
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {isOnBoardPage ? "Вы уже на странице проекта" : "Перейти к доске проекта"}
                </button>
              </div>
            )}
        </form>
      </div>
    </div>
  );
}
