export const pageShellClassName =
  "min-h-screen bg-ivory px-[5vw] pt-7 text-ink";

export const textLinkClassName =
  "inline-flex items-center gap-[14px] border-b border-gold pb-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-200 hover:text-gold motion-reduce:transition-none";

export const spacedTextLinkClassName =
  `${textLinkClassName} mt-[23px]`;

export const outlineButtonClassName =
  "inline-flex w-fit max-w-full items-center gap-[25px] whitespace-nowrap border border-outline/50 px-5 py-[15px] pr-[18px] text-[10px] uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-0.5 hover:border-cream hover:bg-cream hover:text-forest active:translate-y-0 motion-reduce:transition-none";

export const footerLinksClassName =
  "flex flex-col gap-[14px] text-[12px] text-muted [&>span]:mb-[10px] [&>span]:text-[9px] [&>span]:uppercase [&>span]:tracking-[0.2em] [&>span]:text-muted-light [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:[overflow-wrap:anywhere] [&>a]:transition-colors [&>a]:duration-200 [&>a:hover]:text-gold [&>a]:motion-reduce:transition-none";

export const formFieldClassName =
  "w-full rounded-none border border-ink/25 bg-transparent px-[14px] py-[13px] font-[inherit] text-inherit focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2";

export const primaryButtonClassName =
  "inline-flex w-fit max-w-full items-center justify-between gap-6 border border-forest bg-forest text-ivory transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:bg-forest-2 enabled:active:translate-y-0 motion-reduce:transition-none";

export const standardButtonClassName =
  `${primaryButtonClassName} px-[18px] py-[14px] text-[11px] uppercase tracking-[0.1em]`;

export const compactButtonClassName =
  `${primaryButtonClassName} px-[14px] py-3 text-[10px] uppercase tracking-[0.1em]`;
