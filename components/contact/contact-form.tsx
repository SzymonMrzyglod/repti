import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowUpRight, Check, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import "./contact-form.css";
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
    <div className="contact-success" role="status" aria-live="polite">
      <span className="contact-success-icon">
        <Check size={20} />
      </span>
      <div>
        <h3>{content.successTitle}</h3>
        <p>{content.success}</p>
      </div>
    </div>
  ) : (
    <form className={`contact-form${embedded ? " contact-form--compact" : ""}`} onSubmit={onSubmit}>
      <a
        className="contact-messenger"
        href="https://www.facebook.com/profile.php?id=61596249982202"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={17} /> {content.messenger}
      </a>
      <label>
        <span>{content.name}</span>
        <input autoComplete="name" name="name" required />
      </label>
      <label>
        <span>{content.email}</span>
        <input
          autoComplete="email"
          name="email"
          type="email"
          required
        />
      </label>
      <label>
        <span>{content.message}</span>
        <textarea
          name="message"
          placeholder={content.messagePlaceholder}
          rows={embedded ? 4 : 6}
          required
        />
      </label>
      <input
        type="checkbox"
        name="botcheck"
        className="contact-honeypot"
        tabIndex={-1}
        autoComplete="off"
      />
      <button
        type="submit"
        className="contact-submit"
        disabled={result === "sending"}
      >
        {result === "sending" ? content.sending : content.submit}
        <ArrowUpRight size={16} />
      </button>
      {result === "error" && (
        <p
          className="contact-result contact-result--error"
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
      <div className="contact-form-embedded">
        {animal && (
          <aside className="contact-modal-animal">
            {animal.imageUrl && <img src={animal.imageUrl} alt={animalName} />}
            <div>
              <p className="contact-animal-label">{content.selectedAnimal}</p>
              <h3>{animalName}</h3>
              <p className="contact-animal-species">{species}</p>
            </div>
          </aside>
        )}
        {form}
      </div>
    );
  }

  return (
    <main className="contact-page">
      <header className="contact-header">
        <Link
          to={animal?._id ? `/animal/${animal._id}` : "/"}
          className="text-link dark"
        >
          <ArrowLeft size={15} />
          {animal ? content.backToAnimal : content.backToCollection}
        </Link>
        <LocaleSwitcher />
      </header>

      <section className="contact-content">
        <div className="contact-heading">
          <p className="eyebrow dark">
            <span /> {content.eyebrow}
          </p>
          <h1>{content.title}</h1>
          <p>{content.introduction}</p>
        </div>

        <div className="contact-layout">
          {animal && (
            <aside className="contact-animal">
              {animal.imageUrl && <img src={animal.imageUrl} alt={animalName} />}
              <p className="contact-animal-label">{content.selectedAnimal}</p>
              <h2>{animalName}</h2>
              <p className="contact-animal-species">{species}</p>
              <dl>
                <div>
                  <dt>{content.morph}</dt>
                  <dd>{localized(animal.morph, locale)}</dd>
                </div>
                <div>
                  <dt>{content.sex}</dt>
                  <dd>{localized(animal.sex, locale)}</dd>
                </div>
                <div>
                  <dt>{content.weight}</dt>
                  <dd>{animal.weight || "—"}</dd>
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
      className="contact-modal"
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
        <div className="contact-modal-thanks" role="status" aria-live="polite">
          <span className="contact-success-icon">
            <Check size={20} />
          </span>
          <h2 id="contact-modal-title">{content.successTitle}</h2>
          <p>{content.success}</p>
          <button
            type="button"
            className="contact-submit"
            onClick={onClose}
          >
            {content.close}
          </button>
        </div>
      ) : (
        <>
          <div className="contact-modal-header">
            <p className="eyebrow dark">
              <span /> {content.eyebrow}
            </p>
            <button
              type="button"
              className="contact-modal-close"
              aria-label={content.close}
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          <h2 id="contact-modal-title">{content.title}</h2>
          {animal && (
            <p className="contact-modal-subtitle">
              {animalName} ·{" "}
              {animal.latinName || animal.speciesLatinName || animal.species}
            </p>
          )}
          <p className="contact-modal-intro">{content.introduction}</p>
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
        className="text-link footer-contact-trigger"
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