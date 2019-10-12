import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart-donut',
  templateUrl: './chart-donut.component.html',
  styleUrls: ['./chart-donut.component.scss'],
})
export class ChartDonutComponent implements OnInit {

  @Input() labels;
  @Input() titulo;
  @Input() info;
  @ViewChild('doughnutCanvas', {static: false}) doughnutCanvas: ElementRef;

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
