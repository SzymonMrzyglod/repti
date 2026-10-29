'use client'

import { ArrowUpRight, Menu, X } from 'lucide-react'
import BrandMark from '@/components/brand-mark'

export default function SiteHeader({ menuOpen, onToggle, onNavigate, locale, onLocaleChange }: { menuOpen: boolean; onToggle: () => void; onNavigate: () => void; locale: 'pl' | 'en'; onLocaleChange: (locale: 'pl' | 'en') => void }) {
  return <header className="site-header"><a href="#start" className="logo"><BrandMark /><span>NOCTUA<br /><em>REPTILES</em></span></a><nav className={`main-nav ${menuOpen ? 'open' : ''}`}><a href="#zwierzeta" onClick={onNavigate}>Zwierzęta</a><a href="#filozofia" onClick={onNavigate}>Nasza filozofia</a><a href="#opieka" onClick={onNavigate}>Opieka</a><a href="#kontakt" onClick={onNavigate}>Kontakt</a></nav><div className="header-actions"><div className="language-switcher" aria-label="Wybierz język"><button className={locale === 'pl' ? 'active' : ''} onClick={() => onLocaleChange('pl')}>PL</button><button className={locale === 'en' ? 'active' : ''} onClick={() => onLocaleChange('en')}>EN</button></div><a href="#kontakt" className="header-cta">Zapytaj o dostępność <ArrowUpRight size={15} /></a></div><button className="mobile-menu" onClick={onToggle} aria-label="Otwórz menu">{menuOpen ? <X /> : <Menu />}</button></header>
}
