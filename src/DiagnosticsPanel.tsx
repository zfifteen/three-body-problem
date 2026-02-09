import { useEffect, useState } from 'react';
import { ScenarioData } from './types';

interface DiagnosticsPanelProps {
  scenario: ScenarioData;
  currentTimeIndex: number;
}

export function DiagnosticsPanel({ scenario, currentTimeIndex }: DiagnosticsPanelProps) {
  const [Plot, setPlot] = useState<any>(null);

  useEffect(() => {
    import('react-plotly.js').then(module => {
      setPlot(() => module.default);
    });
  }, []);

  if (!Plot) {
    return <div>Loading plot...</div>;
  }
  const time = scenario.time;
  const z = scenario.scalars.Z;
  const dIdt = scenario.scalars.dIdt;
  const dmin = scenario.scalars.Dmin;
  const vmax = scenario.scalars.Vmax;

  const currentTime = time[currentTimeIndex];

  const leadTimes = {
    Z: ((scenario.ejectionTime - scenario.firstCrossingTimes.Z) / scenario.ejectionTime * 100).toFixed(1),
    dIdt: ((scenario.ejectionTime - scenario.firstCrossingTimes.dIdt) / scenario.ejectionTime * 100).toFixed(1),
    Dmin: ((scenario.ejectionTime - scenario.firstCrossingTimes.Dmin) / scenario.ejectionTime * 100).toFixed(1),
    Vmax: ((scenario.ejectionTime - scenario.firstCrossingTimes.Vmax) / scenario.ejectionTime * 100).toFixed(1),
  };

  const data: Plotly.Data[] = [
    {
      x: time,
      y: z,
      type: 'scatter',
      mode: 'lines',
      name: 'Z',
      line: { color: 'red' },
      xaxis: 'x',
      yaxis: 'y',
    },
    {
      x: time,
      y: dIdt,
      type: 'scatter',
      mode: 'lines',
      name: 'dI/dt',
      line: { color: 'blue' },
      xaxis: 'x',
      yaxis: 'y2',
    },
    {
      x: time,
      y: dmin,
      type: 'scatter',
      mode: 'lines',
      name: 'D_min',
      line: { color: 'green' },
      xaxis: 'x',
      yaxis: 'y3',
    },
    {
      x: time,
      y: vmax,
      type: 'scatter',
      mode: 'lines',
      name: 'V_max',
      line: { color: 'orange' },
      xaxis: 'x',
      yaxis: 'y4',
    },
    // First crossing markers
    {
      x: [scenario.firstCrossingTimes.Z],
      y: [scenario.thresholds.Z],
      type: 'scatter',
      mode: 'markers',
      name: 'Z crossing',
      marker: { color: 'red', symbol: 'star', size: 10 },
      hovertemplate: `Z first crosses at t=${scenario.firstCrossingTimes.Z.toFixed(2)}<br>Threshold: ${scenario.thresholds.Z.toFixed(2)}<br>Lead time: ${leadTimes.Z}%<extra></extra>`,
      xaxis: 'x',
      yaxis: 'y',
    },
    {
      x: [scenario.firstCrossingTimes.dIdt],
      y: [scenario.thresholds.dIdt],
      type: 'scatter',
      mode: 'markers',
      name: 'dI/dt crossing',
      marker: { color: 'blue', symbol: 'diamond', size: 10 },
      hovertemplate: `dI/dt first crosses at t=${scenario.firstCrossingTimes.dIdt.toFixed(2)}<br>Threshold: ${scenario.thresholds.dIdt.toFixed(2)}<br>Lead time: ${leadTimes.dIdt}%<extra></extra>`,
      xaxis: 'x',
      yaxis: 'y2',
    },
    {
      x: [scenario.firstCrossingTimes.Dmin],
      y: [scenario.thresholds.Dmin],
      type: 'scatter',
      mode: 'markers',
      name: 'D_min crossing',
      marker: { color: 'green', symbol: 'triangle-up', size: 10 },
      hovertemplate: `D_min first crosses at t=${scenario.firstCrossingTimes.Dmin.toFixed(2)}<br>Threshold: ${scenario.thresholds.Dmin.toFixed(2)}<br>Lead time: ${leadTimes.Dmin}%<extra></extra>`,
      xaxis: 'x',
      yaxis: 'y3',
    },
    {
      x: [scenario.firstCrossingTimes.Vmax],
      y: [scenario.thresholds.Vmax],
      type: 'scatter',
      mode: 'markers',
      name: 'V_max crossing',
      marker: { color: 'orange', symbol: 'square', size: 10 },
      hovertemplate: `V_max first crosses at t=${scenario.firstCrossingTimes.Vmax.toFixed(2)}<br>Threshold: ${scenario.thresholds.Vmax.toFixed(2)}<br>Lead time: ${leadTimes.Vmax}%<extra></extra>`,
      xaxis: 'x',
      yaxis: 'y4',
    },
  ];

  const shapes: Partial<Plotly.Shape>[] = [
    // Vertical cursor
    {
      type: 'line',
      x0: currentTime,
      x1: currentTime,
      y0: 0,
      y1: 1,
      xref: 'x',
      yref: 'paper',
      line: { color: 'black', width: 2 },
    },
    // Threshold lines
    {
      type: 'line',
      x0: time[0],
      x1: time[time.length - 1],
      y0: scenario.thresholds.Z,
      y1: scenario.thresholds.Z,
      line: { color: 'red', dash: 'dash' },
      xref: 'x',
      yref: 'y',
    },
    {
      type: 'line',
      x0: time[0],
      x1: time[time.length - 1],
      y0: scenario.thresholds.dIdt,
      y1: scenario.thresholds.dIdt,
      line: { color: 'blue', dash: 'dash' },
      xref: 'x',
      yref: 'y2',
    },
    {
      type: 'line',
      x0: time[0],
      x1: time[time.length - 1],
      y0: scenario.thresholds.Dmin,
      y1: scenario.thresholds.Dmin,
      line: { color: 'green', dash: 'dash' },
      xref: 'x',
      yref: 'y3',
    },
    {
      type: 'line',
      x0: time[0],
      x1: time[time.length - 1],
      y0: scenario.thresholds.Vmax,
      y1: scenario.thresholds.Vmax,
      line: { color: 'orange', dash: 'dash' },
      xref: 'x',
      yref: 'y4',
    },
    // Ejection line
    {
      type: 'line',
      x0: scenario.ejectionTime,
      x1: scenario.ejectionTime,
      y0: 0,
      y1: 1,
      xref: 'x',
      yref: 'paper',
      line: { color: 'black', width: 3 },
    },
  ];

  const layout: Partial<Plotly.Layout> = {
    title: { text: 'Diagnostics' },
    xaxis: { title: { text: 'Time' }, domain: [0, 1] },
    yaxis: { title: { text: 'Z' }, domain: [0.75, 1] },
    yaxis2: { title: { text: 'dI/dt' }, domain: [0.5, 0.75] },
    yaxis3: { title: { text: 'D_min' }, domain: [0.25, 0.5] },
    yaxis4: { title: { text: 'V_max' }, domain: [0, 0.25] },
    shapes,
    annotations: [
      {
        x: scenario.ejectionTime,
        y: 0.95,
        xref: 'x',
        yref: 'paper',
        text: 'Ejection',
        showarrow: false,
        font: { color: 'black', size: 12 },
      },
    ],
    height: 600,
    grid: {
      rows: 4,
      columns: 1,
      pattern: 'independent',
    },
  };

  return <Plot data={data} layout={layout} />;
}