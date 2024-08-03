import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkoutService, User } from '../workout.service';
import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockWorkoutService: WorkoutService;

  beforeEach(async () => {
    mockWorkoutService = {
      userData$: new BehaviorSubject<User[]>([]) 
    } as unknown as WorkoutService; 

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      providers: [{ provide: WorkoutService, useValue: mockWorkoutService }],
     
      declarations: [], 
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render users in a table', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
      { id: 2, name: 'Jane Doe', workouts: [{ type: 'Yoga', minutes: 45 }] }
    ];
    (mockWorkoutService.userData$ as BehaviorSubject<User[]>).next(mockUsers); 

    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(mockUsers.length);
  });

  it('should filter users by name', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
      { id: 2, name: 'Jane Doe', workouts: [{ type: 'Yoga', minutes: 45 }] }
    ];
    (mockWorkoutService.userData$ as BehaviorSubject<User[]>).next(mockUsers); 

    fixture.detectChanges();

    component.searchName = 'Jane';
    component.onSearch();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
    expect(rows[0].nativeElement.textContent).toContain('Jane Doe');
  });

});
