import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { RadialData } from './Radial';

type DonutProps = {
  title: string;
  data: RadialData[];
};

export default function Donut({ title, data }: DonutProps) {
  const series = data.map((item) => item.value);
  const labels = data.map((item) => item.label);
  const colors = data.map((item) => item.color);
  const [chartOptions] = useState<ApexOptions>({
    labels,
    colors,
    chart: {
      height: 350,
      type: 'donut',
    },
    stroke: {
      colors: ['transparent'],
      lineCap: undefined,
    },
    plotOptions: {
      pie: {
        offsetY: 18,
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: 'Inter, sans-serif',
              offsetY: 20,
              fontSize: '13px',
            },
            total: {
              showAlways: false,
              show: false,
              label: 'Unique visitors',
              fontFamily: 'Inter, sans-serif',
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => {
                    return a + b;
                  },
                  0,
                );
                return sum + ' Components';
              },
            },
            value: {
              show: true,
              fontFamily: 'Inter, sans-serif',
              offsetY: -20,
              color: 'white',
              fontSize: '13px',
              formatter: function (value) {
                return value + ' Components';
              },
            },
          },
          size: '80%',
        },
      },
    },
    grid: {
      padding: {
        top: -2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
      offsetY: 24,
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
    yaxis: {
      labels: {
        formatter: function (value) {
          return value + 'k';
        },
      },
    },
    xaxis: {
      labels: {
        formatter: function (value) {
          return value + 'k';
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
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
      <Chart options={chartOptions} series={series} type="donut" height={276} />
    </div>
  );
}
