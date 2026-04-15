# GitHub Stats

Dynamic SVG cards for showing GitHub stats in a profile README.

Live API:

```text
https://denisetiya-github-stats.vercel.app
```

## Overview

GitHub Stats generates lightweight SVG images from public GitHub profile data. The cards can be embedded directly in GitHub profile READMEs, repository READMEs, portfolio pages, or any markdown file that supports remote images.

Available cards:

- `stats`: public repositories, stars, forks, contributions, followers, and following.
- `languages`: top programming languages from public owned repositories.
- `performance`: activity score based on contributions, active repositories, and collaboration activity.

The API is hosted on Vercel, reads GitHub data server-side with `GITHUB_TOKEN`, and returns `image/svg+xml` responses that GitHub can render as normal images.

## Usage

Add these images to your GitHub profile README:

```md
![GitHub Stats](https://denisetiya-github-stats.vercel.app/api/stats?username=denisetiya&theme=github)
![Top Languages](https://denisetiya-github-stats.vercel.app/api/languages?username=denisetiya&theme=github)
![Performance](https://denisetiya-github-stats.vercel.app/api/performance?username=denisetiya&theme=github)
```

Use a different GitHub account by changing `username`:

```md
![GitHub Stats](https://denisetiya-github-stats.vercel.app/api/stats?username=octocat)
```

Example with dark theme:

```md
![GitHub Stats](https://denisetiya-github-stats.vercel.app/api/stats?username=denisetiya&theme=dark)
![Top Languages](https://denisetiya-github-stats.vercel.app/api/languages?username=denisetiya&theme=dark)
![Performance](https://denisetiya-github-stats.vercel.app/api/performance?username=denisetiya&theme=dark)
```

Example with custom title, accent color, and hidden border:

```md
![My Stats](https://denisetiya-github-stats.vercel.app/api/stats?username=denisetiya&title=My%20GitHub%20Stats&theme=tokyonight&color=7aa2f7&hide_border=true)
```

Supported query params:

- `username` is required.
- `theme`: `github`, `dark`, `light`, or `tokyonight`.
- `title`: custom card title.
- `hide_border`: `true` or `false`.
- `color`: hex accent color, for example `0969da`.

## GitHub Token Access

Use a fine-grained personal access token when possible. This app only reads public GitHub profile and repository data through the GitHub GraphQL API, so do not grant write permissions.

Recommended fine-grained token setup:

- Token type: Fine-grained personal access token.
- Resource owner: your GitHub account.
- Repository access: public repositories are enough for this v1 app. If GitHub requires a repository selection in the UI, select only the public repositories you want counted.
- Repository permissions: keep the default read-only metadata access. Do not enable `Contents`, `Issues`, `Pull requests`, `Actions`, `Secrets`, `Administration`, or any write permission for this app.
- Expiration: set an expiration date you are comfortable rotating, for example 90 days.

Classic token fallback:

- Use only the `public_repo` scope.
- Do not enable `repo`, `workflow`, `admin:*`, `delete_repo`, `write:*`, or organization admin scopes.

Set the token in Vercel as an environment variable:

```sh
GITHUB_TOKEN=github_pat_your_token_here
```

The token must stay server-side. Never put it in README URLs, query params, frontend code, or committed files.

## Development

```sh
pnpm install
pnpm run dev
```

## Checks

```sh
pnpm run typecheck
pnpm run lint
pnpm test
```
