## Setup

Install dependencies:

```
$ yarn install
```

This project uses **Yarn 4** managed by **Corepack** and declares:

```json
"packageManager": "yarn@4.12.0"
```

### If you have Yarn 1 globally and see a packageManager error

If running `yarn` shows an error like:

> This project's package.json defines "packageManager": "yarn@4.12.0". However the current global version of Yarn is 1.22.x.

do the following once on your machine:

```bash
# 1) Remove global Yarn (optional but recommended)
npm uninstall -g yarn

# 2) Enable Corepack (shipped with Node 16.9+ / 14.19+)
corepack enable

# 3) Set Yarn 1.x as the default for projects WITHOUT packageManager
corepack prepare yarn@1.22.22 --activate
```

Then, in this project (normal case, once Corepack is enabled):

```bash
nvm use # use the version from .nvmrc
yarn install
```

If for some reason `yarn --version` still shows `1.x` inside this repo (for example due to old Corepack state), you can force Yarn 4 explicitly:

```bash
corepack use yarn@4.12.0
yarn --version # should now print 4.12.0
yarn install
```

After this:

- This repo will use **Yarn 4.12.0**.
- Other repos without `packageManager` will keep using **Yarn 1.22.22** (or whatever you activated with `corepack prepare`).

## Development

Start development server:

```
$ VITE_PORT=8081 VITE_DHIS2_BASE_URL="http://localhost:8080" yarn start
```

Linting:

```
$ yarn lint
```

## Tests

Run unit tests:

```
$ yarn test
```

## Build app ZIP

```
$ yarn build-webapp
```

## Some development tips

### Structure

-   `i18n/`: Contains literal translations (gettext format)
-   `public/`: Main app folder with a `index.html`, exposes the APP, contains the feedback-tool.
-   `src/pages`: Main React components.
-   `src/domain`: Domain layer of the app (clean architecture)
-   `src/data`: Data of the app (clean architecture)
-   `src/components`: Reusable React components.
-   `src/types`: `.d.ts` file types for modules without TS definitions.
-   `src/utils`: Misc utilities.
-   `src/locales`: Auto-generated, do not update or add to the version control.

### i18n

```
$ yarn update-po
# ... add/edit translations in i18n/*.po files ...
$ yarn localize
```

### App context

The file `src/contexts/app-context.ts` holds some general context so typical infrastructure objects (`api`, `d2`, ...) are readily available. Add your own global objects if necessary.

### Scripts

Check the example script, entry `"script-example"`in `package.json`->scripts and `src/scripts/example.ts`.
