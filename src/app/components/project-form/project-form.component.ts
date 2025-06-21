import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Leader } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  project = {
    name: '',
    description: '',
    leader_id: undefined as number | undefined,
    deadline: ''
  };

  leaders: Leader[] = [];
  submitting = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLeaders();
  }

  loadLeaders() {
    this.apiService.getLeaders().subscribe({
      next: (response) => {
        this.leaders = response.data;
      },
      error: (error) => {
        console.error('Error loading leaders:', error);
      }
    });
  }

  onSubmit() {
    if (this.submitting) return;

    this.submitting = true;
    this.apiService.createProject(this.project).subscribe({
      next: (response) => {
        this.submitting = false;
        this.showSuccessModal = true;
        this.router.navigate(['/projects']);
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error.error?.message || 'An error occurred while creating the project';
        this.showErrorModal = true;
      }
    });
  }

  createAnother() {
    this.showSuccessModal = false;
    this.resetForm();
  }

  goToProjectsList() {
    this.showSuccessModal = false;
    // Navigate to projects list
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  goBack() {
    this.location.back();
  }

  resetForm() {
    this.project = {
      name: '',
      description: '',
      leader_id: undefined as number | undefined,
      deadline: ''
    };
  }
}