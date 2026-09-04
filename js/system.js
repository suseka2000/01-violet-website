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
  const lightbox = one('[data-image-lightbox]');
  const lightboxImage = one('[data-lightbox-image]');
  const lightboxCaption = one('[data-lightbox-caption]');
  let currentGalleryIndex = 0;

  function selectImage(image, index) {
    currentGalleryIndex = index;
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

  function openLightbox(index) {
    currentGalleryIndex = index;
    if (lightboxImage) {
      lightboxImage.src = system.images[index];
      lightboxImage.alt = `${system.name}: увеличенная фотография ${index + 1}`;
    }
    if (lightboxCaption) lightboxCaption.textContent = `${system.name} · фото ${index + 1} из ${system.images.length}`;
    document.body.classList.add('lightbox-open');
    if (!lightbox?.open && typeof lightbox?.showModal === 'function') lightbox.showModal();
    else if (!lightbox?.open) lightbox?.setAttribute('open', '');
  }

  function closeLightbox() {
    if (typeof lightbox?.close === 'function' && lightbox.open) lightbox.close();
    else lightbox?.removeAttribute('open');
    document.body.classList.remove('lightbox-open');
  }

  function stepLightbox(direction) {
    const nextIndex = (currentGalleryIndex + direction + system.images.length) % system.images.length;
    selectImage(system.images[nextIndex], nextIndex);
    openLightbox(nextIndex);
  }

  one('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
  one('[data-lightbox-prev]')?.addEventListener('click', () => stepLightbox(-1));
  one('[data-lightbox-next]')?.addEventListener('click', () => stepLightbox(1));
  lightbox?.addEventListener('click', (event) => {
    const interactiveTarget = event.target.closest('[data-lightbox-image], [data-lightbox-caption], button');
    if (!interactiveTarget) closeLightbox();
  });
  lightbox?.addEventListener('close', () => document.body.classList.remove('lightbox-open'));
  document.addEventListener('keydown', (event) => {
    if (!lightbox?.open) return;
    if (event.key === 'Escape') { event.preventDefault(); closeLightbox(); return; }
    if (event.key === 'ArrowLeft') stepLightbox(-1);
    if (event.key === 'ArrowRight') stepLightbox(1);
  });

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
      button.addEventListener('click', () => {
        selectImage(system.images[index], index);
        openLightbox(index);
      });
    });
  }

  const decorOptions = one('[data-decor-options]');
  const decorCategories = one('[data-decor-categories]');
  const decorMainImage = one('[data-decor-main-image]');
  const decorName = one('[data-decor-name]');
  const decorMeta = one('[data-decor-meta]');
  const decorGroups = [
    {
      key: 'wood', label: 'Древесные', items: [
        ['W 100 — Дуб белёный', 'w100'], ['W 110 — Яблоня дикая', 'w110'],
        ['W 130 — Дуб седой', 'w130'], ['W 200 — Орех миланский', 'w200'],
        ['W 210 — Орех золотой', 'w210'], ['W 240 — Клён канадский', 'w240'],
        ['W 320', 'w320'], ['W 330 — Махагон', 'w330'],
      ].map(([name, file]) => ({ name, image: `assets/images/decors/wood/${file}.jpg`, swatch: `assets/images/decors/wood/${file}-swatch.jpg` })),
    },
    {
      key: 'refined', label: 'Изысканные', items: [
        ['F 01 — Синий', 'f-01'], ['F 02 — Серый', 'f-02'], ['F 03 — Зелёный', 'f-03'],
        ['F 07 — Бежевый', 'f-07'], ['F 08 — Красный', 'f-08'],
      ].map(([name, file]) => ({ name, image: `assets/images/decors/refined/${file}.jpg`, swatch: `assets/images/decors/refined/${file}-swatch.jpg` })),
    },
    {
      key: 'solid', label: 'Однотонные', items: [
        ['RAL 1000 — Зелёно-бежевый', 'ral1000'], ['RAL 1015 — Светлая слоновая кость', 'ral1015'],
        ['RAL 2002 — Алый', 'ral2002'], ['RAL 4005 — Сине-сиреневый', 'ral4005'],
        ['RAL 5005 — Сигнальный синий', 'ral5005'], ['RAL 6019 — Бело-зелёный', 'ral6019'],
        ['RAL 7035 — Светло-серый', 'ral7035'], ['RAL 9005 — Чёрный янтарь', 'ral9005'],
      ].map(([name, file]) => ({ name, image: `assets/images/decors/solid/${file}.jpg`, swatch: `assets/images/decors/solid/${file}-swatch.png` })),
    },
  ];

  let activeDecorGroup = 0;

  function selectDecor(index) {
    const group = decorGroups[activeDecorGroup];
    const choice = group.items[index];
    if (!choice) return;
    if (decorMainImage) { decorMainImage.src = choice.image; decorMainImage.alt = `${system.name}: декор «${choice.name}»`; }
    if (decorName) decorName.textContent = choice.name;
    if (decorMeta) decorMeta.textContent = group.label;
    decorOptions?.querySelectorAll('.decor-swatch').forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function renderDecorGroup(groupIndex) {
    activeDecorGroup = groupIndex;
    const group = decorGroups[groupIndex];
    if (decorOptions) {
      decorOptions.innerHTML = group.items.map((choice, index) => `
        <button class="decor-swatch${index === 0 ? ' is-active' : ''}" type="button" aria-pressed="${index === 0}" aria-label="Выбрать декор ${choice.name}" title="${choice.name}">
          <img src="${choice.swatch}" alt="" loading="lazy" />
        </button>`).join('');
      decorOptions.querySelectorAll('.decor-swatch').forEach((button, index) => button.addEventListener('click', () => selectDecor(index)));
      decorOptions.scrollLeft = 0;
    }
    decorCategories?.querySelectorAll('.decor-category').forEach((button, index) => {
      const selected = index === groupIndex;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    selectDecor(0);
  }

  if (decorCategories) {
    decorCategories.innerHTML = decorGroups.map((group, index) => `
      <button class="decor-category${index === 0 ? ' is-active' : ''}" type="button" aria-pressed="${index === 0}">${group.label}</button>`).join('');
    decorCategories.querySelectorAll('.decor-category').forEach((button, index) => button.addEventListener('click', () => renderDecorGroup(index)));
  }
  renderDecorGroup(0);

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
