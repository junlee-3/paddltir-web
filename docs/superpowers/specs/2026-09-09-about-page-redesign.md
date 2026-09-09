# About page redesign (Approach A)

## Goal
Replace the text-heavy `/about` page with a people-first layout: manifesto hero + two founders, then site footer.

## Scope
- In: hero, two zigzag person rows, Clinical design tokens, animated gradient on "humans"
- Out: What it is / trust / independence / contact sections, ClosingCta, homepage glass hero card

## Layout
1. **Hero** (centered, first viewport):  
   "Behind every great product," / "are great humans."  
   Signature: animated multicolor gradient on **humans** only.
2. **Person 1**: photo left, name + role + lorem right  
3. **Person 2**: name + role + lorem left, photo right (stacked photo-above on mobile)

## Visual system
- Clinical: white, zinc text, Switzer, `reveal` / `reveal-lcp`, `rounded-[15px]` photos
- Gradient: cyan → violet → rose → amber, `background-clip: text`, slow shimmer; static fallback under `prefers-reduced-motion`
- Photos: local stock placeholders in `/public/about/`

## Content (temporary)
Placeholder names, roles, and lorem until real bios/photos land.

## SEO
Keep AboutPage + breadcrumb JSON-LD; keep existing `personJsonLd()` for Jun Lee.
