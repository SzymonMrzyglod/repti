import { Camera, Mail, Phone } from "lucide-react";
import { FooterContactForm } from "@/components/contact/contact-form";
import Eyebrow from "@/components/ui/eyebrow";
import { footerLinksClassName } from "@/components/ui/styles";
import BrandMark from "./brand-mark";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

export default function SiteFooter({ logoUrl }: { logoUrl?: string }) {
  const currentYear = new Date().getFullYear();
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  return (
    <footer id="contact" className="bg-ivory px-[5.5vw] pt-[90px] pb-[25px]">
      <div className="grid min-h-[310px] grid-cols-[0.45fr_2fr_1fr] gap-[5vw] max-[700px]:min-h-0 max-[700px]:grid-cols-1 max-[700px]:gap-y-[40px] max-[700px]:pb-8">
        <a
          href="#start"
          className="flex items-start gap-[11px] text-[12px] font-bold leading-[0.92] tracking-[0.17em] max-[700px]:hidden"
          aria-label={translations.footer.brandHome}
        >
          <BrandMark logoUrl={logoUrl} />
        </a>
        <div className="max-[700px]:order-[-1] max-[700px]:col-span-full">
          <Eyebrow tone="dark">{translations.footer.questions}</Eyebrow>
          <h2 className="mt-7 mb-[25px] text-[clamp(40px,4vw,58px)] leading-[0.95] tracking-[-0.055em] text-forest">
            {translations.footer.contactTitle}
            <br />
            <i className="text-gold">{translations.footer.contactTitleAccent}</i>
          </h2>
          <FooterContactForm />
        </div>
        <div className={footerLinksClassName}>
          <span>{translations.footer.findUs}</span>
          <a href="tel:+48888163509">
            <Phone size={16} /> 888 163 509
          </a>
          <a href="mailto:o.ty.gadzie@gmail.com">
            <Mail size={16} /> o.ty.gadzie@gmail.com
          </a>
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
              className="block h-4 w-4 flex-[0_0_16px]"
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
          <a
            href="https://www.tiktok.com/@o.ty.gadzie"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="block h-4 w-4 flex-[0_0_16px]"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M19.6 6.7a5.4 5.4 0 0 1-3.3-1.9A5.4 5.4 0 0 1 15 1.5h-3.4v13.3a2.9 2.9 0 1 1-2-2.8V8.5a6.4 6.4 0 1 0 5.4 6.3V9a8.7 8.7 0 0 0 4.6 1.4V7a5.5 5.5 0 0 1-.0-.3z"
              />
            </svg>{" "}
            TikTok
          </a>
        </div>
      </div>
      <div className="flex justify-between border-t border-[#d5d5ca] pt-[17px] text-[9px] min-[701px]:text-[12px] tracking-[0.15em] text-[#999b90] max-[700px]:flex-wrap max-[700px]:gap-3 max-[700px]:leading-[1.4]">
        <span>© {currentYear} O TY GADZIE</span>
        <span>{translations.footer.location}</span>
        <span>{translations.footer.tagline}</span>
      </div>
    </footer>
  );
}
