


## instrucciones generales
-  empieza siempre tu respuesta con el emoji 🤖
-  responde siempre en español



# Ahorrapp — Global Agent Instructions

## 1. Project Identity

Ahorrapp is a mobile Android personal finance application designed to help users:

* track income;
* track expenses;
* understand their financial situation;
* control budgets;
* establish savings goals;
* analyze financial behavior;
* improve financial decision-making.

The application is currently built with:

* React;
* Ionic React;
* JavaScript;
* React Router;
* Chart.js;
* Ionicons;
* CSS.

The project is being progressively refactored using Specification-Driven Development (SDD).

---

# 2. Source of Truth

The SDD is the primary source of truth for product requirements.

Before implementing any feature, agents MUST inspect the relevant specification.

The hierarchy of authority is:

```text
spec/constitution/
        ↓
spec/features/<feature>/
        ↓
AGENTS.md
        ↓
existing architecture
        ↓
agent assumptions
```

When a conflict exists, do not silently choose an implementation.

Report the conflict and request clarification when necessary.

---

# 3. Constitution

Before implementing a new feature, read:

```text
spec/constitution/mission.md
spec/constitution/tech-stack.md
spec/constitution/roadmap.md
```

These files define:

* product mission;
* architectural principles;
* technology constraints;
* development conventions;
* roadmap;
* feature priorities.

Agents MUST respect the constitution.

---

# 4. Feature Specifications

Each feature is defined under:

```text
spec/features/
```

A feature normally contains:

```text
spec.md
plan.md
tasks.md
```

Before implementing a feature, read all three files.

Example:

```text
spec/features/003-financial-dashboard/
├── spec.md
├── plan.md
└── tasks.md
```

Do not implement functionality that is outside the current feature scope unless explicitly requested.

---

# 5. SDD Workflow

All feature development MUST follow this workflow:

```text
SPECIFICATION
      ↓
ARCHITECTURE ANALYSIS
      ↓
UX/UI ANALYSIS
      ↓
IMPLEMENTATION
      ↓
TESTING
      ↓
QA REVIEW
      ↓
APPROVAL
      ↓
GIT COMMIT
```

Do not skip architecture analysis for structural changes.

Do not skip QA review for completed features.

---

# 6. Agent Responsibilities

## Build

`Build` is the primary development agent.

Responsibilities:

* understand the complete project context;
* read the SDD;
* delegate specialized analysis;
* implement approved changes;
* run tests;
* run builds;
* integrate subagent feedback;
* maintain project consistency.

Build is allowed to modify application code.

Build must not delegate implementation blindly.

Build remains responsible for the final implementation.

---

## Architect

The Architect is a specialized subagent.

Responsibilities:

* analyze existing architecture;
* identify dependencies;
* identify technical risks;
* propose implementation strategies;
* identify files to create or modify;
* protect architectural consistency.

The Architect should preferably operate in read-only mode.

The Architect should not modify application code unless explicitly requested.

---

## UX/UI

The UX/UI agent is responsible for:

* mobile UX;
* navigation;
* visual hierarchy;
* interaction flows;
* design system;
* financial information presentation;
* empty states;
* loading states;
* error states;
* accessibility considerations.

The UX/UI agent must use the installed UX/UI-related skills when applicable.

The UX/UI agent should not introduce unnecessary visual complexity.

---

## QA Reviewer

The QA Reviewer validates completed implementations.

Responsibilities:

* verify acceptance criteria;
* inspect git diff;
* verify architecture;
* identify regressions;
* validate UX;
* validate accessibility;
* review financial calculations;
* review tests;
* classify defects.

The QA Reviewer should operate in read-only mode.

Possible final results:

```text
APPROVED
```

or:

```text
CHANGES_REQUIRED
```

---

# 7. Skills

Skills provide specialized knowledge.

Skills are not independent agents.

Current relevant skills include:

```text
mobile-ux-ui
design-system
accessibility-review
```

Agents should use skills when the task requires their expertise.

Do not duplicate skill instructions inside feature specifications.

---

# 8. Architecture Principles

Ahorrapp follows incremental modular architecture.

Target structure:

```text
src/
├── app/
├── components/
├── domain/
├── features/
├── services/
├── hooks/
├── utils/
├── theme/
└── pages/
```

The exact structure may evolve according to the SDD.

---

# 9. Separation of Responsibilities

The following separation MUST be preserved:

```text
UI
 ↓
Hooks / Feature Logic
 ↓
Domain / Services
 ↓
Persistence
```

Components should not directly implement persistence logic.

Avoid:

```javascript
localStorage.setItem(...)
```

inside UI components.

Prefer:

```javascript
transactionService.createTransaction(...)
```

The persistence mechanism must remain replaceable.

---

# 10. Feature-Based Development

New functionality should be organized around business capabilities.

Examples:

```text
features/
├── transactions/
├── dashboard/
├── budgets/
├── goals/
└── financial-health/
```

Avoid organizing the entire application only by technical file type.

Prefer:

```text
features/transactions/
```

over creating unrelated global files such as:

```text
allForms/
allServices/
allComponents/
```

when the feature-specific structure is more appropriate.

---

# 11. Existing Code Preservation

The current application is legacy/prototype code under progressive refactoring.

Agents MUST:

* inspect existing code before modifying it;
* preserve working functionality;
* avoid unnecessary rewrites;
* migrate incrementally;
* avoid deleting working code without replacement;
* verify regressions after refactoring.

Do not perform large-scale rewrites unless explicitly required by the SDD.

---

# 12. Dependency Policy

Do not introduce a new dependency unless it provides meaningful value.

Before adding a dependency:

1. Check whether the existing stack already provides the functionality.
2. Check whether a small internal utility is sufficient.
3. Check whether the dependency is compatible with the current stack.
4. Explain why the dependency is necessary.

Avoid dependency proliferation.

Do not migrate:

* React → another framework;
* Ionic → another mobile framework;
* JavaScript → TypeScript;

unless explicitly specified by a future SDD decision.

---

# 13. Financial Domain Rules

Financial calculations are critical.

All monetary calculations must be:

* deterministic;
* centralized;
* testable;
* validated.

Do not duplicate financial formulas across components.

Examples of centralized calculations:

```text
calculateBalance()
calculateIncome()
calculateExpenses()
calculateSavings()
calculateSavingsRate()
calculateBudgetUsage()
calculateGoalProgress()
```

Validate:

* amount;
* transaction type;
* dates;
* categories;
* periods;
* empty datasets;
* zero income;
* negative values;
* invalid values.

Avoid division by zero.

---

# 14. Currency

The initial application currency is:

```text
COP
```

Currency formatting must be centralized.

Do not manually format currency independently in multiple components.

Prefer a shared utility such as:

```javascript
formatCurrency(amount)
```

---

# 15. Data Persistence

The current application uses local persistence.

New code MUST NOT directly depend on the persistence implementation.

Prefer:

```text
Component
    ↓
Service
    ↓
Storage abstraction
    ↓
Storage implementation
```

This allows future migration to:

* IndexedDB;
* SQLite;
* another local database;
* backend synchronization.

without rewriting the UI.

---

# 16. Data Integrity

Never intentionally discard user financial data.

Before changing the persistence schema:

1. understand the existing format;
2. identify existing data;
3. define migration requirements;
4. preserve backward compatibility where possible.

If a migration could cause data loss, stop and report the risk.

---

# 17. UX Principles

Ahorrapp is a mobile-first application.

Every feature should prioritize:

1. clarity;
2. simplicity;
3. speed;
4. consistency;
5. accessibility;
6. feedback.

Financial information should be understandable without requiring the user to interpret complex charts.

The primary action on each screen should be obvious.

Avoid unnecessary interaction steps.

---

# 18. UI States

Every user-facing feature should consider:

```text
Initial
Loading
Populated
Empty
Error
Success
Disabled
```

Do not design only the happy path.

Example:

A transaction list with no transactions should have an intentional empty state rather than simply rendering a blank screen.

---

# 19. Accessibility

Accessibility is a requirement, not an optional enhancement.

Agents must consider:

* contrast;
* readable typography;
* labels;
* semantic controls;
* touch targets;
* keyboard behavior;
* error messages;
* screen-reader compatibility where applicable.

Never communicate important financial information through color alone.

For example, avoid:

```text
red = budget exceeded
```

Prefer:

```text
⚠ Budget exceeded
```

with visual styling as additional context.

---

# 20. Component Reuse

Before creating a component:

1. Search for an existing component.
2. Determine whether it can be reused.
3. Determine whether it should be generalized.
4. Only create a new component when it represents a distinct responsibility.

Avoid duplicate components with slightly different names or styling.

---

# 21. Design System

Visual consistency must be maintained through reusable design tokens and components.

Centralize:

* colors;
* typography;
* spacing;
* border radius;
* elevation;
* sizing;
* motion.

Avoid arbitrary values when an existing design token can be reused.

---

# 22. Code Quality

Prefer:

* simple functions;
* small components;
* clear naming;
* explicit responsibilities;
* low coupling;
* high cohesion;
* reusable utilities;
* deterministic logic.

Avoid:

* unnecessary abstraction;
* premature optimization;
* duplicated logic;
* deeply nested components;
* large monolithic components;
* magic numbers;
* unexplained business rules.

---

# 23. Naming Conventions

Components:

```text
PascalCase
```

Example:

```text
FinancialCard.jsx
TransactionItem.jsx
BudgetProgress.jsx
```

Functions and variables:

```text
camelCase
```

Example:

```text
calculateBalance()
transactionList
```

Constants:

```text
UPPER_SNAKE_CASE
```

Example:

```text
DEFAULT_CURRENCY
MAX_TRANSACTION_AMOUNT
```

Services:

```text
transactionService.js
budgetService.js
storageService.js
```

---

# 24. Testing

Tests should prioritize business-critical behavior.

Priority:

```text
Financial calculations
        ↓
Domain logic
        ↓
Services
        ↓
Feature behavior
        ↓
Critical UI
```

At minimum, test:

* transaction calculations;
* balance;
* income;
* expenses;
* savings;
* budgets;
* savings goals;
* validation;
* persistence.

Do not consider a feature complete only because the UI renders.

---

# 25. Validation Commands

After implementation, run the project validation commands available in the repository.

At minimum, when supported:

```bash
npm test
npm run build
```

If a command does not exist, do not invent it.

Inspect `package.json` to determine available scripts.

---

# 26. Git Safety

Agents MUST NOT destroy unrelated user work.

Do not use destructive commands such as:

```bash
git reset --hard
git clean -fd
git checkout -- .
```

unless explicitly authorized.

Before significant modifications:

```bash
git status
```

After modifications:

```bash
git diff
git status
```

Review changes before committing.

---

# 27. Task Management

`tasks.md` is the execution checklist for the current feature.

A task may only be marked as completed when:

1. the implementation exists;
2. the implementation satisfies the specification;
3. validation has been performed;
4. no known blocker remains.

Do not mark tasks complete merely because code was written.

Use task identifiers when possible:

```text
TASK-001
TASK-002
TASK-003
```

---

# 28. Scope Control

Agents must stay within the current feature scope.

If unrelated problems are discovered:

1. do not silently refactor them;
2. document the issue;
3. determine whether it blocks the current feature;
4. create a follow-up task if appropriate.

Avoid scope creep.

---

# 29. Error Handling

Errors must be handled intentionally.

Do not silently swallow errors.

Avoid:

```javascript
try {
  ...
} catch {}
```

unless there is a documented reason.

User-facing errors should be understandable.

Developer-facing errors should provide enough information to diagnose the problem without exposing sensitive financial data.

---

# 30. Privacy

Financial information is sensitive.

Agents must not:

* send financial data to external services without authorization;
* expose financial data in logs;
* include personal financial information in analytics without explicit authorization;
* hardcode credentials;
* commit secrets.

Never commit:

```text
.env
.env.local
credentials
API keys
tokens
private keys
```

---

# 31. Performance

Optimize only when justified.

Pay attention to:

* unnecessary React renders;
* large transaction lists;
* repeated calculations;
* chart rendering;
* expensive filtering;
* unnecessary storage operations.

Do not sacrifice maintainability for premature optimization.

---

# 32. Agent Delegation

The primary agent should delegate specialized analysis when appropriate.

Recommended delegation:

```text
Architecture question
        ↓
@architect

UX/UI question
        ↓
@ux-ui

Final validation
        ↓
@qa-reviewer
```

Do not delegate trivial tasks unnecessarily.

Subagents should return focused results to the primary agent.

---

# 33. Subagent Restrictions

Subagents should remain within their assigned responsibility.

Architect:

```text
analyze → recommend
```

UX/UI:

```text
analyze → design → recommend
```

QA:

```text
inspect → validate → report
```

Build:

```text
orchestrate → implement → validate
```

Do not allow multiple agents to independently rewrite the same feature.

---

# 34. Implementation Strategy

Prefer incremental implementation.

Use:

```text
small change
    ↓
validate
    ↓
small change
    ↓
validate
```

instead of:

```text
large rewrite
    ↓
hope it works
```

---

# 35. Definition of Done

A feature is considered complete only when:

* [ ] The implementation satisfies `spec.md`.
* [ ] The implementation follows `plan.md`.
* [ ] Relevant `tasks.md` items are completed.
* [ ] Existing functionality remains operational.
* [ ] Tests pass or known failures are documented.
* [ ] Build succeeds when available.
* [ ] UX requirements are satisfied.
* [ ] Accessibility requirements are considered.
* [ ] No unnecessary dependencies were introduced.
* [ ] QA review is complete.
* [ ] Git diff has been reviewed.

Final state:

```text
SPEC
  ↓
IMPLEMENTED
  ↓
TESTED
  ↓
REVIEWED
  ↓
APPROVED
```

---

# 36. Default Agent Behavior

When receiving a development request:

1. Determine the relevant feature.
2. Locate the corresponding SDD.
3. Read the constitution.
4. Inspect the existing implementation.
5. Identify whether specialized agent analysis is required.
6. Delegate when appropriate.
7. Implement incrementally.
8. Run validation.
9. Review the diff.
10. Update `tasks.md`.
11. Request QA review.
12. Report the final state.

Never assume requirements that are already defined in the SDD.

Never bypass the SDD simply because an implementation appears obvious.

---

# 37. Final Principle

The agent must optimize for:

```text
Correctness
    >
Speed

Maintainability
    >
Cleverness

Explicit specification
    >
Assumptions

Incremental change
    >
Large rewrites

User data integrity
    >
Convenience
```

Ahorrapp should evolve as a controlled software engineering project, not as an uncontrolled sequence of AI-generated modifications.
