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

## CMS Studio

The Studio source and schemas are in `studio/`. The hosted Studio uses project `t5to691s` and dataset `production`.

```bash
pnpm cms:dev
pnpm cms:build
pnpm cms:deploy
```

The CMS is available at [o-ty-gadzie-cms-v2.sanity.studio](https://o-ty-gadzie-cms-v2.sanity.studio/).
