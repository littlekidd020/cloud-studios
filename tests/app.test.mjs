import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { availabilityChecked, classifyIntent, contact, pageMeta, pricing, routes, servicePages, validateForm } from "../src/site.js";

test("route manifest and shared business facts stay complete", () => {
  assert.equal(routes.length, 13);
  assert.deepEqual(routes.map(([path]) => path), [
    "/", "/office-suites", "/dedicated-desks", "/meeting-rooms",
    "/virtual-office-auckland", "/experiences", "/community", "/contact",
    "/book-a-tour", "/faq", "/privacy-policy", "/workplace-policy", "/terms-of-service",
  ]);
  assert.equal(contact.email, "admin@cloudstudios.co.nz");
  assert.equal(contact.phoneHref, "tel:+6492188670");
  assert.match(contact.address, /109 Great South Road/);
  assert.equal(contact.company, "Lunar Palace Limited");
  assert.equal(Object.keys(pageMeta).length, routes.length);
  assert.ok(routes.every(([path]) => pageMeta[path]?.title && pageMeta[path]?.description));
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

test("production form handlers retain the legacy delivery and storage contract", () => {
  const common = readFileSync(new URL("../public/includes/form-common.php", import.meta.url), "utf8");
  const enquiry = readFileSync(new URL("../public/send-enquiry.php", import.meta.url), "utf8");
  const tour = readFileSync(new URL("../public/send-tour.php", import.meta.url), "utf8");

  assert.match(common, /private\/cloud-studios-forms/);
  assert.match(common, /CS_SMTP_PASSWORD/);
  assert.doesNotMatch(common, /'smtp_password'\s*=>\s*'[^']+'/);
  assert.match(enquiry, /cs_log_submission\('enquiry'/);
  assert.match(enquiry, /enquiry-admin/);
  assert.match(enquiry, /enquiry-customer/);
  assert.match(tour, /cs_log_submission\('tour'/);
  assert.match(tour, /Content-Type: text\/calendar/);
  assert.match(tour, /tour-admin/);
  assert.match(tour, /tour-customer/);
});
