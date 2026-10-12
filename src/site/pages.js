'use strict';

const leadership = require('../data/leadership.json');
const projects = require('../data/projects.json');
const images = require('./images');
const site = require('../data/site.json');
const { contactForm } = require('./layout');

/* Reusable interior page header with an image band. */
function pageHeader({ eyebrow, title, sub, image }) {
  return `
  <header class="page-header" style="--ph-image:url('${image}')">
    <div class="page-header-media" aria-hidden="true"></div>
    <div class="wrap page-header-inner">
      <span class="eyebrow">${eyebrow}</span>
      <h1 data-reveal>${title}</h1>
      ${sub ? `<p data-reveal>${sub}</p>` : ''}
    </div>
  </header>`;
}

/**
 * A full-height chapter of the landing page. Each one carries its own
 * photograph over the site-wide underlay, so scrolling the page reads as
 * moving through a building rather than down a document.
 */
function chapter({ id, label, image, tone = '', inner }) {
  return `
  <section class="chapter ${tone}" id="${id}" data-chapter="${label}">
    ${image ? `<div class="chapter-media" aria-hidden="true"><img src="${image}" alt="" loading="lazy" decoding="async" /></div>
    <div class="chapter-scrim" aria-hidden="true"></div>` : ''}
    <div class="wrap chapter-inner">${inner}</div>
  </section>`;
}

/* ---------- Landing ---------- */

/**
 * The hero rests on its own photograph and glimpses selected projects in
 * turn, returning to the resting image between each one. Project slides carry
 * their image in data-bg so they load after the page rather than competing
 * with the first paint.
 */
const heroWorks = images.heroWorks
  .map((id) => projects.find((p) => p.id === id))
  .filter(Boolean);

const heroSlides = [
  `<div class="slide is-active" style="background-image:url('${images.heroSlides[0]}')"></div>`,
  ...heroWorks.map((p) => `<div class="slide" data-bg="${p.image}" data-work="${p.name}" data-place="${p.location}" data-href="/projects/${p.id}"></div>`),
].join('\n      ');

const heroSection = `
  <section class="hero chapter" id="top" data-chapter="Home">
    <div class="hero-slides" id="hero-slides" aria-hidden="true" data-rest="${images.heroTiming.restMs}" data-work="${images.heroTiming.workMs}">
      ${heroSlides}
    </div>
    <div class="hero-scrim" aria-hidden="true"></div>
    <div class="hero-inner wrap">
      <div class="hero-copy">
        <span class="eyebrow hero-tag" data-reveal>Bridges &middot; Buildings &middot; Infrastructure</span>
        <h1 data-reveal>Solid from the ground up.</h1>
        <p class="hero-sub" data-reveal>Bridgestone Constructions designs and builds the bridges, buildings and infrastructure that communities rely on for generations.</p>
        <div class="hero-actions" data-reveal>
          <a href="/projects" class="btn">View projects <span class="arw">&rsaquo;</span></a>
          <a href="#contact" class="btn ghost">Start a project <span class="arw">&rsaquo;</span></a>
        </div>
      </div>
    </div>
    <a class="hero-work" id="hero-work" href="/projects" aria-hidden="true" tabindex="-1">
      <span class="hero-work-k">Our work</span>
      <span class="hero-work-name" data-work-name></span>
      <span class="hero-work-place" data-work-place></span>
      <span class="arw">&rsaquo;</span>
    </a>
    <div class="hero-readout" aria-label="Bridgestone at a glance">
      <div class="cell"><span class="k">Established</span><span class="v">2009</span></div>
      <div class="cell"><span class="k">Delivery</span><span class="v">Design &amp; build</span></div>
      <div class="cell"><span class="k">Projects delivered</span><span class="v">350+</span></div>
    </div>
  </section>`;

const capabilitiesSection = chapter({
  id: 'services',
  label: 'Capabilities',
  image: images.capabilities,
  inner: `
      <div class="section-head" data-reveal>
        <span class="eyebrow">01 / Capabilities</span>
        <h2>One team, from first sketch to handover.</h2>
        <p>Design, ground, structure and delivery sit under one roof, so the people who draw your project are the people who build it.</p>
      </div>
      <div class="services-grid" id="services-grid"></div>`,
});

const metricsSection = chapter({
  id: 'metrics',
  label: 'Track record',
  image: images.metrics,
  tone: 'is-centred',
  inner: `
      <div class="section-head centred" data-reveal>
        <span class="eyebrow">02 / Track record</span>
        <h2>Seventeen years of getting it built.</h2>
        <p>Numbers our clients can check against the projects they name.</p>
      </div>
      <div class="stats-grid" data-reveal>
        <div class="stat"><div class="num" data-count="350" data-suffix="+">0</div><div class="lbl">Projects delivered</div></div>
        <div class="stat"><div class="num" data-count="17" data-suffix="">0</div><div class="lbl">Years building</div></div>
        <div class="stat"><div class="num"><em data-count="96" data-suffix="%">0</em></div><div class="lbl">Handed over on time</div></div>
        <div class="stat"><div class="num" data-count="1200" data-suffix="+">0</div><div class="lbl">People on our sites</div></div>
      </div>`,
});

const leadershipSection = chapter({
  id: 'leadership',
  label: 'Leadership',
  // Every person in leadership.json, so adding one is a data change. The
  // section eyebrow belongs to the first block and the careers link to the
  // last, otherwise both repeat down the page.
  inner: leadership
    .map((person, i) => `
      <div class="leadership">
        <div class="leadership-media" data-reveal>
          <img src="${person.image}" alt="Portrait of ${person.name}" loading="lazy" />
          <span class="leadership-badge">${person.role}</span>
        </div>
        <div class="leadership-body" data-reveal>
          ${i === 0 ? '<span class="eyebrow">03 / Leadership</span>' : ''}
          <blockquote>&ldquo;${person.quote}&rdquo;</blockquote>
          <h3>${person.name}</h3>
          <p>${person.bio}</p>
          ${i === leadership.length - 1 ? '<a href="/careers" class="link-arrow">Join the team <span class="arw">&rsaquo;</span></a>' : ''}
        </div>
      </div>`)
    .join('\n'),
});

const workSection = chapter({
  id: 'work',
  label: 'Work',
  image: images.work,
  inner: `
      <div class="section-head with-action" data-reveal>
        <div>
          <span class="eyebrow">04 / Selected work</span>
          <h2>Recent projects.</h2>
          <p>Highlights from the last three years of work.</p>
        </div>
        <a href="/projects" class="btn ghost">All projects <span class="arw">&rsaquo;</span></a>
      </div>
      <div class="cards-grid" id="featured-projects"></div>`,
});

const contactSection = chapter({
  id: 'contact',
  label: 'Contact',
  image: images.contact,
  inner: `
      <div class="contact-grid">
        <div class="contact-info" data-reveal>
          <span class="eyebrow">05 / Start a project</span>
          <h2>Tell us what you are building.</h2>
          <p class="contact-lede">Send drawings, a site address or a few lines about the idea. A senior engineer reads every enquiry and replies within two working days.</p>
          <div class="contact-detail">
            <div class="row"><div class="k">Email</div><div class="val"><a href="mailto:${site.email}" data-site="email">${site.email}</a></div></div>
          </div>
        </div>
        ${contactForm('home-contact-form')}
      </div>`,
});

const indexContent = [
  '<nav class="chapter-rail" id="chapter-rail" aria-label="Page sections"></nav>',
  heroSection,
  capabilitiesSection,
  metricsSection,
  leadershipSection,
  workSection,
  contactSection,
].join('\n');

/* ---------- Projects listing ---------- */
const projectsContent = `
  ${pageHeader({ eyebrow: 'Selected work', title: 'Projects.', sub: 'Bridges, towers, industrial plant and transit, from first scheme to handover.', image: images.projectsHeader })}
  <section class="section-pad">
    <div class="wrap">
      <div class="proj-filters" id="proj-filters" data-reveal></div>
      <div class="cards-grid" id="projects-grid"></div>
    </div>
  </section>`;

/* ---------- Project detail (hydrated by id) ---------- */
const projectContent = `
  <article id="project-detail" class="project-detail" data-loading="true">
    <div class="wrap project-loading">Loading project&hellip;</div>
  </article>`;

/* ---------- Services listing ---------- */
const servicesContent = `
  ${pageHeader({ eyebrow: 'What we do', title: 'Services.', sub: 'Eight disciplines under one roof, from the first ground investigation to the day we hand over the keys.', image: images.capabilities })}
  <section class="section-pad">
    <div class="wrap">
      <div class="service-index" id="service-index"></div>
    </div>
  </section>`;

/* ---------- Service detail (hydrated by id) ---------- */
const serviceContent = `
  <article id="service-detail" class="service-detail" data-loading="true">
    <div class="wrap project-loading">Loading service&hellip;</div>
  </article>`;

/* ---------- Apply ---------- */
const applyContent = `
  ${pageHeader({ eyebrow: 'Careers', title: 'Apply.', sub: 'One form, read by the people you would work with. We reply to everyone.', image: images.metrics })}
  <section class="section-pad">
    <div class="wrap contact-grid">
      <div class="contact-info" data-reveal>
        <h2 id="apply-role-title">Speculative application</h2>
        <p class="contact-lede" id="apply-role-sub">Tell us what you have built and where you want to take it next.</p>
        <div class="contact-detail" id="apply-role-meta"></div>
        <div class="contact-note">
          <p>We read every application ourselves. If your experience does not line up with an open role we will say so, and say what would change that.</p>
        </div>
        <a class="link-arrow" href="/careers">All open roles <span class="arw">&rsaquo;</span></a>
      </div>

      <form id="apply-form" novalidate data-reveal>
        <div class="field two">
          <div class="field"><label for="apply-name">Name</label><input type="text" id="apply-name" name="name" autocomplete="name" required /><div class="err" data-err="name"></div></div>
          <div class="field"><label for="apply-email">Email</label><input type="email" id="apply-email" name="email" autocomplete="email" required /><div class="err" data-err="email"></div></div>
        </div>
        <div class="field two">
          <div class="field"><label for="apply-phone">Phone <span class="opt">(optional)</span></label><input type="tel" id="apply-phone" name="phone" autocomplete="tel" /><div class="err" data-err="phone"></div></div>
          <div class="field"><label for="apply-experience">Years in practice</label>
            <select id="apply-experience" name="experience">
              <option value="">Select</option>
              <option>Graduate</option>
              <option>1 to 3</option>
              <option>4 to 8</option>
              <option>9 to 15</option>
              <option>15 or more</option>
            </select><div class="err" data-err="experience"></div>
          </div>
        </div>
        <div class="field"><label for="apply-role">Role</label>
          <select id="apply-role" name="roleId"><option value="">Speculative application</option></select>
          <div class="err" data-err="roleId"></div>
        </div>
        <div class="field"><label for="apply-portfolio">Portfolio or profile <span class="opt">(optional)</span></label><input type="url" id="apply-portfolio" name="portfolio" placeholder="https://" /><div class="err" data-err="portfolio"></div></div>
        <div class="field"><label for="apply-message">What have you worked on?</label><textarea id="apply-message" name="message" placeholder="The projects you would want us to ask about, and what you did on them." required></textarea><div class="err" data-err="message"></div></div>
        <div class="honeypot" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>
        <div class="form-status" id="apply-status" role="status" aria-live="polite"></div>
        <button type="submit" class="btn" id="apply-submit">Send application <span class="arw">&rsaquo;</span></button>
      </form>
    </div>
  </section>`;

/* ---------- Careers ---------- */
const careersContent = `
  ${pageHeader({ eyebrow: 'Careers', title: 'Build what lasts.', sub: 'Our engineers and site leads stay close to the work, from the first drawing to the last inspection. If that is the career you want, we would like to hear from you.', image: images.careersHeader })}
  <section class="section-pad">
    <div class="wrap careers-intro" data-reveal>
      <div>
        <span class="eyebrow">Life at Bridgestone</span>
        <h2>Engineers who build, builders who engineer.</h2>
      </div>
      <p>At Bridgestone the design office and the site are one team. Engineers join a project at the first sketch and follow it onto site, so the person who sizes a beam sees it lifted into place. Graduates work beside directors and run their own packages early, and we invest in the tools our people ask for, from parametric modelling to digital twins.</p>
    </div>
  </section>
  <section class="section-pad alt">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">Open roles</span>
        <h2>Where we are hiring.</h2>
        <p>If your discipline is not listed, write to us anyway and say what you would want to work on.</p>
      </div>
      <div class="roles" id="roles"></div>
      <div class="roles-cta" data-reveal>
        <a href="/apply" class="btn ghost">Send a speculative application <span class="arw">&rsaquo;</span></a>
      </div>
    </div>
  </section>`;

/* ---------- Contact ---------- */
const contactContent = `
  ${pageHeader({ eyebrow: 'Start a project', title: 'Contact us.', sub: 'Send drawings, a site address or a few lines about the idea. A senior engineer replies within two working days.', image: images.contactHeader })}
  <section class="section-pad">
    <div class="wrap contact-grid">
      <div class="contact-info" data-reveal>
        <div class="contact-detail">
          <div class="row"><div class="k">Email</div><div class="val"><a href="mailto:${site.email}" data-site="email">${site.email}</a></div></div>
          <div class="row" data-site-row="phone"${site.phone ? '' : ' hidden'}><div class="k">Telephone</div><div class="val"><a href="tel:${site.phone.replace(/[^+\d]/g, '')}" data-site="phone">${site.phone}</a></div></div>
          <div class="row" data-site-row="address"${site.address ? '' : ' hidden'}><div class="k">Office</div><div class="val" data-site="address">${site.address}</div></div>
          <div class="row"><div class="k">Hours</div><div class="val" data-site="hours">${site.hours}</div></div>
        </div>
        <div class="contact-note">
          <p>Every enquiry is read by a senior engineer, not a sales team. If you would rather talk now, the live chat in the corner reaches the same people.</p>
        </div>
      </div>

      ${contactForm('contact-form')}
    </div>
  </section>`;

/* ---------- Admin dashboard (staff only, no site furniture) ---------- */
const adminContent = `
  <main class="admin" id="admin">
    <section class="admin-gate" id="admin-boot">
      <div class="admin-card"><p class="admin-note">Checking access&hellip;</p></div>
    </section>

    <section class="admin-gate" id="admin-unconfigured" hidden>
      <div class="admin-card">
        <span class="eyebrow">Bridgestone / Studio desk</span>
        <h1>Backend not connected.</h1>
        <div id="admin-missing"></div>
        <p class="admin-note">Set it in the deployment's environment variables and reload. Nothing needs rebuilding, but the change only reaches a running deployment after a redeploy.</p>
        <p class="admin-note"><a href="/api/health">/api/health</a> lists everything the server can see.</p>
        <a class="admin-back" href="/">Back to site</a>
      </div>
    </section>

    <section class="admin-gate" id="admin-login" hidden>
      <form class="admin-card" id="login-form" novalidate>
        <span class="eyebrow">Bridgestone / Studio desk</span>
        <h1>Staff sign in.</h1>
        <p class="admin-note" id="login-note">Enquiries, live chat and studio mail in one place.</p>
        <div class="field"><label for="login-email">Email</label><input type="email" id="login-email" name="email" autocomplete="username" required /></div>
        <div class="field"><label for="login-password">Password</label><input type="password" id="login-password" name="password" autocomplete="current-password" required /></div>
        <div class="err" id="login-error" role="alert"></div>
        <button type="submit" class="btn" id="login-btn">Sign in <span class="arw">&rsaquo;</span></button>
        <a class="admin-back" href="/">Back to site</a>
      </form>
    </section>

    <div class="admin-shell" id="admin-shell" hidden>
      <header class="admin-bar">
        <a class="admin-brand" href="/">
          <img src="/assets/brand/bridgestone-wordmark-dark.svg" alt="Bridgestone Constructions" width="1016" height="200" />
          <span>Studio desk</span>
        </a>
        <div class="admin-bar-end">
          <span class="admin-who" id="admin-who"></span>
          <button type="button" class="admin-signout" id="admin-signout">Sign out</button>
        </div>
      </header>

      <nav class="admin-tabs" id="admin-tabs" role="tablist" aria-label="Sections">
        <button type="button" class="admin-tab is-active" role="tab" data-tab="enquiries" aria-selected="true">Enquiries<span class="tally" data-tally="enquiries">0</span></button>
        <button type="button" class="admin-tab" role="tab" data-tab="applications" aria-selected="false">Applications<span class="tally" data-tally="applications">0</span></button>
        <button type="button" class="admin-tab" role="tab" data-tab="chat" aria-selected="false">Live chat<span class="tally" data-tally="chat">0</span></button>
        <button type="button" class="admin-tab" role="tab" data-tab="email" aria-selected="false">Email<span class="tally" data-tally="email">0</span></button>
        <button type="button" class="admin-tab" role="tab" data-tab="settings" aria-selected="false">Settings</button>
      </nav>

      <p class="admin-alert" id="admin-alert" role="alert" hidden></p>

      <div class="admin-body">
        <section class="admin-panel" data-panel="enquiries">
          <div class="admin-split">
            <ul class="admin-list" id="enquiry-list"><li class="admin-empty">Loading&hellip;</li></ul>
            <div class="admin-detail" id="enquiry-detail"><p class="admin-empty">Pick an enquiry to read it.</p></div>
          </div>
        </section>

        <section class="admin-panel" data-panel="applications" hidden>
          <div class="admin-split">
            <ul class="admin-list" id="application-list"><li class="admin-empty">Loading&hellip;</li></ul>
            <div class="admin-detail" id="application-detail"><p class="admin-empty">Pick an application to read it.</p></div>
          </div>
        </section>

        <section class="admin-panel" data-panel="chat" hidden>
          <div class="admin-split">
            <ul class="admin-list" id="chat-list"><li class="admin-empty">Loading&hellip;</li></ul>
            <div class="admin-detail" id="chat-detail"><p class="admin-empty">Pick a conversation to read and reply.</p></div>
          </div>
        </section>

        <section class="admin-panel" data-panel="email" hidden>
          <div class="admin-split">
            <ul class="admin-list" id="email-list"><li class="admin-empty">Loading&hellip;</li></ul>
            <div class="admin-detail" id="email-detail"><p class="admin-empty">Pick a thread to read it.</p></div>
          </div>
        </section>
        <section class="admin-panel" data-panel="settings" hidden>
          <div class="admin-settings" id="settings-panel"><p class="admin-empty">Loading&hellip;</p></div>
        </section>
      </div>
    </div>
  </main>`;

/* ---------- 404 ---------- */
const notFoundContent = `
  <section class="notfound">
    <div class="wrap">
      <span class="eyebrow">Error 404</span>
      <h1>This bridge is out.</h1>
      <p>The page you were looking for has moved or never existed. The links below will get you back on solid ground.</p>
      <div class="hero-actions"><a href="/" class="btn">Back to home <span class="arw">&rsaquo;</span></a><a href="/projects" class="btn ghost">View projects</a></div>
    </div>
  </section>`;

module.exports = [
  { file: 'index.html', active: '', bodyClass: 'page-home', title: 'Bridgestone Constructions', description: 'Bridgestone Constructions designs and builds bridges, buildings and infrastructure, with structural, civil, mechanical and digital engineering under one roof.', content: indexContent },
  { file: 'projects.html', active: 'projects', bodyClass: 'page-projects', title: 'Projects | Bridgestone Constructions', description: 'Selected Bridgestone Constructions projects: bridges, towers, industrial plant and transit.', content: projectsContent, extraScripts: ['/js/projects.js'] },
  { file: 'project.html', active: 'projects', bodyClass: 'page-project', title: 'Project | Bridgestone Constructions', description: 'Project detail.', content: projectContent, extraScripts: ['/js/project.js'] },
  { file: 'services.html', active: 'services', bodyClass: 'page-services', title: 'Services | Bridgestone Constructions', description: 'Structural, civil, mechanical, digital, steel, groundworks, plant construction and commissioning.', content: servicesContent, extraScripts: ['/js/services.js'] },
  { file: 'service.html', active: 'services', bodyClass: 'page-service', title: 'Service | Bridgestone Constructions', description: 'Service detail.', content: serviceContent, extraScripts: ['/js/service.js'] },
  { file: 'apply.html', active: 'careers', bodyClass: 'page-apply', title: 'Apply | Bridgestone Constructions', description: 'Apply to Bridgestone Constructions. One form, read by the people you would work with.', content: applyContent, extraScripts: ['/js/apply.js'] },
  { file: 'careers.html', active: 'careers', bodyClass: 'page-careers', title: 'Careers | Bridgestone Constructions', description: 'Open engineering roles at Bridgestone Constructions across structural, civil, mechanical and digital teams.', content: careersContent, extraScripts: ['/js/careers.js'] },
  { file: 'contact.html', active: 'contact', bodyClass: 'page-contact', title: 'Contact us | Bridgestone Constructions', description: 'Contact Bridgestone Constructions to start a project. A senior engineer replies within two working days.', content: contactContent },
  { file: 'admin.html', active: '', bodyClass: 'page-admin', bare: true, noindex: true,
    styles: ['/css/admin.css'],
    title: 'Studio desk | Bridgestone Constructions', description: 'Staff dashboard.',
    content: adminContent, extraScripts: ['/js/supabase-lite.js', '/js/admin.js'] },
  { file: '404.html', active: '', bodyClass: 'page-404', title: 'Page not found | Bridgestone Constructions', description: 'Page not found.', content: notFoundContent },
];
