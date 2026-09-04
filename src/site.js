export const contact = {
  phone: "09 218 8670",
  phoneHref: "tel:+6492188670",
  email: "admin@cloudstudios.co.nz",
  address: "Level 2, 109 Great South Road, Epsom, Auckland 1051, New Zealand",
  brand: "Cloud Studios",
  latitude: -36.8844193,
  longitude: 174.7862103,
  maps: "https://www.google.com/maps/place/Cloud+Studios+%E9%9B%B2%E9%96%93/@-36.8844193,174.7862103,17z/data=!3m1!4b1!4m6!3m5!1s0x6d0d491643dcece7:0xc6d9e22b8971e183!8m2!3d-36.8844193!4d174.7862103!16s%2Fg%2F11yvkvfdnp?entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoASAFQAw%3D%3D",
};

export const siteUrl = "https://cloudstudios.co.nz";

export const assets = {
  logo: "/assets/cloud-studios/logo.webp",
  office: "/assets/cloud-studios/office-o3-v4.webp",
  officeOne: "/assets/cloud-studios/office-o1-v4.webp",
  officeTwo: "/assets/cloud-studios/office-o2-v4.webp",
  officeThree: "/assets/cloud-studios/office-o3-v4.webp",
  desks: "/assets/cloud-studios/desks-hero-v4.webp",
  desksWide: "/assets/cloud-studios/desks-wide-v4.webp",
  desksTwo: "/assets/cloud-studios/desks-d2-v4.webp",
  meeting: "/assets/cloud-studios/meeting-hero-v2.webp",
  meetingM1: "/assets/cloud-studios/meeting-m1.webp",
  meetingTwo: "/assets/cloud-studios/meeting-2-v2.webp",
  meetingFour: "/assets/cloud-studios/meeting-4-v2.webp",
  virtual: "/assets/cloud-studios/virtual-hero-v2.webp",
  experiences: "/assets/cloud-studios/experiences-hero-v4.webp",
  community: "/assets/cloud-studios/community-hero-v3.webp",
  building: "/assets/cloud-studios/building-v4.webp",
  mosaicOffice: "/assets/cloud-studios/mosaic-office-v2.webp",
  mosaicMeeting: "/assets/cloud-studios/mosaic-meeting-v2.webp",
  mosaicAddress: "/assets/cloud-studios/mosaic-address-v2.webp",
  mosaicCommunity: "/assets/cloud-studios/mosaic-community-v2.webp",
};

export const routes = [
  ["/", "Home"],
  ["/office-suites", "Office Suites"],
  ["/dedicated-desks", "Dedicated Desks"],
  ["/meeting-rooms", "Meeting Rooms"],
  ["/virtual-office-auckland", "Virtual Office"],
  ["/experiences", "Experiences"],
  ["/community", "Community"],
  ["/contact", "Contact"],
  ["/book-a-tour", "Book a Tour"],
  ["/faq", "FAQ"],
  ["/privacy-policy", "Privacy Policy"],
  ["/workplace-policy", "Workplace Policy"],
  ["/terms-of-service", "Terms of Service"],
];

export const services = [
  {
    path: "/office-suites",
    eyebrow: "Private, serviced and ready",
    title: "Private Office Suites",
    summary: "Premium serviced offices in Epsom, Auckland, for people who value privacy, focus and a polished place to meet clients.",
    price: "From $1,200 + GST / month",
    availability: "Waitlist open · M2 team suite POA",
    image: assets.office,
    imageAlt: "Furnished private office at Cloud Studios",
    features: ["Furnished, lockable rooms", "Internet, utilities and shared amenities", "Flexible terms and room to scale"],
  },
  {
    path: "/dedicated-desks",
    eyebrow: "Your own desk, every day",
    title: "Dedicated Desks",
    summary: "A fixed, reserved workstation in a calm Epsom coworking space, available part-time or full-time.",
    price: "From $300 + GST / month",
    image: assets.desks,
    imageAlt: "Dedicated desk workspace at Cloud Studios",
    features: ["A desk that stays yours", "Meeting-room options", "A clear path into a private office"],
  },
  {
    path: "/meeting-rooms",
    eyebrow: "Meet, present and train",
    title: "Meeting Rooms",
    summary: "A practical, professional meeting and training room in Epsom with fast internet and straightforward booking.",
    price: "From $60 + GST / hour",
    image: assets.meeting,
    imageAlt: "Cloud Studios meeting room set for a workshop",
    features: ["Up to 12 boardroom-style", "20+ for presentations", "65-inch interactive display and HDMI"],
  },
  {
    path: "/virtual-office-auckland",
    eyebrow: "A credible Auckland presence",
    title: "Virtual Office",
    summary: "Use a professional Epsom business address with mail handling, without taking a permanent office.",
    price: "Enquire for current options",
    image: assets.virtual,
    imageAlt: "Cloud Studios staff member sorting mail for virtual office clients",
    features: ["Professional business address", "Mail handling", "Upgrade when your workspace needs change"],
  },
];

export const pricing = {
  offices: [
    { name: "O1", detail: "Private office", status: "Leased" },
    { name: "O2", detail: "Private office", status: "Leased" },
    { name: "O3", detail: "Private office", status: "Leased" },
    { name: "P2", detail: "Private office", status: "Leased" },
    { name: "P1", detail: "Private office", status: "Leased" },
    { name: "M2", detail: "Team suite · whole room", status: "POA" },
  ],
  desks: [
    ["Part-time dedicated desk", "From $300 + GST / month"],
    ["Full-time dedicated desk", "From $430 + GST / month"],
    ["M2 team suite · up to 8", "POA"],
  ],
  meeting: [
    ["Hourly", "$60 / hour (+GST)"],
    ["Half day", "$200 / half day (+GST)"],
    ["Full day", "$360 / day (+GST)"],
  ],
};

export const availabilityChecked = "1 September 2026";

export const servicePages = {
  offices: {
    title: "Private Office Suites",
    intro: "A private, furnished room for your team, with the practical details already taken care of.",
    kicker: "From $1,200 + GST / month · all-inclusive · waitlist open",
    action: { label: "Book a viewing", to: "/book-a-tour?interest=Office%20Suites#tour-form" },
    gallery: [assets.officeOne, assets.officeTwo, assets.officeThree],
    facts: [
      ["Team fit", "Private suites for 1–4 people"],
      ["Included", "Fast Wi-Fi, utilities, coffee and shared amenities"],
      ["Ready to use", "Furnished, lockable rooms with meeting rooms available"],
      ["Terms & access", "Flexible terms and on-site car park"],
    ],
    faqs: [
      ["Do you offer flexible terms?", "Yes. Office suites can be arranged on flexible terms without a long lease lock-in. Availability depends on suite size."],
      ["What is included?", "High-speed Wi-Fi, utilities, coffee, shared amenities and a furnished setup are included."],
      ["How do I check availability?", "All five private suites are currently leased. Join the waitlist or ask about the M2 team suite, which is available by quote."],
    ],
  },
  desks: {
    title: "Dedicated Desks in Epsom",
    intro: "Your own reserved workstation in a professional coworking environment, with part-time and full-time options.",
    kicker: "From $300 + GST / month",
    action: { label: "Book a desk tour", to: "/book-a-tour?interest=Dedicated%20Desks#tour-form" },
    gallery: [assets.desksWide, assets.desks, assets.desksTwo],
    facts: [
      ["Part-time", "A reserved desk a few days per week from $300 + GST"],
      ["Full-time", "Your desk every weekday from $430 + GST"],
      ["Consistent setup", "Fixed seating means you can leave your setup in place"],
      ["Room to grow", "Meeting rooms are available, with a path into a private office"],
    ],
    faqs: [
      ["What is a dedicated desk?", "It is a reserved workstation that stays yours, avoiding the daily pack-down of casual hot desking."],
      ["Can a small team sit together?", "Ask about grouped desks or the M2 team suite for up to eight people."],
      ["Can I meet clients here?", "Yes. Professional meeting rooms can be booked when you need them."],
    ],
  },
  meeting: {
    title: "Meeting & Training Room Hire",
    image: assets.meetingM1,
    intro: "A flexible room for workshops, presentations and client conversations, close to Newmarket in Epsom.",
    kicker: "$60 / hour (+GST) · clear confirmation",
    action: { label: "Check availability", to: "/contact?interest=Meeting%20Rooms#enquiry" },
    gallery: [assets.meetingM1, assets.meetingFour, assets.meetingM1],
    facts: [
      ["Capacity", "12 boardroom-style or 20+ in presentation format"],
      ["AV included", "65-inch interactive display, HDMI and fast internet"],
      ["Flexible sessions", "Hourly, half-day, full-day and recurring bookings"],
      ["Access", "Epsom near Newmarket, with on-site and nearby street parking"],
    ],
    faqs: [
      ["What are the rates?", "Rates are $60 per hour, $200 per half day or $360 per full day, all plus GST. Ask about recurring or multi-day pricing."],
      ["How many people fit?", "The room seats 12 comfortably in boardroom format and can accommodate more than 20 for presentations."],
      ["What technology is included?", "A 65-inch interactive display, professional screen, HDMI connection and fast internet are included."],
    ],
  },
  virtual: {
    title: "Virtual Office Services",
    intro: "Build a credible Auckland presence with a professional Epsom address and mail handling.",
    kicker: "Enquire for current options",
    action: { label: "Ask about virtual office", to: "/contact?interest=Virtual%20Office#enquiry" },
    gallery: [assets.virtual, assets.building, assets.community],
    facts: [
      ["Professional presence", "A real Epsom business address near Newmarket"],
      ["Mail handling", "A practical address service without a full-time office"],
      ["Cost control", "An alternative to renting space you do not need every day"],
      ["Upgrade path", "Move into a dedicated desk or office suite as you grow"],
    ],
    faqs: [
      ["What is a virtual office?", "It provides a professional business address without renting a full-time physical office, with mail handling available."],
      ["Is Epsom a suitable business address?", "Epsom is a central, well-known Auckland location close to Newmarket."],
      ["Can I upgrade later?", "Yes. You can move into a dedicated desk or private office when you need physical workspace."],
    ],
  },
};

export const faqs = [
  ["What kind of workspace is Cloud Studios?", "Cloud Studios is a managed serviced office and coworking space in Epsom. It is designed as a quiet, low-density, work-focused environment rather than a large social coworking floor."],
  ["Where is Cloud Studios located?", contact.address],
  ["Is parking available?", "On-site parking may be available by arrangement and is subject to availability."],
  ["Who is the space best suited to?", "The space suits consultants, advisers, brokers, accountants, agencies, remote professionals and small teams who want a calm professional base."],
  ["What is included with a private office?", "Private suites are furnished and lockable, with internet, utilities and access to shared amenities included."],
  ["What is a dedicated desk?", "A dedicated desk is a fixed workstation reserved for you, so you can leave your setup in place between visits."],
  ["How many people fit in the meeting room?", "The main room seats up to 12 boardroom-style and can accommodate more than 20 people for presentations."],
  ["Can I use Cloud Studios as my business address?", "Yes. Virtual office services include a professional Epsom business address and mail handling."],
];

export const pageMeta = {
  "/": { title: "Cloud Studios | Serviced Offices & Coworking Epsom", description: "Premium serviced offices, dedicated desks, meeting rooms and virtual office services at 109 Great South Road, Epsom, Auckland." },
  "/office-suites": { title: "Private Office Suites Epsom | Cloud Studios", description: "Furnished, lockable serviced offices for small teams in Epsom, with flexible terms, included utilities and on-site parking." },
  "/dedicated-desks": { title: "Dedicated Desks Epsom Auckland | Cloud Studios", description: "Part-time and full-time reserved desks in a quiet professional workspace near Newmarket, from $300 + GST per month." },
  "/meeting-rooms": { title: "Meeting & Training Room Hire Epsom | Cloud Studios", description: "Hire a meeting and training room near Newmarket for up to 12 boardroom-style or 20+ presentation-style, from $60 + GST per hour." },
  "/virtual-office-auckland": { title: "Virtual Office & Business Address Epsom | Cloud Studios", description: "A professional Epsom business address and mail handling for Auckland businesses that do not need a permanent office." },
  "/experiences": { title: "Training, Workshops & Private Sessions | Cloud Studios", description: "A premium Epsom setting for training, workshops, presentations and carefully planned private sessions." },
  "/community": { title: "Professional Workspace Community Epsom | Cloud Studios", description: "A calm, work-oriented community for independent professionals and small teams in Epsom, Auckland." },
  "/contact": { title: "Contact Cloud Studios Epsom", description: "Contact Cloud Studios about serviced offices, desks, meeting rooms, virtual office services or experiences in Epsom." },
  "/book-a-tour": { title: "Book a Cloud Studios Tour | Epsom Auckland", description: "Request a quick, no-pressure tour of Cloud Studios at 109 Great South Road, Epsom." },
  "/faq": { title: "Cloud Studios FAQ | Epsom Workspace", description: "Answers about Cloud Studios office suites, dedicated desks, meeting rooms, virtual office services, access and parking." },
  "/privacy-policy": { title: "Privacy Policy | Cloud Studios", description: "How Cloud Studios handles information submitted through enquiries, tour requests and website use." },
  "/workplace-policy": { title: "Workplace Policy | Cloud Studios", description: "Professional conduct, access, shared-space, guest, safety and privacy expectations at Cloud Studios." },
  "/terms-of-service": { title: "Terms of Service | Cloud Studios", description: "Terms governing use of the Cloud Studios website, enquiries and confirmed bookings." },
};

export function structuredDataForPath(path) {
  const businessId = `${siteUrl}/#business`;
  const graph = [];

  if (path === "/") {
    graph.push({
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: contact.brand,
      publisher: { "@id": businessId },
    });
  }

  graph.push({
    "@type": "LocalBusiness",
    "@id": businessId,
    name: contact.brand,
    url: `${siteUrl}/`,
    logo: `${siteUrl}${assets.logo}`,
    telephone: "+6492188670",
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Level 2, 109 Great South Road",
      addressLocality: "Epsom",
      addressRegion: "Auckland",
      postalCode: "1051",
      addressCountry: "NZ",
    },
    geo: { "@type": "GeoCoordinates", latitude: contact.latitude, longitude: contact.longitude },
    areaServed: "Auckland",
  });

  const service = services.find((item) => item.path === path);
  if (service) {
    graph.push({
      "@type": "Service",
      name: service.title,
      description: service.summary,
      areaServed: "Auckland",
      provider: { "@id": businessId },
    });
  }

  if (path === "/faq") {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export function validateForm(values, required) {
  const errors = Object.fromEntries(required.filter((name) => !String(values[name] || "").trim()).map((name) => [name, "This field is required."]));
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email address.";
  return errors;
}

export function classifyIntent(href = "", explicit = "") {
  return explicit || (href.startsWith("tel:") ? "phone_click" : href.startsWith("mailto:") ? "email_click" : href.includes("google.com/maps") ? "map_click" : "");
}
