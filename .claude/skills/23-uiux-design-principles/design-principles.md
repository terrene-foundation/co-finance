# UI/UX Design Principles & Guidelines

## Table of Contents
1. [Top-Down Design Methodology](#top-down-design-methodology)
2. [Layout & Information Architecture](#layout--information-architecture)
3. [Visual Hierarchy Principles](#visual-hierarchy-principles)
4. [Enterprise UX Patterns](#enterprise-ux-patterns)
5. [Component Design Guidelines](#component-design-guidelines)
6. [Responsive Design Patterns](#responsive-design-patterns)
7. [Accessibility Standards](#accessibility-standards)
8. [Design System Principles](#design-system-principles)
9. [Common Pitfalls & Solutions](#common-pitfalls--solutions)

---

## Top-Down Design Methodology

### The Hierarchy of Design Concerns

**Always design and evaluate in this order:**

```
┌─────────────────────────────────────────────────────────┐
│ LEVEL 1: FRAME/LAYOUT (Highest Priority)               │
│ • Space division and proportions                        │
│ • Visual hierarchy and focal points                     │
│ • Information architecture                              │
│ • Content-first design                                  │
└─────────────────────────────────────────────────────────┘
              ↓ Only after Level 1 is optimized
┌─────────────────────────────────────────────────────────┐
│ LEVEL 2: FEATURE COMMUNICATION                          │
│ • Discoverability of key features                       │
│ • Action hierarchy (primary/secondary/tertiary)         │
│ • Navigation patterns                                   │
│ • Progressive disclosure                                │
└─────────────────────────────────────────────────────────┘
              ↓ Only after Level 2 is optimized
┌─────────────────────────────────────────────────────────┐
│ LEVEL 3: COMPONENT EFFECTIVENESS                        │
│ • Widget appropriateness (list/grid/table)              │
│ • Interaction patterns                                  │
│ • Feedback mechanisms                                   │
│ • Loading/empty/error states                            │
└─────────────────────────────────────────────────────────┘
              ↓ Only after Level 3 is optimized
┌─────────────────────────────────────────────────────────┐
│ LEVEL 4: VISUAL DETAILS (Lowest Priority)              │
│ • Colors and color harmony                              │
│ • Shadows and depth                                     │
│ • Animations and micro-interactions                     │
│ • Typography refinements                                │
└─────────────────────────────────────────────────────────┘
```

### Why This Order Matters

**Anti-Pattern (Bottom-Up Design):**
❌ "Let's make the shadows perfect first"
- Problem: You might perfect shadows on a card that's in the wrong place
- Result: Wasted effort on details that don't solve user problems

**Correct Pattern (Top-Down Design):**
✅ "Does this layout give important content enough space?"
- Benefit: Solves fundamental usability issues first
- Result: Efficient design decisions that improve user experience

---

## Layout & Information Architecture

### Grid Systems

#### 12-Column Grid (Desktop Standard)
```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │  5  │  6  │  7  │  8  │  9  │ 10  │ 11  │ 12  │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘

Common Patterns:
• Sidebar (3) + Content (9) = 25/75 split
• Sidebar (4) + Content (8) = 33/67 split
• Two-column (6 + 6) = 50/50 split
• Three-column (4 + 4 + 4) = 33/33/33 split
```

#### Space Division Principles

**The 70/30 Rule:**
- 70% of space = primary content (what user came to see/do)
- 30% of space = secondary UI (navigation, filters, chrome)

**Example: Contact Management**
```
GOOD:
┌─────────────────────────────────────────────────────────┐
│ NAV   │ CONTACTS (70% of remaining space)               │
│ (20%) │ Primary content: Contact list, details           │
│       │                                                  │
└─────────────────────────────────────────────────────────┘

BAD:
┌─────────────────────────────────────────────────────────┐
│ NAV   │ FILTERS │ SIDEBAR │ CONTACTS (40%)              │
│ (20%) │  (20%)  │  (20%)  │ Too many UI elements        │
└─────────────────────────────────────────────────────────┘
```

### Visual Hierarchy Laws

#### F-Pattern (Text-Heavy Interfaces)
Users scan horizontally at the top, then vertically down the left side.

```
█████████████░░░░░░░  ← Strong horizontal scan
█████░░░░░░░░░░░░░░░
█░░░░░░░░░░░░░░░░░░░  ← Weak horizontal scan
█░░░░░░░░░░░░░░░░░░░
█░░░░░░░░░░░░░░░░░░░  ↓ Vertical scan down left
█░░░░░░░░░░░░░░░░░░░
```

**Design Implications:**
- Place logo, site title at top-left
- Place primary navigation at top
- Align key content down left edge
- Important info = top-left quadrant

#### Z-Pattern (Visual/Action-Heavy Interfaces)
Users follow a Z-shaped pattern across the page.

```
1 ─────────────→ 2    Top-left to top-right
 ╲               ↓
  ╲              ↓
   ╲             ↓
    ╲            ↓
     ╲           ↓
      ╲          ↓
       ↘         ↓
3 ─────────────→ 4    Bottom-left to bottom-right
```

**Design Implications:**
- 1: Logo/branding (top-left)
- 2: Primary CTA (top-right)
- 3: Supporting info (bottom-left)
- 4: Secondary CTA (bottom-right)

#### Inverted Pyramid (Information Hierarchy)
Present information from most to least important.

```
       ┌───────────────────┐
       │   KEY INSIGHTS    │  Most important (top)
       ├───────────────────┤
       │   OVERVIEW DATA   │  Overview/trends
      ┌┴───────────────────┴┐
      │   DETAILED METRICS  │  Granular details
     ┌┴─────────────────────┴┐
     │   RAW DATA / FILTERS  │  Least important (bottom)
     └───────────────────────┘
```

**Application to Dashboards:**
```
TOP:    Metric cards (total contacts, new this week)
MIDDLE: Charts/graphs (trends over time)
BOTTOM: Data tables (individual contact records)
```

### Information Architecture Patterns

#### Dashboard-First Pattern (Enterprise Apps)
Show aggregated insights before detail views.

```
USER JOURNEY:
Dashboard (overview) → List (filtered subset) → Detail (single record)
     ↓                       ↓                        ↓
  "What's happening?"   "Show me X contacts"    "Tell me about Alice"
```

#### Progressive Disclosure
Reveal information in layers as needed.

```
LAYER 1 (Always Visible):
• Essential data: Name, title, organization
• Primary actions: Email, Call

LAYER 2 (On Hover/Expand):
• Extended data: Sectors, tags, phone number
• Secondary actions: Edit, View profile

LAYER 3 (On Detail Page):
• Complete data: Full interaction history, notes
• Tertiary actions: Delete, Export, Share
```

---

## Visual Hierarchy Principles

### Size & Weight Hierarchy

**Typography Scale Example:**
```
Display:    48px / Bold    → Page titles
H1:         32px / Bold    → Section titles
H2:         24px / SemiBold → Subsection titles
H3:         18px / SemiBold → Card titles
Body:       16px / Regular  → Paragraph text
Small:      14px / Regular  → Labels, captions
Tiny:       12px / Regular  → Helper text
```

**Visual Weight Formula:**
```
Importance = (Size × Weight × Color Contrast × Position)

HIGH IMPORTANCE:
• Large size (24px+)
• Bold weight (600-700)
• High contrast (dark on light, or brand color)
• Top/left position

LOW IMPORTANCE:
• Small size (12-14px)
• Regular weight (400)
• Low contrast (gray text)
• Bottom/right position
```

### Color for Hierarchy (Not Just Aesthetics)

**Semantic Color Usage:**
```
PRIMARY BLUE:
✅ Primary actions (Save, Submit, Add)
✅ Active state (selected tab, current page)
✅ Interactive elements (links, buttons)
❌ Decorative elements
❌ Large backgrounds

GRAY SCALE:
✅ Text hierarchy (black → dark gray → medium gray → light gray)
✅ Borders and dividers
✅ Disabled states
✅ Backgrounds

SUCCESS GREEN:
✅ Positive actions (Confirm, Approve, Complete)
✅ Success messages
✅ Positive metrics (+23% growth)

WARNING ORANGE:
✅ Caution actions (Archive, Unpublish)
✅ Warning messages
✅ Attention-needed indicators

ERROR RED:
✅ Destructive actions (Delete, Remove)
✅ Error messages
✅ Validation errors
```

### Position & Proximity

**Reading Priority by Position:**
```
┌─────────────────────────────────────┐
│ 1. TOP-LEFT        2. TOP-RIGHT    │ ← Highest priority
│                                     │
│ 3. CENTER-LEFT     4. CENTER-RIGHT │ ← Medium priority
│                                     │
│ 5. BOTTOM-LEFT     6. BOTTOM-RIGHT │ ← Lowest priority
└─────────────────────────────────────┘
```

**Proximity Principle (Gestalt):**
Elements that are close together are perceived as related.

```
GOOD (Related items grouped):
┌─────────────────────┐
│ Name: Alice Johnson │
│ Title: Director     │  ← Close spacing (related)
│ Org: ACME Corp      │
│                     │  ← Large gap (unrelated)
│ [Email] [Call]      │
└─────────────────────┘

BAD (Unrelated spacing):
┌─────────────────────┐
│ Name: Alice Johnson │
│                     │  ← Large gap (confusing)
│ Title: Director     │
│ Org: ACME Corp      │
│                     │
│ [Email] [Call]      │
└─────────────────────┘
```

---

## Enterprise UX Patterns

### Action Hierarchy

#### Primary Actions (1 per page)
**Characteristics:**
- Large filled button (48px height)
- Brand color background
- Top-right or bottom-right position
- Always visible (persistent)

**Examples:**
- "+ Add Contact" on contacts list
- "Save" on edit forms
- "Send" on email compose

**Visual Spec:**
```dart
AppButton.primary(
  label: 'Add Contact',
  height: 48,
  minWidth: 140,
  fontSize: 16,
  fontWeight: FontWeight.w600,
)
```

#### Secondary Actions (2-3 per page)
**Characteristics:**
- Medium outlined button (40px height)
- No background fill
- Near primary action
- Visible but less prominent

**Examples:**
- "Cancel" next to "Save"
- "Export" next to "Add Contact"
- "Import" next to "Export"

**Visual Spec:**
```dart
AppButton.outlined(
  label: 'Cancel',
  height: 40,
  minWidth: 100,
  fontSize: 14,
  fontWeight: FontWeight.w500,
)
```

#### Tertiary Actions (unlimited)
**Characteristics:**
- Small text button or icon button (32px height)
- No borders or backgrounds
- Contextual (appear on hover, in menus)
- Low visual weight

**Examples:**
- "Edit" in card hover menu
- "Delete" in "..." overflow menu
- "View details" as text link

**Visual Spec:**
```dart
AppButton.text(
  label: 'Edit',
  height: 32,
  fontSize: 14,
  fontWeight: FontWeight.w400,
)
```

### Search & Filter Patterns

#### Pattern 1: Persistent Sidebar (Data-Heavy Apps)
**When to use:** 5+ filter types, frequent filtering

```
┌─────────────────────────────────────────────────────┐
│ NAV │ FILTERS (300px) │ RESULTS (flexible)          │
│     │ • Sector        │                             │
│     │ • Geography     │ [Grid of filtered results]  │
│     │ • Source        │                             │
│     │ • Tags          │                             │
│     │ • Date Range    │                             │
└─────────────────────────────────────────────────────┘

Pros: All filters visible, fast filtering
Cons: Takes 25% of space, may overwhelm users
```

#### Pattern 2: Collapsible Sidebar (Occasional Filtering)
**When to use:** 3-5 filter types, occasional use

```
DEFAULT STATE (Filters Hidden):
┌─────────────────────────────────────────────────────┐
│ NAV │ RESULTS (100% width)                          │
│     │ [Filters: 3 active ▼] [+ Add]                │
│     │                                               │
│     │ [Grid with 50% more space]                   │
└─────────────────────────────────────────────────────┘

EXPANDED STATE (User Clicks "Filters"):
┌─────────────────────────────────────────────────────┐
│ NAV │ RESULTS (dim) │ FILTERS (400px slide-over)    │
│     │               │ [✕ Close]                     │
│     │               │ • Sector                      │
│     │               │ • Geography                   │
│     │               │ [Apply] [Clear]               │
└─────────────────────────────────────────────────────┘

Pros: More content space, less overwhelming
Cons: Filters not visible by default
```

#### Pattern 3: Horizontal Bar (Simple Filtering)
**When to use:** 1-3 filter types, always used together

```
┌─────────────────────────────────────────────────────┐
│ NAV │ RESULTS                                       │
│     │ [Search] [Sector ▼] [Geography ▼] [+ Add]    │
│     │                                               │
│     │ [Grid with full vertical space]              │
└─────────────────────────────────────────────────────┘

Pros: Compact, no sidebar needed
Cons: Limited to 3-4 filters max
```

### List vs Grid vs Table

#### Use Grid When:
✅ Visual browsing is important (faces, photos, logos)
✅ 10-100 items to display
✅ Mixed metadata (name, title, tags, etc.)
✅ User needs to scan and compare visually

**Specs:**
- Card height: 100-120px
- Columns: 2-4 (responsive)
- Aspect ratio: 2:1 to 3:1
- Gap: 16-24px

#### Use Table When:
✅ Data comparison is critical (sorting, filtering)
✅ 50-10,000 items to display
✅ Structured data with many fields
✅ User needs to perform bulk actions

**Specs:**
- Row height: 48-56px (compact: 32-40px)
- Columns: 3-8 visible fields
- Sortable headers
- Sticky header on scroll

#### Use List When:
✅ Mobile/narrow screens
✅ Fewer than 20 items
✅ Full-width layout preferred
✅ Vertical scrolling is natural

**Specs:**
- Item height: 64-80px
- Full width (single column)
- Dividers between items
- Swipe actions for mobile

### Bulk Actions Pattern

**Selection + Toolbar:**
```
DEFAULT (No Selection):
┌─────────────────────────────────────────────────────┐
│ [Search] [Filters ▼] [+ Add Contact]               │
│                                                     │
│ □ Contact Card 1                                    │
│ □ Contact Card 2                                    │
│ □ Contact Card 3                                    │
└─────────────────────────────────────────────────────┘

WITH SELECTION (3 Selected):
┌─────────────────────────────────────────────────────┐
│ 3 selected [✉ Email All] [↓ Export] [🗑 Delete]    │
│            [✕ Clear]                                │
│ ☑ Contact Card 1                                    │
│ ☑ Contact Card 2                                    │
│ □ Contact Card 3                                    │
│ ☑ Contact Card 4                                    │
└─────────────────────────────────────────────────────┘
```

**Keyboard Shortcuts:**
- `Cmd/Ctrl + Click` = Toggle individual
- `Shift + Click` = Select range
- `Cmd/Ctrl + A` = Select all
- `Escape` = Clear selection

---

## Component Design Guidelines

### Cards

#### Anatomy of a Good Card
```
┌─────────────────────────────────────────────────────┐
│ [48px Avatar] PRIMARY TEXT (18px bold)             │
│               Secondary text (14px medium)          │
│               Tertiary text (14px gray)             │
│               [Tag] [Tag] [+N]                      │
│               (12px chips, max 2-3 visible)         │
│                                          [Action >] │
└─────────────────────────────────────────────────────┘
```

**Spacing:**
- Padding: 16-24px
- Avatar to text: 12-16px
- Text to text: 4-8px
- Text to chips: 8-12px
- Chips to edge: 16-24px

**States:**
- Default: Light shadow (0 2px 4px rgba(0,0,0,0.1))
- Hover: Elevated shadow (0 4px 8px rgba(0,0,0,0.15)) + translate(-2px)
- Pressed: Compressed (scale 0.98)
- Selected: Border (2px primary color)

### Buttons

#### Size Variants
```
LARGE (48px):
[          Primary Action          ]
Use for: Primary CTAs, hero buttons

MEDIUM (40px):
[    Secondary Action    ]
Use for: Secondary CTAs, form buttons

SMALL (32px):
[  Tertiary  ]
Use for: Inline actions, toolbar buttons
```

#### Style Variants
```
PRIMARY (Filled):
Use for: Main action (1 per page)
Background: Brand color
Text: White

SECONDARY (Outlined):
Use for: Important but not primary (2-3 per page)
Background: Transparent
Border: Brand color
Text: Brand color

TERTIARY (Text):
Use for: Less important actions (unlimited)
Background: Transparent
Border: None
Text: Gray (hover: brand color)

DANGER (Filled Red):
Use for: Destructive actions
Background: Error red
Text: White
```

### Empty States

#### Components of a Good Empty State
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                  [Icon 64-96px]                     │
│                                                     │
│              Primary Message (H3)                   │
│          "No contacts match your filters"           │
│                                                     │
│           Secondary Message (Body)                  │
│     "Try adjusting your search or filters"          │
│                                                     │
│            [Primary CTA Button]                     │
│              "Clear Filters"                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Guidelines:**
1. **Be specific**: "No results" vs "No contacts found for 'Healthcare' in 'North America'"
2. **Offer solutions**: Show next steps or suggestions
3. **Use appropriate tone**: Encouraging, not punishing
4. **Visual clarity**: Large icon, clear hierarchy
5. **Primary CTA**: Make the solution obvious

### Loading States

#### Pattern 1: Skeleton Screens (Best for Content)
```
┌─────────────────────────────────────────────────────┐
│ [○] ████████████░░░░░░░░                           │
│     ██████████████████░░░░░░                       │
│     █████████░░░░░░░░░░░░░░                        │
│     [█] [█] [█]                                     │
└─────────────────────────────────────────────────────┘

Animated shimmer effect (1.5s loop)
```

**When to use:**
✅ Initial page load
✅ Infinite scroll loading next page
✅ Data-heavy interfaces

#### Pattern 2: Spinner (For Quick Operations)
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    [◐ Loading...]                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**When to use:**
✅ Form submission (< 3 seconds)
✅ Quick API calls
✅ Inline actions (delete, update)

#### Pattern 3: Progress Bar (For Long Operations)
```
┌─────────────────────────────────────────────────────┐
│ Importing contacts...                               │
│ ████████████████░░░░░░░░░░░ 62%                    │
│ Processing record 621 of 1,000                      │
└─────────────────────────────────────────────────────┘
```

**When to use:**
✅ File uploads/downloads
✅ Bulk operations (import, export, delete)
✅ Multi-step processes

---

## Responsive Design Patterns

### Breakpoints

```
Mobile:  < 768px   (Phone portrait/landscape)
Tablet:  768-1023  (iPad portrait, small laptops)
Desktop: 1024-1439 (Standard desktop)
Wide:    ≥ 1440    (Large monitors, 4K)
```

### Layout Patterns by Breakpoint

#### Mobile (< 768px)
```
┌─────────────────────┐
│ [Header + Actions]  │
├─────────────────────┤
│                     │
│ CONTENT             │
│ (Single column)     │
│                     │
│                     │
├─────────────────────┤
│ [Bottom Nav]        │
│ [FAB: +]            │
└─────────────────────┘

Changes:
• Sidebar → Bottom nav or hamburger menu
• Filters → Modal bottom sheet
• Grid → List (single column)
• Actions → FAB (Floating Action Button)
• 20 items per page → 10 items (smaller screen)
```

#### Tablet (768-1023px)
```
┌─────────────────────────────────────┐
│ [Header + Actions]                  │
├─────────────────────────────────────┤
│ NAV    │ CONTENT                    │
│ (Icon  │ (2-column grid)            │
│  only) │                            │
│        │                            │
│        │                            │
└─────────────────────────────────────┘

Changes:
• Sidebar → Icon-only (60px)
• Filters → Collapsible or horizontal bar
• Grid → 2 columns
• Actions → Header with compact buttons
```

#### Desktop (1024-1439px)
```
┌─────────────────────────────────────────────────────┐
│ NAV    │ [Header + Actions]                         │
├─────────┼───────────────────────────────────────────┤
│ Links  │ CONTENT (70%)                              │
│ (240px)│ (3-column grid)                            │
│        │                                            │
│        │                                            │
└─────────────────────────────────────────────────────┘

Changes:
• Sidebar → Full with text labels (240px)
• Filters → Persistent sidebar or collapsible
• Grid → 3 columns
• Actions → Full-size buttons in header
```

#### Wide (≥ 1440px)
```
┌─────────────────────────────────────────────────────────────┐
│ NAV    │ [Header + Actions]                                 │
├─────────┼───────────────────────────────────────────────────┤
│ Links  │ CONTENT (80%)                                      │
│ (240px)│ (4-column grid or 3-column with wider cards)       │
│        │                                                    │
│        │                                                    │
└─────────────────────────────────────────────────────────────┘

Changes:
• Grid → 4 columns OR wider 3-column cards
• More items per page (50-100)
• Optional: Side panels or dual-pane view
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance (Minimum)

#### Color Contrast
```
NORMAL TEXT (< 18px):
Minimum ratio: 4.5:1

LARGE TEXT (≥ 18px OR ≥ 14px bold):
Minimum ratio: 3:1

INTERACTIVE ELEMENTS:
Minimum ratio: 3:1 (borders, icons, focus indicators)
```

**Testing:**
- Use WebAIM Contrast Checker
- Test with grayscale filter
- Verify in both light and dark modes

#### Keyboard Navigation
```
REQUIRED:
✅ All interactive elements reachable via Tab
✅ Logical tab order (left-to-right, top-to-bottom)
✅ Visible focus indicators (outline, background, border)
✅ Enter/Space to activate buttons
✅ Escape to close modals
✅ Arrow keys for lists/menus (optional but recommended)

FOCUS INDICATOR SPEC:
• Outline: 2px solid primary color
• Offset: 2px from element
• Border-radius: Match element (buttons: 4px, cards: 8px)
```

#### Screen Reader Support
```
SEMANTIC HTML:
✅ Use <button> not <div onclick>
✅ Use <nav> for navigation
✅ Use <main> for main content
✅ Use <header>, <footer>, <aside> appropriately

ARIA LABELS:
✅ aria-label for icon-only buttons ("Close", "Menu", "Search")
✅ aria-labelledby for sections
✅ aria-describedby for additional context
✅ aria-live for dynamic content updates

FLUTTER EQUIVALENT:
• Semantics(label: "Close", child: IconButton(...))
• Semantics(label: "Showing 1-20 of 100 contacts")
```

#### Motion & Animation
```
RESPECT USER PREFERENCES:
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

FLUTTER:
final disableAnimations = MediaQuery.of(context).disableAnimations;
duration: disableAnimations ? Duration.zero : Duration(milliseconds: 200);
```

---

## Design System Principles

### Component Library Structure

```
lib/core/design/
├── colors.dart          → Color palette (primary, semantic, grays)
├── typography.dart      → Text styles (display, h1-h4, body, caption)
├── spacing.dart         → Spacing scale (4px base, 8-64px)
├── shadows.dart         → Elevation system (card, modal, floating)
├── breakpoints.dart     → Responsive breakpoints
└── components/
    ├── app_button.dart  → Button variants
    ├── app_card.dart    → Card component
    ├── app_input.dart   → Input fields
    ├── app_chip.dart    → Chips/tags
    └── ...
```

### Naming Conventions

**Colors:**
```dart
// Primary palette
static const Color primary = Color(0xFF3B82F6);
static const Color primaryLight = Color(0xFF60A5FA);
static const Color primaryDark = Color(0xFF2563EB);

// Semantic colors
static const Color success = Color(0xFF10B981);
static const Color warning = Color(0xFFF59E0B);
static const Color error = Color(0xFFEF4444);

// Neutral grays (9-shade scale)
static const Color gray50 = Color(0xFFFAFAFA);   // Lightest
static const Color gray100 = Color(0xFFF5F5F5);
// ...
static const Color gray900 = Color(0xFF212121);  // Darkest
```

**Typography:**
```dart
static const TextStyle display = TextStyle(
  fontSize: 48,
  fontWeight: FontWeight.w700,
  height: 1.2,
  letterSpacing: -0.5,
);

static const TextStyle h1 = TextStyle(
  fontSize: 32,
  fontWeight: FontWeight.w700,
  height: 1.3,
);

static const TextStyle bodyMedium = TextStyle(
  fontSize: 16,
  fontWeight: FontWeight.w400,
  height: 1.5,
);
```

**Spacing:**
```dart
static const double xxs = 2.0;
static const double xs = 4.0;
static const double sm = 8.0;
static const double md = 16.0;
static const double lg = 24.0;
static const double xl = 32.0;
static const double xxl = 48.0;
static const double xxxl = 64.0;
```

### Component API Design

**Good Component API:**
```dart
AppButton.primary(
  label: 'Save',
  onPressed: _save,
  leadingIcon: Icons.save,
  isLoading: _isSaving,
  isFullWidth: true,
)

// Characteristics:
✅ Named constructor clarifies variant
✅ Required params are positional (label, onPressed)
✅ Optional params are named with defaults
✅ Boolean flags use 'is' prefix
✅ Callbacks use 'on' prefix
```

**Bad Component API:**
```dart
AppButton(
  text: 'Save',
  onClick: _save,
  icon: Icons.save,
  iconPosition: 'left',
  loading: _isSaving,
  fullWidth: true,
  type: ButtonType.primary, // ❌ Should be constructor
)
```

---

## Common Pitfalls & Solutions

### Pitfall 1: "Decorative" Home Pages
**Problem:** Landing page shows welcome message, no data.

**Solution:** Build functional dashboard
```
❌ BAD:
"Welcome to App! Click 'Contacts' to begin."

✅ GOOD:
[1,247 Total] [+23 New] [87 Viewed] [412 Interactions]
Recent Contacts: [Alice] [Bob] [Carol] [View All →]
Quick Actions: [+ Add] [Import] [Saved Searches]
```

### Pitfall 2: Fixed Sidebars That Waste Space
**Problem:** Filter panel always visible, takes 25% of space.

**Solution:** Make collapsible (default hidden)
```
❌ BAD:
[Sidebar 300px] [Content 900px] = Only 2 columns possible

✅ GOOD:
[Content 1200px] = 3 columns when filters hidden
[Filters button] → Opens slide-over when needed
```

### Pitfall 3: Hiding Primary Actions
**Problem:** "Add Contact" only in command palette (Cmd+K).

**Solution:** Persistent primary CTA
```
❌ BAD:
User must know keyboard shortcut (Cmd+K → type "add")

✅ GOOD:
[+ Add Contact] button always visible in top-right
PLUS keyboard shortcut for power users
```

### Pitfall 4: Inverted Visual Hierarchy
**Problem:** Tertiary info (tags) larger than primary info (name).

**Solution:** Size = Importance
```
❌ BAD:
Name: 16px regular
Tags: 14px in 5 bright colors (visual dominance)

✅ GOOD:
Name: 18px bold (visual dominance)
Tags: 12px in muted gray, max 2 visible
```

### Pitfall 5: Low Information Density
**Problem:** 20 items per page when 100 could fit.

**Solution:** Match density to user needs
```
❌ BAD:
20 items = Excessive pagination
Large cards = Wasted space

✅ GOOD:
30-50 items in grid view
100 items in table view
User can toggle density
```

### Pitfall 6: No Bulk Actions
**Problem:** Must open each contact to email individually.

**Solution:** Selection + bulk actions
```
❌ BAD:
Email 10 people = 10 clicks to open profiles

✅ GOOD:
Checkbox selection → [Email All] = 2 clicks
```

### Pitfall 7: Oversized Profile Avatars
**Problem:** 120px avatar takes entire viewport above fold.

**Solution:** Inline, compact header
```
❌ BAD:
[Avatar 120px centered]
Name
Email/Call buttons (below fold)

✅ GOOD:
[Avatar 64px inline] Name | [Email] [Call] (same row)
```

---

## Decision Trees

### When to Use What Layout Pattern

```
START: What's the primary use case?

├─ Frequent filtering → Sidebar pattern
│  └─ 5+ filter types → Persistent sidebar (300px)
│  └─ 3-4 filter types → Collapsible sidebar (slide-over)
│
├─ Occasional filtering → Horizontal bar
│  └─ 1-3 filters → Compact dropdowns in header
│
└─ No filtering → Simple list/grid
   └─ < 100 items → Single page, no pagination
   └─ 100-1000 items → Paginated grid (30-50 per page)
   └─ 1000+ items → Table with virtual scrolling
```

### When to Use Which View Type

```
START: What data are you showing?

├─ Visual content (faces, photos) → Grid or List
│  └─ 10-100 items → Grid (2-4 columns)
│  └─ < 20 items → List (single column)
│
├─ Structured data (many fields) → Table
│  └─ 50-10,000 items → Sortable table
│  └─ Need comparison → Fixed column widths
│
└─ Mixed (some visual, some data) → Grid with option for Table
   └─ Default: Grid for visual scanning
   └─ Advanced: Table toggle for data comparison
```

---

## Checklist: Is My Design Ready?

### Level 1: Layout ✓
- [ ] Most important content occupies 60-70% of space
- [ ] Visual hierarchy is clear (size, weight, position)
- [ ] F-pattern or Z-pattern guides eye movement
- [ ] Collapsible sidebars for occasional features
- [ ] Responsive grid (2/3/4 columns by breakpoint)

### Level 2: Features ✓
- [ ] Primary CTA is always visible (top-right or FAB)
- [ ] 1-2 clicks to complete common tasks
- [ ] Search is prominent and always accessible
- [ ] Filters are discoverable (sidebar, button, or horizontal)
- [ ] Keyboard shortcuts available (Cmd+K, etc.)

### Level 3: Components ✓
- [ ] Cards show essential info (name, title, org)
- [ ] Buttons have clear hierarchy (primary/secondary/tertiary)
- [ ] Empty states offer solutions (not just "No results")
- [ ] Loading states match content structure (skeleton screens)
- [ ] Hover states provide feedback (lift, highlight, tooltip)

### Level 4: Details ✓
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Typography scale is consistent (h1, h2, body, caption)
- [ ] Spacing follows 4px or 8px base scale
- [ ] Shadows create depth hierarchy (card < modal < floating)
- [ ] Animations are subtle and respect reduced-motion preference

### Accessibility ✓
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (2px outline)
- [ ] Screen reader labels present (ARIA attributes)
- [ ] Color not sole indicator (icons + text for status)
- [ ] Text scales without breaking layout

---

## Resources & References

### Enterprise Design Examples
- Linear (linear.app) - Bold typography, monochrome palette
- Notion (notion.so) - Clean, flexible, generous whitespace
- Stripe Dashboard (stripe.com) - Data-dense but not cluttered
- Vercel (vercel.com) - Minimal chrome, maximum content
- Supabase (supabase.com) - Developer-focused, efficient

### Design Systems
- Material Design 3 (material.io)
- IBM Carbon (carbondesignsystem.com) - Enterprise patterns
- Atlassian Design System - Product design at scale
- Shopify Polaris - Merchant-focused patterns

### Tools
- WebAIM Contrast Checker - Color contrast testing
- Figma / Adobe XD - Design mockups
- Browser DevTools - Performance and layout debugging

---

**Version:** 1.0
**Created:** 2025-10-11
**Last Updated:** 2025-10-11
**Maintainer:** UI/UX Designer Agent
