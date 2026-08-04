/*
# Add biggest_goal column to profiles

## Overview
Adds a `biggest_goal` text column to the `profiles` table to store the player's
primary development goal selected during onboarding (e.g. "Better decisions",
"Better vision", "Mental preparation", "Reading the defence", "Confidence").

## Changes
1. New column: `profiles.biggest_goal` (text, nullable)
   - Stores the user's self-selected biggest goal from onboarding screen 4.
   - Nullable so existing profiles are unaffected.

## Security
- No new tables. RLS already enabled on `profiles` with owner-scoped CRUD.
- Existing policies cover the new column automatically (same table).
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS biggest_goal text;
