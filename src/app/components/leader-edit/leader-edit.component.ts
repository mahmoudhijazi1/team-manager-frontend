import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Leader } from '../../services/api.service';

@Component({
  selector: 'app-leader-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leader-edit.component.html',
  styleUrl: './leader-edit.component.css'
})
export class LeaderEditComponent implements OnInit {
  leader: Partial<Leader> = {
    name: '',
    email: '',
    team_name: ''
  };

  leaderId: number | null = null;
  loading = false;
  submitting = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadLeader();
  }

  loadLeader() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/leaders']);
      return;
    }

    this.leaderId = parseInt(id);
    this.loading = true;

    this.apiService.getLeader(this.leaderId).subscribe({
      next: (response) => {
        this.leader = {
          name: response.data.name,
          email: response.data.email,
          team_name: response.data.team_name
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leader:', error);
        this.loading = false;
        this.errorMessage = 'Could not load leader data. Please try again.';
        this.showErrorModal = true;
      }
    });
  }

  onSubmit() {
    if (this.submitting || !this.leaderId) return;

    this.submitting = true;
    this.apiService.updateLeader(this.leaderId, this.leader).subscribe({
      next: () => {
        this.submitting = false;
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error.error?.message || 'An error occurred while updating the leader';
        this.showErrorModal = true;
      }
    });
  }

  goToLeaderDetail() {
    this.showSuccessModal = false;
    if (this.leaderId) {
      this.router.navigate(['/leader', this.leaderId]);
    }
  }

  goToLeadersList() {
    this.showSuccessModal = false;
    this.router.navigate(['/leaders']);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  goBack() {
    if (this.leaderId) {
      this.router.navigate(['/leader', this.leaderId]);
    } else {
      this.router.navigate(['/leaders']);
    }
  }
} 