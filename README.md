# GitHub Stats Cards

Dynamic SVG cards for displaying GitHub profile stats directly in a README.

Live API:

```text
https://denisetiya-github-stats.vercel.app
```

The fastest way to use this project is the public all-in-one card. It works from the hosted API, does not require your own Vercel deployment, and does not require a GitHub personal access token.

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

## Customization

Supported query params:

| Param | Required | Description | Example |
| --- | --- | --- | --- |
| `username` | Yes | GitHub username to display. | `username=denisetiya` |
| `source` | No | Use `public` for no-token public mode, or `auto` for server token mode when self-hosted. | `source=public` |
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

If you self-host this project and set `GITHUB_TOKEN`, `source=auto` can use authenticated GitHub GraphQL data. This gives higher rate limits and contribution details where available.

```md
![GitHub Overview](https://your-app.vercel.app/api/all?username=YOUR_USERNAME&source=auto)
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

Recommended fine-grained token setup:

- Token type: Fine-grained personal access token.
- Resource owner: your GitHub account.
- Repository access: public repositories are enough for this app.
- Repository permissions: keep the default read-only metadata access.
- Do not enable `Contents`, `Issues`, `Pull requests`, `Actions`, `Secrets`, `Administration`, or any write permission.
- Expiration: set an expiration date you are comfortable rotating, for example 90 days.

Classic token fallback:

- Use only the `public_repo` scope.
- Do not enable `repo`, `workflow`, `admin:*`, `delete_repo`, `write:*`, or organization admin scopes.

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

## Notes

- Public mode is the recommended flow for most users.
- Visitor counter is not included because it requires persistent storage.
- GitHub data is cached by HTTP headers for better performance on Vercel.
- If GitHub data cannot be loaded, the API returns an SVG error card instead of exposing internal server details.
