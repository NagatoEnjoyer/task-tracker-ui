import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const loadTasks = () => {
    fetch('http://localhost:8080/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error("Error fetching:", error));
  };

  useEffect(() => {
    loadTasks();
  }, []); 

  const handleAddTask = (e) => {
    e.preventDefault(); 
    const newTask = { title: newTaskTitle, description: "Added from UI!", status: "PENDING" };

    fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask) 
    })
    .then(() => {
      setNewTaskTitle(""); 
      loadTasks(); 
    });
  };

  // --- NEW: Update Task (PUT) ---
  const handleCompleteTask = (task) => {
    // We copy the task, but change its status to COMPLETED
    const updatedTask = { ...task, status: "COMPLETED" };

    // Notice we add the task.id to the end of the URL!
    fetch(`http://localhost:8080/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    .then(() => loadTasks()); // Reload the list to show the new status
  };

  // --- NEW: Delete Task (DELETE) ---
  const handleDeleteTask = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'DELETE'
    })
    .then(() => loadTasks()); // Reload the list to remove it from the screen
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h2>📝 Task Tracker</h2>
      
      <form onSubmit={handleAddTask} style={{ marginBottom: "20px" }}>
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)} 
          placeholder="What needs to be done?" 
          required
          style={{ padding: "8px", width: "70%", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
          Add Task
        </button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet. You are all caught up!</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {tasks.map(task => (
            <li key={task.id} style={{ 
              padding: "15px", 
              border: "1px solid #ddd", 
              marginBottom: "10px",
              borderRadius: "8px",
              backgroundColor: task.status === "COMPLETED" ? "#f9f9f9" : "white"
            }}>
              
              {/* If task is completed, draw a line through the text */}
              <strong style={{ 
                textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
                color: task.status === "COMPLETED" ? "gray" : "black"
              }}>
                {task.title}
              </strong> 
              
              {/* Action Buttons */}
              <div style={{ marginTop: "10px" }}>
                {task.status === "PENDING" && (
                  <button 
                    onClick={() => handleCompleteTask(task)} 
                    style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "#d4edda", border: "1px solid #c3e6cb", cursor: "pointer", borderRadius: "4px" }}>
                    ✔ Complete
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteTask(task.id)} 
                  style={{ padding: "5px 10px", backgroundColor: "#f8d7da", border: "1px solid #f5c6cb", color: "#721c24", cursor: "pointer", borderRadius: "4px" }}>
                  🗑 Delete
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;