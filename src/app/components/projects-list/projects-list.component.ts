import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Project } from '../../services/api.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css'
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  loading = false;
  showDeleteModal = false;
  selectedProject: Project | null = null;
  deleting = false;

  currentPage = 1;
  pageSize = 10;

  searchTerm = '';

  get totalPages(): number {
    return Math.ceil(this.filteredProjects.length / this.pageSize) || 1;
  }

  get pagedProjects(): Project[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProjects.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      
      if (end === this.totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.apiService.getProjects().subscribe({
      next: (response) => {
        this.projects = response.data;
        this.filteredProjects = this.projects;
        this.currentPage = 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  openDeleteModal(project: Project) {
    this.selectedProject = project;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedProject = null;
    this.deleting = false;
  }

  confirmDelete() {
    if (!this.selectedProject) return;
    this.deleting = true;
    this.apiService.deleteProject(this.selectedProject.id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== this.selectedProject?.id);
        this.filteredProjects = this.projects;
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting project:', error);
        this.deleting = false;
      }
    });
  }

  viewProjectDetails(project: Project) {
    this.router.navigate(['/project', project.id]);
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  filterProjects() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(project =>
        (project.name && project.name.toLowerCase().includes(term)) ||
        (project.description && project.description.toLowerCase().includes(term)) ||
        (project.leader?.name && project.leader.name.toLowerCase().includes(term))
      );
    }
    this.currentPage = 1;
  }
}