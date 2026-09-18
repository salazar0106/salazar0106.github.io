# Saloni Singh — personal website

A small, free website made with plain HTML, CSS, and JavaScript. It has Home, Publications, Projects, and Hobbies pages. GitHub Pages can publish it for free.

## Start here

1. Put your photo in `assets/`, then change the photo path in `index.html` from `assets/profile-placeholder.svg` to your file, for example `assets/profile.jpg`. Change the image's `alt` text too. The current image is only a placeholder.
2. Put your CV PDF at `assets/Saloni-Singh-CV.pdf`. The CV button already points there. Until then, the button says “Add your CV PDF.”
3. Edit your introduction and contact text in `index.html`. Put your real email, Google Scholar, GitHub, and LinkedIn links at the top of `site.js`. Empty links stay hidden.
4. Change the single accent color, `--accent`, near the top of `styles.css` if you like.
5. Replace the sample project and publication TXT files with your real details. **Working titles, author lists, dates, and other bracketed text are placeholders.** The examples do not claim confirmed publication titles.
6. Edit `hobbies.html` to add your real interests and photos. No hobbies have been assumed.

## Add a project

Create a new file in `projects/content/`, such as `my-new-project.txt`. Copy this format:

```text
title: My project title
date: 2026-09-18
summary: One or two short sentences about the project.
tags: Writing, AI, Study
image: assets/my-project.jpg
url: https://example.com/project
code: https://github.com/username/repository

Optional longer description goes here. Leave one blank line before it.

A second paragraph can go here.
```

Use `YYYY-MM-DD` dates so projects sort newest first. You may use `year: 2026` instead of `date`. If the date is unknown, leave `date: YYYY-MM-DD` as a visible placeholder; it will sort below dated projects. You can leave `image`, `url`, and `code` empty. The project image placeholder will show if no image is provided. The Home page automatically shows the three newest projects.

## Add a publication

Create a new file in `publications/content/`, such as `my-paper.txt`:

```text
title: Exact publication title
authors: First Author, Saloni Singh, Last Author
year: 2026
venue: Conference or journal name
type: Journal article
status: Published
paper: https://example.com/paper
code: https://github.com/username/repository
doi: https://doi.org/10.example/123
project: https://example.com/project
```

Only `title` is required. Leave unknown fields empty, or write a clear placeholder until you have confirmed details. Search looks at title, authors, venue, and year. Year and type filters appear automatically from the TXT files.

To remove an entry, delete its TXT file. To edit an entry, change its TXT file. **You never need to change the HTML or a list of filenames.**

## Preview on your computer

From this folder, run:

```text
python scripts/build_manifests.py
python -m http.server 8000
```

Open `http://localhost:8000/`. Stop the server with Ctrl+C. Run the first command again after adding or removing TXT files. Opening an HTML file directly from your computer may prevent the browser from loading TXT files, so use the local server.

## Publish with GitHub Pages

1. Create a free GitHub account if needed. Create a **public** repository named `YOUR-USERNAME.github.io` for a root site. You can also use another repository name for a project site.
2. Upload **everything in this folder**, including the hidden `.github` folder, to the repository's `main` branch. The contents of this folder should be at the top level of the repository, with `index.html` at the root.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Open the **Actions** tab. The “Publish website” run will build and publish the site. If you enabled Pages after the first push, run it once using **Actions → Publish website → Run workflow**.
5. Visit `https://YOUR-USERNAME.github.io/` for a root site, or `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/` for a project site.

When you push a change, the included GitHub Action scans `projects/content/` and `publications/content/`, creates fresh `manifest.json` files for the published site, and deploys it. Browsers cannot list folder contents by themselves; those generated files tell the site which TXT files exist. The Action takes care of them for you. The committed manifests are only for local preview and the initial repository; they do not need manual editing. All site links use relative paths, so both root and project sites work.

If your repository uses a branch name other than `main`, change `branches: [main]` in `.github/workflows/publish-site.yml` to that branch name.

## Folder map

```text
index.html                 Home
publications.html          Searchable publications
projects.html              All projects
hobbies.html               Personal page
styles.css                 Design and accent color
site.js                    Content loading and contact links
assets/                    Photo, CV, project images
projects/content/          One TXT file per project
publications/content/      One TXT file per publication
scripts/build_manifests.py Local index generator
.github/workflows/          Automatic GitHub Pages publisher
```
