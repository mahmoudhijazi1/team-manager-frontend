import { Component, OnInit } from '@angular/core';
import { ApiService, Leader } from '../../services/api.service';

@Component({
  selector: 'app-leaders-list',
  templateUrl: './leaders-list.component.html',
  styleUrls: ['./leaders-list.component.css']
})
export class LeadersListComponent implements OnInit {
  leaders: Leader[] = [];
  loading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadLeaders();
  }

  loadLeaders(): void {
    this.loading = true;
    this.apiService.getLeaders().subscribe({
      next: (response) => {
        this.leaders = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leaders:', error);
        this.loading = false;
      }
    });
  }

  deleteLeader(id: number): void {
    if (confirm('Delete this leader? This will also remove all their workers and projects.')) {
      this.apiService.deleteLeader(id).subscribe(() => {
        this.loadLeaders();
      });
    }
  }
}