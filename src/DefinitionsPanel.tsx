

export function DefinitionsPanel() {
  const definitions = [
    {
      symbol: 'I(t)',
      formula: 'I(t) = ∑ᵢ mᵢ |rᵢ(t) - R_cm(t)|²',
      explanation: 'Moment of inertia: measures the total "spread" of the system around its center of mass.',
    },
    {
      symbol: 'dI/dt',
      formula: 'dI/dt',
      explanation: 'Rate of change of moment of inertia. Positive values indicate the system is expanding.',
    },
    {
      symbol: '|E|',
      formula: '|E| = |T + V|',
      explanation: 'Total energy magnitude, combining kinetic (T) and potential (V) energies.',
    },
    {
      symbol: 'Z₃(t)',
      formula: 'Z₃(t) = σ_v(t) / ⟨|v|(t)⟩',
      explanation: 'Normalized velocity dispersion: measures how uneven the speeds of the three bodies are.',
    },
    {
      symbol: 'D_min(t)',
      formula: 'D_min(t) = min_{i≠j} |rᵢ(t) - rⱼ(t)|',
      explanation: 'Minimum pairwise distance between any two bodies.',
    },
    {
      symbol: 'V_max(t)',
      formula: 'V_max(t) = maxᵢ |vᵢ(t)|',
      explanation: 'Maximum speed of any body in the system.',
    },
  ]

  return (
    <div className="definitions-panel">
      <h3>Definitions</h3>
      <div className="definitions-grid">
        {definitions.map((def, index) => (
          <div key={index} className="definition-item" title={def.explanation}>
            <strong>{def.symbol}</strong>: {def.formula}
          </div>
        ))}
      </div>
    </div>
  )
}