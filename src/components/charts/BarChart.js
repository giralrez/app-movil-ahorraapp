import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function ejeCorto(valor) {
  return Math.abs(valor) >= 1000 ? `${Math.round(valor / 1000)}k` : valor;
}

export default function BarChart({ labels = [], series = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: series.map((s) => ({
          label: s.etiqueta,
          data: s.datos,
          backgroundColor: s.color,
          borderRadius: 4
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: series.length > 1, position: 'bottom' }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: ejeCorto }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [labels, series]);

  return <canvas ref={canvasRef}></canvas>;
}
