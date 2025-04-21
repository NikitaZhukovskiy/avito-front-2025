//Шапка страницы (Header)

type HeaderProps = {
  onCreateClick: () => void;
};

export default function Header({ onCreateClick }: HeaderProps) {
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-2xl font-bold">Система управления проектами</h1>
      <div className="space-x-4">
        <a href="/boards" className="text-blue-500 hover:underline">Проекты</a>
        <a href="/issues" className="text-blue-500 hover:underline">Все задачи</a>
        <button
          onClick={onCreateClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700"
        >
          Создать задачу
        </button>
      </div>
    </header>
  );
}
