import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Worker } from '../../services/api.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-workers-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.css',
})
export class WorkersListComponent implements OnInit {
  workers: Worker[] = [];
  filteredWorkers: Worker[] = [];
  loading = false;
  searchTerm = '';
  selectedPosition = '';
  uniquePositions: string[] = [];
  showDeleteModal = false;
  selectedWorker: Worker | null = null;
  deleting = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;

  get totalPages(): number {
    return Math.ceil(this.filteredWorkers.length / this.pageSize) || 1;
  }

  get pagedWorkers(): Worker[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredWorkers.slice(start, start + this.pageSize);
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
    const maxVisible = 5; // Show max 5 page numbers

    if (this.totalPages <= maxVisible) {
      // If total pages is small, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      // Adjust start if we're near the end
      if (end === this.totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadWorkers();
  }

  loadWorkers() {
    this.loading = true;
    this.apiService.getWorkers().subscribe({
      next: (response) => {
        this.workers = response.data;
        this.filteredWorkers = this.workers;
        this.currentPage = 1;
        this.extractUniquePositions();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading workers:', error);
        this.loading = false;
      },
    });
  }

  extractUniquePositions() {
    const positions = this.workers.map((worker) => worker.position);
    this.uniquePositions = [...new Set(positions)].sort();
  }

  filterWorkers() {
    this.filteredWorkers = this.workers.filter((worker) => {
      const matchesSearch =
        !this.searchTerm ||
        worker.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        worker.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesPosition =
        !this.selectedPosition || worker.position === this.selectedPosition;

      return matchesSearch && matchesPosition;
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

  openDeleteModal(worker: Worker) {
    this.selectedWorker = worker;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedWorker = null;
    this.deleting = false;
  }

  confirmDelete() {
    if (!this.selectedWorker) return;

    this.deleting = true;
    this.apiService.deleteWorker(this.selectedWorker.id).subscribe({
      next: () => {
        this.workers = this.workers.filter(
          (w) => w.id !== this.selectedWorker?.id
        );
        this.filterWorkers();
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting worker:', error);
        this.deleting = false;
      },
    });
  }

  viewWorkerTasks(worker: Worker) {
    this.router.navigate(['/worker', worker.id, 'tasks']);
  }
}
