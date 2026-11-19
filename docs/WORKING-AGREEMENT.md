# GenAI Working Agreement

How the PivotFit team worked with its generative AI teammate, how that compared with the protocol we started from, and what changed along the way.

## 1. Purpose

We used AI as a collaborative engineering teammate, not just a code generator. It helped with requirements clarification, technical decisions, testing, security reviews, accessibility, and troubleshooting. The human team stayed responsible for evaluating recommendations, making decisions, and verifying results.

## 2. Our GenAI Teammate

**Tool:** Claude Opus 5.5 (model ID `claude-opus-5-5`, Anthropic), used through Claude Code in Visual Studio Code.

We used it for:

- **Requirements and planning:** clarifying user stories, identifying missing requirements, and evaluating implementation options.
- **Development assistance:** generating and modifying code based on team-approved requirements.
- **Quality assurance:** reviewing acceptance criteria, testing functionality, and identifying accessibility concerns.
- **Security:** identifying vulnerabilities, evaluating dependencies, and recommending security improvements.
- **Documentation and troubleshooting:** explaining technical issues, reviewing project progress, and suggesting next steps.

AI recommendations were proposals for the team to evaluate, never decisions that were accepted automatically.

## 3. Our Protocol

The workflow we set out to follow had five steps:

1. **Define the task.** A team member gives the AI a requirement, issue, question, or problem.
2. **Review the recommendation.** The AI proposes solutions, clarifies requirements, or identifies risks.
3. **Make a team decision.** We accept, modify, or reject the recommendation based on requirements, scope, and available resources.
4. **Implement and verify.** Changes are tested with development tools, automated checks, browser testing, or manual review.
5. **Document the outcome.** GitHub issues, pull requests, commits, and project documentation record the work.

Humans keep responsibility for decisions about product scope, infrastructure, security settings, and whether work is complete.

## 4. How We Actually Worked

| Protocol step | What we actually did | Gap or change |
|---|---|---|
| Define the task | Gave the AI a sketch, an issue, or a short question ("are there any accessibility concerns?"). The best results came when we also stated *how* to judge the work, e.g. "close any that we've finished, reading the full criteria." | Learned to include the standard of proof in the request, not just the task. |
| Review the recommendation | The AI often asked clarifying questions before building (e.g. what the availability grid's rows meant, where to store data, how much to build at once) and gave options with a recommendation. | Matched the protocol. Seeing options made it easier to disagree. |
| Make a team decision | We accepted some recommendations, adapted others, and rejected some. Example: we chose to build all six workout screens instead of the AI's suggested onboarding-only first pass, to see the complete workout experience. | Matched the protocol. |
| Implement and verify | Early on, "verified" often meant the AI's own local checks (lint, build, screenshots in a Chromium browser). That wasn't enough: a mobile fix reported as "fixed" still failed on an iPhone (WebKit), and it hadn't been deployed at all. | **Changed.** See section 5. |
| Document the outcome | Issues were closed with comments listing each acceptance criterion checked; commits describe what was verified; the team kept final approval for closing parent stories and merging. | Matched the protocol, and got stricter over time. |
| Human-owned decisions | Settings that need account access (Supabase password and email limits, GitHub security features, Railway's GitHub access) were handled by team members; code changes were delegated. | Clarified: the split is by *who can actually see and change the setting*. |

### Examples

- **Requirements clarification.** While building onboarding, the AI found missing details in our interface sketches and asked about scheduling, storage, and scope. We accepted some answers and rejected its suggestion to build onboarding alone first.
- **Security and accessibility.** The AI reviewed the app against WCAG 2.2 using automated and manual testing, and reviewed it for security risks (HTTP security headers, password rules, email limits, dependencies). The team reviewed the findings, implemented the appropriate changes, and handled the settings that required human access.
- **Verification and issue management.** The AI reviewed GitHub issues against their acceptance criteria instead of assuming tasks were done from their titles. The team kept final approval for closing parent user stories and merging work.
- **Learning from incorrect recommendations.** During a mobile navigation bug, the AI reported the problem fixed after testing in a Chromium browser, but it persisted on an iPhone using WebKit. The AI also made incorrect assumptions about Railway's deployment settings and GitHub organization permissions. The team checked the real environment, found the deployment-access problem, and involved the repository owner. AI explanations and test results have to be checked against the real environment.

## 5. What Changed and Why

**Initial approach.** We relied on AI to implement features, troubleshoot, and recommend solutions. Automated checks and local testing often decided whether a change worked.

**Updated approach.** We put more weight on verifying AI claims independently, especially about deployment, browser compatibility, security, and infrastructure:

- Test browser-specific problems in the right browser engine (WebKit for iPhones).
- Verify deployed changes on the live application, not only locally.
- Have a team member with access confirm infrastructure and permission settings.
- Require evidence before accepting that an issue is resolved.
- Keep final decisions about scope, acceptance criteria, and completion with the human team.

**Why.** The AI could give technically reasonable recommendations without being able to see the actual environment, and it sounded equally confident either way. We learned to tell apart three things: an AI assumption, a locally verified result, and a confirmed production outcome.

## 6. Guidelines for Future Contributors

Any new team or AI teammate continuing PivotFit should:

- Read the [README](../README.md), [HANDOFF](HANDOFF.md), and open GitHub issues before starting work. [ONBOARDING-PROMPT](ONBOARDING-PROMPT.md) brings a fresh AI chat up to speed.
- Clarify ambiguous requirements before implementing changes.
- Explain proposed solutions and their trade-offs before making significant changes.
- Verify with the project's tests (`npm test`, `npm run lint`, `npm run build`) and each issue's acceptance criteria.
- Test in the actual target environment when relevant, and say which environment was tested.
- Not assume a local fix has reached production.
- Get human approval for consequential decisions and for changes that need restricted access.
- Record decisions, unresolved issues, and verification results in GitHub.

## 7. Summary

Generative AI contributed well beyond writing code: it surfaced missing requirements, weighed technical decisions, improved accessibility, investigated security risks, and organized development work. It was most effective combined with human judgment, independent verification, and clear accountability. Our working agreement is AI-assisted development with human-owned decisions and evidence-based verification.
