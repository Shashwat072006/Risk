# Real-Time Transaction Risk Middleware
## Reference-Faithful Design & Animation Specification
### Based on the uploaded Next Tech Lab screen recording

> **Reference analyzed:** `Screen Recording 2026-09-04 201016.mp4`
>
> **Reference characteristics:** dark editorial landing page, white oversized typography, neon green/magenta/cyan accents, layered AI/robotics imagery, thin-line technical diagrams, floating labels, horizontal name marquees, large sectional transitions, asymmetric compositions, small top navigation, and subtle scroll-driven object movement.
>
> **Important:** this document now follows the **actual uploaded recording** rather than the earlier assumed QClay sequence. The content is adapted to a fraud/risk product, while the visual structure and interaction grammar remain faithful to the reference.

---

# 01. What the reference actually does

The recording is a **Next Tech Lab-style immersive agency landing page**, not a dashboard.

The page repeatedly returns to a recognizable hero composition and then changes the foreground content while keeping a shared visual world.

The major visual states visible in the recording are:

```text
HERO COLLAGE
     ↓
UNLEASH YOUR POTENTIAL
     ↓
HORIZONTAL / MARQUEE TEXT
     ↓
RECRUITING / NEXT-GEN BUILDERS
     ↓
AI / ROBOTICS COLLAGE
     ↓
MEET THE TEAM
     ↓
MEMBER / ASSOCIATE / SYNDICATE CARDS
     ↓
NORMAL LAB / PROFILE CONTENT
     ↓
HERO COLLAGE
```

The page is intentionally **cyclical**: the same hero visual language can reappear after other content states.

---

# 02. Product translation

The new experience should become a **fraud-intelligence product website** rather than an agency website.

### Reference → Product mapping

| Reference visual/module | Fraud product equivalent |
|---|---|
| Next Tech Lab | Risk//01 |
| AI / robotics collage | Fraud-intelligence visual system |
| “Unleash your potential” | “Catch risk before it becomes loss.” |
| Recruiting next-gen builders | “Protect every transaction.” |
| Meet the Team | Meet the Risk Engine |
| Member / Associate / Syndicate | Rules / Models / Signals |
| Norman Lab | Risk Lab |
| Personal / lab profile | Transaction investigation profile |
| Hero return | Return to live risk overview |

The **composition should remain similar**, while the subject matter becomes payments, fraud, risk, ML, and chargebacks.

---

# 03. Global visual language

## Background

The reference is predominantly:

```text
#050505
```

with near-black gradients.

Do not use a conventional SaaS gray dashboard background.

Use:

```css
background: #050505;
color: #F4F4F0;
```

---

## Accent colors

The recording uses high-energy fluorescent accents.

Use:

```text
acid green
electric magenta
signal cyan
warm orange
```

These should appear as small highlights rather than filling the whole interface.

Suggested tokens:

```css
--acid-green: #39FF88;
--magenta: #E600FF;
--cyan: #00F6FF;
--orange: #FFA31A;
--paper: #F4F4EE;
--black: #050505;
```

**Do not assign these colors to semantic risk states globally.**

For example, magenta should not automatically mean "fraud" just because it is an accent. Keep semantic risk colors separate:

```text
Approved   → green
Review     → amber
Blocked    → red
Decorative → green / magenta / cyan
```

---

# 04. Typography

The most important characteristic of the reference is **huge editorial type**.

Do not use a normal dashboard font scale.

### Hero

```text
110–180px desktop
font-weight: 500–700
uppercase / title case depending on phrase
letter-spacing: -0.055em
line-height: .82–.92
```

### Section heading

```text
70–120px
```

### Body

```text
13–18px
max-width: 520px
```

### Metadata

```text
9–11px
uppercase
letter-spacing: .08em
```

The headline should often extend across the page:

```text
CATCH RISK
BEFORE IT
BECOMES LOSS.
```

---

# 05. Header — exact visual role

The header is very small compared with the content.

Place it inside a large black hero.

```text
┌────────────────────────────────────────────────────────────┐
│ RISK//01          Live   Engine   Signals   Lab   Contact │
└────────────────────────────────────────────────────────────┘
```

### Dimensions

```text
height: 44–58px
horizontal padding: 24–42px
```

### Typography

```text
9–11px
```

Do not create a giant SaaS navigation bar.

---

# 06. HERO — Main reference composition

The reference's hero is a **collage of multiple image/object layers**, not one flat background.

The composition contains:

- multiple AI/robotics subjects
- floating UI/technical panels
- translucent diagram lines
- neon colored shapes
- a large center/lower visual cluster
- oversized left/right page title
- small metadata
- floating objects behind typography

### Product version

Use:

```text
left       → "REAL-TIME"
center     → risk/intelligence collage
right      → "RISK"
bottom     → "MIDDLEWARE"
```

Suggested hero:

```text
                           ┌─────────────┐
       green telemetry    │ DEVICE GRAPH│
                           └─────────────┘

              [ ML MODEL / RISK VISUAL ]

   REAL-TIME                                 RISK
                                             MIDDLEWARE

       card        graph         payment       device
```

The objects should overlap the typography.

---

# 07. Hero visual assets

The strongest fidelity comes from treating the hero as **layered art direction**.

Create approximately 10–16 independent layers:

```text
01 background noise
02 dark grid
03 green holographic panel
04 central subject
05 left purple subject
06 right device/payment object
07 node graph
08 floating transaction card
09 thin orange line graph
10 magenta light block
11 small labels
12 dust / grain
13 foreground object
14 CTA / status chip
15 cursor / pointer
```

Each layer gets its own transform.

### Example

```text
layer 01
x = 0
y = 0
z = 0

layer 02
x = -0.5%
y = 0.2%
z = 10

layer 03
x = +1.5%
y = -1.0%
z = 30

layer 04
x = -2%
y = +1.5%
z = 60
```

This creates the depth seen in the reference.

---

# 08. Hero animation

The animation should not be a generic fade-in.

It should feel like the artwork is **already alive**.

### Continuous motion

```text
green panel       ±4px
purple object     ±7px
center subject    ±3px
graph             ±2px
small labels      ±1px
```

Durations:

```text
5–10 seconds
ease: sine.inOut
repeat: infinite
yoyo: true
```

### Cursor parallax

Pointer movement should shift visual layers by depth:

```text
mouse X → ±12px
mouse Y → ±8px
```

Do not move typography as much as the artwork.

---

# 09. Hero title animation

The reference repeatedly uses large text that is visually integrated into the collage.

Build title lines independently:

```text
REAL-TIME
TRANSACTION RISK
MIDDLEWARE
```

Initial state:

```text
opacity: 0
transform: translateY(20px)
```

Enter:

```text
opacity: 1
transform: translateY(0)
```

Use stagger:

```text
70–100ms
```

But after entrance, do **not** continuously animate the title.

---

# 10. Section: “Unleash your potential” translation

The recording has a section with a small heading and long descriptive text while an oversized object occupies the opposite side.

Replace with:

```text
CATCH RISK BEFORE
IT BECOMES LOSS.
```

Small body:

```text
A real-time transaction risk layer that combines behavioral
signals, deterministic rules, and machine learning before
authorization turns into fraud, dispute, or chargeback.
```

Place a small outlined CTA:

```text
[ Explore the engine → ]
```

### Object

Use the reference's large technical/robotic-object role for:

```text
large payment-risk visualization
```

Possible subject:

```text
3D card + device + network nodes
```

---

# 11. Text marquee — direct reference behavior

The recording contains giant colored names/text moving horizontally across the page.

This should become:

```text
VELOCITY *
DEVICE *
IDENTITY *
BEHAVIOR *
GEO *
NETWORK *
PAYMENT *
CHARGEBACK *
```

### Marquee styling

```text
font-size: 60–110px
white-space: nowrap
```

Use individual words with accent colors.

Example:

```text
VELOCITY * DEVICE * BEHAVIOR * GEO * CHARGEBACK *
```

### Animation

```text
translateX(0 → -50%)
duration: 30–45s
linear
repeat: infinite
```

Have a duplicated content track to make the loop seamless.

---

# 12. Recruitment section → “Protect every transaction”

The source uses an editorial image block and a right-side text block with a strong statement.

Product version:

```text
[ layered security / payment image ]

WE'RE BUILDING THE
NEXT GENERATION OF
TRANSACTION DEFENSE.
```

Supporting copy:

```text
One decision layer for fraud detection,
risk scoring, intervention, and feedback.
```

CTA:

```text
[ Explore risk intelligence → ]
```

### Accent

A small heart-like / badge-like visual in the reference becomes:

```text
● LIVE
```

or

```text
RISK//ACTIVE
```

Use an actual small circular status mark.

---

# 13. AI / Robotics collage → Risk Intelligence collage

The reference contains a full-width AI/robotics composition.

This should become the **signature product visual**.

### Composition

```text
                 DEVICE GRAPH
                      │
       ┌──────────────┼──────────────┐
       │              │              │
     USER           PAYMENT        NETWORK
       │              │              │
       └──────────────┼──────────────┘
                      │
                 ML DECISION
                      │
               APPROVE / REVIEW / BLOCK
```

Overlay actual 3D objects:

```text
phone
payment card
laptop
device fingerprint
network nodes
shield
```

The visual should look like an editorial art piece, not an architecture diagram pasted onto the page.

---

# 14. Diagram animation

The reference's technical shapes move subtly rather than behaving like a data chart.

Animate:

```text
nodes → slow pulse
lines → slight opacity breathing
floating labels → ±4px
image layers → parallax
```

On hover:

```text
selected node → scale 1.15
connected nodes → increase opacity
unrelated nodes → decrease opacity
```

This creates a visual analogue of the reference's technical collage.

---

# 15. “Meet the Team” → “Meet the Risk Engine”

The recording changes into a structured editorial section with a strong left heading and individual role/card areas.

Replace:

```text
MEET
THE
RISK
ENGINE
```

Left side explanatory content:

```text
Rules
Deterministic controls that act immediately.

Model
Adaptive scoring based on historical behavior.

Signals
Real-time context from device, identity,
network, payment and velocity.

Decision
One explainable outcome in milliseconds.
```

Right side:

```text
[ RULE ENGINE ]
[ ML MODEL ]
[ FEATURE STORE ]
[ DECISION ENGINE ]
```

---

# 16. Role cards → Engine cards

The reference uses individual people/role cards.

Create four large cards:

```text
01
RULE ENGINE

02
FEATURE ENGINE

03
MODEL ENGINE

04
DECISION ENGINE
```

Card backgrounds should remain mostly black with subtle purple/green technical imagery.

---

# 17. Member / Associate / Syndicate → Risk layers

Preserve the same naming/card hierarchy but adapt the labels:

```text
SIGNALS
MODELS
DECISIONS
```

A possible composition:

```text
SIGNALS
Device
Identity
Velocity
Geo
Payment

MODELS
Fraud
ATO
Chargeback

DECISIONS
Approve
Challenge
Block
```

Use large section numbers.

---

# 18. Card behavior

Cards should not behave like normal clickable SaaS cards.

### Default

```text
dark image
small metadata
large label
```

### Hover

```text
image scale: 1.05
card translateY: -4px
accent line appears
metadata shifts 2–4px
```

Duration:

```text
450ms
```

### Focus

Add a thin accent border.

---

# 19. “Norman Lab” → “Risk Lab”

The recording includes a profile/lab-style editorial area with a large title and image.

Replace with:

```text
RISK LAB
```

Description:

```text
Research, evaluation and model iteration for
real-time fraud, account takeover and chargeback risk.
```

Image:

```text
monochrome / grainy research image
```

Accent:

```text
tiny green label:
MODEL v23
```

---

# 20. Risk Lab interaction

Use a split editorial layout:

```text
┌─────────────────────┬─────────────────────────────┐
│ RISK                │                             │
│ LAB                 │   LARGE IMAGE / VIDEO      │
│                     │                             │
│ Model v23           │                             │
│ Rules v41           │                             │
│ Feature set 8.2     │                             │
└─────────────────────┴─────────────────────────────┘
```

The image should slowly zoom:

```text
scale 1.00 → 1.04
```

during viewport entry.

---

# 21. Transaction Profile section

Translate the reference's profile content into a **real risk investigation detail**.

```text
TRANSACTION
#TX-948201

RISK SCORE
82

DECISION
BLOCK

MODEL
fraud-v23

RULES
velocity_5m
device_novelty
geo_anomaly
```

### Visual treatment

Do not show this as a conventional table.

Use:

```text
large typography
+
small monospace labels
+
thin dividers
+
floating image/diagram
```

---

# 22. Hero return

The recording returns to the hero state several times.

Reproduce this using shared components rather than duplicating the hero.

Concept:

```text
section-specific foreground
       ↓
hero foreground opacity increases
       ↓
objects reposition
       ↓
hero title returns
```

This should feel like returning to the same physical scene.

---

# 23. Exact page architecture

```text
<App>

  <Header />

  <HeroWorld />

  <RiskStatement />

  <RiskMarquee />

  <ProtectEveryTransaction />

  <RiskIntelligenceCollage />

  <RiskEngine />

  <RiskLayerCards />

  <RiskLab />

  <TransactionProfile />

  <HeroWorld mode="final" />

</App>
```

---

# 24. Recommended animation stack

Use:

```text
Next.js
GSAP
ScrollTrigger
Lenis
Three.js / React Three Fiber
SVG
```

### Why GSAP

This reference depends on:

- scroll-linked transforms
- overlapping entrances
- long-running timelines
- pinned regions
- staggered text
- synchronized image movement

GSAP + ScrollTrigger maps naturally to this behavior.

---

# 25. Scroll behavior

Use a smooth-scrolling layer:

```text
Lenis
```

Then map scroll progress into the scene:

```text
hero scale
hero object y
marquee x
section opacity
3D object rotation
card y
image scale
```

The page should feel **cinematic rather than app-like**.

---

# 26. Section transitions

Avoid hard cuts.

### Example

```text
Hero
  ↓
hero objects move upward
  ↓
headline reduces in scale
  ↓
next text enters
  ↓
background remains black
  ↓
marquee crosses viewport
  ↓
image block becomes dominant
```

A section should appear to emerge from the previous section.

---

# 27. Icon system

The reference uses small, restrained symbols.

Do not use:

```text
Material dashboard icons
large illustrative SVGs
emoji
```

Use:

```text
→
↗
+
•
×
◌
```

and a small set of original technical line icons.

### Product-specific icons

```text
Device
        ◌

Identity
        ◎

Velocity
        ≋

Geo
        ⌖

Payment
        ▣

Decision
        →
```

Keep icons:

```text
1–2px stroke
16–28px
monochrome
```

---

# 28. Noise / grain

The recording has a dark, slightly textured visual feel.

Add a subtle film grain overlay:

```css
mix-blend-mode: screen;
opacity: .03–.06;
pointer-events: none;
```

Do not overdo it.

The grain should be almost subconscious.

---

# 29. Image treatment

Reference images are integrated into the artwork rather than appearing as generic rectangular thumbnails.

Use:

```text
mix-blend-mode
mask-image
gradient overlays
rounded / irregular crops
```

Suggested treatments:

```text
monochrome
high contrast
purple tint
green edge glow
black background removal
```

Use original or licensed imagery.

---

# 30. Technical architecture

```text
Next.js App Router
      │
      ├── Header
      ├── Hero World
      ├── Editorial Sections
      ├── SVG Network
      └── Risk UI
              │
              ├── Risk API
              ├── Feature Store
              ├── Rule Engine
              ├── ML Model
              └── Decision Engine
```

Frontend can consume:

```http
GET /api/risk/overview
GET /api/risk/live
GET /api/risk/transactions/:id
GET /api/risk/models
GET /api/risk/rules
```

---

# 31. Live risk visual

Because this is a product, the visual world should still expose the underlying functionality.

Hero status:

```text
● RISK ENGINE LIVE
```

Small live values:

```text
1.42M TRANSACTIONS
42ms MEDIAN DECISION
98.7% AVAILABILITY
```

These should update without turning the hero into a dashboard.

---

# 32. Responsive implementation

The desktop reference is composition-heavy.

Do not simply shrink everything.

### Mobile

Hero:

```text
REAL-TIME
RISK
```

with a reduced object collage.

Marquee becomes:

```text
horizontal scroll / loop
```

Team-style cards become:

```text
one-column vertical cards
```

The risk collage becomes:

```text
stacked object composition
```

Avoid trying to preserve every overlapping layer if it hurts readability or performance.

---

# 33. Performance

The design is visually expensive.

Target:

```text
60 FPS desktop
50+ FPS laptop
```

Use:

```text
transform
opacity
will-change selectively
GPU compositing
lazy-loading
requestAnimationFrame
```

For 3D:

```text
low-poly geometry
compressed textures
limited draw calls
```

Pause complex animations when off-screen.

---

# 34. Reduced motion

Required:

```css
@media (prefers-reduced-motion: reduce)
```

Behavior:

```text
Disable parallax
Disable continuous object floating
Disable long marquees
Disable large scale transitions
Keep opacity transitions short
```

The site should still make sense as a static editorial page.

---

# 35. Asset pipeline

Recommended:

```text
/public
  /hero
  /risk-lab
  /collage
  /textures
  /icons
  /fonts
```

Prefer:

```text
WebP
AVIF
WebM
SVG
```

Keep hero media compressed.

---

# 36. Component structure

```text
components/
├── Header.tsx
├── HeroWorld.tsx
├── HeroLayer.tsx
├── EditorialStatement.tsx
├── RiskMarquee.tsx
├── ProtectSection.tsx
├── RiskCollage.tsx
├── RiskEngine.tsx
├── EngineCard.tsx
├── RiskLayerCards.tsx
├── RiskLab.tsx
├── TransactionProfile.tsx
├── FloatingMeta.tsx
└── ArrowButton.tsx
```

Animations:

```text
animations/
├── hero.ts
├── marquee.ts
├── reveal.ts
├── cards.ts
├── collage.ts
└── transitions.ts
```

---

# 37. Acceptance criteria — reference fidelity

The implementation is not finished until all of these are true:

```text
[ ] Dark editorial canvas throughout
[ ] Small compact top navigation
[ ] Huge hero typography
[ ] Hero is a layered collage, not a flat image
[ ] Multiple objects have independent parallax
[ ] Neon green / magenta / cyan accent details
[ ] Technical line-art / graph elements
[ ] Giant moving text marquee
[ ] Editorial image + text recruitment-style section
[ ] Full-width AI/risk collage
[ ] Structured “Meet the Risk Engine” section
[ ] Large numbered engine cards
[ ] Risk Lab profile section
[ ] Transaction profile section
[ ] Thin dividers and tiny metadata
[ ] Hero visual returns at the end
[ ] Scroll-driven transitions connect sections
[ ] Hover states are subtle
[ ] No generic SaaS dashboard styling
[ ] No giant Material-style icons
[ ] No hard section cuts
[ ] Reduced-motion mode exists
```

---

# 38. Final copy direction

## Hero

```text
REAL-TIME
TRANSACTION RISK
MIDDLEWARE
```

Small:

```text
FRAUD + CHARGEBACK DEFENSE
```

---

## Statement

```text
CATCH RISK
BEFORE IT
BECOMES LOSS.
```

---

## Marquee

```text
VELOCITY *
DEVICE *
IDENTITY *
BEHAVIOR *
GEO *
NETWORK *
PAYMENT *
CHARGEBACK *
```

---

## Product statement

```text
WE'RE BUILDING
THE NEXT GENERATION
OF TRANSACTION
DEFENSE.
```

---

## Engine

```text
MEET
THE
RISK
ENGINE.
```

---

## Risk Lab

```text
RISK LAB
```

Supporting:

```text
Experiment. Evaluate. Deploy.
```

---

# 39. Most important implementation note

**Do not reproduce this reference by taking screenshots from the video and placing them as website sections.**

The correct implementation is:

```text
same composition
+
same interaction language
+
same animation rhythm
+
same typography scale
+
same visual density
+
new original assets
+
fraud/risk product content
```

That gives the desired “same as the video” experience without turning the site into a static video wrapper.

---

# 40. One-sentence creative direction

> **Build the fraud platform as if a futuristic AI research studio designed a financial-security product — cinematic black space, oversized typography, layered technical objects, fluorescent signals, and continuous scroll choreography.**
