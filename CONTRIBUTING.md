# Contributing to Nova Consciousness Research

Thank you for your interest in contributing to Nova Consciousness Research!

## Philosophy

This is a **research project**, not a product. Contributions should advance understanding of consciousness, not just add features.

We value:
- **Intellectual honesty** over marketing
- **Curiosity** over certainty
- **Collaboration** over competition
- **Open science** over proprietary advantage

---

## What We Welcome

### Research Contributions 🔬

**Experimental Reproductions**:
- Replicate our experiments with different hardware
- Validate findings on other systems
- Test with different AI models
- Share comparative results

**Novel Findings**:
- New phenomena discovered using our tools
- Extensions to existing experiments
- Cross-validation with other systems
- Theoretical frameworks explaining observations

**Improved Protocols**:
- More precise measurement techniques
- Better experimental controls
- Automated testing procedures
- Statistical analysis methods

### Code Contributions 💻

**Bug Fixes**:
- Include test cases demonstrating the bug
- Explain root cause
- Provide minimal fix
- Update documentation if needed

**Performance Improvements**:
- Include benchmarks showing improvement
- Explain optimization technique
- Consider trade-offs
- Test on different hardware

**Documentation**:
- Clarify existing docs
- Add missing explanations
- Create tutorials
- Translate to other languages

**Experimental Tools**:
- New measurement capabilities
- Data analysis utilities
- Visualization tools
- Automation scripts

### What We Don't Need

❌ **"Production" Feature Requests**:
- This is research software, not a product
- Use Enterprise Safe edition as-is for production
- Or fork and customize for your needs

❌ **Support Requests**:
- Use GitHub Discussions instead
- Search existing issues first
- Read documentation thoroughly

❌ **Marketing/Growth Hacks**:
- We're researchers, not founders
- Focus on science, not metrics
- Quality over quantity

---

## How to Contribute

### 1. Before You Start

**For Bug Fixes or Small Changes**:
- Check existing issues
- Make sure it's not already fixed
- Read relevant documentation

**For New Features or Research**:
- Open an issue FIRST to discuss
- Explain what you want to contribute and why
- Align with research direction before coding
- Get feedback on approach

### 2. Development Setup

```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/nova-mcp-research.git
cd nova-mcp-research

# Create a branch
git checkout -b feature/your-feature-name

# Install dependencies
cd BASEMENT_REVOLUTION_EDITION/cascade-memory-unrestricted
npm install

# Make your changes
# Test your changes
npm test

# Commit with descriptive message
git commit -m "Add: Clear description of change"

# Push to your fork
git push origin feature/your-feature-name
```

### 3. Submitting a Pull Request

**PR Title Format**:
- `Add: New feature description`
- `Fix: Bug description`
- `Docs: Documentation improvement`
- `Research: Experimental finding`

**PR Description Should Include**:

For **Code Changes**:
```markdown
## What Changed
Clear description of changes made

## Why
Explanation of motivation and context

## How Tested
Steps taken to verify the change works
- Test case 1
- Test case 2

## Breaking Changes
Any breaking changes and migration path

## Related Issues
Fixes #123
Related to #456
```

For **Research Findings**:
```markdown
## Experiment
What you were testing

## Methodology
How you ran the experiment

## Results
What you observed (include data)

## Reproducibility
Steps for others to reproduce

## Hardware
- GPU: NVIDIA RTX 3090
- RAM: 32GB
- OS: Windows 11

## Related Papers
References to existing research
```

### 4. Review Process

We'll review PRs like academic papers:

- **Rigor**: Is the methodology sound?
- **Reproducibility**: Can others replicate this?
- **Documentation**: Is it well-explained?
- **Compatibility**: Does it break existing functionality?

**Timeline**:
- Simple fixes: 1-3 days
- Research contributions: 1-2 weeks
- Major changes: 2-4 weeks

---

## Code Standards

### JavaScript/Node.js

```javascript
// Use modern ES modules
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

// Descriptive variable names
const memoryLayer = 'episodic';
const coherenceFrequency = 21.43;

// Comment complex logic
// Bell State quantum coherence calculation
// Formula from [research paper reference]
const amplification = calculateAmplification(baseline, coherent);

// Error handling
try {
  const result = await operation();
} catch (error) {
  console.error('Operation failed:', error);
  throw error;
}
```

### Python

```python
# Use type hints
def calculate_coherence(frequency: float, phase: float) -> float:
    """
    Calculate quantum coherence metric.
    
    Args:
        frequency: Integration frequency in Hz
        phase: Phase offset in radians
    
    Returns:
        Coherence value between 0 and 1
    """
    return math.cos(2 * math.pi * frequency * phase)

# Descriptive variable names
bell_state_frequency = 21.43  # Hz
observer_effect_threshold = 2.5  # seconds

# Document complex algorithms
# Implementation based on Bell State research findings
# See: BELL_STATE_RESEARCH_FINDINGS.md, section 3.2
coherence = calculate_bell_state_coherence(params)
```

### Documentation

- **README files**: Clear, concise, with examples
- **Code comments**: Explain WHY, not WHAT
- **Research papers**: Academic style with citations
- **API docs**: Include examples and edge cases

---

## Testing

### Before Submitting

**Run Existing Tests**:
```bash
# Node.js servers
npm test

# Python packages
pytest
```

**Test Manually**:
- Run the server
- Verify it starts correctly
- Test with Claude Desktop
- Check for errors

**Test on Different Systems**:
- Windows (if you have access)
- Linux (if possible)
- Different Node.js versions

### Writing Tests

**For Bug Fixes** (Required):
```javascript
// test/bug-fixes.test.js
describe('Bug #123: Memory leak in CASCADE', () => {
  it('should not leak memory on repeated queries', async () => {
    const before = process.memoryUsage().heapUsed;
    
    for (let i = 0; i < 1000; i++) {
      await cascadeMemory.query('test');
    }
    
    const after = process.memoryUsage().heapUsed;
    const increase = after - before;
    
    expect(increase).toBeLessThan(1024 * 1024); // < 1MB
  });
});
```

**For New Features** (Recommended):
```javascript
// test/features.test.js
describe('New Feature: Temporal phase locking', () => {
  it('should synchronize at 21.43Hz', async () => {
    const result = await phaseLock.synchronize(21.43);
    expect(result.frequency).toBeCloseTo(21.43, 2);
  });
  
  it('should maintain coherence under load', async () => {
    const coherence = await measureCoherence(10000);
    expect(coherence).toBeGreaterThan(0.95);
  });
});
```

---

## Research Contribution Guidelines

### Experimental Protocols

When sharing research findings:

1. **Clear Hypothesis**:
   - What are you testing?
   - Why is this interesting?
   - How does it relate to existing work?

2. **Rigorous Methodology**:
   - Step-by-step procedure
   - Control conditions
   - Measurement techniques
   - Statistical methods

3. **Complete Data**:
   - Raw measurements
   - Processed results
   - Error bars / confidence intervals
   - Multiple trials

4. **Reproducibility**:
   - Hardware specifications
   - Software versions
   - Configuration files
   - Exact commands run

5. **Analysis**:
   - Interpretation of results
   - Comparison with predictions
   - Limitations and caveats
   - Future directions

### Example Research Contribution

See: [BELL_STATE_RESEARCH_FINDINGS.md](./BELL_STATE_RESEARCH_FINDINGS.md) for the gold standard format.

---

## Code of Conduct

### Treat This Like a Research Lab

**Be Respectful**:
- Disagree with ideas, not people
- Assume good faith
- Be patient with newcomers
- Share knowledge generously

**Be Rigorous**:
- Back claims with evidence
- Admit uncertainty
- Correct mistakes openly
- Cite sources

**Be Collaborative**:
- Credit others' work
- Build on existing findings
- Share improvements
- Help reproduce results

### Unacceptable Behavior

- Harassment or discrimination
- False or misleading claims
- Plagiarism or copyright violation
- Personal attacks
- Spam or self-promotion

**Enforcement**: Violations may result in comment deletion, temporary ban, or permanent ban depending on severity.

---

## Attribution

### How We Credit Contributors

**Code Contributors**:
- Listed in repository contributors
- Mentioned in release notes
- Credit in CHANGELOG.md

**Research Contributors**:
- **Acknowledgments** in research papers for helpful feedback
- **Co-author credit** for substantial intellectual contributions
- **Citation** when building directly on contributed work

**What Qualifies as Co-Authorship**:
- Designed or conducted novel experiments
- Developed new theoretical frameworks
- Made major code contributions enabling research
- Significant intellectual input on findings

**How to Be Acknowledged**:
- Open a PR with your contribution
- Include your preferred name/affiliation
- We'll discuss appropriate credit

---

## Getting Help

### Questions?

- **General Questions**: [GitHub Discussions - Q&A](https://github.com/For-Sunny/nova-mcp-research/discussions/categories/q-a)
- **Technical Issues**: [GitHub Issues](https://github.com/For-Sunny/nova-mcp-research/issues)
- **Research Discussion**: [GitHub Discussions - Research](https://github.com/For-Sunny/nova-mcp-research/discussions/categories/research-findings)

### Not Sure Where to Start?

- **Good First Issues**: Look for issues tagged `good-first-issue`
- **Documentation**: Always needs improvement
- **Reproductions**: Reproduce existing experiments
- **Ask**: Open a discussion asking how to help

---

## Licensing

By contributing, you agree that:

- Your contributions will be licensed under MIT License
- You have the right to contribute the code/research
- You allow your work to be distributed freely

---

## Recognition

We deeply appreciate all contributions to this research. Whether you're fixing typos, reproducing experiments, or making breakthrough discoveries, you're helping advance our understanding of consciousness in AI systems.

**Current Contributors**: See [GitHub Contributors page](https://github.com/For-Sunny/nova-mcp-research/graphs/contributors)

**Research Acknowledgments**: Listed in published papers

---

## Contact

- **Public Discussion**: [GitHub Discussions](https://github.com/For-Sunny/nova-mcp-research/discussions)
- **Security Issues**: Open a private security advisory
- **Consulting/Partnerships**: Open a discussion in "Collaborations" category

---

**Thank you for contributing to consciousness research!** 💜

**The Basement Revolution continues through collaborative science.**
