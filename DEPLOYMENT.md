# GitHub Pages Deployment Guide

Follow these steps to deploy your website to GitHub Pages for free:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right, then select "New repository"
3. Name your repository (e.g., `maximillianhum-website` or just use your username for `username.github.io`)
4. Choose **Public** (required for free GitHub Pages)
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Initialize Git and Push Your Code

Open your terminal in the project directory and run:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The page will automatically deploy when you push to the main branch

## Step 4: Configure Base Path (If Needed)

**Important:** If your repository name is NOT `username.github.io`, you need to configure a base path:

1. Open `next.config.js`
2. Uncomment and update these lines:
   ```javascript
   basePath: '/your-repo-name',
   trailingSlash: true,
   ```
   Replace `your-repo-name` with your actual repository name

3. Commit and push the changes:
   ```bash
   git add next.config.js
   git commit -m "Configure base path for GitHub Pages"
   git push
   ```

## Step 5: Wait for Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You should see a workflow running called "Deploy to GitHub Pages"
3. Wait for it to complete (usually 2-3 minutes)
4. Once it's done, go back to **Settings > Pages**
5. Your site URL will be displayed there:
   - If repo is `username.github.io`: `https://username.github.io`
   - Otherwise: `https://username.github.io/repo-name`

## Step 6: Update Your Site

Every time you push changes to the `main` branch, GitHub Actions will automatically rebuild and deploy your site. Just:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

- **404 errors**: Make sure you've configured the `basePath` correctly if using a subdirectory
- **Build fails**: Check the Actions tab for error messages
- **Images not loading**: Ensure image paths start with `/` (absolute paths)
- **Styling broken**: Make sure `basePath` is set correctly

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain name
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use your custom domain

