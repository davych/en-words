# English Notes

A simple, continuous English notebook for reading and speaking practice. It has no search, filters, accounts, or progress tracking.

- `site/content/notes.json`: English definitions and examples. Each term from the supplied notes has an additional example; new everyday and work sentences follow the original material.
- `site/content/resources.json`: links to external listening and speaking material.
- `source/original-notes.txt`: an unchanged backup of the supplied source material. It is not included in the published site.

To preview locally:

```sh
python3 -m http.server 8000 --directory site
```

Open `http://localhost:8000/`. The site is static and has no build step.

The workflow in `.github/workflows/pages.yml` deploys `site/` from `main` using GitHub Actions. GitHub Pages must be enabled with **GitHub Actions** as the publishing source in the repository's Pages settings.
