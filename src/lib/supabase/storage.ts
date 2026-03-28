export const PET_IMAGES_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_PETS_BUCKET || 'pet-images'

export const PET_IMAGE_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const PET_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024

export function sanitizeImageFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
}

export function buildPetImagePath(fileName: string): string {
  const safe = sanitizeImageFileName(fileName || 'pet-image')
  return `pets/${Date.now()}-${safe}`
}

export function isAllowedPetImageType(mimeType: string): boolean {
  return PET_IMAGE_ALLOWED_TYPES.includes(mimeType)
}

export function isAllowedPetImageSize(sizeInBytes: number): boolean {
  return sizeInBytes <= PET_IMAGE_MAX_SIZE_BYTES
}
