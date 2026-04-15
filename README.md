# GitHub Stats

Dynamic GitHub stats cards for profile READMEs, deployable on Vercel.

## Usage

Deploy the app to Vercel, set `GITHUB_TOKEN`, then add these images to a GitHub profile README:

```md
![GitHub Stats](https://your-app.vercel.app/api/stats?username=octocat&theme=github)
![Top Languages](https://your-app.vercel.app/api/languages?username=octocat&theme=github)
![Performance](https://your-app.vercel.app/api/performance?username=octocat&theme=github)
```

Supported query params:

- `username` is required.
- `theme`: `github`, `dark`, `light`, or `tokyonight`.
- `title`: custom card title.
- `hide_border`: `true` or `false`.
- `color`: hex accent color, for example `0969da`.

## Development

```sh
npm install
npm run dev
```

## Checks

```sh
npm run typecheck
npm run lint
npm test
```
