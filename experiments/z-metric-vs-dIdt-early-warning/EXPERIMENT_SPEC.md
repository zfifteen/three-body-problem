# Three-Body Z-Metric Experiment Specification

## Hypothesis Under Test

**H1: Early Warning Superiority**

The Z-metric (Z = I × dI/dt / |E|) provides statistically significant early warning of ejection events compared to baseline metrics, with lead time >10% of total ejection timescale.

## Experimental Design

### Test Cases (30 initial conditions)

1. **Pythagorean Configuration** (Classic)
   - Masses: 3, 4, 5
   - Positions: Right triangle at rest
   - Known to eject around t≈60

2. **Random Thermal** (Equal mass)
   - Masses: 1, 1, 1  
   - Positions: Random on sphere r=2
   - Velocities: Gaussian, zero COM motion

3. **Hierarchical** (Binary + perturber)
   - Masses: 1, 1, 10
   - Two bodies in close orbit, third distant
   - Tests resonance-driven ejection

4. **Random Bound** (Generic)
   - Random masses (0.5-3.0)
   - Random positions and velocities
   - Constrained to E < 0

### Monitored Metrics

| Metric | Formula | Physical Meaning | Detection Criterion |
|--------|---------|------------------|---------------------|
| **Z** | I(dI/dt/\|E\|) | Scaled expansion momentum | Z > P90(pre-ejection) |
| **V_max** | max(\|v_i - v_j\|) | Max relative velocity | V > P90(pre-ejection) |
| **D_min** | min(\|r_i - r_j\|) | Min pairwise distance | D < P10(pre-ejection) |
| **dI/dt** | Simple expansion rate | Unscaled version of Z | dI/dt > P90(pre-ejection) |

*P90 = 90th percentile, P10 = 10th percentile computed from pre-ejection phase*

### True Ejection Definition

System ejected when:
1. Max pairwise distance > 5× initial max distance
2. dI/dt > 0 (expanding)
3. Subsequent 5 timesteps confirm monotonic growth

### Success Criteria

**Tier 1 (Strong Signal):**
- Mean Z lead time > 10% of t_eject
- Z wins "first detection" in >50% of cases
- p-value < 0.05 in paired t-test vs dI/dt
- Cohen's d > 0.5 (medium effect size)

**Tier 2 (Weak Signal):**
- Mean Z lead time > 5% of t_eject
- Z competitive with baselines (wins 30-50%)
- p-value < 0.10 (trend)

**Tier 3 (Null Result):**
- Z statistically indistinguishable from dI/dt
- Division by |E| adds no predictive value
- Conclusion: Elegant redescription, not new physics

## Implementation Details

### Numerical Integration
- Method: DOP853 (8th-order Runge-Kutta)
- Tolerance: rtol=1e-9, atol=1e-12
- Timestep: Δt=0.1 (adaptive)
- Stop condition: max_distance > 100 or 10,000 steps

### Energy Conservation Check
E should be conserved to <0.01% over integration
- If violated: flag as numerical instability, exclude from analysis

### Threshold Calibration
For each trajectory:
1. Identify true t_eject
2. Compute percentiles from t ∈ [0, t_eject)
3. Find first crossing time for each metric
4. Lead time = t_eject - t_cross

### Statistical Tests

**Paired t-test:** Z vs dI/dt lead times
- Null: μ(Z) = μ(dI/dt)
- Alternative: μ(Z) > μ(dI/dt) (one-tailed)

**Effect Size:** Cohen's d = (μ_Z - μ_dI) / σ_pooled
- Small: d ≈ 0.2
- Medium: d ≈ 0.5  
- Large: d ≈ 0.8

## Output Interpretation

### Visualization 1: Lead Time Distributions
Box plots showing spread of lead times for each metric
- **Key question:** Is Z's median significantly higher?
- **Success indicator:** Z box visibly above others, minimal overlap

### Visualization 2: Normalized Lead Times  
Lead time as % of total ejection time
- **Key question:** Does Z exceed 10% threshold?
- **Success indicator:** Z median above red dashed line

### Visualization 3: Winner Matrix
Bar chart of "first detection" wins
- **Key question:** Which metric triggers first most often?
- **Success indicator:** Z bar tallest

### Visualization 4: Statistical Summary
Text summary with hypothesis test results
- **Key number:** Cohen's d and p-value
- **Interpretation guide:**
  - d > 0.5, p < 0.05 → Strong signal (publish)
  - d > 0.3, p < 0.10 → Weak signal (investigate further)
  - d < 0.3, p > 0.10 → Null result (move to next hypothesis)

## Expected Runtime

- Single IC: ~1-3 seconds (depending on ejection time)
- 30 ICs: ~1-2 minutes total
- Analysis + visualization: <10 seconds
- **Total: 2-3 minutes**

## Failure Modes

1. **Too few ejections:** <5 events → insufficient statistical power
   - Mitigation: Increase n_trials or seed more unstable ICs

2. **Numerical instability:** Energy drift >1%
   - Mitigation: Tighten tolerances, flag and exclude

3. **Threshold calibration fails:** All metrics trigger simultaneously
   - Interpretation: Ejection too sudden for early warning (chaotic regime)

4. **High variance:** Lead times span 0-100% range
   - Interpretation: Z performance is IC-dependent, not universal

## Validation Checks

Before interpreting results, verify:

✓ Energy conserved to <0.01% for included trajectories  
✓ At least 5 clear ejection events detected  
✓ Threshold percentiles computed from sufficient data (>20 points)  
✓ Lead times are positive (threshold crosses before ejection)  
✓ Winner matrix sums to n_ejected

## Next Steps Based on Results

### If Z wins decisively (Tier 1):
→ Proceed to H2: Universal Threshold Test
→ Test scaling law: log(Z) ~ α·log(τ)
→ Expand to 100+ ICs across parameter space

### If Z shows weak signal (Tier 2):
→ Investigate: Which IC types does Z excel at?
→ Hypothesis: Z better for hierarchical vs thermal?
→ Refined hypothesis focusing on subset

### If Z fails (Tier 3):
→ Document null result rigorously
→ Test alternative forms: I²(dI/dt)/E, I(dI/dt)²/E, etc.
→ Consider: Is the framework fundamentally limited for this domain?

## Critical Insight

This experiment tests **predictive advantage**, not mathematical correctness. 

Z will always grow during ejection—that's trivial. The question is whether the specific functional form I(dI/dt/|E|) provides:

1. Earlier warning than simpler metrics
2. Cleaner threshold behavior  
3. Richer information content

If it doesn't beat baselines, the framework isn't "wrong"—it's just not useful for prediction.
