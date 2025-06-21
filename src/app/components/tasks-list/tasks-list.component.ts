import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Task } from '../../services/api.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskStatusFilterPipe } from '../../pipes/task-status-filter.pipe';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TaskStatusFilterPipe],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  selectedStatus = 'all';
  showDeleteModal = false;
  selectedTask: Task | null = null;
  deleting = false;
  updating = false;
  searchTerm = '';
  workerId: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;

  get filteredTasks(): Task[] {
    let filtered = this.tasks;

    if (this.searchTerm.trim()) {
      filtered = filtered.filter(
        (task) =>
          (task.title &&
            task.title
              .toLowerCase()
              .includes(this.searchTerm.trim().toLowerCase())) ||
          (task.project?.name &&
            task.project.name
              .toLowerCase()
              .includes(this.searchTerm.trim().toLowerCase())) ||
          (task.worker?.name &&
            task.worker.name
              .toLowerCase()
              .includes(this.searchTerm.trim().toLowerCase()))
      );
    }

    return filtered;
  }

  get totalPages(): number {
    const filteredByStatus = this.filteredTasks.filter(
      (task) =>
        this.selectedStatus === 'all' || task.status === this.selectedStatus
    );
    return Math.ceil(filteredByStatus.length / this.pageSize) || 1;
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

  statusFilters = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.workerId = id ? +id : null;
      this.loadTasks();
    });
  }

  loadTasks() {
    this.loading = true;
    this.apiService.getTasks().subscribe({
      next: (response) => {
        let allTasks = response.data;
        if (this.workerId) {
          allTasks = allTasks.filter(
            (task: any) => task.assigned_to === this.workerId
          );
        }
        this.tasks = allTasks;
        this.currentPage = 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      },
    });
  }

  setStatusFilter(status: string) {
    this.selectedStatus = status;
  }

  getStatusButtonClass(status: string): string {
    const baseClass =
      'px-6 py-3 rounded-lg font-medium transition-all duration-300';
    if (status === this.selectedStatus) {
      return `${baseClass} bg-blue-600 text-white shadow-lg`;
    }
    return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };
    return (
      statusClasses[status as keyof typeof statusClasses] ||
      'bg-gray-100 text-gray-800'
    );
  }

  getStatusLabel(status: string): string {
    const statusLabels = {
      pending: 'Pending',
      'in-progress': 'In Progress',
      completed: 'Completed',
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  }

  getDeadlineClass(deadline: string): string {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'text-red-600';
    } else if (diffDays <= 3) {
      return 'text-amber-600';
    }
    return 'text-gray-900';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  updateTaskStatus(task: Task, event: any) {
    const newStatus = event.target.value;
    if (newStatus === task.status) return;

    this.updating = true;
    this.apiService.updateTask(task.id, { status: newStatus }).subscribe({
      next: (response) => {
        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = response.data;
        }
        this.updating = false;
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        event.target.value = task.status;
        this.updating = false;
      },
    });
  }

  openDeleteModal(task: Task) {
    this.selectedTask = task;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedTask = null;
    this.deleting = false;
  }

  confirmDelete() {
    if (!this.selectedTask) return;

    this.deleting = true;
    this.apiService.deleteTask(this.selectedTask.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((t) => t.id !== this.selectedTask?.id);
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.deleting = false;
      },
    });
  }

  editTask(task: Task) {
    this.router.navigate(['/edit-task', task.id]);
  }

  filterTasks() {
    this.currentPage = 1;
  }
}
