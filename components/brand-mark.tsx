const defaultLogoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_pelne_256-tNVBDu3ff6cZvZYcfs6HJKFhmliYv9.png'

export default function BrandMark({ logoUrl }: { logoUrl?: string }) {
  return <span className="brand-mark" aria-hidden="true"><img src={logoUrl || defaultLogoUrl} alt="" /></span>
}
