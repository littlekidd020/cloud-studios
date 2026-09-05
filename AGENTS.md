# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

For people imagery, prefer candid editorial workplace moments over staged stock-photo poses: show genuine work, practical lived-in details, natural body language, and restrained lighting.

For empty shared-office interiors, preserve the genuine room geometry and use restrained real working items to create a premium, session-ready atmosphere.

Ground any view visible through a window in Cloud Studios' genuine on-site photography; do not invent nearby landmarks or city panoramas.

Photograph interiors with level horizons, corrected verticals and natural architectural focal lengths; avoid ultra-wide real-estate distortion, Dutch angles and exaggerated room scale.

Keep generated photography grounded in the genuine source's ordinary material variation, mixed practical light, optical softness and subtle wear; avoid spotless CGI surfaces and uniform render lighting.

Compose service photography for its actual rendered slot: use landscape-friendly gallery ratios, an establishing-detail-establishing sequence and explicit focal crops instead of forcing every source into tall generic frames.

On the meeting-rooms page, use the user's M1 photo (meeting-m1.webp) for the hero and the first and third gallery images on desktop and mobile. Preserve the middle gallery image and all existing image-frame dimensions, aspect ratios and crops.

Use the user's uploaded lounge discussion photo (experiences-hero-v4.webp) for the Experiences hero at every breakpoint, preserving the existing image-frame dimensions and layout.

Keep the desktop hero collage level and orderly, using the responsive composition's proportions: a right-shifted wide top frame, a left inset middle frame, and a right-shifted wide lower frame with narrow cream separation. Avoid oversized ribbons, deep organic cuts and competing curves across photographs.

Keep proof-row icon circles visibly inset from every outer edge and column divider at desktop, tablet and phone widths.

Production enquiry and tour forms must retain the legacy admin and customer emails, tour calendar attachment, honeypot validation, and durable submission log. Keep mail credentials outside Git and store form records outside `public_html` so automated deployments cannot expose or erase them.

Keep the global header fixed to the viewport: it stays visible at the top, hides during deliberate downward scrolling, and returns promptly when the user scrolls upward. Keep it visible whenever the navigation menu or keyboard focus is active.

Keep the upper-left black logo badge at its original desktop and mobile dimensions. Center the complete logo artwork inside it at 86% of the badge width without changing the badge itself.

Display the location coordinates from the shared contact latitude and longitude for Level 2, 109 Great South Road, Epsom: 36.8844° S, 174.7862° E. Preserve the vertical desktop rail and show the same coordinates in a compact horizontal line on tablet and phone widths.

Render the full-screen navigation as a document-level viewport overlay, independent of the transformed sticky header, so page sections never bleed through or become part of the menu scroll on any breakpoint.

On phone widths, keep the verified Cloud Studios phone number in an edge-to-edge call bar fixed to the bottom of the viewport. Match the primary terracotta CTA palette, reserve footer space for it and suppress the bar while the full-screen navigation menu is open.

Keep the cream editorial system intact during product audits. Put service-specific actions, verified prices, capacities, inclusions and availability ahead of generic promotional copy, and never invent business hours, response times, policies or social proof to fill a content gap.

Present the business publicly as Cloud Studios only. Do not append or describe a parent company, legal entity, trading-name owner or company-name suffix anywhere on the website.

Keep the organic-search site name signals consistent as Cloud Studios: the home-page `WebSite` structured data, `og:site_name`, application name, title and visible branding must all use that exact name. Do not use the bare domain as the preferred site name.

Load every displayed WebP eagerly on desktop and mobile, preload each route's logo and hero imagery, and warm the remaining image cache as soon as the app mounts so client-side route changes show photographs immediately. Keep the static home collage visible until all WebGL textures are ready.

Use `/location` as the public Location URL in every navigation surface. Keep the uploaded dusk exterior photograph as the Location page and Location-section image on desktop and mobile; do not link Location navigation to the former `/#location` anchor.

Keep the Location exterior image as the 4096×2340 high-resolution restoration of the user's 109_2.jpg, with its matching 2048×1170 responsive derivative for instant display. Preserve the original photograph's exact composition and visible content; do not substitute a generative reinterpretation that changes the building, vegetation, road, vehicles, signs or sky.

Use the same 2048×1170 Location exterior WebP in the home-page Professional Address mosaic card on desktop and mobile.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
