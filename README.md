# North Carolina Soccer Hall of Fame

A static website for the North Carolina Soccer Hall of Fame, rebuilt as clean,
version-controlled code (originally a Wix site).

## Structure

```
index.html            Home page (video hero + Class of 2025 announcement + gallery)
pages/
  inductees.html      Inductees by class
  champions.html      National Champions Hall of Honor
  about.html          Mission, history, board, contact
  pictures.html       Photo gallery
  submit.html         Candidate nomination form
css/styles.css        All shared styles
js/site.js            Injects the shared header + footer, handles the mobile menu
assets/               Images / logos (add your own here)
```

The shared header and footer live in `js/site.js` so they only need to be
edited in one place. Each page declares its identity with
`<body data-page="..." data-root="...">`.

## Run locally

No build step. Either open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (free options)

- **GitHub Pages:** push to GitHub, then Settings → Pages → deploy from the
  branch root.
- **Netlify / Vercel:** drag-and-drop the folder or connect the repo. No build
  command needed; publish directory is the project root.

## Still to do (needs content from you)

- Full inductee roster for every class (currently a partial starting list).
- Real event photos in `assets/` and the galleries.
- Partner/sponsor logos in the footer.
- Board roster, history text, and contact details on the About page.
- Connect the **Submit a Candidate** form to a service (e.g. Formspree) so it
  can actually deliver nominations.

## Note on the hero video

The hero currently streams from the original Wix CDN URL. For a fully
self-contained site, download the video into `assets/` and update the
`<source>` in `index.html`.
