import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { updateProfile } from '@/services/profileService';

const BUCKET = 'avatars';
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
export type AvatarErrorCode = 'unsupported_platform' | 'invalid_type' | 'too_large' | 'decode_failed' | 'upload_failed';

class AvatarError extends Error {
  constructor(public code: AvatarErrorCode) { super(code); }
}

async function compress(file: File): Promise<Blob> {
  if (Platform.OS !== 'web' || typeof document === 'undefined') throw new AvatarError('unsupported_platform');
  if (!ALLOWED.has(file.type)) throw new AvatarError('invalid_type');
  if (file.size > MAX_BYTES) throw new AvatarError('too_large');
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = document.createElement('img');
      element.onload = () => resolve(element);
      element.onerror = () => reject(new AvatarError('decode_failed'));
      element.src = objectUrl;
    });
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (!context) throw new AvatarError('decode_failed');
    context.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, 512, 512);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    if (!blob) throw new AvatarError('decode_failed');
    return blob;
  } finally { URL.revokeObjectURL(objectUrl); }
}

export async function resolveAvatarUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!supabase) return null;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(value, 3600);
  return error ? null : data.signedUrl;
}

export async function uploadProfileAvatar(userId: string, file: File): Promise<{ avatarPath: string | null; error: AvatarErrorCode | null }> {
  if (!supabase) return { avatarPath: null, error: 'upload_failed' };
  try {
    const blob = await compress(file);
    const path = `${userId}/avatar.jpg`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: true, cacheControl: '3600' });
    if (error) return { avatarPath: null, error: 'upload_failed' };
    const saved = await updateProfile(userId, { avatar_url: path });
    return saved.error ? { avatarPath: null, error: 'upload_failed' } : { avatarPath: path, error: null };
  } catch (error) {
    return { avatarPath: null, error: error instanceof AvatarError ? error.code : 'upload_failed' };
  }
}

export async function removeProfileAvatar(userId: string): Promise<string | null> {
  if (!supabase) return 'upload_failed';
  const saved = await updateProfile(userId, { avatar_url: null });
  if (saved.error) return 'upload_failed';
  const { error } = await supabase.storage.from(BUCKET).remove([`${userId}/avatar.jpg`]);
  return error?.message ?? null;
}
