import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule],
  templateUrl: './tasks.html',
})
export class Tasks implements OnInit {
  tasks: any[] = [];
  newTaskDescription = '';
  editingTask: any = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    const userId = this.authService.getUserId();
    console.log('User ID:', userId); // Debugging line
    if (!userId) return;
    this.taskService.getAllTasks(userId).subscribe({
      next: (response) => {
        // console.log('Tasks loaded:', response.data); // Debugging line
        this.tasks = response.data.sort((a: any, b: any) => a.id - b.id);
        this.cdr.detectChanges();
        // console.log('Tasks after assignment:', this.tasks); // Debugging line
      },
      error: () => console.error('Failed to load tasks'),
    });
  }

  createTask() {
    const userId = this.authService.getUserId();
    if (!this.newTaskDescription.trim()) return;
    this.taskService
      .createTask({ description: this.newTaskDescription, userId: userId })
      .subscribe({
        next: () => {
          this.newTaskDescription = '';
          this.loadTasks();
        },
      });
  }

  startEdit(task: any) {
    this.editingTask = { ...task };
  }

  saveEdit() {
    this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe({
      next: () => {
        this.editingTask = null;
        this.loadTasks();
      },
    });
  }

  toggleComplete(task: any) {
    const updated = { ...task, isCompleted: !task.isCompleted };
    this.taskService.updateTask(task.id, updated).subscribe({
      next: () => this.loadTasks(),
      error: () => console.error('Failed to toggle task'),
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  pendingTasks() {
    return this.tasks.filter((t) => !t.isCompleted);
  }

  completedTasks() {
    return this.tasks.filter((t) => t.isCompleted);
  }
}
