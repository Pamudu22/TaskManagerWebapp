import React, { useState } from "react";

const initialTasks = [
  {
    id: 1,
    title: "Fix bug",
    description: "Resolve login issue",
    deadline: "2025-06-12",
    assignedTo: "Alice",
    status: "Pending",
  },
];

const TaskManager = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    deadline: "",
    assignedTo: "",
    status: "Pending",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("title");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setTasks(tasks.map((task) => (task.id === form.id ? form : task)));
      setIsEditing(false);
    } else {
      setTasks([...tasks, { ...form, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({ id: null, title: "", description: "", deadline: "", assignedTo: "", status: "Pending" });
  };

  const handleEdit = (task) => {
    setForm(task);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a[sortKey].localeCompare(b[sortKey]));

  return (
    <div>
      {/* Search & Sort */}
      <div className="flex items-center gap-4 mb-4 bg-dark p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search by title..."
          className="border px-3 py-1 rounded w-full max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-1 rounded bg-dark"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="title">Sort by Title</option>
          <option value="deadline">Sort by Deadline</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            className="border px-3 py-2 rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Assigned To"
            className="border px-3 py-2 rounded"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          />
          <input
            type="date"
            className="border px-3 py-2 rounded"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <select
            className="border px-3 py-2 rounded bg-dark"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <textarea
            placeholder="Description"
            className="border px-3 py-2 rounded col-span-1 md:col-span-2"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {isEditing && (
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
          )}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            {isEditing ? "Update Task" : "Add Task"}
          </button>
        </div>
      </form>

      {/* Task Table */}
      <div className="overflow-x-auto bg-dark rounded shadow">
        <table className="min-w-full bg-dark border rounded shadow">
          <thead>
            <tr className="bg-dark-100 text-left">
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Assigned To</th>
              <th className="px-4 py-2 border">Deadline</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-dark-50">
                <td className="px-4 py-2 border">{task.title}</td>
                <td className="px-4 py-2 border">{task.assignedTo}</td>
                <td className="px-4 py-2 border">{task.deadline}</td>
                <td className="px-4 py-2 border">{task.status}</td>
                <td className="px-4 py-2 border flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="px-2 py-1 bg-yellow-400 text-white text-sm rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-2 py-1 bg-red-500 text-white text-sm rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManager;
