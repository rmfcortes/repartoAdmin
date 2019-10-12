import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart-donut',
  templateUrl: './chart-donut.component.html',
  styleUrls: ['./chart-donut.component.scss'],
})
export class ChartDonutComponent implements OnInit {

  @ViewChild('doughnutCanvas', {static: false}) doughnutCanvas: ElementRef;
  @Input() labels;
  @Input() titulo;
  @Input() info;

  doughnutChart: Chart;

  constructor() { }

  ngOnInit() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.titulo,
            data: this.info,
          }
        ]
      }
    });
  }

}
