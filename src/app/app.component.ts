import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserChartComponent } from './user-chart/user-chart.component';
import { FormsModule } from '@angular/forms';
import { WorkoutService, User } from './workout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserFormComponent,
    UserListComponent,
    UserChartComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Health Tracker'; 
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workoutService.getUsers().subscribe(users => {
      this.users = users;
      if (this.users.length > 0) {
        this.selectedUser = this.users[0]; 
      }
    });
  }

  onSelectUser(user: User) {
    this.selectedUser = user;
  }

  onAddUser(user: User) {
    this.workoutService.addUserWorkout(user.name, '', 0);
    this.workoutService.getUsers().subscribe(users => {
      this.users = users;
      this.selectedUser = this.users.find(u => u.id === user.id) || null; 
    });
  }

  onDeleteUser(user: User) {
    this.workoutService.deleteUser(user.id);
    this.workoutService.getUsers().subscribe(users => {
      this.users = users;
      if (this.selectedUser && this.selectedUser.id === user.id) {
        this.selectedUser = this.users.length > 0 ? this.users[0] : null; 
      }
    });
  }
}
