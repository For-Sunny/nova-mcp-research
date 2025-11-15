# MCP Server Publishing Tutorials

Complete, beginner-friendly guides for packaging and releasing MCP (Model Context Protocol) servers on Windows.

## Overview

These tutorials take you from "I have Python code" to "My MCP server is published on PyPI and GitHub," ready for real-world use.

**Total time to complete all tutorials**: 2-3 hours
**Prior knowledge needed**: Basic Python, comfortable with command line

---

## The Five Tutorials

### 1. [Creating a Python MCP Server from Scratch](tutorial_creating_python_mcp.md)
**Time**: 45-60 minutes | **Difficulty**: Beginner

Learn to build a complete MCP server from the ground up.

**What you'll build**: A weather information MCP server with tools and resources

**Topics covered**:
- Project structure and dependencies
- JSON-RPC stdio communication (how MCP talks to clients)
- Registering tools and resources
- Testing before release
- 8 common pitfalls and how to avoid them

**Outcome**: Working MCP server ready for publication

---

### 2. [Publishing MCP to PyPI](tutorial_publishing_to_pypi.md)
**Time**: 30-45 minutes | **Difficulty**: Beginner

Package your MCP server and publish it to PyPI (Python Package Index).

**What you'll do**: 
- Create `pyproject.toml` configuration
- Build distribution packages
- Test installation locally
- Publish to PyPI
- Manage versions and updates

**Topics covered**:
- Modern Python packaging standards
- Semantic versioning (MAJOR.MINOR.PATCH)
- PyPI authentication and publishing
- Handling optional dependencies (GPU, dev tools)
- Troubleshooting common publishing issues

**Outcome**: Your server installable via `pip install weather-mcp-server`

---

### 3. [GitHub Release Best Practices](tutorial_github_release.md)
**Time**: 40-60 minutes | **Difficulty**: Beginner

Set up professional GitHub repository with releases, versioning, and documentation.

**What you'll do**:
- Create GitHub repository structure
- Write effective README.md
- Choose appropriate license (MIT vs Apache 2.0)
- Create semantic version tags
- Write clear release notes
- Optional: Automate with GitHub Actions

**Topics covered**:
- Repository organization
- Documentation standards
- Open source licensing
- Git tagging and workflows
- Release notes formatting
- Automated publishing with CI/CD

**Outcome**: Professional GitHub repository that encourages contributions

---

### 4. [Windows-Specific MCP Considerations](tutorial_windows_mcp_specifics.md)
**Time**: 20-30 minutes | **Difficulty**: Intermediate

Handle Windows-specific issues like file paths, shells, and GPU dependencies.

**Topics covered**:
- File path handling (backslashes, UNC paths, drive letters)
- PowerShell vs cmd.exe compatibility
- CUDA and GPU dependency management
- Windows security and permissions
- Testing on actual Windows systems
- Common Windows gotchas and solutions

**Outcome**: MCP server that works reliably on Windows

---

### 5. [Anonymizing Code for Public Release](tutorial_code_anonymization.md)
**Time**: 20-30 minutes | **Difficulty**: Beginner

Remove personal information before publishing your code.

**What you'll remove**:
- Hardcoded file paths (C:\Users\YourName\...)
- Email addresses and personal names
- GitHub usernames and internal references
- Personal comments and context
- Development machine details

**What you'll create**:
- Configurable paths via environment variables
- Example configuration files
- Automated audit script
- Pre-release anonymization checklist

**Outcome**: Code that protects your privacy while being useful to others

---

## Quick Start: Publishing Your First MCP Server

### Step 1: Build Your Server (Tutorial 1)
```powershell
mkdir weather-mcp-server
cd weather-mcp-server
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install mcp
# ... create src/weather_mcp_server/server.py
# ... write tests in tests/
```

### Step 2: Publish to PyPI (Tutorial 2)
```powershell
# Create pyproject.toml and README.md
pip install build twine
python -m build
twine upload dist/*
# Your package is now on PyPI!
```

### Step 3: Create GitHub Release (Tutorial 3)
```powershell
git init
git add .
git commit -m "Initial commit: Weather MCP server"
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin main
git push origin v0.1.0
# GitHub release created automatically
```

### Step 4: Handle Windows Issues (Tutorial 4)
- Use `pathlib.Path` for all file paths
- Document Windows-specific requirements
- Test on actual Windows systems
- Add Windows troubleshooting to README

### Step 5: Anonymize Your Code (Tutorial 5)
```powershell
python tools/anonymization_audit.py
# Remove all personal information
# Create example configs
# Run audit again until clean
```

---

## Common Questions

### Q: What if I don't have a server yet?
**A**: Start with [Tutorial 1](#1-creating-a-python-mcp-server-from-scratch). It walks you through creating the weather-mcp-server example step by step.

### Q: Do I need to follow all tutorials in order?
**A**: Generally yes. Each builds on the previous:
1. Create server
2. Publish to PyPI
3. Set up GitHub
4. Handle Windows issues
5. Anonymize code

However, if you already have code:
- Skip Tutorial 1, start at Tutorial 2
- Always do Tutorial 5 before publishing

### Q: How long does this actually take?
**A**: 
- Fast path (just getting to PyPI): 1-1.5 hours
- Complete path (with GitHub and anonymization): 2-3 hours

### Q: What if I have a problem?
**A**: Each tutorial has a dedicated troubleshooting section. Most common issues are covered there.

### Q: Can I skip Windows-specific considerations?
**A**: If your users are only on Linux/Mac, maybe. But most MCP users are on Windows with Claude Desktop, so highly recommended.

### Q: Do I have to use MIT license?
**A**: Recommended, but Tutorial 3 covers Apache 2.0 as an alternative. Choose what fits your philosophy.

---

## Tutorial Cheat Sheets

### Essential Commands Reference

```powershell
# Tutorial 1: Create and test server
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install mcp
python -m weather_mcp_server
pytest tests/ -v

# Tutorial 2: Build and publish to PyPI
pip install build twine
python -m build
twine check dist/*
twine upload dist/*

# Tutorial 3: Git and releases
git tag -a v0.1.0 -m "Release 0.1.0"
git push origin v0.1.0

# Tutorial 4: Test on Windows
py -3.8 -m venv test_38
.\test_38\Scripts\Activate.ps1

# Tutorial 5: Check for personal info
python tools/anonymization_audit.py
```

### Key Concepts

**JSON-RPC** (Tutorial 1):
- Request/response format for MCP communication
- Follows https://www.jsonrpc.org specification

**Semantic Versioning** (Tutorials 2 & 3):
- `v0.1.0` = MAJOR.MINOR.PATCH
- 0.x.x = pre-1.0, 1.0.0+ = stable

**Tools vs Resources** (Tutorial 1):
- Tools: Functions you provide (executable actions)
- Resources: Data you expose (reference information)

**Pyproject.toml** (Tutorial 2):
- Modern Python package configuration
- Replaces setup.py

**GitHub Actions** (Tutorial 3):
- Automated publishing when you push tags
- Reduces manual steps

**Path Handling** (Tutorial 4):
- Use `pathlib.Path` for cross-platform compatibility
- Never hardcode C:\Users\YourName\...

---

## File Structure After Completing All Tutorials

After finishing all five tutorials, your project looks like:

```
weather-mcp-server/
├── .github/
│   ├── workflows/
│   │   └── publish.yml           (Automate PyPI publishing)
│   └── CONTRIBUTING.md           (How to contribute)
├── src/
│   └── weather_mcp_server/
│       ├── __init__.py
│       ├── server.py             (Main MCP server)
│       └── config.py             (Configuration handling)
├── tests/
│   ├── test_tools.py
│   └── test_integration.py
├── tools/
│   └── anonymization_audit.py    (Check for personal info)
├── docs/
│   └── ARCHITECTURE.md           (Design documentation)
├── .gitignore                    (Python patterns)
├── LICENSE                       (MIT License)
├── README.md                     (User-facing guide)
├── CHANGELOG.md                  (Version history)
└── pyproject.toml               (Package configuration)
```

---

## Troubleshooting Matrix

| Problem | Tutorial | Section |
|---------|----------|---------|
| Server won't start | 1 | Part 6: Common Pitfalls |
| Can't install from PyPI | 2 | Part 9: Troubleshooting |
| GitHub release not appearing | 3 | Part 9: Troubleshooting |
| Path errors on Windows | 4 | Part 1: Path Handling |
| Audit finds personal info | 5 | Part 6: Audit & Verification |
| MCP tools not in Claude | 1 & 4 | Pitfall #2 & Windows integration |
| Installation permission denied | 4 | Part 4: Security |
| GPU not working | 4 | Part 3: CUDA Management |

---

## External Resources Referenced

### Official Documentation
- **MCP Specification**: https://spec.modelcontextprotocol.io/
- **Python Packaging**: https://packaging.python.org/
- **PyPI**: https://pypi.org/
- **Git**: https://git-scm.com/doc

### Tools & Services
- **Python**: https://www.python.org/
- **GitHub**: https://github.com/
- **PyPI**: https://pypi.org/
- **Twine**: https://twine.readthedocs.io/

### Standards & Best Practices
- **Semantic Versioning**: https://semver.org/
- **Keep a Changelog**: https://keepachangelog.com/
- **JSON-RPC**: https://www.jsonrpc.org/
- **PEP 517/518**: Modern Python packaging PEPs

---

## Contributing to These Tutorials

These tutorials are examples. If you find:
- Errors or outdated information
- Missing edge cases
- Unclear explanations
- Better ways to do things

Consider:
1. Opening an issue with details
2. Submitting improvements
3. Adding Windows-specific notes if you discover them

---

## Learning Outcomes

After completing all five tutorials, you'll be able to:

**Core Skills**:
- Create production-ready MCP servers
- Package Python applications professionally
- Publish to PyPI and GitHub
- Write clear technical documentation
- Handle real-world deployment issues

**Windows-Specific Skills**:
- Handle file paths correctly on Windows
- Manage dependencies and GPU libraries
- Test across Python versions
- Troubleshoot Windows-specific problems

**Professional Skills**:
- Version management with semantic versioning
- Release notes and changelogs
- Open source licensing
- Code quality and testing
- Privacy protection in code

---

## Next Steps After Publishing

Once your MCP server is published:

1. **Monitor Feedback**: Watch GitHub Issues for user questions
2. **Plan Updates**: Use semantic versioning for new releases
3. **Add Features**: Implement community requests
4. **Maintain Quality**: Keep tests passing and docs updated
5. **Build Community**: Respond to contributors, encourage forks

---

## Glossary

**JSON-RPC**: Protocol for sending function calls over text channels

**MCP**: Model Context Protocol - allows AI models to call tools

**PyPI**: Python Package Index - official repository for Python packages

**Semantic Versioning**: Version format MAJOR.MINOR.PATCH with meaning

**Virtual Environment**: Isolated Python environment per project

**Pyproject.toml**: Modern Python project configuration file

**GitHub Actions**: Automated workflows triggered by Git events

**Pathlib**: Python module for cross-platform file path handling

---

## License

These tutorials are provided as educational material. The example code (weather-mcp-server) uses MIT License.

---

## Acknowledgments

- Anthropic for the MCP specification and Python SDK
- Python Packaging Working Group for modernizing packaging
- Community members who reported bugs and improvements

---

**Last Updated**: November 14, 2024
**Status**: Complete and Ready to Use
**Target Audience**: Python developers new to package publishing

