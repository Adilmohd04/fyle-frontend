import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Workout {
  type: string;
  minutes: number;
}

export interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private userData: User[] = [
    { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
    { id: 2, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }, { type: 'Running', minutes: 20 }] },
    { id: 3, name: 'Mike Johnson', workouts: [{ type: 'Yoga', minutes: 50 }, { type: 'Cycling', minutes: 40 }] }
  ];

  private userDataSubject = new BehaviorSubject<User[]>(this.userData);
  userData$ = this.userDataSubject.asObservable();

  addUserWorkout(userName: string, workoutType: string, minutes: number): void {
    let user = this.userData.find(u => u.name === userName);

    if (user) {
      let existingWorkout = user.workouts.find(w => w.type === workoutType);

      if (existingWorkout) {
        existingWorkout.minutes += minutes; 
      } else {
        user.workouts.push({ type: workoutType, minutes }); 
      }
    } else {
      user = { id: this.userData.length + 1, name: userName, workouts: [{ type: workoutType, minutes }] };
      this.userData.push(user);
    }

    this.userDataSubject.next([...this.userData]); 
  }

  getUsers(): Observable<User[]> {
    return this.userData$; 
  }

  deleteUser(userId: number) {
    this.userData = this.userData.filter(user => user.id !== userId);
    this.userDataSubject.next([...this.userData]);
  }
}
