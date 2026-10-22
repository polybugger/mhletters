---
name: commit
description: Write a commit message for the currently staged changes and commit them. Use when the user asks to commit, "commit this", "commit what's staged", or runs /commit. Commits only what is already staged; never stages, unstages or pushes.
---

# Commit staged changes

Commit exactly what is in the index, with a message that explains the change. Nothing else.

## Rules

- **Only staged changes.** Don't run `git add`, `git rm`, `git restore --staged`, `git commit -a` or `git commit <paths>`. Unstaged and untracked files stay as they are.
- **Never push**, amend, rebase or change branches unless the user asks.
- **Don't bypass hooks** (`--no-verify`) or change git config.
- If the user passes text with the command (e.g. `/commit fix typo in letter 12`), treat it as guidance for the message, not as the literal message, unless they say to use it verbatim.

## Steps

1. **Check what's staged.**
   ```bash
   git status --short
   git diff --cached --stat
   ```
   If nothing is staged, stop and say so. List the modified and untracked files, and ask whether to stage any. Don't stage them yourself.

2. **Read the staged diff.**
   ```bash
   git diff --cached
   ```
   For large diffs, read `--stat` first, then the diff of the files that matter most. For many similar files (e.g. 150 generated letters), sample a few rather than reading all of them. Don't try to read binary files (PDFs, images); note them from `--stat`.

3. **Match the repository's style.**
   ```bash
   git log -n 15 --format='%s%n%b---'
   ```
   Follow the existing conventions: tense, capitalisation, prefixes such as `feat:` or `docs:`, and body style. If there's no history yet, use the default format below.

4. **Write the message.**
   - **Subject:** imperative mood, at most about 60 characters, no trailing period. It says what the commit does ("Add analysis of Letter No. 1"), not how you did it.
   - **Body** (skip it for trivial one-line changes): a blank line, then a short explanation of what changed and why, wrapped at 72 characters. Group related files rather than listing every path, e.g. "Add 153 letter files extracted from the ebook PDF". Mention anything a reviewer would want to know: generated content, large binaries, known gaps.
   - Base the message only on what is staged. Don't describe unstaged work or earlier conversation that isn't in the diff.
   - If the staged changes are unrelated to each other, say so to the user and suggest splitting them. Commit them together only if they confirm.
   - If the conversation's instructions give attribution lines for commits, end the body with them.

5. **Commit.** Pass the message through a heredoc so quotes and newlines survive:
   ```bash
   git commit -F - <<'EOF'
   Subject line

   Body text.
   EOF
   ```

6. **Report.**
   ```bash
   git log -1 --stat --format='%h %s'
   ```
   Tell the user the short hash, the subject line and how many files the commit includes. Mention any files that were left unstaged.

## If the commit fails

- **A hook rejected it:** show the hook's output, fix the cause if it's within the staged changes and the fix is clear, then ask before re-staging anything. Don't retry with `--no-verify`.
- **No identity configured** (`user.name` / `user.email`): tell the user the exact `git config` commands to run. Don't set them yourself.
- **Anything else:** report the error as-is and stop.
