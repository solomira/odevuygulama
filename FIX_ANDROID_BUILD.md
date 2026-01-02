# Fixing Android Build Prebuild Failure

## Problem
The Android build is failing during the prebuild phase because required asset files are missing.

## Root Cause
Your `app.json` references these assets, but they don't exist:
- `./assets/icon.png` (1024x1024px)
- `./assets/splash.png` (1284x2778px)  
- `./assets/adaptive-icon.png` (1024x1024px)

## Solution

### Option 1: Create Placeholder Assets (Quick Fix)

Since Node.js isn't installed, you can:

1. **Download minimal placeholder images:**
   - Visit https://via.placeholder.com/1024x1024/6366f1/ffffff?text=Icon
   - Save as `assets/icon.png`
   - Visit https://via.placeholder.com/1024x1024/6366f1/ffffff?text=Adaptive
   - Save as `assets/adaptive-icon.png`
   - Visit https://via.placeholder.com/1284x2778/6366f1/ffffff?text=Splash
   - Save as `assets/splash.png`

2. **Or use an online icon generator:**
   - https://www.appicon.co/
   - https://www.makeappicon.com/
   - Upload any image and download the generated assets

### Option 2: Create Assets Manually

1. Create a simple 1024x1024px image with your app logo/name
2. Save as `assets/icon.png`
3. Copy it to `assets/adaptive-icon.png` (same file)
4. Create a 1284x2778px splash screen image
5. Save as `assets/splash.png`

### Option 3: Use the Script (When Node.js is Available)

Once Node.js is installed:

```bash
node scripts/create-placeholder-assets.js
```

## Required File Structure

```
assets/
├── icon.png (1024x1024px)
├── adaptive-icon.png (1024x1024px)
├── splash.png (1284x2778px)
└── favicon.png (48x48px - optional)
```

## Verification

After creating the assets, verify they exist:

```bash
# Windows PowerShell
dir assets

# Should show:
# icon.png
# adaptive-icon.png
# splash.png
```

## Next Steps

1. ✅ Create the missing asset files (see options above)
2. ✅ Verify all files exist in `assets/` folder
3. ✅ Retry the build:
   ```bash
   eas build -p android --profile preview
   ```

## Important Notes

- **Placeholder assets will work for builds** but should be replaced with actual app icons before production
- **Minimum requirements:** Files must exist and be valid PNG format
- **Size doesn't have to be exact** for placeholder, but should be close for best results
- **Production builds:** Use proper, high-quality app icons

## Alternative: Temporarily Make Assets Optional

If you need to test the build configuration without assets, you can temporarily comment out asset references in `app.json`, but this is NOT recommended as EAS builds require these assets.

## Still Having Issues?

1. Check build logs:
   ```bash
   eas build:list
   eas build:view [build-id]
   ```

2. Verify app.json syntax:
   ```bash
   # Should be valid JSON
   ```

3. Check file paths in app.json match actual file locations









