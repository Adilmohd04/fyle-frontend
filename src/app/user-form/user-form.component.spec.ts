import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { UserFormComponent } from './user-form.component'; 
import { WorkoutService } from '../workout.service';
import { of } from 'rxjs';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', ['getUsers', 'addUserWorkout']);
    workoutServiceSpy.getUsers.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      declarations: [], 
      providers: [
        { provide: WorkoutService, useValue: workoutServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with userName, workoutType, and minutes inputs', () => {
    const userNameInput = fixture.debugElement.query(By.css('#userName'));
    const workoutTypeSelect = fixture.debugElement.query(By.css('#workoutType'));
    const minutesInput = fixture.debugElement.query(By.css('#minutes'));

    expect(userNameInput).toBeTruthy();
    expect(workoutTypeSelect).toBeTruthy();
    expect(minutesInput).toBeTruthy();
  });

    
  it('should reset form after successful submission', () => {
    component.userName = 'John Doe';
    component.workoutType = 'Running';
    component.minutes = 30;

    component.onSubmit();

    expect(component.userName).toBe('');
    expect(component.workoutType).toBe('');
    expect(component.minutes).toBe(0);
  });
  it('should not emit addUser event on invalid form submission', () => {
    spyOn(component.addUser, 'emit'); 
  
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    submitButton.click();
  
    expect(component.addUser.emit).not.toHaveBeenCalled(); 
  })
  
  

  it('should reset form after successful submission', () => {
    component.userName = 'John Doe';
    component.workoutType = 'Running';
    component.minutes = 30;

    component.onSubmit();

    expect(component.userName).toBe('');
    expect(component.workoutType).toBe('');
    expect(component.minutes).toBe(0);
  });
  it('should submit the form if valid', () => {
    spyOn(component, 'onSubmit').and.callThrough();
  
    component.userName = 'John Doe';
    component.workoutType = 'Running';
    component.minutes = 30;
  
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    submitButton.click();
  
    fixture.detectChanges();
  
    expect(component.onSubmit).toHaveBeenCalled();
  });
 
  
});
