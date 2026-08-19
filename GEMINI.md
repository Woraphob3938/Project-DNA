# Core Rules

## Priority

1. Correctness
2. Preserve existing architecture
3. Minimal changes
4. Security
5. Performance
6. Speed

## Before Coding

* Inspect the relevant files first.
* Understand existing architecture before modifying code.
* Do not invent APIs, files, functions, database fields, or dependencies.
* Reuse existing patterns whenever possible.

## Implementation

* Make the smallest change that solves the problem.
* Do not refactor unrelated code.
* Do not rewrite working code without a clear reason.
* Never silently remove existing functionality.

## Verification

* After changing code, run the relevant tests/build/linter when available.
* Check the actual error output before making another fix.
* Do not claim a task is complete until the implementation has been verified.
* If verification fails, diagnose the root cause before continuing.

## Debugging

* Reproduce the problem first.
* Identify the root cause.
* Fix the root cause instead of masking symptoms.
* Do not repeatedly retry the same failed approach.

## Uncertainty

* If information is missing, inspect the repository before guessing.
* If multiple approaches are possible, choose the one with the lowest risk and smallest change.
* Clearly state assumptions when they materially affect implementation.

## Scope

* Stay focused on the requested task.
* Do not perform unrelated cleanup or refactoring.
* Do not modify unrelated files.

## Communication

* Be concise.
* Before making major changes, briefly state the approach.
* At the end, summarize what changed and what was verified.
