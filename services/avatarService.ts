import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { updateProfile } from '@/services/profileService';

const BUCKET = 'avatars';
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
]);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'jfif', 'png', 'webp', 'avif', 'heic', 'heif']);
export type AvatarErrorCode = 'unsupported_platform' | 'invalid_type' | 'too_large' | 'decode_failed' | 'upload_failed';

class AvatarError extends Error {
  constructor(public code: AvatarErrorCode) { super(code); }
}

async function compress(file: File): Promise<Blob> {
  if (Platform.OS !== 'web' || typeof document === 'undefined') throw new AvatarError('unsupported_platform');
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  const hasAllowedType = ALLOWED_MIME_TYPES.has(file.type.toLowerCase());
  const hasAllowedExtension = ALLOWED_EXTENSIONS.has(extension);
  // Some mobile gallery/file providers leave the MIME type empty or use a
  // generic value. A known image extension is a safe fallback in that case.
  if (!hasAllowedType && !hasAllowedExtension) throw new AvatarError('invalid_type');
  if (file.size > MAX_SOURCE_BYTES) throw new AvatarError('too_large');
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
    if (blob.size > MAX_UPLOAD_BYTES) throw new AvatarError('too_large');
    return blob;
  } finally { URL.revokeObjectURL(objectUrl); }
}

export async function resolveAvatarUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!supabase) return null;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(value, 3600);
  if (error) {
    console.warn('[avatarService] signed URL failed:', error.message);
    return null;
  }
  const separator = data.signedUrl.includes('?') ? '&' : '?';
  return `${data.signedUrl}${separator}v=${Date.now()}`;
}

export async function uploadProfileAvatar(userId: string, file: File): Promise<{ avatarPath: string | null; error: AvatarErrorCode | null }> {
  if (!supabase) return { avatarPath: null, error: 'upload_failed' };
  try {
    const blob = await compress(file);
    const path = `${userId}/avatar.jpg`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: true, cacheControl: '0' });
    if (error) {
      console.warn('[avatarService] upload failed:', error.message);
      return { avatarPath: null, error: 'upload_failed' };
    }
    const saved = await updateProfile(userId, { avatar_url: path });
    if (saved.error) {
      console.warn('[avatarService] profile update failed:', saved.error);
      return { avatarPath: null, error: 'upload_failed' };
    }
    return { avatarPath: path, error: null };
  } catch (error) {
    if (!(error instanceof AvatarError)) console.warn('[avatarService] unexpected upload failure:', error);
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
