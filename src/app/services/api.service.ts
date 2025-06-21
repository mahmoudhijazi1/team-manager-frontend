import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Leader {
  id: number;
  name: string;
  email: string;
  team_name: string;
  workers?: Worker[];
  projects?: Project[];
}

export interface Worker {
  id: number;
  name: string;
  email: string;
  position: string;
  leader_id: number;
  leader?: Leader;
  tasks?: Task[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  deadline: string;
  leader_id: number;
  leader?: Leader;
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
  project_id: number;
  assigned_to: number;
  project?: Project;
  worker?: Worker;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:9010/api';

  constructor(private http: HttpClient) {}

  getLeaders(): Observable<{ data: Leader[] }> {
    return this.http.get<{ data: Leader[] }>(`${this.baseUrl}/leaders`);
  }

  getLeader(id: number): Observable<{ data: Leader }> {
    return this.http.get<{ data: Leader }>(`${this.baseUrl}/leaders/${id}`);
  }

  createLeader(leader: Partial<Leader>): Observable<{ data: Leader }> {
    return this.http.post<{ data: Leader }>(`${this.baseUrl}/leaders`, leader);
  }

  updateLeader(
    id: number,
    leader: Partial<Leader>
  ): Observable<{ data: Leader }> {
    return this.http.put<{ data: Leader }>(
      `${this.baseUrl}/leaders/${id}`,
      leader
    );
  }

  deleteLeader(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/leaders/${id}`);
  }

  getWorkers(): Observable<{ data: Worker[] }> {
    return this.http.get<{ data: Worker[] }>(`${this.baseUrl}/workers`);
  }

  createWorker(worker: Partial<Worker>): Observable<{ data: Worker }> {
    return this.http.post<{ data: Worker }>(`${this.baseUrl}/workers`, worker);
  }

  updateWorker(
    id: number,
    worker: Partial<Worker>
  ): Observable<{ data: Worker }> {
    return this.http.put<{ data: Worker }>(
      `${this.baseUrl}/workers/${id}`,
      worker
    );
  }

  deleteWorker(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/workers/${id}`);
  }

  getProjects(): Observable<{ data: Project[] }> {
    return this.http.get<{ data: Project[] }>(`${this.baseUrl}/projects`);
  }

  getProject(id: number): Observable<{ data: Project }> {
    return this.http.get<{ data: Project }>(`${this.baseUrl}/projects/${id}`);
  }

  createProject(project: Partial<Project>): Observable<{ data: Project }> {
    return this.http.post<{ data: Project }>(
      `${this.baseUrl}/projects`,
      project
    );
  }

  updateProject(
    id: number,
    project: Partial<Project>
  ): Observable<{ data: Project }> {
    return this.http.put<{ data: Project }>(
      `${this.baseUrl}/projects/${id}`,
      project
    );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/projects/${id}`);
  }

  getTasks(): Observable<{ data: Task[] }> {
    return this.http.get<{ data: Task[] }>(`${this.baseUrl}/tasks`);
  }

  getTask(id: number): Observable<{ data: Task }> {
    return this.http.get<{ data: Task }>(`${this.baseUrl}/tasks/${id}`);
  }

  createTask(task: Partial<Task>): Observable<{ data: Task }> {
    return this.http.post<{ data: Task }>(`${this.baseUrl}/tasks`, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<{ data: Task }> {
    return this.http.put<{ data: Task }>(`${this.baseUrl}/tasks/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}`);
  }
}
