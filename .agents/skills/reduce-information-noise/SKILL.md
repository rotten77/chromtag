---
name: reduce-information-noise
description: Removes informational clutter from text—such as repetition, filler, tangents, and unnecessary complexity—without losing meaning. Use when editing documentation, instructions, training materials, and presentations that need to be clearer, more concise, and more actionable.
---

# Reduce Information Noise

Increase the ratio of useful information to text length. Do not aim for maximum brevity: remove clutter, not information.

In *Noise: A Flaw in Human Judgment*, noise means unwanted variability in judgments. This skill uses the term *text noise* more narrowly: content or wording that makes the intended message harder to understand, act on, or assess. Do not treat legitimate uncertainty, qualifications, or differing evidence as noise.

By default, preserve the language, technical level, tone, and output type. Follow the requested audience, purpose, format, and length. If they are not stated, infer them from the text and its intended use.

## Identify signal

Signal is everything the reader needs to understand, act, decide, or verify correctness. Normally preserve:

- purpose, scope, conclusions, and follow-up actions;
- requirements, responsibilities, conditions, exceptions, dependencies, and step order;
- security, legal, and operational warnings;
- facts, arguments, evidence, sources, and meaningful uncertainty;
- numbers, units, dates, thresholds, names, identifiers, commands, and code examples;
- in training material: learning objectives, explanations needed for understanding, practice, and feedback;
- in presentations: the core message, supporting evidence, story progression, and the intended audience takeaway.

Reducing text noise is not the same as summarizing. Unless the user explicitly requests a summary, retain substantive coverage and operational detail.

## Edit the text

1. Separate content that must be retained from content that can be merged and content unrelated to the reader's purpose.
2. Remove or merge, in this order:
   - literal and semantic repetition;
   - introductions, conclusions, and meta-commentary that only repeat the message;
   - filler phrases, self-evident statements, and decorative modifiers;
   - tangents that do not affect the reader's task;
   - redundant examples serving the same purpose;
   - unnecessarily complex sentences, nominalizations, passive constructions, and nested parentheses.
3. Organize the remaining content around the reader's task. Start with the outcome or purpose; retain causality and dependency order; use consistent terminology; and express steps with action verbs.
4. Use headings, lists, or tables only when they genuinely improve navigation. Do not mechanically turn coherent prose into bullet points.
5. Check semantic equivalence before delivering the result.

## Protect meaning and reduce judgment noise

- Do not change the actor, scope, modality (`must`, `should`, `may`), negation, cause, condition, timing, or degree of certainty.
- Do not invent facts or silently resolve factual contradictions. Retain unclear or conflicting content and label it briefly as unclear.
- Do not remove limitations, edge cases, or uncertainty simply because they complicate the main message.
- Preserve citations and the provenance of claims. Remove a source only when the entire non-essential claim it supports is removed.
- Keep a representative example when it is needed for understanding or practice; merge examples that teach the same point.
- Do not make broad stylistic rewrites when local edits are sufficient to reduce text noise.
- When wording contains subjective or ambiguous judgments, make the criterion explicit where the source text provides one. Otherwise preserve the ambiguity and flag it rather than guessing.
- Apply the same editing standard throughout comparable sections; do not tighten one section while leaving equivalent repetition or vagueness elsewhere.

## Deliver the result

Unless the user specifies otherwise, return only the cleaned text in the same language and appropriate format. If contradictions or missing links prevent safe shortening, add a brief `Ambiguities` section and do not guess the intended resolution.

If the user requests an audit rather than a rewrite, report for each significant finding: its location or example, the type of text noise, its impact on the reader, and the recommended intervention.

## Check the result

Before delivering, verify that:

- the main message and expected action are quickly identifiable;
- every retained part serves the reader's purpose;
- information is not unnecessarily repeated;
- instructions are complete and actionable;
- meaning, obligation, and precision have not changed;
- stated uncertainty, qualifications, exceptions, and sources remain intact;
- comparable passages were edited consistently;
- the format fits documentation, instructions, training material, or a presentation.