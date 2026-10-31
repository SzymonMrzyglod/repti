import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Seo from "@/components/seo";
import Eyebrow from "@/components/ui/eyebrow";
import {
  outlineButtonClassName,
  pageShellClassName,
} from "@/components/ui/styles";
import LocaleSwitcher from "@/components/layout/locale-switcher";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";
import { SITE_NAME } from "@/lib/seo";

export default function NotFoundPage() {
  const { locale } = useLocale();
  const { pathname } = useLocation();
  const content = getTranslations(locale).notFound;

  return (
    <>
      <Seo
        title={`${content.title} | ${SITE_NAME}`}
        description={content.description}
        path={pathname}
        noindex
      />
      <main className={`${pageShellClassName} pb-20`}>
        <header className="mx-auto flex max-w-[1240px] items-start justify-between">
          <LocaleSwitcher />
        </header>

        <section className="mx-auto grid min-h-[65svh] max-w-[1240px] content-center">
          <Eyebrow tone="dark">{content.eyebrow}</Eyebrow>
          <h1 className="mt-7 mb-6 max-w-[900px] text-[clamp(56px,9vw,120px)] leading-[0.9] tracking-[-0.06em]">
            {content.title}
          </h1>
          <p className="mb-9 max-w-[560px] text-[18px] leading-[1.6] text-muted">
            {content.description}
          </p>
          <div>
            <Link to="/" className={outlineButtonClassName}>
              {content.home} <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
