# Scripts

## dev/
Active developer tools. Run manually to set up local environment.
- seed.ts — full DB seed (latest)
- seed_cloudinary.ts — sync Cloudinary URLs to DB
- make_admin.js — promote user to admin role
- upload_handmade.js / upload-images.ts — bulk Cloudinary upload
- clear_redis.js — flush local Redis cache
- generate_seed3.js — generate seed SQL from frontend data
- processListings.ts — clean scraped data into DB-ready format

## build/
Scripts that generate or validate source assets.
- consistencyPass.ts — frontend type consistency check
- update-data.js — update static mock data arrays

## maintenance/
Read-only or rarely-run monitoring tools. Safe to run anytime.
- audit_schema.js — print current DB schema
- audit_users.js — check user table integrity
- check_dups.js — find duplicate slugs
- check_collections.js — validate category arrays
- verify.js — schema column mismatch checker
- scan.js — codebase string/TODO scanner
- parse_fails.js — parse Jest failure logs
- testWebhook.js — fire mock webhook for testing
- run-audit.js — run automated audit checks

## archive/
One-time scripts, AI iteration artifacts, destructive patches.
DO NOT re-run these. Kept for historical reference only.
All update-*.js files here used writeFileSync to patch source
code and would overwrite your current working code if run again.
