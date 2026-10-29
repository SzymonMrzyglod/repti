import { ArrowUpRight, Camera } from 'lucide-react'
import BrandMark from '@/components/brand-mark'

export default function SiteFooter({ logoUrl }: { logoUrl?: string }) {
  return <footer id="kontakt"><div className="footer-top"><a href="#start" className="logo" aria-label="O ty gadzie! — strona główna"><BrandMark logoUrl={logoUrl} /></a><div className="footer-question"><p className="eyebrow dark"><span /> MASZ PYTANIA?</p><h2>Porozmawiajmy o<br /><i>Twoim gadzie.</i></h2><a href="mailto:kontakt@noctuareptiles.pl" className="text-link">kontakt@noctuareptiles.pl <ArrowUpRight size={15} /></a></div><div className="footer-links"><span>Nawigacja</span><a href="#zwierzeta">Zwierzęta</a><a href="#filozofia">O hodowli</a><a href="#opieka">Poradniki</a><a href="#kontakt">Kontakt</a></div><div className="footer-links"><span>Znajdź nas</span><a href="#kontakt"><Camera size={16} /> Instagram</a><a href="#kontakt">Facebook</a></div></div><div className="footer-bottom"><span>© 2024 NOCTUA REPTILES</span><span>WARSZAWA · POLSKA</span><span>STRONA STWORZONA Z PASJĄ</span></div></footer>
}
