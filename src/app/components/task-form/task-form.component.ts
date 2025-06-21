import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Project, Worker } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  task = {
    title: '',
    project_id: undefined as number | undefined,
    assigned_to: undefined as number | undefined,
    deadline: '',
    status: 'pending' as 'pending' | 'in-progress' | 'completed'
  };

  projects: Project[] = [];
  workers: Worker[] = [];
  submitting = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';
  loadingWorkers = false;

  constructor(
    private apiService: ApiService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.setMinDate();
  }

  setMinDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.task.deadline = tomorrow.toISOString().split('T')[0];
  }

  loadProjects() {
    this.apiService.getProjects().subscribe({
      next: (response) => {
        this.projects = response.data;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  onProjectChange(event: Event) {
    const projectId = (event.target as HTMLSelectElement).value;
    this.task.assigned_to = undefined;
    this.workers = [];
    
    if (!projectId) {
      return;
    }

    this.loadingWorkers = true;
    const selectedProject = this.projects.find(p => p.id === +projectId);
    
    if (selectedProject && selectedProject.leader_id) {
      this.apiService.getLeader(selectedProject.leader_id).subscribe({
        next: (response) => {
          this.workers = response.data.workers || [];
          this.loadingWorkers = false;
        },
        error: (err) => {
          console.error('Error fetching workers', err);
          this.loadingWorkers = false;
        }
      });
    } else {
      this.loadingWorkers = false;
    }
  }

  onSubmit() {
    if (this.submitting) return;

    this.submitting = true;
    this.apiService.createTask(this.task).subscribe({
      next: (response) => {
        this.submitting = false;
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error.error?.message || 'An error occurred while creating the task';
        this.showErrorModal = true;
      }
    });
  }

  createAnother() {
    this.showSuccessModal = false;
    this.resetForm();
  }

  goToTasksList() {
    this.showSuccessModal = false;
    this.router.navigate(['/tasks']);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  goBack() {
    this.location.back();
  }

  resetForm() {
    this.task = {
      title: '',
      project_id: undefined as number | undefined,
      assigned_to: undefined as number | undefined,
      deadline: '',
      status: 'pending' as 'pending' | 'in-progress' | 'completed'
    };
    this.setMinDate();
  }
}