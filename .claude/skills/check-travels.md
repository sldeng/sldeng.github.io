---
name: check-travels
description: Scan for new travel folders and images, extract dates, then update configuration files
---

# Check Travels

Check for new travel folders and images, extract photo dates from EXIF data, then automatically update all configuration files.

## When to use

- After adding new travel folders (ending with "行")
- After adding new location subfolders with photos
- After adding new photos to existing locations
- Before committing changes to ensure data is up to date
- To refresh date information for existing photos

## What it does

1. Scans the project for travel folders and locations
2. Extracts shooting dates from image EXIF data
3. Generates `images.json` with filenames and dates for each location
4. Updates `travel-data.json` with the latest structure
5. Reports statistics about found images and their dates

## Usage

Run this skill to update everything:

```
/check-travels
```

## Files updated

- `travel-data.json` - Main configuration with all travels and locations
- `*/images.json` - Image lists with dates for each location (auto-generated)

## Date information

- Extracts EXIF shooting date when available
- Falls back to file modification date if EXIF is missing
- Display format: `2022年08月06日 10:37`
- Shown on hover at bottom of each image

## Technical details

- Runs: `node update-travel-data.js`
- Updates: `travel-data.json` and all `*/images.json` files
- Date extraction: Uses macOS `mdls` command for EXIF data
- Ignores: `.DS_Store`, `node_modules`, `.git`, `images.json`
- Detects: Common image formats (jpg, jpeg, png, gif, webp)

## Quick date update

To refresh only date information without full scan:
```bash
node update-dates.js
```
