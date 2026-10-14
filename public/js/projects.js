'use strict';

(function () {
  const M = window.BRIDGESTONE; if (!M) return;
  const grid = document.getElementById('projects-grid');
  const bar = document.getElementById('proj-filters');
  if (!grid) return;
  let all = [];

  const draw = (list) => { grid.innerHTML = list.map(M.projectCard).join(''); M.observeReveals(); };

  /* Changing the filter shuffles the deck: the cards on show fly out turned,
     and the new set is dealt back in. */
  let shuffleTimer = null;
  const render = (list, shuffle) => {
    if (!shuffle || M.reduceMotion) return draw(list);
    clearTimeout(shuffleTimer);
    grid.classList.add('is-shuffling');
    shuffleTimer = setTimeout(() => {
      grid.classList.remove('is-shuffling');
      draw(list);
    }, 260);
  };

  function buildFilters(projects) {
    const sectors = ['All', ...Array.from(new Set(projects.map((p) => p.sector)))];
    bar.innerHTML = sectors.map((s, i) => `<button class="chip${i === 0 ? ' active' : ''}" data-sector="${M.esc(s)}">${M.esc(s)}</button>`).join('');
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip'); if (!btn) return;
      M.$$('.chip', bar).forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      const s = btn.dataset.sector;
      render(s === 'All' ? all : all.filter((p) => p.sector === s), true);
    });
  }

  (async () => {
    try { const d = await M.fetchJSON('/api/projects'); all = d.projects || M.FALLBACK_PROJECTS; }
    catch (e) { all = M.FALLBACK_PROJECTS; }
    buildFilters(all);
    render(all);
  })();
})();
