import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export type RadialData = {
  value: number;
  label: string;
  color: string;
};

type RadialProps = {
  title: string;
  data: RadialData[];
};

export default function Radial({ title, data }: RadialProps) {
  const series = data.map((item) => item.value);
  const labels = data.map((item) => item.label);
  const colors = data.map((item) => item.color);
  const [chartOptions] = useState<ApexOptions>({
    labels,
    colors,
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
      text: title,
      align: 'left',
      style: {
        color: 'white',
      },
    },
  });

  return (
    <div className="w-66 h-75">
      <Chart
        options={chartOptions}
        series={series}
        type="radialBar"
        height={350}
      />
    </div>
  );
}
