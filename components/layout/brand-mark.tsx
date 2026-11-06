export default function BrandMark({
  logoUrl,
  compact = false,
}: {
  logoUrl?: string;
  compact?: boolean;
}) {
  if (!logoUrl) return null;
  return (
    <span
      className={`block flex-[0_0_auto] transition-[height,width] duration-300 motion-reduce:transition-none ${
        compact ? "h-12 w-12" : "h-20 w-20"
      }`}
      aria-hidden="true"
    >
      <img src={logoUrl} alt="" className="block h-full w-full object-contain" />
    </span>
  );
}
