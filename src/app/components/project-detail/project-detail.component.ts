import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Project } from '../../services/api.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  loading = false;
  showDeleteModal = false;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadProject();
  }

  loadProject() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (!projectId) {
      this.router.navigate(['/projects']);
      return;
    }

    this.loading = true;
    this.apiService.getProject(parseInt(projectId)).subscribe({
      next: (response) => {
        this.project = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.loading = false;
        this.router.navigate(['/projects']);
      },
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getStatusBadgeClass(status: string): string {
    const baseClass = 'px-4 py-2 rounded-full text-sm font-semibold';
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

  getTaskStatusBadgeClass(status: string): string {
    const baseClass = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'pending':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'in-progress':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'completed':
        return `${baseClass} bg-green-100 text-green-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getTaskStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
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

  editProject() {
    if (this.project) {
      this.router.navigate(['/edit-project', this.project.id]);
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
    if (!this.project) return;

    this.deleting = true;
    this.apiService.deleteProject(this.project.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.router.navigate(['/projects']);
      },
      error: (error) => {
        console.error('Error deleting project:', error);
        this.deleting = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/projects']);
  }
}
