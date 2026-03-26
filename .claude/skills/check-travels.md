---
name: check-travels
description: Scan for new travel folders and images, then update configuration files
---

# Check Travels

Check for new travel folders and images, then automatically update all configuration files.

## When to use

- After adding new travel folders (ending with "行")
- After adding new location subfolders with photos
- After adding new photos to existing locations
- Before committing changes to ensure data is up to date

## What it does

1. Scans the project for travel folders and locations
2. Generates `images.json` for each location folder
3. Updates `travel-data.json` with the latest structure
4. Reports statistics about found images

## Usage

Run this skill to update everything:

```
/check-travels
```

## Files updated

- `travel-data.json` - Main configuration with all travels and locations
- `*/images.json` - Image lists for each location (auto-generated)

## Technical details

- Runs: `node update-travel-data.js` then `node generate-image-lists.js`
- Updates: `travel-data.json` and all `*/images.json` files
- Ignores: `.DS_Store`, `node_modules`, `.git`, `images.json`
- Detects: Common image formats (jpg, jpeg, png, gif, webp)
