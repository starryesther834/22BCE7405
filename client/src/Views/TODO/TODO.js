import { useEffect, useState } from 'react'
import Styles from './TODO.module.css'
import { dummy } from './dummy'
import axios from 'axios';

export function TODO(props) {

    const [newTodo, setNewTodo] = useState('')
    const [todoData, setTodoData] = useState(dummy);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo()
            setTodoData(apiData);
            setLoading(false)
        }
        fetchTodo();
    }, [])

    const getTodo = async () => {
        const options = {
            method: "GET",
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: "application/json",
            }
        }
        try {
            const response = await axios.request(options)
            return response.data
        } catch (err) {
            console.log(err);
            return []; // return an empty array in case of error
        }
    }

    const addTodo = () => {
        const options = {
            method: "POST",
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: newTodo
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData(prevData => [...prevData, response.data.newTodo])
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const deleteTodo = (id) => {
        const options = {
            method: "DELETE",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData(prevData => prevData.filter(todo => todo._id !== id))
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const updateTodo = (id) => {
        const todoToUpdate = todoData.find(todo => todo._id === id)
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                ...todoToUpdate,
                done: !todoToUpdate.done
            }
        }
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo))
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const editTodo = (id) => {
        setEditId(id);
        const todoToEdit = todoData.find((todo) => todo._id === id);
        setEditTitle(todoToEdit.title);
    };

    const saveEditTodo = (id) => {
        const options = {
            method: 'PATCH',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
            },
            data: {
                title: editTitle,
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData((prevData) =>
                    prevData.map((todo) => (todo._id === id ? { ...todo, title: editTitle } : todo))
                );
                setEditId(null);
                setEditTitle('');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>Tasks</h1>
                <span>
                    <input
                        className={Styles.todoInput}
                        type="text"
                        name="New Todo"
                        value={newTodo}
                        onChange={(event) => {
                            setNewTodo(event.target.value);
                        }}
                    />
                    <button
                        id="addButton"
                        name="add"
                        className={Styles.addButton}
                        onClick={() => {
                            addTodo();
                            setNewTodo('');
                        }}
                    >
                        + New Todo
                    </button>
                </span>
            </div>
            <div id="todoContainer" className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : todoData.length > 0 ? (
                    todoData.map((entry, index) => (
                        <div key={entry._id} className={Styles.todo}>
                            <span className={Styles.infoContainer}>
                                <input
                                    type="checkbox"
                                    checked={entry.done}
                                    onChange={() => {
                                        updateTodo(entry._id, { ...entry, done: !entry.done });
                                    }}
                                />
                                {editId === entry._id ? (
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                ) : (
                                    entry.title
                                )}
                                <br />
                                {editId === entry._id ? (
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />
                                ) : (
                                    entry.description
                                )}
                            </span>
                            <span style={{ cursor: 'pointer' }}>
                                {editId === entry._id ? (
                                    <button onClick={() => saveEditTodo(entry._id)}>Save</button>
                                ) : (
                                    <button onClick={() => editTodo(entry._id)}>Edit</button>
                                )}
                                <button onClick={() => deleteTodo(entry._id)}>Delete</button>
                            </span>
                        </div>
                    ))
                ) : (
                    <p className={Styles.noTodoMessage}>
                        No tasks available. Please add a new task.
                    </p>
                )}
            </div>
        </div>
    );
}









