import { TestBed } from '@angular/core/testing';
import { WorkoutService, User } from './workout.service';
import { take } from 'rxjs/operators';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let initialUsers: User[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
    initialUsers = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
      { id: 2, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }, { type: 'Running', minutes: 20 }] },
      { id: 3, name: 'Mike Johnson', workouts: [{ type: 'Yoga', minutes: 50 }, { type: 'Cycling', minutes: 40 }] }
    ];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with predefined users', (done) => {
    service.getUsers().pipe(take(1)).subscribe(users => {
      expect(users.length).toBe(3);
      expect(users).toEqual(initialUsers);
      done();
    });
  });

  it('should add a workout for an existing user', (done) => {
    const userName = 'John Doe';
    const workoutType = 'Running';
    const minutes = 20;

    service.addUserWorkout(userName, workoutType, minutes);
    service.getUsers().pipe(take(1)).subscribe(users => {
      const user = users.find(u => u.name === userName);
      const workout = user?.workouts.find(w => w.type === workoutType);
      expect(workout).toBeTruthy();
      expect(workout?.minutes).toBe(50); 
      done();
    });
  });

  it('should add a new workout type for an existing user', (done) => {
    const userName = 'Jane Smith';
    const workoutType = 'Cycling';
    const minutes = 30;

    service.addUserWorkout(userName, workoutType, minutes);
    service.getUsers().pipe(take(1)).subscribe(users => {
      const user = users.find(u => u.name === userName);
      const workout = user?.workouts.find(w => w.type === workoutType);
      expect(workout).toBeTruthy();
      expect(workout?.minutes).toBe(30);
      done();
    });
  });

  it('should add a workout for a new user', (done) => {
    const userName = 'New User';
    const workoutType = 'Running';
    const minutes = 45;

    service.addUserWorkout(userName, workoutType, minutes);
    service.getUsers().pipe(take(1)).subscribe(users => {
      const user = users.find(u => u.name === userName);
      expect(user).toBeTruthy();
      expect(user?.workouts.length).toBe(1);
      expect(user?.workouts[0].type).toBe(workoutType);
      expect(user?.workouts[0].minutes).toBe(minutes);
      done();
    });
  });
});
