import { Component, OnInit } from '@angular/core';
import { ApiService, Worker } from '../../services/api.service';

@Component({
  selector: 'app-workers-list',
  templateUrl: './workers-list.component.html',
  styleUrls: ['./workers-list.component.css']
})
export class WorkersListComponent implements OnInit {
  workers: Worker[] = [];
  loading = false;
  searchTerm = '';
  selectedPosition = 'all';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadWorkers();
  }

  loadWorkers(): void {
    this.loading = true;
    this.apiService.getWorkers().subscribe({
      next: (response) => {
        this.workers = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading workers:', error);
        this.loading = false;
      }
    });
  }

  get filteredWorkers(): Worker[] {
    return this.workers.filter(worker => {
      const matchesSearch = worker.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           worker.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesPosition = this.selectedPosition === 'all' || worker.position === this.selectedPosition;
      return matchesSearch && matchesPosition;
    });
  }

  get uniquePositions(): string[] {
    const positions = this.workers.map(w => w.position);
    return [...new Set(positions)];
  }

  deleteWorker(id: number): void {
    if (confirm('Delete this worker? All their assigned tasks will be unassigned.')) {
      this.apiService.deleteWorker(id).subscribe(() => {
        this.loadWorkers();
      });
    }
  }
}