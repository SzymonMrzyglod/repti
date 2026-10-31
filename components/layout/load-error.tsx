import { Link } from "react-router-dom";
import { pageShellClassName, spacedTextLinkClassName } from "@/components/ui/styles";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

export default function LoadError() {
  const { locale } = useLocale();
  const translations = getTranslations(locale);

  return (
    <main className={`${pageShellClassName} pb-20`}>
      <p role="alert">{translations.home.loadError}</p>
      <Link className={`${spacedTextLinkClassName} text-forest`} to="/">
        {translations.animal.backToCollection}
      </Link>
    </main>
  );
}
