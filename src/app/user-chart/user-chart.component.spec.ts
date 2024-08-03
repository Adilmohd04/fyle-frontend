import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserChartComponent } from './user-chart.component';
import { User } from '../workout.service'; 
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('UserChartComponent', () => {
  let component: UserChartComponent;
  let fixture: ComponentFixture<UserChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChartComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have users initialized', () => {
    expect(component.users).toBeDefined();
  });

 
});
