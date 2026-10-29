'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, ChevronDown } from 'lucide-react'
import AnimalCard from '@/components/animal-card'
import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'

type Animal = {
  name: string
  species: 'Gekon orzęsiony' | 'Wąż zbożowy'
  latin: string
  morph: string
  sex: string
  weight: string
  status: 'Dostępny' | 'Rezerwacja'
  image: string
}

type NoctuaHomeProps = {
  animals: Animal[]
}

export default function NoctuaHome({ animals }: NoctuaHomeProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<'Wszystkie' | Animal['species']>('Wszystkie')
  const visibleAnimals = useMemo(() => filter === 'Wszystkie' ? animals : animals.filter((animal) => animal.species === filter), [filter, animals])

  return (
    <main className="site-shell">
      <section className="hero" id="start">
        <img src="/images/hero-gecko.png" alt="Gekon orzęsiony na gałęzi w tropikalnym terrarium" className="hero-image" />
        <div className="hero-overlay" />
        <SiteHeader menuOpen={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} onNavigate={() => setMenuOpen(false)} />
        <div className="hero-content">
          <p className="eyebrow"><span /> HODOWLA Z PASJĄ · OD 2017</p>
          <h1>Piękno<br /><i>z natury.</i></h1>
          <p className="hero-text">Hodujemy z szacunkiem. Tworzymy świadomie.<br />Poznaj nasze wyjątkowe gady.</p>
          <a href="#zwierzeta" className="outline-button">Poznaj naszych podopiecznych <ArrowDown size={16} /></a>
        </div>
        <div className="hero-foot"><span>SCROLLUJ, ABY ODKRYĆ</span><span className="hero-index">01 <i>/</i> 04</span></div>
      </section>

      <section className="intro-section" id="filozofia">
        <p className="eyebrow dark"><span /> NASZA HISTORIA</p>
        <div className="intro-grid"><h2>Więcej niż<br /><i>hodowla.</i></h2><div><p className="lead">Noctua Reptiles to mała, rodzinna hodowla zrodzona z fascynacji światem gadów.</p><p>Każde zwierzę otaczamy troską, której potrzebuje, aby rozwijać się w zdrowiu i spokoju. Dbamy o genetykę, dobrostan i relację, która zaczyna się na długo przed tym, gdy trafia do nowego domu.</p><a href="#kontakt" className="text-link">Poznaj nas bliżej <ArrowUpRight size={15} /></a></div></div>
        <div className="numbers"><div><strong>7</strong><span>lat doświadczenia</span></div><div><strong>38</strong><span>zdrowych podopiecznych</span></div><div><strong>100%</strong><span>zaangażowania</span></div></div>
      </section>

      <section className="catalog-section" id="zwierzeta">
        <div className="section-heading"><div><p className="eyebrow"><span /> NASZA KOLEKCJA</p><h2>Poznaj naszych<br /><i>podopiecznych.</i></h2></div><p className="section-note">Starannie wyselekcjonowane osobniki,<br />gotowe, by stać się częścią Twojej historii.</p></div>
        <div className="filter-row"><div className="filters">{(['Wszystkie', 'Gekon orzęsiony', 'Wąż zbożowy'] as const).map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="select-filter">Filtruj kolekcję <ChevronDown size={16} /></button></div>
        <div className="animal-grid">{visibleAnimals.map((animal) => <AnimalCard animal={animal} key={animal.name} />)}</div>
        <div className="catalog-foot"><span>01 — 0{visibleAnimals.length}</span><a href="#kontakt" className="text-link light">Zobacz pełną kolekcję <ArrowUpRight size={15} /></a></div>
      </section>

      <section className="care-section" id="opieka"><div className="care-inner"><p className="eyebrow"><span /> WIEDZA I OPIEKA</p><h2>Dobry początek<br />to <i>podstawa.</i></h2><p>Przygotowaliśmy praktyczne przewodniki, które pomogą Ci zapewnić Twojemu gadowi najlepsze warunki od pierwszego dnia.</p><a href="#kontakt" className="outline-button">Przejdź do poradników <ArrowUpRight size={16} /></a></div></section>

      <SiteFooter />
    </main>
  )
}
