import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowUpRight, Check, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import Eyebrow from "@/components/ui/eyebrow";
import {
  compactButtonClassName,
  formFieldClassName,
  pageShellClassName,
  spacedTextLinkClassName,
  standardButtonClassName,
} from "@/components/ui/styles";
import LocaleSwitcher from "@/components/layout/locale-switcher";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

const WEB3FORMS_ACCESS_KEY = "bbeb4b57-519f-4acd-9ce0-5f5bce374e2b";

type Localized = { pl?: string; en?: string };
export type ContactAnimal = {
  _id?: string;
  name?: Localized;
  species?: string;
  speciesLatinName?: string;
  latinName?: string;
  morph?: Localized;
  sex?: Localized;
  weight?: string;
  imageUrl?: string;
};

function localized(value: Localized | undefined, locale: "pl" | "en") {
  return value?.[locale] || value?.pl || value?.en || "—";
}

export default function ContactForm({
  animal,
  embedded = false,
  onSuccess,
}: {
  animal?: ContactAnimal;
  embedded?: boolean;
  onSuccess?: () => void;
}) {
  const { locale } = useLocale();
  const content = getTranslations(locale).contact;
  const [result, setResult] = useState<"idle" | "sending" | "success" | "error">("idle");
  const animalName = localized(animal?.name, locale);
  const species =
    animal?.latinName || animal?.speciesLatinName || animal?.species || "—";
  const formLabelClassName = `grid ${embedded ? "gap-[7px] text-[12px]" : "gap-[9px] text-[13px]"}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult("sending");

    const formData = new FormData(event.currentTarget);
    const message = String(formData.get("message") || "");
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append(
      "subject",
      animal ? `${content.subjectPrefix}: ${animalName}` : content.generalSubject,
    );

    if (animal) {
      const animalDetails = [
        `${content.animal}: ${animalName}`,
        `${content.species}: ${species}`,
        `${content.morph}: ${localized(animal.morph, locale)}`,
        `${content.sex}: ${localized(animal.sex, locale)}`,
        `${content.weight}: ${animal.weight || "—"}`,
      ].join("\n");
      formData.set("message", `${message}\n\n${animalDetails}`);
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const isSuccess = response.ok && data.success;
      setResult(isSuccess ? "success" : "error");
      if (isSuccess) onSuccess?.();
    } catch {
      setResult("error");
    }
  }

  const form = result === "success" ? (
    <div className="flex items-start gap-4 border-t border-ink/20 pt-6" role="status" aria-live="polite">
      <span className="grid h-[38px] w-[38px] flex-[0_0_auto] place-items-center bg-success-soft text-success">
        <Check size={20} />
      </span>
      <div>
        <h3 className="mb-[7px] text-[22px] font-medium">{content.successTitle}</h3>
        <p className="mb-0 leading-[1.5]">{content.success}</p>
      </div>
    </div>
  ) : (
    <form className={`grid border-t border-ink/20 pt-6 ${embedded ? "gap-[14px] border-t-0 pt-0" : "gap-[22px]"}`} onSubmit={onSubmit}>
      <a
        className="inline-flex w-fit items-center gap-[9px] text-[12px] text-forest underline decoration-1 underline-offset-[3px] hover:text-[#536e5c]"
        href="https://www.facebook.com/profile.php?id=61596249982202"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={17} /> {content.messenger}
      </a>
      <label className={formLabelClassName}>
        <span>{content.name}</span>
        <input autoComplete="name" name="name" required className={formFieldClassName} />
      </label>
      <label className={formLabelClassName}>
        <span>{content.email}</span>
        <input
          autoComplete="email"
          name="email"
          type="email"
          required
          className={formFieldClassName}
        />
      </label>
      <label className={formLabelClassName}>
        <span>{content.message}</span>
        <textarea
          name="message"
          placeholder={content.messagePlaceholder}
          rows={embedded ? 4 : 6}
          required
          className={`${formFieldClassName} resize-y ${embedded ? "min-h-[100px]" : "min-h-[150px]"}`}
        />
      </label>
      <input
        type="checkbox"
        name="botcheck"
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
      />
      <button
        type="submit"
        className={`${embedded ? compactButtonClassName : standardButtonClassName} disabled:cursor-wait disabled:opacity-[0.65]`}
        disabled={result === "sending"}
      >
        {result === "sending" ? content.sending : content.submit}
        <ArrowUpRight size={16} />
      </button>
      {result === "error" && (
        <p
          className="m-0 leading-[1.5] text-error"
          role="alert"
          aria-live="polite"
        >
          {content.error}
        </p>
      )}
    </form>
  );

  if (embedded) {
    return (
      <div className="mt-7 grid gap-6">
        {animal && (
          <aside className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-[18px] bg-sand p-4 max-[760px]:grid-cols-[76px_minmax(0,1fr)] max-[760px]:gap-3 max-[760px]:p-3">
            {animal.imageUrl && <img src={animal.imageUrl} alt={animalName} className="block aspect-square w-[120px] object-cover max-[760px]:w-[76px]" />}
            <div>
              <p className="mb-0 font-mono text-[10px] uppercase tracking-[0.12em] opacity-65">{content.selectedAnimal}</p>
              <h3 className="mt-2 mb-1 font-display text-[28px] leading-none max-[760px]:text-[23px]">{animalName}</h3>
              <p className="mb-0 font-mono text-[12px]">{species}</p>
            </div>
          </aside>
        )}
        {form}
      </div>
    );
  }

  return (
    <main className={`${pageShellClassName} pb-20 max-[760px]:pt-[18px] max-[760px]:pb-12`}>
      <header className="mx-auto flex max-w-[1240px] items-center justify-between">
        <Link
          to={animal?._id ? `/animal/${animal._id}` : "/"}
          className={`${spacedTextLinkClassName} text-forest`}
        >
          <ArrowLeft size={15} />
          {animal ? content.backToAnimal : content.backToCollection}
        </Link>
        <LocaleSwitcher />
      </header>

      <section className="mx-auto mt-28 max-w-[1080px] max-[760px]:mt-[76px]">
        <div className="max-w-[660px]">
          <Eyebrow tone="dark">{content.eyebrow}</Eyebrow>
          <h1 className="mt-5 mb-6 text-[72px] leading-[0.9] tracking-[-0.06em] max-[760px]:text-[52px]">{content.title}</h1>
          <p className="max-w-[520px] text-[18px] leading-[1.5]">{content.introduction}</p>
        </div>

        <div className="mt-12 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-start gap-16 max-[760px]:mt-9 max-[760px]:grid-cols-1 max-[760px]:gap-7">
          {animal && (
            <aside className="bg-sand p-6 max-[760px]:p-[18px]">
              {animal.imageUrl && <img src={animal.imageUrl} alt={animalName} className="mb-6 block aspect-[4/3] w-full object-cover" />}
              <p className="mb-0 font-mono text-[10px] uppercase tracking-[0.12em] opacity-65">{content.selectedAnimal}</p>
              <h2 className="mt-[14px] mb-2 text-[38px] leading-none tracking-[-0.055em]">{animalName}</h2>
              <p className="mb-0 font-mono text-[12px]">{species}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-ink/20 pt-[18px]">
                <div className="min-w-0">
                  <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] opacity-65">{content.morph}</dt>
                  <dd className="m-0 [overflow-wrap:anywhere]">{localized(animal.morph, locale)}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] opacity-65">{content.sex}</dt>
                  <dd className="m-0 [overflow-wrap:anywhere]">{localized(animal.sex, locale)}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] opacity-65">{content.weight}</dt>
                  <dd className="m-0 [overflow-wrap:anywhere]">{animal.weight || "—"}</dd>
                </div>
              </dl>
            </aside>
          )}

          {form}
        </div>
      </section>
    </main>
  );
}

export function ContactFormModal({
  open,
  onClose,
  animal,
}: {
  open: boolean;
  onClose: () => void;
  animal?: ContactAnimal;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const content = translations.contact;
  const animalName = localized(animal?.name, locale);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) setSent(false);
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="m-auto max-h-[min(90dvh,900px)] w-[min(680px,calc(100vw-32px))] max-w-none border-0 bg-ivory p-[clamp(24px,4vw,48px)] text-ink shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop:bg-[rgba(8,18,12,0.76)] backdrop:backdrop-blur-[4px] max-[760px]:max-h-[calc(100dvh-20px)] max-[760px]:w-[calc(100vw-20px)] max-[760px]:px-5 max-[760px]:py-6"
      aria-labelledby="contact-modal-title"
      onClose={onClose}
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {sent ? (
        <div className="grid justify-items-start gap-4" role="status" aria-live="polite">
          <span className="grid h-[38px] w-[38px] flex-[0_0_auto] place-items-center bg-success-soft text-success">
            <Check size={20} />
          </span>
          <h2 id="contact-modal-title" className="m-0 text-[clamp(36px,6vw,52px)] leading-none tracking-[-0.055em]">{content.successTitle}</h2>
          <p className="m-0 leading-[1.5]">{content.success}</p>
          <button
            type="button"
            className={standardButtonClassName}
            onClick={onClose}
          >
            {content.close}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-5">
            <Eyebrow tone="dark">{content.eyebrow}</Eyebrow>
            <button
              type="button"
              className="grid h-10 w-10 flex-[0_0_auto] place-items-center border border-ink/25 bg-transparent p-0 hover:bg-sand"
              aria-label={content.close}
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          <h2 id="contact-modal-title" className="mt-5 mb-3 text-[clamp(42px,7vw,64px)] leading-[0.95] tracking-[-0.055em]">{content.title}</h2>
          {animal && (
            <p className="mb-2 font-mono text-[12px]">
              {animalName} ·{" "}
              {animal.latinName || animal.speciesLatinName || animal.species}
            </p>
          )}
          <p className="mb-0 max-w-[500px] leading-[1.5]">{content.introduction}</p>
          {open && (
            <ContactForm
              animal={animal}
              embedded
              onSuccess={() => setSent(true)}
            />
          )}
        </>
      )}
    </dialog>,
    document.body,
  );
}

export function FooterContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale } = useLocale();
  const translations = getTranslations(locale);

  return (
    <>
      <button
        type="button"
        className={`${spacedTextLinkClassName} cursor-pointer border-x-0 border-t-0 bg-transparent text-forest`}
        onClick={() => setIsOpen(true)}
      >
        {translations.footer.contactLink} <ArrowUpRight size={15} />
      </button>
      <ContactFormModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}