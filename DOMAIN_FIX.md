# Fix GitHub Pages Domain Verification Error

## Current Situation
- You previously had a CNAME record working
- After removing/re-adding the custom domain in GitHub Pages, verification is failing
- Current DNS shows A records instead of CNAME

## Root Cause
When you remove and re-add a custom domain in GitHub Pages, GitHub needs to **re-verify** the domain. This process can be finicky and may fail if:
1. DNS records changed during the process
2. GitHub's verification happens before DNS fully propagates
3. There are conflicting DNS records

## Solution: Restore CNAME and Wait

### Step 1: Verify Current Cloudflare DNS Setup

1. **Log in to Cloudflare Dashboard**
2. Go to **DNS** → **Records**
3. **Check what records exist for `@` (apex domain):**
   - Do you see A records? (4 records with GitHub IPs)
   - Do you see a CNAME record? (pointing to `maxhum-sudo.github.io`)
   - **Note:** You can't have both - if both exist, that's the problem!

### Step 2: Restore CNAME Record (If Missing)

**If you only see A records:**

1. **Delete all 4 A records** for `@` (apex domain)
2. **Create a CNAME record:**
   - **Type:** CNAME
   - **Name:** `@`
   - **Target:** `maxhum-sudo.github.io`
   - **Proxy status:** **Gray cloud** (DNS only) - **CRITICAL**
   - **TTL:** Auto
   - Click **Save**

**If you see a CNAME record:**

1. **Verify it's configured correctly:**
   - **Target:** Should be `maxhum-sudo.github.io` (not `maxhum-sudo.github.io/maximillianhum-website`)
   - **Proxy:** Should be **gray cloud** (DNS only), NOT orange cloud
2. **If proxy is orange (ON), turn it OFF:**
   - Click **Edit** on the CNAME record
   - Click the orange cloud to turn it gray
   - Click **Save**

**If you see BOTH A records AND CNAME:**

1. **Delete all A records** (keep only CNAME)
2. Verify CNAME has proxy OFF (gray cloud)

### Step 3: Verify DNS is Correct

Wait 5 minutes, then check:

```bash
dig maximillianhum.com CNAME +short
```

Should show: `maxhum-sudo.github.io`

```bash
dig maximillianhum.com +short
```

Should show GitHub's IPs (resolved via CNAME)

### Step 4: GitHub Pages Verification

**The key issue:** After removing/re-adding a domain, GitHub needs time to re-verify.

1. **Go to GitHub repository** → **Settings** → **Pages**
2. **Verify custom domain shows:** `maximillianhum.com`
3. **If you see the error, try this sequence:**

   **Option A: Wait it out (Recommended)**
   - Wait **15-30 minutes** after DNS is correct
   - GitHub's verification can be slow
   - Refresh the Pages settings page periodically
   - The error should clear automatically

   **Option B: Force re-verification**
   - Remove the custom domain again
   - Wait 5 minutes
   - Re-add `maximillianhum.com`
   - Wait 15-30 minutes for verification

### Step 5: Verify CNAME File in Repository

Make sure `public/CNAME` exists and contains:
```
maximillianhum.com
```

If it doesn't exist or is wrong, GitHub Pages won't recognize the domain.

## Common Issues After Domain Re-configuration

### Issue 1: DNS Changed During Process
- **Symptom:** CNAME was replaced with A records
- **Fix:** Restore CNAME, delete A records

### Issue 2: Proxy Enabled
- **Symptom:** CNAME exists but has orange cloud (proxy ON)
- **Fix:** Turn proxy OFF (gray cloud)

### Issue 3: GitHub Verification Delay
- **Symptom:** DNS is correct but GitHub still shows error
- **Fix:** Wait 15-30 minutes, GitHub's verification is slow

### Issue 4: CNAME File Missing
- **Symptom:** Domain not recognized by GitHub
- **Fix:** Ensure `public/CNAME` exists with domain name

## Verification Checklist

- [ ] CNAME record exists in Cloudflare: `@` → `maxhum-sudo.github.io`
- [ ] Proxy is OFF (gray cloud) on CNAME record
- [ ] No conflicting A records for `@`
- [ ] `public/CNAME` file exists with `maximillianhum.com`
- [ ] DNS propagates correctly (check with `dig`)
- [ ] Custom domain entered in GitHub Pages settings
- [ ] Waited 15-30 minutes for GitHub verification

## Expected Timeline

- **DNS propagation:** 5-10 minutes
- **GitHub re-verification:** 15-30 minutes (can be longer after domain re-configuration)
- **SSL certificate:** Up to 24 hours

## Why This Happens

When you remove a custom domain from GitHub Pages:
- GitHub removes the domain from its system
- DNS records might get changed (intentionally or accidentally)
- When you re-add it, GitHub starts fresh verification
- This verification is stricter and slower than initial setup

The solution is to ensure DNS is correct (CNAME with proxy OFF) and be patient with GitHub's verification process.
