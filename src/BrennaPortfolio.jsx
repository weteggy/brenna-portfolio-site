import { useState, useEffect, useCallback, useRef } from "react";

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
    question: "What matters most to you when evaluating for this role?",
    subtitle: null,
    suggestions: [
      { label: "Strategic vision & executive influence" },
      { label: "Design craft & brand thinking" },
      { label: "Cross-functional leadership & delivery" },
      { label: "Technical innovation & AI fluency" },
    ],
  },
  {
    id: "casestudy",
    question: "Where would you like to start?",
    subtitle: "Each tells a different part of the story.",
    suggestions: [
      { label: "Diagnose", desc: "See how I uncovered an org-wide problem", value: "diagnose" },
      { label: "Strategize", desc: "See how I got my argument straight to the CPO", value: "strategize" },
      { label: "Build", desc: "See how I build with AI", value: "build" },
      { label: "Design", desc: "See my design skills in action", value: "design" },
    ],
  },
];

// ═══════════════════════════════════════════
// ─── CONTENT ENGINE ───────────────────────
// ═══════════════════════════════════════════

function getCustomizedContent(responses) {
  const audience = (responses[0]?.answer || "").toLowerCase();
  const priority = (responses[1]?.answer || "").toLowerCase();
  const caseStudy = (responses[2]?.answer || "").toLowerCase();

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

  // ── Selected case study ──
  const caseMap = { diagnose: "diagnose", strategize: "strategize", build: "build", design: "design" };
  const selected = Object.keys(caseMap).find((k) => caseStudy.includes(k)) || "diagnose";

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

  // ── Project order: selected case first, rest ordered by relevance ──
  const defaultOrder = wantsCraft
    ? ["design", "diagnose", "build", "strategize"]
    : wantsStrategy
    ? ["strategize", "diagnose", "build", "design"]
    : wantsAI
    ? ["build", "strategize", "diagnose", "design"]
    : wantsLeadership
    ? ["build", "strategize", "diagnose", "design"]
    : ["diagnose", "strategize", "build", "design"];

  const projectOrder = [selected, ...defaultOrder.filter((p) => p !== selected)];

  // ── CTA heading adapts to audience ──
  const ctaHeading = isEvaluator
    ? "Let's Talk About the Role"
    : isEngineeringLead || isProductStakeholder
    ? "Want to Work Together?"
    : isPeer
    ? "Let's Connect"
    : "Let's Connect";

  return { headline, focus, emphasize, projectOrder, ctaHeading };
}

// ═══════════════════════════════════════════
// ─── PROJECT DATA (from real case studies) ─
// ═══════════════════════════════════════════

const PROJECTS = {
  diagnose: {
    series: "Part 1 of 3 — From Stalled to Strategic",
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
    series: "Part 2 of 3 — From Stalled to Strategic",
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
    series: "Part 3 of 3 — From Stalled to Strategic",
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
    series: "Companion Piece",
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
    overview: {
      summary:
        "NielsenIQ's design system had been stalled for four years. While still a UX designer, I diagnosed why — connecting user complaints, rising convergence costs, and missing infrastructure into a single argument leadership hadn't heard before. I built the token architecture nobody knew was missing, got design system work prioritized in PI planning for the first time since our rebrand 4 years prior, and earned the lead title by doing the job before I had it.",
    },
    learn: {
      sections: [
        {
          heading: "The Situation",
          body: "NielsenIQ had a component library. What it didn't have was anyone who believed a design system mattered. Components existed in Figma and a shared code repository, but they functioned more like a parts bin than a system. Hardcoded hex values lived in SCSS files, color styles in Figma were tied to individual components rather than organized by intent, and there was no shared design language connecting what a designer meant by primary surface background and what an engineer typed into code. Every product team translated on their own, and every translation introduced drift.",
        },
        {
          heading: "What I Did",
          body: "I started doing diagnostic work in January 2025 — almost a year before I had the design system lead title. Rather than leading with presentations, I began having direct one-on-one conversations with the product leaders who controlled prioritization. I never pitched 'design tokens' to leadership. I led with their problems: users unhappy with inconsistency, convergence costs ballooning without shared infrastructure, teams duplicating effort. In parallel, I built a tiered token architecture covering color, typography, spacing, elevation, radius, and motion.",
        },
        {
          heading: "What Changed",
          body: "I got the design system prioritized in our quarterly PI planning for the first time since our company rebrand 4 years prior. The UX Director recommended me for the design system lead role when the outgoing lead's contract ended. In November 2025, I officially got the title. By that point, I had already moved the work further in less than a year than it had moved in the previous three and a half years.",
        },
      ],
      artifact: {
        title: "Project Board",
        description:
          "The Roadmap I built from scratch to track the design system's work for the first time, with milestones and goals mapped to the PI schedule.",
        image: <img src="/public/FoundationsRoadmap.png" alt="Foundations project roadmap" />,
      },
    },
    deep: {
      modules: [
        {
          label: "Organizational Diagnosis",
          body: "What I found wasn't just a technical gap. It was a perception problem with three reinforcing causes. Nobody had connected the user complaints to a root cause — product teams were treating each complaint as a product-level problem. The design system had no advocate who could make the value legible outside UX. And institutional cynicism was the default — I was proposing that a category of work the org had written off was actually the answer to problems they were actively spending money trying to solve in other ways.",
        },
        {
          label: "Stakeholder Strategy",
          body: "I didn't wait for the title. Starting early 2025, I began having direct conversations with the product leaders who controlled prioritization. This was deliberate sequencing. Proposing a multi-month foundational project to an organization that had failed to deliver one for four years required a different kind of credibility than a good project brief. I needed people to have already seen me do the work before I asked them to prioritize it.",
        },
        {
          label: "Token Architecture Decisions",
          body: "I introduced a tiered architecture where primitive tokens define the raw palette and semantic tokens define intent. For color, we moved from an overly complex style library with hundreds of values to an easily scalable two part system, because the multi-product portfolio made theming a structural requirement. Typography is organized by role rather than size. Spacing uses a 4px base unit with semantic application tokens.",
        },
      ],
      artifacts: [
        {
          title: "Design System Usability Survey",
          description:
            "The survey and readout that was run internally to validate the diagnosis with both users and stakeholders — connecting user complaints to a lack of shared infrastructure and a missing design language.",
          image: <img src="/public/SUS.png" alt="System usability survey readout" />,
        },
        {
          title: "Project Board",
          description:
            "The Roadmap I built from scratch to track the design system's work for the first time, with milestones and goals mapped to the PI schedule.",
          image: <img src="/public/FoundationsRoadmap.png" alt="Foundations project roadmap" />,
        },
        {
          title: "Before & After",
          description:
            "Side-by-side comparisons showing the previous color style system in Figma versus the simplified semantic token system in action.",
          image: <img src="/public/LegacyvsNewTokens.png" alt="Before and after of the color token system in Figma" />,
        },
      ],
    },
  },
  strategize: {
    role: "Global Design System Lead",
    timeline: "December 2025 – March 2026",
    org: "NielsenIQ",
    overview: {
      summary:
        "The org's planning structure couldn't prioritize the design system — one product controlled build capacity for every product. Instead of making a better case within a broken structure, I designed around it: I partnered with a different product team, designed a spec-driven architecture that generates components across four frameworks from a single source of truth, connected the design system to the company's AI-readiness gap, and navigated the argument to the CPO.",
    },
    learn: {
      sections: [
        {
          heading: "The Situation",
          body: "Having a seat at the planning table revealed a harder truth: the organizational structure made it nearly impossible for the design system to get the capacity it needed. The CUIC team — the engineering group responsible for shared components — reports into the flagship product. When the flagship needs bug fixes, the design system waits. During PI2 planning, tokens got pushed to September 2026, six months past the original target.",
        },
        {
          heading: "The Parallel Path",
          body: "I designed a parallel path: rather than fighting for capacity within CUIC's constrained roadmap, I proposed a spec-driven component architecture generating implementations across Angular, React, Vue, and Lit from a single source of truth. I validated the approach with five proof-of-concept components across all four frameworks before committing the full team. I brought CUIC's tech lead in as an architecture advisor, changing the conversation from 'they're building something separate' to 'they're building on shared architectural decisions.'",
        },
        {
          heading: "Getting the CPO Meeting",
          body: "In four years, the CPO had never had direct visibility into the design system. I started with the VP of Product and UX, connecting two things she was already worried about: AI-readiness and the design system's inability to support it. By the time I got into the CPO's office, the framing wasn't entirely new to him. He gave explicit approval for V2 with dedicated engineering resources.",
        },
      ],
      artifact: {
        title: "CPO Presentation",
        description:
          "The strategic narrative built for the executive meeting: the AI-readiness gap, side-by-side comparisons of AI output with structured versus unstructured design systems, and a specific ask for dedicated resources.",
        video: <video src="/public/CPOppt.mp4" controls width="100%" />,
      },
    },
    deep: {
      modules: [
        {
          label: "The PI Planning Problem",
          body: "The original roadmap was clean. Then PI2 planning happened. The CUIC team could only complete bug fixes for half of the components. Product leadership acknowledged the work was critical — and denied the reprioritization request. I documented the decision and its downstream impact as a risk assessment. The response was acknowledgment without action, which confirmed that waiting for the existing structure to prioritize the design system was not a viable strategy.",
        },
        {
          label: "Adaptive Messaging",
          body: "The AI framing landed with leadership because it connected to competitive anxiety, but it bounced off engineering teams. Their experience with AI coding tools was that the tools were unreliable for design fidelity. I adjusted: with engineering audiences, I stopped leading with AI and talked about the same architectural decisions framed as good engineering practice that happened to also make the system AI-consumable. The AI story was for leadership. The engineering story was about craft.",
        },
        {
          label: "Cross-Team Infrastructure Model",
          body: "The V2 project wasn't just about delivering components faster. It was a proof of concept for a fundamentally different way of resourcing shared infrastructure. As long as the shared component library lived inside one product's org, it would always be subordinate to that product's needs. The V2 approach demonstrated what happens when multiple teams contribute capacity, coordinated by a design system lead who works across organizational boundaries.",
        },
      ],
      artifacts: [
        {
          title: "CPO Presentation",
          description:
            "The strategic narrative built for the executive meeting: the AI-readiness gap, side-by-side comparisons of AI output with structured versus unstructured design systems, and a specific ask for dedicated resources.",
          video: <video src="/public/CPOppt.mp4" controls width="100%" />,
        },
        {
          title: "V2 Project Plan",
          description:
            "Three parallel swimlanes across four phases and seven sprints, with sprint-by-sprint deliverables and entry/exit criteria.",
          image: <img src="/public/V2ProjectPlan.png" alt="V2 project timeline" />,
        },
      ],
    },
  },
  build: {
    role: "Global Design System Lead",
    timeline: "January 2026 – Present",
    org: "NielsenIQ",
    overview: {
      summary:
        "I personally built the framework-agnostic proof-of-concepts — the same components generated in Angular, React, Vue, and Lit from structured spec.json files, and am now leading a 6-person cross-functional team to deliver 40+ production-ready components, tokens, themes, and patterns across three parallel workstreams in 14 weeks using AI-assisted development at 2–3x velocity.",
    },
    learn: {
      sections: [
        {
          heading: "The Research That Shaped Everything",
          body: "Before the V2 build started, I used Claude as a deep research tool to understand how AI tools actually interact with design systems. The finding was consistent: when a codebase has well-structured component APIs with semantic tokens, AI tools generate code that uses existing components correctly. When documentation is sparse, the tools invent their own implementations. This research directly shaped every V2 architecture decision.",
        },
        {
          heading: "The Framework-Agnostic Proof",
          body: "I built the proof-of-concept myself. From structured spec.json files, I used Claude Code to generate the same component in four frameworks: Angular, React, Vue, and Web Components via Lit. Five components, four frameworks, same spec files. When the spec was sufficiently structured, the AI-generated output was correct across all four frameworks — matching visual rendering, consistent API surfaces, accessibility attributes present.",
        },
        {
          heading: "The Co-Build",
          body: "I assembled a cross-functional team of six across three parallel swimlanes. The expected results: 40+ production-ready deliverables, an OKLCH color system generating semantic tokens and dark mode support algorithmically, sub-brand theming validated in production, and two developers producing at 2–3x normal velocity. The three-swimlane timeline would be impossible at traditional development speed.",
        },
      ],
      artifact: {
        title: "Vibe-Coded Project Hub",
        description:
          "The project management interface I built to onboard stakeholders.",
        image: <img src="/public/v2website.png" alt="V2 project website" />,
        url: "https://v2-project-blue.vercel.app/#"
      },
    },
    deep: {
      modules: [
        {
          label: "AI Deep Research",
          body: "I explored how LLMs consume component documentation, what makes a token system machine-readable versus just human-readable, and what the difference looks like in actual generated output. These weren't theoretical conclusions — they came from watching real AI tools produce real output with varying levels of structured input. The research also gave me the language for the CPO conversation, presenting findings from hands-on experimentation rather than speculation.",
        },
        {
          label: "Leading the Co-Build",
          body: "I assembled and am running a cross-functional team of six with radically different allocations and skill sets. Getting each person's commitment required separate conversations with their managers. I built the operational infrastructure from scratch: weekly standups, bi-weekly stakeholder updates, monthly demos, a Jira board with epics, communication templates, a decision log, component QA checklists, an AI code review protocol, and a contribution process.",
        },
        {
          label: "AI Development Workflow",
          body: "Every AI-generated PR requires human code review with a 24-hour SLA, and AI-assisted PRs that are to be flagged so reviewers know to check edge cases harder. This isn't just quality assurance — it's protecting the credibility of the approach. If V2 shipped with quality problems traceable to AI-generated code, the thesis would be undermined, and with it the case for continued investment.",
        },
      ],
      artifacts: [
        {
          title: "Vibe-Coded Project Hub",
          description:
            "The project management interface I built to onboard stakeholders.",
          image: <img src="/public/v2website.png" alt="V2 project website" />,
          url: "https://v2-project-blue.vercel.app/#"
        },
      ],
    },
  },
  design: {
    role: "Designer → Design System Lead",
    timeline: "2018 – 2026",
    org: "5 organizations",
    overview: {
      summary:
        "My broader portfolio proves I can diagnose, strategize, and build at enterprise scale — this proves I've been designing the whole time. A visual companion spanning five organizations and ten years: brand systems built as a one-person creative department, healthcare learning design where clarity is a clinical requirement, editorial design for institutional audiences, and component craft inside an enterprise design system.",
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
      artifacts: [
        {
          title: "Madison Ballet Campaign",
          description:
            "Multi-event sub-brand system across social for varied workshop series.",
          image: <img src="/public/workshopposter.jpeg" alt="Madison Ballet Workshop Poster" />,
          image: <img src="/public/workshopagenda.png" alt="Madison Ballet Workshop Agenda" />,
          image: <img src="/public/workshopteacher.png" alt="Madison Ballet Workshop Teacher page" />,
        },
        {
          title: "Pathway Health Learning Modules",
          description:
            "LMS design and video content for clinical and administrative healthcare audiences.",
          url: "https://youtube.com/playlist?list=PL7OaUzWROfdNz0AK0goedR9G3TdpDe9Dy&si=nSgIx_kSB0XNeHA3",
        },
        {
          title: "NielsenIQ Notifications Flow",
          description:
            "End-to-end interaction design for the flagship product's notification system.",
          description: "password: NIQ",
          url: "https://www.figma.com/proto/xPkpGgEZG2LjeG97zs63w7/Notifications-Alerts-Panel?node-id=517-196193&viewport=154%2C150%2C0.03&t=OQvpMUMZkoblo3HO-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=517%3A204500&show-proto-sidebar=1&page-id=1%3A10",
        },
        { 
          title: "SWIB Newsletter Design", 
          description: "Institutional newsletter design for an investment firm audience.",
          pdf: <a href="/artifacts/E&INewsletter.pdf" target="_blank">View Newsletter</a>
        },
        {
          title: "Embroidered Clothing", 
          description: "Custom made clothing created via hand embroidery.", 
          image: <img src="/public/stargazer.png" alt="A custom shirt for a BFA art show" />,
          image: <img src="/public/sarbear.png" alt="A bear sweatshirt" />,
          image: <img src="/public/witchy.png" alt="A witchy trio on a sweatshirt" />,
          image: <img src="/public/shakespeare.png" alt="A shakespearean sweatshirt" />,
          image: <img src="/public/cranes.png" alt="A crane composition on a jacket" />,
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
  { key: "learn", label: "Learn More" },
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

function ArtifactCard({ artifact }) {
  return (
    <div
      style={{
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 20,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: C.coralSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {"\u{1F4CE}"}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>
          {artifact.title}
        </div>
        <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5 }}>
          {artifact.description}
        </div>
      </div>
    </div>
  );
}

function CaseStudyPage({ slug, emphasize, onBack }) {
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

  const angle =
    emphasize === "craft"
      ? project.craftAngle
      : emphasize === "outcomes"
      ? project.outcomesAngle
      : project.leadershipAngle;

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
            maxWidth: 720,
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
          <SegmentToggle value={depth} onChange={setDepth} />
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
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

        {/* Personalization callout */}
        <div
          style={{
            padding: "12px 16px",
            background: C.accentSoft,
            borderRadius: 8,
            fontSize: 14,
            color: C.accentDark,
            lineHeight: 1.55,
            marginBottom: 40,
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {emphasize === "craft"
              ? "Design lens: "
              : emphasize === "outcomes"
              ? "Key outcomes: "
              : "Leadership lens: "}
          </span>
          {angle}
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 40 }}>
          {/* ─── OVERVIEW ─── */}
          {depth === "overview" && (
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
              <div
                style={{
                  marginTop: 32,
                  padding: "20px 24px",
                  background: C.bg,
                  border: `1px dashed ${C.border}`,
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 14, color: C.textMid, margin: "0 0 12px 0" }}>
                  Want more detail? Switch to Learn More or Deep Dive above.
                </p>
              </div>
            </div>
          )}

          {/* ─── LEARN MORE ─── */}
          {depth === "learn" && (
            <div>
              {detail.learn.sections.map((section) => (
                <div key={section.heading} style={{ marginBottom: 32 }}>
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
                  <p
                    style={{
                      fontSize: 15,
                      color: C.textMid,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {section.body}
                  </p>
                </div>
              ))}
              {detail.learn.artifact && (
                <div style={{ marginTop: 40 }}>
                  <h3
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textLight,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 12px 0",
                    }}
                  >
                    Artifact
                  </h3>
                  <ArtifactCard artifact={detail.learn.artifact} />
                </div>
              )}
            </div>
          )}

          {/* ─── DEEP DIVE ─── */}
          {depth === "deep" && (
            <div>
              {detail.learn.sections.map((section) => (
                <div key={section.heading} style={{ marginBottom: 32 }}>
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
                  <p
                    style={{
                      fontSize: 15,
                      color: C.textMid,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {section.body}
                  </p>
                </div>
              ))}

              {/* Depth Modules */}
              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 40,
                  marginTop: 16,
                }}
              >
                <h2
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.textLight,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: "0 0 24px 0",
                  }}
                >
                  Going Deeper
                </h2>
                {detail.deep.modules.map((mod) => (
                  <div
                    key={mod.label}
                    style={{
                      marginBottom: 32,
                      padding: "24px",
                      background: C.card,
                      borderRadius: 12,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: C.text,
                        margin: "0 0 12px 0",
                      }}
                    >
                      {mod.label}
                    </h3>
                    <p
                      style={{
                        fontSize: 15,
                        color: C.textMid,
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {mod.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* All Artifacts */}
              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 40,
                }}
              >
                <h2
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.textLight,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: "0 0 16px 0",
                  }}
                >
                  Artifacts & Evidence
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {detail.deep.artifacts.map((a) => (
                    <ArtifactCard key={a.title} artifact={a} />
                  ))}
                </div>
              </div>
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
              Design Systems &middot; Brand &middot; Visual Design &middot; AI
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
            This mirrors how a well-built design system works: structured
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
  const [customInput, setCustomInput] = useState("");

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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            margin: "24px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 14, color: C.textLight }}>or</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && customInput.trim() && onSubmit(customInput.trim())
            }
            placeholder="Type your own response..."
            style={{
              width: "100%",
              padding: "16px 20px",
              borderRadius: 12,
              border: `2px solid ${C.border}`,
              fontSize: 16,
              color: C.text,
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = C.accent)}
            onBlur={(e) => (e.target.style.borderColor = C.border)}
          />
          <button
            onClick={() => customInput.trim() && onSubmit(customInput.trim())}
            disabled={!customInput.trim()}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              border: "none",
              background: customInput.trim() ? C.text : C.border,
              color: customInput.trim() ? "#fff" : C.textLight,
              fontSize: 16,
              fontWeight: 600,
              cursor: customInput.trim() ? "pointer" : "default",
              transition: "all 0.2s ease",
            }}
          >
            Continue
          </button>
        </div>

        <StepIndicator current={1} total={3} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ─── QUESTION PAGE (Steps 2 & 3) ─────────
// ═══════════════════════════════════════════

function QuestionPage({ step, responses, onSubmit, onBack }) {
  const [customInput, setCustomInput] = useState("");
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            margin: "24px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 14, color: C.textLight }}>or</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && customInput.trim() && onSubmit(customInput.trim())
            }
            placeholder="Type your own response..."
            style={{
              width: "100%",
              padding: "16px 20px",
              borderRadius: 12,
              border: `2px solid ${C.border}`,
              fontSize: 16,
              color: C.text,
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = C.accent)}
            onBlur={(e) => (e.target.style.borderColor = C.border)}
          />
          <button
            onClick={() => customInput.trim() && onSubmit(customInput.trim())}
            disabled={!customInput.trim()}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              border: "none",
              background: customInput.trim() ? C.text : C.border,
              color: customInput.trim() ? "#fff" : C.textLight,
              fontSize: 16,
              fontWeight: 600,
              cursor: customInput.trim() ? "pointer" : "default",
              transition: "all 0.2s ease",
            }}
          >
            Continue
          </button>
        </div>

        <StepIndicator current={step + 1} total={3} />
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

function ProjectCard({ slug, project, emphasize, gradient, onClick }) {
  const angle =
    emphasize === "craft"
      ? project.craftAngle
      : emphasize === "outcomes"
      ? project.outcomesAngle
      : project.leadershipAngle;
  const angleLabel =
    emphasize === "craft"
      ? "Design lens: "
      : emphasize === "outcomes"
      ? "Key outcomes: "
      : "Leadership lens: ";

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

        <div
          style={{
            padding: "12px 16px",
            background: C.accentSoft,
            borderRadius: 8,
            fontSize: 14,
            color: C.accentDark,
            lineHeight: 1.55,
          }}
        >
          <span style={{ fontWeight: 600 }}>{angleLabel}</span>
          {angle}
        </div>
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
  const remainingProjects = content.projectOrder.slice(1);

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
        {/* Hero */}
        <section
          style={{
            paddingBottom: 48,
            borderBottom: `1px solid ${C.border}`,
            marginBottom: 48,
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
          <p style={{ fontSize: 18, color: C.textMid, margin: "0 0 24px 0" }}>
            {content.focus}
          </p>
          <p
            style={{
              fontSize: 15,
              color: C.textMid,
              margin: 0,
              maxWidth: 640,
              lineHeight: 1.65,
            }}
          >
            I'm Brenna Stevens, Global Design System Lead at NielsenIQ. I
            built a cohesive design language from scratch — a three-tier
            token system covering color, typography, spacing, elevation, radius,
            and motion — that unified a portfolio of enterprise products for
            the first time. I assembled a cross-functional team of nine and
            shipped 40+ production-ready deliverables in a single quarter using
            AI-assisted development.
          </p>
        </section>

        {/* Featured Case Study (single) */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: C.text,
              margin: "0 0 24px 0",
            }}
          >
            Featured Work
          </h2>
          <ProjectCard
            slug={featuredSlug}
            project={featuredProject}
            emphasize={content.emphasize}
            gradient={gradientColors[0]}
            onClick={() => onOpenCaseStudy(featuredSlug)}
          />
        </section>

        {/* Capabilities */}
        <section
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 48,
            marginBottom: 48,
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: C.text,
              margin: "0 0 24px 0",
            }}
          >
            Capabilities
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                icon: "palette",
                title: "Design Language & Brand",
                desc: "Three-tier token architecture, OKLCH color systems, design language development, multi-product theming, visual identity",
              },
              {
                icon: "groups",
                title: "Leadership & Influence",
                desc: "Cross-functional team leadership (9 contributors, 0 direct reports), executive communication, stakeholder navigation, adaptive messaging",
              },
              {
                icon: "widgets",
                title: "Design Systems",
                desc: "Component libraries, governance, multi-product support, spec-driven architecture, framework-agnostic design",
              },
              {
                icon: "smart_toy",
                title: "AI + Design",
                desc: "AI-assisted development workflows, machine-readable documentation, spec-driven generation across 4 frameworks",
              },
              {
                icon: "bar_chart",
                title: "Data Visualization",
                desc: "OKLCH-based chart palettes, ag-Grid + Highcharts theming, categorical/sequential/diverging color systems",
              },
              {
                icon: "brush",
                title: "Visual Design Craft",
                desc: "Brand systems, editorial design, digital learning, print, web, social, video, interaction design, component craft",
              },
            ].map((cap) => (
              <div
                key={cap.title}
                style={{
                  background: C.card,
                  borderRadius: 12,
                  padding: 20,
                  border: `1px solid ${C.border}`,
                  minHeight: 180,
                }}
              >
                <span className="material-icons-outlined" style={{ fontSize: 28, marginBottom: 8, display: "block", color: C.accent }}>{cap.icon}</span>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: C.text,
                    margin: "0 0 6px 0",
                  }}
                >
                  {cap.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
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
              The rest of the story, still framed around what you told me
              matters most.
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
                  emphasize={content.emphasize}
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
    { src: "/stargazer.jpeg", caption: "NYC vibes" },
    { src: "/witchy.jpeg", caption: "Concert night" },
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
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
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
          My background spans digital media design, multimedia communications,
          film, and language {"—"} a breadth that shows up in how I approach
          systems work: through narrative, visual thinking, and the ability to
          translate across disciplines.
        </p>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.75,
            margin: "0 0 16px 0",
          }}
        >
          At NielsenIQ, I inherited a design system that had been stalled for
          four years. I diagnosed the structural reasons it hadn{"'"}t moved,
          built a token architecture that introduced a new design language across
          the org, and framed the system{"'"}s value in terms the CPO acted
          on. I assembled a cross-functional team of nine and delivered 40+
          production-ready components in a single quarter using AI-assisted
          development.
        </p>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          I think the next era of design systems is about building for two
          audiences simultaneously: human developers and AI tools. The leaders
          who understand that intersection will define how products get built.
          That{"'"}s the work I{"'"}m doing.
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
            maxWidth: 800,
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
          <span style={{ fontSize: 15, fontWeight: 600, color: "#9D174D" }}>
            Brenna Stevens
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
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
            Design systems leader, visual thinker, and the person who built a
            design language from scratch for a $6B company.
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
              href="mailto:brenna.stevens@nielseniq.com"
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
              href="https://linkedin.com/in/brennastevens"
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
              href="#resume"
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
    const content = getCustomizedContent(responses);
    page = (
      <CaseStudyPage
        slug={activeCaseStudy}
        emphasize={content.emphasize}
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
