import React, { useState, useEffect, useCallback, useRef } from "react";

// ─── Color palette (warm & approachable) ───
const C = {
  bg: "#FAFAF8",
  card: "#FFFFFF",
  accent: "#6C63FF",
  accentSoft: "#EDE9FE",
  accentDark: "#4F46E5",
  warm: "#F59E0B",
  warmSoft: "#FEF3C7",
  text: "#1E1B2E",
  textMid: "#4A4560",
  textLight: "#8C86A5",
  border: "#E8E5F0",
  success: "#10B981",
  coral: "#F472B6",
  coralSoft: "#FCE7F3",
};

// ═══════════════════════════════════════════
// ─── QUESTIONS CONFIG ─────────────────────
// ═══════════════════════════════════════════

const STEPS = [
  {
    id: "audience",
    question: "Which best describes your role?",
    subtitle: null,
    suggestions: [
      { label: "Hiring Manager", desc: "I'm evaluating candidates for an open role" },
      { label: "Design Director", desc: "I'm interested in your design skills and how you think" },
      { label: "Engineering Lead", desc: "I partner with design and want to understand your approach" },
      { label: "Product Stakeholder", desc: "I work cross-functionally and care about outcomes" },
      { label: "Peer", desc: "I'm in the design community exploring your work" },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you when exploring my portfolio?",
    subtitle: null,
    suggestions: [
      { label: "Strategic vision & executive influence" },
      { label: "Design craft & brand thinking" },
      { label: "Cross-functional leadership & delivery" },
      { label: "Technical innovation & AI fluency" },
    ],
  },
];

// ═══════════════════════════════════════════
// ─── CONTENT ENGINE ───────────────────────
// ═══════════════════════════════════════════

function getCustomizedContent(responses) {
  const audience = (responses[0]?.answer || "").toLowerCase();
  const priority = (responses[1]?.answer || "").toLowerCase();

  // ── Audience signals ──
  const isHiringManager = audience.includes("hiring");
  const isDesignDirector = audience.includes("design director");
  const isEngineeringLead = audience.includes("engineering");
  const isProductStakeholder = audience.includes("product");
  const isPeer = audience.includes("peer");
  const isEvaluator = isHiringManager || isDesignDirector;

  // ── Priority signals ──
  const wantsStrategy = priority.includes("strategic") || priority.includes("executive");
  const wantsCraft = priority.includes("craft") || priority.includes("brand");
  const wantsLeadership = priority.includes("cross-functional") || priority.includes("leadership") || priority.includes("delivery");
  const wantsAI = priority.includes("ai") || priority.includes("innovation");

  // ── Headline adapts to audience + priority ──
  const headline = isEvaluator && wantsCraft
    ? "From Embroidery to Enterprise Design — Ten Years of Craft"
    : isEvaluator && wantsStrategy
    ? "A Design Leader Who Builds What She Advocates For"
    : isEvaluator
    ? "A Design Leader Who Builds What She Advocates For"
    : isEngineeringLead
    ? "The Design Partner Who Speaks Your Language"
    : isProductStakeholder
    ? "Turning Stalled Infrastructure Into Strategic Assets"
    : wantsCraft
    ? "From Ballet Posters to Enterprise Platforms — Eight Years of Design Craft"
    : wantsAI
    ? "40+ Deliverables in 14 Weeks — What AI-Assisted Design Leadership Looks Like"
    : "Building the Design Language a $3B Company Didn't Know It Was Missing";

  // ── Focus line adapts to priority ──
  const focus = wantsCraft
    ? "Design Language, Brand Systems & Visual Craft"
    : wantsStrategy
    ? "Strategic Leadership & Executive Communication"
    : wantsLeadership
    ? "Cross-Functional Leadership & Production Delivery"
    : wantsAI
    ? "AI-Assisted Development & Technical Innovation"
    : "Design Systems Leadership at Enterprise Scale";

  // ── Which angle to emphasize on project cards ──
  const emphasize = wantsCraft
    ? "craft"
    : wantsLeadership || wantsStrategy
    ? "leadership"
    : wantsAI
    ? "outcomes"
    : "leadership";

  // ── Project order based on priority ──
  const projectOrder = wantsCraft
    ? ["design", "diagnose", "build", "strategize"]
    : wantsStrategy
    ? ["strategize", "diagnose", "build", "design"]
    : wantsAI
    ? ["build", "strategize", "diagnose", "design"]
    : wantsLeadership
    ? ["build", "strategize", "diagnose", "design"]
    : ["diagnose", "strategize", "build", "design"];

  // ── Curated capabilities (3 most relevant) ──
  const allCapabilities = [
    { icon: "palette", title: "Design Language & Brand", desc: "Three-tier token architecture, OKLCH color systems, design language development, multi-product theming, visual identity" },
    { icon: "groups", title: "Leadership & Influence", desc: "Cross-functional team leadership (9 contributors, 0 direct reports), executive communication, stakeholder navigation, adaptive messaging" },
    { icon: "widgets", title: "Design Systems", desc: "Component libraries, governance, multi-product support, spec-driven architecture, framework-agnostic design" },
    { icon: "smart_toy", title: "AI + Design", desc: "AI-assisted development workflows, machine-readable documentation, spec-driven generation across 4 frameworks" },
    { icon: "bar_chart", title: "Data Visualization", desc: "OKLCH-based chart palettes, ag-Grid + Highcharts theming, categorical/sequential/diverging color systems" },
    { icon: "brush", title: "Visual Design Craft", desc: "Brand systems, editorial design, digital learning, print, web, social, video, interaction design, component craft" },
  ];

  const capabilityOrder = wantsCraft
    ? [5, 0, 4] // Visual Design Craft, Design Language, Data Viz
    : wantsStrategy
    ? [1, 0, 2] // Leadership, Design Language, Design Systems
    : wantsAI
    ? [3, 2, 0] // AI + Design, Design Systems, Design Language
    : wantsLeadership
    ? [1, 2, 3] // Leadership, Design Systems, AI + Design
    : [2, 0, 1]; // Design Systems, Design Language, Leadership

  const capabilities = capabilityOrder.map((i) => allCapabilities[i]);

  // ── CTA heading adapts to audience ──
  const ctaHeading = isEvaluator
    ? "Let's Talk About the Role"
    : isEngineeringLead || isProductStakeholder
    ? "Want to Work Together?"
    : isPeer
    ? "Let's Connect"
    : "Let's Connect";

  return { headline, focus, emphasize, projectOrder, ctaHeading, capabilities };
}

// ═══════════════════════════════════════════
// ─── PROJECT DATA (from real case studies) ─
// ═══════════════════════════════════════════

const PROJECTS = {
  diagnose: {
    title: "Diagnosing a Four-Year Design System Stall",
    description:
      "NielsenIQ's design system had been stalled for four years. While still a UX designer, I diagnosed why — connecting user complaints, rising convergence costs, and missing infrastructure into a single argument leadership hadn't heard before. I built the token architecture nobody knew was missing and got design system work into PI planning for the first time.",
    tags: ["Systemic Diagnosis", "Token Architecture", "Stakeholder Influence", "Change Management"],
    leadershipAngle:
      "Earned the lead title by doing the job before I had it. Built credibility through one-on-one stakeholder conversations, never once pitching 'design tokens' to leadership — I led with their problems.",
    craftAngle:
      "Built a tiered token architecture (primitive → semantic) covering color, typography, spacing, elevation, radius, and motion — the first shared design language across the portfolio.",
    outcomesAngle:
      "First design system work prioritized in PI planning since the rebrand 4 years ago. UX Designer → Global Design System Lead in 5 months. Six token categories shipped. CPO pipeline established.",
  },
  strategize: {
    title: "When the Org Couldn't Prioritize, I Built a New Path",
    description:
      "When the org's planning structure couldn't prioritize design system work, I designed an alternative: a cross-team collaboration model where multiple product teams contribute capacity to shared infrastructure. I connected the AI-readiness gap to the design system and navigated the argument to the CPO's office — securing dedicated engineering resources for the system.",
    tags: ["Executive Communication", "Organizational Design", "AI Strategy", "Resource Planning"],
    leadershipAngle:
      "Navigated a four-month campaign from PI planning frustration to CPO sponsorship. Adapted the message for each audience: AI-readiness for executives, spec-driven architecture for engineering, design language for the design org.",
    craftAngle:
      "Designed the spec-driven architecture (spec.json + CLAUDE.md) that produces correct implementations across Angular, React, Vue, and Lit from the same source of truth. OKLCH-based color system with algorithmic primitives and semantic token layer.",
    outcomesAngle:
      "First CPO meeting on the design system. Dedicated engineering resources. V2 project greenlit. Six cross-functional contributors assembled.",
  },
  build: {
    title: "40+ Deliverables in 14 Weeks — Built With AI",
    description:
      "I assembled a cross-functional team of six am currently delivering 40+ production-ready components, tokens, themes, and patterns across three parallel workstreams in 14 weeks using AI-assisted development at 2–3x velocity. I also personally built the framework-agnostic proof-of-concepts that validated our spec-driven architecture.",
    tags: ["AI-Assisted Dev", "Cross-Functional Leadership", "Production Delivery", "Data Visualization"],
    leadershipAngle:
      "Led a 6-person team through influence, not authority. Built operational infrastructure from scratch — standups, boards, QA checklists, decision logs. Protected the credibility of AI-assisted development with a human review protocol.",
    craftAngle:
      "Extended the design system into data visualization: OKLCH-based categorical, sequential, and diverging palettes with ag-Grid and Highcharts theming. Every component designed with intention — every state, variant, spacing decision, and accessibility annotation.",
    outcomesAngle:
      "40+ deliverables across components, tokens, themes, and patterns. 2–3x velocity with AI-assisted development. 5 components validated across 4 frameworks. Three-swimlane build: V2 library, MEFF reskin, data visualization.",
  },
  design: {
    title: "But Can She Design?",
    description:
      "My broader portfolio proves I can diagnose, strategize, and build at enterprise scale — this part proves I've been designing the whole time. A visual companion spanning five organizations and ten years: brand systems as a one-person creative department, healthcare learning design, editorial design for institutional audiences, and the component craft inside an enterprise design system.",
    tags: ["Visual Design", "Brand Systems", "Editorial Design", "Component Craft"],
    leadershipAngle:
      "End-to-end brand ownership at Madison Ballet — print, web, social, video as a one-person creative department. The relationship between strategic leadership and design craft: systems thinking shows up at every scale.",
    craftAngle:
      "Madison Ballet workshop series across print, web, and social. Pathway Health learning design where clarity is a clinical requirement. SWIB editorial design making dense institutional content worth reading. Enterprise component craft and a notifications flow designed end to end.",
    outcomesAngle:
      "Five organizations, eight disciplines: visual design, brand systems, editorial, digital learning, video, interaction design, component design, textile art. The breadth that shows up in how I approach systems work.",
  },
};

// ═══════════════════════════════════════════
// ─── CASE STUDY DETAIL CONTENT ────────────
// ═══════════════════════════════════════════

const CASE_STUDY_DETAIL = {
  diagnose: {
    role: "UX Designer → Global Design System Lead",
    timeline: "January – December 2025",
    org: "NielsenIQ",
    audioSrc: null,
    overview: {
      summary:
        "NielsenIQ's design system had been stalled for four years. While still a UX designer, I diagnosed why — connecting user complaints, rising convergence costs, and missing infrastructure into a single argument leadership hadn't heard before. I built the token architecture nobody knew was missing, got design system work prioritized in PI planning for the first time since our rebrand 4 years prior, and earned the lead title by doing the job before I had it.",
      images: [
        { src: "/foundationsslide.png", label: "The problem: a functional but fragile design system" },
        { src: "/FoundationsRoadmap.png", label: "Foundations project roadmap" },
        { src: "/beforeafter.png", label: "Token system: before and after" },
      ],
    },
    learn: {
      sections: [
        {
          heading: "Strategic context",
          hideImage: true,
          body: "NielsenIQ had a component library. What it didn't have was anyone who believed a design system mattered.\n\nComponents existed in Figma and a shared code repository, but they functioned more like a parts bin than a system. Hardcoded hex values lived in SCSS files, pixel sizes were scattered everywhere, and typography was defined inline. Color styles in Figma were tied to individual components rather than organized by intent, which meant there was no shared design language connecting what a designer meant by 'primary surface background' and what an engineer typed into code. Every product team translated on their own, and every translation introduced drift.\n\nUsers were telling us the products didn't work well. Complaints about usability, visual inconsistency, and disjointed aesthetics came in across the entire portfolio, the same action might use different colors, different spacing, and different interaction patterns depending on which product you were in. These weren't edge cases; they were the everyday experience. Leadership saw them as product-level problems to fix product by product or even feature by feature, and nobody was connecting the complaints to a systemic cause.\n\nThe stakes were rising. The company was converging its flagship product with a newly acquired platform, a strategic priority with executive sponsorship and a real timeline. That convergence would require two product experiences, built by different teams with different conventions, to feel like one product. Without a shared design language, it would mean rebuilding every interface manually or accepting that the 'unified' platform would feel stitched together.\n\nMeanwhile, a design system lead had been hired specifically to drive this work. His contract was ending, and in the time he'd been here, adoption hadn't moved forward in any meaningful way. The org had been talking about the design system for four years, and very little had changed. By early-2025, the default assumption was that design system improvement was something that got discussed and then didn't happen.\n\nI decided to stop waiting for someone else to fix it."
        },
        {
          heading: "What I saw that nobody else was connecting",
          embed: "https://embed.figma.com/deck/A5UymswirKUpZUWtwCzcPZ?node-id=&embed-host=share",
          body: "I started doing diagnostic work in July 2025 — five months before I had the design system lead title, while I was still technically a UX designer. What I found wasn't just a technical gap. It was a perception problem with three reinforcing causes. \n\nNobody had connected the user complaints to a root cause. Product teams were hearing feedback about usability issues and visual inconsistency, and they were treating each complaint as a product-level problem. Fix this screen. Adjust that flow. Redesign this page. Nobody had stepped back and said: these complaints are symptoms of not having shared design infrastructure. The individual fixes were reasonable if you assumed each problem was local. They were expensive and futile if you recognized the problems were structural. \n\nThe design system had no advocate who could make the value legible outside UX. Tokens, semantic layers, component APIs — these concepts don't translate into language a VP of Product or a CPO acts on. The previous lead had been hired to drive adoption, but adoption of what? A component library with no token system, no governance, no connection to the problems leadership cared about? The work had stalled because nobody was building the bridge between what a design system is and what it solves in terms that mattered to the people who controlled investment. \n\nInstitutional cynicism was the default. I wasn't just proposing a foundational project — I was proposing that a category of work the org had written off was actually the answer to problems they were actively spending money trying to solve in other ways. \n\nThe critical reframe came from mapping user complaints, product convergence costs, and the missing infrastructure together into a single argument: leadership already knew users were unhappy with inconsistency. They already knew the convergence would be complex and expensive. What they hadn't connected was that both problems had the same root cause — no shared design language — and that a design system with a proper foundation was the fix they didn't know they needed.",
        },
        {
          heading: "Earning credibility before having authority",
          imageSrc: "/FoundationsRoadmap.png",
          imageAlt: "Foundations project roadmap",
          body: "I didn't wait for the title. Starting in July 2025, I began having direct conversations with the product leaders who controlled prioritization. Not presentations. Not Slack messages. One-on-one conversations where I could understand what each stakeholder cared about and connect the foundations work to those specific concerns. \n\nThis was deliberate sequencing. Proposing a multi-month foundational project to an organization that had failed to deliver one for four years required a different kind of credibility than a good project brief. I needed people to have already seen me do the work — and to trust that I understood their constraints — before I asked them to prioritize it. \n\nI never pitched 'design tokens' to leadership. I didn't even lead with 'design system.' I led with their problems: users unhappy with inconsistency, convergence costs ballooning without shared infrastructure, teams duplicating effort across the portfolio. The design system wasn't a UX initiative competing for budget. It was the infrastructure that would make their existing investments actually work.",
        },
        {
          heading: "Building the token system",
          widget: "tokenExplorer",
          body: "The biggest technical challenge wasn't building the token system. It was changing how the entire design team thought about design decisions. \n\nThe Figma library had color styles, but they were flat — tied to specific components rather than organized by intent. A button had a color. A card had a color. There was no layer of abstraction that said 'this button and this card both use color.action.primary because they serve the same semantic purpose.' Designers picked colors from a component-level swatch. The concept of why a color was being used — rather than which color it was — didn't exist as a shared mental model. \n\nI introduced a three-tier architecture: primitive tokens define the raw palette, semantic tokens define intent (surface, text, border, action, feedback), and component tokens map semantic values to specific UI elements. The primitive layer gives you the 'what'. The semantic layer gives you the 'why'. The component layer gives you the 'where'. \n\nGetting alignment took months — not a single workshop. I ran iterative working sessions, built documentation with concrete examples from our actual components, and spent one-on-one time with designers who were struggling with the shift. The practical demonstration that sold it: when a semantic token changes, every component that references it updates automatically. When a hardcoded value changes, someone has to find and update every instance manually. That difference, shown in real Figma files, made the abstract concrete. \n\nThe cross-disciplinary work was equally important. Figma's variable system and how engineers consume tokens in code are fundamentally different mental models. The naming conventions had to work in both contexts — a designer reading a Figma variable and an engineer reading a stylesheet needed to see the same name and understand the same intent without a translation layer. I worked across both disciplines to negotiate conventions that neither side loved unconditionally but both could work with consistently. \n\nKey architecture decisions: \n\nColor — algorithmic primitive scale rather than hand-picked shades. Sub-brand theming works by overriding primitive values; the entire semantic layer recalculates. I chose scalability over artisanal color craft because the multi-product portfolio made theming a structural requirement. \n\nTypography — organized by role (heading, body, caption, label, code) rather than size. A typeface change becomes a single-token update per role, not a hunt through every component. \n\nSpacing — 4px base unit with semantic application tokens encoding which multiples to use where, removing the decision from individual designers. \n\nElevation, radius, motion — invested in these because they're what makes a multi-product platform feel like one product rather than a collection of products wearing the same color palette.",
        },
        {
          heading: "Raising the priority",
          hideImage: true,
          body: "The stakeholder work and the foundations project converged into two outcomes that changed the trajectory of the design system entirely. \n\nFirst, I got the design system into PI planning for the first time in the org's history. That doesn't sound dramatic on paper, but it meant the design system went from not being part of the planning conversation at all to having a seat at the table where capacity decisions were made. The foundations work created the evidence and the relationships that made it possible to argue, credibly, that design system capacity needed to be planned alongside product delivery — not because the UX team wanted it, but because the org's strategic priorities required it. \n\nSecond, the VP of Product and UX — who had seen me doing this work for months — recommended me for the design system lead role when the outgoing lead's contract ended. In December 2025, I officially got the title. By that point, I had already moved the work further in five months than it had moved in the previous three and a half years."
        },
        {
          heading: "What I learned and what I'd do differently",
          hideImage: true,
          body: "The hardest part of this chapter wasn't the token architecture. It was getting an organization to see that a design system — something they'd never valued — was the answer to problems they were already spending money trying to solve. \n\nThe only way I found to do that was to stop talking about the design system entirely and start talking about their problems. 'We need design tokens' is a statement about the design system. Your users are unhappy and your convergence will cost twice as much as it should because you don\u2019t have shared design infrastructure\u201d is a statement about problems leadership already owns. Same underlying work. Completely different receptivity. \n\nThe other lesson: introducing a new mental model takes longer than building the system it describes. The Figma variable work was the smaller effort. Getting designers to think in intent rather than component-level styles, and getting engineers to see tokens as a shared contract rather than a design team concern, took months of sustained conversation. A token system that nobody internalizes is just a more organized version of the same chaos. \n\nI did the job I wanted — not the job I had. I saw gaps nobody was addressing, took the first steps to close them, and made the work visible enough that the organization recognized it needed a lead to keep going. That's how I earned the title. And that diagnosis — the understanding of what was broken and why — is what made everything in Parts 2 and 3 possible.",
        },
      ],
    },
  },
  strategize: {
    role: "Global Design System Lead",
    timeline: "December 2025 – March 2026",
    org: "NielsenIQ",
    audioSrc: null,
    overview: {
      summary:
        "The org's planning structure couldn't prioritize the design system — one product controlled build capacity for every product. Instead of making a better case within a broken structure, I designed around it: I partnered with a different product team, designed a spec-driven architecture that generates components across four frameworks from a single source of truth, connected the design system to the company's AI-readiness gap, and navigated the argument to the CPO.",
      images: [
        { src: "/cpo ppt.png", label: "CPO presentation deck" },
        { src: "/v2 project board.png", label: "V2 project board" },
      ],
    },
    learn: {
      sections: [
        {
          heading: "Where part one left off",
          hideImage: true,
          body: "The diagnosis was complete. I'd built the token architecture, earned the lead title, and gotten design system work into PI planning for the first time. But having a seat at the planning table revealed a harder truth: the organizational structure made it nearly impossible for the design system to actually get the capacity it needed. \n\nThe CUIC team — the engineering group responsible for building shared components — reports into Discover, the flagship product. That reporting structure means one product controls the design system roadmap for every product. When Discover needs bug fixes, the design system waits. When Discover needs customization cleanup, the design system waits. This isn't a failure of intent. Everyone agreed the design system was critical. But the structure made the outcome inevitable. \n\nWith the lead title in hand and a token architecture ready for implementation, I now had a different problem: how do you serve an entire product portfolio when the only build capacity is controlled by one team that can't prioritize you?",
        },
        {
          heading: "The PI planning problem",
          hideImage: true,
          body: "The original roadmap was clean: create tokens in code (PI4 2025, done), raise bugs and customizations in Discover (PI1 2026), apply tokens to the common component library and publish V1.0 (PI2 2026). \n\nThen PI2 planning happened. \n\nThe bug-fix capacity that was supposed to go to feature teams was allocated entirely to CUIC. They could only complete bug fixes and customization removal for half of the components. The CUIC team escalated and requested reprioritization. Product leadership acknowledged the work was critical — and denied the request. The remaining work pushed to PI3, meaning tokens wouldn't be available in the common code repository until approximately September 2026. \n\nI documented the decision and its downstream impact in a communication to stakeholders — not as a complaint, but as a risk assessment. The consequences were concrete: feature teams outside Discover couldn't consume the standard component library until September. Without access to the official library, teams would customize and override components to keep up with their own delivery timelines — reintroducing the exact inconsistencies the design system was created to eliminate. The pattern we'd worked to break in Discover would replicate across the portfolio. \n\nI raised three questions for leadership: whether we needed interim guardrails for feature teams, whether PI3 capacity could be revisited, and whether the org needed a longer-term conversation about how cross-product infrastructure gets prioritized. \n\nThe response was acknowledgment without action. Leadership agreed with the assessment but didn't change the prioritization. \n\nThis confirmed what I'd been suspecting: waiting for the existing structure to prioritize the design system was not a viable strategy. I needed a different approach entirely.",
        },
        {
          heading: "Solving the multi-product problem",
          hideImage: true,
          body: "The structural constraint was clear — one product controlled capacity for every product's design system needs. But I'd also been building relationships across the product org for months, and I could see resources that weren't visible from inside the CUIC bottleneck. \n\nThe MEFF team had frontend developers with available capacity and a PM willing to invest in shared infrastructure. They needed the design system as much as anyone — their product had been built rapidly with AI and was functional but not componentized. Hardcoded styles, inconsistent spacing, no design system components in use. They had motivation, capacity, and a concrete problem the design system could solve. \n\nI designed a parallel path: instead of continuing to fight for capacity within CUIC's constrained roadmap, I proposed forking CUIC's existing repository into a separate package, restyling all 39 components to V2 design specs, replacing SCSS variables with CSS custom properties carrying the full token architecture, and shipping an optional Tailwind v4 preset for teams that wanted it. Existing component logic and tests stayed intact. The MEFF team's developers would be the build engine, using AI-assisted development to handle the mechanical restyling while focusing their judgment on review, edge cases, and integration. \n\nThis wasn't just a workaround for CUIC's capacity problem. It was a fundamentally different model for how shared infrastructure could get built: cross-team collaboration where multiple products contribute capacity to a shared outcome, rather than one team owning everything and every other team waiting. \n\nThe fork decision itself was a strategic call. Building from scratch was technically appealing — a clean Tailwind-native library with no legacy to convert. But the fork preserved years of battle-tested Angular logic and test coverage. It maintained a structural relationship with CUIC that mattered politically: V2 was an evolution, not a replacement. Discover could adopt it as a package swap, not a migration to a foreign codebase. And AI-assisted restyling of existing components was significantly faster than generating new ones — all 39 components could be restyled in approximately 2.5 weeks. \n\nI brought Alexey, CUIC's tech lead, in as an architecture advisor. His involvement meant the library team's technical participation, not just silent approval. That changed the conversation from 'they forked our repo' to 'they're building on our work with our input.'",
        },
        {
          heading: "The MEFF opportunity",
          widget: "projectBoard",
          body: "MEFF's product had been built in two weeks using Claude Code. The velocity was impressive. The frontend was a mess — hardcoded styles, no componentization, no design system components in use. Rolling V2 out to MEFF wouldn't be a simple package install. The product needed a visual cleanup and systematic component swap alongside the library build. \n\nI designed this as a dual-track project: the DS library build and the MEFF product reskin running in parallel, sharing the same two developers. Sprints 1–3 were primarily library work (90/10 split). Then the ratio flipped: Sprints 4–7 were majority reskin work (80/20). \n\nThe MEFF reskin wasn't just adoption work — it was the first proof that the V2 system could integrate into a real production product. Ilya produced page-by-page reskin specs prioritized by visibility: P0 (must look right at launch), P1 (should look right), P2 (can polish later). P2 was an explicit release valve — if the timeline compressed, those pages slipped without affecting the launch story. \n\nThis sequencing only worked because I'd thought through the dependencies weeks before Sprint 1. The token architecture from Part 1 gave us the design-side specifications. The fork approach gave us the code-side starting point. The AI-assisted development model gave us the velocity to front-load the library build and leave room for the reskin. Each piece of the strategy depended on decisions I'd made months earlier.",
        },
        {
          heading: "Thinking long term: Parallel solutioning as an organizational model",
          hideImage: true,
          body: "The V2 project wasn't just about delivering components faster. It was a proof of concept for a fundamentally different way of resourcing shared infrastructure at NIQ. \n\nThe CUIC bottleneck wasn't a temporary problem. As long as the shared component library lived inside one product's org, it would always be subordinate to that product's needs. No amount of advocacy within that structure would change the timeline. The V2 approach demonstrated an alternative: what happens when multiple teams contribute capacity to shared infrastructure, coordinated by a design system lead who works across organizational boundaries. \n\nIf V2 succeeded, it would create a concrete argument for changing how the org invests in shared infrastructure — not through restructuring (which is slow and political), but by demonstrating that cross-team collaboration on infrastructure produces results that single-team ownership can't. \n\nI designed the project plan with this larger argument in mind. The sprint structure, the role allocations, the stakeholder update cadence, the release valves — all of it was documented with enough rigor to be replicated. This wasn't a one-time workaround. It was a model.",
        },
        {
          heading: "Getting the CPO meeting",
          imageSrc: "/CPO ppt.gif",
          imageAlt: "CPO presentation deck",
          body: "Getting the design system in front of the CPO was, by itself, a milestone. In four years, the CPO had never had direct visibility into the design system — what it was, what state it was in, or why it mattered beyond the UX team. \n\nI didn't go directly. Going to a CPO with a two-part thesis — the org is falling behind on AI and the design system is the key to catching up — proposed by a design lead he'd never worked with, was a low-percentage play. I started with Karolina, NIQ's VP of Product and UX. She had the organizational context, the strategic awareness, and the CPO's ear. More importantly, she was already feeling the tension between velocity expectations on her teams and the AI lockdown blocking them. \n\nI connected two things she was already worried about. First: the industry was moving toward AI-assisted development and NIQ was being left behind. Second: even when the org did move on AI, the design system wasn't ready to support it. AI tools generate output based on what they can consume, and our system couldn't be consumed by AI. \n\nWhat I didn't anticipate: Karolina didn't just set up a meeting. She started using the AI-readiness framing in her own conversations with leadership. By the time I got into the CPO's office, the idea that NIQ was falling behind on AI and that the design system had a role in catching up wasn't entirely new to him. \n\nI framed the CPO conversation around two connected questions: Is the org moving fast enough on AI to stay competitive? And when we do move — what does AI need from us to actually work? \n\nI showed what a well-structured design system looks like from an AI tool's perspective: tokenized components with documented APIs, semantic metadata that describes intent. Then I showed where NIQ actually was: hardcoded values, undocumented components, no semantic layer. Even if we unlocked AI tools tomorrow, they'd have nothing structured to build on. The productivity gains everyone expected from AI would be eaten by manual cleanup. \n\nThe CPO didn't just acknowledge the point. He gave explicit approval for the MEFF team to move forward with the V2 project — a new component library with dedicated engineering resources, built with AI-assisted development, designed to be AI-consumable. A CPO greenlighting dedicated resources for a design system that a UX lead proposed was a first.",
        },
        {
          heading: "Adapting the message for every room",
          hideImage: true,
          body: "The AI framing wasn't universally effective. It landed with leadership because it connected to competitive anxiety. It bounced off the engineering teams who would actually build on the system. \n\nWhen I used the AI-readiness argument with frontend engineers, the response was skepticism. Their experience with AI coding tools was that the tools were useful for boilerplate but unreliable for design fidelity. Telling them 'we're building the design system for AI consumption' sounded like solving a problem they didn't believe existed yet. \n\nI adjusted. With engineering audiences, I stopped leading with AI entirely. I talked about the same architectural decisions — tokens as CSS custom properties, documented component APIs, semantic naming — but framed them as good engineering practice that happened to also make the system AI-consumable. The AI story was for leadership. The engineering story was about craft. Both were true. Knowing which one to lead with in which room is the skill I developed through this work. \n\nI carried the same adaptive approach into PI planning. I stopped framing design system capacity as a request and started framing it as a dependency of a transition that was going to happen whether the org prepared for it or not. 'We need two sprints of design system work' is a request that competes with feature delivery. 'When we unlock AI tools — and we will have to — the design system is what determines whether that transition produces velocity or chaos' changes the conversation entirely.",
        },
        {
          heading: "What I learned and what I'd do differently",
          hideImage: true,
          body: "The most useful thing I did in this chapter wasn't a deliverable. It was making visible a problem the organization couldn't see because it was happening in two separate places at once. \n\nThe AI gap was one conversation, happening in security and engineering leadership. The design system gap was a different conversation, happening in UX. Nobody was connecting them. The insight wasn't technical — it was organizational. I saw that the same infrastructure solved both problems, and I built an argument that made that connection legible to the person who could act on it. \n\nThe PI planning experience taught me something equally important: there's a difference between getting a seat at the table and getting what you need from the table. PI planning gave the design system visibility. It didn't give it capacity. The structural constraint — one product controlling shared infrastructure — was too deep for planning processes to override. That's when I stopped trying to win within the existing structure and started designing around it. \n\nThe lesson I'd apply to any infrastructure team: don't make a better case for your infrastructure on its own merits. Find the strategic pressure leadership is already feeling and show them how your infrastructure relieves it. The design system became the answer to a question leadership was starting to ask — 'how do we catch up on AI?' — rather than an initiative competing for attention. \n\nAnd when the structure can't move, build a model that proves the structure should change. The V2 project isn't just a component library. It's evidence that cross-team collaboration on shared infrastructure works — and that the design system shouldn't be owned by a single product team. The strategy chapter is what opens the door. Part 3 is about walking through it.",
        },
      ],
    },
  },
  build: {
    role: "Global Design System Lead",
    timeline: "January 2026 – Present",
    org: "NielsenIQ",
    audioSrc: null,
    overview: {
      summary:
        "I personally built the framework-agnostic proof-of-concepts — the same components generated in Angular, React, Vue, and Lit from structured spec.json files, and am now leading a 6-person cross-functional team to deliver 40+ production-ready components, tokens, themes, and patterns across three parallel workstreams in 14 weeks using AI-assisted development at 2–3x velocity.",
      images: [
        { src: "/meff poc.png", label: "MEFF V2 proof-of-concept" },
        { src: "/dataviscolors.png", label: "Data visualization color system" },
        { src: "/specbuild.png", label: "Spec-driven build process" },
      ],
    },
    learn: {
      sections: [
        {
          heading: "Where parts one and two left off",
          hideImage: true,
          body: "I'd diagnosed a four-year-old systemic problem. I'd built the token architecture. I'd navigated PI planning, designed around the structural bottleneck, framed the AI argument, and secured the CPO's approval and dedicated engineering resources for the first time in the design system's history. \n\nNow I had to prove all of it worked. And more than that — I had to prove that I personally understood AI well enough to lead this work, not just advocate for it. \n\nThis chapter is about what I built with my own hands, what I built with a team, and why both matter for where design systems are going.",
        },
        {
          heading: "Using Claude for deep research",
          body: "Before the V2 build started, I needed to understand something nobody at NIQ had investigated: how do AI tools actually interact with design systems? Not the marketing pitch. The reality. \n\I used Claude as a deep research tool — not for code generation, but for structured inquiry. I explored how LLMs consume component documentation, what makes a token system machine-readable versus just human-readable, how AI code generation tools handle styling when they have structured specs versus when they don't, and what the difference looks like in actual output. \n\nWhat I found was consistent across every tool I tested: when a codebase has well-structured component APIs with clear documentation and semantic tokens, AI tools generate code that uses existing components correctly. When documentation is sparse or absent, the tools invent their own implementations — technically functional, visually inconsistent, and disconnected from whatever design standards exist. The pattern was clear: AI tools are only as good as the structured input they can consume. \n\nThis research wasn't academic. It directly shaped the V2 architecture decisions: why CSS custom properties matter (they're readable by any tool), why semantic naming conventions matter (they encode intent, not just appearance), why component API documentation matters (it's the spec AI builds against), and why we needed to think about AI metadata as a first-class concern rather than an afterthought. \n\nThe research also gave me the language for the CPO conversation. When I showed side-by-side examples of what AI produces with structured design system input versus without it, I wasn't presenting theory. I was presenting findings from real experimentation.",
        },
        {
          heading: "Uncovering how to adapt a design system for an AI-enabled future",
          hideImage: true,
          body: "The deeper I went, the clearer the thesis became: a design system isn't just a component library for humans anymore. It's a structured data layer that AI tools consume to generate consistent product UI. And the design systems that are built with that dual audience in mind — human developers and AI tools — are the ones that will define how products get built in the next era. \n\nThis isn't a small reframe. It changes what a design system needs to contain. Traditional design systems need components, tokens, and documentation. AI-ready design systems also need semantic metadata describing component intent, explicit composition rules, machine-readable specs that define props, variants, and valid combinations, and guidance that distinguishes what AI handles well from what requires human judgment. \n\nI built this understanding through a combination of Claude-assisted research, hands-on experimentation with AI code generation tools, and real-time observation of AI building on our system during the V2 project. Solange, our UX researcher, documented what happened as developers used Claude to restyle components: which prompts worked, where the AI hallucinated, which component patterns it handled well versus poorly. The AI consumption guide she's producing is built from empirical observation during a real production build — not theoretical speculation. \n\nThis body of research is what I brought to every executive conversation, every PI planning session, and every architecture decision. It's the foundation of NIQ's AI strategy for the design system. And it came from my own initiative — nobody asked me to research this. I saw that the industry was moving and the org wasn't keeping up, and I went deep on my own time to build the understanding that the org needed.",
        },
        {
          heading: "Building the framework-agnostic POCs",
          imageSrc: "/meff poc.png",
          imageAlt: "MEFF V2 proof-of-concept",
          imageLink: "https://meff-v2-poc.vercel.app/",
          body: "The research pointed to a specific technical thesis: if the design system's specs are structured correctly, AI can generate correct component implementations in any framework from the same source. Not Angular-only. Not locked to whatever the org happens to use today. Framework-agnostic. \n\nI built the proof-of-concept myself. \n\nThe POC started with component specs — structured documents defining every property, variant, state, accessibility requirement, and composition rule for a component. Not Figma screenshots. Not design briefs. Machine-readable specifications that an AI tool could consume and generate from. \n\nFrom those specs, I used Claude Code to generate the same component in four frameworks: Angular (standalone components with signal-based inputs, OnPush change detection), React (functional components with forwardRef), Vue (Composition API), and Lit (web components with light DOM rendering). Five components, four frameworks, from the same spec files. \n\nThe results validated the thesis. When the spec was sufficiently structured — when it included not just 'what this component looks like' but 'what props it accepts, what variants exist, what accessibility attributes it needs, how it composes with other components' — the AI-generated output was correct across all four frameworks. The visual rendering matched. The API surface was consistent. The accessibility attributes were present. \n\nThis wasn't a demo or a prototype. It was a working architecture that could scale. I built CLAUDE.md generation conventions (framework-specific instruction templates for each target), spec authoring guidelines (a schema reference with field-by-field documentation and complexity tiers), and a spec review workflow (Jira issue templates, PR templates with review checklists, and a communication cadence for the team). \n\nThe framework-agnostic approach matters beyond the immediate NIQ context. It means the design system isn't locked to Angular. When a team needs React or Vue or web components — or when the org eventually migrates frameworks — the same specs generate correct output in the new target. The investment in structured specs compounds instead of being thrown away.",
        },
        {
          heading: "The data visualization POC",
          widget: "dataViz",
          body: "I extended the POC thinking to a domain nobody had tackled yet: data visualization. \n\nNIQ's products are data-heavy. Charts, grids, conditional formatting, and dashboard patterns are everywhere. But data visualization had no design system guidance — no token-driven chart theming, no consistent color palette across chart types, no accessibility patterns for colorblind users, no rules for when to use which chart encoding. \n\nI built a comprehensive interactive POC: an HTML-based demonstration using our actual token values, showing AG Grid tables with conditional formatting and Highcharts-style charts consuming our 28-color categorical palette. The POC included live demos, a full token reference with computed WCAG contrast ratios, human-readable design guidance organized by chart type, and — critically — an AI-consumable spec section with JSON token schemas, chart theme configurations, and machine-readable rules with severity levels and fallback behaviors. \n\nThe transparency exploration was a specific question I investigated: could we introduce alpha variants (10%, 20%, 40%, 60% opacity) of our categorical colors for use as area fills and background treatments? The answer was yes, but with constraints — transparent variants work well for decorative fills where contrast requirements don't apply to the fill itself, but the solid stroke must remain at 100% for any meaningful graphical element. \n\nThis work produced the data visualization token review that became the foundation for Solange, Ilya, and Frank's Sprint 1 tasks — including identifying that alpha stops only covered 8 of 28 colors, that hex values should convert to OKLCH for perceptual uniformity, and that sequential and divergent palettes were entirely missing.",
        },
        {
          heading: "Co-building with the MEFF team",
          imageSrc: "/specbuild.png",
          imageAlt: "Spec-driven build process",
          body: "The V2 build was the execution chapter — and the proof that the strategy and the AI thesis worked in practice. \n\nI assembled and ran a cross-functional team of 9 people with radically different allocations and skill sets — none of whom reported to me. Two MEFF frontend developers at 100% dedication, Ilya at 40% running design QA and producing reskin specs, Sonia at 40% supporting QA, Frank at 80% on accessibility and documentation, Solange at 60% on pattern documentation and AI metadata, Alexey at 10% advising on fork architecture, John as decision maker, and myself at roughly 40% running the project. \n\nGetting each person's commitment required separate conversations with their managers about capacity and expectations. Every allocation was influence, not authority. The project held together because people believed the work mattered and because I'd spent months building the relationships and credibility that made them willing to commit. That distributed team model — coordination through trust rather than org chart — is something I'd argue is actually harder than managing direct reports, and it's the model that cross-product infrastructure work requires. \n\nNo dedicated project manager. No Scrum master. No dedicated QA team. I built the operational infrastructure from scratch: weekly standups, bi-weekly stakeholder updates, monthly demos, Jira board structure with 13 epics mapped to milestones, communication templates, decision log, component QA checklist, AI code review protocol, and contribution process. \n\nThe AI-assisted development model was the core enabler. Claude handled the mechanical SCSS-to-CSS conversion and visual restyling on a component-by-component basis. Developers focused their judgment on review, edge cases, and the higher-complexity work of MEFF integration. Every AI-generated PR required human code review with a 24-hour SLA. AI-assisted PRs were flagged in descriptions so reviewers knew to check edge cases harder. \n\nThis review protocol wasn't just quality assurance. It was protecting the credibility of the approach. The AI argument I'd made to the CPO claimed that structured design infrastructure would make AI-assisted development productive. If V2 shipped with quality problems traceable to AI-generated code, the thesis would be undermined — and with it, the case for continued investment. \n\nThe results: 39 production-ready Angular components, forked from CUIC, restyled to V2 design specs, with the full token architecture implemented as CSS custom properties. An optional Tailwind v4 preset for teams that want utility-class syntax. Sub-brand theming validated in production with MEFF running a distinct visual brand through a single CSS override file. The MEFF product reskinned page by page, P0 pages first, replacing hardcoded styles with V2 components and tokens. \n\nTwo developers produced at 2–3x normal velocity. The dual-track timeline — library build plus product reskin in one quarter — would have been impossible at traditional development speed.",
        },
        {
          heading: "What I'm still building",
          hideImage: true,
          body: "The V2 library is shipped. The co-build model is proven. But the AI story is being written in real time. \n\nI'm continuing to personally build and extend the framework-agnostic system. The spec-driven architecture I proved with the POC is scaling into the production workflow — structured specs as the source of truth, with AI generating implementations against them. The CLAUDE.md conventions I wrote are what the MEFF developers use daily. \n\nThe next phase is making the system fully machine-readable: semantic metadata on every component describing AI-relevant context, an AI consumption guide documenting which patterns AI handles well and which require human intervention, and validated prompt strategies for generating compliant UI. Solange's empirical research from the V2 build — watching AI interact with the system in real time rather than studying it theoretically — is the foundation. \n\nDiscover migration is planned for Q3 2026. Other product teams begin adoption in the same quarter. Data visualization components will build on the V2 architecture. By Q4, the vision is for the design system to be positioned as the structured data layer for AI-assisted product development across the entire portfolio.",
        },
        {
          heading: "What I'm learning and what I'd do differently",
          hideImage: true,
          body: "This chapter is where the story shifts from organizational leadership to personal technical capability — and I think both are necessary to tell. \n\nParts 1 and 2 demonstrate that I can diagnose systemic problems, build strategic arguments, navigate politics, and secure executive sponsorship. Those are the leadership competencies that design system roles require. But Part 3 demonstrates something different: that I personally understand AI deeply enough to build with it, to make architecture decisions informed by real experimentation, and to lead a team through AI-assisted development at production scale. \n\nThe framework-agnostic POC is the work I'm most proud of, because it points forward. Most design system leaders are still thinking about components as framework-specific deliverables. The spec-driven approach — where structured specifications are the source of truth and framework implementations are generated outputs — is a fundamentally different model. It means the investment in the design system compounds across frameworks and across time, rather than being locked to whatever technology the org uses today. \n\nThree things I'd approach differently. I'd establish the Claude prompting conventions and AI review protocol before Sprint 1 rather than refining them during the first sprint. I'd invest more time in the SCSS variable inventory during setup — the quality of the conversion depends on understanding every existing variable before you start. And I'd start pattern documentation earlier, because components ship fast with AI-assisted restyling but the pattern documentation that ties them into a coherent system requires design judgment that can't be automated. \n\nThe bigger reflection is about what this work reveals about the next phase of design systems leadership. The people who will define this field aren't the ones who maintain the best component libraries. They're the ones who understand that design systems are becoming the structured data layer for how products get built — by humans and by AI, together. That's the capability I've built, and it's the one I'm continuing to develop. \n\nI diagnosed the problem. I built the strategy. And then I built the thing. All three matter. But building is what proves you can do the job — not just talk about it.",
        },
      ],
    },
  },
  design: {
    role: "Designer → Design System Lead",
    timeline: "2018 – 2026",
    org: "5 organizations",
    audioSrc: null,
    overview: {
      summary:
        "My broader portfolio proves I can diagnose, strategize, and build at enterprise scale — this proves I've been designing the whole time. A visual companion spanning five organizations and ten years: brand systems built as a one-person creative department, healthcare learning design where clarity is a clinical requirement, editorial design for institutional audiences, and component craft inside an enterprise design system.",
      images: [
        { label: "Madison Ballet Campaign" },
        { label: "Pathway Health Learning Design" },
        { label: "SWIB Newsletter Design" },
        { label: "Enterprise Component Craft" },
      ],
    },
    learn: {
      sections: [
        {
          heading: "The Case for Craft",
          body: "The rest of my portfolio tells the story of what I did at enterprise scale. That work is strategic, organizational, and technical. But design leadership starts with design, and this piece is the evidence that the person building the infrastructure has been practicing the craft across every role I've held.",
        },
        {
          heading: "Across Five Organizations",
          body: "At Madison Ballet, I was the entire creative department — designing the full visual campaign for workshop series' across print, web, and social. At Pathway Health, I designed learning modules where incorrect comprehension has real consequences. At the State of Wisconsin Investment Board, I designed newsletters making dense institutional content legible and worth reading. At NielsenIQ, every token maps to a real design decision inside a real component.",
        },
        {
          heading: "Where It Started",
          body: "My embroidery practice is where the systems instinct lives most visually. Every stitch is a decision about color, direction, density, and texture, and every decision affects the ones around it. A thread pulled too tight distorts the fabric. That's also how a design system works, how a brand works, how a team works. The strategy is how I lead. The craft is why I'm qualified to.",
        },
      ],
    },
    deep: {
      modules: [
        {
          label: "Madison Ballet — Workshop Series",
          body: "I wore every creative hat — graphic designer, marketing specialist, web designer. When the company launched a recurring workshop series, I designed the full visual campaign across print, web, and social, building a flexible system that could accommodate different instructors and dance styles without losing brand recognition. No creative director, minimal brand guidelines, near-zero budget. I was the entire design, brand, and marketing departments.",
        },
        {
          label: "Pathway Health — LMS & Video",
          body: "Healthcare learning design operates under constraints most designers never encounter: the content is dense and high-stakes, incorrect comprehension has real consequences, and the audience ranges from clinical staff with limited screen time to administrative teams. Visual design serves clarity first, engagement second, and aesthetics third — but if it looks like a compliance checkbox, nobody retains anything.",
        },
        {
          label: "NielsenIQ — Component & Interaction Design",
          body: "Inside the design system is actual design work. Every token maps to a real design decision — spacing isn't arbitrary, it's a 4px system with semantic application tokens; color isn't decorative, it's a three-tier semantic hierarchy. I designed a notifications flow accounting for multiple notification types, read and unread states, bulk actions, empty states, and progressive disclosure.",
        },
      ],
    },
  },
};

// ═══════════════════════════════════════════
// ─── SEGMENT TOGGLE ──────────────────────
// ═══════════════════════════════════════════

const DEPTH_OPTIONS = [
  { key: "overview", label: "Overview" },
  { key: "deep", label: "Deep Dive" },
];

function SegmentToggle({ value, onChange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: 3,
        gap: 2,
      }}
    >
      {DEPTH_OPTIONS.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: active ? C.card : "transparent",
              color: active ? C.text : C.textLight,
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── CASE STUDY PAGE ─────────────────────
// ═══════════════════════════════════════════

function ArtifactModal({ artifact, onClose }) {
  const hasMedia = artifact.image || artifact.images || artifact.video || artifact.url || artifact.pdf;
  if (!hasMedia) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 40,
        cursor: "pointer",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 900,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        {artifact.video && (
          <div style={{ borderRadius: 8, overflow: "hidden" }}>{artifact.video}</div>
        )}
        {artifact.image && (
          <div style={{ borderRadius: 8, overflow: "hidden" }}>
            {React.cloneElement(artifact.image, { style: { width: "100%", height: "auto", display: "block" } })}
          </div>
        )}
        {artifact.images && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {artifact.images.map((img, i) => (
              <div key={i} style={{ borderRadius: 8, overflow: "hidden" }}>
                {React.cloneElement(img, { style: { width: "100%", height: "auto", display: "block" } })}
              </div>
            ))}
          </div>
        )}
        {artifact.url && (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <a
              href={artifact.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: 16,
                color: "#fff",
                fontWeight: 600,
                padding: "14px 32px",
                borderRadius: 10,
                border: "2px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.1)",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Open in new tab {"→"}
            </a>
          </div>
        )}
        {artifact.pdf && (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            {artifact.pdf}
          </div>
        )}
      </div>
    </div>
  );
}

function ArtifactCard({ artifact }) {
  const [open, setOpen] = useState(false);
  const hasMedia = artifact.image || artifact.images || artifact.video || artifact.url || artifact.pdf;

  const isLinkOnly = artifact.url && !artifact.image && !artifact.images && !artifact.video;

  const handleClick = () => {
    if (isLinkOnly) {
      window.open(artifact.url, "_blank", "noopener,noreferrer");
    } else if (hasMedia) {
      setOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 20,
          cursor: hasMedia ? "pointer" : "default",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (hasMedia) {
            e.currentTarget.style.borderColor = C.accent;
            e.currentTarget.style.background = C.card;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = C.border;
          e.currentTarget.style.background = C.bg;
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>
          {artifact.title}
        </div>
        <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5 }}>
          {artifact.description}
        </div>
        {hasMedia && (
          <div style={{ fontSize: 12, color: C.accent, marginTop: 8, fontWeight: 500 }}>
            {isLinkOnly ? "Open link" : "Click to view"} {"→"}
          </div>
        )}
      </div>
      {open && <ArtifactModal artifact={artifact} onClose={() => setOpen(false)} />}
    </>
  );
}

// ═══════════════════════════════════════════
// ─── TOKEN EXPLORER ──────────────────────
// ═══════════════════════════════════════════

const TOKEN_CATEGORIES = ["Color", "Typography", "Spacing", "Radius", "Elevation"];

function TokenExplorer() {
  const [view, setView] = useState("before");
  const [category, setCategory] = useState("Color");

  const beforeColor = {
    primitives: [
      { name: "Neutral Tokens", swatches: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575", "#616161", "#424242", "#212121", "#000000"] },
      { name: "Blue Tokens", swatches: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1565C0", "#0D47A1"] },
      { name: "Brand Tokens", swatches: ["#1A237E", "#283593", "#3949AB"] },
      { name: "Error Red Tokens", swatches: ["#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935"] },
      { name: "Status Color Tokens", swatches: ["#4CAF50", "#F44336", "#2196F3", "#FF9800", "#9E9E9E"] },
      { name: "Success Green Tokens", swatches: ["#C8E6C9", "#81C784", "#4CAF50", "#388E3C"] },
      { name: "Warning Yellow Tokens", swatches: ["#FFF9C4", "#FFF176", "#FFEE58", "#FDD835"] },
      { name: "Active Blue Tokens", swatches: ["#BBDEFB", "#64B5F6", "#2196F3", "#1565C0"] },
    ],
    semantic: [
      { name: "Background Tokens", count: 47 },
      { name: "Border Tokens", count: 22 },
      { name: "Text Tokens", count: 19 },
      { name: "Icon Tokens", count: 16 },
      { name: "Chip Tokens", count: 6 },
      { name: "Scroll Tokens", count: 4 },
      { name: "Link Tokens", count: 8 },
      { name: "Spinner Tokens", count: 5 },
    ],
  };

  const afterColor = {
    primitives: [
      { name: "Neutral", swatches: ["#FFFFFF", "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD", "#6C757D", "#495057", "#343A40", "#212529", "#000000"] },
      { name: "Blue", swatches: ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A"] },
      { name: "Green", swatches: ["#F0FDF4", "#DCFCE7", "#BBF7D0", "#86EFAC", "#4ADE80", "#22C55E", "#16A34A", "#15803D", "#166534", "#14532D"] },
      { name: "Red", swatches: ["#FEF2F2", "#FEE2E2", "#FECACA", "#FCA5A5", "#F87171", "#EF4444", "#DC2626", "#B91C1C", "#991B1B", "#7F1D1D"] },
      { name: "Yellow", swatches: ["#FEFCE8", "#FEF9C3", "#FEF08A", "#FDE047", "#FACC15", "#EAB308", "#CA8A04", "#A16207", "#854D0E", "#713F12"] },
      { name: "Purple", swatches: ["#FAF5FF", "#F3E8FF", "#E9D5FF", "#D8B4FE", "#C084FC", "#A855F7", "#9333EA", "#7E22CE", "#6B21A8", "#581C87"] },
    ],
    semantic: [
      { name: "Surface", tokens: ["surface.primary", "surface.secondary", "surface.tertiary"], desc: "Background layers" },
      { name: "Text", tokens: ["text.neutral", "text.interactive", "text.positive", "text.attention", "text.negative"], desc: "Text by intent" },
      { name: "Fill", tokens: ["fill.neutral", "fill.interactive", "fill.positive", "fill.attention", "fill.negative"], desc: "Component fills" },
      { name: "Stroke", tokens: ["stroke.neutral", "stroke.interactive", "stroke.positive", "stroke.attention", "stroke.negative"], desc: "Borders by intent" },
    ],
  };

  const afterTypography = [
    { role: "Heading", sizes: [{ name: "3xl", token: "heading-3xlarge", example: "48px / 700" }, { name: "2xl", token: "heading-2xlarge", example: "36px / 700" }, { name: "xl", token: "heading-xlarge", example: "28px / 700" }, { name: "large", token: "heading-large", example: "24px / 700" }, { name: "medium", token: "heading-medium", example: "20px / 600" }, { name: "small", token: "heading-small", example: "16px / 600" }] },
    { role: "Body", sizes: [{ name: "large", token: "body-large", example: "18px / 400" }, { name: "medium", token: "body-medium", example: "16px / 400" }, { name: "small", token: "body-small", example: "14px / 400" }] },
    { role: "Datastic", sizes: [{ name: "2xl", token: "datastic-2xlarge", example: "36px / mono" }, { name: "xl", token: "datastic-xlarge", example: "28px / mono" }, { name: "large", token: "datastic-large", example: "24px / mono" }, { name: "medium", token: "datastic-medium", example: "16px / mono" }, { name: "small", token: "datastic-small", example: "12px / mono" }] },
  ];

  const afterSpacing = [
    { token: "spacing-0", value: "0px", width: 0 },
    { token: "spacing-25", value: "1px", width: 1 },
    { token: "spacing-50", value: "2px", width: 2 },
    { token: "spacing-100", value: "4px", width: 4 },
    { token: "spacing-150", value: "6px", width: 6 },
    { token: "spacing-200", value: "8px", width: 8 },
    { token: "spacing-300", value: "12px", width: 12 },
    { token: "spacing-400", value: "16px", width: 16 },
    { token: "spacing-500", value: "20px", width: 20 },
    { token: "spacing-600", value: "24px", width: 24 },
    { token: "spacing-800", value: "32px", width: 32 },
    { token: "spacing-1000", value: "40px", width: 40 },
    { token: "spacing-1200", value: "48px", width: 48 },
    { token: "spacing-1600", value: "64px", width: 64 },
  ];

  const afterRadius = [
    { token: "radius-drop", value: "0px", radius: 0 },
    { token: "radius-sharp", value: "2px", radius: 2 },
    { token: "radius-standard", value: "4px", radius: 4 },
    { token: "radius-soft", value: "8px", radius: 8 },
    { token: "radius-softer", value: "16px", radius: 16 },
    { token: "radius-softest", value: "32px", radius: 32 },
    { token: "radius-round", value: "100%", radius: "50%" },
  ];

  const afterElevation = {
    drop: [
      { token: "drop-shadow-0", value: "none", shadow: "none" },
      { token: "drop-shadow-100", value: "0px 1px 0px 0px rgba(0,0,0,0.06)", shadow: "0px 1px 0px 0px rgba(0,0,0,0.06)" },
      { token: "drop-shadow-200", value: "0px 3px 1px -1px rgba(0,0,0,0.06)", shadow: "0px 3px 1px -1px rgba(0,0,0,0.06)" },
      { token: "drop-shadow-300", value: "0px 4px 6px -2px rgba(0,0,0,0.20)", shadow: "0px 4px 6px -2px rgba(0,0,0,0.20)" },
      { token: "drop-shadow-400", value: "0px 8px 16px -4px rgba(0,0,0,0.22)", shadow: "0px 8px 16px -4px rgba(0,0,0,0.22)" },
      { token: "drop-shadow-500", value: "0px 12px 20px 0.8px rgba(0,0,0,0.28)", shadow: "0px 12px 20px 0.8px rgba(0,0,0,0.28)" },
    ],
    inner: [
      { token: "inner-shadow-0", value: "none", shadow: "none" },
      { token: "inner-shadow-100", value: "inset 0px 1px 0px 0px rgba(0,0,0,0.06)", shadow: "inset 0px 1px 0px 0px rgba(0,0,0,0.06)" },
      { token: "inner-shadow-200", value: "inset 0px 3px 1px -1px rgba(0,0,0,0.06)", shadow: "inset 0px 3px 1px -1px rgba(0,0,0,0.06)" },
      { token: "inner-shadow-300", value: "inset 0px 4px 6px -2px rgba(0,0,0,0.20)", shadow: "inset 0px 4px 6px -2px rgba(0,0,0,0.20)" },
      { token: "inner-shadow-400", value: "inset 0px 8px 16px -4px rgba(0,0,0,0.22)", shadow: "inset 0px 8px 16px -4px rgba(0,0,0,0.22)" },
      { token: "inner-shadow-500", value: "inset 0px 12px 20px 0.8px rgba(0,0,0,0.28)", shadow: "inset 0px 12px 20px 0.8px rgba(0,0,0,0.28)" },
    ],
  };

  const tabStyle = (active) => ({
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    background: active ? C.text : "transparent",
    color: active ? "#fff" : C.textLight,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const emptyState = (name) => (
    <div style={{ padding: "48px 24px", textAlign: "center", color: C.textLight }}>
      <span className="material-icons-outlined" style={{ fontSize: 36, display: "block", marginBottom: 8, color: C.border }}>block</span>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4, color: C.textMid }}>No {name.toLowerCase()} tokens existed</div>
      <div style={{ fontSize: 13 }}>The legacy system had no shared {name.toLowerCase()} definitions. Each product team hardcoded their own values.</div>
    </div>
  );

  const renderBeforeColor = () => (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Primitive Tokens — flat, hue-based</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {beforeColor.primitives.map((group) => (
          <div key={group.name} style={{ background: C.bg, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid, marginBottom: 6 }}>{group.name}</div>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {group.swatches.map((c, i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: 4, background: c, border: "1px solid rgba(0,0,0,0.08)" }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Semantic Tokens — component-tied, sprawling</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {beforeColor.semantic.map((group) => (
          <div key={group.name} style={{ background: C.bg, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid }}>{group.name}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{group.count}</div>
            <div style={{ fontSize: 10, color: C.textLight }}>flat tokens</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAfterColor = () => (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Primitive Layer — algorithmic scales by hue</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
        {afterColor.primitives.map((group) => (
          <div key={group.name} style={{ background: C.bg, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid, marginBottom: 6 }}>{group.name}</div>
            <div style={{ display: "flex", gap: 2 }}>
              {group.swatches.map((c, i) => (
                <div key={i} style={{ flex: 1, height: 20, background: c, borderRadius: i === 0 ? "4px 0 0 4px" : i === group.swatches.length - 1 ? "0 4px 4px 0" : 0, border: "1px solid rgba(0,0,0,0.05)" }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Semantic Layer — intent-based</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {afterColor.semantic.map((group) => (
          <div key={group.name} style={{ background: C.bg, borderRadius: 8, padding: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{group.name}</div>
            <div style={{ fontSize: 11, color: C.textLight, marginBottom: 8 }}>{group.desc}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {group.tokens.map((t) => (
                <div key={t} style={{ fontSize: 11, fontFamily: "monospace", color: C.textMid, background: C.card, padding: "3px 6px", borderRadius: 4, border: `1px solid ${C.border}` }}>{t}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAfterTypography = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {afterTypography.map((group) => (
        <div key={group.role}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{group.role}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {group.sizes.map((s) => (
              <div key={s.name} style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "6px 10px", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: C.accent, minWidth: 130 }}>{s.token}</div>
                <div style={{ fontSize: 12, color: C.textLight }}>{s.example}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAfterSpacing = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {afterSpacing.map((s) => (
        <div key={s.token} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 10px", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", color: C.accent, minWidth: 110 }}>{s.token}</div>
          <div style={{ flex: 1, height: 14, display: "flex", alignItems: "center" }}>
            <div style={{ width: Math.max(2, s.width * 3), height: 14, background: C.accent, borderRadius: 3, transition: "width 0.3s ease" }} />
          </div>
          <div style={{ fontSize: 11, color: C.textLight, minWidth: 32, textAlign: "right" }}>{s.value}</div>
        </div>
      ))}
    </div>
  );

  const renderAfterRadius = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {afterRadius.map((r) => (
        <div key={r.token} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 12px", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
          <div style={{ width: 44, height: 44, background: C.accent, borderRadius: r.radius, flexShrink: 0, transition: "border-radius 0.3s ease" }} />
          <div style={{ fontSize: 11, fontFamily: "monospace", color: C.accent, minWidth: 120 }}>{r.token}</div>
          <div style={{ fontSize: 12, color: C.textLight }}>{r.value}</div>
        </div>
      ))}
    </div>
  );

  const renderShadowGroup = (label, items) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((e) => (
          <div key={e.token} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 12px", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
            <div style={{ width: 44, height: 44, background: C.card, borderRadius: 8, flexShrink: 0, boxShadow: e.shadow, border: `1px solid ${C.border}` }} />
            <div style={{ fontSize: 11, fontFamily: "monospace", color: C.accent, minWidth: 130 }}>{e.token}</div>
            <div style={{ fontSize: 11, color: C.textLight, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAfterElevation = () => (
    <div>
      {renderShadowGroup("Drop Shadow", afterElevation.drop)}
      {renderShadowGroup("Inner Shadow", afterElevation.inner)}
    </div>
  );

  const renderContent = () => {
    if (view === "before") {
      return category === "Color" ? renderBeforeColor() : emptyState(category);
    }
    switch (category) {
      case "Color": return renderAfterColor();
      case "Typography": return renderAfterTypography();
      case "Spacing": return renderAfterSpacing();
      case "Radius": return renderAfterRadius();
      case "Elevation": return renderAfterElevation();
      default: return null;
    }
  };

  return (
    <div style={{ margin: "24px 0 40px 0", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", background: C.card }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        {/* Before / After toggle */}
        <div style={{ display: "inline-flex", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 2, gap: 2 }}>
          {["before", "after"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                border: "none",
                background: view === v ? (v === "before" ? "#FEE2E2" : "#DCFCE7") : "transparent",
                color: view === v ? (v === "before" ? "#991B1B" : "#166534") : C.textLight,
                fontSize: 13,
                fontWeight: view === v ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {v === "before" ? "Before" : "After"}
            </button>
          ))}
        </div>
        {/* Category tabs */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {TOKEN_CATEGORIES.map((cat) => {
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={tabStyle(category === cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
      {/* Content */}
      <div style={{ padding: 20, maxHeight: 480, overflow: "auto" }}>
        {renderContent()}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── DATA VIZ WIDGET ─────────────────────
// ═══════════════════════════════════════════

const DATAVIZ_TABS = ["Color System", "Chart Patterns", "Coverage"];

const CAT_COLORS = [
  { name: "cat-1", hex: "#3B82F6" },
  { name: "cat-2", hex: "#10B981" },
  { name: "cat-3", hex: "#F59E0B" },
  { name: "cat-4", hex: "#EF4444" },
  { name: "cat-5", hex: "#8B5CF6" },
  { name: "cat-6", hex: "#EC4899" },
  { name: "cat-7", hex: "#06B6D4" },
  { name: "cat-8", hex: "#F97316" },
];

const OPACITY_LEVELS = [
  { label: "100%", alpha: 1, use: "Data encoding" },
  { label: "60%", alpha: 0.6, use: "Supporting series" },
  { label: "40%", alpha: 0.4, use: "Contextual overlays" },
  { label: "20%", alpha: 0.2, use: "Area fills" },
  { label: "10%", alpha: 0.1, use: "Ambient backgrounds" },
];

// ═══════════════════════════════════════════
// ─── PROJECT BOARD WIDGET ────────────────
// ═══════════════════════════════════════════

const TASK_TYPES = {
  library: { label: "Library Build", color: "#DBEAFE" },
  ai: { label: "AI Generation", color: "#C7D2FE" },
  design: { label: "UX / Design", color: "#FECDD3" },
  tokens: { label: "Tokens / Theming", color: "#FED7AA" },
  process: { label: "Process / Ops", color: "#FEF08A" },
  patterns: { label: "Patterns / Style", color: "#BBF7D0" },
  qa: { label: "QA / Validation", color: "#A7F3D0" },
  docs: { label: "Docs / Match", color: "#99F6E4" },
  advisory: { label: "Advisory", color: "#E5E7EB" },
  release: { label: "Release", color: "#1E1B2E", textColor: "#fff" },
};

const BOARD_DATA = {
  process: [
    "Design spec review",
    "CLAUDE.md generation",
    "Component generation",
    "Code review",
    "QA validation",
    "Pattern documentation",
    "Release",
  ],
  swimlanes: [
    {
      name: "V2 Library",
      sprints: [
        {
          label: "Sprint 1",
          tasks: [
            { text: "Document specs, setup generation pipeline", type: "process" },
            { text: "CLAUDE.md generation conventions", type: "ai" },
            { text: "Spec review: Button, Input, Badge, Tooltip", type: "design" },
            { text: "Create DS token system in Figma", type: "tokens" },
            { text: "Formalize spec authoring guidelines", type: "process" },
            { text: "Establish spec review PR templates", type: "process" },
          ],
        },
        {
          label: "Sprint 2",
          tasks: [
            { text: "Set up framework-agnostic generation model", type: "ai" },
            { text: "Build spec-to-CSS custom property pipeline", type: "ai" },
            { text: "Generate spec files for batch 1 components", type: "library" },
            { text: "Adaptive generation: React + Vue targets", type: "ai" },
            { text: "Code reviews (Batch 1/2)", type: "qa" },
          ],
        },
        {
          label: "Sprint 3",
          tasks: [
            { text: "Process topic structures via CLAUDE.md", type: "ai" },
            { text: "Responsiveness validation", type: "qa" },
            { text: "Generate spec files for batch 2 components", type: "library" },
            { text: "Publish specs as V2 CSS tokens", type: "tokens" },
          ],
        },
        {
          label: "Sprint 4",
          tasks: [
            { text: "Spec refinement + pattern alignment", type: "patterns" },
            { text: "Component-to-token validation review", type: "qa" },
            { text: "Publish specs V2 Batch 2", type: "library" },
          ],
        },
        {
          label: "Sprint 5",
          tasks: [
            { text: "Full spec audit MEFF + V2 libs", type: "qa" },
            { text: "Fix spec gaps from full-stack validation", type: "library" },
            { text: "Create audit: spec-to-code adherence review", type: "qa" },
          ],
        },
        {
          label: "Sprint 6",
          tasks: [
            { text: "Retrospective + next phase planning", type: "process" },
            { text: "Publish V2 specs (V2.0 final)", type: "release" },
          ],
        },
      ],
    },
    {
      name: "Data Viz",
      sprints: [
        {
          label: "Sprint 1",
          tasks: [
            { text: "Align identity, alpha stops, color palette generation", type: "tokens" },
            { text: "Review POC data viz token/OKLCH values", type: "design" },
          ],
        },
        {
          label: "Sprint 2",
          tasks: [
            { text: "Finalize full palette + chart type inventory", type: "tokens" },
            { text: "Highcharts base theme config/SCSS vars", type: "library" },
          ],
        },
        {
          label: "Sprint 3",
          tasks: [
            { text: "Validate Highcharts + AG Grid theme against real product data", type: "qa" },
            { text: "Chart pattern guidelines: bar, line, area, donut", type: "patterns" },
          ],
        },
        {
          label: "Sprint 4",
          tasks: [
            { text: "AG metadata: chart config, map token types + configs", type: "library" },
            { text: "AG validation: AG Grid theme refinements from test", type: "qa" },
          ],
        },
        {
          label: "Sprint 5",
          tasks: [
            { text: "Cross-product validation: test configs from metadata", type: "qa" },
            { text: "Data viz documentation: AI-first design patterns", type: "docs" },
          ],
        },
        {
          label: "Sprint 6",
          tasks: [
            { text: "Final validation: AI token configs from metadata", type: "qa" },
            { text: "Data viz unified + AG Grid token documentation publish", type: "release" },
          ],
        },
      ],
    },
  ],
};

function ProjectBoardWidget() {
  const [activeSprint, setActiveSprint] = useState(0);

  return (
    <div style={{ margin: "24px 0 40px 0", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", background: C.card }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>V2 Project Board</div>
        {/* Sprint selector */}
        <div style={{ display: "flex", gap: 4 }}>
          {BOARD_DATA.swimlanes[0].sprints.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSprint(i)}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "none",
                background: activeSprint === i ? C.text : "transparent",
                color: activeSprint === i ? "#fff" : C.textLight,
                fontSize: 12,
                fontWeight: activeSprint === i ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              S{i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Process pipeline */}
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Process for every component</div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {BOARD_DATA.process.map((step, i) => (
            <React.Fragment key={step}>
              <div style={{ padding: "4px 10px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, fontSize: 10, color: C.textMid, fontWeight: 500, whiteSpace: "nowrap" }}>{step}</div>
              {i < BOARD_DATA.process.length - 1 && <span style={{ color: C.border, fontSize: 10 }}>{"→"}</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Swimlanes */}
      <div style={{ padding: 20 }}>
        {BOARD_DATA.swimlanes.map((lane) => {
          const sprint = lane.sprints[activeSprint];
          return (
            <div key={lane.name} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 16, borderRadius: 2, background: lane.name === "V2 Library" ? C.accent : C.warm }} />
                {lane.name}
                <span style={{ fontSize: 11, fontWeight: 400, color: C.textLight }}>— {sprint.label}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                {sprint.tasks.map((task, i) => {
                  const type = TASK_TYPES[task.type];
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        background: type.color,
                        color: type.textColor || C.text,
                        fontSize: 12,
                        lineHeight: 1.4,
                        border: `1px solid rgba(0,0,0,0.06)`,
                      }}
                    >
                      {task.text}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Task Types</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.values(TASK_TYPES).map((type) => (
              <div key={type.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: type.color, border: "1px solid rgba(0,0,0,0.08)" }} />
                <span style={{ fontSize: 10, color: C.textLight }}>{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataVizWidget() {
  const [tab, setTab] = useState("Color System");

  const tabStyle = (active) => ({
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    background: active ? C.text : "transparent",
    color: active ? "#fff" : C.textLight,
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const renderColorSystem = () => (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
        Categorical Palette — 8 colors across 5 transparency tiers
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "6px 8px", color: C.textLight, fontWeight: 500, borderBottom: `1px solid ${C.border}` }}>Opacity</th>
              {CAT_COLORS.map((c) => (
                <th key={c.name} style={{ textAlign: "center", padding: "6px 4px", color: C.textLight, fontWeight: 500, borderBottom: `1px solid ${C.border}`, fontSize: 10 }}>{c.name}</th>
              ))}
              <th style={{ textAlign: "left", padding: "6px 8px", color: C.textLight, fontWeight: 500, borderBottom: `1px solid ${C.border}` }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {OPACITY_LEVELS.map((level) => (
              <tr key={level.label}>
                <td style={{ padding: "8px 8px", fontWeight: 600, color: C.textMid, borderBottom: `1px solid ${C.border}` }}>{level.label}</td>
                {CAT_COLORS.map((c) => {
                  const r = parseInt(c.hex.slice(1, 3), 16);
                  const g = parseInt(c.hex.slice(3, 5), 16);
                  const b = parseInt(c.hex.slice(5, 7), 16);
                  return (
                    <td key={c.name} style={{ padding: "4px", borderBottom: `1px solid ${C.border}` }}>
                      <div style={{
                        width: "100%",
                        height: 28,
                        borderRadius: 4,
                        background: `rgba(${r},${g},${b},${level.alpha})`,
                        border: level.alpha < 0.3 ? `1px solid ${C.border}` : "none",
                      }} />
                    </td>
                  );
                })}
                <td style={{ padding: "8px 8px", fontSize: 11, color: C.textLight, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{level.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const barData = [
    { label: "Q1", values: [65, 45, 30, 50] },
    { label: "Q2", values: [80, 55, 40, 35] },
    { label: "Q3", values: [50, 70, 55, 60] },
    { label: "Q4", values: [90, 60, 45, 75] },
  ];

  const donutSegments = [
    { pct: 28, color: CAT_COLORS[0].hex },
    { pct: 22, color: CAT_COLORS[1].hex },
    { pct: 18, color: CAT_COLORS[2].hex },
    { pct: 14, color: CAT_COLORS[3].hex },
    { pct: 10, color: CAT_COLORS[4].hex },
    { pct: 8, color: CAT_COLORS[5].hex },
  ];

  const renderChartPatterns = () => {
    let donutOffset = 0;
    const donutArcs = donutSegments.map((seg) => {
      const start = donutOffset;
      donutOffset += seg.pct;
      return { ...seg, start };
    });

    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Grouped Bar */}
        <div style={{ background: C.bg, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMid, marginBottom: 12 }}>Grouped Bar Chart</div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 120 }}>
            {barData.map((group) => (
              <div key={group.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 100 }}>
                  {group.values.map((v, i) => (
                    <div key={i} style={{ width: 8, height: v, background: CAT_COLORS[i].hex, borderRadius: "2px 2px 0 0", transition: "height 0.3s ease" }} />
                  ))}
                </div>
                <div style={{ fontSize: 10, color: C.textLight }}>{group.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut */}
        <div style={{ background: C.bg, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMid, marginBottom: 12 }}>Donut Chart</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              {donutArcs.map((arc, i) => {
                const circumference = Math.PI * 80;
                const dashLength = (arc.pct / 100) * circumference;
                const dashOffset = -((arc.start / 100) * circumference);
                return (
                  <circle
                    key={i}
                    cx="60" cy="60" r="40"
                    fill="none"
                    stroke={arc.color}
                    strokeWidth="16"
                    strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 60 60)"
                  />
                );
              })}
              <circle cx="60" cy="60" r="28" fill={C.bg} />
            </svg>
          </div>
        </div>

        {/* Stacked Bar */}
        <div style={{ background: C.bg, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMid, marginBottom: 12 }}>Stacked Horizontal Bar</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["APAC", "EMEA", "LATAM", "NAM", "Global"].map((region, ri) => (
              <div key={region}>
                <div style={{ fontSize: 10, color: C.textLight, marginBottom: 2 }}>{region}</div>
                <div style={{ display: "flex", height: 16, borderRadius: 4, overflow: "hidden" }}>
                  {[35, 25, 20, 12, 8].map((w, i) => (
                    <div key={i} style={{ width: `${w + (ri * 3 - i * 2) % 10}%`, background: CAT_COLORS[i].hex, minWidth: 4 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div style={{ background: C.bg, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMid, marginBottom: 12 }}>Multi-Series Line Chart</div>
          <svg width="100%" height="100" viewBox="0 0 200 100" preserveAspectRatio="none">
            {[
              { points: "0,70 40,55 80,60 120,35 160,40 200,20", color: CAT_COLORS[0].hex },
              { points: "0,80 40,75 80,50 120,55 160,30 200,45", color: CAT_COLORS[1].hex },
              { points: "0,60 40,65 80,70 120,50 160,55 200,35", color: CAT_COLORS[2].hex },
              { points: "0,90 40,85 80,75 120,70 160,60 200,55", color: CAT_COLORS[3].hex },
            ].map((line, i) => (
              <polyline
                key={i}
                points={line.points}
                fill="none"
                stroke={line.color}
                strokeWidth="2"
                strokeDasharray={i === 3 ? "4 3" : "none"}
              />
            ))}
          </svg>
        </div>
      </div>
    );
  };

  const renderCoverage = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { title: "Color System", desc: "OKLCH categorical palette, sequential scales, diverging gradients, semantic status colors", icon: "palette" },
          { title: "Highcharts Theme", desc: "Chart backgrounds, axes, tooltips, series colors, legends, responsive behavior", icon: "bar_chart" },
          { title: "ag-Grid Theme", desc: "Row styling, headers, cells, conditional formatting, interactive states", icon: "grid_on" },
        ].map((d) => (
          <div key={d.title} style={{ background: C.bg, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
            <span className="material-icons-outlined" style={{ fontSize: 22, color: C.accent, display: "block", marginBottom: 8 }}>{d.icon}</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{d.title}</div>
            <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.5 }}>{d.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Implementation Coverage</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { feature: "Categorical palette (28 colors)", phase: "Sprint 1", status: "complete" },
          { feature: "Alpha transparency variants", phase: "Sprint 1", status: "complete" },
          { feature: "Sequential & diverging scales", phase: "Sprint 2", status: "complete" },
          { feature: "OKLCH perceptual uniformity", phase: "Sprint 2", status: "complete" },
          { feature: "Highcharts theme config", phase: "Sprint 2", status: "in-progress" },
          { feature: "ag-Grid token integration", phase: "Sprint 3", status: "in-progress" },
          { feature: "Accessibility (colorblind patterns)", phase: "Sprint 3", status: "planned" },
          { feature: "Dashboard component patterns", phase: "Sprint 3", status: "planned" },
        ].map((row) => (
          <div key={row.feature} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
            <span className="material-icons" style={{
              fontSize: 16,
              color: row.status === "complete" ? C.success : row.status === "in-progress" ? C.warm : C.textLight,
            }}>
              {row.status === "complete" ? "check_circle" : row.status === "in-progress" ? "pending" : "radio_button_unchecked"}
            </span>
            <div style={{ flex: 1, fontSize: 13, color: C.textMid }}>{row.feature}</div>
            <div style={{ fontSize: 11, color: C.textLight, fontWeight: 500 }}>{row.phase}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ margin: "24px 0 40px 0", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", background: C.card }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginRight: 8 }}>Data Visualization</div>
        <div style={{ display: "flex", gap: 4 }}>
          {DATAVIZ_TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: 20, maxHeight: 520, overflow: "auto" }}>
        {tab === "Color System" && renderColorSystem()}
        {tab === "Chart Patterns" && renderChartPatterns()}
        {tab === "Coverage" && renderCoverage()}
      </div>
    </div>
  );
}

function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const formatTime = (s) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => { setPlaying(false); setProgress(0); setCurrentTime(0); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const seek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = pct * audioRef.current.duration;
    }
  };

  if (!src) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 10,
          background: C.bg,
          border: `1px solid ${C.border}`,
          color: C.textLight,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <span className="material-icons-outlined" style={{ fontSize: 18 }}>headphones</span>
        Audio coming soon
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        borderRadius: 10,
        background: C.bg,
        border: `1px solid ${C.border}`,
        minWidth: 220,
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={toggle}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "none",
          background: C.accent,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = C.accentDark)}
        onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
      >
        <span className="material-icons" style={{ fontSize: 18 }}>
          {playing ? "pause" : "play_arrow"}
        </span>
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          onClick={seek}
          style={{
            height: 4,
            borderRadius: 2,
            background: C.border,
            cursor: "pointer",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              background: C.accent,
              width: `${progress}%`,
              transition: "width 0.1s linear",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          <span style={{ fontSize: 11, color: C.textLight }}>{formatTime(currentTime)}</span>
          <span style={{ fontSize: 11, color: C.textLight }}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

function OverviewCarousel({ images }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0 || expanded) return;
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images, expanded]);

  if (!images || images.length === 0) return null;

  return (
    <div>
      <div
        onClick={() => images[active].src && setExpanded(true)}
        style={{
          borderRadius: 12,
          background: C.bg,
          border: `1px solid ${C.border}`,
          overflow: "hidden",
          cursor: images[active].src ? "pointer" : "default",
        }}
      >
        {images[active].src ? (
          <img
            src={images[active].src}
            alt={images[active].label}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        ) : (
          <div style={{ textAlign: "center", padding: 48 }}>
            <span
              className="material-icons-outlined"
              style={{ fontSize: 48, color: C.border, display: "block", marginBottom: 8 }}
            >
              image
            </span>
            <div style={{ fontSize: 14, color: C.textLight, fontWeight: 500 }}>
              {images[active].label}
            </div>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                borderRadius: 100,
                border: "none",
                background: i === active ? C.accent : C.border,
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 40,
            cursor: "pointer",
          }}
        >
          <img
            src={images[active].src}
            alt={images[active].label}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 8,
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
}

function CaseStudyPage({ slug, onBack }) {
  const [depth, setDepth] = useState("overview");
  const [visible, setVisible] = useState(false);
  const project = PROJECTS[slug];
  const detail = CASE_STUDY_DETAIL[slug];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Reset to top when depth changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [depth]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: `1px solid ${C.border}`,
          padding: "16px 24px",
          background: C.card,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              color: C.textMid,
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              padding: 0,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textMid)}
          >
            {"←"} Back to Portfolio
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        {/* Series & Title */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: C.textLight,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 8,
          }}
        >
          {project.series}
        </div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: C.text,
            margin: "0 0 16px 0",
            lineHeight: 1.15,
          }}
        >
          {project.title}
        </h1>

        {/* Meta */}
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 14,
            color: C.textMid,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <span>{detail.role}</span>
          <span>{detail.org}</span>
          <span>{detail.timeline}</span>
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "4px 12px",
                borderRadius: 10,
                background: C.warmSoft,
                color: "#92400E",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Segment Toggle + Listen */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SegmentToggle value={depth} onChange={setDepth} />
          <AudioPlayer src={detail.audioSrc} />
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 40 }}>
          {/* ─── OVERVIEW ─── */}
          {depth === "overview" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 2fr",
                gap: 32,
                alignItems: "start",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 17,
                    color: C.text,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {detail.overview.summary}
                </p>
              </div>
              <div>
                <OverviewCarousel images={detail.overview.images} />
                <p style={{ fontSize: 13, color: C.textLight, textAlign: "center", marginTop: 16 }}>
                  Want more detail? Switch to deep dive above.
                </p>
              </div>
            </div>
          )}

          {/* ─── DEEP DIVE ─── */}
          {depth === "deep" && (
            <div>
              {detail.learn.sections.map((section, idx) => (
                <React.Fragment key={section.heading}>
                  <div style={{ marginBottom: 16 }}>
                    <h2
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: C.text,
                        margin: "0 0 12px 0",
                      }}
                    >
                      {section.heading}
                    </h2>
                    {section.body.split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        style={{
                          fontSize: 15,
                          color: C.textMid,
                          lineHeight: 1.7,
                          margin: i === 0 ? 0 : "12px 0 0 0",
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                  {section.widget === "tokenExplorer" && <TokenExplorer />}
                  {section.widget === "dataViz" && <DataVizWidget />}
                  {section.widget === "projectBoard" && <ProjectBoardWidget />}
                  {!section.hideImage && !section.widget && (
                    section.embed ? (
                      <div
                        style={{
                          margin: "24px 0 40px 0",
                          aspectRatio: "16 / 9",
                          borderRadius: 12,
                          overflow: "hidden",
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        <iframe
                          src={section.embed}
                          style={{ width: "100%", height: "100%", border: "none" }}
                          allowFullScreen
                        />
                      </div>
                    ) : section.imageSrc ? (
                      <div style={{ margin: "24px 0 40px 0" }}>
                        <div
                          style={{
                            borderRadius: 12,
                            overflow: "hidden",
                            border: `1px solid ${C.border}`,
                          }}
                        >
                          <img
                            src={section.imageSrc}
                            alt={section.imageAlt || ""}
                            style={{ width: "100%", height: "auto", display: "block" }}
                          />
                        </div>
                        {section.imageLink && (
                          <div style={{ marginTop: 12, textAlign: "center" }}>
                            <a
                              href={section.imageLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "10px 20px",
                                borderRadius: 8,
                                border: `2px solid ${C.accent}`,
                                background: C.accentSoft,
                                color: C.accentDark,
                                fontSize: 14,
                                fontWeight: 600,
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = C.accent;
                                e.currentTarget.style.color = "#fff";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = C.accentSoft;
                                e.currentTarget.style.color = C.accentDark;
                              }}
                            >
                              View the POC {"→"}
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          margin: "24px 0 40px 0",
                          aspectRatio: "16 / 9",
                          borderRadius: 12,
                          background: C.bg,
                          border: `1px dashed ${C.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <span
                            className="material-icons-outlined"
                            style={{ fontSize: 48, color: C.border, display: "block", marginBottom: 4 }}
                          >
                            image
                          </span>
                          <div style={{ fontSize: 13, color: C.textLight }}>
                            Image placeholder {idx + 1}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── LANDING PAGE ─────────────────────────
// ═══════════════════════════════════════════

const LANDING_SHAPES = [
  { x: 12, y: 15, size: 180, color: "rgba(255,255,255,0.12)", depth: 0.03, blur: 40 },
  { x: 75, y: 10, size: 120, color: "rgba(255,255,255,0.10)", depth: 0.05, blur: 30 },
  { x: 85, y: 65, size: 200, color: "rgba(251,207,232,0.25)", depth: 0.02, blur: 50 },
  { x: 20, y: 75, size: 140, color: "rgba(255,255,255,0.08)", depth: 0.04, blur: 35 },
  { x: 50, y: 85, size: 100, color: "rgba(236,72,153,0.12)", depth: 0.06, blur: 25 },
  { x: 90, y: 30, size: 80, color: "rgba(255,255,255,0.15)", depth: 0.07, blur: 20 },
  { x: 5, y: 45, size: 60, color: "rgba(249,168,212,0.18)", depth: 0.08, blur: 15 },
];

function LandingPage({ onStart }) {
  const [visible, setVisible] = useState(false);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const shapesRef = useRef([]);
  const containerRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      };
    };

    const rendered = LANDING_SHAPES.map(() => ({ x: 0, y: 0 }));

    const animate = () => {
      LANDING_SHAPES.forEach((shape, i) => {
        const targetX = mouse.current.x * shape.depth * 1000;
        const targetY = mouse.current.y * shape.depth * 1000;
        rendered[i].x += (targetX - rendered[i].x) * 0.06;
        rendered[i].y += (targetY - rendered[i].y) * 0.06;
        if (shapesRef.current[i]) {
          shapesRef.current[i].style.transform = `translate(${rendered[i].x}px, ${rendered[i].y}px)`;
        }
      });
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, #F9A8D4 0%, #F472B6 35%, #EC4899 70%, #DB2777 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating parallax shapes */}
      {LANDING_SHAPES.map((shape, i) => (
        <div
          key={i}
          ref={(el) => (shapesRef.current[i] = el)}
          style={{
            position: "absolute",
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
            borderRadius: "50%",
            background: shape.color,
            filter: `blur(${shape.blur}px)`,
            pointerEvents: "none",
            willChange: "transform",
          }}
        />
      ))}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
          maxWidth: 900,
          width: "100%",
        }}
      >
        {/* Side-by-side: Photo + Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 56,
            width: "100%",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Photo */}
          <div
            style={{
              width: 280,
              height: 340,
              borderRadius: 24,
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
              border: "3px solid rgba(255,255,255,0.4)",
              overflow: "hidden",
              flexShrink: 0,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0) scale(1)" : "translateX(-30px) scale(0.95)",
              transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <img
              src="headshot.jpeg"
              alt="Brenna Stevens"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.innerHTML =
                  '<span style="color:rgba(255,255,255,0.5);font-size:14px;font-weight:500">Your photo here</span>';
              }}
            />
          </div>

          {/* Text */}
          <div style={{ flex: "1 1 300px", minWidth: 280 }}>
            <h1
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 16px 0",
                lineHeight: 1.1,
                textShadow: "0 2px 20px rgba(0,0,0,0.08)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s",
              }}
            >
              Hey there,
              <br />
              I&rsquo;m Brenna.
            </h1>

            <p
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.9)",
                margin: "0 0 24px 0",
                lineHeight: 1.5,
                fontWeight: 500,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
              }}
            >
              Brand Systems &middot; Design Leadership &middot; Visual Strategy &middot; AI
            </p>

            {/* CTA Button */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
              }}
            >
              <button
                onClick={onStart}
                style={{
                  padding: "16px 40px",
                  borderRadius: 14,
                  border: "none",
                  background: "#fff",
                  color: C.coral,
                  fontSize: 17,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                }}
              >
                What would you like to know about me?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── SHARED COMPONENTS ────────────────────
// ═══════════════════════════════════════════

function FAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: C.accent,
        color: "#fff",
        border: "none",
        fontSize: 22,
        fontWeight: 700,
        boxShadow: "0 4px 12px rgba(108,99,255,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      aria-label="How this portfolio works"
    >
      ?
    </button>
  );
}

function HowItWorksModal({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.card,
          borderRadius: 16,
          padding: "32px 28px",
          maxWidth: 520,
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.text,
              margin: 0,
            }}
          >
            How this portfolio works
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: C.textLight,
              padding: 4,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ fontSize: 15, color: C.textMid, lineHeight: 1.7 }}>
          <p style={{ margin: "0 0 16px 0" }}>
            This portfolio adapts to show you the most relevant facets of my
            work. If you're hiring for a brand role, you see the design
            language and visual craft stories. If you're interested in how I
            think strategically, you see the leadership and executive influence
            work. Not different content — the same projects, surfaced at
            different altitudes.
          </p>
          <p style={{ margin: "0 0 16px 0" }}>
            All the content is pre-written and structured with metadata. When you
            answered the intake questions, your responses shaped which projects
            to feature, which details to emphasize, and how to frame the
            narrative.
          </p>
          <p style={{ margin: "0 0 16px 0" }}>
            This mirrors how a well-built design or brand system works: structured
            components, semantic metadata, composed differently depending on
            context. The portfolio is a small-scale proof of that idea.
          </p>
          <p
            style={{
              margin: 0,
              padding: "12px 16px",
              background: C.accentSoft,
              borderRadius: 8,
              fontSize: 14,
              color: C.accentDark,
            }}
          >
            Click "Start Over" in the header to take a different path
            and see how the portfolio changes.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current, total }) {
  return (
    <p
      style={{
        textAlign: "center",
        fontSize: 14,
        color: C.textLight,
        marginTop: 24,
      }}
    >
      Step {current} of {total}
    </p>
  );
}

// ═══════════════════════════════════════════
// ─── WELCOME PAGE (Step 1) ────────────────
// ═══════════════════════════════════════════

function WelcomePage({ onSubmit }) {

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
        padding: 24,
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: C.text,
            margin: "0 0 16px 0",
            lineHeight: 1.1,
          }}
        >
          Welcome
        </h1>
        <p
          style={{
            fontSize: 18,
            color: C.textMid,
            margin: "0 0 8px 0",
            lineHeight: 1.5,
          }}
        >
          This portfolio adapts to you. Let&rsquo;s start with a simple
          question:
        </p>
        <p
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: C.text,
            margin: "0 0 32px 0",
          }}
        >
          {STEPS[0].question}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {STEPS[0].suggestions.map((s) => {
            const label = typeof s === "string" ? s : s.label;
            const desc = typeof s === "string" ? null : s.desc;
            return (
              <button
                key={label}
                onClick={() => onSubmit(label)}
                style={{
                  width: "100%",
                  padding: desc ? "14px 20px" : "16px 20px",
                  borderRadius: 12,
                  border: `2px solid ${C.border}`,
                  background: C.card,
                  color: C.text,
                  fontSize: 16,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.accent;
                  e.currentTarget.style.background = C.accentSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = C.card;
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{label}</div>
                  {desc && (
                    <div style={{ fontSize: 13, color: C.textMid, marginTop: 3, fontWeight: 400 }}>
                      {desc}
                    </div>
                  )}
                </div>
                <span style={{ color: C.textLight, fontSize: 18, flexShrink: 0 }}>
                  {"→"}
                </span>
              </button>
            );
          })}
        </div>

        <StepIndicator current={1} total={2} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── QUESTION PAGE (Steps 2 & 3) ─────────
// ═══════════════════════════════════════════

function QuestionPage({ step, responses, onSubmit, onBack }) {
  const config = STEPS[step];
  const prevResponse = responses[responses.length - 1];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 600, width: "100%" }}>
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            color: C.textLight,
            fontSize: 15,
            cursor: "pointer",
            padding: 0,
            marginBottom: 32,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = C.text)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = C.textLight)
          }
        >
          {"←"} Back
        </button>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: C.text,
              margin: "0 0 8px 0",
            }}
          >
            {config.question}
          </p>

          {config.subtitle && (
            <p style={{ fontSize: 15, color: C.textLight, margin: "0 0 8px 0" }}>
              {config.subtitle}
            </p>
          )}

          {prevResponse && (
            <div
              style={{
                display: "inline-block",
                padding: "8px 16px",
                borderLeft: `3px solid ${C.border}`,
                background: C.bg,
                fontSize: 14,
                color: C.textLight,
                marginTop: 8,
              }}
            >
              <span style={{ fontWeight: 600 }}>You said:</span>{" "}
              {prevResponse.answer}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {config.suggestions.map((s) => {
            const label = typeof s === "string" ? s : s.label;
            const desc = typeof s === "string" ? null : s.desc;
            return (
              <button
                key={label}
                onClick={() => onSubmit(label)}
                style={{
                  width: "100%",
                  padding: desc ? "14px 20px" : "16px 20px",
                  borderRadius: 12,
                  border: `2px solid ${C.border}`,
                  background: C.card,
                  color: C.text,
                  fontSize: 16,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.accent;
                  e.currentTarget.style.background = C.accentSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.background = C.card;
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{label}</div>
                  {desc && (
                    <div
                      style={{
                        fontSize: 13,
                        color: C.textMid,
                        marginTop: 3,
                        fontWeight: 400,
                      }}
                    >
                      {desc}
                    </div>
                  )}
                </div>
                <span style={{ color: C.textLight, fontSize: 18, flexShrink: 0 }}>
                  {"→"}
                </span>
              </button>
            );
          })}
        </div>

        <StepIndicator current={step + 1} total={2} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── CUSTOM CURSOR ────────────────────────
// ═══════════════════════════════════════════

function CustomCursor({ dotColor = C.coral }) {
  const cursorRef = useRef(null);
  const [hoverText, setHoverText] = useState(null);
  const pos = useRef({ x: -100, y: -100 });
  const rendered = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  const hovering = hoverText !== null;

  useEffect(() => {
    const onMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e) => {
      const el = e.target.closest("[data-cursor-expand]");
      if (el) {
        setHoverText(el.getAttribute("data-cursor-expand") || "View Case Study");
      }
    };

    const onMouseOut = (e) => {
      if (e.target.closest("[data-cursor-expand]")) {
        const related = e.relatedTarget;
        if (!related || !related.closest("[data-cursor-expand]")) {
          setHoverText(null);
        }
      }
    };

    const onClick = () => {
      setHoverText(null);
    };

    const animate = () => {
      const lerp = 0.15;
      rendered.current.x += (pos.current.x - rendered.current.x) * lerp;
      rendered.current.y += (pos.current.y - rendered.current.y) * lerp;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${rendered.current.x}px, ${rendered.current.y}px) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("click", onClick);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: hovering
          ? "linear-gradient(145deg, #FBCFE8 0%, #F9A8D4 40%, #F472B6 100%)"
          : dotColor,
        borderRadius: 100,
        width: hovering ? "auto" : 12,
        height: hovering ? 36 : 12,
        padding: hovering ? "0 18px" : 0,
        transition: "width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1), padding 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          color: "#9D174D",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          letterSpacing: "0.02em",
          opacity: hovering ? 1 : 0,
          transition: "opacity 0.25s ease 0.05s",
        }}
      >
        {hoverText || "View Case Study"} {"→"}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── PORTFOLIO PAGE ───────────────────────
// ═══════════════════════════════════════════

function ProjectCard({ slug, project, gradient, onClick }) {
  return (
    <div
      data-cursor-expand="View Case Study"
      onClick={onClick}
      style={{
        background: C.card,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        cursor: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.coral;
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(244, 114, 182, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ height: 5, background: gradient }} />
      <div style={{ padding: "24px 28px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: C.textLight,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 8,
          }}
        >
          {project.series}
        </div>

        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: C.text,
            margin: "0 0 12px 0",
          }}
        >
          {project.title}
        </h3>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "3px 10px",
                borderRadius: 10,
                background: C.warmSoft,
                color: "#92400E",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <p
          style={{
            fontSize: 15,
            color: C.textMid,
            lineHeight: 1.6,
            margin: "0 0 16px 0",
          }}
        >
          {project.description}
        </p>

      </div>
    </div>
  );
}

function PortfolioPage({ responses, onStartOver, onOpenCaseStudy, onOpenAbout }) {
  const [showModal, setShowModal] = useState(false);
  const [showAllWork, setShowAllWork] = useState(false);
  const content = getCustomizedContent(responses);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const gradientColors = [
    `linear-gradient(90deg, ${C.accent}, ${C.coral})`,
    `linear-gradient(90deg, ${C.warm}, ${C.coral})`,
    `linear-gradient(90deg, ${C.coral}, ${C.accent})`,
    `linear-gradient(90deg, ${C.success}, ${C.accent})`,
  ];

  const featuredSlug = content.projectOrder[0];
  const featuredProject = PROJECTS[featuredSlug];
  const canonicalOrder = ["diagnose", "strategize", "build", "design"];
  const remainingProjects = canonicalOrder.filter((s) => s !== featuredSlug);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: `1px solid ${C.border}`,
          padding: "16px 24px",
          background: C.card,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 600, color: C.text }}>
            Brenna Stevens
          </div>
          <button
            onClick={onStartOver}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 8,
              border: `2px solid ${C.border}`,
              background: C.card,
              color: C.textMid,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.accent;
              e.currentTarget.style.color = C.accentDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.textMid;
            }}
          >
            {"↻"} Start Over
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
        {/* Featured Section — hoverable container */}
        <section
          data-cursor-expand="View Case Study"
          onClick={() => onOpenCaseStudy(featuredSlug)}
          style={{
            padding: 32,
            borderRadius: 16,
            border: `1px solid transparent`,
            marginBottom: 48,
            cursor: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
            e.currentTarget.style.background = C.card;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: C.coralSoft,
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "#9D174D",
              marginBottom: 16,
            }}
          >
            Customized for you
          </div>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: C.text,
              margin: "0 0 12px 0",
              lineHeight: 1.15,
              maxWidth: 640,
            }}
          >
            {content.headline}
          </h1>
          <p style={{ fontSize: 18, color: C.textMid, margin: "0 0 32px 0" }}>
            {content.focus}
          </p>

          {/* Case study content */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: C.textLight,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            {featuredProject.series}
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: C.text,
              margin: "0 0 12px 0",
              lineHeight: 1.2,
            }}
          >
            {featuredProject.title}
          </h2>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            {featuredProject.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "4px 12px",
                  borderRadius: 10,
                  background: C.warmSoft,
                  color: "#92400E",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <p
            style={{
              fontSize: 15,
              color: C.textMid,
              lineHeight: 1.7,
              margin: "0 0 32px 0",
              maxWidth: 640,
            }}
          >
            {CASE_STUDY_DETAIL[featuredSlug].overview.summary}
          </p>

          {/* Curated Capabilities */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {content.capabilities.map((cap) => (
              <div
                key={cap.title}
                style={{
                  background: C.bg,
                  borderRadius: 12,
                  padding: 16,
                  border: `1px solid ${C.border}`,
                  overflow: "hidden",
                  wordBreak: "break-word",
                }}
              >
                <span className="material-icons-outlined" style={{ fontSize: 22, marginBottom: 6, display: "block", color: C.accent }}>{cap.icon}</span>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.text,
                    margin: "0 0 4px 0",
                  }}
                >
                  {cap.title}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: C.textMid,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Get to Know Me */}
        <section
          data-cursor-expand="Let's Connect"
          onClick={onOpenAbout}
          style={{
            background:
              "linear-gradient(145deg, #EDE9FE 0%, #C4B5FD 30%, #A78BFA 60%, #8B5CF6 100%)",
            borderRadius: 16,
            padding: "56px 32px",
            textAlign: "center",
            marginBottom: 48,
            cursor: "none",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.01)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(139, 92, 246, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 12px 0",
              textShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            Get to Know Me
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              margin: 0,
              maxWidth: 400,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.5,
            }}
          >
            The person behind the systems — bio, links, and a little more
            about how I got here.
          </p>
        </section>

        {/* Explore Full Portfolio */}
        {!showAllWork && (
          <section
            style={{
              textAlign: "center",
              marginBottom: 48,
              padding: "32px 24px",
              border: `2px dashed ${C.border}`,
              borderRadius: 16,
            }}
          >
            <p
              style={{
                fontSize: 16,
                color: C.textMid,
                margin: "0 0 16px 0",
              }}
            >
              Want to see more? There are {remainingProjects.length} more case
              studies to explore.
            </p>
            <button
              onClick={() => setShowAllWork(true)}
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                border: `2px solid ${C.accent}`,
                background: C.accentSoft,
                color: C.accentDark,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.accent;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.accentSoft;
                e.currentTarget.style.color = C.accentDark;
              }}
            >
              Explore My Full Portfolio
            </button>
          </section>
        )}

        {showAllWork && (
          <section style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: C.text,
                margin: "0 0 8px 0",
              }}
            >
              More Work
            </h2>
            <p
              style={{
                fontSize: 15,
                color: C.textLight,
                margin: "0 0 24px 0",
              }}
            >
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {remainingProjects.map((slug, idx) => (
                <ProjectCard
                  key={slug}
                  slug={slug}
                  project={PROJECTS[slug]}
                  gradient={gradientColors[(idx + 1) % 4]}
                  onClick={() => onOpenCaseStudy(slug)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: 13,
            color: C.textLight,
            paddingTop: 24,
            paddingBottom: 24,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          This portfolio adapts based on your responses. Click &ldquo;Start
          Over&rdquo; to see a different version.
        </div>
      </main>

      <FAB onClick={() => setShowModal(true)} />
      {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── PHOTO CAROUSEL + BIO ────────────────
// ═══════════════════════════════════════════

function PhotoCarouselWithBio() {
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = [
    { src: "/IMG_0009.jpeg", caption: "Gringotts vault" },
    { src: "/IMG_3163.jpeg", caption: "Reading with the cat" },
    { src: "/IMG_7452.jpeg", caption: "Record shopping" },
    { src: "/IMG_1207.jpeg", caption: "Summer day" },
    { src: "/IMG_8411.jpeg", caption: "Girls night out" },
    { src: "/IMG_5841.jpeg", caption: "Ice skating" },
    { src: "/IMG_8567.jpeg", caption: "Candlelit dinner guest" },
    { src: "/IMG_0072.JPG", caption: "NYC vibes" },
    { src: "/IMG_0048.JPG", caption: "Concert night" },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhoto((p) => (p + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [photos.length]);

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: 32,
        marginBottom: 60,
        alignItems: "start",
      }}
    >
      {/* Photo Carousel */}
      <div>
        <div
          style={{
            aspectRatio: "4 / 5",
            borderRadius: 20,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 8,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={photos[activePhoto].src}
            alt={photos[activePhoto].caption}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>

        {/* Carousel Dots */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePhoto(i)}
              style={{
                width: i === activePhoto ? 24 : 8,
                height: 8,
                borderRadius: 100,
                border: "none",
                background:
                  i === activePhoto
                    ? "#fff"
                    : "rgba(255,255,255,0.35)",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Bio */}
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          borderRadius: 20,
          padding: "36px 32px",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 20px 0",
          }}
        >
          A Little About Me
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.75,
            margin: "0 0 16px 0",
          }}
        >
          I'm Brenna, a Chicago-based designer currently leading the global design 
          system at NielsenIQ. I've spent my whole life making things by hand, from
          embroidery to crochet to digital design, and that practice has shaped how
          I approach design more than anything on my resume.
        </p>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.75,
            margin: "0 0 16px 0",
          }}
        >
          Craft teaches you something that's hard to learn any other way: the
          quality of the work lives in the details people don't consciously notice.
          The willingness to rip someting out and redo it rather than letting a 
          small imprecision compound - and knowing when to let it blend into the 
          bigger picture - is the instinct that shows up in everything I build.
        </p>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.75,
            margin: "0 0 16px 0",
          }}
        >
          I'm also, for better or worse, intensely organized. I enjoy seeing the
          result of building something that's both beautiful and systemically sound.
          That pull between the handmade and the highly structured is what drew me
          to design in the first place.
        </p>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          The work that's pulling me in lately is what happens when you build a
          system that's meant to be consumed by both AI and humans alike. What
          does design quality get defined when the users are reading both structure
          and aesthetics? The implications are still unfolding and I find them
          endlessly fascinating to explore.
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// ─── ABOUT PAGE ──────────────────────────
// ═══════════════════════════════════════════

function AboutPage({ onBack }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const linkButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 28px",
    borderRadius: 100,
    border: "2px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, #F9A8D4 0%, #F472B6 35%, #EC4899 70%, #DB2777 100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(251, 207, 232, 0.5)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              color: "#9D174D",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              padding: 0,
              transition: "opacity 0.2s ease",
            }}
          >
            {"←"} Back to Portfolio
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        {/* Hero Section */}
        <section style={{ textAlign: "center", marginBottom: 60 }}>
          <h1
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 12px 0",
              lineHeight: 1.1,
              textShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            Hi, I'm Brenna.
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 32px 0",
              maxWidth: 500,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}
          >
            Design leader, embroiderer, and the kind of person who finds
            deep calm in a well-organized system.
          </p>

          {/* Link Buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="mailto:brennastevens10@gmail.com"
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              }}
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/brenna-stevens-066039123/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              }}
            >
              LinkedIn
            </a>
            <a
              href="/Brenna Stevens Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={linkButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              }}
            >
              Resume
            </a>
          </div>
        </section>

        {/* Bio + Photo Carousel Side by Side */}
        <PhotoCarouselWithBio />

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            paddingTop: 24,
            paddingBottom: 24,
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          Made with intention (and a little AI). {"❤️"}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── MAIN APP ─────────────────────────────
// ═══════════════════════════════════════════

export default function BrennaPortfolio() {
  const [phase, setPhase] = useState("landing");
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  const handleAnswer = useCallback(
    (answer) => {
      const stepConfig = STEPS[currentStep];
      setResponses((prev) => [...prev, { question: stepConfig.id, answer }]);
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        setCurrentStep(STEPS.length);
      }
    },
    [currentStep]
  );

  const handleBack = useCallback(() => {
    if (currentStep === 0) {
      setPhase("landing");
    } else {
      setResponses((prev) => prev.slice(0, -1));
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleStartOver = useCallback(() => {
    setPhase("landing");
    setCurrentStep(0);
    setResponses([]);
    setActiveCaseStudy(null);
  }, []);

  const handleOpenCaseStudy = useCallback((slug) => {
    setActiveCaseStudy(slug);
    window.scrollTo({ top: 0 });
  }, []);

  const handleCloseCaseStudy = useCallback(() => {
    setActiveCaseStudy(null);
    window.scrollTo({ top: 0 });
  }, []);

  const handleOpenAbout = useCallback(() => {
    setShowAbout(true);
    window.scrollTo({ top: 0 });
  }, []);

  const handleCloseAbout = useCallback(() => {
    setShowAbout(false);
    window.scrollTo({ top: 0 });
  }, []);

  const isLanding = phase === "landing";
  const cursorDotColor = (isLanding || showAbout) ? "#9D174D" : C.coral;

  let page;

  if (isLanding) {
    page = <LandingPage onStart={() => setPhase("onboarding")} />;
  } else if (currentStep === 0) {
    page = (
      <>
        <WelcomePage onSubmit={handleAnswer} />
        <FAB onClick={() => setShowModal(true)} />
        {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
      </>
    );
  } else if (currentStep < STEPS.length) {
    page = (
      <>
        <QuestionPage
          step={currentStep}
          responses={responses}
          onSubmit={handleAnswer}
          onBack={handleBack}
        />
        <FAB onClick={() => setShowModal(true)} />
        {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
      </>
    );
  } else if (showAbout) {
    page = <AboutPage onBack={handleCloseAbout} />;
  } else if (activeCaseStudy) {
    page = (
      <CaseStudyPage
        slug={activeCaseStudy}
        onBack={handleCloseCaseStudy}
      />
    );
  } else {
    page = (
      <PortfolioPage
        responses={responses}
        onStartOver={handleStartOver}
        onOpenCaseStudy={handleOpenCaseStudy}
        onOpenAbout={handleOpenAbout}
      />
    );
  }

  return (
    <div>
      <style>{`*, *::before, *::after { cursor: none !important; }`}</style>
      <CustomCursor dotColor={cursorDotColor} />
      {page}
    </div>
  );
}
