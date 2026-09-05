import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { allImageSources, availabilityChecked, classifyIntent, contact, imagePreloadsForPath, pageMeta, pricing, routes, servicePages, siteUrl, structuredDataForPath, validateForm } from "../src/site.js";

test("route manifest and shared business facts stay complete", () => {
  assert.equal(routes.length, 14);
  assert.deepEqual(routes.map(([path]) => path), [
    "/", "/office-suites", "/dedicated-desks", "/meeting-rooms",
    "/virtual-office-auckland", "/experiences", "/community", "/contact",
    "/book-a-tour", "/faq", "/privacy-policy", "/workplace-policy", "/terms-of-service", "/location",
  ]);
  assert.equal(contact.email, "admin@cloudstudios.co.nz");
  assert.equal(contact.phoneHref, "tel:+6492188670");
  assert.match(contact.address, /109 Great South Road/);
  assert.equal(contact.brand, "Cloud Studios");
  assert.equal(siteUrl, "https://cloudstudios.co.nz");
  assert.equal(Object.keys(pageMeta).length, routes.length);
  assert.ok(routes.every(([path]) => pageMeta[path]?.title && pageMeta[path]?.description));
});

test("homepage exposes one preferred Google site name", () => {
  const homeGraph = structuredDataForPath("/")["@graph"];
  const website = homeGraph.filter((item) => item["@type"] === "WebSite");
  assert.equal(website.length, 1);
  assert.equal(website[0].name, "Cloud Studios");
  assert.equal(website[0].url, "https://cloudstudios.co.nz/");
  assert.equal(structuredDataForPath("/meeting-rooms")["@graph"].some((item) => item["@type"] === "WebSite"), false);
});

test("WebP images stay within the eager-loading budget", () => {
  const directory = new URL("../public/assets/cloud-studios/", import.meta.url);
  const webpFiles = readdirSync(directory).filter((file) => file.endsWith(".webp"));
  const sizes = webpFiles.map((file) => statSync(new URL(file, directory)).size);
  assert.ok(sizes.every((size) => size <= 320 * 1024));
  assert.ok(sizes.reduce((total, size) => total + size, 0) <= 3.5 * 1024 * 1024);
  assert.ok(allImageSources.every((source) => source.endsWith(".webp")));
  assert.deepEqual(imagePreloadsForPath("/experiences"), ["/assets/cloud-studios/logo.webp", "/assets/cloud-studios/experiences-hero-v4.webp"]);
  assert.deepEqual(imagePreloadsForPath("/location"), ["/assets/cloud-studios/logo.webp", "/assets/cloud-studios/location-building-v5.webp"]);
});

test("published pricing is present", () => {
  assert.equal(pricing.desks[0][1], "From $300 + GST / month");
  assert.equal(pricing.meeting[2][1], "$360 / day (+GST)");
  assert.ok(pricing.offices.some(({ status }) => status === "Leased"));
  assert.match(availabilityChecked, /2026/);
});

test("service pages use intent-specific actions and decision facts", () => {
  assert.match(servicePages.offices.action.to, /book-a-tour/);
  assert.match(servicePages.desks.action.to, /book-a-tour/);
  assert.match(servicePages.meeting.action.to, /contact/);
  assert.match(servicePages.virtual.action.to, /contact/);
  assert.ok(Object.values(servicePages).every(({ facts, faqs }) => facts.length >= 4 && faqs.length >= 3));
});

test("form validation checks required fields and email", () => {
  assert.deepEqual(validateForm({}, ["name", "email"]), {
    name: "This field is required.", email: "This field is required.",
  });
  assert.equal(validateForm({ name: "Kexin", email: "wrong" }, ["name", "email"]).email, "Enter a valid email address.");
  assert.deepEqual(validateForm({ name: "Kexin", email: "hello@example.com" }, ["name", "email"]), {});
});

test("intent instrumentation classifies conversion links", () => {
  assert.equal(classifyIntent("tel:+6492188670"), "phone_click");
  assert.equal(classifyIntent("mailto:admin@cloudstudios.co.nz"), "email_click");
  assert.equal(classifyIntent(contact.maps), "map_click");
  assert.equal(classifyIntent("/book-a-tour", "tour_cta"), "tour_cta");
  assert.equal(classifyIntent("/faq"), "");
});

test("production form handlers require authenticated SMTP and preserve delivery outcomes", () => {
  const common = readFileSync(new URL("../public/includes/form-common.php", import.meta.url), "utf8");
  const enquiry = readFileSync(new URL("../public/send-enquiry.php", import.meta.url), "utf8");
  const tour = readFileSync(new URL("../public/send-tour.php", import.meta.url), "utf8");

  assert.match(common, /private\/cloud-studios-forms/);
  assert.match(common, /CS_SMTP_PASSWORD/);
  assert.doesNotMatch(common, /'smtp_password'\s*=>\s*'[^']+'/);
  assert.doesNotMatch(common, /cs_php_mail_send/);
  assert.doesNotMatch(common, /@mail\s*\(/);
  assert.match(common, /smtp_not_configured/);
  assert.match(common, /'transport'\s*=>\s*'smtp'/);
  assert.match(enquiry, /cs_log_submission\('enquiry'/);
  assert.match(enquiry, /enquiry-admin/);
  assert.match(enquiry, /enquiry-customer/);
  assert.match(enquiry, /confirmation_sent/);
  assert.match(tour, /cs_log_submission\('tour'/);
  assert.match(tour, /Content-Type: text\/calendar/);
  assert.match(tour, /ORGANIZER;CN=Cloud Studios/);
  assert.match(tour, /ATTENDEE;CN=/);
  assert.match(tour, /STATUS:TENTATIVE/);
  assert.match(tour, /tour-admin/);
  assert.match(tour, /tour-customer/);
  assert.match(tour, /confirmation_sent/);
});
