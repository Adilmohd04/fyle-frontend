import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkoutService, User } from '../workout.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  userName: string = '';
  workoutType: string = '';
  minutes: number = 0;
  @Output() addUser = new EventEmitter<any>();

  constructor(private workoutService: WorkoutService) {}

  addUserWorkout() {
    this.workoutService.getUsers().subscribe(users => {
      const newId = users.length + 1;
      const newUser = { id: newId, name: this.userName, workouts: [] };
      this.addUser.emit(newUser); 
      this.userName = '';
    });
  }

  onSubmit() {
    if (this.userName && this.workoutType && this.minutes > 0) {
      this.workoutService.addUserWorkout(this.userName, this.workoutType, this.minutes);
      console.log(`Added workout for ${this.userName}: ${this.workoutType} (${this.minutes} minutes)`);
      this.resetForm();
    } else {
      alert('Please fill all fields correctly.');
    }
  }

  private resetForm() {
    this.userName = '';
    this.workoutType = '';
    this.minutes = 0;
  }
}