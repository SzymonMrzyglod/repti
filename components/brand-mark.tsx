export default function BrandMark({ logoUrl }: { logoUrl?: string }) {
  if (!logoUrl) return null;
  return (
    <span className="brand-mark" aria-hidden="true">
      <img src={logoUrl} alt="" />
    </span>
  );
}
