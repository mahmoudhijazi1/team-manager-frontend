import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Leader } from '../../services/api.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './leaders-list.component.html',
  styleUrl: './leaders-list.component.css'
})
export class LeadersListComponent implements OnInit {
  leaders: Leader[] = [];
  loading = false;
  showDeleteModal = false;
  selectedLeader: Leader | null = null;
  deleting = false;

  currentPage = 1;
  pageSize = 10;

  searchTerm = '';

  get totalPages(): number {
    return Math.ceil(this.leaders.length / this.pageSize) || 1;
  }

  get pagedLeaders(): Leader[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.leaders.slice(start, start + this.pageSize);
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

  leadersOriginal: Leader[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLeaders();
  }

  loadLeaders() {
    this.loading = true;
    this.apiService.getLeaders().subscribe({
      next: (response) => {
        this.leaders = response.data;
        this.leadersOriginal = response.data;
        this.currentPage = 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leaders:', error);
        this.loading = false;
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

  openDeleteModal(leader: Leader) {
    this.selectedLeader = leader;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedLeader = null;
    this.deleting = false;
  }

  confirmDelete() {
    if (!this.selectedLeader) return;
    
    this.deleting = true;
    this.apiService.deleteLeader(this.selectedLeader.id).subscribe({
      next: () => {
        this.leaders = this.leaders.filter(l => l.id !== this.selectedLeader?.id);
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting leader:', error);
        this.deleting = false;
      }
    });
  }

  viewLeaderDetails(leader: Leader) {
    this.router.navigate(['/leader', leader.id]);
  }

  filterLeaders() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.leaders = this.leadersOriginal;
    } else {
      this.leaders = this.leadersOriginal.filter(leader =>
        (leader.name && leader.name.toLowerCase().includes(term)) ||
        (leader.email && leader.email.toLowerCase().includes(term))
      );
    }
    this.currentPage = 1;
  }
}