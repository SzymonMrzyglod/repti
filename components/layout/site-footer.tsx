import { Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { FooterContactForm } from "@/components/contact-form";
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
          <FooterContactForm />
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
          <a
            href="https://www.instagram.com/o_ty_gadzie/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Camera size={16} /> Instagram
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61596249982202"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="facebook-mark"
              viewBox="-337 273 123.5 256"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M-260.9,327.8c0-10.3,9.2-14,19.5-14c10.3,0,21.3,3.2,21.3,3.2l6.6-39.2c0,0-14-4.8-47.4-4.8c-20.5,0-32.4,7.8-41.1,19.3c-8.2,10.9-8.5,28.4-8.5,39.7v25.7H-337V396h26.5v133h49.6V396h39.3l2.9-38.3h-42.2V327.8z"
              />
            </svg>{" "}
            Facebook
          </a>
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
