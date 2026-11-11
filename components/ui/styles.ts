export const pageShellClassName =
  "min-h-screen bg-ivory px-[5vw] pt-7 text-ink";

const linkBaseClassName =
  "group inline-flex items-center gap-3 border-b border-gold/50 pb-[7px] text-[12px] font-medium uppercase tracking-[0.2em] transition-[color,border-color] duration-300 hover:border-gold hover:text-gold motion-reduce:transition-none [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-300 motion-reduce:[&>svg]:transition-none";

export const textLinkClassName =
  `${linkBaseClassName} hover:[&>svg]:translate-x-1`;

export const backLinkClassName =
  `${linkBaseClassName} hover:[&>svg]:-translate-x-1`;

export const spacedTextLinkClassName =
  `${textLinkClassName} mt-[23px]`;

export const spacedBackLinkClassName =
  `${backLinkClassName} mt-[23px]`;

export const outlineButtonClassName =
  "inline-flex w-fit max-w-full items-center gap-4 whitespace-nowrap border border-outline/40 px-6 py-[15px] text-[12px] font-medium uppercase tracking-[0.2em] transition-[color,background-color,border-color] duration-300 hover:border-cream hover:bg-cream hover:text-forest motion-reduce:transition-none";

export const footerLinksClassName =
  "flex flex-col gap-[14px] text-[11px] min-[701px]:text-[12px] text-muted [&>span]:mb-[10px] [&>span]:text-[9px] min-[701px]:[&>span]:text-[12px] [&>span]:uppercase [&>span]:tracking-[0.2em] [&>span]:text-muted-light [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:[overflow-wrap:anywhere] [&>a]:transition-colors [&>a]:duration-200 [&>a:hover]:text-gold [&>a]:motion-reduce:transition-none";

export const formFieldClassName =
  "w-full rounded-none border border-ink/25 bg-transparent px-[14px] py-[13px] font-[inherit] text-inherit focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2";

export const primaryButtonClassName =
  "inline-flex w-fit max-w-full items-center justify-between gap-6 border border-forest bg-forest text-ivory transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:bg-forest-2 enabled:active:translate-y-0 motion-reduce:transition-none";

export const standardButtonClassName =
  `${primaryButtonClassName} px-[18px] py-[14px] text-[12px] uppercase tracking-[0.1em]`;

export const compactButtonClassName =
  `${primaryButtonClassName} px-[14px] py-3 text-[12px] uppercase tracking-[0.1em]`;
