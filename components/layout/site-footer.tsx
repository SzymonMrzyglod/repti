import { ArrowUpRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "./brand-mark";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

export default function SiteFooter({ logoUrl }: { logoUrl?: string }) {
  const currentYear = new Date().getFullYear();
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  return (
    <footer id="contact">
      <div className="footer-top">
        <a
          href="#start"
          className="logo"
          aria-label={translations.footer.brandHome}
        >
          <BrandMark logoUrl={logoUrl} />
        </a>
        <div className="footer-question">
          <p className="eyebrow dark">
            <span /> {translations.footer.questions}
          </p>
          <h2>
            {translations.footer.contactTitle}
            <br />
            <i>{translations.footer.contactTitleAccent}</i>
          </h2>
          <a href="mailto:kontakt@otygadzie.pl" className="text-link">
            {translations.footer.contactLink} <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="footer-links">
          <span>{translations.footer.navigation}</span>
          <a href="#animals">{translations.footer.animals}</a>
          <a href="#philosophy">{translations.footer.breeding}</a>
          <Link to="/guides">{translations.footer.guides}</Link>
          <a href="#contact">{translations.footer.contact}</a>
        </div>
        <div className="footer-links">
          <span>{translations.footer.findUs}</span>
          <a href="#contact">
            <Camera size={16} /> Instagram
          </a>
          <a href="#contact">Facebook </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {currentYear} O TY GADZIE</span>
        <span>{translations.footer.location}</span>
        <span>{translations.footer.tagline}</span>
      </div>
    </footer>
  );
}
