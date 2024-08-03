import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService, User } from '../workout.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  @Output() selectUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();

  users: User[] = [];
  searchName: string = '';
  filterType: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  paginatedUserData: User[] = [];
  totalPages: number = 1;
  selectedUser: User | null = null;

  constructor(private workoutService: WorkoutService) {
    this.workoutService.userData$.subscribe(data => {
      this.users = data;
      this.paginate();
    });
  }

  onSearch() {
    this.paginate();
  }

  onFilterChange() {
    this.paginate();
  }

  onDeleteUser(user: User): void {
    this.workoutService.deleteUser(user.id); 
    this.paginate(); 
  }

  onItemsPerPageChange(event: any) {
    const value = Number(event.target.value);
    if (value > 0) {
      this.itemsPerPage = value;
      this.currentPage = 1;
      this.paginate();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.paginate();
  }

  paginate() {
    let filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(this.searchName.toLowerCase()));
    if (this.filterType) {
      filteredUsers = filteredUsers.filter(user => user.workouts.some(workout => workout.type === this.filterType));
    }
    this.totalPages = Math.ceil(filteredUsers.length / this.itemsPerPage);
    this.paginatedUserData = filteredUsers.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  onSelectUser(user: User) {
    this.selectUser.emit(user);
  }

  getUserWorkouts(user: User): string {
    return user.workouts.map(w => w.type).join(', ');
  }

  getNumberOfWorkouts(user: User): number {
    return user.workouts.length;
  }

  getTotalWorkoutMinutes(user: User): number {
    return user.workouts.reduce((total, workout) => total + workout.minutes, 0);
  }
}
