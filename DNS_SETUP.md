# DNS Configuration Guide for maximillianhum.com

This guide will help you configure your domain (maximillianhum.com) to work with GitHub Pages through Cloudflare.

## Current Status
- ✅ CNAME file created in `public/CNAME` (contains: `maximillianhum.com`)
- ⚠️ DNS configuration needs to be verified/updated in Cloudflare

## Step-by-Step DNS Configuration

### Step 1: Your GitHub Pages Domain

**Your GitHub Pages domain is:** `maxhum-sudo.github.io`

Your site is currently accessible at:
- `https://maxhum-sudo.github.io/maximillianhum-website`

**For the CNAME record, use:** `maxhum-sudo.github.io` (without the repository path)

**Note:** When configuring a custom domain, the CNAME should point to `username.github.io` (not the full path with repository name). GitHub Pages will automatically route your custom domain to the correct repository.

### Step 2: Clean Up Old DNS Records (CRITICAL)

**⚠️ IMPORTANT:** Your domain currently has A records pointing to Cloudflare proxy IPs (`104.21.44.86`, `172.67.198.54`). These MUST be deleted before GitHub Pages will work.

**Steps to clean up:**

1. Log in to Cloudflare Dashboard
2. Select your domain (`maximillianhum.com`)
3. Go to **DNS** → **Records**
4. **Delete ALL existing records for the apex domain (`@` or `maximillianhum.com`):**
   - Look for any A records with Name `@` or `maximillianhum.com`
   - Look for any CNAME records with Name `@` or `maximillianhum.com`
   - Look for any AAAA records (IPv6) with Name `@` or `maximillianhum.com`
   - **Delete all of them** - even if they look correct, old records can conflict

5. **Keep only these records:**
   - NS records (nameservers) - don't touch these
   - **CAA records** - **KEEP THESE** (they're needed for SSL certificates)
     - Your CAA records already include `letsencrypt.org`, which GitHub Pages uses, so they're fine
     - Only delete CAA records if they explicitly block Let's Encrypt (unlikely)
   - Any subdomain records (www, mail, etc.) - only if you need them
   - MX records (for email) - only if you use email on this domain
   - TXT records (for verification, SPF, etc.) - keep if needed

6. **After deleting old records, proceed to Step 3 below**

### Step 3: Configure DNS in Cloudflare

**IMPORTANT:** For GitHub Pages to work properly with Cloudflare, you have two options:

#### Option A: Use CNAME with Proxy OFF (Recommended)

1. Log in to Cloudflare Dashboard
2. Select your domain (`maximillianhum.com`)
3. Go to **DNS** → **Records**
4. Look for existing records for `maximillianhum.com` (apex domain)

5. **If a CNAME record exists:**
   - Click **Edit** on the CNAME record
   - **Name:** `@` or `maximillianhum.com`
   - **Target:** `maxhum-sudo.github.io` (your GitHub username + `.github.io`)
   - **Proxy status:** Click the **gray cloud** (DNS only) - **NOT the orange cloud**
   - **TTL:** Auto
   - Click **Save**

6. **If no CNAME exists, create one:**
   - Click **Add record**
   - **Type:** CNAME
   - **Name:** `@` (or `maximillianhum.com`)
   - **Target:** Your GitHub Pages domain
   - **Proxy status:** Gray cloud (DNS only)
   - **TTL:** Auto
   - Click **Save**

**⚠️ CRITICAL:** The proxy must be **OFF** (gray cloud). GitHub Pages doesn't work well with Cloudflare's proxy (orange cloud) enabled.

#### Option B: Use A Records (Alternative)

If CNAME doesn't work, use A records pointing to GitHub's IP addresses:

1. Delete any existing CNAME records for `@` or `maximillianhum.com`
2. Create **4 A records** with these values:

   | Type | Name | IPv4 address | Proxy status | TTL |
   |------|------|--------------|--------------|-----|
   | A | @ | 185.199.108.153 | Gray cloud | Auto |
   | A | @ | 185.199.109.153 | Gray cloud | Auto |
   | A | @ | 185.199.110.153 | Gray cloud | Auto |
   | A | @ | 185.199.111.153 | Gray cloud | Auto |

3. Make sure all have **gray cloud** (proxy OFF)

### Step 4: Verify HostPapa Nameservers

1. Log in to HostPapa
2. Go to your domain settings
3. Verify that the nameservers are set to Cloudflare's nameservers:
   - `dante.ns.cloudflare.com`
   - `[another].ns.cloudflare.com`
   
   (Cloudflare provides these in your Cloudflare dashboard under **DNS** → **Overview**)

### Step 5: Configure GitHub Pages Custom Domain

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Custom domain**, enter: `maximillianhum.com`
4. Check **Enforce HTTPS** (after DNS propagates)
5. Click **Save**

### Step 6: Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours to propagate
- You can check propagation status at: https://www.whatsmydns.net/#CNAME/maximillianhum.com
- Or use: `dig maximillianhum.com` or `nslookup maximillianhum.com` in terminal

### Step 7: Commit and Push the CNAME File

After creating the CNAME file, commit and push it:

```bash
git add public/CNAME
git commit -m "Add CNAME file for custom domain"
git push
```

This will trigger a new deployment, and GitHub will recognize your custom domain.

## Troubleshooting

### Error 533 (Cloudflare Error)
- **Cause:** Usually means Cloudflare proxy is enabled (orange cloud)
- **Fix:** Disable proxy (gray cloud) on your DNS records

### "Domain does not resolve to the GitHub Pages server"
- **Cause:** DNS not pointing to GitHub Pages, or proxy enabled
- **Fix:** 
  1. Verify DNS records point to correct GitHub Pages domain
  2. Ensure proxy is OFF (gray cloud)
  3. Wait for DNS propagation (can take up to 48 hours)

### Site loads but shows 404
- **Cause:** basePath configuration issue
- **Fix:** When using custom domain, you may need to remove basePath. Check `next.config.js`

### SSL/HTTPS Issues
- GitHub Pages automatically provisions SSL certificates for custom domains
- This can take up to 24 hours after DNS is configured correctly
- Don't enable "Enforce HTTPS" until SSL is provisioned

### CAA Records and SSL Certificate Issues
- **What are CAA records?** They specify which certificate authorities can issue SSL certificates for your domain
- **Your current CAA records:** Already include `letsencrypt.org`, which GitHub Pages uses ✅
- **If SSL certificate fails to provision:**
  1. Check your CAA records: `dig maximillianhum.com CAA`
  2. Ensure at least one CAA record allows Let's Encrypt: `0 issue "letsencrypt.org"`
  3. If CAA records block Let's Encrypt, temporarily remove them, wait for GitHub to provision SSL, then add back a CAA record allowing Let's Encrypt
  4. Your current CAA records should work fine - no changes needed

## Verification Checklist

- [ ] CNAME file exists in `public/CNAME` with content: `maximillianhum.com`
- [ ] CNAME file committed and pushed to GitHub
- [ ] DNS record in Cloudflare points to GitHub Pages domain
- [ ] Proxy is OFF (gray cloud) on DNS record
- [ ] Custom domain set in GitHub Pages settings
- [ ] Nameservers in HostPapa point to Cloudflare
- [ ] Waited at least 5-10 minutes for DNS propagation
- [ ] Checked DNS propagation status online

## Testing DNS Configuration

Run these commands to verify DNS:

```bash
# Check CNAME record
dig maximillianhum.com CNAME

# Check A records
dig maximillianhum.com A

# Check nameservers
dig maximillianhum.com NS

# Check CAA records (for SSL certificate verification)
dig maximillianhum.com CAA
```

The CNAME should point to your GitHub Pages domain, or A records should point to GitHub's IPs. CAA records should include `letsencrypt.org` for GitHub Pages SSL to work.

