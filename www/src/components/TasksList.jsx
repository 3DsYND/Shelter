import React, {useState, useEffect} from 'react';
import style from './TasksList.module.css';
import jsonFetch from '../utils/fetch';
import {API_ENDPOINT} from '../constants';


export default function TasksList(props) {
  let [tasks, setTasks] = useState([]);
  let [project, setProject] = useState();

  useEffect(() => {
    async function fetchProject(projectId) {
      const response = await jsonFetch(API_ENDPOINT + "/projects/" + projectId + "/");
      const json = await response.json()
      setProject(json);
    }
    fetchProject(props.project);


    async function fetchTasks(projectId) {
      const response = await jsonFetch(API_ENDPOINT + "/projects/" + projectId + "/tasks/");
      const json = await response.json()
      setTasks(json);
    }
    fetchTasks(props.project);
  }, [props.project]);

  async function updateTask(taskId, title) {
    if (taskId) {
      // Updating the task
      const task = {title: title}
      const response = await jsonFetch(
        API_ENDPOINT + "/projects/" + props.project + "/" + taskId + "/",
        {method: "PATCH", body: task}
      );
      const json = await response.json();

      if (response.ok && response.status === 200) {
        setTasks(tasks => tasks.map((e) => {
          if (e.id === taskId) e.title = json.title;
          return e;
        }));
      } else {
        // Handle
      }
    } else {
      // Creating a new task
      const task = {title: title}
      const response = await jsonFetch(
        API_ENDPOINT + "/projects/" + props.project + "/tasks/",
        {method: "POST", body: task}
      );
      const json = await response.json();

      if (response.ok && response.status === 201) {
        task["id"] = json.id;
        setTasks((tasks) => tasks.concat([task]));
      } else {
        // Handle
      }
    }
  }

  async function deleteTask(taskId) {
    const response = await jsonFetch(
      API_ENDPOINT + "/projects/" + props.project + "/" + taskId + "/",
      {method: "DELETE"}
    );
    if (response.ok && response.status === 204) {
      setTasks(tasks => tasks.filter(task => task.id !== taskId))
    } else {
      // Handle
    }
  }

  return project ?
    <>
      <h3 style={{"display": "inline"}}>{project.title}</h3>
      <ul className={style.tasksList}>
        {tasks.map(task =>
          <li key={task.id}>
            <NewTaskItem task={task} update={updateTask} delete={deleteTask} />
          </li>
        )}
        <NewTaskItem update={updateTask} />
      </ul>
    </> :
    null;
}



function NewTaskItem(props) {
  const isNew = !("task" in props)
  let [isShow, setIsShow] = useState(false);
  let [title, setTitle] = useState(isNew ? "" : props.task.title);

  function handleChange(e) {
    setTitle(e.target.value);
  }

  function handleSubmit(e) {
    if (e.key === "Enter") {
      props.update(isNew ? null : props.task.id, title);
      isNew && setTitle("");
      setIsShow(false);
    }
  }

  return isShow ?
        <input
          value={title}
          onChange={handleChange}
          autoFocus
          onBlur={() => setIsShow(false)}
          onKeyUp={handleSubmit}
        /> :
        <>
          <p onClick={() => setIsShow(true)}>{isNew ? "Create new task" : props.task.title}</p>
          {isNew ? null :
            <button
              className={style.remove + " text-button"}
              onClick={(e) => props.delete(parseInt(e.target.dataset.remove))}
              data-remove={props.task.id}
            >x</button>
          }
        </>
}
