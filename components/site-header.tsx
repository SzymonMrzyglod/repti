'use client'

import { ArrowUpRight, Menu, X } from 'lucide-react'
import BrandMark from '@/components/brand-mark'

export default function SiteHeader({ menuOpen, onToggle, onNavigate, locale, onLocaleChange, brandName = 'O ty gadzie!', logoUrl }: { menuOpen: boolean; onToggle: () => void; onNavigate: () => void; locale: 'pl' | 'en'; onLocaleChange: (locale: 'pl' | 'en') => void; brandName?: string; logoUrl?: string }) {
  const [firstName, ...restName] = brandName.split(' ')
  return <header className="site-header"><a href="#start" className="logo" aria-label={`${brandName} — strona główna`}><BrandMark logoUrl={logoUrl} /><span>{firstName.toUpperCase()}<br /><em>{restName.join(' ').toUpperCase()}</em></span></a><nav className={`main-nav ${menuOpen ? 'open' : ''}`}><a href="#zwierzeta" onClick={onNavigate}>{locale === 'en' ? 'Animals' : 'Zwierzęta'}</a><a href="#filozofia" onClick={onNavigate}>{locale === 'en' ? 'Our philosophy' : 'Nasza filozofia'}</a><a href="#opieka" onClick={onNavigate}>{locale === 'en' ? 'Care' : 'Opieka'}</a><a href="#kontakt" onClick={onNavigate}>{locale === 'en' ? 'Contact' : 'Kontakt'}</a></nav><div className="header-actions"><div className="language-switcher" aria-label={locale === 'en' ? 'Choose language' : 'Wybierz język'}><button type="button" className={locale === 'pl' ? 'active' : ''} onClick={() => onLocaleChange('pl')}>PL</button><button type="button" className={locale === 'en' ? 'active' : ''} onClick={() => onLocaleChange('en')}>EN</button></div><a href="#kontakt" className="header-cta">{locale === 'en' ? 'Ask about availability' : 'Zapytaj o dostępność'} <ArrowUpRight size={15} /></a></div><button className="mobile-menu" onClick={onToggle} aria-label="Otwórz menu">{menuOpen ? <X /> : <Menu />}</button></header>
}
