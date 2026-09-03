(() => {
  'use strict';

  const catalog = window.VIOLET_CATALOG?.systems || {};
  const params = new URLSearchParams(window.location.search);
  const requestedKey = params.get('product');
  const systemKey = catalog[requestedKey] ? requestedKey : 'silver';
  const system = catalog[systemKey] || Object.values(catalog)[0];
  if (!system) return;

  const one = (selector) => document.querySelector(selector);
  const setText = (selector, value) => {
    const node = one(selector);
    if (node) node.textContent = value;
  };

  document.title = `${system.name} — система отделочных панелей VIOLET`;
  one('meta[name="description"]')?.setAttribute('content', `${system.name}: ${system.short} Виды основ: ${system.foundations.join(', ')}.`);

  setText('[data-system-type]', system.type);
  setText('[data-system-name]', system.name);
  setText('[data-system-short]', system.short);
  setText('[data-system-foundations]', system.foundations.join(', '));
  setText('[data-system-fire]', system.fireClass);
  setText('[data-system-purpose]', system.purpose);
  setText('[data-system-production]', system.production);
  setText('[data-system-coating]', system.coating);
  setText('[data-system-visual-caption]', `${system.name} · пример применения`);

  const sourceLink = one('[data-system-source]');
  if (sourceLink) sourceLink.href = system.source;

  const description = one('[data-system-description]');
  if (description) description.innerHTML = system.description.map((paragraph) => `<p>${paragraph}</p>`).join('');

  const benefits = one('[data-system-benefits]');
  if (benefits) benefits.innerHTML = system.benefits.map((item) => `<li>${item}</li>`).join('');

  const cases = one('[data-system-cases]');
  if (cases) cases.innerHTML = system.useCases.map((item) => `<li>${item}</li>`).join('');

  const mainImage = one('[data-system-main-image]');
  const visualCaption = one('[data-system-visual-caption]');
  const gallery = one('[data-system-gallery]');

  function selectImage(image, index) {
    if (mainImage) {
      mainImage.src = image;
      mainImage.alt = `${system.name}: пример применения, фотография ${index + 1}`;
    }
    if (visualCaption) visualCaption.textContent = `${system.name} · фото ${index + 1} из ${system.images.length}`;
    gallery?.querySelectorAll('.gallery-choice').forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  if (mainImage) {
    mainImage.src = system.images[0];
    mainImage.alt = `${system.name}: пример применения в готовом интерьере`;
  }

  if (gallery) {
    gallery.innerHTML = system.images
      .map(
        (image, index) => `
          <button class="gallery-choice${index === 0 ? ' is-active' : ''}" type="button" aria-label="Показать фотографию ${index + 1}" aria-pressed="${index === 0}">
            <img src="${image}" alt="${system.name}, пример ${index + 1}" ${index === 0 ? '' : 'loading="lazy"'} />
            <span>${String(index + 1).padStart(2, '0')} · показать крупнее</span>
          </button>`,
      )
      .join('');
    gallery.querySelectorAll('.gallery-choice').forEach((button, index) => {
      button.addEventListener('click', () => selectImage(system.images[index], index));
    });
  }

  const decorOptions = one('[data-decor-options]');
  const decorMainImage = one('[data-decor-main-image]');
  const decorName = one('[data-decor-name]');
  const decorMeta = one('[data-decor-meta]');
  const decorChoices = [
    { name: 'Молочный', meta: 'Однотонное покрытие', image: system.images[0] },
    { name: 'Фактура дерева', meta: system.coating, image: system.images[1] || system.images[0] },
    { name: 'Графит', meta: 'Контрастный акцент', image: system.images[2] || system.images[0] },
  ];
  function selectDecor(index) {
    const choice = decorChoices[index];
    if (!choice) return;
    if (decorMainImage) { decorMainImage.src = choice.image; decorMainImage.alt = `${system.name}: декор «${choice.name}»`; }
    if (decorName) decorName.textContent = choice.name;
    if (decorMeta) decorMeta.textContent = choice.meta;
    decorOptions?.querySelectorAll('.decor-option').forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  if (decorOptions) {
    decorOptions.innerHTML = decorChoices.map((choice, index) => `
      <button class="decor-option${index === 0 ? ' is-active' : ''}" type="button" aria-pressed="${index === 0}" aria-label="Выбрать декор ${choice.name}">
        <img src="${choice.image}" alt="" loading="lazy" />
        <span><strong>${choice.name}</strong><small>${choice.meta}</small></span><i aria-hidden="true">↗</i>
      </button>`).join('');
    decorOptions.querySelectorAll('.decor-option').forEach((button, index) => button.addEventListener('click', () => selectDecor(index)));
  }

  const related = one('[data-related-systems]');
  if (related) {
    related.innerHTML = Object.entries(catalog)
      .filter(([key]) => key !== systemKey)
      .map(
        ([key, item]) => `
          <a class="related-card" href="system.html?product=${key}">
            <span>${item.type}</span>
            <h3>${item.name}</h3>
            <p>${item.short}</p>
            <i>Открыть систему ↗</i>
          </a>`,
      )
      .join('');
  }
})();
