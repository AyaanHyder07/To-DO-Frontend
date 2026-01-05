import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import "./Task.css"

function Task() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    apiClient
      .get("/task/all")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    try {
      const res = await apiClient.post("/task", task);
      setTasks([...tasks, res.data]);
      setTask({ title: "", description: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id, updatedTask) => {
    try {
      await apiClient.put(`/task/${id}`, updatedTask);
      setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)));
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/task/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          placeholder="What needs to be done?"
          required
        />
        <textarea
          name="description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Details..."
        />
        <button type="submit" className="btn-add">
          Add Task
        </button>
      </form>

      <div className="task-list">
        {tasks.map((t) => (
          <div key={t.id} className="task-card">
            {editId === t.id ? (
              <div className="edit-mode">
                <input defaultValue={t.title} id={`title-${t.id}`} />
                <textarea defaultValue={t.description} id={`desc-${t.id}`} />
                <div className="button-group">
                  <button
                    className="btn-save"
                    onClick={() =>
                      handleUpdate(t.id, {
                        title: document.getElementById(`title-${t.id}`).value,
                        description: document.getElementById(`desc-${t.id}`)
                          .value,
                      })
                    }
                  >
                    Save
                  </button>
                  <button className="btn-cancel" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="view-mode">
                <strong>{t.title}</strong>
                <p>{t.description}</p>
                <div className="button-group">
                  <button className="btn-edit" onClick={() => setEditId(t.id)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(t.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Task;
