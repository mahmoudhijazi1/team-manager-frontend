import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Task, Project, Worker } from '../../services/api.service';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.css',
})
export class TaskEditComponent implements OnInit {
  task: Partial<Task> = {};

  projects: Project[] = [];
  workers: Worker[] = [];
  taskId: number | null = null;
  loading = true;
  submitting = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';
  loadingWorkers = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/tasks']);
      return;
    }
    this.taskId = parseInt(id);
    this.loadProjectsAndTask();
  }

  loadProjectsAndTask() {
    this.loading = true;
    this.apiService.getProjects().subscribe({
      next: (projectResponse) => {
        this.projects = projectResponse.data;
        this.loadTask();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
        this.errorMessage = 'Could not load project data. Please try again.';
        this.showErrorModal = true;
      },
    });
  }

  loadTask() {
    if (!this.taskId) return;
    this.apiService.getTask(this.taskId).subscribe({
      next: (taskResponse) => {
        this.task = taskResponse.data;
        if (this.task.project_id) {
          this.loadWorkersForProject(this.task.project_id);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.loading = false;
        this.errorMessage = 'Could not load task data. Please try again.';
        this.showErrorModal = true;
      },
    });
  }

  loadWorkersForProject(projectId: number) {
    this.loadingWorkers = true;
    this.workers = [];

    const project = this.projects.find((p) => p.id === projectId);
    if (project && project.leader_id) {
      this.apiService.getLeader(project.leader_id).subscribe({
        next: (leaderResponse) => {
          this.workers = leaderResponse.data.workers || [];
          this.loadingWorkers = false;
        },
        error: (err) => {
          console.error('Error fetching workers for leader:', err);
          this.loadingWorkers = false;
        },
      });
    } else {
      this.loadingWorkers = false;
    }
  }

  onProjectChange(event: Event) {
    const projectId = parseInt((event.target as HTMLSelectElement).value, 10);
    this.task.assigned_to = undefined;
    if (projectId) {
      this.loadWorkersForProject(projectId);
    } else {
      this.workers = [];
    }
  }

  onSubmit() {
    if (this.submitting || !this.taskId) return;

    this.submitting = true;
    this.apiService.updateTask(this.taskId, this.task).subscribe({
      next: () => {
        this.submitting = false;
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage =
          error.error?.message || 'An error occurred while updating the task';
        this.showErrorModal = true;
      },
    });
  }

  goToTasksList() {
    this.showSuccessModal = false;
    this.router.navigate(['/tasks']);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }
}
