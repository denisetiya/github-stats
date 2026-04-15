# GitHub Stats Cards

Dynamic SVG cards for displaying GitHub profile stats directly in a README.

Live API:

```text
https://denisetiya-github-stats.vercel.app
```

The fastest way to use this project is the public all-in-one card. It works from the hosted API, does not require your own Vercel deployment, and does not require a GitHub personal access token.

The all-in-one card is designed as a wide responsive SVG. It fills the available README width on desktop and scales down cleanly on smaller screens.

For private repository stats, self-host the project on Vercel, configure `GITHUB_TOKEN`, and use `source=private`.

## Quick Start

Add this to your GitHub profile `README.md` and replace `YOUR_USERNAME` with your GitHub username:

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=YOUR_USERNAME&source=public&theme=github)
```

Example for `denisetiya`:

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=denisetiya&source=public&theme=github)
```

## What It Shows

The all-in-one card combines multiple public GitHub signals in one SVG:

- Public repositories
- Total stars
- Total forks
- Followers
- Top languages
- Public activity score
- Active repository signal
- Wide responsive dashboard layout

Public mode uses the GitHub public REST API. It cannot show private repositories or authenticated contribution details, but it is the easiest option for public README usage.

## Available Cards

### All-in-One Overview

Recommended for most README profiles.

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=YOUR_USERNAME&source=public)
```

### Stats Only

```md
![GitHub Stats](https://denisetiya-github-stats.vercel.app/api/stats?username=YOUR_USERNAME&source=public)
```

### Top Languages Only

```md
![Top Languages](https://denisetiya-github-stats.vercel.app/api/languages?username=YOUR_USERNAME&source=public)
```

### Performance Only

```md
![Performance](https://denisetiya-github-stats.vercel.app/api/performance?username=YOUR_USERNAME&source=public)
```

## Tutorial: Use It in Your GitHub Profile README

### 1. Create Your Profile Repository

Your profile README lives in a repository with the same name as your GitHub username.

Example:

```text
github.com/YOUR_USERNAME/YOUR_USERNAME
```

If your username is `octocat`, create or open:

```text
github.com/octocat/octocat
```

### 2. Add the All-in-One Card

Copy this markdown into `README.md`:

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=YOUR_USERNAME&source=public&theme=github)
```

Then replace `YOUR_USERNAME`.

Example:

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=octocat&source=public&theme=github)
```

### 3. Commit and Push

Commit the README change and push it to GitHub. GitHub will render the SVG as a normal image on your profile.

## Public Mode

Use `source=public` when you want anyone to use the hosted API without setup.

You do not need:

- Your own Vercel deployment
- A GitHub personal access token
- A backend server
- Environment variables

Example:

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=YOUR_USERNAME&source=public)
```

## Private Mode

Use `source=private` only on your own self-hosted deployment with `GITHUB_TOKEN` configured. Do not use private mode on a shared public deployment.

Private mode can include private repositories visible to the configured token. The token owner must have access to the private repositories you want counted.

Example for your own Vercel deployment:

```md
![GitHub Overview](https://your-app.vercel.app/api/all?username=YOUR_USERNAME&source=private&theme=dark)
```

For `denisetiya` on the hosted deployment, the URL format is:

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=denisetiya&source=private&theme=dark)
```

Private mode requires a token with access to the target account's private repositories. If the token is missing or does not have access, the image will render an error card.

## Markdown Usage Rules

Use image markdown, not link markdown:

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=denisetiya&source=public&theme=dark)
```

Do not add spaces inside the URL:

```md
<!-- Wrong -->
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=denisetiya  &theme=dark)

<!-- Correct -->
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=denisetiya&theme=dark)
```

If you test the URL in a terminal, wrap it in quotes because `&` has a special meaning in shells:

```sh
curl 'https://denisetiya-github-stats.vercel.app/api/all?username=denisetiya&source=public&theme=dark'
```

## Customization

Supported query params:

| Param | Required | Description | Example |
| --- | --- | --- | --- |
| `username` | Yes | GitHub username to display. | `username=denisetiya` |
| `source` | No | Use `public` for no-token public mode, `auto` for token mode with public fallback, or `private` for token-only private repository stats. | `source=public` |
| `theme` | No | Card theme: `github`, `dark`, `light`, or `tokyonight`. | `theme=dark` |
| `title` | No | Custom card title. Use URL encoding for spaces. | `title=My%20GitHub%20Overview` |
| `hide_border` | No | Hide the SVG border. | `hide_border=true` |
| `color` | No | Custom accent color in hex format. | `color=0969da` |

### Dark Theme

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=YOUR_USERNAME&source=public&theme=dark)
```

### Tokyo Night Theme

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=YOUR_USERNAME&source=public&theme=tokyonight)
```

### Custom Title and Accent Color

```md
![GitHub Overview](https://denisetiya-github-stats.vercel.app/api/all?username=YOUR_USERNAME&source=public&theme=tokyonight&title=My%20GitHub%20Overview&color=7aa2f7&hide_border=true)
```

## API Reference

Base URL:

```text
https://denisetiya-github-stats.vercel.app
```

Endpoints:

| Endpoint | Description |
| --- | --- |
| `/api/all` | All-in-one overview card with stats, languages, and performance. |
| `/api/stats` | GitHub profile statistics card. |
| `/api/languages` | Top programming languages card. |
| `/api/performance` | GitHub activity performance card. |

All endpoints return:

```text
Content-Type: image/svg+xml
```

## Authenticated Mode

If you self-host this project and set `GITHUB_TOKEN`, `source=auto` can use authenticated GitHub GraphQL data. This gives higher rate limits and contribution details where available. If the token fails, `source=auto` falls back to public mode.

```md
![GitHub Overview](https://your-app.vercel.app/api/all?username=YOUR_USERNAME&source=auto)
```

Use `source=private` when you explicitly want token-only private repository stats and do not want public fallback:

```md
![GitHub Overview](https://your-app.vercel.app/api/all?username=YOUR_USERNAME&source=private&theme=dark)
```

## Self-Hosting on Vercel

### 1. Clone and Install

```sh
git clone <your-fork-url>
cd github-stats
pnpm install
```

### 2. Create a GitHub Token

Use a fine-grained personal access token when possible. This app only reads GitHub profile and repository data through the GitHub API, so do not grant write permissions.

Recommended fine-grained token setup for public/authenticated mode:

- Token type: Fine-grained personal access token.
- Resource owner: your GitHub account.
- Repository access: public repositories are enough for this app.
- Repository permissions: keep the default read-only metadata access.
- Do not enable `Contents`, `Issues`, `Pull requests`, `Actions`, `Secrets`, `Administration`, or any write permission.
- Expiration: set an expiration date you are comfortable rotating, for example 90 days.

Classic token fallback:

- Use only the `public_repo` scope.
- Do not enable `repo`, `workflow`, `admin:*`, `delete_repo`, `write:*`, or organization admin scopes.

For private repository stats:

- Fine-grained token: select the private repositories you want counted and keep repository permissions read-only.
- Classic token: use `repo` only if you need private repository access. This is broader than `public_repo`, so prefer fine-grained tokens when possible.
- Do not grant write or admin permissions.

### 3. Set Environment Variable

Create `.env.local` for local development:

```sh
GITHUB_TOKEN=github_pat_your_token_here
```

Set the same variable in Vercel:

```text
Project Settings -> Environment Variables -> GITHUB_TOKEN
```

Never put the token in README URLs, query params, frontend code, or committed files.

### 4. Run Locally

```sh
pnpm run dev
```

Open:

```text
http://localhost:3000/api/all?username=YOUR_USERNAME&source=public
```

### 5. Deploy

Push the project to GitHub and import it from Vercel. After deployment, replace the base URL in your README examples with your own Vercel URL.

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
pnpm run build
```
