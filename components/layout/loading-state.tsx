import { LoaderCircle } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

export default function LoadingState() {
  const { locale } = useLocale();
  const label = getTranslations(locale).home.loading;

  return (
    <main className="grid min-h-svh place-items-center text-gold" role="status" aria-label={label}>
      <LoaderCircle aria-hidden="true" className="h-[34px] w-[34px] animate-[spin_0.9s_linear_infinite] motion-reduce:animate-none" />
    </main>
  );
}
