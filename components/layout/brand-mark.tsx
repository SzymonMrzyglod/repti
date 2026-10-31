export default function BrandMark({ logoUrl }: { logoUrl?: string }) {
  if (!logoUrl) return null;
  return (
    <span className="block h-20 w-20 flex-[0_0_auto]" aria-hidden="true">
      <img src={logoUrl} alt="" className="block h-full w-full object-contain" />
    </span>
  );
}
