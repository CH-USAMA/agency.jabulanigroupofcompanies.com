# Jabulani Tech Solutions — Agency Website

Marketing website for **Jabulani Tech Solutions**, the IT/web-development arm of the
Jabulani Group of Companies (Eastern Cape, South Africa).

**Live domain:** `agency.jabulanigroupofcompanies.co.za`
**Hosting:** Hostinger shared hosting (Apache + PHP, no Node/build step)

---

## 1. What this site is

A static, hand-built marketing site — no frameworks, no build tools, no npm install.
Just HTML, CSS, vanilla JavaScript, and one small PHP script for the contact form.
You can edit any file directly and upload it to the server; nothing needs to be
"compiled".

It presents Jabulani Tech Solutions' services (web design, POS systems, SEO,
IT support, AI automation, marketing pipelines), showcases four real projects
built for the wider Jabulani Group, and collects enquiries through a contact form
that emails straight to `info@jabulanigroupofcompanies.co.za`.

---

## 2. Folder structure

```
agency.jabulanigroupofcompanies.com/
├── index.html              Home page (hero, services, portfolio, about, contact)
├── project-quarry.html     Case study — Jabulani Crush & Quarry website
├── project-pos.html        Case study — Jabulani Point of Sale system
├── project-group.html      Case study — Jabulani Group corporate website
├── project-store.html      Case study — Jabulani Store e-commerce site
├── 404.html                Custom "page not found" page (auto-redirects home)
├── form.php                Contact form handler — sends email via SMTP
├── secrets.php             SMTP password & mailbox config (gitignored — never committed)
├── secrets.example.php     Template for secrets.php with placeholder values (safe to commit)
├── .htaccess               Server config: HTTPS redirect, caching, security headers
├── robots.txt              Tells search engines what to crawl
├── sitemap.xml             List of all pages for search engines
├── .gitignore              Files Git should never track (see §7)
│
├── css/
│   ├── style.css           Main stylesheet (layout, components, dark mode, animations)
│   └── project.css         Stylesheet for the case-study pages
│
├── js/
│   └── main.js             All interactivity (see §4)
│
└── images/
    ├── logo.png / logo-white.png      Brand logo (light/dark variants)
    ├── favicon.png                     Browser tab icon
    ├── team-*.{png,webp,jpeg}          Team member photos
    ├── project-*.svg                   Portfolio preview illustrations
    └── og-image.svg                    Social share preview image (Facebook/WhatsApp/etc.)
```

---

## 3. Pages on the site

| Page | URL | Purpose |
|---|---|---|
| Home | `/` (`index.html`) | Hero, 6 services, 4-project portfolio, about/team, stats, contact form |
| Quarry case study | `/project-quarry.html` | Story behind the Jabulani Crush & Quarry website |
| POS case study | `/project-pos.html` | Story behind the Jabulani Point of Sale system |
| Group case study | `/project-group.html` | Story behind the Jabulani Group corporate site |
| Store case study | `/project-store.html` | Story behind the Jabulani Store e-commerce site |
| 404 page | `/404.html` | Shown automatically for broken links; redirects home after 10s |

All four case-study pages share the same layout (`css/project.css`): a hero with
project tags and metadata, a "Challenge vs Solution" section, a features grid,
results/stats, a call-to-action banner, and links to other projects.

---

## 4. Features

- **Apple-inspired design** — deep indigo accent (`#4641f0`), generous spacing,
  rounded 28px cards, Inter typeface
- **Dark mode** — toggle in the nav, remembers the visitor's choice (`localStorage`),
  also respects their OS preference on first visit
- **Custom cursor** — a small dot plus a smoothly-trailing ring that reacts to
  links, buttons, and project cards (desktop only)
- **Scroll progress bar** — thin indigo bar at the top of the page that fills as
  you scroll
- **Animated hero text** — "Build. Launch. Grow." reveals line-by-line on page load
- **Scroll-triggered reveals** — sections fade/slide into view as you scroll
  (`IntersectionObserver`), including animated counters in the stats section
- **3D tilt cards** — portfolio and service cards subtly tilt toward the cursor
- **Magnetic buttons** — primary call-to-action buttons gently follow the cursor
- **Mobile-friendly navigation** — hamburger menu with dark-mode toggle, scrollable
  if content is tall, no overflow into the page below
- **WhatsApp floating button** — direct chat link on every page
- **Contact form** — validates input, blocks spam with a hidden honeypot field,
  and emails enquiries straight to the inbox (see §5)

All of this lives in `js/main.js` (interactivity) and the animation section near
the bottom of `css/style.css`.

---

## 5. Contact form (`form.php`)

The form on the home page posts to `form.php`, which:

1. Checks the request is a real form submission (not spam/bots — honeypot field)
2. Cleans and validates the name, email, business, phone, service, and message
3. Loads the mailbox password from `secrets.php` (see §7 — kept out of Git)
4. Sends the enquiry by email using Hostinger's SMTP server directly over a
   socket connection with STARTTLS encryption — **no external libraries** like
   PHPMailer are needed, which keeps the site lightweight
5. Replies to the website with a JSON success/error message, which `js/main.js`
   shows to the visitor without reloading the page (with a `mailto:` link as a
   fallback if something goes wrong)

`form.php` itself contains **no password** — it simply does
`require __DIR__ . '/secrets.php'` and uses the constants defined there. This
means `form.php` is now safe to commit to Git or share publicly.

---

## 6. SEO & social sharing

The site is set up to be found on Google and to look good when shared on social
media / WhatsApp:

- Unique `<title>` and meta description on every page
- `robots.txt` and `sitemap.xml` so search engines know what to index
- Canonical URLs to avoid duplicate-content issues
- Open Graph and Twitter Card tags (so links shared on Facebook, WhatsApp,
  LinkedIn, X/Twitter show a nice preview card with `images/og-image.svg`)
- Schema.org structured data (`ProfessionalService` + `OfferCatalog`) describing
  the business, location, opening hours, and full service list to Google
- Geo meta tags pinning the business to the Eastern Cape, South Africa
- `.htaccess` rules for HTTPS redirects, GZIP compression, and browser caching —
  all of which Google factors into search rankings

**One thing still to do:** `og-image.svg` is a vector image. Most major platforms
(WhatsApp, iMessage, Slack, LinkedIn) render it fine, but Facebook and X/Twitter
currently prefer a raster image for link previews. When you get a chance, take a
1200×630px screenshot of the homepage (or have one designed), save it as
`images/og-image.jpg`, and update the five `og:image` / `twitter:image` tags
across the HTML files to point at the `.jpg` instead of the `.svg`.

---

## 7. ⚠️ Security — credentials & GitHub

The mailbox password used to send emails from the contact form **does not live
in `form.php` anymore**. It's been moved into its own file so the rest of the
code can be safely pushed to GitHub (public or private):

| File | Contains real password? | Tracked by Git? |
|---|---|---|
| `form.php` | No — just `require`s `secrets.php` | ✅ Yes, safe to commit |
| `secrets.php` | **Yes** — the real SMTP credentials | ❌ No — listed in `.gitignore` |
| `secrets.example.php` | No — placeholder values only | ✅ Yes, committed as a template |

**How it works:**

- `form.php` calls `require __DIR__ . '/secrets.php'` to load the SMTP constants
  (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, etc.) at runtime
- `secrets.php` holds the actual password and is listed in `.gitignore`, so Git
  will never track or upload it to GitHub — it only exists on your local machine
  and on the live server
- `secrets.example.php` is a safe-to-share template showing the *shape* of the
  file (with fake placeholder values) so anyone setting the project up fresh
  knows what to create

**Setting up on a new machine or server:**
1. Copy `secrets.example.php` → rename the copy to `secrets.php`
2. Fill in the real SMTP host/user/password values
3. Upload `secrets.php` to the server **by hand** (Hostinger File Manager / FTP)
   — never via Git, since it's intentionally excluded

**If the old password has ever been exposed** (e.g. pasted in chat, visible in
old commits, screenshots, shared with a contractor), the safest move is to log
into Hostinger, change that mailbox's password, and update `SMTP_PASS` inside
`secrets.php` to match the new one. Old Git history that may still contain the
previous password is harmless once the password itself has been rotated.

The live server also blocks direct browser access to `.htaccess`, `.env`, and
similar sensitive files (see the "Block access to sensitive files" rule in
`.htaccess`) — `secrets.php` should be added to that block list too if it's ever
placed in a publicly-accessible folder.

---

## 8. Making changes

Because this is a plain HTML/CSS/JS site, editing it is straightforward:

- **Text/content** — open the relevant `.html` file in any text editor and edit
  the text between the tags. Don't delete the tags themselves (the bits in
  `< >`), just the words around them.
- **Colours/spacing/fonts** — these live in `css/style.css` (and `css/project.css`
  for case-study pages) as CSS variables near the top of the file.
- **Images** — replace files in `images/` with new ones of the *same file name*
  to swap them out without editing any HTML. Keep similar dimensions for best
  results.
- **Adding a new project/case study** — copy one of the existing `project-*.html`
  files, rename it, update its text/links/images, then add a card linking to it
  in the portfolio section of `index.html` (and in the "More Work" section of the
  other case-study pages if you want it cross-linked).

After editing, always preview the page locally by double-clicking the `.html`
file to open it in a browser before uploading to the live site.

---

## 9. Deployment (Hostinger)

1. Log into **Hostinger hPanel** → File Manager (or use an FTP client like FileZilla)
2. Navigate to the subdomain's web root (e.g. `public_html/agency` or wherever
   `agency.jabulanigroupofcompanies.co.za` is pointed)
3. Upload the entire project folder contents — **except** the files listed in
   `.gitignore` that shouldn't go to a public repo (this doesn't apply to
   uploading to your own private hosting; upload everything needed to run the
   site, including `form.php`, `.htaccess`, all HTML/CSS/JS/images)
4. Confirm the subdomain's DNS/SSL is active in hPanel so `https://` works
   (the `.htaccess` file forces every visitor onto HTTPS automatically)
5. Visit the live URL and test:
   - All pages load and look correct on desktop and mobile
   - Dark mode toggle works and is remembered after a refresh
   - The contact form sends a real email to `info@jabulanigroupofcompanies.co.za`
   - Broken links show the custom 404 page (try a made-up URL like `/test123`)
   - WhatsApp button opens a chat with the pre-filled message
6. Submit `sitemap.xml` to **Google Search Console** so the site gets indexed faster

---

## 10. Tech stack summary

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Plain CSS3 (custom properties / variables, Grid, Flexbox, no preprocessor) |
| Interactivity | Vanilla JavaScript (no jQuery, no frameworks) |
| Backend | PHP (single script, raw SMTP socket — no Composer/PHPMailer) |
| Fonts/Icons | Google Fonts (Inter), Font Awesome (via CDN) |
| Hosting | Hostinger shared hosting (Apache + `.htaccess`) |
| Version control | Git |

No `package.json`, no `node_modules`, no build step — what you edit is what ships.
