import Plot from 'react-plotly.js';
import { ScenarioData } from './types';

interface DiagnosticsPanelProps {
  scenario: ScenarioData;
  currentTimeIndex: number;
}

type MetricKey = 'Z' | 'dIdt' | 'Dmin' | 'Vmax';

export function DiagnosticsPanel({ scenario, currentTimeIndex }: DiagnosticsPanelProps) {
  const time = scenario.time;
  const z = scenario.scalars.Z;
  const dIdt = scenario.scalars.dIdt;
  const dmin = scenario.scalars.Dmin;
  const vmax = scenario.scalars.Vmax;

  const currentTime = time[currentTimeIndex];

  const calculateLead = (crossing: number | undefined): string => {
    if (scenario.ejectionTime === null || crossing === undefined || scenario.ejectionTime === 0) {
      return 'N/A';
    }
    return ((scenario.ejectionTime - crossing) / scenario.ejectionTime * 100).toFixed(1);
  };

  const leadTimes = {
    Z: calculateLead(scenario.firstCrossingTimes.Z),
    dIdt: calculateLead(scenario.firstCrossingTimes.dIdt),
    Dmin: calculateLead(scenario.firstCrossingTimes.Dmin),
    Vmax: calculateLead(scenario.firstCrossingTimes.Vmax),
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
  ];

  const crossingConfigs: Array<{
    key: MetricKey;
    name: string;
    color: string;
    symbol: string;
    threshold: number;
    yaxis: 'y' | 'y2' | 'y3' | 'y4';
  }> = [
    { key: 'Z', name: 'Z crossing', color: 'red', symbol: 'star', threshold: scenario.thresholds.Z, yaxis: 'y' as const },
    { key: 'dIdt', name: 'dI/dt crossing', color: 'blue', symbol: 'diamond', threshold: scenario.thresholds.dIdt, yaxis: 'y2' as const },
    { key: 'Dmin', name: 'D_min crossing', color: 'green', symbol: 'triangle-up', threshold: scenario.thresholds.Dmin, yaxis: 'y3' as const },
    { key: 'Vmax', name: 'V_max crossing', color: 'orange', symbol: 'square', threshold: scenario.thresholds.Vmax, yaxis: 'y4' as const },
  ];

  crossingConfigs.forEach((config) => {
    const crossingTime = scenario.firstCrossingTimes[config.key];
    if (crossingTime === undefined) {
      return;
    }

    data.push({
      x: [crossingTime],
      y: [config.threshold],
      type: 'scatter',
      mode: 'markers',
      name: config.name,
      marker: { color: config.color, symbol: config.symbol, size: 10 },
      hovertemplate: `${config.name} at t=${crossingTime.toFixed(2)}<br>Threshold: ${config.threshold.toFixed(2)}<br>Lead time: ${leadTimes[config.key]}%<extra></extra>`,
      xaxis: 'x',
      yaxis: config.yaxis,
    });
  });

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
  ];

  if (scenario.ejectionTime !== null) {
    shapes.push({
      type: 'line',
      x0: scenario.ejectionTime,
      x1: scenario.ejectionTime,
      y0: 0,
      y1: 1,
      xref: 'x',
      yref: 'paper',
      line: { color: 'black', width: 3 },
    });
  }

  const layout: Partial<Plotly.Layout> = {
    title: { text: 'Diagnostics' },
    xaxis: { title: { text: 'Time' }, domain: [0, 1] },
    yaxis: { title: { text: 'Z' }, domain: [0.75, 1] },
    yaxis2: { title: { text: 'dI/dt' }, domain: [0.5, 0.75] },
    yaxis3: { title: { text: 'D_min' }, domain: [0.25, 0.5] },
    yaxis4: { title: { text: 'V_max' }, domain: [0, 0.25] },
    shapes,
    annotations: scenario.ejectionTime !== null ? [
      {
        x: scenario.ejectionTime,
        y: 0.95,
        xref: 'x',
        yref: 'paper',
        text: 'Ejection',
        showarrow: false,
        font: { color: 'black', size: 12 },
      },
    ] : [],
    height: 600,
    grid: {
      rows: 4,
      columns: 1,
      pattern: 'independent',
    },
  };

  return <Plot data={data} layout={layout} />;
}
