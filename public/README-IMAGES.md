# Required Images for SEO

This document outlines the images you need to create for optimal SEO and PWA support.

## Required Images

### 1. Open Graph Image (Social Media Sharing)
- **File**: Already exists at `/app/opengraph-image.png`
- **Dimensions**: 1200 x 630 pixels
- **Format**: PNG or JPG
- **Purpose**: Used when sharing on Facebook, LinkedIn, Twitter, etc.
- **Note**: ✅ This file already exists!

### 2. PWA Icons (Progressive Web App)
You need to create these icon files in the `/public` directory:

#### Icon 192x192
- **File**: `/public/icon-192x192.png`
- **Dimensions**: 192 x 192 pixels
- **Format**: PNG
- **Purpose**: PWA icon for mobile devices

#### Icon 512x512
- **File**: `/public/icon-512x512.png`
- **Dimensions**: 512 x 512 pixels
- **Format**: PNG
- **Purpose**: PWA icon for high-resolution displays

### 3. Favicon (Browser Tab Icon)
- **File**: `/public/favicon.ico`
- **Dimensions**: 32 x 32 pixels (or multi-size ICO)
- **Format**: ICO
- **Purpose**: Shows in browser tabs and bookmarks

### 4. Apple Touch Icon
- **File**: `/public/apple-touch-icon.png`
- **Dimensions**: 180 x 180 pixels
- **Format**: PNG
- **Purpose**: iOS home screen icon

### 5. Logo for Schema.org
- **File**: `/public/logo.png`
- **Dimensions**: Square format (500 x 500 pixels recommended)
- **Format**: PNG
- **Purpose**: Used in JSON-LD structured data

## Design Guidelines

All icons should:
- Feature the Best Buyers View logo or brand mark
- Have a clean, simple design that's recognizable at small sizes
- Use your brand colors
- Have transparent backgrounds (except favicon.ico)

## Quick Setup

If you already have a logo:
1. Use an image editor or online tool to resize your logo to each dimension
2. For the favicon, you can use a free tool like https://favicon.io/
3. Save files with the exact names listed above
4. Place them in the `/public` directory

## Verification

After adding the images:
1. Restart your Next.js development server
2. Test Open Graph with: https://www.opengraph.xyz/
3. Test PWA manifest in Chrome DevTools > Application > Manifest
4. Check favicon appears in browser tab
