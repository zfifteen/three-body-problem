import Plot from 'react-plotly.js';
import { ScenarioData } from './types';

interface DiagnosticsPanelProps {
  scenario: ScenarioData;
  currentTimeIndex: number;
}

export function DiagnosticsPanel({ scenario, currentTimeIndex }: DiagnosticsPanelProps) {
  const time = scenario.time;
  const z = scenario.scalars.Z;
  const dIdt = scenario.scalars.dIdt;
  const dmin = scenario.scalars.Dmin;
  const vmax = scenario.scalars.Vmax;

  const currentTime = time[currentTimeIndex];

  const data: Plotly.Data[] = [
    {
      x: time,
      y: z,
      type: 'scatter',
      mode: 'lines',
      name: 'Z',
      line: { color: 'red' },
    },
    {
      x: time,
      y: dIdt,
      type: 'scatter',
      mode: 'lines',
      name: 'dI/dt',
      line: { color: 'blue' },
    },
    {
      x: time,
      y: dmin,
      type: 'scatter',
      mode: 'lines',
      name: 'D_min',
      line: { color: 'green' },
    },
    {
      x: time,
      y: vmax,
      type: 'scatter',
      mode: 'lines',
      name: 'V_max',
      line: { color: 'orange' },
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
    },
    {
      type: 'line',
      x0: time[0],
      x1: time[time.length - 1],
      y0: scenario.thresholds.dIdt,
      y1: scenario.thresholds.dIdt,
      line: { color: 'blue', dash: 'dash' },
    },
    {
      type: 'line',
      x0: time[0],
      x1: time[time.length - 1],
      y0: scenario.thresholds.Dmin,
      y1: scenario.thresholds.Dmin,
      line: { color: 'green', dash: 'dash' },
    },
    {
      type: 'line',
      x0: time[0],
      x1: time[time.length - 1],
      y0: scenario.thresholds.Vmax,
      y1: scenario.thresholds.Vmax,
      line: { color: 'orange', dash: 'dash' },
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
    xaxis: { title: { text: 'Time' } },
    yaxis: { title: { text: 'Value' } },
    shapes,
    height: 400,
  };

  return <Plot data={data} layout={layout} />;
}