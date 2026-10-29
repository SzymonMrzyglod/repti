'use client'

import Link from 'next/link'

const styles = [
  { id: 'editorial', name: '01 / Editorial Forest', note: 'Obecny kierunek — spokojny, premium, kolekcjonerski.', className: 'style-editorial', image: '/images/gecko-luna.png', title: 'NOCTUA', sub: 'Reptile atelier' },
  { id: 'desert', name: '02 / Desert Modern', note: 'Ciepły, pustynny minimalizm z akcentem terracotta.', className: 'style-desert', image: '/images/snake-ember.png', title: 'NOCTUA', sub: 'Desert specimens' },
  { id: 'jungle', name: '03 / Bioactive Jungle', note: 'Organiczny, żywy i bardziej edukacyjny charakter.', className: 'style-jungle', image: '/images/gecko-moss.png', title: 'NOCTUA', sub: 'Living habitats' },
  { id: 'nocturne', name: '04 / Nocturne', note: 'Ciemna, klubowa estetyka inspirowana nocną obserwacją.', className: 'style-nocturne', image: '/images/hero-gecko.png', title: 'NOCTUA', sub: 'After dark' },
]

export default function StyleBoard() {
  return (
    <main className="style-board">
      <header className="style-board-header">
        <div><span className="eyebrow">Kierunki wizualne</span><h1>Wybierz charakter<br /><i>Noctua Reptiles</i></h1></div>
        <Link href="/" className="back-link">← Powrót do strony</Link>
      </header>
      <section className="style-grid">
        {styles.map((style) => (
          <article className={`style-card ${style.className}`} key={style.id}>
            <div className="style-card-top"><span>{style.name}</span><span>Preview 2026</span></div>
            <div className="style-preview">
              <img src={style.image} alt="" />
              <div className="style-overlay" />
              <div className="style-brand"><strong>{style.title}</strong><small>{style.sub}</small></div>
              <div className="style-copy"><span>Hodowla z troską</span><h2>Żywe<br /><em>historie.</em></h2><button>Odkryj kolekcję →</button></div>
            </div>
            <p>{style.note}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
