# Cloud Studios Design QA

## Comparison source

- Reference: `reference/selected-design.png`
- Final implementation capture: `reference/home-1487x1058-final-v3.png`
- Remediated implementation capture: `audit/full-site-2026-09-01/21-home-remediated-desktop.png`
- Side-by-side comparison: `audit/full-site-2026-09-01/22-reference-vs-remediated-home.png`
- Service-page evidence: `audit/full-site-2026-09-01/23-meeting-remediated-desktop.png`
- Mobile interaction evidence: `audit/full-site-2026-09-01/24-mobile-menu-remediated.png`, `audit/full-site-2026-09-01/25-tour-errors-remediated-mobile.png`
- Hero frame evidence: `audit/full-site-2026-09-01/26-home-hero-frames-desktop.png`, `audit/full-site-2026-09-01/27-home-hero-frames-mobile.png`
- Responsive-composition source: `/var/folders/xm/6hd48vrd7c32knxltx9crh6w0000gn/T/codex-clipboard-9cf92a31-c52d-4a70-867d-e201422f748e.png`
- Responsive-composition implementation: `audit/full-site-2026-09-01/28-home-mobile-composition-desktop.png`
- Focused comparison: `audit/full-site-2026-09-01/29-mobile-reference-vs-desktop-composition.png`
- Focused service-mosaic capture: `reference/home-mosaic-2048x900-v3.png`
- Viewport: 1487 × 1058
- State: homepage, initial load, desktop navigation closed
- Image dimensions: reference 1487 × 1058; implementation 1487 × 1058

## Visual comparison

The implementation matches the selected cream editorial direction: the same hero height and content origin, serif headline scale and wrap, black teardrop logo panel, wide desktop navigation, terracotta tour action, four-part proof row, right-side organic collage, Epsom address plaque, and dark four-panel service strip. Source-grounded editorial refinements of the real Cloud Studios office, meeting room and building replace the concept-only photography. The source and final capture were reviewed together at the same 1487 × 1058 viewport, with a separate 2048 × 900 focused capture used to assess all four service thumbnails, text contrast and crops.

## Iteration history

1. Initial WebGL pass revealed clamped image textures and an oversized sharp cream mask. Fixed UV normalization on the shaped Three.js planes and replaced the mask with the organic scene band.
2. Replaced promotional source graphics in the hero with real Cloud Studios meeting-room, building and private-office imagery; moved the address plaque and lower plane to match the reference silhouette.
3. Replaced the mobile poster fallback with the same genuine workspace assets used by the desktop scene.
4. Removed GPU z-fighting exposed by pointer depth: image planes now use deterministic render order, separated depth, and disabled depth writes. The detail image renders above the cream band as one coherent card.
5. Curated a consistent neutral interior set for the three hero frames, replaced the saturated exterior with a branded virtual-office detail, added cover-crop positioning to prevent stretched photos, and applied one subtle warm colour treatment across the WebGL collage.
6. Kept the navigation unboxed and applied a lighter parchment wash only to the first hero image so Location and Community remain legible over its window frames.
7. Replaced all three hero photos with a new, cohesive set of genuine Cloud Studios interiors and removed the rejected parchment wash. The wide desk room, corner office and meeting room now share the same neutral palette and architectural language.
8. Recreated all four homepage service thumbnails as one warm editorial set. The office, meeting room and address images retain real Cloud Studios geometry; the community scene stages three professionals inside the real meeting room. Reduced the blanket overlay so the new photography remains visible while white card copy stays legible.
9. Removed the obsolete brand-only exception from the fourth card. All four services now use equal desktop columns, the same overlay, heading, description and arrow; tablet and mobile retain the existing two-column and single-column layouts.
10. Rebuilt the Community hero as one coherent editorial workplace scene: six naturally staged professionals, warm neutral lighting, a glass meeting room and a single integrated gold brand mark. Removed the rejected fog, cloud floor and baked-in frame.
11. Restaged the Community hero as candid documentary workplace photography: asymmetrical activity, focused expressions, ordinary work materials and softer practical light replace the posed stock-photo arrangement.
12. Replaced the low-resolution Experiences collage with one continuous blue-hour workshop scene. The real meeting-room geometry, plausible Epsom-to-city outlook, candid breakout conversation and restrained brand mark now form a coherent editorial photograph.
13. Reworked the Experiences scene around genuine Cloud Studios window references. The invented skyline is gone; leafy Epsom rooftops and the neighbouring blue building now anchor a looser, mid-process workshop with natural gestures and working materials.
14. Replaced the cold Virtual Office service graphic with a close editorial mail-handling scene. Working hands, blank envelopes, the genuine Epsom outlook and a small physical brand mark now communicate the service without floating icons, private data or synthetic interface copy.
15. Recreated the three Meeting Room gallery images as one premium editorial set while preserving the genuine layouts. The workshop U-shape, presentation setup and boardroom now use practical notebooks, pencils, glassware, carafes, charging tools, presentation hardware and restrained greenery instead of bare tables or low-resolution screen content.
16. Recreated the remaining three private-office views, three dedicated-desk views and exterior as one coherent architectural set. Genuine Cloud Studios room geometry and Epsom outlooks remain intact; restrained working items, warm practical light and an authentic blue-hour arrival replace the bare, inconsistent source treatment.
17. Reframed those seven images with professional architectural camera discipline: corrected verticals, level horizons, natural 28–40mm focal lengths, cleaner leading lines and accurate room scale. All rooms, working details and genuine outlooks remain unchanged.
18. Reprocessed the same seven frames against the genuine source photography to remove their rendered finish. Real ceiling and carpet variation, small surface wear, mixed practical light, natural glass reflections, softer optics and restrained sensor grain now sit beneath the corrected camera geometry.
19. Rebuilt the service-gallery composition around the photographs' natural landscape framing. Wider establishing images now flank a tighter centre detail, responsive ratios preserve more of each room, and explicit focal positions keep key desks, windows and working details inside every crop; the homepage detail frame now centres the workstation rather than the printer edge.
20. Corrected the mobile header logo container from an overflowing grid track to flex centring, aligning the complete mark precisely with the black teardrop without changing the desktop header.
21. Completed the full-site audit remediation without changing the selected cream editorial anatomy: service-specific actions, near-hero fact modules, contextual FAQs, verified availability context, denser transitions and darker accessible small-text colours now support conversion without diluting the original composition.
22. Rebuilt the full-screen menu interaction with a visible close control, Escape handling, focus containment and return, body-scroll lock, and inert/hidden background regions. The mobile form now precedes the reassurance card and focuses a linked live error summary.
23. Split Three.js and GSAP into asynchronous chunks, retained the mobile/reduced-motion fallback, lazy-loaded below-fold media and removed all 29 unreferenced files from the public package.
24. Compared the reference and remediated homepage together at 1487 × 1058. The hero anatomy, content origin, type scale, parchment/ink balance, CTA hierarchy, organic collage, address plaque and four-card service strip remain aligned; the additional Contact route is accommodated without overlap through a compact intermediate header state.
25. Simplified the desktop hero collage to match the cleaner responsive composition. Removed the oversized cream ribbon and Dutch angle, reduced pointer tilt, and rebuilt the scene as three level rounded frames with narrow cream separation and one controlled overlap.
26. Added consistent internal gutters to every hero proof item so icon circles no longer touch column dividers. Verified 16px separation in the two-column tablet state and 10px in the compact phone state with no horizontal overflow.
27. Rebuilt the desktop WebGL collage around the responsive composition's exact stepped anatomy. The right-shifted top frame, left landscape inset, right-shifted lower frame, controlled overlaps and attached address plaque now preserve the mobile rhythm despite the desktop canvas's taller aspect ratio. A focused normalized comparison found no remaining P0-P2 composition mismatch.

## Final findings

- P0: none.
- P1: none.
- P2: none.
- Prototype release gates outside code: owner/on-site media verification and independent legal review remain required before a public production launch.
- Accepted source-grounding difference: the reference collage uses concept photography that is not present on the live Cloud Studios website. The implementation preserves the layout and uses current genuine business media instead.
- Required fidelity surfaces: display and UI typography, hero spacing, parchment/ink/gold/terracotta tokens, business copy and interaction states remain unchanged; the four recreated thumbnails are sharp at their rendered sizes, consistently colour-graded, intentionally cropped and free of stretching.

## Responsive and interaction checks

- Desktop: all 13 routes direct-loaded with one H1, unique title and description, canonical path, no horizontal overflow, no broken images and no duplicate IDs. The selected homepage was also compared against the reference at 1487 × 1058.
- Tablet: all 13 routes direct-loaded at 820 × 1180 with one H1, no overflow and no broken images; the interactive hero canvas loaded successfully.
- Mobile: all 13 routes direct-loaded at 390 × 844 with one H1, no overflow and no broken images; the static non-WebGL hero fallback loaded successfully.
- Hero composition: the supplied 1206 × 1170 responsive reference and the 1300 × 1067 desktop capture were compared as normalized focused regions in `29-mobile-reference-vs-desktop-composition.png`; the 1300 × 1474 CSS viewport had no overflow, and the 390 × 844 fallback remained active without a WebGL canvas.
- Community: regenerated hero loaded at 1536 × 1024 and was verified at 1487 × 1058 and 390 × 844 with no broken media or horizontal overflow.
- Navigation: desktop dropdown has focus-within support; Contact remains visible without colliding with the CTA; the full-screen menu exposes every route, traps focus, closes with Escape, restores focus and blocks background navigation/scroll.
- Forms: native required semantics, linked field errors, focused live summaries, query-prefill, tour success/reset and contact success were verified. Both success states explicitly say `Demo—no information was sent.`
- Accessibility: semantic landmarks and headings, route focus, labelled fields, visible focus styling, corrected 5.14:1 and 5.23:1 small-text colour pairs, reduced-motion CSS and non-WebGL/mobile fallback are present.
- Performance/package: shared entry 311.62 kB / 97.42 kB gzip; Three.js and GSAP load asynchronously; 18 referenced public images and zero unreferenced public images.
- Automated checks: `npm test` 5/5, production build passed and `npm run test:sites` 4/4; browser console errors/warnings: 0.

final result: passed
