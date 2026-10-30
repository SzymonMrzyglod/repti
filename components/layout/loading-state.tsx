import { LoaderCircle } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

export default function LoadingState() {
  const { locale } = useLocale();
  const label = getTranslations(locale).home.loading;

  return (
    <main className="loading-state" role="status" aria-label={label}>
      <LoaderCircle aria-hidden="true" />
    </main>
  );
}
