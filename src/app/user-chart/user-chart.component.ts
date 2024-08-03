import { Component, Input, OnChanges, SimpleChanges, OnInit, Inject, PLATFORM_ID, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { User } from '../workout.service';
import { isPlatformBrowser } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-user-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-chart.component.html',
  styleUrls: ['./user-chart.component.scss']
})
export class UserChartComponent implements OnChanges, OnInit {
  @Input() users: User[] = [];
  @Input() selectedUser: User | null = null;
  @Output() deleteUser = new EventEmitter<User>();

  private chart: Chart | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.createChart();
      this.updateChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser) {
      if (changes['selectedUser'] || changes['users']) {
        if (this.users.length === 0) {
          this.selectedUser = null; // Ensure selectedUser is null if no user
          this.clearChart();
        } else if (!this.selectedUser || !this.users.some(user => user.id === this.selectedUser?.id)) {
      
          this.selectedUser = this.getDefaultUser();
        }
        this.updateChart();
      }
    }
  }

  onDeleteUser(): void {
    if (this.selectedUser) {
      const deletedUser = this.selectedUser;
      this.deleteUser.emit(deletedUser);
      
      
      this.users = this.users.filter(user => user.id !== deletedUser.id);

      
      if (this.users.length === 0) {
        this.selectedUser = null;
        this.clearChart();
      } else {
        this.selectedUser = this.getDefaultUser();
        this.updateChart();
      }
    }
  }

  private createChart(): void {
    if (!this.isBrowser) return;

    const canvas = document.getElementById('userChart') as HTMLCanvasElement | null;
    const context = canvas?.getContext('2d');

    if (context) {
      const config: ChartConfiguration = {
        type: 'bar' as ChartType,
        data: {
          labels: [],
          datasets: [{
            label: 'Minutes',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };

      this.chart = new Chart(context, config);
    }
  }

  private updateChart(): void {
    if (this.chart) {
      if (this.selectedUser) {
        const workoutTypes = this.selectedUser.workouts.map(workout => workout.type);
        const workoutMinutes = this.selectedUser.workouts.map(workout => workout.minutes);

        this.chart.data.labels = workoutTypes;
        this.chart.data.datasets[0].data = workoutMinutes;
      } else {
        this.clearChart();
      }
      this.chart.update();
    }
  }

  private clearChart(): void {
    if (this.chart) {
      this.chart.data.labels = [];
      this.chart.data.datasets[0].data = [];
      this.chart.update();
    }
  }

  private getDefaultUser(): User | null {
    return this.users.length > 0 ? this.users[0] : null;
  }

  onSelectUser(user: User): void {
    this.selectedUser = user;
    this.updateChart();
  }
}
