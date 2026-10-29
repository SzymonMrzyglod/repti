'use client'

import { ArrowUpRight, Menu, X } from 'lucide-react'
import BrandMark from '@/components/brand-mark'

export default function SiteHeader({ menuOpen, onToggle, onNavigate }: { menuOpen: boolean; onToggle: () => void; onNavigate: () => void }) {
  return <header className="site-header"><a href="#start" className="logo"><BrandMark /><span>NOCTUA<br /><em>REPTILES</em></span></a><nav className={`main-nav ${menuOpen ? 'open' : ''}`}><a href="#zwierzeta" onClick={onNavigate}>Zwierzęta</a><a href="#filozofia" onClick={onNavigate}>Nasza filozofia</a><a href="#opieka" onClick={onNavigate}>Opieka</a><a href="#kontakt" onClick={onNavigate}>Kontakt</a></nav><a href="#kontakt" className="header-cta">Zapytaj o dostępność <ArrowUpRight size={15} /></a><button className="mobile-menu" onClick={onToggle} aria-label="Otwórz menu">{menuOpen ? <X /> : <Menu />}</button></header>
}
