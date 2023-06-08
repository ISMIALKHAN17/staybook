import { Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  pieChart:any
  filter:any = 'week'
  dataChart:any

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createPieChart()
    const ctx: any = document.getElementById('lineChart');
this.dataChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Rooms revenue',
      data: [10, 20, 30, 40, 50, 60, 70],
      borderColor: '#27c627',
      fill: false,
      tension: 0.4  // Adjust the tension value for smooth lines (0.0 to 1.0)
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});
this.updateChartData()
  }

  createPieChart() {
    const ctx: any = document.getElementById('pieChart');
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Available', 'Occupied'],
        datasets: [
          {
            data: [70, 30], // Replace with your actual data
            backgroundColor: ['#26547E', '#FF7A00'] // Set colors for the slices
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
setFilter(filter: string) {
  this.filter = filter;
  this.updateChartData();
}

updateChartData() {
  let data: number[] = [];
  let labels: string[] = [];
  
  if (this.filter === 'week') {
    data = [15, 25, 35, 45, 55, 65, 75];
    labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  } else if (this.filter === 'month') {
    data = [100, 110, 120, 130, 140, 150, 160, 140, 133, 144 ,  130, 140, 150, 160, 140, 133, 144,100, 110, 120, 130, 140, 150, 160, 140, 133, 144 ,  130, 140, 150, 160, 140, 133, 144];
    labels = this.generateMonthLabels();
  } else if (this.filter === 'year') {
    data = [100, 110, 120, 130, 140, 150, 160, 140, 133, 144 , 140, 150, 160, 140, 133, 144];
    labels = this.generateYearLabels();
  }

  this.dataChart.data.labels = labels;
  this.dataChart.data.datasets.forEach((dataset: any) => {
    dataset.data = data;
  });
  this.dataChart.update();
}

generateMonthLabels(): string[] {
  const labels: string[] = [];
  const currentDate = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate().toString();
    labels.unshift(`${day}-${month}`);
  }
  return labels;
}

generateYearLabels(): string[] {
  const labels: string[] = [];
  const currentDate = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString();
    labels.unshift(`${month}-${year}`);
  }
  return labels;
}
}
