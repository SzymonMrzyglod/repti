import { set, type ObjectInputProps } from "sanity";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default function LocalizedRichTextInput(props: ObjectInputProps) {
  const value = isRecord(props.value) ? props.value : {};
  const legacyLocales = (["pl", "en"] as const).filter(
    (locale) => typeof value[locale] === "string",
  );

  if (legacyLocales.length === 0) return props.renderDefault(props);

  const migrateLegacyText = () => {
    const migrated = { ...value };
    for (const locale of legacyLocales) {
      const text = value[locale];
      if (typeof text !== "string") continue;
      migrated[locale] = [
        {
          _type: "block",
          _key: crypto.randomUUID(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: crypto.randomUUID(),
              text,
              marks: [],
            },
          ],
        },
      ];
    }
    props.onChange(set(migrated));
  };

  return (
    <div
      role="note"
      style={{
        display: "grid",
        gap: 12,
        padding: 16,
        borderRadius: 4,
        background: "var(--card-bg-color, #f3f3f3)",
      }}
    >
      <p style={{ margin: 0 }}>
        To pole zawiera tekst zapisany w starszym formacie. Przekonwertuj go,
        aby edytować go z formatowaniem. Treść pozostanie zachowana.
      </p>
      <p style={{ margin: 0 }}>
        Dostępny tekst:{" "}
        {legacyLocales.map((locale) => locale.toUpperCase()).join(", ")}
      </p>
      <button type="button" onClick={migrateLegacyText}>
        Konwertuj tekst do edytora
      </button>
    </div>
  );
}
