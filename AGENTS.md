# Repository instructions

## Purpose and source of truth

- This file is the primary source of instructions for AI agents working in this repository.
- Read and follow these instructions before making changes.
- Tool-specific instruction files should refer to this file and contain only additional guidance needed for their tool. Do not maintain conflicting or duplicated copies of these instructions.
- If project documentation conflicts with observed repository behavior or a user’s direct instruction, explain the conflict and ask the user how to resolve it before making a consequential change.

## Start of a session

Before making changes:

1. Read `README.md`.
2. Read `.memory/project-context.md` and `.memory/project-status.md`.
3. Read the two most recent dated log files in `.memory/log/`, if any exist.
4. Read `.memory/plan.md` and the relevant sections of `.memory/technical-specification.md`.
5. Inspect the repository and relevant documentation so the work is based on the current state, not only on memory files.

If a required file is still a placeholder, do not infer its contents. Ask the user for missing project information when it is needed to proceed.

## Planning and user stories

- `.memory/plan.md` contains epics and user stories.
- Acceptance criteria belong in `.memory/technical-specification.md`. Associate them with the relevant epic or user story, using matching IDs or names.
- Keep the plan and technical specification consistent. The plan may refer to acceptance criteria in the specification but should not duplicate their full text.
- Do not invent requirements, stories, acceptance criteria, or technical decisions.

## Implementation limits and user verification

- Implement no more than one user story at a time.
- If a request covers multiple stories, implement at most one story, report which story was completed, and wait for the user’s verification before starting another.
- If it is unclear which story the user wants implemented, ask before choosing.
- After implementing a story and passing applicable tests and checks, mark it ready for verification. Summarize what changed and how the user can verify it, then wait for the user to confirm verification before beginning another story.
- Do not treat silence, elapsed time, or a new session as verification.
- Passing tests or creating a commit do not substitute for explicit user verification.
- When the user reports that a story is verified, update its status in `.memory/plan.md` if the plan defines statuses, then proceed only with the user’s next instruction.

## Documentation and memory upkeep

- Keep `README.md`, relevant files in `docs/`, and relevant files in `.memory/` up to date as the project changes.
- Check whether documentation needs updating as part of every change that affects project behavior, setup, usage, architecture, requirements, or workflows.
- Update documentation in the same work cycle as the related change. Do not leave known documentation changes for later.
- Keep `.memory/project-context.md` for durable project rules, workflows, conventions, and team information.
- Keep `.memory/project-status.md` for current state, blockers, and next steps.
- Keep `.memory/technical-specification.md` for technical design and acceptance criteria.
- Keep `.memory/plan.md` for epics and user stories.
- Keep the README’s build, run, and test commands accurate when project tooling or workflows change.

## Task updates

- Update `.memory/project-status.md` with completed work, verification state, remaining issues, and next steps. Update `.memory/project-context.md` when durable project information changes.
- Preserve unrelated work. Do not mark an incomplete task as completed.
- Write a dated log or create a commit only when the user asks. Do not log, commit, or end a session automatically after tests pass.

## Local files and secrets

- Keep machine-specific or private local files in `.local/`.
- `.local/` is Gitignored. Do not put shared project instructions or shared project memory there.
- Never add credentials, tokens, private keys, or other secrets to tracked files, documentation, logs, or example configuration.

## Skills

Project skills are stored under `.agents/skills/<skill-name>/SKILL.md`. Use a skill only when it is relevant to the task and its instructions are available.

The following two skills are included by default:

- `reduce-information-noise`: Use by default when generating user documentation, including explanations of functions, descriptions of the system, and similar explanatory content. Follow the skill’s instructions when they are available.
- `asd-ste100`: Use for step-by-step procedures in user documentation. Follow the skill’s instructions when they are available.

Additional skills may be added under `.agents/skills/`. Do not invent skill content or assume that a listed skill applies to every task.

## Project structure

- `docs/` is the default location for user-facing documentation.
- `src/` is the default location for application source code.
- Follow the project’s established structure if it intentionally differs from these defaults.
