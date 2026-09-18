/* Edit these contact links. Leave a URL empty to hide that link. */
const CONTACT = {
  email: "", // Example: "mailto:saloni@example.com"
  googleScholar: "", // Paste your profile URL
  github: "", // Paste your profile URL
  linkedin: "" // Paste your profile URL
};

const $ = (selector) => document.querySelector(selector);
const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const safeURL = (value) => {
  if (!value) return null;
  try {
    const url = new URL(value, document.baseURI);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
};
const addLink = (parent, label, url) => {
  const href = safeURL(url);
  if (!href) return;
  const link = make("a", "", label);
  link.href = href;
  if (href.startsWith("http")) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
  parent.append(link);
};
const dateValue = (record) => {
  const value = record.date || record.year || "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))) return Date.parse(value);
  if (/^\d{4}$/.test(value)) return Date.UTC(Number(value), 0, 1);
  return -Infinity;
};
const sortNewest = (a, b) => dateValue(b) - dateValue(a) || (a.title || "").localeCompare(b.title || "");

/* Metadata is key: value lines, followed by one blank line and optional longer text. */
function parseContent(text) {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const divider = normalized.search(/\n\s*\n/);
  const header = divider < 0 ? normalized : normalized.slice(0, divider);
  const body = divider < 0 ? "" : normalized.slice(divider).trim();
  const record = {};
  for (const line of header.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const match = line.match(/^([a-zA-Z][\w-]*):\s*(.*)$/);
    if (match) record[match[1].toLowerCase()] = match[2].trim();
  }
  record.body = body;
  return record;
}

async function loadFolder(folder) {
  const response = await fetch(`${folder}/manifest.json`);
  if (!response.ok) throw new Error(`Could not load ${folder}/manifest.json`);
  const filenames = await response.json();
  if (!Array.isArray(filenames)) throw new Error(`Invalid manifest in ${folder}`);
  const records = await Promise.all(filenames.filter(name => typeof name === "string" && /^[^/\\]+\.txt$/i.test(name)).map(async (name) => {
    const file = await fetch(`${folder}/content/${encodeURIComponent(name)}`);
    if (!file.ok) throw new Error(`Could not load ${name}`);
    return parseContent(await file.text());
  }));
  return records.filter(record => record.title).sort(sortNewest);
}

function projectCard(record) {
  const article = make("article", "project-card");
  const image = make("img", "project-image");
  image.src = safeURL(record.image) || "assets/project-placeholder.svg";
  image.alt = record.image && safeURL(record.image) ? `Image for ${record.title}` : "Project image placeholder";
  image.loading = "lazy";
  image.onerror = () => { image.onerror = null; image.src = "assets/project-placeholder.svg"; };
  article.append(image);
  const body = make("div", "card-body");
  body.append(make("p", "card-meta", record.date || record.year || "Date to add"));
  body.append(make("h2", "", record.title));
  if (record.summary) body.append(make("p", "", record.summary));
  if (record.tags) {
    const tags = make("div", "tags");
    record.tags.split(",").map(tag => tag.trim()).filter(Boolean).forEach(tag => tags.append(make("span", "tag", tag)));
    body.append(tags);
  }
  const links = make("div", "card-links");
  addLink(links, "View project ↗", record.url);
  addLink(links, "Code ↗", record.code);
  if (links.childNodes.length) body.append(links);
  if (record.body) {
    const details = make("details", "project-details");
    details.append(make("summary", "", "Read more"));
    record.body.split(/\n\s*\n/).forEach(paragraph => details.append(make("p", "", paragraph.replace(/\n/g, " "))));
    body.append(details);
  }
  article.append(body);
  return article;
}

function publicationCard(record) {
  const article = make("article", "publication-card");
  article.append(make("p", "card-meta", [record.year || "Year to add", record.type || "Type to add", record.status].filter(Boolean).join(" · ")));
  article.append(make("h2", "", record.title));
  if (record.authors) article.append(make("p", "", record.authors));
  if (record.venue) article.append(make("p", "", record.venue));
  const links = make("div", "card-links");
  addLink(links, "Paper ↗", record.paper);
  addLink(links, "Code ↗", record.code);
  addLink(links, "DOI ↗", record.doi);
  addLink(links, "Project ↗", record.project);
  if (links.childNodes.length) article.append(links);
  return article;
}

function setMessage(node, message) { node.replaceChildren(make("p", "muted", message)); }
function renderContact() {
  const destinations = [["Email", CONTACT.email], ["Google Scholar", CONTACT.googleScholar], ["GitHub", CONTACT.github], ["LinkedIn", CONTACT.linkedin]];
  for (const id of ["hero-links", "contact-links"]) {
    const node = document.getElementById(id);
    if (!node) continue;
    destinations.forEach(([label, url]) => addLink(node, label, url));
    if (!node.childNodes.length && id === "contact-links") node.append(make("span", "muted", "Add your email and profile links in site.js."));
  }
  const cv = document.querySelector('[data-placeholder-link="cv"]');
  if (cv) fetch(cv.href, { method: "HEAD" }).then(response => { if (!response.ok) cv.textContent = "Add your CV PDF"; }).catch(() => { cv.textContent = "Add your CV PDF"; });
}

async function initProjects() {
  const recent = $("#recent-projects");
  const all = $("#all-projects");
  if (!recent && !all) return;
  try {
    const records = await loadFolder("projects");
    if (recent) records.slice(0, 3).forEach(record => recent.append(projectCard(record)));
    if (all) records.forEach(record => all.append(projectCard(record)));
    if (recent) { recent.querySelector(".muted")?.remove(); if (!records.length) setMessage(recent, "No projects yet. Add a TXT file to projects/content/."); }
    if (all) { all.querySelector(".muted")?.remove(); if (!records.length) setMessage(all, "No projects yet. Add a TXT file to projects/content/."); }
  } catch (error) {
    console.error(error);
    if (recent) setMessage(recent, "Projects could not load. Preview with a local server and check the manifest.");
    if (all) setMessage(all, "Projects could not load. Preview with a local server and check the manifest.");
  }
}

async function initPublications() {
  const list = $("#publication-list");
  if (!list) return;
  try {
    const records = await loadFolder("publications");
    const search = $("#publication-search");
    const year = $("#year-filter");
    const type = $("#type-filter");
    [...new Set(records.map(item => item.year).filter(Boolean))].sort((a,b) => b.localeCompare(a)).forEach(value => { const option = make("option", "", value); option.value = value; year.append(option); });
    [...new Set(records.map(item => item.type).filter(Boolean))].sort().forEach(value => { const option = make("option", "", value); option.value = value; type.append(option); });
    const render = () => {
      const query = search.value.trim().toLocaleLowerCase();
      const filtered = records.filter(item => (!query || [item.title,item.authors,item.venue,item.year].join(" ").toLocaleLowerCase().includes(query)) && (!year.value || item.year === year.value) && (!type.value || item.type === type.value));
      list.replaceChildren(...filtered.map(publicationCard));
      if (!filtered.length) setMessage(list, records.length ? "No matching publications." : "No publications yet. Add a TXT file to publications/content/.");
      $("#publication-count").textContent = `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`;
    };
    [search, year, type].forEach(input => input.addEventListener("input", render));
    render();
  } catch (error) {
    console.error(error);
    setMessage(list, "Publications could not load. Preview with a local server and check the manifest.");
  }
}

document.querySelectorAll(".current-year").forEach(node => { node.textContent = new Date().getFullYear(); });
renderContact();
initProjects();
initPublications();
