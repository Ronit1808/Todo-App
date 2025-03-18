'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { NewTodoForm } from "./newTodoForm";
import { CiSearch } from "react-icons/ci";
import { FaTrash } from "react-icons/fa"; 

export default function HomePage() {
  const searchParams = useSearchParams();
  const todoId = searchParams.get('todo');
  const page = searchParams.get('page') || 1;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/todos?page=${page}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, [page]);


  useEffect(() => {
    const fetchTodo = async () => {
      if (todoId) {
        try {
          const res = await fetch(`http://localhost:5000/todos/${todoId}`, {
            cache: "no-store",
          });
          const data = await res.json();
          setCurrentTodo(data);
        } catch (error) {
          console.error('Error fetching todo details:', error);
        }
      } else {
        setCurrentTodo(null);
      }
    };
    fetchTodo();
  }, [todoId]);


  async function handleSubmit() {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    try {
      if (isEditing && editingTodo) {
        // Update existing todo
        const res = await fetch(`http://localhost:5000/todos/${editingTodo._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });
        if (res.ok) {
          resetForm();
          refreshTodos();
        } else {
          alert('Error updating todo.');
        }
      } else {
        // Create new todo
        const res = await fetch('http://localhost:5000/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });
        if (res.ok) {
          resetForm();
          refreshTodos();
        } else {
          alert('Error creating todo.');
        }
      }
    } catch (error) {
      console.error('Error submitting todo:', error);
      alert('Error processing todo.');
    }
  }

  // edit mode
  function handleTodoClick(todo) {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || '');
    setIsEditing(true);
  }

  // Reset form 
  function resetForm() {
    setTitle('');
    setDescription('');
    setEditingTodo(null);
    setIsEditing(false);
  }

  // Delete a todo 
  async function handleDelete(todoId, event) {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        const res = await fetch(`http://localhost:5000/todos/${todoId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          if (editingTodo && editingTodo._id === todoId) {
            resetForm();
          }
          refreshTodos();
        } else {
          alert('Error deleting todo.');
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
        alert('Error deleting todo.');
      }
    }
  }

  async function refreshTodos() {
    try {
      const res = await fetch(`http://localhost:5000/todos?page=${page}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Error refreshing todos:', error);
    }
  }

  return (
    <div className="mx-auto">
      <div className="flex items-center gap-2 bg-white px-4 py-4 sm:px-16 sm:py-4">
        <img src="logo.png" alt="TODO Logo" className="w-10 h-10" />
        <h1 className="text-xl sm:text-2xl font-bold">TODO</h1>
      </div>

      <div className="main my-6 mx-4 lg:mx-10 flex flex-col sm:flex-row justify-between gap-6">
        <div className="sm:w-1/2 w-full">
          <div className="flex items-center justify-between mb-4">
            <button 
              className="bg-black text-sm text-white cursor-pointer rounded-lg px-4 py-2"
              onClick={handleSubmit}
            >
              {isEditing ? 'UPDATE' : 'TODO'}
            </button>
            {isEditing && (
              <button 
                className="bg-gray-500 text-sm text-white rounded-lg px-4 py-2"
                onClick={resetForm}
              >
                CANCEL
              </button>
            )}
            <CiSearch className="text-2xl" />
          </div>

          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo._id}
                className={`p-3 bg-white rounded shadow cursor-pointer ${
                  editingTodo && editingTodo._id === todo._id ? 'border-2 border-black' : ''
                }`}
                onClick={() => handleTodoClick(todo)}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {todo.title}
                  </h2>
                  <button 
                    className="text-gray-800 hover:text-gray-400"
                    onClick={(e) => handleDelete(todo._id, e)}
                    aria-label="Delete todo"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm break-words w-full">{todo.description}</p>
                  <p className="text-xs text-gray-700 whitespace-nowrap">
                    {(() => {
                      const date = new Date(todo.date);
                      return `${date.getDate()} ${date.toLocaleString("default", { month: "long" })}, ${date.getFullYear()}`;
                    })()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
       
        <div className="sm:w-1/2 w-full bg-white shadow rounded px-4 py-4">
          <NewTodoForm 
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
        </div>
      </div>
    </div>
  );
}
