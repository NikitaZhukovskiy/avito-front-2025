// страница со всеми задачами

import { useEffect, useState } from "react";
import { Task } from "../types/Task";
import { useBoards } from "../hooks/useBoards";
import TaskForm from "../components/TaskForm";
import { Link } from "react-router-dom";

type TasksResponse = {
  data: Task[];
};

export default function AllIssuesPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);


  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [boardFilter, setBoardFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { boards } = useBoards();

  //api запрос для обновления всех задач
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/tasks");
      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
      const result: TasksResponse = await response.json();
      setTasks(result.data);
      setFilteredTasks(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //фильтры
  useEffect(() => {
    let filtered = [...tasks];

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(lower) ||
          task.assignee.fullName.toLowerCase().includes(lower)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (boardFilter) {
      filtered = filtered.filter((task) => task.boardId.toString() === boardFilter);
    }

    setFilteredTasks(filtered);
  }, [searchQuery, statusFilter, boardFilter, tasks]);

  if (loading) return <div className="p-4">Загрузка задач...</div>;
  if (error) return <div className="p-4 text-red-500">Ошибка: {error}</div>;

  //код страницы со стилями (tailwindcss)
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Все задачи</h1>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Поиск по названию или исполнителю"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Все статусы</option>
          <option value="Backlog">Бэклог</option>
          <option value="InProgress">В работе</option>
          <option value="Done">Готово</option>
        </select>

        <select
          value={boardFilter}
          onChange={(e) => setBoardFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Все доски</option>
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-gray-500">Ничего не найдено</div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="cursor-pointer bg-white rounded-2xl p-5 shadow flex flex-col md:flex-row justify-between gap-4 hover:shadow-lg transition"
            >
              <div className="flex">
              <div className="flex-1 min-w-0 max-w-2xl">
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <p className="text-gray-600">{task.description}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Проект: <span className="font-medium">{task.boardName}</span>
                </p>
                <div className="mt-2 text-sm gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-white text-xs ${
                      task.priority === "High"
                        ? "bg-red-500"
                        : task.priority === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="ml-2">{task.status}</span>
                  <div>
                  {boards.find((b) => b.id === task.boardId) && (
                    <Link
                      to={`/board/${task.boardId}`}
                      state={{
                        name: boards.find((b) => b.id === task.boardId)?.name,
                        description: boards.find((b) => b.id === task.boardId)?.description,
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-block text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Перейти к доске →
                    </Link>
                  )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={task.assignee.avatarUrl}
                  alt={task.assignee.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{task.assignee.fullName}</p>
                  <p className="text-sm text-gray-500">{task.assignee.email}</p>
                </div>
              </div>

              </div>
            </div>
          ))
        )}
      </div>

      {showCreateForm && (
        <TaskForm
          mode="create"
          onClose={() => {
            setShowCreateForm(false);
            fetchTasks(); // обновляем список после создания
          }}
        />
      )}
      {selectedTask && (
      <TaskForm
        mode="edit"
        initialData={selectedTask}
        onClose={() => {
          setSelectedTask(null);
          fetchTasks();
        }}
      />
      )}
      <div className="flex justify-end items-center mb-6 mt-6">
      <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition"
        >
          Создать задачу
        </button>
      </div>
    </div>
  );
}
