import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  lineChart:any
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createLineChart()
    this.createLineChart2()
  }
  createLineChart() {
    const ctx:any  = document.getElementById('lineChart');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' , 'Sat','123','1231','1231312']; // Day names
    const today = new Date(); // Get today's date
    const dates:any = [];
    // Generate dates for the past 15 days
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      dates.push(date.toLocaleDateString());
    }
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: daysOfWeek, // Use day names as labels
        datasets: [
          {
            label: 'Occupancy',
            data: [10, 20, 30, 40, 50, 60, 70 , 10, 20, 30, 40, 50, 60, 70], // Sample data points, replace with your data
            borderColor: 'red',
            fill: false,
          }
        ]
      },
      options: {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Dates' // X-axis title
            },
            ticks: {
              callback: function (value: any, index: number, values: any[]) {
                return dates[index]; // Use dates array as tick labels
              }
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: 10, // Adjust the maximum value to reduce the height
            ticks: {
              stepSize: 10 // Adjust the step size according to your data
            }
          }
        }
      }
    });
  }
  createLineChart2() {
    const ctx: any = document.getElementById('lineChart2');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sat', '123', '1231', '1231312'];
    const today = new Date();
    const dates: any = [];
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      dates.push(date.toLocaleDateString());
    }
  
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: daysOfWeek,
        datasets: [
          {
            label: 'Occupancy',
            data: [10, 20, 30, 40, 50, 60, 70, 10, 20, 30, 40, 50, 60, 70],
            borderColor: 'red',
            fill: false,
          },
          {
            label: 'ADR',
            data: [5, 15, 25, 35, 45, 55, 65, 5, 15, 25, 35, 45, 55, 65],
            borderColor: 'blue',
            fill: false,
          },
          {
            label: 'Revenue',
            data: [20, 30, 40, 50, 60, 70, 80, 20, 30, 40, 50, 60, 70, 80],
            borderColor: 'green',
            fill: false,
          }
        ]
      },
      options: {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Dates'
            },
            ticks: {
              callback: function (value: any, index: number, values: any[]) {
                return dates[index];
              }
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            ticks: {
              stepSize: 10
            }
          }
        }
      }
    });
  }
  
}
