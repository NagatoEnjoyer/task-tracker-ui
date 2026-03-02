import { useState, useEffect } from 'react';
import Auth from './Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    fetch('https://task-tracker-api-ragt.onrender.com/api/tasks', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          setIsAuthenticated(false);
          throw new Error("Unauthorized");
        }
        setIsAuthenticated(true);
        return response.json();
      })
      .then(data => setTasks(data))
      .catch(error => console.error("Error fetching:", error));
  };

  const handleAddTask = (e) => {
    e.preventDefault(); 
    const newTask = { title: newTaskTitle, description: "Added from UI!", status: "PENDING" };

    fetch('https://task-tracker-api-ragt.onrender.com/api/tasks', {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask) 
    })
    .then(() => {
      setNewTaskTitle(""); 
      loadTasks(); 
    });
  };

  const handleCompleteTask = (task) => {
    const updatedTask = { ...task, status: "COMPLETED" };

    fetch(`https://task-tracker-api-ragt.onrender.com/api/tasks/${task.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })
    .then(() => loadTasks()); 
  };

  const handleDeleteTask = (id) => {
    fetch(`https://task-tracker-api-ragt.onrender.com/api/tasks/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(() => loadTasks()); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setTasks([]);
  };

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={() => loadTasks()} />;
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      
      {/* Header with Logout Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Task Tracker</h2>
        <button 
          onClick={handleLogout}
          style={{ padding: "8px 16px", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Log Out
        </button>
      </div>
      
      <form onSubmit={handleAddTask} style={{ marginBottom: "20px", marginTop: "20px" }}>
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
              
              <strong style={{ 
                textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
                color: task.status === "COMPLETED" ? "gray" : "black"
              }}>
                {task.title}
              </strong> 
              
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