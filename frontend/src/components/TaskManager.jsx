import React, { useState, useEffect } from "react";
import api from "../services/api";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
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

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/task", {
        params: { search, sortBy: sortKey },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, sortKey]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isEditing) {
      await api.put(`/task/${form.id}`, form);
    } else {
      const { id, ...taskData } = form; // ⬅️ Strip out `id`
      await api.post("/task", taskData);
    }
    fetchTasks();
    resetForm();
    setIsEditing(false);
  } catch (err) {
    console.error("Error saving task:", err.response?.data || err.message);
  }
};


  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      deadline: "",
      assignedTo: "",
      status: "Pending",
    });
  };

  const handleEdit = (task) => {
  setForm({
    id: task._id, 
    title: task.title,
    description: task.description,
    deadline: task.deadline,
    assignedTo: task.assignedTo,
    status: task.status,
  });
  setIsEditing(true);
};


  const handleDelete = async (id) => {
    try {
      await api.delete(`/task/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  const filteredTasks = tasks;

  //generate pdf 
  const generatePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Task List", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [['Title', 'Assigned To', 'Deadline', 'Status']],
    body: tasks.map(task => [
      task.title,
      task.assignedTo || '-',
      task.deadline ? new Date(task.deadline).toLocaleDateString() : '-',
      task.status,
    ]),
  });

  doc.save("task_list.pdf");
};


  return (
    <div className="p-4">
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
            <option value="Completed">Completed</option>
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
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task._id || task.id} className="hover:bg-dark-50">
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
                      onClick={() => handleDelete(task._id || task.id)}
                      className="px-2 py-1 bg-red-500 text-white text-sm rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* pdf download button */}
        <div className="flex justify-end my-4">
        <button
            onClick={generatePDF}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
            Download PDF
        </button>
        </div>

      </div>
    </div>
  );
};

export default TaskManager;
