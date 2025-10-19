# AGENTS.md - AI Development Guide

## Project Knowledge

Mabocados is an application designed to exercise the mind through mini mathematical games. Its objective is to facilitate the learning of new math and logic concepts, complementing education and keeping the brain active and fit. With Mabocados, learning is dynamic and entertaining, encouraging users to strengthen their cognitive skills in a fun and continuous way.

**Technology Stack:**
- Astro (static site generator)
- Vue 3 (components and composables)
- TypeScript
- Tailwind CSS (styling)
- Prettier (code formatting)

**Core Features:**
- Multibocados multiplication game with timed challenges
- Visual grid-based puzzles with colored squares
- Progressive difficulty system (levels 1-20)
- Score tracking and timer mechanics
- Mobile-responsive design with on-screen keyboard
- Keyboard input support

### GitHub Data Access

- **ALWAYS use GitHub CLI for GitHub data** - NEVER use webfetch for issues, PRs, or other GitHub information
- **Issue information**: Use `gh issue view <number>`
- **PR information**: Use `gh pr view <number>`
- **PR diff**: Use `gh pr diff <number>`
- **Examples**:
  - ✅ Good: `gh issue view 7` (clean, structured output)
  - ❌ Bad: `webfetch` with GitHub URL (scraped HTML, verbose output)

### Issue Specifications

- **File Naming**: Use format `{issue-number}-{brief-description}.md` in `specs/`
- **Structure**: 
  - Title with issue link: `# Title\n\nhttps://github.com/software-factory-collective/mabocados/issues/{number}`
  - Brief plan description
  - Design decisions section (if applicable)
  - Task List with sections corresponding to atomic pull requests
    - Each section header represents one PR
    - Items within section are changes included in that PR (not necessarily atomic)
    - Use `[ ]` for pending and `[x]` for completed
- **Style**: 
  - ✅ Good: Simple, scannable checklist format
  - ✅ Good: Group related items logically
  - ❌ Avoid: Verbose descriptions, detailed explanations, multiple sections
- **TDD Approach**: Each task item should include tests first, then implementation
  - ✅ Good: "Add tests for X", "Implement X"
  - ❌ Bad: Separate testing section at the end
- **Task List Structure**: 
  - Each section = one atomic pull request
  - Items within section = changes included in that PR (can be multiple related changes)
  - ✅ Good: Section with multiple related implementation items
  - ❌ Bad: Each individual item as separate PR

### Specification Development Process

- **CRITICAL**: DO NOT make code changes while working on specifications
- **Specification phase**: Focus only on planning, design, and Task List creation
- **Implementation phase**: After spec is finalized, then proceed with code changes
- **Examples**:
  - ✅ Good: Discussing TDD approaches, test strategies, implementation order
  - ❌ Bad: Reading files, writing tests, or implementing code during spec phase
- **When in doubt**: If you're about to read/write code files, stop - you're still in spec phase

### TDD Implementation Process

**CRITICAL**: Always follow Test-Driven Development (TDD) when implementing features:

1. **Tests First**: Write tests BEFORE implementing any code
   - ✅ Good: "Add tests for X", then "Implement X" 
   - ❌ Bad: "Implement X", then "Add tests for X"
   - ✅ Good: Plan implementation order based on test requirements
   - ❌ Bad: Plan implementation without considering test structure

2. **Implementation Order**: 
   - Read the spec task list carefully - tests are always listed before implementation
   - Write failing tests first
   - Implement minimal code to make tests pass
   - Refactor if needed

3. **Examples**:
   - ✅ Good: "First I'll add tests for the new ACL storage methods, then implement the interface methods"
   - ❌ Bad: "I'll implement the ACL storage interface, then add tests for it"

4. **When in doubt**: If you're about to implement code without writing tests first, stop - you're violating TDD principles

### Git Workflow

- Feature branches for issues (e.g., `63-new-setting`)
- Use GitHub CLI for PR creation: `gh pr create`
- Commit messages follow conventional format: `feat:`, `refactor:`, `chore:`, `fix:`, etc.

### Opencode Commands

Opencode commands are defined as separate markdown files in `.opencode/command/`. Each command file should:
- Have a `description` and `agent` in the frontmatter
- Contain the command logic and usage instructions
- Follow the naming convention `{command-name}.md`

See `.opencode/command/` directory for examples.

**Common mistake to avoid:** Do NOT add command documentation to AGENTS.md. Commands belong in their own files in `.opencode/command/`.

### Naming Scheme

- **Code Names (variables, methods, functions)**: Don't put acronyms as all-caps in names. For example, use `AclRule` rather than `ACLRule` for an ACL rule.
  - This way, words are clearly differentiated by case.
  - Examples: `CreateApiKey`, `GetAclRules`, `UpdateAclRule` (NOT: `CreateAPIKey`, `GetACLRules`)
- **Documentation**: Use normal capitalization for acronyms in plain text, comments, and documentation.
  - Examples: "API key", "ACL rule", "REST API" (NOT: "ApiKey", "AclRule" in documentation)

