import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Leader } from '../../services/api.service';

@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './worker-form.component.html',
  styleUrl: './worker-form.component.css'
})
export class WorkerFormComponent implements OnInit {
  worker = {
    name: '',
    email: '',
    position: '',
    leader_id: undefined as number | undefined
  };

  leaders: Leader[] = [];
  submitting = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
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
        this.errorMessage = 'Could not load leaders. Please try again later.';
        this.showErrorModal = true;
      }
    });
  }

  onSubmit() {
    if (this.submitting) return;

    this.submitting = true;
    this.apiService.createWorker(this.worker).subscribe({
      next: () => {
        this.submitting = false;
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error.error?.message || 'An error occurred while creating the worker';
        this.showErrorModal = true;
      }
    });
  }

  createAnother() {
    this.showSuccessModal = false;
    this.resetForm();
  }

  goToWorkersList() {
    this.showSuccessModal = false;
    this.router.navigate(['/workers']);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  goBack() {
    this.router.navigate(['/workers']);
  }

  resetForm() {
    this.worker = {
      name: '',
      email: '',
      position: '',
      leader_id: undefined as number | undefined
    };
  }
} 