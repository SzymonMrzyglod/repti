'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, ChevronDown, Camera, Menu, X } from 'lucide-react'

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

const animals: Animal[] = [
  { name: 'Luna', species: 'Gekon orzęsiony', latin: 'Correlophus ciliatus', morph: 'Harlequin', sex: 'Samica', weight: '48 g', status: 'Dostępny', image: '/images/gecko-luna.png' },
  { name: 'Ember', species: 'Wąż zbożowy', latin: 'Pantherophis guttatus', morph: 'Lavender Tessera', sex: 'Samica', weight: '312 g', status: 'Dostępny', image: '/images/snake-ember.png' },
  { name: 'Moss', species: 'Gekon orzęsiony', latin: 'Correlophus ciliatus', morph: 'Olive Dalmatian', sex: 'Samiec', weight: '36 g', status: 'Rezerwacja', image: '/images/gecko-moss.png' },
]

function Mark() {
  return <div className="brand-mark" aria-hidden="true"><span>◒</span></div>
}

function AnimalCard({ animal }: { animal: Animal }) {
  return (
    <article className="animal-card">
      <div className="card-image-wrap">
        <img src={animal.image} alt={`${animal.name}, ${animal.morph}`} className="card-image" />
        <span className={`status-pill ${animal.status === 'Dostępny' ? 'available' : 'reserved'}`}>{animal.status}</span>
        <button className="card-arrow" aria-label={`Zobacz ${animal.name}`}><ArrowUpRight size={17} /></button>
      </div>
      <div className="card-copy">
        <div className="card-title-row"><h3>{animal.name}</h3><span className="sex">{animal.sex}</span></div>
        <p className="latin">{animal.latin}</p>
        <div className="animal-meta"><span><small>ODMIANA</small>{animal.morph}</span><span><small>WAGA</small>{animal.weight}</span></div>
      </div>
    </article>
  )
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<'Wszystkie' | Animal['species']>('Wszystkie')
  const visibleAnimals = useMemo(() => filter === 'Wszystkie' ? animals : animals.filter((animal) => animal.species === filter), [filter])

  return (
    <main className="site-shell">
      <section className="hero" id="start">
        <img src="/images/hero-gecko.png" alt="Gekon orzęsiony na gałęzi w tropikalnym terrarium" className="hero-image" />
        <div className="hero-overlay" />
        <header className="site-header">
          <a href="#start" className="logo"><Mark /><span>NOCTUA<br /><em>REPTILES</em></span></a>
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <a href="#zwierzeta" onClick={() => setMenuOpen(false)}>Zwierzęta</a><a href="#filozofia" onClick={() => setMenuOpen(false)}>Nasza filozofia</a><a href="#opieka" onClick={() => setMenuOpen(false)}>Opieka</a><a href="#kontakt" onClick={() => setMenuOpen(false)}>Kontakt</a>
          </nav>
          <a href="#kontakt" className="header-cta">Zapytaj o dostępność <ArrowUpRight size={15} /></a>
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Otwórz menu">{menuOpen ? <X /> : <Menu />}</button>
        </header>
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

      <footer id="kontakt"><div className="footer-top"><a href="#start" className="logo"><Mark /><span>NOCTUA<br /><em>REPTILES</em></span></a><div className="footer-question"><p className="eyebrow dark"><span /> MASZ PYTANIA?</p><h2>Porozmawiajmy o<br /><i>Twoim gadzie.</i></h2><a href="mailto:kontakt@noctuareptiles.pl" className="text-link">kontakt@noctuareptiles.pl <ArrowUpRight size={15} /></a></div><div className="footer-links"><span>Nawigacja</span><a href="#zwierzeta">Zwierzęta</a><a href="#filozofia">O hodowli</a><a href="#opieka">Poradniki</a><a href="#kontakt">Kontakt</a></div><div className="footer-links"><span>Znajdź nas</span><a href="#kontakt"><Camera size={16} /> Instagram</a><a href="#kontakt">Facebook</a></div></div><div className="footer-bottom"><span>© 2024 NOCTUA REPTILES</span><span>WARSZAWA · POLSKA</span><span>STRONA STWORZONA Z PASJĄ</span></div></footer>
    </main>
  )
}
