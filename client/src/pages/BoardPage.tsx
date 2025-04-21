//страница проекта

import { useEffect, useState } from "react";
import { useParams, useLocation  } from "react-router-dom";
import { Task } from "../types/Task";
import TaskForm from "../components/TaskForm";

type TasksResponse = {
  data: Task[];
};

export default function BoardPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const location = useLocation();
  const { name, description } = location.state || {};

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/boards/${id}`);
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const result: TasksResponse = await response.json();
      setTasks(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //для использования drag-and-drop
  const updateTaskStatus = async (taskId: number, newStatus: "Backlog" | "InProgress" | "Done") => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/tasks/updateStatus/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Ошибка при обновлении статуса задачи");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = ["Backlog", "InProgress", "Done"] as const;

  if (loading) return <div className="text-center mt-10 text-gray-600">Загрузка задач...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Ошибка: {error}</div>;

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">{name || `Доска проекта #${id}`}</h1>
      {description && <p className="text-center text-gray-600 mb-8">{description}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (draggedTask && draggedTask.status !== column) {
                updateTaskStatus(draggedTask.id, column);
              }
            }}
            className="bg-gray-50 p-4 rounded-xl min-h-[300px]"
          >
            <h2 className="text-xl font-semibold mb-4">
              {column === "Backlog" && "Бэклог"}
              {column === "InProgress" && "В работе"}
              {column === "Done" && "Готово"}
            </h2>
            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === column)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedTask(task)}
                    onClick={() => setSelectedTask(task)}
                    className="cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
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
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignee.avatarUrl}
                          alt={task.assignee.fullName}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{task.assignee.fullName}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}
