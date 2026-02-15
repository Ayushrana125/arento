# Git Commands Reference - Arento Project

## 🌿 Branch Workflow (Dev → Main)

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd Arento

# Check current branch
git branch

# Create dev branch (if not exists)
git checkout -b dev
```

---

## 📝 Daily Development Workflow

### 1. Start Working (Always on Dev)
```bash
# Switch to dev branch
git checkout dev

# Pull latest changes
git pull origin dev

# Check status
git status
```

### 2. Make Changes & Commit
```bash
# See what changed
git status

# Add specific files
git add src/components/InventoryManagement.tsx
git add src/components/AddItemPanel.tsx

# Or add all changes
git add .

# Commit with message
git commit -m "feat: add dynamic inventory management with Supabase"

# Push to dev
git push origin dev
```

---

## 🚀 Merge Dev to Main (Client Release)

### Method 1: Fast-Forward Merge (Recommended)
```bash
# 1. Switch to main branch
git checkout main

# 2. Pull latest main
git pull origin main

# 3. Merge dev into main
git merge dev

# 4. Push to main (client-facing)
git push origin main

# 5. Switch back to dev for continued work
git checkout dev
```

### Method 2: Merge with Commit Message
```bash
# Switch to main
git checkout main

# Merge dev with commit message
git merge dev -m "Release: Inventory Management v1.2"

# Push to main
git push origin main

# Back to dev
git checkout dev
```

---

## 🔄 Common Daily Commands

### Check Status
```bash
# See current branch and changes
git status

# See commit history
git log --oneline

# See last 5 commits
git log --oneline -5
```

### Undo Changes
```bash
# Discard changes in a file (before commit)
git checkout -- src/components/Settings.tsx

# Unstage a file (after git add)
git reset HEAD src/components/Settings.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) ⚠️ DANGEROUS
git reset --hard HEAD~1
```

### Stash Changes (Save for Later)
```bash
# Save current changes temporarily
git stash

# List stashed changes
git stash list

# Apply last stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

---

## 🔍 View Differences

```bash
# See unstaged changes
git diff

# See staged changes
git diff --cached

# Compare branches
git diff dev main

# See changes in a file
git diff src/components/InventoryAnalysis.tsx
```

---

## 🏷️ Tagging Releases

```bash
# Create tag for release
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag to remote
git push origin v1.0.0

# List all tags
git tag

# Delete tag
git tag -d v1.0.0
```

---

## 🆘 Emergency Fixes

### Hotfix on Main (Production Bug)
```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-bug

# 2. Fix the bug and commit
git add .
git commit -m "hotfix: fix critical login bug"

# 3. Merge to main
git checkout main
git merge hotfix/critical-bug
git push origin main

# 4. Merge to dev (keep dev updated)
git checkout dev
git merge hotfix/critical-bug
git push origin dev

# 5. Delete hotfix branch
git branch -d hotfix/critical-bug
```

---

## 🧹 Cleanup

```bash
# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# Remove untracked files (dry run first)
git clean -n

# Remove untracked files (actual)
git clean -f
```

---

## 📋 Quick Reference

| Command | Description |
|---------|-------------|
| `git status` | Check current status |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit with message |
| `git push origin dev` | Push to dev branch |
| `git checkout main` | Switch to main |
| `git merge dev` | Merge dev into current branch |
| `git pull origin dev` | Pull latest from dev |
| `git log --oneline` | View commit history |
| `git stash` | Save changes temporarily |
| `git diff` | See changes |

---

## 🎯 Best Practices

1. **Always work on dev branch** - Never commit directly to main
2. **Pull before push** - Always `git pull` before `git push`
3. **Commit often** - Small, frequent commits are better
4. **Write clear messages** - Use format: `feat:`, `fix:`, `refactor:`
5. **Test before merge** - Test thoroughly on dev before merging to main
6. **Keep main stable** - Main should always be production-ready
7. **Merge regularly** - Don't let dev and main diverge too much

---

## 💡 Commit Message Format

```bash
# Feature
git commit -m "feat: add bulk upload functionality"

# Bug fix
git commit -m "fix: resolve inventory loading issue"

# Refactor
git commit -m "refactor: optimize database queries"

# Documentation
git commit -m "docs: update README with setup instructions"

# Style
git commit -m "style: improve card layout spacing"
```

---

## 🚨 Common Issues & Solutions

### Merge Conflicts
```bash
# When merge conflicts occur
git merge dev
# CONFLICT (content): Merge conflict in src/components/Settings.tsx

# 1. Open conflicted files and resolve manually
# 2. After resolving, stage the files
git add src/components/Settings.tsx

# 3. Complete the merge
git commit -m "merge: resolve conflicts from dev"
```

### Accidentally Committed to Main
```bash
# Move commit to dev
git checkout dev
git cherry-pick <commit-hash>
git checkout main
git reset --hard HEAD~1
```

### Need to Update Dev with Main Changes
```bash
git checkout dev
git merge main
git push origin dev
```

---

## 📞 Need Help?

```bash
# Get help for any command
git help <command>
git help merge
git help commit
```

---

**Remember:** 
- `dev` = Development branch (your working branch)
- `main` = Production branch (client-facing, stable)
- Always merge `dev → main`, never the reverse (unless hotfix)
