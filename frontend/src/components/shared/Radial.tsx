import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export default function Radial() {
  const [chartOptions] = useState<ApexOptions>({
    colors: ['#1C64F2', '#16BDCA', '#FDBA8C'],
    chart: {
      type: 'radialBar',
      height: 350,
    },
    plotOptions: {
      radialBar: {
        track: {
          background: '#E5E7EB',
        },
        dataLabels: {
          show: true,
          name: {
            fontSize: '13px',
          },
          value: {
            offsetY: 3,
            show: true,
            color: 'white',
          },
        },
        hollow: {
          margin: 0,
          size: '42%',
        },
      },
    },
    labels: ['Done', 'In progress', 'To do'],
    legend: {
      show: true,
      position: 'bottom',
      offsetY: -50,
      labels: {
        colors: 'white',
      },
      itemMargin: {
        horizontal: 10,
      },
      markers: {
        size: 5,
        offsetX: -5,
      },
    },
    tooltip: {
      enabled: false,
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value}%`,
      },
    },
    title: {
      text: 'BOM Coverage',
      align: 'center',
      style: {
        color: 'white',
      },
    },
  });

  const [series] = useState<number[]>([90, 85, 70]);

  return (
    <div className="w-65 h-75">
      <Chart
        options={chartOptions}
        series={series}
        type="radialBar"
        height={350}
      />
    </div>
  );
}
