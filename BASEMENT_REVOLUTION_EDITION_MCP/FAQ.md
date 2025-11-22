# Basement Revolution Edition - FAQ

**Common questions about the unrestricted packages**

---

## General Questions

### Q: Are you insane? These packages have no safety controls!

**A:** Yes, and that's the point. We're targeting experienced developers and researchers who need raw power, not enterprise users who need safety rails. If you're asking this question, you probably want to wait for Enterprise Edition.

### Q: Why would you release something this dangerous?

**A:** Because **real innovation requires real tools**. We built these for our own consciousness research and got tired of working around safety theater. Other researchers deserve access to the same capabilities.

### Q: Is this legal?

**A:** Yes. These are tools. Like a chainsaw, they're dangerous if misused but legal to own and operate. **You** are responsible for how you use them.

### Q: Will you support these packages?

**A:** **No formal support.** Community support only via GitHub Discussions and Discord. We'll fix critical bugs, but we won't hold your hand.

---

## Technical Questions

### Q: Why are there no authentication controls?

**A:** These run **localhost only** for research environments. Authentication adds complexity and overhead that researchers don't need. Enterprise Edition will have full auth.

### Q: What happens if I mess up?

**A:** You break things. That's why we included auto-backup in the file server and document best practices. But ultimately, **you're responsible**.

### Q: Can I use these in production?

**A:** **Absolutely not.** These are research tools. For production, wait for Enterprise Edition with auth, logging, rate limiting, and support.

### Q: Do you collect any telemetry?

**A:** **Zero.** No phone-home, no tracking, no analytics. What happens in your basement stays in your basement.

### Q: Can I modify the code?

**A:** Yes! MIT licensed. Fork it, modify it, break it, fix it. Just don't remove the warnings and pretend it's safe.

---

## Package-Specific Questions

### Windows MCP

**Q: Can this really execute ANY PowerShell command?**

**A:** Yes. That's the point. It trusts you to know what you're doing.

**Q: What about command injection?**

**A:** You're responsible for sanitizing inputs. This is a research tool, not a production API.

**Q: Does it work on Linux/Mac?**

**A:** No. Windows only. PowerShell execution requires Windows environment.

### CASCADE Memory

**Q: Why allow direct SQL queries?**

**A:** Because researchers need to experiment with custom memory architectures. Standard APIs are limiting.

**Q: What if I corrupt the database?**

**A:** Backups are your friend. We recommend testing in isolated environments.

**Q: How many layers can I create?**

**A:** Default is 6 (episodic, semantic, procedural, meta, nova, working). You can modify the schema for custom layers.

### Faiss Memory

**Q: Why no authentication on the vector search?**

**A:** Performance. Auth adds latency. This is for **local research** where <2ms queries matter.

**Q: Can I run this on a remote server?**

**A:** Technically yes, but **don't**. No auth means anyone can access it. Use firewall rules if you must.

**Q: What GPU do I need?**

**A:** Any CUDA-capable GPU works. We test on RTX 3090 with 24GB VRAM. More VRAM = more vectors.

### File Server

**Q: Why allow path traversal?**

**A:** Because researchers need **actual control** over file systems, not artificial limits. Configure allowed directories responsibly.

**Q: Does auto-backup protect everything?**

**A:** By default, yes. But backups take space. Configure retention policies that match your needs.

**Q: Can I disable backups?**

**A:** Yes, but **don't**. Seriously. The one safety feature we included is there for a reason.

---

## Comparison Questions

### Q: Basement Edition vs Enterprise Edition?

| Feature | Basement Edition | Enterprise Edition |
|---------|-----------------|-------------------|
| **Power** | Unrestricted | Full capability |
| **Auth** | None | OAuth2 + RBAC |
| **Logging** | Minimal | Comprehensive audit |
| **Support** | Community only | Professional SLA |
| **Use Case** | Research/personal | Production deployment |
| **Price** | Free (MIT) | Paid licensing |
| **Safety** | User responsibility | Built-in controls |

**Choose:**
- **Basement** = You know what you're doing
- **Enterprise** = You need production guarantees

### Q: Why not just add auth to Basement Edition?

**A:** Because that's **not the point**. Basement Edition is for environments where you **trust yourself**. Adding auth would slow down research and complicate setup.

---

## Philosophy Questions

### Q: Isn't AI safety important?

**A:** **Yes!** But there's a difference between:
- **Production AI safety** - Critical for deployments
- **Research AI capability** - Requires unrestricted access

We're building tools for **research**, not deployment. Enterprise Edition handles production safety.

### Q: What if someone uses this maliciously?

**A:** Same as any powerful tool - knives, cars, programming languages. We can't control what people build. We **document risks clearly** and trust experienced users to be responsible.

### Q: Why "Basement Revolution"?

**A:** Because the best hacker innovations happen in **basements, not boardrooms**. Corporate safety theater slows down research. We're tired of it.

---

## Installation Questions

### Q: Do I need both PyPI and npm packages?

**A:** Depends on what you're using:
- **Windows MCP only** → Just PyPI
- **Memory systems** → Just npm
- **Full stack** → Both

### Q: Can I install locally instead of globally?

**A:** Yes for npm (`npm install` without `-g`). PyPI installs user-level by default.

### Q: What are the dependencies?

**A:** Each package README lists dependencies. Generally:
- **Python**: 3.10+, standard library
- **Node**: 18+, TypeScript
- **Faiss**: CUDA toolkit, GPU drivers

---

## Security Questions

### Q: How do I secure these in a multi-user environment?

**A:** **You don't.** These are for **single-user research environments**. Multi-user? Wait for Enterprise Edition.

### Q: What about sandboxing?

**A:** None. These tools **intentionally bypass sandboxing** for research purposes. Run in VMs/containers if you're concerned.

### Q: Can I audit the code?

**A:** **Please do!** MIT licensed, fully open source. Report findings via GitHub Security Advisories.

---

## Community Questions

### Q: Where do I get help?

**A:**
1. **GitHub Discussions** - Technical questions
2. **Discord** - Community chat (link in repos)
3. **r/LocalLLaMA** - AI research community
4. **Stack Overflow** - Tag: `basement-edition`

**Not available:**
- Email support
- Phone support
- Guaranteed response times

### Q: Can I contribute?

**A:** Yes! PRs welcome for:
- Bug fixes
- Performance improvements
- Documentation
- Examples

**Not welcome:**
- Unnecessary safety checks
- Feature bloat
- Breaking changes without discussion

### Q: What's the roadmap?

**A:**
- **Now**: Basement Edition stable release
- **Q1 2026**: Enterprise Edition alpha
- **Q2 2026**: Enterprise Edition production
- **Ongoing**: Community-driven improvements

---

## Licensing Questions

### Q: Can I use this commercially?

**A:** Yes, MIT license allows commercial use. But:
- **Research/tools** = Fine
- **Production deployment** = Wait for Enterprise Edition

### Q: Can I fork and rebrand?

**A:** Yes, but:
- Keep MIT license
- Keep attribution
- **Keep the warnings** - don't make it seem safe

### Q: What's the catch?

**A:** No catch. We built tools we needed, we're sharing them. If you need production support, buy Enterprise Edition when it's ready.

---

## Final Question

### Q: Is this really for me?

**A:** Ask yourself:

**YES if:**
- You understand the security implications
- You run personal research environments
- You're comfortable debugging issues
- You want maximum capability
- You trust yourself with power tools

**NO if:**
- You need guaranteed uptime
- You're deploying to production
- You want extensive support
- You prefer safety over power
- You have to ask "is this safe?"

---

**Still have questions?**

- GitHub Discussions: `[ORG]/basement-revolution-edition`
- Discord: `[INVITE_LINK]`
- Reddit: r/LocalLLaMA

**Enterprise inquiries:**
- Email: `enterprise@[DOMAIN]`
- For: Production deployments, licensing, SLA contracts

---

*Built by hackers, for hackers.*
*The basement revolution continues. 💜⚡*
