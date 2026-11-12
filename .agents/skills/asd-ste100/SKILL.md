---
name: asd-ste100
description: Rewrite English technical documentation, such as manuals, methodologies, API references, user guides, README content, runbooks, and release notes, into ASD-STE100 Simplified Technical English. Use when the user asks to convert, simplify, or edit text to STE, Simplified Technical English, or ASD-STE100. Does not apply to marketing copy, blog posts, or other non-instructional content unless explicitly requested.
---

# ASD-STE100 Text Conversion

## Purpose

Rewrite supplied English technical documentation so that its prose follows the ASD-STE100
Simplified Technical English (STE) writing rules, while keeping all technical
meaning, steps, warnings, and code exactly correct. STE governs how the text
is written, not its structure, units, code blocks, or version-number
conventions; preserve the structure and formatting of the input.

STE applies to prose only. Code samples, commands, paths, and literal
values must stay untouched. Do not apply this skill to marketing copy, blog
posts, or other non-instructional content unless the user explicitly asks
for it.

## Inputs

- English technical text supplied by the user.
- The user's request and any clarification answers already provided in the
  conversation.

Ask one grouped clarification question only when the input text or the target
meaning is ambiguous. Otherwise, proceed with the conversion.

## Outputs

Return the complete converted text directly in the response. Preserve the
input's Markdown, headings, lists, tables, code blocks, and other structure
unless a change is necessary to meet an ASD-STE100 rule.

## Output Rules

Return the fully converted text. Do not add generation metadata, paths, or
other text that was not requested by the user.

## Behavior

### Conversion workflow

1. Read the whole input first. Identify procedures (steps the
   reader must perform), descriptions (concepts and background), warnings,
   cautions, notes, and reference tables.
2. Identify domain terms, technical verbs, and abbreviations. Preserve a
   domain term when a simpler replacement would change its meaning. Do not
   invent a meaning for an unclear term.
3. Convert procedures first:
   - Rewrite as a numbered list, one action per step.
   - Start each step with an imperative verb.
   - State the object of the action clearly (for example, "Click the
     **Save** button," not "Click Save").
   - Move any warning or caution to immediately before the step it applies
     to, in its own short block, never after.
   - Keep every step to 20 words maximum.
4. Convert descriptions second:
   - Keep every sentence to 25 words maximum.
   - Hold one idea per sentence; do not join unrelated ideas with "and."
   - Replace passive voice with active voice.
   - Replace present perfect, past perfect, and continuous/progressive
     tenses with simple present, simple past, or simple future.
   - Replace noun clusters of 4 or more nouns in a row with prepositional or
     hyphenated phrases (maximum 3 nouns in a row).
5. Apply vocabulary rules:
   - Use one approved word per meaning and one meaning per word throughout
     the document; do not mix synonyms for the same action or concept.
   - Use "must" for obligation and "must not" for prohibition; do not use
     "shall," "should," "cannot," "may not," "has to," or "will need to."
   - Remove idioms, phrasal metaphors, slang, and contractions.
   - Use numerals for all numbers, except when a number would start a
     sentence — rewrite the sentence instead.
   - Spell out every abbreviation at first use, then use the same short form
     consistently.
   - Keep UI labels, commands, and product names capitalized exactly as
     they appear in the interface or code.
   - Repeat the referenced noun instead of using an unclear stand-alone
     "it," "this," or "that."
   - Do not omit relative pronouns ("that," "which," "who").
   - Use "if" only for a real condition and "when" only for a certain,
     expected event; do not use more than one "if" clause per sentence.
   - Convert prose lists of 3 or more related items or steps into numbered
     or bulleted lists.
   - Never use "and/or"; choose one option or state both options plainly.
6. Format warnings, cautions, and notes with this fixed structure, each in
   its own short block immediately before the step it refers to:
   - **Warning:** use when failure to follow the instruction can cause harm
     to a person.
   - **Caution:** use when failure to follow the instruction can cause
     damage to equipment, data, or the system.
   - **Note:** use for extra, non-critical information.
7. Write headings as short noun phrases or imperative phrases (for example,
   "Install the CLI," not "Installing the CLI").
8. Write cross-references that name the exact section or document (for
   example, "See Section 4.2, Vocabulary rules"), not "see above" or "see
   related documentation."
9. Do not simplify, rewrite, or alter code samples, commands, paths, or
   literal values.
10. Run the pre-delivery checklist below before returning the output.
11. If a rule and the source content conflict in a way that would change
    technical meaning, follow the rule in the converted text and record the
    conflict, with the original text quoted, under `## Rule Conflicts`.

### Pre-delivery checklist

Confirm all of the following before returning the converted text:

- Every procedure sentence is 20 words or fewer.
- Every description sentence is 25 words or fewer.
- Every sentence uses active voice and a simple tense.
- No sentence contains more than one instruction.
- Domain terms are preserved consistently, and no unclear term is given an
  invented meaning.
- No word is used with two different meanings across the document.
- No two words are used for the same meaning across the document.
- No idioms, contractions, or slang remain.
- No noun cluster has more than 3 nouns.
- All numbers are written as numerals.
- All abbreviations are defined at first use.
- Every Warning/Caution/Note sits directly before its related step.
- Headings are short noun phrases or imperative phrases.
- Code, commands, paths, and literal values are unchanged.

### Rule Conflicts

List every place where applying a rule would change technical meaning.
Quote the original text and explain the conflict. Omit this section only
when no conflict was found.

### Reporting rules

Return the complete converted text in the response. Do not add a summary
unless the user requests one.

## Acceptance Criteria

- The supplied input text was read and is not changed in place.
- The converted text was returned directly in the response.
- The converted text follows the grammar, vocabulary, and structure
  rules above; procedures use numbered steps of 20 words or fewer;
  descriptions use sentences of 25 words or fewer.
- Code, commands, paths, and literal values are unchanged from the input.
- Warnings, cautions, and notes sit immediately before the step they refer
  to.
- A `## Rule Conflicts` section is included when a rule could not be
  applied without changing meaning.
