import React, { useEffect, useState } from 'react';
import yaml from 'js-yaml';

type Phase = {
  type: string;
  temp?: string;
  time: string;
  done?: string;
};

type SmokeCut = {
  cut: string;
  total_weight?: string;
  total_time?: string;
  wood?: string;
  phases: Phase[];
};

export default function RenderSmoke({ cutName }: { cutName: string }) {
  const [cut, setCut] = useState<SmokeCut | null>(null);

  useEffect(() => {
    fetch('/data/smoke_pork.yaml')
      .then((res) => res.text())
      .then((text) => {
        const data: any = yaml.load(text);
        const match = data.pork.find((c: SmokeCut) => c.cut === cutName);
        setCut(match || null);
      });
  }, [cutName]);

  if (!cut) return <p>Loading smoking specs...</p>;

  return (
    <div className="recipe">
      <div className="recipe-meta">
        <h2>{cut.cut}</h2>
        {cut.total_weight && <p>Weight: {cut.total_weight}</p>}
        {cut.total_time && <p>Total Estimated Time: {cut.total_time}</p>}
        {cut.wood && <p>Wood: {cut.wood}</p>}
      </div>

      <hr />

      {cut.phases.map((phase, idx) => (
        <div className="phase" key={idx}>
          <strong>{phase.type}</strong><br />
          {phase.temp && <>Temp: {phase.temp}<br /></>}
          Time: {phase.time}<br />
          {phase.done && <>Done: {phase.done}</>}
        </div>
      ))}
    </div>
  );
}
