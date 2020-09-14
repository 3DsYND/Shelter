import React, {useState, useEffect} from 'react';
import style from './ProjectsList.module.css';

import OnBlur from './OnBlur';
import useFetch from '../hooks/useFetch';
import utilsFetch from '../utils/fetch';
import {API_ENDPOINT} from '../constants';


export default function ProjectsList(props) {
  const [isShowNewInput, setShowNewInput] = useState(false);
  const [projects, setProjects] = useState([]);
  const fetchProjects = useFetch(API_ENDPOINT + "/projects/")

  useEffect(() => {
    if (fetchProjects.loading === false) {
      setProjects(fetchProjects.response || [])
    }
  }, [fetchProjects.loading]);

  async function createProject(title) {
    const project = {"title": title}
    const response = await utilsFetch(
      API_ENDPOINT + "/projects/",
      {method: "POST", body: project}
    );
    const json = await response.json()

    if (response.ok && response.status === 201) {
      project["id"] = json["id"];
      setProjects((p) => (p.concat(project)));
    } else {
      // Handle error (And add try catch)
    }
  }

  async function deleteProject(e) {
    // Show popup window with alert
    let id = e.target.dataset.remove;
    const response = await utilsFetch(
      API_ENDPOINT + "/projects/" + id + "/",
      {"method": "DELETE"}
    );
    if (response.ok && response.status === 204) {
        setProjects((p) => (p.filter((project) => project.id != id)))
        if (id === props.project) {
          props.changeProject(null)
        }
    } else {
      // Handle error
    }
  };

  return (
    <div className={style.projects}>
      <div>
        <h3 style={{"display":"inline"}}>PROJECTS</h3>
        <button
          className="text-button"
          style={{"float":"right"}}
          onClick={() => setShowNewInput(true)}
        >Add</button>
      </div>

      <ul>
        {projects.map( project =>
          <li key={ project.id } className={style.projectItem}>
            <a href="#" onClick={() => props.changeProject(project.id)}>
              {project.title}
            </a>
            <button
              className={style.remove + " text-button"}
              style={{"float":"right"}}
              data-remove={project.id}
              onClick={deleteProject}
            >x</button>
          </li>
        )}
      </ul>

      <NewProjectInput isShow={isShowNewInput} setShow={setShowNewInput} createProject={createProject} />
    </div>
  );
}



function NewProjectInput(props) {
  let [newProjectTitle, setNewProjectTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    props.createProject(newProjectTitle)
    setNewProjectTitle("");
    props.setShow(false);
  }

  return (
    <OnBlur isShow={props.isShow} setShow={props.setShow}>
      <form className={style.newProject} onSubmit={handleSubmit}>
        <input
          type="text"
          autoFocus
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
        />
        <button type="submit">OK</button>
      </form>
    </OnBlur>
  )
}
