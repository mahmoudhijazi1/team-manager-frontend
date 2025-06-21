import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-leader-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leader-form.component.html',
  styleUrl: './leader-form.component.css',
})
export class LeaderFormComponent {
  leader = {
    name: '',
    email: '',
    team_name: '',
  };

  submitting = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    if (this.submitting) return;

    this.submitting = true;
    this.apiService.createLeader(this.leader).subscribe({
      next: () => {
        this.submitting = false;
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage =
          error.error?.message || 'An error occurred while creating the leader';
        this.showErrorModal = true;
      },
    });
  }

  createAnother() {
    this.showSuccessModal = false;
    this.resetForm();
  }

  goToLeadersList() {
    this.showSuccessModal = false;
    this.router.navigate(['/leaders']);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  goBack() {
    this.router.navigate(['/leaders']);
  }

  resetForm() {
    this.leader = {
      name: '',
      email: '',
      team_name: '',
    };
  }
}
