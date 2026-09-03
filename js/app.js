(() => {
  'use strict';

  const one = (selector, scope = document) => scope?.querySelector(selector) || null;
  const all = (selector, scope = document) => (scope ? [...scope.querySelectorAll(selector)] : []);

  const recommendationData = {
    medical: {
      system: 'silver',
      code: 'Антибактериальная система',
      title: 'Violet Silver',
      description:
        'Панели для помещений с повышенными требованиями к гигиене и регулярной санитарной обработке.',
      features: [
        'Антибактериальное покрытие',
        'Устойчивость к интенсивной эксплуатации',
        'Документы и схемы монтажа для проектировщика',
      ],
      bases: 'ГКЛ, Кремнит, СМЛ',
      image: 'assets/images/products/silver-1.jpg',
      imageAlt: 'Violet Silver в готовом медицинском интерьере',
      caption: 'Медицинские и «чистые» помещения',
    },
    education: {
      system: 'acoustic',
      code: 'Акустическая система',
      title: 'Violet Acoustic',
      description:
        'Решение для учебных и общественных пространств, где важно управлять отражением звука.',
      features: [
        'Акустический комфорт',
        'Проектный подбор перфорации и основы',
        'Материалы для включения в документацию',
      ],
      bases: 'ГКЛ, Кремнит, МДФ, СМЛ',
      image: 'assets/images/products/acoustic-1.jpg',
      imageAlt: 'Акустические панели Violet в готовом общественном интерьере',
      caption: 'Учебные, актовые и общественные пространства',
    },
    hospitality: {
      system: 'organic',
      code: 'Натуральная отделка',
      title: 'Violet Organic',
      description:
        'Панели с натуральным шпоном для представительских, гостиничных и офисных интерьеров.',
      features: [
        'Натуральная фактура дерева',
        'Подбор декора под концепцию интерьера',
        'Готовая система профилей и монтажа',
      ],
      bases: 'ГСП, СМЛ',
      image: 'assets/images/products/organic-1.jpg',
      imageAlt: 'Violet Organic в готовом интерьере с натуральным шпоном',
      caption: 'Офисы, лобби и представительские зоны',
    },
    industrial: {
      system: 'ng',
      code: 'Негорючая система',
      title: 'Violet НГ',
      description:
        'Решение для объектов с повышенными требованиями пожарной безопасности и эксплуатации.',
      features: [
        'Негорючее исполнение',
        'Устойчивость к рабочим нагрузкам',
        'Комплект подтверждающих документов',
      ],
      bases: 'Кремнит, СМЛ',
      image: 'assets/images/products/ng-1.jpg',
      imageAlt: 'Негорючие панели Violet НГ в готовом помещении',
      caption: 'Транспортные и промышленные объекты',
    },
  };

  const systemData = {
    silver: {
      code: 'Антибактериальная система',
      title: 'Violet Silver',
      reason:
        'Система отвечает выбранным требованиям к гигиене и интенсивной эксплуатации.',
    },
    fire: {
      code: 'Негорючая система',
      title: 'Violet НГ',
      reason:
        'В приоритете указана негорючесть, поэтому система требует проверки по пожарным требованиям проекта.',
    },
    acoustic: {
      code: 'Акустическая система',
      title: 'Violet Acoustic',
      reason:
        'Выбран акустический комфорт — проектировщик уточнит основу, перфорацию и целевые характеристики.',
    },
    organic: {
      code: 'Натуральная отделка',
      title: 'Violet Organic',
      reason:
        'Выбрано натуральное покрытие — система ориентирована на выразительную фактуру и дизайн интерьера.',
    },
    protect: {
      code: 'Защитное покрытие',
      title: 'Violet Protect',
      reason:
        'Для интенсивной эксплуатации предложено защитное полимерное покрытие с проверкой инженером.',
    },
    color: {
      code: 'Декоративная система',
      title: 'Violet Color',
      reason:
        'Система выбрана из каталога: инженер уточнит цвет, основу, способ печати и требования объекта.',
    },
  };

  const documentData = {
    certificates: [
      ['PDF', 'Пожарные сертификаты', 'Комплект документов по системам'],
      ['PDF', 'Санитарные документы', 'Материалы для проектной документации'],
      ['PDF', 'Технические характеристики', 'Основы, покрытия и варианты применения'],
    ],
    bim: [
      ['RVT', 'Семейства Revit', 'BIM-модели для включения в проект'],
      ['ZIP', 'Комплект текстур', 'Материалы для визуализации'],
      ['PDF', 'Рекомендации BIM', 'Правила работы с библиотекой'],
    ],
    installation: [
      ['PDF', 'Инструкция по монтажу', 'Последовательность работ и требования'],
      ['DWG', 'Монтажные узлы', 'Типовые примыкания и соединения'],
      ['PDF', 'Каталог профилей', 'Открытые и скрытые системы монтажа'],
    ],
  };

  let toastTimer;
  const toast = one('[data-toast]');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  const header = one('[data-header]');
  function updateHeader() {
    header?.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const menuToggle = one('[data-menu-toggle]');
  const menu = one('[data-menu]');
  const menuBackdrop = one('[data-menu-backdrop]');
  const mobileMenuQuery = window.matchMedia('(max-width: 900px)');

  function syncMenuAccessibility() {
    if (!menu) return;
    const isOpen = menu.classList.contains('is-open');
    menu.inert = mobileMenuQuery.matches && !isOpen;
    if (mobileMenuQuery.matches) menu.setAttribute('aria-hidden', String(!isOpen));
    else menu.removeAttribute('aria-hidden');
  }

  function setMenuPageInert(value) {
    [one('main'), one('footer')].forEach((region) => {
      if (region) region.inert = value;
    });
  }

  function closeMenu(restoreFocus = false) {
    const wasOpen = menu?.classList.contains('is-open');
    menu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Открыть меню');
    if (wasOpen) setMenuPageInert(false);
    syncMenuAccessibility();
    if (restoreFocus) window.setTimeout(() => menuToggle?.focus({ preventScroll: true }), 260);
  }

  menuToggle?.addEventListener('click', () => {
    const nextOpen = !menu?.classList.contains('is-open');
    menu?.classList.toggle('is-open', nextOpen);
    document.body.classList.toggle('menu-open', nextOpen);
    menuToggle.setAttribute('aria-expanded', String(nextOpen));
    menuToggle.setAttribute('aria-label', nextOpen ? 'Закрыть меню' : 'Открыть меню');
    setMenuPageInert(nextOpen);
    syncMenuAccessibility();
    if (nextOpen) window.setTimeout(() => one('a', menu)?.focus(), 30);
  });

  all('a', menu).forEach((link) => link.addEventListener('click', () => closeMenu(false)));
  one('.mobile-nav-cta', menu)?.addEventListener('click', () => closeMenu(false));
  menuBackdrop?.addEventListener('pointerdown', (event) => event.preventDefault());
  menuBackdrop?.addEventListener('click', () => closeMenu(true));
  document.addEventListener('click', (event) => {
    if (!menu?.classList.contains('is-open')) return;
    if (menu.contains(event.target) || menuToggle?.contains(event.target)) return;
    closeMenu(true);
  });
  window.addEventListener('resize', () => {
    if (!mobileMenuQuery.matches) closeMenu(false);
    else syncMenuAccessibility();
  });
  syncMenuAccessibility();

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !menu?.classList.contains('is-open')) return;
    const focusable = [menuToggle, ...all('a, button', menu)].filter(
      (element) => element && !element.disabled && element.getClientRects().length > 0,
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const recommendationTitle = one('[data-recommendation-title]');
  const recommendationCode = one('[data-recommendation-code]');
  const recommendationDescription = one('[data-recommendation-description]');
  const recommendationFeatures = one('[data-recommendation-features]');
  const recommendationImage = one('[data-recommendation-image]');
  const recommendationCaption = one('[data-recommendation-caption]');
  const recommendationBases = one('[data-recommendation-bases]');
  const recommendationDetail = one('[data-recommendation-detail]');
  let finderIndustry = 'medical';

  function updateFinder(industry) {
    const data = recommendationData[industry];
    if (!data) return;
    finderIndustry = industry;

    all('[data-industry]').forEach((button) => {
      const selected = button.dataset.industry === industry;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    if (recommendationCode) recommendationCode.textContent = data.code;
    if (recommendationTitle) recommendationTitle.textContent = data.title;
    if (recommendationDescription) recommendationDescription.textContent = data.description;
    if (recommendationFeatures) {
      recommendationFeatures.innerHTML = data.features.map((feature) => `<li>${feature}</li>`).join('');
    }
    if (recommendationImage) {
      recommendationImage.src = data.image;
      recommendationImage.alt = data.imageAlt;
    }
    if (recommendationCaption) recommendationCaption.textContent = data.caption;
    if (recommendationBases) recommendationBases.textContent = data.bases;
    if (recommendationDetail) recommendationDetail.href = `system.html?product=${data.system}`;
  }

  all('[data-industry]').forEach((button) => {
    button.addEventListener('click', () => updateFinder(button.dataset.industry));
  });

  all('[data-system-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.systemFilter;
      all('[data-system-filter]').forEach((peer) => {
        const selected = peer === button;
        peer.classList.toggle('is-active', selected);
        peer.setAttribute('aria-pressed', String(selected));
      });

      all('[data-system-category]').forEach((card) => {
        const categories = (card.dataset.systemCategory || '').split(' ');
        card.hidden = filter !== 'all' && !categories.includes(filter);
      });
    });
  });

  const projectGrid = one('[data-project-grid]');
  const projectCount = one('[data-project-count]');
  const projectCountLabel = one('[data-project-count-label]');
  const catalogProjects = window.VIOLET_CATALOG?.projects || [];

  function russianProjectNoun(value) {
    const remainder100 = value % 100;
    const remainder10 = value % 10;
    if (remainder100 >= 11 && remainder100 <= 14) return 'объектов';
    if (remainder10 === 1) return 'объект';
    if (remainder10 >= 2 && remainder10 <= 4) return 'объекта';
    return 'объектов';
  }

  function matchesProjectFilter(project, filter) {
    if (filter === 'all') return true;
    if (filter === 'other') return ['sport', 'hospitality', 'special'].includes(project.category);
    return project.category === filter;
  }

  function renderProjects(filter = 'all') {
    if (!projectGrid) return;
    const visibleProjects = catalogProjects.filter((project) => matchesProjectFilter(project, filter));
    if (projectCount) projectCount.textContent = String(visibleProjects.length);
    if (projectCountLabel) projectCountLabel.textContent = russianProjectNoun(visibleProjects.length);

    projectGrid.innerHTML = visibleProjects
      .map(
        (project, index) => `
          <a class="project-card${index === 0 ? ' project-card-featured' : ''}" href="project.html?project=${project.id}">
            <figure class="project-card-media">
              <img src="${project.images[0]}" alt="${project.title}: реализованный интерьер" ${index === 0 ? '' : 'loading="lazy"'} />
              <span class="project-card-number">${String(index + 1).padStart(2, '0')}</span>
              <figcaption class="project-card-open"><span>Смотреть 4 фотографии</span><i aria-hidden="true">↗</i></figcaption>
            </figure>
            <div class="project-card-copy">
              <span class="project-card-category">${project.categoryLabel} · ${project.location}</span>
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <div class="project-card-meta">
                <span>Система<strong>${project.panels}</strong></span>
                <span>Объём / формат<strong>${project.volume}</strong></span>
              </div>
            </div>
          </a>`,
      )
      .join('');
  }

  all('[data-project-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.projectFilter;
      all('[data-project-filter]').forEach((peer) => {
        const selected = peer === button;
        peer.classList.toggle('is-active', selected);
        peer.setAttribute('aria-pressed', String(selected));
      });
      renderProjects(filter);
    });
  });

  renderProjects();

  const documentList = one('[data-document-list]');

  function renderDocuments(key) {
    const items = documentData[key] || [];
    if (!documentList) return;
    documentList.innerHTML = items
      .map(
        ([type, title, description]) => `
          <button type="button" data-document-download>
            <span class="file-type">${type}</span>
            <span><strong>${title}</strong><small>${description}</small></span>
            <i>↓</i>
          </button>`,
      )
      .join('');
    all('[data-document-download]', documentList).forEach((item) => {
      item.addEventListener('click', () => showToast('В прототипе документ показан как элемент будущей библиотеки.'));
    });
  }

  all('[data-document-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      all('[data-document-tab]').forEach((peer) => peer.setAttribute('aria-pressed', String(peer === tab)));
      renderDocuments(tab.dataset.documentTab);
    });
  });
  renderDocuments('certificates');

  const simpleDialog = one('[data-simple-dialog]');
  const dialogEyebrow = one('[data-dialog-eyebrow]');
  const dialogTitle = one('[data-dialog-title]');
  const dialogText = one('[data-dialog-text]');
  const simpleForm = one('[data-simple-form]');

  function openSimpleDialog({ eyebrow, title, text }) {
    if (!simpleDialog) return;
    if (dialogEyebrow) dialogEyebrow.textContent = eyebrow;
    if (dialogTitle) dialogTitle.textContent = title;
    if (dialogText) dialogText.textContent = text;
    if (typeof simpleDialog.showModal === 'function') {
      simpleDialog.showModal();
    } else {
      simpleDialog.setAttribute('open', '');
    }
  }

  function closeSimpleDialog() {
    if (!simpleDialog) return;
    if (typeof simpleDialog.close === 'function') simpleDialog.close();
    else simpleDialog.removeAttribute('open');
  }

  one('[data-sample-button]')?.addEventListener('click', () =>
    openSimpleDialog({
      eyebrow: 'Образцы',
      title: 'Получить комплект образцов',
      text: 'Оставьте контакт — в рабочей версии менеджер уточнит объект, город и нужные системы.',
    }),
  );

  one('[data-tour-button]')?.addEventListener('click', () =>
    openSimpleDialog({
      eyebrow: 'Производство',
      title: 'Запросить экскурсию',
      text: 'Оставьте контакт — менеджер согласует возможный формат и дату посещения производства.',
    }),
  );

  one('[data-close-simple-dialog]')?.addEventListener('click', closeSimpleDialog);
  simpleDialog?.addEventListener('click', (event) => {
    if (event.target === simpleDialog) closeSimpleDialog();
  });

  simpleForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    closeSimpleDialog();
    simpleForm.reset();
    showToast('Заявка собрана. Это демонстрация — данные никуда не отправлены.');
  });

  const contactForm = one('[data-contact-form]');
  const contactSuccess = one('[data-contact-success]');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    contactSuccess.hidden = false;
    contactForm.reset();
  });

  const calculatorModal = one('[data-calculator-modal]');
  const calculatorForm = one('[data-calculator-form]');
  const calculatorSteps = all('[data-step]');
  const previousButton = one('[data-previous-step]');
  const nextButton = one('[data-next-step]');
  const currentStepLabel = one('[data-current-step]');
  const progressTrack = one('[data-progress-track]');
  const progressBar = one('[data-progress-bar]');
  let currentStep = 1;
  let calculatorIndustry = 'medical';
  let calculatorSystemOverride = null;
  let lastCalculatorTrigger = null;

  const systemPresets = {
    silver: { industry: 'medical', requirements: ['antibacterial', 'impact'] },
    fire: { industry: 'industrial', requirements: ['fire'] },
    acoustic: { industry: 'education', requirements: ['acoustic'] },
    organic: { industry: 'hospitality', requirements: ['natural'] },
    protect: { industry: 'medical', requirements: ['impact'] },
    color: { industry: 'hospitality', requirements: [] },
  };

  const industryRequirements = {
    medical: ['antibacterial', 'impact'],
    education: ['acoustic'],
    hospitality: ['natural'],
    industrial: ['fire'],
  };

  function selectCalculatorIndustry(industry) {
    calculatorIndustry = recommendationData[industry] ? industry : 'medical';
    all('[data-calc-industry]').forEach((button) => {
      const selected = button.dataset.calcIndustry === calculatorIndustry;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-checked', String(selected));
    });
  }

  function selectRequirements(values) {
    const selectedValues = new Set(values);
    all('input[name="requirement"]', calculatorForm).forEach((input) => {
      input.checked = selectedValues.has(input.value);
    });
  }

  function resetCalculator(trigger) {
    calculatorForm?.reset();
    const requestedSystem = trigger?.dataset.calculatorSystem || null;
    const preset = requestedSystem ? systemPresets[requestedSystem] : null;
    const industry = trigger?.dataset.calculatorSource === 'finder' ? finderIndustry : preset?.industry || 'medical';

    calculatorSystemOverride = requestedSystem && systemData[requestedSystem] ? requestedSystem : null;
    selectCalculatorIndustry(industry);
    selectRequirements(preset?.requirements || industryRequirements[industry] || []);
    one('[data-lead-form]')?.setAttribute('hidden', '');
    one('[data-lead-success]')?.setAttribute('hidden', '');
    setStep(1);
    updateLiveArea();
  }

  function setStep(step, moveFocus = false) {
    currentStep = Math.max(1, Math.min(5, step));
    calculatorSteps.forEach((panel) => panel.classList.toggle('is-active', Number(panel.dataset.step) === currentStep));
    if (currentStepLabel) currentStepLabel.textContent = String(currentStep);
    if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(currentStep));
    if (progressBar) progressBar.style.width = `${currentStep * 20}%`;
    if (previousButton) previousButton.disabled = currentStep === 1;
    if (nextButton) nextButton.textContent = currentStep === 5 ? 'Закрыть' : 'Продолжить →';

    if (currentStep === 4) updateCalculatorRecommendation();
    if (currentStep === 5) updateCalculationResults();

    one('.calculator-body')?.scrollTo({ top: 0, behavior: 'smooth' });
    if (moveFocus && calculatorModal?.classList.contains('is-open')) {
      const heading = one('h3', calculatorSteps.find((panel) => Number(panel.dataset.step) === currentStep));
      if (heading) {
        heading.tabIndex = -1;
        heading.focus();
      }
    }
  }

  function openCalculator(event) {
    lastCalculatorTrigger = event?.currentTarget || document.activeElement;
    resetCalculator(event?.currentTarget);
    calculatorModal?.classList.add('is-open');
    calculatorModal?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    [header, one('main'), one('footer')].forEach((region) => {
      if (region) region.inert = true;
    });
    window.setTimeout(() => one('[data-close-calculator]')?.focus(), 30);
  }

  function closeCalculator() {
    calculatorModal?.classList.remove('is-open');
    calculatorModal?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    [header, one('main'), one('footer')].forEach((region) => {
      if (region) region.inert = false;
    });
    if (lastCalculatorTrigger instanceof HTMLElement) lastCalculatorTrigger.focus();
  }

  all('[data-open-calculator]').forEach((button) => button.addEventListener('click', openCalculator));
  all('[data-close-calculator]').forEach((button) => button.addEventListener('click', closeCalculator));

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (calculatorModal?.classList.contains('is-open')) {
      closeCalculator();
      return;
    }
    if (menu?.classList.contains('is-open')) {
      closeMenu(true);
    }
  });

  calculatorModal?.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = all(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]',
      calculatorModal,
    ).filter((element) => element.tabIndex !== -1 && element.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  all('[data-calc-industry]').forEach((button) => {
    button.addEventListener('click', () => {
      calculatorSystemOverride = null;
      selectCalculatorIndustry(button.dataset.calcIndustry);
      selectRequirements(industryRequirements[calculatorIndustry] || []);
    });
  });

  all('input[name="requirement"]', calculatorForm).forEach((input) => {
    input.addEventListener('change', () => {
      calculatorSystemOverride = null;
    });
  });

  function readDimensions() {
    const values = {};
    all('[data-dimension]').forEach((input) => {
      values[input.name] = Math.max(0, Number(input.value) || 0);
    });
    return values;
  }

  function calculateAreas() {
    const { length = 0, width = 0, height = 0, openings = 0 } = readDimensions();
    const netArea = Math.max(0, 2 * (length + width) * height - openings);
    const reserveArea = netArea * 1.07;
    const sheets = Math.ceil(reserveArea / 3.6);
    return { netArea, reserveArea, sheets };
  }

  const numberFormatter = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  function updateLiveArea() {
    const { netArea } = calculateAreas();
    const node = one('[data-net-area]');
    if (node) node.textContent = numberFormatter.format(netArea);
  }

  all('[data-dimension]').forEach((input) => input.addEventListener('input', updateLiveArea));

  function selectedRequirements() {
    return all('input[name="requirement"]:checked', calculatorForm).map((input) => input.value);
  }

  function chooseSystem() {
    if (calculatorSystemOverride && systemData[calculatorSystemOverride]) {
      return systemData[calculatorSystemOverride];
    }
    const requirements = selectedRequirements();
    if (requirements.includes('antibacterial')) return systemData.silver;
    if (requirements.includes('fire')) return systemData.fire;
    if (requirements.includes('acoustic')) return systemData.acoustic;
    if (requirements.includes('natural')) return systemData.organic;
    if (requirements.includes('impact')) return systemData.protect;

    if (calculatorIndustry === 'medical') return systemData.silver;
    if (calculatorIndustry === 'education') return systemData.acoustic;
    if (calculatorIndustry === 'hospitality') return systemData.organic;
    return systemData.fire;
  }

  function updateCalculatorRecommendation() {
    const system = chooseSystem();
    all('[data-calc-system-title]').forEach((node) => (node.textContent = system.title));
    all('[data-calc-system-title-secondary]').forEach((node) => (node.textContent = system.title));
    all('[data-calc-system-tag]').forEach((node) => (node.textContent = system.code));
    all('[data-calc-system-reason]').forEach((node) => (node.textContent = system.reason));
  }

  function updateCalculationResults() {
    const system = chooseSystem();
    const { netArea, reserveArea, sheets } = calculateAreas();
    const resultSystem = one('[data-result-system]');
    const resultNet = one('[data-result-net-area]');
    const resultReserve = one('[data-result-reserve-area]');
    const resultSheets = one('[data-result-sheets]');
    const minimumOrder = one('[data-minimum-order]');

    if (resultSystem) resultSystem.textContent = system.title;
    if (resultNet) resultNet.textContent = numberFormatter.format(netArea);
    if (resultReserve) resultReserve.textContent = numberFormatter.format(reserveArea);
    if (resultSheets) resultSheets.textContent = String(sheets);

    if (minimumOrder) {
      const met = sheets >= 50;
      minimumOrder.classList.toggle('is-met', met);
      minimumOrder.querySelector('span').textContent = met ? '✓' : '!';
      minimumOrder.querySelector('strong').textContent = met
        ? 'Минимальная партия выполнена'
        : `До минимальной партии не хватает ${50 - sheets} листов`;
      minimumOrder.querySelector('small').textContent = met
        ? 'На сайте компании указано условие от 50 листов.'
        : 'Инженер предложит объединение объёма или другой вариант комплектации.';
    }
  }

  function validateCurrentStep() {
    const activeStep = calculatorSteps.find((panel) => Number(panel.dataset.step) === currentStep);
    const invalidInput = activeStep ? all('input', activeStep).find((input) => !input.checkValidity()) : null;
    if (!invalidInput) return true;
    invalidInput.reportValidity();
    invalidInput.focus();
    return false;
  }

  previousButton?.addEventListener('click', () => setStep(currentStep - 1, true));
  nextButton?.addEventListener('click', () => {
    if (currentStep === 5) {
      closeCalculator();
      return;
    }
    if (!validateCurrentStep()) return;
    setStep(currentStep + 1, true);
  });

  one('[data-show-lead-form]')?.addEventListener('click', () => {
    const leadForm = one('[data-lead-form]');
    if (!leadForm) return;
    leadForm.hidden = false;
    leadForm.querySelector('input')?.focus();
  });

  one('[data-finish-lead]')?.addEventListener('click', () => {
    const leadForm = one('[data-lead-form]');
    const leadSuccess = one('[data-lead-success]');
    const invalidInput = leadForm ? all('input[required]', leadForm).find((input) => !input.value.trim()) : null;
    if (invalidInput) {
      invalidInput.setCustomValidity('Заполните это поле.');
      invalidInput.reportValidity();
      invalidInput.focus();
      invalidInput.addEventListener('input', () => invalidInput.setCustomValidity(''), { once: true });
      return;
    }
    if (leadForm) leadForm.hidden = true;
    if (leadSuccess) leadSuccess.hidden = false;
  });

  one('[data-download-summary]')?.addEventListener('click', () => {
    const system = chooseSystem();
    const { netArea, reserveArea, sheets } = calculateAreas();
    const lines = [
      'VIOLET — предварительное резюме расчёта',
      '',
      `Система: ${system.title}`,
      `Чистая площадь: ${numberFormatter.format(netArea)} м²`,
      `Площадь с запасом 7%: ${numberFormatter.format(reserveArea)} м²`,
      `Предварительное количество листов: ${sheets}`,
      '',
      'Расчёт демонстрационный. Инженер должен проверить раскладку, профили,',
      'запас, пожарные требования и нестандартные узлы.',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const downloadUrl = URL.createObjectURL(blob);
    link.href = downloadUrl;
    link.download = 'violet-preliminary-calculation.txt';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  });

  setStep(1);
  updateLiveArea();
})();
