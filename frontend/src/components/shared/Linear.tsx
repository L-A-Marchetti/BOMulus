import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type LinearProps = {
  title: string;
  data: ApexAxisChartSeries;
};

export default function Linear({ title, data }: LinearProps) {
  const series = data;
  const [chartOptions] = useState<ApexOptions>({
    series,
    tooltip: {
      theme: 'dark',
      enabled: true,
      x: {
        show: true,
      },
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -26,
      },
    },
    chart: {
      height: '100%',
      width: '100%',
      type: 'area',
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: 'right',
      offsetY: 10,
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
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: '#1C64F2',
        gradientToColors: ['#1C64F2'],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
    },
    xaxis: {
      categories: ['v1', 'v2'],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        formatter: function (value) {
          return '$' + value.toFixed(2);
        },
      },
    },
    title: {
      text: title,
      align: 'left',
      style: {
        color: 'white',
        fontSize: '12px',
      },
    },
  });

  return (
    <div className="w-full h-40 flex-[1_1_0%]">
      <Chart options={chartOptions} type="area" series={series} height={166} />
    </div>
  );
}
