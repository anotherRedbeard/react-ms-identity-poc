import React, { useState, useRef, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { nanoid } from "nanoid";
import ListGroup from "react-bootstrap/ListGroup";

import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";

import useFetchWithMsal from '../hooks/useFetchWithMsal';
import { protectedResources } from "../authConfig";

function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
}

export const ListView = (props) => {
    const { instance } = useMsal();
    const account = instance.getActiveAccount();
    const [configData, setConfigData] = useState('');

    const { error, execute } = useFetchWithMsal({
        scopes: protectedResources.apiTodoList.scopes.write
    });

    const [tasks, setTasks] = useState(props.todoListData);

    const handleCompleteTask = (id) => {
        const updatedTask = tasks.find(task => id === task.id);
        updatedTask.isComplete = !updatedTask.isComplete;

        execute("PUT", protectedResources.apiTodoList.endpoint + `/${id}`, updatedTask);
    }

    const handleAddTask = (name) => {
        const newTask = {
            name: name,
            isComplete: false
        };

        console.log("Adding task: ", newTask);
        execute("POST", protectedResources.apiTodoList.endpoint, newTask).then((response) => {
            console.log("Response: ", response.message);
            if (response) {
                // Use the task object from the response to get the id
                const taskWithId = { ...newTask, id: response.id };
                setTasks([...tasks, taskWithId]);
                console.log("Tasks: ", tasks);
            }
        })
    }

    const handleDeleteTask = (id) => {
        execute("DELETE", protectedResources.apiTodoList.endpoint + `/${id}`).then((response) => {
            if (response) {
                const remainingTasks = tasks.filter(task => id !== task.id);
                setTasks(remainingTasks);
            }
        });
    }

    const handleEditTask = (id, newName) => {
        const updatedTask = tasks.find(task => id === task.id);
        updatedTask.name = newName;

        execute("PUT", protectedResources.apiTodoList.endpoint + `/${id}`, updatedTask);
    }

    const taskList = tasks
        .filter(task => !task.isComplete)
        .map(task => (
            <TodoItem
                id={task.id}
                name={task.name}
                isComplete={task.isComplete}
                key={task.id}
                completeTask={handleCompleteTask}
                deleteTask={handleDeleteTask}
                editTask={handleEditTask}
            />
        ));

    const listHeadingRef = useRef(null);
    const prevTaskLength = usePrevious(tasks.length);

    useEffect(() => {
        if (tasks.length - prevTaskLength === -1) {
            listHeadingRef.current.focus();
        }
    }, [tasks.length, prevTaskLength]);

    useEffect(() => {
        const getConfigData = async () => {
            try {
                execute("GET", protectedResources.apiConfig.endpoint + '/getconfigwithmsi').then((response) => {
                    setConfigData(response.message);
                    console.log("Config Data: ", response);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getConfigData();
    }, [execute, configData])

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    
    return (
        <div className="data-area-div">
            <div>Message from App Config: {configData}</div>
            <TodoForm addTask={handleAddTask} />
            <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}></h2>
            <ListGroup className="todo-list">
                {taskList}
            </ListGroup>
        </div>
    );
}
