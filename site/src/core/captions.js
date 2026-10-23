// Captions are real HTML over the canvas: readable, selectable, and announced
// to screen readers. A beat's caption is a list of entries:
//   { narr: '...' }                 stage direction, italic
//   { who: 'Sinnett', line: '...' } spoken line with a speaker label (who optional)
//   { title, kicker, deck }         the title page
//   { chapter, title, card }        a chapter intertitle
//   { manuscript: ['...', ...] }    a handwritten letter
//   { end, next, small }            the end-of-chapter card
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
// *word* marks italics in caption text (newspaper and book titles)
const fmt = (s) => esc(s).replace(/\*(.+?)\*/g, '<i>$1</i>');

function render(entries) {
  return entries.map((e) => {
    if (e.title && e.kicker !== undefined) return `<div class="c-title"><p class="kicker">${fmt(e.kicker)}</p><h1>${fmt(e.title)}</h1><p class="deck">${fmt(e.deck)}</p></div>`;
    if (e.chapter) return `<div class="c-chapter"><p class="num">${fmt(e.chapter)}</p><h2>${fmt(e.title)}</h2><p class="card">${fmt(e.card)}</p></div>`;
    if (e.manuscript) return `<div class="c-manuscript">${e.manuscript.map((l) => `<p>${fmt(l)}</p>`).join('')}</div>`;
    if (e.end) return `<div class="c-end"><p class="end">${fmt(e.end)}</p><p class="next">${e.next}</p><p class="small">${fmt(e.small)}</p></div>`;
    if (e.line !== undefined) return `<p class="line">${e.who ? `<span class="who">${fmt(e.who)}</span>` : ''}${fmt(e.line)}</p>`;
    return `<p class="narr">${fmt(e.narr)}</p>`;
  }).join('');
}

export class Captions {
  constructor(el) { this.el = el; this.timer = null; }

  show(entries, { layout = 'band', instant = false } = {}) {
    const html = render(entries || []);
    clearTimeout(this.timer);
    const apply = () => {
      this.el.className = `captions captions--${layout}`;
      this.el.innerHTML = html;
      // next frame, so the fade-in transition actually runs
      requestAnimationFrame(() => this.el.classList.add('is-in'));
    };
    if (instant) { apply(); return; }
    this.el.classList.remove('is-in');
    this.timer = setTimeout(apply, 260);
  }
}
