# Z-Metric vs dI/dt Early-Warning Experiment

This folder contains an earlier three-body experiment that tested whether a **Z-style normalized expansion metric** provides better early warning of ejection events than the **raw moment-of-inertia expansion rate** \(dI/dt\).

The short answer:  
dI/dt performed **better** than the specific Z-form tested here.  
These files are kept as a documented negative result and as a reference point for future work.

---

## Files

### 1. `EXPERIMENT_SPEC.md`

Design and protocol for this experiment, including:

- Initial condition classes and sampling strategy
- Integration details (solver, tolerances, time span)
- Definitions of all diagnostics:
    - dI/dt (moment-of-inertia growth rate)
    - “Z-metric” form used in this run
    - Geometric baselines: \(D_{\min}\), \(V_{\max}\)
- Thresholding and lead-time definitions
- Statistical tests used (paired comparisons, effect sizes)

Use this as the authoritative description of **how** these runs were generated and analyzed.

---

### 2. `experiment_results.json`

Machine-readable output from the experiment, including:

- Per-trial lead times for each metric
- Winner-matrix counts (which metric triggered first)
- Summary statistics used to produce the plots and markdown report

This is the primary artifact to reuse if you want to:

- Re-visualize results with new plotting code
- Feed the data into ML or meta-analysis
- Compare against future diagnostics on the same ICs

---

### 3. `RESULTS_SUMMARY.md`

Human-readable report of the findings.

Key points:

- The tested Z-form **did provide early warning**, but
- **dI/dt achieved longer mean lead times** and a large negative Cohen’s d (Z underperformed),
- Geometric baselines \(D_{\min}\) and \(V_{\max}\) triggered very late, near ejection,
- The hypothesis that “this Z-form improves over dI/dt” was **falsified** with strong statistical support.

This document is essentially a draft negative-result paper section: it is valuable as a record of what *didn’t* work and why.

---

### 4. `early_warning_analysis.jpg`

Composite figure summarizing the experiment:

- Boxplots of raw lead times
- Boxplots of normalized lead times (as % of ejection time)
- Winner-matrix bar chart (first-detection counts)
- Text panel with key statistics and interpretation

Useful for:

- Talks and slide decks
- Visual comparison against future experiments using refined diagnostics
- Quickly recalling “what the data looked like” without re-running code

---

## How this experiment fits into the larger project

- Confirms that **moment-of-inertia based diagnostics are genuinely useful** for early warning.
- Shows that **the particular Z-form tested here (normalized by |E|) *reduced* predictive power** relative to dI/dt.
- Establishes dI/dt as a strong baseline to beat in subsequent designs (including any new Z₃-style metrics).

Keep this folder as a **historical baseline and methodological reference** when:

- Designing new diagnostics or normalizations,
- Writing about negative results and hypothesis testing,
- Building demos or apps that compare new methods to dI/dt and geometric baselines.

