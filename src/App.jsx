import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  ArrowDown, ArrowRight, Briefcase, CalendarBlank, CaretDown, Check,
  ClockCounterClockwise, CurrencyDollar, EnvelopeSimple, List, MapPin, Phone, X,
} from "@phosphor-icons/react";
import { HeroScene } from "./HeroScene.jsx";
import { allImageSources, assets, availabilityChecked, classifyIntent, contact, imagePreloadsForPath, pageMeta, pricing, routes, servicePages, services, siteUrl, structuredDataForPath, validateForm } from "./site.js";

const primaryNav = [
  ["/meeting-rooms", "Meeting rooms"], ["/virtual-office-auckland", "Virtual office"],
  ["/experiences", "Experiences"], ["/#location", "Location"], ["/community", "Community"], ["/contact", "Contact"],
];

const warmedImages = new Map();

function warmImageCache(sources) {
  for (const source of sources) {
    if (warmedImages.has(source)) continue;
    const image = new Image();
    image.decoding = "async";
    image.src = source;
    warmedImages.set(source, image);
  }
}

export function App() {
  return <BrowserRouter><Site /></BrowserRouter>;
}

function Site() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    setMenuOpen(false);
    const routeChanged = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    requestAnimationFrame(() => {
      if (routeChanged) document.querySelector("main h1")?.focus({ preventScroll: true });
      const target = location.hash && document.querySelector(location.hash);
      if (target) target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      else window.scrollTo(0, 0);
    });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    warmImageCache(allImageSources);
  }, []);

  useEffect(() => {
    function trackLink(event) {
      const link = event.target.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const type = classifyIntent(href, link.dataset.intent);
      if (type) emitIntent(type, { label: link.dataset.label || link.textContent.trim().replace(/\s+/g, " ") });
    }
    document.addEventListener("click", trackLink);
    return () => document.removeEventListener("click", trackLink);
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let active = true;
    let context;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (!active) return;
      const gsap = gsapModule.gsap || gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.utils.toArray("[data-reveal]").forEach((node) => {
          gsap.fromTo(node, { y: 42, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 88%", once: true },
          });
        });
        gsap.utils.toArray("[data-parallax]").forEach((node) => {
          gsap.to(node, { yPercent: 8, ease: "none", scrollTrigger: { trigger: node, scrub: 0.8 } });
        });
      });
    });
    return () => {
      active = false;
      context?.revert();
    };
  }, [location.pathname]);

  return <>
    <Meta path={location.pathname} />
    <a className="skip-link" href="#main">Skip to content</a>
    <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <main id="main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/office-suites" element={<ServicePage service={services[0]} kind="offices" />} />
        <Route path="/dedicated-desks" element={<ServicePage service={services[1]} kind="desks" />} />
        <Route path="/meeting-rooms" element={<ServicePage service={services[2]} kind="meeting" />} />
        <Route path="/virtual-office-auckland" element={<ServicePage service={services[3]} kind="virtual" />} />
        <Route path="/experiences" element={<EditorialPage type="experiences" />} />
        <Route path="/community" element={<EditorialPage type="community" />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book-a-tour" element={<TourPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
        <Route path="/workplace-policy" element={<PolicyPage type="workplace" />} />
        <Route path="/terms-of-service" element={<PolicyPage type="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
    <MobileCallBar menuOpen={menuOpen} />
  </>;
}

function Meta({ path }) {
  useEffect(() => {
    const meta = pageMeta[path] || { title: "Cloud Studios Epsom", description: "Premium flexible workspace in Epsom, Auckland." };
    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("name", "application-name", contact.brand);
    setMeta("property", "og:site_name", contact.brand);
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", `${siteUrl}${path}`);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    document.querySelectorAll('link[data-route-image]').forEach((node) => node.remove());
    imagePreloadsForPath(path).forEach((source) => {
      const preload = document.createElement("link");
      preload.rel = "preload";
      preload.as = "image";
      preload.href = source;
      preload.fetchPriority = "high";
      preload.dataset.routeImage = "";
      document.head.appendChild(preload);
    });
    const canonical = document.querySelector('link[rel="canonical"]') || document.head.appendChild(document.createElement("link"));
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", `${siteUrl}${path}`);
    const script = document.querySelector("#local-business-data") || document.head.appendChild(document.createElement("script"));
    script.id = "local-business-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredDataForPath(path));
  }, [path]);
  return null;
}

function setMeta(attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`;
  const node = document.querySelector(selector) || document.head.appendChild(document.createElement("meta"));
  node.setAttribute(attribute, key);
  node.setAttribute("content", content);
}

function emitIntent(type, detail = {}) {
  window.dispatchEvent(new CustomEvent("cloudstudios:intent", { detail: { type, path: window.location.pathname, ...detail } }));
}

function useDirectionalHeader(menuOpen) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const previousY = useRef(0);
  const frame = useRef(0);

  useEffect(() => {
    previousY.current = Math.max(window.scrollY, 0);
    setScrolled(previousY.current > 18);
    if (menuOpen) setHidden(false);

    function update() {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - previousY.current;
      setScrolled(currentY > 18);

      if (menuOpen || currentY <= 18) {
        setHidden(false);
        previousY.current = currentY;
      } else if (delta > 6 && currentY > 96) {
        setHidden(true);
        previousY.current = currentY;
      } else if (delta < -4) {
        setHidden(false);
        previousY.current = currentY;
      }
      frame.current = 0;
    }

    function onScroll() {
      if (!frame.current) frame.current = window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [menuOpen]);

  return { hidden, scrolled, show: () => setHidden(false) };
}

function Header({ menuOpen, setMenuOpen }) {
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const header = useDirectionalHeader(menuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    const pageRegions = [document.querySelector("main"), document.querySelector("footer")].filter(Boolean);
    const previousAriaHidden = pageRegions.map((node) => node.getAttribute("aria-hidden"));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pageRegions.forEach((node) => {
      node.setAttribute("inert", "");
      node.setAttribute("aria-hidden", "true");
    });
    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [toggleRef.current, ...menuRef.current.querySelectorAll("a[href]")].filter(Boolean);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      pageRegions.forEach((node, index) => {
        node.removeAttribute("inert");
        if (previousAriaHidden[index] === null) node.removeAttribute("aria-hidden");
        else node.setAttribute("aria-hidden", previousAriaHidden[index]);
      });
    };
  }, [menuOpen, setMenuOpen]);

  const mainMenuRoutes = routes.slice(0, 9);
  const utilityMenuRoutes = routes.slice(9);
  const headerClasses = ["site-header", menuOpen && "menu-open", header.scrolled && "is-scrolled", header.hidden && !menuOpen && "is-hidden"].filter(Boolean).join(" ");
  const menu = <div ref={menuRef} id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen} role="dialog" aria-modal="true" aria-label="Site navigation">
      <nav aria-label="Mobile navigation">{mainMenuRoutes.map(([path, label], index) => <NavLink key={path} to={path}><span>{String(index + 1).padStart(2, "0")}</span>{label}</NavLink>)}</nav>
      <div className="mobile-menu-meta"><nav className="mobile-utility" aria-label="Information navigation">{utilityMenuRoutes.map(([path, label]) => <NavLink key={path} to={path}>{label}</NavLink>)}</nav><div className="mobile-contact"><a href={contact.phoneHref}>{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a></div></div>
    </div>;

  return <>
    <header className={headerClasses} onFocusCapture={header.show}>
      <Link className="brand" to="/" aria-label="Cloud Studios home" tabIndex={menuOpen ? -1 : undefined}>
        <img src={assets.logo} alt="Cloud Studios" loading="eager" decoding="async" fetchPriority="high" />
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <div className="nav-dropdown">
          <NavLink to="/office-suites">Offices & desks <CaretDown size={13} weight="bold" /></NavLink>
          <div className="dropdown-panel"><NavLink to="/office-suites">Office suites</NavLink><NavLink to="/dedicated-desks">Dedicated desks</NavLink></div>
        </div>
        {primaryNav.map(([path, label]) => path.includes("#") ? <a key={path} href={path}>{label}</a> : <NavLink key={path} to={path}>{label}</NavLink>)}
      </nav>
      <div className="header-actions">
        <Link className="dark-button header-tour" to="/book-a-tour" aria-label="Book a tour"><CalendarBlank size={20} /><span>Book a tour</span></Link>
        <button ref={toggleRef} className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <List />}</button>
      </div>
    </header>
    {createPortal(menu, document.body)}
  </>;
}

function Home() {
  return <>
    <section className="home-hero">
      <aside className="epsom-marker" aria-hidden="true"><span>Epsom · Near Newmarket</span><i>{Math.abs(contact.latitude).toFixed(4)}° S, {contact.longitude.toFixed(4)}° E</i></aside>
      <div className="hero-copy">
        <p className="eyebrow">Premium serviced offices & dedicated desks</p>
        <h1 tabIndex="-1">Space to focus.<br />Room to <em>grow.</em></h1>
        <p className="hero-intro">A calm, characterful workspace in Epsom. Private offices, dedicated desks, meeting rooms and a professional address with flexible terms and on-site parking.</p>
        <div className="button-row"><Link className="primary-button" to="/book-a-tour" data-intent="tour_cta"><CalendarBlank size={20} />Book a tour<ArrowRight /></Link><a className="text-link" href="#spaces">See how it feels <ArrowRight /></a></div>
        <div className="proof-row"><Proof icon={<Briefcase />} title="On-site parking" /><Proof icon={<MapPin />} title="Near Newmarket" /><Proof icon={<ClockCounterClockwise />} title="Open-term flexibility" /><Proof icon={<CurrencyDollar />} title="Transparent value" /></div>
      </div>
      <HeroScene />
    </section>

    <section id="spaces" className="service-mosaic">
      <Link className="mosaic-card mosaic-office" to="/office-suites"><img src={assets.mosaicOffice} alt="Warm private office at Cloud Studios" loading="eager" decoding="async" /><div><h2>Quiet Offices</h2><p>Private offices for focused teams.</p><ArrowDown /></div></Link>
      <Link className="mosaic-card mosaic-meeting" to="/meeting-rooms"><img src={assets.mosaicMeeting} alt="Cloud Studios meeting room ready for a client session" loading="eager" decoding="async" /><div><h2>Meeting &<br />Making</h2><p>Professional rooms, ready when you are.</p><ArrowDown /></div></Link>
      <Link className="mosaic-card mosaic-address" to="/virtual-office-auckland"><img src={assets.mosaicAddress} alt="Cloud Studios building at 109 Great South Road" loading="eager" decoding="async" /><div><h2>Professional<br />Address</h2><p>A credible Epsom address for business and mail.</p><ArrowDown /></div></Link>
      <Link className="mosaic-card mosaic-brand" to="/community"><img src={assets.mosaicCommunity} alt="Professionals collaborating at Cloud Studios" loading="eager" decoding="async" /><div><h2>Community</h2><p>A professional community built around focused work.</p><ArrowDown /></div></Link>
    </section>

    <section className="editorial-section split-section" data-reveal><div><p className="eyebrow">A quieter way to work</p><h2>Professional space,<br /><em>without the noise.</em></h2></div><div><p>Cloud Studios is deliberately calm and low-density: a place for meaningful work, clear conversations and teams who value their environment.</p><Link className="text-link" to="/community">Meet the community <ArrowRight /></Link></div></section>
    <section className="spaces-grid section-shell">{services.map((service, index) => <Link className="service-tile" to={service.path} key={service.path} data-reveal><figure><img src={service.image} alt={service.imageAlt} data-parallax loading="eager" decoding="async" /></figure><span>0{index + 1}</span><h3>{service.title}</h3><p>{service.availability || service.price}</p><ArrowRight /></Link>)}</section>
    <LocationSection />
    <TourBand />
  </>;
}

function Proof({ icon, title }) {
  return <div className="proof"><span>{icon}</span><b>{title}</b></div>;
}

function ServicePage({ service, kind }) {
  const page = servicePages[kind];

  return <>
    <PageHero eyebrow={service.eyebrow} title={page.title} intro={page.intro} image={page.image ?? service.image} alt={service.imageAlt} kicker={page.kicker} action={page.action} />
    <ServiceFacts items={page.facts} />
    <section className="editorial-section split-section" data-reveal><div><p className="eyebrow">Made for clear work</p><h2>{kind === "meeting" ? "Everything ready, when you are." : "A considered place to settle in."}</h2></div><div><p>{service.summary}</p><ul className="tick-list">{service.features.map((item) => <li key={item}><Check />{item}</li>)}</ul></div></section>
    <PricingSection kind={kind} />
    <section className="gallery-strip section-shell">{page.gallery.map((image, index) => <figure key={`${image}-${index}`} data-reveal><img src={image} alt={`${service.title} at Cloud Studios ${index + 1}`} loading="eager" decoding="async" /></figure>)}</section>
    <ContextFaqs title={`${service.title} questions`} items={page.faqs} />
    <TourBand />
  </>;
}

function ServiceFacts({ items }) {
  return <section className="service-facts section-shell" aria-label="Service at a glance">{items.map(([label, value]) => <article key={label}><p>{label}</p><strong>{value}</strong></article>)}</section>;
}

function PricingSection({ kind }) {
  if (kind === "virtual") return <section className="price-section dark-section"><div data-reveal><p className="eyebrow">A flexible starting point</p><h2>Your business address,<br />without a permanent office.</h2><p>Talk with the Cloud Studios team about the current virtual office options and mail-handling arrangements.</p><Link className="light-button" to="/contact?interest=Virtual%20Office#enquiry" data-intent="service_cta" data-label="Virtual office pricing enquiry">Ask about virtual office <ArrowRight /></Link></div></section>;
  const rows = kind === "offices" ? pricing.offices.map(({ name, detail, status }) => [name, `${detail} · ${status}`]) : pricing[kind];
  return <section className="price-section dark-section"><div className="price-heading" data-reveal><p className="eyebrow">Current pricing & availability</p><h2>Simple, visible terms.</h2><p>{kind === "offices" ? "Private office suites begin from $1,200 + GST per month. Five private suites are leased; join the waitlist or ask about the M2 team suite." : "Pricing shown is the current rate published by Cloud Studios."}</p><small>Published details checked {availabilityChecked}</small>{kind === "offices" && <Link className="light-button" to="/contact?interest=Office%20Suite%20Waitlist#enquiry" data-intent="service_cta" data-label="Office suite waitlist">Join the waitlist <ArrowRight /></Link>}</div><div className="price-table" data-reveal>{rows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>;
}

function PageHero({ eyebrow, title, intro, image, imageStyle, alt, kicker, action = { label: "Book a tour", to: "/book-a-tour" } }) {
  return <section className="page-hero"><div className="page-hero-copy"><p className="eyebrow">{eyebrow}</p><h1 tabIndex="-1">{title}</h1><p>{intro}</p><strong>{kicker}</strong><Link className="primary-button" to={action.to} data-intent="service_cta" data-label={action.label}>{action.label.toLowerCase().includes("tour") || action.label.toLowerCase().includes("viewing") ? <CalendarBlank /> : null}{action.label}<ArrowRight /></Link></div><figure><img src={image} alt={alt} style={imageStyle} loading="eager" decoding="async" fetchPriority="high" /></figure></section>;
}

const editorialContent = {
  experiences: { eyebrow: "After-hours at Cloud Studios", title: "Experiences", intro: "A professional setting for thoughtful training, private sessions, workshops and presentations.", image: assets.experiences, imageStyle: { aspectRatio: "3 / 2", objectPosition: "70% 50%" }, action: { label: "Discuss an experience", to: "/contact?interest=Experiences#enquiry" }, sections: [["Training & workshops", "A practical setting for structured learning and hands-on workshops."], ["Private sessions", "A calm setting for private discussions, interviews or focused sessions."], ["Showcases & presentations", "Present products or ideas in a controlled, professional environment."]], note: ["Defined by use", "Tell us your format, headcount and timing.", "Cloud Studios will recommend the most suitable room setup and confirm availability directly."] },
  community: { eyebrow: "A professional community", title: "Quietly connected", intro: "A respectful, work-oriented environment for independent professionals and small teams.", image: assets.community, action: { label: "Book a community visit", to: "/book-a-tour?interest=Not%20sure%20%E2%80%94%20recommend%20me#tour-form" }, sections: [["Serious atmosphere", "Designed for focus and long-term work, not constant churn or noisy hot-desking."], ["Clear communication", "A professional environment that works comfortably across cultures and communication styles."], ["A place that grows with you", "Start with desks, then add meeting rooms or move into a private suite as your team evolves."]], note: ["What community means here", "Professional, not performative.", "Cloud Studios is not positioned as a social club. It is a calm workplace where independent professionals and small teams work alongside each other respectfully."] },
};

function EditorialPage({ type }) {
  const page = editorialContent[type];
  return <><PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} image={page.image} imageStyle={page.imageStyle} alt={`${page.title} at Cloud Studios`} kicker="Epsom, Auckland" action={page.action} /><section className="numbered-editorial section-shell">{page.sections.map(([title, copy], index) => <article key={title} data-reveal><span>0{index + 1}</span><h2>{title}</h2><p>{copy}</p></article>)}</section><section className="editorial-note dark-section" data-reveal><p className="eyebrow">{page.note[0]}</p><h2>{page.note[1]}</h2><p>{page.note[2]}</p><Link className="light-button" to={page.action.to}>{page.action.label}<ArrowRight /></Link></section><TourBand /></>;
}

function LocationSection() {
  return <section id="location" className="location-section"><figure data-reveal><img src={assets.building} alt="Cloud Studios building at 109 Great South Road, Epsom" loading="eager" decoding="async" /></figure><div data-reveal><p className="eyebrow">Epsom · Auckland</p><h2>Close to the city.<br /><em>Calm by design.</em></h2><address>{contact.address}</address><p>Near Newmarket with on-site parking available by arrangement.</p><a className="text-link" href={contact.maps} target="_blank" rel="noreferrer">Open in Google Maps <ArrowRight /></a></div></section>;
}

function TourBand() {
  return <section className="tour-band" data-reveal><p className="eyebrow">Come and see how it feels</p><h2>Find your place<br />to do your <em>best work.</em></h2><p>Most tours take 10–15 minutes. There is no commitment.</p><Link className="primary-button" to="/book-a-tour" data-intent="tour_cta"><CalendarBlank />Book a tour<ArrowRight /></Link></section>;
}

function ContactPage() {
  return <><section className="form-page-heading"><p className="eyebrow">Contact Cloud Studios</p><h1 tabIndex="-1">Let’s start a<br /><em>conversation.</em></h1><p>Tell us what you need and the team will point you towards the right option.</p></section><section id="enquiry" className="form-layout section-shell"><ContactCard /><EnquiryForm type="contact" /></section><LocationSection /></>;
}

function TourPage() {
  return <><section className="form-page-heading"><p className="eyebrow">Visit Cloud Studios</p><h1 tabIndex="-1">Book a<br /><em>personal tour.</em></h1><p>See the workspace, ask questions and get a feel for which option suits you.</p></section><section id="tour-form" className="form-layout section-shell"><ContactCard tour /><EnquiryForm type="tour" /></section></>;
}

function ContactCard({ tour = false }) {
  return <aside className="contact-card"><img src={tour ? assets.meetingFour : assets.building} alt={tour ? "Cloud Studios meeting area" : "Cloud Studios exterior"} loading="eager" decoding="async" /><div><p>{tour ? "Most tours take 10–15 minutes and there is no commitment." : "Prefer to contact the team directly?"}</p><small>Cloud Studios confirms availability directly.</small><a href={contact.phoneHref}><Phone />{contact.phone}</a><a href={`mailto:${contact.email}`}><EnvelopeSimple />{contact.email}</a><a href={contact.maps} target="_blank" rel="noreferrer"><MapPin />Get directions</a></div></aside>;
}

function EnquiryForm({ type }) {
  const isTour = type === "tour";
  const required = isTour ? ["name", "email", "preferred_datetime", "interest"] : ["name", "email", "subject", "message"];
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const [status, setStatus] = useState(() => new URLSearchParams(location.search).get("sent") === "1" ? "success" : "idle");
  const [serverError, setServerError] = useState("");
  const [requestId, setRequestId] = useState(() => new URLSearchParams(location.search).get("ref") || "");
  const [confirmationSent, setConfirmationSent] = useState(() => new URLSearchParams(location.search).get("confirmation") !== "0");
  const summaryRef = useRef(null);
  const successRef = useRef(null);
  const resetPending = useRef(false);
  const started = useRef(false);
  const requestedInterest = new URLSearchParams(location.search).get("interest") || "";
  const tourInterests = ["Dedicated Desks", "Office Suites", "Meeting Rooms", "Virtual Office", "Not sure — recommend me"];

  useEffect(() => {
    if (Object.keys(errors).length || serverError) summaryRef.current?.focus();
  }, [errors, serverError]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    else if (resetPending.current) {
      resetPending.current = false;
      document.getElementById(`${type}-form-title`)?.focus();
    }
  }, [status, type]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("sent") !== "1") return;
    params.delete("sent");
    params.delete("confirmation");
    params.delete("ref");
    const query = params.toString();
    window.history.replaceState({}, document.title, `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
  }, [location.hash, location.pathname, location.search]);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);
    const nextErrors = validateForm(values, required);
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) {
      emitIntent("form_validation_error", { form: type, count: Object.keys(nextErrors).length });
      return;
    }

    setStatus("submitting");
    formData.set("_ajax", "1");
    try {
      const response = await fetch(isTour ? "/send-tour.php" : "/send-enquiry.php", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
      });
      const payload = await response.json().catch(() => ({}));
      if (payload.request_id) setRequestId(payload.request_id);
      if (!response.ok || !payload.ok) throw new Error(payload.error || "The form could not be sent. Please try again.");
      setConfirmationSent(payload.confirmation_sent !== false);
      setStatus("success");
      emitIntent("form_submit_success", { form: type });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "The form could not be sent. Please try again.");
      setStatus("error");
      emitIntent("form_submit_error", { form: type });
    }
  }

  function reset() {
    resetPending.current = true;
    started.current = false;
    setErrors({});
    setServerError("");
    setRequestId("");
    setConfirmationSent(true);
    setStatus("idle");
  }

  const fieldLabels = { name: "Name", email: "Email", preferred_datetime: "Preferred date and time", interest: "Service interest", subject: "Subject", message: "Message" };

  if (status === "success") return <div ref={successRef} className="success-state" role="status" aria-live="polite" tabIndex="-1"><span><Check /></span><p className="eyebrow">Request received</p><h2>{isTour ? "Your tour request is with the team." : "Thanks — your enquiry is with the team."}</h2><p>Cloud Studios will review your details and reply directly.{requestId && <> Your reference is <strong>{requestId}</strong>.</>}</p><p>{confirmationSent ? (isTour ? "A confirmation and tentative calendar invitation have been emailed to you." : "A confirmation has been emailed to you.") : "Your request reached the team, but the confirmation email could not be sent. Please keep your reference and check your email address before sending another request."}</p><div className="button-row"><button className="primary-button" type="button" onClick={reset}>Send another</button><a className="text-link" href={`mailto:${contact.email}`}>Email the team <ArrowRight /></a></div></div>;

  return <form className="editorial-form" action={isTour ? "/send-tour.php" : "/send-enquiry.php"} method="post" onSubmit={submit} onFocusCapture={() => { if (!started.current) { started.current = true; emitIntent("form_start", { form: type }); } }} noValidate aria-labelledby={`${type}-form-title`} aria-busy={status === "submitting"}>
    <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" type="text" tabIndex="-1" autoComplete="off" /></label>
    <div className="form-intro"><p className="eyebrow">{isTour ? "Your visit" : "Your enquiry"}</p><h2 id={`${type}-form-title`} tabIndex="-1">{isTour ? "Tell us what suits you." : "How can we help?"}</h2><p>Required fields are marked with an asterisk. Cloud Studios will confirm availability directly.</p></div>
    {Object.keys(errors).length > 0 && <div ref={summaryRef} className="form-error-summary" role="alert" tabIndex="-1"><strong>Please check {Object.keys(errors).length} {Object.keys(errors).length === 1 ? "field" : "fields"}.</strong><ul>{Object.keys(errors).map((name) => <li key={name}><a href={`#${name}`}>{fieldLabels[name]}: {errors[name]}</a></li>)}</ul></div>}
    {serverError && <div ref={summaryRef} className="form-error-summary" role="alert" tabIndex="-1"><strong>We couldn’t send the form.</strong><p>{serverError}</p>{requestId && <p>Your saved reference is <strong>{requestId}</strong>.</p>}</div>}
    <div className="field-row"><Field name="name" label="Name" required error={errors.name} autoComplete="name" /><Field name="phone" label="Phone" type="tel" error={errors.phone} autoComplete="tel" /></div>
    <Field name="email" label="Email" type="email" required error={errors.email} autoComplete="email" />
    {isTour ? <><Field name="preferred_datetime" label="Preferred date and time" type="datetime-local" required error={errors.preferred_datetime} /><label className="field" htmlFor="interest"><span>Service interest <b aria-hidden="true">*</b></span><select id="interest" name="interest" required aria-required="true" aria-invalid={Boolean(errors.interest)} aria-describedby={errors.interest ? "interest-error" : undefined} aria-errormessage={errors.interest ? "interest-error" : undefined} defaultValue={tourInterests.includes(requestedInterest) ? requestedInterest : ""}><option value="">Choose an option</option>{tourInterests.map((interest) => <option key={interest}>{interest}</option>)}</select>{errors.interest && <small id="interest-error">{errors.interest}</small>}</label><label className="field" htmlFor="message"><span>Team requirements</span><textarea id="message" name="message" rows="5" placeholder="Tell us your team size and needs" /></label></> : <><Field name="subject" label="Subject" required error={errors.subject} defaultValue={requestedInterest ? `${requestedInterest} enquiry` : ""} /><label className="field" htmlFor="message"><span>Message <b aria-hidden="true">*</b></span><textarea id="message" name="message" rows="6" required aria-required="true" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} aria-errormessage={errors.message ? "message-error" : undefined} />{errors.message && <small id="message-error">{errors.message}</small>}</label></>}
    <p className="form-privacy-note">Your details are sent securely to Cloud Studios and handled under the <Link to="/privacy-policy">privacy policy</Link>.</p>
    <button className="primary-button submit-button" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending…" : isTour ? "Request a tour" : "Send enquiry"}{status !== "submitting" && <ArrowRight />}</button>
  </form>;
}

function Field({ name, label, type = "text", required = false, error, ...inputProps }) {
  return <label className="field" htmlFor={name}><span>{label} {required && <b aria-hidden="true">*</b>}</span><input id={name} name={name} type={type} required={required} aria-required={required || undefined} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} aria-errormessage={error ? `${name}-error` : undefined} {...inputProps} />{error && <small id={`${name}-error`}>{error}</small>}</label>;
}

function ContextFaqs({ title, items }) {
  return <section className="context-faq section-shell"><div><p className="eyebrow">Useful before you enquire</p><h2>{title}</h2><Link className="text-link" to="/faq">View all FAQs <ArrowRight /></Link></div><div>{items.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<CaretDown /></summary><p>{answer}</p></details>)}</div></section>;
}

function FaqPage() {
  return <><section className="form-page-heading faq-heading"><p className="eyebrow">The practical details</p><h1 tabIndex="-1">Frequently asked<br /><em>questions.</em></h1></section><section className="faq-list section-shell">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span><h2>{question}</h2><CaretDown /></summary><p>{answer}</p></details>)}</section><TourBand /></>;
}

const policies = {
  privacy: { eyebrow: "Your information", title: "Privacy Policy", intro: "How Cloud Studios handles information submitted through enquiries, tour requests and website use.", updated: "2 September 2026", sections: [["Website forms", "Contact and tour forms send the information you provide to Cloud Studios and keep a private submission record so the team can respond and administer your request."], ["Information collected", "Contact details, enquiry or booking information and basic website analytics may be collected when you contact Cloud Studios, book a tour or use the website."], ["How information is used", "Information is used to respond to enquiries, arrange tours, provide requested services and improve the website experience."], ["Sharing", "Cloud Studios does not sell personal information. Information is shared only with service providers needed to operate the website or process enquiries, and only as required."], ["Privacy contact", `Questions about your information can be sent to ${contact.email}.`]] },
  workplace: { eyebrow: "Working well together", title: "Workplace Policy", intro: "Professional standards and shared-space expectations for members, guests and visitors.", updated: "15 February 2026", sections: [["Professional conduct", "Treat others respectfully, maintain reasonable noise levels, and do not engage in harassment, discrimination, intimidation or abusive behaviour."], ["Private offices & access", "Use private offices for legitimate professional activity, keep access credentials secure and secure your office and belongings when leaving."], ["Shared spaces", "Leave communal areas clean, follow waste and recycling guidance, and return furniture and equipment to their original configuration."], ["Meeting rooms & guests", "Use booked facilities within the agreed time and remain responsible for your guests while they are on site."], ["Safety, security & privacy", "Do not share access devices or codes. Respect confidential work and do not record in shared spaces without clear permission."], ["Enforcement", "Cloud Studios may use warnings, suspend access or terminate an arrangement in accordance with the relevant agreement and applicable law."]] },
  terms: { eyebrow: "Using this website", title: "Terms of Service", intro: "The basis on which Cloud Studios presents website information, enquiries and bookings.", updated: "2 September 2026", sections: [["Business identity", contact.brand], ["Website information", "Information is provided in good faith and may change without notice. Contact the team to confirm current pricing, availability and service details."], ["Bookings", "Meeting-room, tour and workspace bookings are subject to confirmation by Cloud Studios. Confirm the applicable booking terms directly before relying on a date or service."], ["Website enquiries", "Sending a form does not create a booking or service agreement. Cloud Studios will contact you directly to confirm availability and next steps."], ["Acceptable use", "Do not misuse the website, attempt unauthorised access or interfere with its operation."], ["Third-party links", "External services such as Google Maps operate under their own terms and policies."], ["Contact", `Questions about these terms can be sent to ${contact.email}.`]] },
};

function PolicyPage({ type }) {
  const policy = policies[type];
  return <><section className="policy-heading"><p className="eyebrow">{policy.eyebrow}</p><h1 tabIndex="-1">{policy.title}</h1><p>{policy.intro}</p><small>Last updated {policy.updated}</small></section><section className="policy-content section-shell">{policy.sections.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</section></>;
}

function NotFound() {
  return <section className="not-found"><p className="eyebrow">404</p><h1 tabIndex="-1">This room is not on the plan.</h1><Link className="primary-button" to="/">Return home <ArrowRight /></Link></section>;
}

function Footer() {
  const serviceLinks = routes.slice(1, 7);
  const detailLinks = routes.slice(7);
  return <footer className="site-footer"><div className="footer-lead"><img src={assets.logo} alt="Cloud Studios" loading="eager" decoding="async" /><h2>A calmer place<br />to do <em>good work.</em></h2></div><div className="footer-links"><div><p>Workspaces</p>{serviceLinks.map(([path, label]) => <Link key={path} to={path}>{label}</Link>)}</div><div><p>Information</p>{detailLinks.map(([path, label]) => <Link key={path} to={path}>{label}</Link>)}</div><div><p>Visit</p><address>{contact.address}</address><a href={contact.phoneHref}>{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a></div></div><div className="footer-base"><span>{contact.brand}</span><span>© {new Date().getFullYear()} Cloud Studios</span></div></footer>;
}

function MobileCallBar({ menuOpen }) {
  return <a className={`mobile-call-bar ${menuOpen ? "is-suppressed" : ""}`} href={contact.phoneHref} aria-label={`Call Cloud Studios on ${contact.phone}`} aria-hidden={menuOpen} tabIndex={menuOpen ? -1 : undefined}><Phone weight="bold" /><span>Call us on {contact.phone}</span></a>;
}
