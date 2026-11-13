# repti

## Getting Started

Use the Node.js version in `.nvmrc` and pnpm `12.3.4`. On Windows with NVM for Windows, install and activate Node, then install pnpm once:

```powershell
nvm install 24.22.2
nvm use 24.22.2
npm install --global --allow-scripts=pnpm pnpm@12.3.4
```

Install project dependencies and start the Vite development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

Create a production build with:

```bash
pnpm build
```

The build fetches published content from Sanity and renders each Polish guide
into its HTML file, including its text, images and links. The browser starts
with that snapshot and fetches the latest guide from Sanity; if the request
fails, it keeps the snapshot and displays a warning. A build fails if Sanity
cannot be reached, rather than deploying an incomplete sitemap and guide set.

Publishing changes in the CMS does not rebuild the site automatically. Run
the GitHub Pages deployment workflow after publishing guides to update their
HTML snapshots, metadata and sitemap. The prerendered content is not a
guarantee of indexing or ranking; use Google Search Console's URL inspection
to check how Google sees the deployed page.

Run the guide rendering tests with:

```bash
node --test scripts/guide-render.test.mjs
```

## CMS Studio

The Studio source and schemas are in `studio/`. The hosted Studio uses project `t5to691s` and dataset `production`.

```bash
pnpm cms:dev
pnpm cms:build
pnpm cms:deploy
```

The CMS is available at [o-ty-gadzie-cms-v2.sanity.studio](https://o-ty-gadzie-cms-v2.sanity.studio/).
