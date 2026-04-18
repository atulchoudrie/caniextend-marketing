# Deployment

## Vercel Project

**Project name:** `caniextend-marketing`
**Vercel team:** `wearezag`

## Domains

| Domain | Environment |
|--------|-------------|
| `www.caniextend.com` | Production |
| `caniextend.com` | Production (redirect → www) |
| `caniextend-marketing.vercel.app` | Auto-alias |

## How to deploy

Push to `main` — Vercel's GitHub integration triggers a production deployment automatically. No manual steps required.

```bash
git push origin main
```

## Checking deploy status

**Option 1 — Vercel Dashboard:**
1. Go to [vercel.com/wearezag/caniextend-marketing](https://vercel.com/wearezag/caniextend-marketing)
2. Click **Deployments** — the latest should show `Ready ✓`

**Option 2 — GitHub:**
- Every push shows a deployment status check on the commit in GitHub
- Green tick = deploy succeeded; red cross = failed

## Rolling back

1. Go to [vercel.com/wearezag/caniextend-marketing/deployments](https://vercel.com/wearezag/caniextend-marketing/deployments)
2. Find the last known-good deployment
3. Click the `...` menu → **Promote to Production**

A rollback takes effect in ~30 seconds.

## Deploy checklist

Before marking any PR or task done:

- [ ] Vercel deployment status is `Ready` (not `Error` / `Canceled`)
- [ ] `www.caniextend.com` loads correctly — no 500, no white screen, no broken assets
- [ ] If deploy errors → stop other work, fix the deploy first (P0), do not stack commits

## Framework

Next.js — deployed with Turbopack. Node.js 24.x runtime.
