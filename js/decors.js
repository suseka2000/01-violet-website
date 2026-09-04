(() => {
  'use strict';

  const catalog = window.VIOLET_DECOR_CATALOG;
  if (!catalog?.categories?.length) return;

  const one = (selector) => document.querySelector(selector);
  const categoriesRoot = one('[data-decor-categories]');
  const seriesRoot = one('[data-decor-series]');
  const seriesBlock = one('[data-series-block]');
  const searchInput = one('[data-decor-search]');
  const resetButton = one('[data-decor-reset]');
  const grid = one('[data-decor-grid]');
  const empty = one('[data-decor-empty]');
  const moreButton = one('[data-decor-more]');
  const totalNode = one('[data-catalog-total]');
  const resultCount = one('[data-result-count]');
  const resultLabel = one('[data-result-label]');
  const visibleCount = one('[data-visible-count]');
  const dialog = one('[data-decor-dialog]');
  const dialogImage = one('[data-decor-dialog-image]');
  const dialogCategory = one('[data-decor-dialog-category]');
  const dialogCode = one('[data-decor-dialog-code]');
  const dialogName = one('[data-decor-dialog-name]');
  const dialogSeries = one('[data-decor-dialog-series]');
  const pageSize = 48;

  const escapeHTML = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const normalize = (value) => String(value ?? '').toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').trim();
  const items = catalog.categories.flatMap((category) => category.items.map((item) => ({ ...item, categoryId: category.id, categoryName: category.name })));
  const state = { category: 'all', series: 'all', query: '', limit: pageSize };
  let filteredItems = items;
  let activeDialogIndex = 0;

  if (totalNode) totalNode.textContent = String(items.length);

  function resultNoun(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 14) return 'декоров найдено';
    if (mod10 === 1) return 'декор найден';
    if (mod10 >= 2 && mod10 <= 4) return 'декора найдено';
    return 'декоров найдено';
  }

  function renderCategories() {
    if (!categoriesRoot) return;
    categoriesRoot.innerHTML = [
      `<button class="catalog-filter-button${state.category === 'all' ? ' is-active' : ''}" type="button" data-category="all" aria-pressed="${state.category === 'all'}">Все <span>${items.length}</span></button>`,
      ...catalog.categories.map((category) => `<button class="catalog-filter-button${state.category === category.id ? ' is-active' : ''}" type="button" data-category="${escapeHTML(category.id)}" aria-pressed="${state.category === category.id}">${escapeHTML(category.name)} <span>${category.items.length}</span></button>`),
    ].join('');
    categoriesRoot.querySelectorAll('[data-category]').forEach((button) => {
      button.addEventListener('click', () => {
        state.category = button.dataset.category;
        state.series = 'all';
        state.limit = pageSize;
        renderCategories();
        renderSeries();
        renderResults();
      });
    });
  }

  function activeSeries() {
    if (state.category === 'all') return [];
    const category = catalog.categories.find((item) => item.id === state.category);
    return [...new Set((category?.items || []).map((item) => item.series).filter(Boolean))];
  }

  function renderSeries() {
    if (!seriesRoot || !seriesBlock) return;
    const series = activeSeries();
    seriesBlock.hidden = series.length < 2;
    if (series.length < 2) { state.series = 'all'; seriesRoot.innerHTML = ''; return; }
    seriesRoot.innerHTML = [
      `<button class="catalog-series-button${state.series === 'all' ? ' is-active' : ''}" type="button" data-series="all" aria-pressed="${state.series === 'all'}">Все серии</button>`,
      ...series.map((name) => `<button class="catalog-series-button${state.series === name ? ' is-active' : ''}" type="button" data-series="${escapeHTML(name)}" aria-pressed="${state.series === name}">${escapeHTML(name)}</button>`),
    ].join('');
    seriesRoot.querySelectorAll('[data-series]').forEach((button) => {
      button.addEventListener('click', () => {
        state.series = button.dataset.series;
        state.limit = pageSize;
        renderSeries();
        renderResults();
      });
    });
  }

  function filterItems() {
    const query = normalize(state.query);
    return items.filter((item) => {
      if (state.category !== 'all' && item.categoryId !== state.category) return false;
      if (state.series !== 'all' && item.series !== state.series) return false;
      if (!query) return true;
      return normalize(`${item.code} ${item.name} ${item.series} ${item.categoryName}`).includes(query);
    });
  }

  function renderResults() {
    filteredItems = filterItems();
    const visible = filteredItems.slice(0, state.limit);
    if (resultCount) resultCount.textContent = String(filteredItems.length);
    if (resultLabel) resultLabel.textContent = resultNoun(filteredItems.length);
    if (visibleCount) visibleCount.textContent = filteredItems.length ? `Показано ${visible.length} из ${filteredItems.length}` : '';
    if (empty) empty.hidden = filteredItems.length !== 0;
    if (moreButton) moreButton.hidden = visible.length >= filteredItems.length;
    if (!grid) return;
    grid.innerHTML = visible.map((item, index) => `
      <button class="decor-catalog-card" type="button" data-decor-index="${index}" aria-label="Открыть декор ${escapeHTML(item.code)} ${escapeHTML(item.name)}">
        <span class="decor-card-image"><img src="${escapeHTML(item.image)}" alt="Образец ${escapeHTML(item.code)} — ${escapeHTML(item.name)}" loading="lazy" decoding="async" /></span>
        <span class="decor-card-copy"><span>${escapeHTML(item.categoryName)}</span><strong>${escapeHTML(item.code)}</strong><small>${escapeHTML(item.name || item.series)}</small></span>
      </button>`).join('');
    grid.querySelectorAll('[data-decor-index]').forEach((card) => card.addEventListener('click', () => openDialog(Number(card.dataset.decorIndex))));
  }

  function updateDialog() {
    const item = filteredItems[activeDialogIndex];
    if (!item) return;
    if (dialogImage) { dialogImage.src = item.image; dialogImage.alt = `Образец ${item.code} — ${item.name}`; }
    if (dialogCategory) dialogCategory.textContent = item.categoryName;
    if (dialogCode) dialogCode.textContent = item.code;
    if (dialogName) dialogName.textContent = item.name || 'Название не указано';
    if (dialogSeries) dialogSeries.textContent = item.series || 'Основная коллекция';
  }

  function openDialog(index) {
    activeDialogIndex = index;
    updateDialog();
    document.body.classList.add('decor-dialog-open');
    if (!dialog?.open && typeof dialog?.showModal === 'function') dialog.showModal();
    else if (!dialog?.open) dialog?.setAttribute('open', '');
  }

  function closeDialog() {
    if (typeof dialog?.close === 'function' && dialog.open) dialog.close();
    else dialog?.removeAttribute('open');
    document.body.classList.remove('decor-dialog-open');
  }

  function stepDialog(direction) {
    if (!filteredItems.length) return;
    activeDialogIndex = (activeDialogIndex + direction + filteredItems.length) % filteredItems.length;
    updateDialog();
  }

  searchInput?.addEventListener('input', () => {
    state.query = searchInput.value;
    state.limit = pageSize;
    renderResults();
  });

  resetButton?.addEventListener('click', () => {
    state.category = 'all'; state.series = 'all'; state.query = ''; state.limit = pageSize;
    if (searchInput) searchInput.value = '';
    renderCategories(); renderSeries(); renderResults();
  });

  moreButton?.addEventListener('click', () => { state.limit += pageSize; renderResults(); });
  one('[data-decor-dialog-close]')?.addEventListener('click', closeDialog);
  one('[data-decor-dialog-prev]')?.addEventListener('click', () => stepDialog(-1));
  one('[data-decor-dialog-next]')?.addEventListener('click', () => stepDialog(1));
  dialog?.addEventListener('click', (event) => {
    const content = event.target.closest('figure, .decor-detail-copy, button');
    if (!content) closeDialog();
  });
  dialog?.addEventListener('close', () => document.body.classList.remove('decor-dialog-open'));
  document.addEventListener('keydown', (event) => {
    if (!dialog?.open) return;
    if (event.key === 'Escape') { event.preventDefault(); closeDialog(); return; }
    if (event.key === 'ArrowLeft') stepDialog(-1);
    if (event.key === 'ArrowRight') stepDialog(1);
  });

  renderCategories();
  renderSeries();
  renderResults();
})();
