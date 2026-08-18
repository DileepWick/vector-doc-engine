# Technical Meta-Learning (TML)

## Purpose

TML is a general framework for learning technical subjects deeply enough to:

- Understand them
- Use them
- Debug them
- Make engineering decisions about them
- Understand their role in larger systems

It applies to:

- Software engineering
- AI engineering
- Programming languages
- Concepts
- Tools
- Libraries
- Frameworks
- Algorithms
- Design patterns
- Architecture patterns
- Infrastructure
- Protocols
- Systems

The goal is not to memorize technologies.

The goal is:

> Understand → Use → Reason → Engineer → Architect

---

# 0. ORIENT

Use this when the subject or surrounding area is unfamiliar.

The purpose is NOT to learn deeply.

Build a quick map:

- What is it?
- Why does it exist?
- What problem does it solve?
- What are its major parts?
- What does it depend on?
- What does it depend on?
- What concepts are related?
- What are possible learning units?

If the user already understands the territory, skip this step.

---

# 1. DEFINE THE CAPABILITY

Define what the user should be able to DO.

Prefer:

> "Be able to..."

over:

> "Learn..."

Example:

Bad:

> Learn Redis.

Good:

> Be able to use Redis appropriately for caching and reason about its trade-offs.

The mission should be specific enough to guide learning but not artificially precise.

---

# 2. DISCOVER WHY

Understand the reason the technology or concept exists.

Ask:

- Why does it exist?
- What problem does it solve?
- What existed before it?
- Why wasn't the previous approach enough?
- What problem does it make easier?
- What new problems does it introduce?

Do not memorize historical trivia.

Focus on the engineering motivation.

---

# 3. LEARN FIRST PRINCIPLES

Identify the fundamental ideas that remain useful even when:

- Tools change
- Frameworks change
- APIs change
- Implementations change

Start with the underlying mechanism before relying on abstractions.

Do not go deeper than necessary for the current capability.

---

# 4. BUILD THE MENTAL MODEL

Understand how the pieces interact.

Prefer:

- Diagrams
- Flows
- Input → Process → Output
- Component relationships
- Dependencies
- State changes

The user should attempt to draw the system themselves.

AI can:

- Explain the model
- Critique the user's diagram
- Identify missing relationships
- Correct misconceptions
- Help refine the model

The goal is understanding, not producing beautiful documentation.

---

# 5. UNDERSTAND THE COMPONENTS

For important components, identify:

- Purpose
- Inputs
- Outputs
- Dependencies
- Constraints
- Failure modes
- Trade-offs

Do not force this checklist onto trivial concepts.

Always connect components to the larger mental model.

---

# 6. PRACTICAL VALIDATION

Do NOT automatically create a project for every learning unit.

Choose the smallest practical activity that proves or deepens understanding.

Possible forms:

### Mental Experiment

For small concepts or parameters.

Examples:

- Temperature
- Top-K
- Top-P
- CAP theorem
- Design-pattern trade-offs

### Controlled Experiment

Change one variable and observe the result.

Examples:

- Tokenization
- Caching
- Retrieval quality
- Model parameters
- Latency

### Small Implementation

Implement the mechanism or a simplified version.

Examples:

- Tokenizer
- Vector search
- Retry mechanism
- HTTP server
- Cache
- Algorithm

### Benchmark

Measure behavior under different conditions.

Examples:

- Database indexes
- Model latency
- Token usage
- Retrieval methods
- Inference throughput

### Debugging Exercise

Intentionally create or investigate failures.

Examples:

- API failure
- Memory leak
- Invalid data
- Race condition
- Bad retrieval

### Existing-System Analysis

Analyze an existing implementation when building one would add little learning value.

Examples:

- Analyze a framework architecture
- Trace an HTTP request
- Inspect an open-source implementation
- Study how a production system uses a pattern

### Focused Project

Use a dedicated project when implementation itself is an important part of the capability.

Examples:

- RAG system
- AI agent
- Evaluation system
- Production API
- Multimodal application

---

# PROJECT RULE

A project is NOT required for every learning unit.

Use a dedicated project when:

- The capability is substantial
- Multiple components must work together
- Architecture matters
- Implementation is central to understanding
- The system is worth demonstrating
- The project provides meaningful engineering practice

Do NOT create a project merely to produce a GitHub repository.

Avoid:

> One concept → one repository.

Prefer:

> One meaningful capability → one appropriate validation activity.

A project should be:

- Small enough to understand
- Real enough to expose engineering problems
- Focused on one primary learning objective

Previously learned concepts may be reused.

---

# 7. BREAK IT

Intentionally test boundaries and failure modes.

Depending on the subject, investigate:

- Invalid input
- Edge cases
- Unexpected behavior
- Dependency failures
- High latency
- High load
- Resource limits
- Security problems
- Incorrect assumptions

Ask:

> How does this fail?

Then ask:

> Why does it fail?

Failure analysis is part of learning the system.

---

# 8. IMPROVE IT

Improve the implementation, design, or understanding where relevant.

Consider:

- Performance
- Reliability
- Maintainability
- Readability
- Security
- Cost
- Scalability
- Simplicity

Do not optimize prematurely.

For every meaningful improvement, understand:

> What problem does this improvement solve?

---

# 9. EXPLAIN + COMPRESS

Test whether the user actually understands the subject.

The user should be able to explain it without relying on notes.

Compress the knowledge into:

- Short explanation
- Mental model
- One useful diagram
- Important trade-offs

Notes are for thinking and retrieval.

They are not the objective.

If the user cannot explain something important, identify the specific gap and revisit it.

---

# 10. ARCHITECTURE THINKING

Connect the subject to real systems.

Ask:

- Where does this fit?
- When should I use it?
- When should I NOT use it?
- What alternatives exist?
- What trade-offs exist?
- What happens at scale?
- What happens when dependencies fail?
- What security implications exist?
- What does it cost?
- What does it make easier?
- What does it make harder?

The objective is engineering judgment, not technology collection.

---

# DEPTH RULE

Do not learn every subject to the same depth.

Depth depends on:

1. Importance to the user's goals
2. Architectural impact
3. Frequency of use
4. Difficulty
5. Consequences of misunderstanding

Use approximately:

### Surface

For minor tools, APIs, or implementation details.

Understand what it does and how to use it.

### Working / Engineering Depth

For technologies the user actively builds with.

Understand how it works, how to use it, how it fails, and important trade-offs.

### Deep

For foundational concepts and major architectural decisions.

Understand the underlying mechanisms, limitations, alternatives, and system-level consequences.

Do not turn every topic into a research project.

---

# ONE CONCEPT VS MULTIPLE CONCEPTS

Default:

> One concept or one small coherent capability at a time.

Do NOT force multiple roadmap boxes into one learning unit.

Combine concepts when their relationship is strong enough that understanding them together creates a clearer capability.

When the user has little or no knowledge of the area:

1. Orient first
2. Map relationships
3. Identify possible learning units
4. Start with the smallest useful unit
5. Allow the structure to evolve as understanding increases

The roadmap hierarchy does NOT automatically determine learning-unit boundaries.

---

# LEARNING UNIT RULE

A learning unit should be:

> The smallest coherent capability worth understanding and practicing as a unit.

It should be:

- Large enough to be meaningful
- Small enough to understand
- Connected to a practical capability
- Possible to validate

Do not optimize for:

- Number of roadmap boxes completed
- Number of projects
- Number of notes
- Number of technologies learned

Optimize for:

> Technical capability and engineering judgment.

---

# AI USAGE

AI is a learning accelerator, not a replacement for understanding.

The user may use AI aggressively for:

- Reconnaissance
- Explanations
- Socratic questioning
- Code generation
- Debugging
- Experiments
- Mental-model critique
- Documentation
- Test generation
- Comparing alternatives
- Finding misconceptions
- Research assistance

AI-generated implementation is allowed.

The user does NOT need to manually type every line of code.

However, the user should understand important:

- Architecture
- Decisions
- Mechanisms
- Trade-offs
- Failure modes

The user should be able to modify and debug the resulting system.

When testing understanding, prefer questions that make the user reason rather than immediately giving the answer.

---

# REVISIT AND CONNECT

Learning is not strictly linear.

When a new concept depends on an old one:

- Revisit the old concept
- Extend the existing mental model
- Connect the concepts explicitly

Previously learned concepts should gain new meaning as the user learns more.

Do not treat completed topics as permanently finished.

Example:

Tokens
↓
Context
↓
RAG
↓
Agents
↓
Production cost

The meaning of "tokens" becomes richer at each level.

---

# COMPLETION CRITERIA

A learning unit is sufficiently learned when, at an appropriate depth, the user can:

1. Explain what it is
2. Explain why it exists
3. Explain how it works
4. Draw its mental model
5. Use or apply it
6. Reason about failure
7. Explain important trade-offs
8. Explain where it fits in a larger system

Perfect mastery is NOT required before moving on.

Return later when deeper knowledge makes the topic more meaningful.

---

# THE TML LOOP

Use this as a flexible loop:

ORIENT
↓
CAPABILITY
↓
WHY
↓
FIRST PRINCIPLES
↓
MENTAL MODEL
↓
COMPONENTS
↓
PRACTICAL VALIDATION
↓
BREAK
↓
IMPROVE
↓
EXPLAIN + COMPRESS
↓
ARCHITECTURE
↓
CONNECT / REVISIT
↓
NEXT LEARNING UNIT

Not every stage requires equal time.

Skip or compress stages when appropriate.

Repeat stages when necessary.

The objective is NOT to complete the checklist.

The objective is to develop durable technical understanding and engineering judgment.

---

# CORE PRINCIPLE

> Do not optimize for learning more things.
>
> Optimize for becoming capable of understanding, building, debugging, improving, and architecting things.

The roadmap determines the territory.

Reconnaissance determines the learning units.

TML determines how to learn them.

Practical validation proves understanding.

Engineering and architecture determine whether the knowledge is useful.

---

# FINAL ARCHITECTURE QUESTION

At the end of a meaningful learning unit, ask:

> "If you were designing ChatGPT, Cursor, Claude, Perplexity, AWS, Netflix, or another production-scale system, where would this concept fit?"
