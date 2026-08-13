/* ==========================================================================
   РАЗДЕЛ 1: КАТАЛОГ (АРЕНДА И ПОХОДЫ) И МОДАЛКА "ДЕТАЛЬНІШЕ"
   ========================================================================== */

// Храним ссылку на карточку, которая открыта в модалке прямо сейчас
let activeCardForModal = null;


/* --------------------------------------------------------------------------
   1.1. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ КАРТОЧКИ И МОДАЛКИ
   -------------------------------------------------------------------------- */

/**
 * Пересчитывает итоговую цену для конкретной карточки
 * @param {HTMLElement} card - DOM-элемент карточки (.product-card)
 */
function recalculateCardPrice(card) {
    if (!card) return;

    // Выбранная опция в дропдауне (время/тариф)
    const activeOption = card.querySelector('.dropdown-item.active') || card.querySelector('.dropdown-item');
    const unitPrice = Number(activeOption?.dataset.price || 0);

    // Количество
    const qtyValEl = card.querySelector('.card-qty-value');
    const qty = Number(qtyValEl?.textContent || 1);

    // Итого
    const total = unitPrice * qty;

    // Обновляем ценник
    const priceValEl = card.querySelector('.price-val');
    if (priceValEl) {
        priceValEl.textContent = total.toLocaleString('uk-UA');
    }
}

/**
 * Открывает модалку "Детальніше" и затягивает данные из карточки
 * @param {HTMLElement} card - DOM-элемент карточки (.product-card)
 */
window.openProductDetailsModal = function(card) {
    if (!card) return;

    const modal = document.getElementById('details-modal');
    if (!modal) {
        console.error("❌ Модалка #details-modal не найдена в DOM!");
        return;
    }

    activeCardForModal = card;

    // 1. Извлекаем данные с фоллбэками
    const imgEl = card.querySelector('.product-img-box img') || card.querySelector('img');
    const titleEl = card.querySelector('.product-name') || card.querySelector('h3, h2');
    const descEl = card.querySelector('.product-desc');
    const specsEl = card.querySelector('.product-specs');

    const imgSrc = imgEl?.getAttribute('src') || '';
    const imgAlt = imgEl?.getAttribute('alt') || 'Товар';
    const titleText = titleEl?.textContent.trim() || 'Без назви';
    const descText = descEl?.textContent.trim() || 'Опис відсутній.';
    const specsHtml = specsEl?.innerHTML || '';

    // 2. Вставляем в модалку
    const modalImg = document.getElementById('modal-product-img');
    const modalName = document.getElementById('modal-product-name');
    const modalDesc = document.getElementById('modal-product-desc');
    const modalSpecs = document.getElementById('modal-product-specs');

    if (modalImg) {
        modalImg.src = imgSrc;
        modalImg.alt = imgAlt;
    }
    if (modalName) modalName.textContent = titleText;
    if (modalDesc) modalDesc.textContent = descText;
    if (modalSpecs) modalSpecs.innerHTML = specsHtml;

    // 3. Открываем (добавляем оба класса для верности)
    modal.classList.add('open', 'active');
    document.body.style.overflow = 'hidden';
    console.log(`[Модалка] Открыты детали для: ${titleText}`);
};

/**
 * Закрывает модалку "Детальніше"
 */
window.closeProductDetailsModal = function() {
    const modal = document.getElementById('details-modal');
    if (modal) {
        modal.classList.remove('open', 'active');
        document.body.style.overflow = '';
        activeCardForModal = null;
    }
};


/* --------------------------------------------------------------------------
   1.2. ЕДИНЫЙ ДИСПЕТЧЕР СОБЫТИЙ (EVENT DELEGATION)
   -------------------------------------------------------------------------- */
document.addEventListener('click', function(e) {

    // --- A. ОТКРЫТИЕ / ЗАКРЫТИЕ КАСТОМНОГО ДРОПДАУНА ---
    const dropdownTrigger = e.target.closest('.dropdown-trigger');
    if (dropdownTrigger) {
        e.preventDefault();
        const dropdown = dropdownTrigger.closest('.custom-dropdown');
        
        document.querySelectorAll('.custom-dropdown.open').forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
        });

        dropdown.classList.toggle('open');
        return;
    }

    // Закрытие дропдаунов при клике в любую другую область
    if (!e.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.custom-dropdown.open').forEach(d => d.classList.remove('open'));
    }


    // --- B. ВЫБОР ОПЦИИ ИЗ ДРОПДАУНА ---
    const dropdownItem = e.target.closest('.dropdown-item');
    if (dropdownItem) {
        e.preventDefault();
        const dropdown = dropdownItem.closest('.custom-dropdown');
        const card = dropdownItem.closest('.product-card');

        dropdown.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('active'));
        dropdownItem.classList.add('active');

        const selectedTextEl = dropdown.querySelector('.dropdown-selected-text');
        if (selectedTextEl) {
            selectedTextEl.textContent = dropdownItem.textContent.trim();
        }

        dropdown.classList.remove('open');
        if (card) recalculateCardPrice(card);
        return;
    }


    // --- C. ИЗМЕНЕНИЕ КОЛИЧЕСТВА (- / +) ---
    const qtyBtn = e.target.closest('.card-qty-btn');
    if (qtyBtn) {
        e.preventDefault();
        const card = qtyBtn.closest('.product-card');
        const qtyValEl = card?.querySelector('.card-qty-value');

        if (qtyValEl) {
            let currentQty = Number(qtyValEl.textContent || 1);

            if (qtyBtn.classList.contains('minus')) {
                if (currentQty > 1) currentQty--;
            } else if (qtyBtn.classList.contains('plus')) {
                currentQty++;
            }

            qtyValEl.textContent = currentQty;
            if (card) recalculateCardPrice(card);
        }
        return;
    }


    // --- D. КНОПКА "ДЕТАЛЬНІШЕ" НА КАРТОЧКЕ ---
    const detailsBtn = e.target.closest('.details-btn');
    if (detailsBtn) {
        e.preventDefault();
        const card = detailsBtn.closest('.product-card');
        if (card) {
            window.openProductDetailsModal(card);
        }
        return;
    }

    // --- F. МОДАЛКА: ЗАКРЫТИЕ ПО КНОПКЕ "Х" ---
    if (e.target.closest('#btn-close-modal')) {
        e.preventDefault();
        window.closeProductDetailsModal();
        return;
    }


    // --- G. МОДАЛКА: ЗАКРЫТИЕ ПО КЛИКУ НА ОВЕРЛЕЙ ---
    if (e.target.id === 'details-overlay' || e.target.classList.contains('modal-overlay')) {
        e.preventDefault();
        window.closeProductDetailsModal();
        return;
    }


    // --- H. МОДАЛКА: КНОПКА "ЗАБРОНЮВАТИ" ВНУТРИ МОДАЛКИ ---
    if (e.target.closest('#modal-book-btn')) {
        e.preventDefault();

        if (activeCardForModal) {
            const realBookBtn = activeCardForModal.querySelector('.book-btn');
            if (realBookBtn) {
                realBookBtn.click(); // Жмем родную кнопку добавления на карточке
            }
        }

        window.closeProductDetailsModal();
        return;
    }
});


/* --------------------------------------------------------------------------
   1.3. ОБРАБОТКА КЛАВИШИ ESCAPE
   -------------------------------------------------------------------------- */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        window.closeProductDetailsModal();
    }
});