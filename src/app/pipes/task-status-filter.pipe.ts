import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../services/api.service';

@Pipe({
  name: 'taskStatusFilter',
  standalone: true,
})
export class TaskStatusFilterPipe implements PipeTransform {
  transform(tasks: Task[], status: string): Task[] {
    if (!tasks || !status || status === 'all') {
      return tasks;
    }
    return tasks.filter((task) => task.status === status);
  }
}
