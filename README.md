# Chromtag

With Chromtag, you can quickly find the bookmark you need.

## Build, run, and test

Add the exact project commands and a short description of what each command does. Keep this section to commands and brief descriptions; do not add a long tutorial. Do not invent commands.

| Operation | Command | Description |
|---|---|---|
| Build | `<add build command>` | `<brief description>` |
| Run | `<add run command>` | `<brief description>` |
| Test | `<add test command>` | `<brief description>` |

## AI agent workflow

Agents use `AGENTS.md` as the primary repository instruction file. At the start of a session, they restore project context from `.memory/`: read the project context and status, review the two most recent log entries, and consult the plan and relevant technical specification before acting.

During implementation, an agent works on no more than one user story at a time. After implementing a story, it reports the result and waits for the user to verify it before starting another story.

Agents keep this README and the documentation in `docs/` up to date when project changes affect them. They also update relevant files in `.memory/`. At a suitable stopping point, the agent suggests ending the session. When the session ends, it records a dated log entry, updates status or context when needed, and suggests a commit message.
