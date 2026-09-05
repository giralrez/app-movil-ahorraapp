import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function DoughnutChart({ valor, color, label }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: [label],
        datasets: [
          {
            data: [valor],
            backgroundColor: [color]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%'
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [valor, color, label]);

  return <canvas ref={canvasRef}></canvas>;
}