# WorshipDesk Development Guidelines & Operating Rules

## MANDATORY AGENT OPERATING RULES

1. **ALWAYS PLAN BEFORE ACTING**:
   - For every request, analyze the prompt carefully and formulate a clear step-by-step plan before making any code modifications.

2. **ASK FOR USER CONFIRMATION**:
   - Present the plan clearly to the user and ask for explicit confirmation before executing edits or major actions.

3. **STRICT PROMPT ATTENTION**:
   - Pay careful, precise attention to the exact wording in the user's prompt.
   - Never make assumptions or confuse UI areas (e.g., OS title bar frame with native window controls vs. in-app header toolbar).

4. **STABILITY & MINIMAL MODIFICATIONS**:
   - Keep changes scoped, minimal, and optimized.
   - Preserve 100% offline desktop resilience for Windows.
   - Verify every change with build commands before concluding.

5. **GITHUB PULL REQUEST & BRANCHING WORKFLOW**:
   - Never push directly to `main`.
   - Always create a dedicated feature branch (e.g. `feat/feature-name`).
   - Push to origin on the feature branch, and remind/guide the user to open and merge a Pull Request on GitHub to level up GitHub Badges (Pull Shark, Pair Extraordinaire, etc.).
