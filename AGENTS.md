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

Keep the desktop hero collage level and orderly, using the responsive composition's proportions: a right-shifted wide top frame, a left inset middle frame, and a right-shifted wide lower frame with narrow cream separation. Avoid oversized ribbons, deep organic cuts and competing curves across photographs.

Keep proof-row icon circles visibly inset from every outer edge and column divider at desktop, tablet and phone widths.

Keep the global header fixed to the viewport: it stays visible at the top, hides during deliberate downward scrolling, and returns promptly when the user scrolls upward. Keep it visible whenever the navigation menu or keyboard focus is active.

Keep the cream editorial system intact during product audits. Put service-specific actions, verified prices, capacities, inclusions and availability ahead of generic promotional copy, and never invent business hours, response times, policies or social proof to fill a content gap.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
