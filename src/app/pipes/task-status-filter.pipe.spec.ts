import { TaskStatusFilterPipe } from './task-status-filter.pipe';

describe('TaskStatusFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new TaskStatusFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
