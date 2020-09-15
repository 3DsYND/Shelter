import React from 'react';
import style from './Projects.module.css';

import ProjectsList from './ProjectsList';
import TasksList from './TasksList';


export default function(props) {
  let [activeProject, setActiveProject] = React.useState(null)


  return (
    <div className={style.space}>
      <div className={style.panel} style={{"width": "16vw"}}>
        <ProjectsList project={activeProject} changeProject={setActiveProject} />
      </div>
      {activeProject &&
      <div className={style.panel} style={{"flex": "auto"}}>
        <TasksList project={activeProject} />
      </div>
      }
    </div>
  )
}

