(() => {
  'use strict';

  const projects = window.VIOLET_CATALOG?.projects || [];
  if (!projects.length) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('project');
  const projectIndex = Math.max(0, projects.findIndex((item) => item.id === requestedId));
  const project = projects[projectIndex];
  const one = (selector) => document.querySelector(selector);
  const setText = (selector, value) => {
    const node = one(selector);
    if (node) node.textContent = value;
  };

  document.title = `${project.title} — проект VIOLET`;
  one('meta[name="description"]')?.setAttribute('content', `${project.title}: ${project.description}`);

  setText('[data-project-category]', `${project.categoryLabel} · реализованный проект`);
  setText('[data-project-title]', project.title);
  setText('[data-project-description]', project.description);
  setText('[data-project-description-secondary]', project.description);
  setText('[data-project-location]', project.location);
  setText('[data-project-location-secondary]', project.location);
  setText('[data-project-panels]', project.panels);
  setText('[data-project-foundation]', project.foundation);
  setText('[data-project-coating]', project.coating);
  setText('[data-project-volume]', project.volume);
  setText('[data-project-term]', project.term);

  const sourceLink = one('[data-project-source]');
  if (sourceLink) sourceLink.href = project.source;

  const mainImage = one('[data-project-main-image]');
  const counter = one('[data-project-counter]');
  const gallery = one('[data-project-gallery]');

  function selectImage(index) {
    if (mainImage) {
      mainImage.src = project.images[index];
      mainImage.alt = `${project.title}: фотография ${index + 1} из ${project.images.length}`;
    }
    if (counter) counter.textContent = `Фото ${index + 1} из ${project.images.length}`;
    gallery?.querySelectorAll('.project-thumb').forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  if (gallery) {
    gallery.innerHTML = project.images
      .map(
        (image, index) => `
          <button class="project-thumb${index === 0 ? ' is-active' : ''}" type="button" aria-label="Показать фотографию ${index + 1}" aria-pressed="${index === 0}">
            <img src="${image}" alt="${project.title}, миниатюра ${index + 1}" ${index === 0 ? '' : 'loading="lazy"'} />
          </button>`,
      )
      .join('');
    gallery.querySelectorAll('.project-thumb').forEach((button, index) => {
      button.addEventListener('click', () => selectImage(index));
      button.addEventListener('pointerenter', () => {
        const preload = new Image();
        preload.src = project.images[index];
      }, { once: true });
    });
  }

  selectImage(0);

  const previousIndex = (projectIndex - 1 + projects.length) % projects.length;
  const nextIndex = (projectIndex + 1) % projects.length;
  const previous = projects[previousIndex];
  const next = projects[nextIndex];
  const previousLink = one('[data-project-previous]');
  const nextLink = one('[data-project-next]');
  if (previousLink) previousLink.href = `project.html?project=${previous.id}`;
  if (nextLink) nextLink.href = `project.html?project=${next.id}`;
  setText('[data-project-previous-title]', previous.title);
  setText('[data-project-next-title]', next.title);
})();
