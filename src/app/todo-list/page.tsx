"use client";
import React, { useState, useEffect } from "react";

// Define Task interface with required fields
interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

let lastID: number = 0;

// Generates a unique ID based on current timestamp and avoid duplicate IDs when tasks are created rapidly
const generateId = (): number => {
  const now = Date.now();
  if (now <= lastID) {
    lastID++;
    return lastID;
  } else {
    lastID = now;
    return lastID;
  }
};

const TodoList: React.FC = () => {
  const [mounted, setMounted] = useState(false); // Prevent SSR errors with localStorage
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load tasks from localStorage after component is mounted
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const loadedTasks = storedTasks
      ? JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }))
      : [];
    setTasks(loadedTasks);
    setMounted(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log("Tasks list updated:", tasks);
    }
  }, [tasks, mounted]);

  // Add a new task to the list
  const addTask = (): void => {
    if (newTask.trim() === ""){
      alert("Please, provide a task name");
      return;
    }

    const task: Task = {
      id: generateId(),
      title: newTask,
      completed: false,
      createdAt: new Date(),
    };

    setTasks((previousTasks) => [...previousTasks, task]);
    setNewTask(""); // Clear input after adding
  };

  // Toggle task completion status
  const toggleComplete = (id: number): void => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task from the list
  const deleteTask = (id: number): void => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // Display loading screen until localStorage is ready
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-blue-500 text-lg">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-blue-500 font-bold mb-8 text-xl">
        To-Do List by João Pedro Mergulhão
      </h1>
      <div className="bg-white p-4 shadow-md rounded w-full max-w-md mb-4">
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 text-blue-500 border px-2 py-1 rounded-l"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="Add a new Task"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-1 rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "active"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded text-sm ${
              filter === "completed"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Task List */}
        <ul>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border-b py-2 gap-2 ${
                  task.completed ? "opacity-50" : ""
                }`}
              >
                <div>
                  <span
                    className={`${
                      task.completed ? "line-through" : ""
                    } text-blue-500`}
                  >
                    {task.title}
                  </span>
                  <div className="text-xs text-gray-500">
                    Created on: {task.createdAt.toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`px-2 py-1 rounded text-sm ${
                      task.completed
                        ? "bg-yellow-400 text-white hover:bg-yellow-500"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  {task.completed && (
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-2 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center">No tasks found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;