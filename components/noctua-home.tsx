'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, ChevronDown } from 'lucide-react'
import AnimalCard from '@/components/animal-card'
import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'

type Animal = {
  name: string
  species: string
  latin: string
  morph: string
  sex: string
  weight: string
  status: 'Dostępny' | 'Rezerwacja'
  image: string
}

type Localized = { pl?: string; en?: string }
type SiteSettings = {
  brandName?: string
  heroEyebrow?: Localized; heroTitle?: Localized; heroText?: Localized
  historyEyebrow?: Localized; historyTitle?: Localized; historyLead?: Localized; historyText?: Localized
  collectionEyebrow?: Localized; collectionTitle?: Localized; collectionNote?: Localized
  careEyebrow?: Localized; careTitle?: Localized; careText?: Localized
}
type NoctuaHomeProps = { animals: Animal[]; settings?: SiteSettings | null }

const copy = (value: Localized | undefined, locale: 'pl' | 'en', fallback: string) => value?.[locale] || value?.pl || value?.en || fallback

export default function NoctuaHome({ animals, settings }: NoctuaHomeProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [locale, setLocale] = useState<'pl' | 'en'>('pl')
  const [filter, setFilter] = useState('Wszystkie')
  const [showAll, setShowAll] = useState(false)
  const species = useMemo(() => Array.from(new Set(animals.map((animal) => animal.species).filter(Boolean))), [animals])
  const filteredAnimals = useMemo(() => filter === 'Wszystkie' ? animals : animals.filter((animal) => animal.species === filter), [filter, animals])
  const visibleAnimals = showAll ? filteredAnimals : filteredAnimals.slice(0, 3)

  return (
    <main className="site-shell">
      <section className="hero" id="start">
        <img src="/images/hero-gecko.png" alt="Gekon orzęsiony na gałęzi w tropikalnym terrarium" className="hero-image" />
        <div className="hero-overlay" />
<SiteHeader menuOpen={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} onNavigate={() => setMenuOpen(false)} locale={locale} onLocaleChange={setLocale} brandName={settings?.brandName} />
        <div className="hero-content">
          <p className="eyebrow"><span /> {copy(settings?.heroEyebrow, locale, 'HODOWLA Z PASJĄ · OD 2017')}</p>
          <h1>{copy(settings?.heroTitle, locale, 'Piękno z natury.')}</h1>
          <p className="hero-text">{copy(settings?.heroText, locale, 'Hodujemy z szacunkiem. Tworzymy świadomie. Poznaj nasze wyjątkowe gady.')}</p>
          <a href="#zwierzeta" className="outline-button">Poznaj naszych podopiecznych <ArrowDown size={16} /></a>
        </div>
        <div className="hero-foot"><span>SCROLLUJ, ABY ODKRYĆ</span><span className="hero-index">01 <i>/</i> 04</span></div>
      </section>

      <section className="intro-section" id="filozofia">
        <p className="eyebrow dark"><span /> {copy(settings?.historyEyebrow, locale, 'NASZA HISTORIA')}</p>
        <div className="intro-grid"><h2>{copy(settings?.historyTitle, locale, 'Więcej niż hodowla.')}</h2><div><p className="lead">{copy(settings?.historyLead, locale, 'Noctua Reptiles to mała, rodzinna hodowla zrodzona z fascynacji światem gadów.')}</p><p>{copy(settings?.historyText, locale, 'Każde zwierzę otaczamy troską, której potrzebuje, aby rozwijać się w zdrowiu i spokoju.')}</p><a href="#kontakt" className="text-link">Poznaj nas bliżej <ArrowUpRight size={15} /></a></div></div>
        <div className="numbers"><div><strong>7</strong><span>lat doświadczenia</span></div><div><strong>38</strong><span>zdrowych podopiecznych</span></div><div><strong>100%</strong><span>zaangażowania</span></div></div>
      </section>

      <section className="catalog-section" id="zwierzeta">
        <div className="section-heading"><div><p className="eyebrow"><span /> {copy(settings?.collectionEyebrow, locale, 'NASZA KOLEKCJA')}</p><h2>{copy(settings?.collectionTitle, locale, 'Poznaj naszych podopiecznych.')}</h2></div><p className="section-note">{copy(settings?.collectionNote, locale, 'Starannie wyselekcjonowane osobniki, gotowe, by stać się częścią Twojej historii.')}</p></div>
        <div className="filter-row"><div className="filters">{['Wszystkie', ...species].map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => { setFilter(item); setShowAll(false) }}>{item}</button>)}</div><button className="select-filter">Filtruj kolekcję <ChevronDown size={16} /></button></div>
        <div className="animal-grid">{visibleAnimals.map((animal) => <AnimalCard animal={animal} key={animal.id} />)}</div>
        <div className="catalog-foot"><span>01 — 0{filteredAnimals.length}</span>{filteredAnimals.length > 3 && <button type="button" className="text-link light collection-link" onClick={() => setShowAll((current) => !current)}>{showAll ? 'Pokaż mniej' : 'Zobacz pełną kolekcję'} <ArrowUpRight size={15} /></button>}</div>
      </section>

      <section className="care-section" id="opieka"><div className="care-inner"><p className="eyebrow"><span /> {copy(settings?.careEyebrow, locale, 'WIEDZA I OPIEKA')}</p><h2>{copy(settings?.careTitle, locale, 'Dobry początek to podstawa.')}</h2><p>{copy(settings?.careText, locale, 'Przygotowaliśmy praktyczne przewodniki, które pomogą Ci zapewnić Twojemu gadowi najlepsze warunki od pierwszego dnia.')}</p><a href="#kontakt" className="outline-button">{locale === 'en' ? 'Go to guides' : 'Przejdź do poradników'} <ArrowUpRight size={16} /></a></div></section>

      <SiteFooter />
    </main>
  )
}
