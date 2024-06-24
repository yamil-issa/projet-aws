import React, { useState, useEffect } from "react";
import "../styles/BoardPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Board = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [username, setUsername] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  const token = location.state && location.state.token;

  useEffect(() => {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userIdFromToken = decodedToken.userId;
      const usernameFromToken = decodedToken.username;
      setUserId(userIdFromToken);
      setUsername(usernameFromToken);
    } else {
      navigate('/login', { state: { message: "Please login to access the board." } });
    }
  }, [location.state]);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/tasks/${userId}`);
          const data = response.data;
          setTasks(data);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      fetchData();
    }
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/tasks/${userId}`, newTask);
      const response = await axios.get(`http://localhost:5000/tasks/${userId}`);
      const data = response.data;
      setTasks(data);
      setShowModal(false); // Close modal after submission
      // Reset form fields
      setNewTask({
        title: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleTaskCompletion = async (taskId: string) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, {
        completed: true,
      });
      const response = await axios.get(`http://localhost:5000/tasks/${userId}`);
      const data = response.data;
      setTasks(data);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  
  const handleLogout = () => {
    //clear token
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <>
     <div className="user_block"><p>{username}</p><button className="logout" onClick={handleLogout}>Logout</button></div>
      <h2>Your board </h2>
      <div className="board_container">
        <div className="todo_column">
          <h2>Todo</h2>
          <div className="task_container">
            {tasks
              .filter((task) => !task.completed)
              .map((task) => (
                <div key={task._id} className="task">
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </div>
                  <div className="task_button_container">
                    <button className="done_button" onClick={() => handleTaskCompletion(task._id)}>Done</button>
                    <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                  </div>
                </div>
              ))}
          </div>
          <button className="add_task_button" onClick={() => setShowModal(true)}>Add task</button>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>
                  &times;
                </span>
                <form onSubmit={handleSubmit}>
                  <label htmlFor="title">Title :</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="description">Description :</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                  ></textarea>
                  <button type="submit">Create Task</button>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="done_column">
          <h2>Done</h2>
          <div className="task_container">
            {tasks
              .filter((task) => task.completed)
              .map((task) => (
                <div key={task._id} className="task">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
