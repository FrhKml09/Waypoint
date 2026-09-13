Waypoint

(Shown as "TravelMind" in the live app's UI — same project, working title in transition.)

Team: Farah, Tahiya Tasnim, Vesyal, Maryam Ahmed Problem Statement: Travel Planner GitHub Repository: https://github.com/FrhKml09/Waypoint Live Prototype: https://waypoint-snowy-tau.vercel.app/ Video Presentation: (add your Unlisted YouTube link here before submitting)

1. Project Overview
The Problem

Group travel planning is scattered across too many disconnected tools. Flight and hotel bookings live in confirmation emails, prices get compared across airline and accommodation sites, and the actual decision-making — who wants to prioritize what, what the group can afford, who's paying for what — happens informally in a WhatsApp or Telegram group chat that nobody goes back to reference later. The stakeholders are the travelers themselves: groups of friends, families, or student trip organizers who each bring their own priorities and budget constraints and have to negotiate a shared itinerary out of them.

A second, related problem is fragility: once a trip is planned, it rarely survives contact with reality. A delayed flight, a cancelled activity, or a change in budget forces the group to manually re-negotiate and re-edit the itinerary from scratch, often under time pressure, because existing tools treat the itinerary as a static document rather than something that adapts.

Similar tools that exist today, such as TripIt, solve part of this by aggregating confirmed bookings (via forwarded confirmation emails) into a single itinerary view. It falls short on both problems above: it's a read-only aggregator, not a collaborative planning space, so it does nothing to help a group negotiate priorities or budget together, and it has no concept of automatically adjusting a plan when something goes wrong — a delay just leaves the old itinerary sitting there, wrong.

Our Solution

Waypoint is a collaborative travel planning workspace that turns the group conversation you're already having into a live, structured trip plan. Instead of making travelers fill out forms in yet another app, Waypoint's AI reads the group's discussion — including chat pasted in directly from WhatsApp or Telegram — and extracts flights, budget, itinerary items, and preferences into a set of live "captured" cards sitting right next to the conversation. When something changes — most commonly a flight delay — Waypoint replans the itinerary and budget together as one system, compressing or dropping lower-priority items to protect the constraints that actually matter (the next flight, a curfew, a non-negotiable booking).

Feature set:

Single-page live dashboard — chat feed and trip-state cards (destination, flights/hotel, budget, itinerary, memory) side by side, no tabs or page navigation
Real-time AI capture — a "detected → captured" toast pulses in as new information is pulled from the conversation
Chat import — paste a WhatsApp or Telegram export directly in, and it's parsed and fed through the same extraction pipeline as live chat
Dynamic replanning ("Something changed") — a guided flow for disruptions (flight delay is the first quick-reason) that re-fits the itinerary and budget around the next hard constraint instead of just pushing everything later
Shared trip memory — a running record of what the group has already decided, so nothing gets re-litigated
2. Ideation & Process
2.1 Ideas We Considered
Idea	Why it was dropped / kept
A — Collaborative live workspace that extracts itinerary, budget, and preferences from group chat (Chosen)	Kept: directly targets the universal, clearly-scoped problem of travel-planning information being scattered across chats and apps; technically feasible as a UI/UX prototype in the timeframe.
B — Dynamic, budget-aware replanning for travel setbacks like flight delays (Chosen)	Kept: reuses the same structured trip data as Idea A and gives the product a clear differentiator beyond a static planner — a plan that survives contact with reality.
C — Local-guide matching (connect travelers with local residents for tours)	Dropped: scope creep into a matching/marketplace feature unrelated to the core planning problem; the team agreed to keep to one differentiating feature given the time constraints.
D — Academic burnout tracker	Dropped: hard to measure reliably without health-monitoring hardware, since physical symptoms of burnout aren't always present or consistent.
E — Peer-led burnout support matching (pairing students by learning style/personality)	Dropped: part of the abandoned burnout track; overlapped with existing peer-support tools the team hadn't validated wasn't already solved.
F — AI study assistant that condenses large course materials into flashcards/quizzes	Dropped: part of the abandoned burnout track; the team observed current LLMs struggle to synthesize very large materials (10–12 chapters) reliably, often weighting only the last few slides.
G — Gamified daily-capacity planner that reschedules tasks by self-assessed mental/physical capacity	Dropped: part of the abandoned burnout track; notably shared the same "dynamic rescheduling" logic the team ultimately kept — just applied to the travel app instead.

(Between the two tracks, the team explicitly chose the travel app over the burnout app because it offered a clearer path to a standalone, effective product within the prototype timeframe.)

2.2 Ideation Boards

We ran our ideation as a live discussion rather than a separate whiteboarding session, so the full record of it is the table above in 2.1: every idea that came up (both the travel-track ones and the burnout-track alternative), and the reasoning behind keeping or dropping each one. The two chosen ideas — a collaborative live workspace and dynamic disruption replanning — emerged directly from that conversation once we'd mapped out the travel-planning pain points (scattered information, budget disagreement, fragile plans) against what was actually buildable in the timeframe.

2.3 Mentor Consultation
Date	Mentor	Feedback Received	What Was Changed
(add date)	(add mentor's name)	Pointed us to Mindtrip as a comparable product, and pushed back on forcing users to do all their planning input inside our own chat interface — suggested giving people a choice between importing an existing chat export or manually selecting constraints, plus using AI-generated clarifying questions to vet whether a proposed plan actually fits. Also gave a positive read on the Web3/stablecoin angle we'd floated, encouraging us to keep exploring it as a differentiator rather than dropping it.	We kept chat import as a core input path but scoped it down to research first: how to reliably pull the specific structured points we need out of an arbitrary chat export, rather than assuming free-form text maps cleanly onto our data model. We landed on a hybrid flow — the AI extracts from the imported (or live) chat straight into structured filters/preferences, which members can still adjust manually rather than re-entering everything by hand. We also added a few items to the roadmap directly from this conversation: a preference map view color-coded by priority (pending an audit pass), separate personal-vs-group tabs in preferences, shared cash accounts as a research item, and packaging the prototype as an installable app. The crypto-wallet / autonomous-agent-payment idea stays a later-stage stretch feature — attempted only once the core planning and replanning loop works, per our build order — rather than something in the initial prototype.

(Fill in the date and mentor's name above — everything else is written up from the discussion notes.)

3. Design & Prototype

UI Prototype (live, clickable): https://waypoint-snowy-tau.vercel.app/

Rather than static mockups, the link above is the actual working prototype — every screen below is something a judge can click through themselves. Key screens:

Landing — the pitch and trip-health snapshot, with a "Plan a Trip" entry point into the workspace.
Plan by talking — the chat interface where a group describes their trip naturally, or imports a real chat export; a live "Trip Understood" panel builds up next to it as the AI extracts details.
Structured trip filters — destination, dates, budget, and interest tags, auto-filled from the conversation and still manually editable — the "AI extracts, member confirms" principle made concrete.
Trip priorities — high priority ("must be included"), low priority ("nice to have"), and "can be sacrificed" selectors, which is exactly what the replanning engine leans on when a disruption forces a trade-off.
4. What Makes It Different
Conversation as the input, not a form. Waypoint extracts trip data directly from the natural language the group is already using — including real WhatsApp/Telegram exports — rather than asking travelers to re-enter what they've already discussed elsewhere.
Visible live capture. The single-page "detected → captured" dashboard makes the AI's extraction process visible in real time (a pattern borrowed from live-capture tools like tack.im, applied here to travel planning), rather than hiding it behind a black-box "generate itinerary" button.
Itinerary and budget replanned together. The dynamic replanning flow treats the itinerary and budget as one linked system: when a flight is delayed, lower-priority items get compressed or cut to protect the next hard constraint, instead of the whole plan just sliding later.
The AI proposes, the system enforces. The LLM generates possibilities from the conversation, but budgets, bookings, timing, and approval are all validated by deterministic backend code — nothing uncertain or consequential becomes part of the shared plan without a member confirming it. Most AI travel tools let the model's output become the plan directly; Waypoint treats that output as a draft that has to clear a rules engine first.
	Waypoint	TripIt	Typical group chat + spreadsheet
Collaborative input from natural conversation	Yes	No (manual email forwarding)	Partial (chat is the input, but nothing is structured)
Automatic replanning on disruption	Yes	No	No (manual re-edit)
Chat import (WhatsApp/Telegram)	Yes	No	N/A
5. Technical Architecture & Feasibility
Tech Stack
Backend: FastAPI (Python) — chosen for quick iteration and a natural fit with Pydantic, which is used to enforce typed, structured output from the LLM rather than trusting freeform text.
Database: PostgreSQL via Supabase — managed hosting plus built-in Auth and Realtime, which the live "detected → captured" dashboard needs to push trip-state updates without standing up a separate websocket service.
ORM / migrations: SQLAlchemy + Alembic, for a canonical trip-state schema that can evolve without hand-written migrations.
AI outputs: Pydantic-validated structured outputs from a single LLM provider — one provider is a deliberate scope reduction, and structured (not freeform) output is what makes it possible for deterministic code, not the model, to be the thing that decides feasibility.
Frontend: React + Vite (carried over from the current prototype), hosted on Vercel.
Maps: Google Maps/Places or Mapbox, for travel-time and route validation during planning.
Weather: WeatherAPI or OpenWeather, feeding the live weather-disruption monitoring stretch feature.
Background jobs: a scheduled worker polling for disruptions (e.g. flight status, weather) rather than instant push, to keep the first version simple.

Constraints to expect: leaning on Supabase for both Postgres and Auth/Realtime is fast to stand up but couples the team to Supabase's limits and to the latency of its Realtime channel for pushing live-capture updates to the dashboard. Committing to a single LLM provider reduces integration surface area but makes the "structured extraction" flow dependent on that provider's structured-output reliability — the mitigation is architectural: the LLM is never allowed to perform budget calculations or feasibility judgments itself, so a bad extraction gets caught by validation rather than silently becoming part of the plan.

Core Design Principle

Waypoint draws a hard line between what the AI is allowed to decide and what the system enforces: the AI generates possibilities from the chat conversation; budgets, bookings, timing, and approval rules are enforced by the system. Nothing uncertain or consequential silently becomes part of the shared plan. Concretely:

Every message is converted into structured objects — Booking, Budget, Preference, Proposal, Hard Constraint, Availability, Cancellation — each with a priority (high/medium/low) and a status (proposed/confirmed/rejected). The LLM extracts these, but uncertain extractions must be confirmed by a member before they affect the plan.
One canonical Trip State is the single authoritative representation: members, confirmed bookings, preferences, individual and shared budgets, the current itinerary, current location/time, active constraints, and unresolved conflicts.
During planning, the LLM proposes activities; deterministic code validates budget, opening hours, travel time, booking conflicts, member availability, and hard preferences. The LLM never performs budget calculations or decides feasibility itself.
Budget is tracked as a ledger of transactions (member, category, amount, currency, who paid, whether it's shared, associated itinerary item), not a single "remaining budget" field — remaining budget is always calculated from ledger entries, so it's auditable.
Group decisions run through lightweight voting: simple polls, accept/reject on replanning options, a majority threshold, and an individual veto specifically for hard constraints, with every outcome recorded.

Replanning flow: when a disruption occurs (e.g. a flight delay), Waypoint records the disruption, identifies the itinerary items it affects, preserves everything unaffected, generates two or three validated alternatives, ranks them by cost/disruption/preferences preserved, explains the trade-offs, waits for group approval through the voting system, applies the chosen option atomically, and logs the change to an audit log.

System Architecture / Canonical Data Model

[FILL IN: embed the system architecture diagram and canonical data model / ERD here once drawn]

Build Plan & Scope

The build is sequenced so each step only depends on what's already working, which is also how the team is keeping scope realistic rather than trying to build everything at once:

Trips, members, and chat messages
Structured AI extraction
Confirmation of extracted information by members
Trip-state and itinerary storage
Budget ledger
Initial itinerary generation and validation
Manual disruption trigger
Replanning options
Voting and approval
Weather monitoring
Web3 wallet — attempted only if everything above already works

Deliberately excluded from the initial build: a booking marketplace, payments, direct WhatsApp integration (as opposed to a paste-in export), automatic location monitoring, university oversight features, wearables, and multiple AI agents — each flagged as scope creep against the core planning-and-replanning loop.

Once the core model (through initial itinerary validation) is done, the team has ranked further upgrades by winning value against difficulty, for time-permitting stretch work:

Priority	Upgrade	Winning value	Difficulty
1	WhatsApp chat import	Very high	Low–medium
2	Visual trip dependency graph	Very high	Medium
3	Replanning impact comparison	Very high	Medium
4	Live weather disruption monitoring	High	Low–medium
5	Preference and sacrifice engine	High	Medium
6	Booking-email/document import	Medium–high	Medium
7	Maps and route validation	High	Medium
8	Notifications and offline access	Medium	Medium
9	Autonomous travel wallet	High novelty	Very high

See task progress for longer tasks.

README.md
waypoint-video-plan.md
waypoint-deck.pptx
waypoint-hackathon-submission.md
TravelMind
https://waypoint-snowy-tau.vercel.app
Waypoint
Skills
pptx
