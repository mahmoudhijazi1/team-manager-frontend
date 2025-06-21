import { Routes } from '@angular/router';
import { LeadersListComponent } from './components/leaders-list/leaders-list.component';
import { WorkersListComponent } from './components/workers-list/workers-list.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { LeaderFormComponent } from './components/leader-form/leader-form.component';
import { WorkerFormComponent } from './components/worker-form/worker-form.component';
import { LeaderDetailComponent } from './components/leader-detail/leader-detail.component';
import { LeaderEditComponent } from './components/leader-edit/leader-edit.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/leaders', pathMatch: 'full' },
  { path: 'leaders', component: LeadersListComponent },
  { path: 'leader/:id', component: LeaderDetailComponent },
  { path: 'edit-leader/:id', component: LeaderEditComponent },
  { path: 'workers', component: WorkersListComponent },
  { path: 'projects', component: ProjectsListComponent },
  { path: 'project/:id', component: ProjectDetailComponent },
  { path: 'tasks', component: TasksListComponent },
  { path: 'edit-task/:id', component: TaskEditComponent },
  { path: 'create-task', component: TaskFormComponent },
  { path: 'create-project', component: ProjectFormComponent },
  { path: 'create-leader', component: LeaderFormComponent },
  { path: 'create-worker', component: WorkerFormComponent },
  { path: 'worker/:id/tasks', component: TasksListComponent },
];
