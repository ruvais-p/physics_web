# Security deployment notes

## Required secrets

Production authentication fails closed unless both of these independent secrets are configured with at least 32 random characters:

- `JWT_SECRET`
- `SETTINGS_ENCRYPTION_KEY`

Generate each value independently with a cryptographically secure secret generator. Do not reuse the database password, mail app password, or either secret for another service. After adding `SETTINGS_ENCRYPTION_KEY`, save the department mail app password again in **Dashboard > General Settings** so it is encrypted with the dedicated key.

## Credential rotation required

Older repository history contains predictable development passwords. Repository history should be treated as public even if the current source no longer contains those values.

- Rotate the password of any admin or faculty account created from an older seed.
- Invalidate old sessions by changing those passwords; session tokens are now tied to the current password hash.
- If the repository has ever been shared outside the trusted team, use your hosting provider's secret scanner and rotate every historical secret it identifies.

The safe reset script requires `RESET_FACULTY_EMAIL` and `RESET_FACULTY_PASSWORD`; it no longer embeds or prints a password.

## Perimeter configuration

- Terminate TLS before the application and redirect HTTP to HTTPS.
- Configure the reverse proxy to overwrite, rather than append untrusted client values to, `X-Real-IP` and `X-Forwarded-For`.
- The built-in login and inquiry throttles protect a single application process. For multi-instance/serverless deployment, enforce an additional shared rate limit at the load balancer, WAF, or a Redis-backed limiter.
- Keep database access private and grant the application database user only the permissions required by the application and migrations.
- Store runtime uploads on access-controlled persistent/object storage in multi-instance deployments. `public/uploads` is ignored so CVs and other personal uploads are not accidentally added to Git.

## Verification

Run these checks before deployment:

```bash
npm audit
npx tsc --noEmit
npx prisma validate
npx next build --webpack
```
