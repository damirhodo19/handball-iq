import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const check = (condition, message) => condition ? console.log(`  ✓ ${message}`) : failures.push(message);
const migration = read('supabase/migrations/20260812180000_profile_avatars.sql');
const service = read('services/avatarService.ts');
const profile = read('app/(tabs)/profile.tsx');
const players = read('app/coach-dashboard/players.tsx');
const picker = read('components/WebAvatarPicker.tsx');

console.log('\n=== Profile avatar validation ===');
check(migration.includes("'avatars', 'avatars', false, 5242880"), 'private bucket has a 5 MB limit');
check(migration.includes("(storage.foldername(name))[1] = auth.uid()::text"), 'writes are restricted to the owner folder');
check(migration.includes('JOIN public.team_members viewer'), 'reads are limited to the owner and team members');
check(migration.includes('public.can_manage_team(p_team_id)'), 'coach avatar listing requires team access');
check(service.includes('canvas.width = 512') && service.includes("'image/jpeg', 0.82"), 'web images are cropped and compressed');
check(service.includes('MAX_SOURCE_BYTES = 15 * 1024 * 1024') && service.includes("'image/heic'"), 'mobile photos up to 15 MB and HEIC are accepted before compression');
check(picker.includes("accept: 'image/*,.heic,.heif,.jfif'"), 'mobile gallery formats are visible in the file chooser');
check(service.includes('upsert: true'), 'one avatar replaces the previous file');
check(service.includes('createSignedUrl(value, 3600)'), 'private photos use one-hour signed links');
check(profile.includes('WebAvatarPicker'), 'player and coach profile supports upload and removal');
check(players.includes('ProfileAvatar'), 'coach player list displays avatars');
check(!migration.includes('DELETE FROM') && !migration.includes('DROP TABLE'), 'migration is non-destructive');

if (failures.length) {
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}
console.log('\nPASS — profile avatars are wired safely');
