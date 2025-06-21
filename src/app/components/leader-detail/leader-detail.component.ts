import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Leader } from '../../services/api.service';

@Component({
  selector: 'app-leader-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leader-detail.component.html',
  styleUrl: './leader-detail.component.css'
})
export class LeaderDetailComponent implements OnInit {
  leader: Leader | null = null;
  loading = false;
  showDeleteModal = false;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadLeader();
  }

  loadLeader() {
    const leaderId = this.route.snapshot.paramMap.get('id');
    if (!leaderId) {
      this.router.navigate(['/leaders']);
      return;
    }

    this.loading = true;
    this.apiService.getLeader(parseInt(leaderId)).subscribe({
      next: (response) => {
        this.leader = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leader:', error);
        this.loading = false;
        // Navigate back if leader not found
        this.router.navigate(['/leaders']);
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getStatusBadgeClass(status: string): string {
    const baseClass = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'planning':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'active':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'on-hold':
        return `${baseClass} bg-orange-100 text-orange-800`;
      case 'completed':
        return `${baseClass} bg-blue-100 text-blue-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'planning':
        return 'Planning';
      case 'active':
        return 'Active';
      case 'on-hold':
        return 'On Hold';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  editLeader() {
    if (this.leader) {
      this.router.navigate(['/edit-leader', this.leader.id]);
    }
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleting = false;
  }

  confirmDelete() {
    if (!this.leader) return;
    
    this.deleting = true;
    this.apiService.deleteLeader(this.leader.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.router.navigate(['/leaders']);
      },
      error: (error) => {
        console.error('Error deleting leader:', error);
        this.deleting = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/leaders']);
  }
} 