// ==========================================
// 1. ИНИЦИАЛИЗА И СОХРАНЕНИЕ В LOCALSTORAGE
// ==========================================
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('green_lounge_cart')) || [];
} catch (e) {
    cart = [];
}

function saveCart() {
    localStorage.setItem('green_lounge_cart', JSON.stringify(cart));
    renderCart();
    updateCartBadge();
}

function getPageType() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('pohody') || path.includes('tours') || path.includes('hikes')) {
        return 'tour';
    }
    return 'rental';
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartBadge();
});

// ==========================================
// 2. ОТКРЫТИЕ И ЗАКРЫТИЕ ШТОРКИ (DRAWER)
// ==========================================

function openDrawer() {
    const drawer = document.getElementById('booking-drawer');
    if (drawer) {
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden'; // Запрет скролла фона
    }

    goToDrawerStep(1);

    if (typeof renderCart === 'function') {
        renderCart();
    }
}

// ==========================================
// ГАРАНТИРОВАННОЕ ЗАКРЫТИЕ ШТОРКИ И РАЗБЛОКИРОВКА
// ==========================================
function closeDrawer() {
    document.body.style.removeProperty('overflow');
    document.body.style.overflow = 'auto';
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.overflow = 'auto';
    document.body.classList.remove('no-scroll', 'drawer-open', 'modal-open');

    // Добавили #cart-drawer и .drawer, чтобы точно гасить любые шторки
    document.querySelectorAll('#booking-drawer, #cart-drawer, .drawer, .drawer-overlay, #cart-overlay').forEach(el => {
        el.classList.remove('open', 'active');
    });

    console.log('Экран разблокирован');
}

// Делаем функцию глобальной
window.closeDrawer = closeDrawer;

// Автоматический перехват кликов по оверлею и ВСЕМ вариантам крестиков
document.addEventListener('click', function(e) {
    // e.target.closest проверяет сам элемент И его родителей
    const isCloseTrigger = e.target.closest('#btn-close-drawer, #close-cart-btn, .close-drawer-btn, .drawer-overlay, #cart-overlay');
    
    if (isCloseTrigger) {
        closeDrawer();
    }
});

// Закрытие по нажатию на клавишу ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDrawer();
    }
});

// ==========================================
// 3. БЕЙДЖ В НИЖНЕЙ ПАНЕЛИ (#cart-badge)
// ==========================================
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const navBtn = document.getElementById('nav-cart-btn');
    if (!badge) return;

    const totalCount = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

    if (totalCount > 0) {
        badge.textContent = totalCount;
        badge.style.display = 'flex';
        if (navBtn) navBtn.classList.add('active');
    } else {
        badge.style.display = 'none';
        if (navBtn) navBtn.classList.remove('active');
    }
}

// ==========================================
// 4. ОБРАБОТКА КАРТОЧЕК ТОВАРОВ
// ==========================================
function initProductCards() {
    document.querySelectorAll('.product-card').forEach((card, index) => {
        // 🛡 ЗАЩИТА: Если карточка уже была обработана, пропускаем ее
        if (card.dataset.initialized === 'true') return;
        card.dataset.initialized = 'true';

        const id = card.dataset.id || `product_${index}`;
        const titleEl = card.querySelector('.product-name');
        const title = titleEl ? titleEl.textContent.trim() : 'Позиція';

        const dropdown = card.querySelector('.custom-dropdown');
        const trigger = card.querySelector('.dropdown-trigger');
        const options = card.querySelectorAll('.dropdown-item');
        const qtyValEl = card.querySelector('.card-qty-value');
        const priceValEl = card.querySelector('.price-val');
        const minusBtn = card.querySelector('.card-qty-btn.minus');
        const plusBtn = card.querySelector('.card-qty-btn.plus');
        const bookBtn = card.querySelector('.book-btn');

        let unitPrice = 300;
        let selectedDurationText = '1 година';

        const activeItem = card.querySelector('.dropdown-item.active');
        if (activeItem) {
            unitPrice = parseFloat(activeItem.dataset.price) || 300;
            selectedDurationText = activeItem.textContent.trim();
        }

        function updateCardPrice() {
            const qty = parseInt(qtyValEl?.textContent || '1', 10) || 1;
            const total = unitPrice * qty;
            if (priceValEl) priceValEl.textContent = total;
        }

        if (trigger && dropdown) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.querySelectorAll('.custom-dropdown.open').forEach(d => {
                    if (d !== dropdown) d.classList.remove('open');
                });
                dropdown.classList.toggle('open');
            });

            options.forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    options.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');

                    unitPrice = parseFloat(opt.dataset.price) || 300;
                    selectedDurationText = opt.textContent.trim();

                    const selectedTextEl = card.querySelector('.dropdown-selected-text');
                    if (selectedTextEl) selectedTextEl.textContent = selectedDurationText;

                    dropdown.classList.remove('open');
                    updateCardPrice();
                });
            });
        }

        if (minusBtn && qtyValEl) {
            minusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                let currentQty = parseInt(qtyValEl.textContent, 10) || 1;
                if (currentQty > 1) {
                    qtyValEl.textContent = currentQty - 1;
                    updateCardPrice();
                }
            });
        }

        if (plusBtn && qtyValEl) {
            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                let currentQty = parseInt(qtyValEl.textContent, 10) || 1;
                qtyValEl.textContent = currentQty + 1;
                updateCardPrice();
            });
        }

        // Бронирование (теперь защищено от дублирования)
        if (bookBtn) {
            bookBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const qty = parseInt(qtyValEl?.textContent || '1', 10) || 1;
                const pageType = getPageType();
                const fullTitle = `${title} (${selectedDurationText})`;

                addToCart(id, fullTitle, unitPrice, pageType, qty);
            });
        }
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-dropdown.open').forEach(d => d.classList.remove('open'));
    });
}

// ==========================================
// 5. УПРАВЛЕНИЕ МАССИВОМ КОРЗИНЫ
// ==========================================
let isAddingToCart = false; // Защитный флаг от дублирования вызовов

function addToCart(id, title, price, type, qty = 1) {
    // 🛡 Если функция уже вызвана (прошло меньше 300мс), сбрасываем повторный клик
    if (isAddingToCart) {
        console.warn('⚠️ Заблокирован дублирующий вызов addToCart');
        return;
    }
    isAddingToCart = true;
    setTimeout(() => { isAddingToCart = false; }, 300);

    const validPrice = Number(price) || 0;
    const validQty = Number(qty) || 1;

    const existingIndex = cart.findIndex(item => item.id === id && item.title === title && item.type === type);

    if (existingIndex > -1) {
        cart[existingIndex].qty += validQty;
    } else {
        cart.push({
            id: id,
            title: title,
            price: validPrice,
            type: type,
            qty: validQty
        });
    }

    saveCart();
    openDrawer();
}

function removeFromCart(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        saveCart();
    }
}

function updateQty(index, delta) {
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
    }
}

// ==========================================
// 6. ОТРИСОВКА КОРЗИНЫ В ШТОРКЕ ( НА ДВУХ СТРАНИЦАХ )
// ==========================================
function renderCart() {
    const container = document.getElementById('cart-items-container') || document.getElementById('drawer-cart-items-container');
    const totalEl = document.getElementById('cart-grand-total') || document.getElementById('drawer-cart-grand-total');
    
    if (!container) return;

    if (!Array.isArray(cart) || cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 35px 10px; opacity: 0.6; font-weight: 600; color: inherit;">
                🛒 Ваша корзина пуста
            </div>`;
        if (totalEl) totalEl.textContent = '0';
        return;
    }

    let html = '';
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const itemPrice = Number(item.price) || 0;
        const itemQty = Number(item.qty) || 1;
        const itemTotal = itemPrice * itemQty;
        grandTotal += itemTotal;

        const isRental = item.type === 'rental';
        
        // 🎯 УМНАЯ ЕДИНИЦА ИЗМЕРЕНИЯ (Штуки для аренды, Люди для похода)
        const unitText = isRental ? 'шт.' : 'людина';
        
        // Универсальные бейджи с ярким градиентом и белым текстом
        const badgeText = isRental ? 'ОРЕНДА' : 'ПОХОДИ';
        const badgeBg = isRental 
            ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' 
            : 'linear-gradient(135deg, #059669 0%, #10b981 100%)';

        html += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; margin-bottom: 10px; border-radius: 12px; background: rgba(150, 150, 150, 0.08); border: 1px solid rgba(150, 150, 150, 0.18); backdrop-filter: blur(6px); transition: all 0.2s ease;">
                <div style="flex: 1; padding-right: 10px;">
                    <div style="font-weight: 700; color: inherit; font-size: 0.92rem; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span>${item.title}</span>
                        <span style="font-size: 0.65rem; font-weight: 800; background: ${badgeBg}; color: #ffffff; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.5px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
                            ${badgeText}
                        </span>
                    </div>
                    <!-- Заменили "шт." на динамическую переменную unitText -->
                    <div style="font-size: 0.8rem; opacity: 0.75; color: inherit; margin-top: 4px; font-weight: 500;">
                        ${itemPrice} грн / ${unitText}
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                    <!-- Кнопка "-" -->
                    <button type="button" onclick="updateQty(${index}, -1)" style="width: 28px; height: 28px; border: 1px solid rgba(150, 150, 150, 0.3); border-radius: 6px; background: rgba(150, 150, 150, 0.15); color: inherit; cursor: pointer; font-weight: bold; font-size: 0.9rem; display: flex; align-items: center; justify-content: center;">-</button>
                    
                    <!-- Количество -->
                    <span style="font-weight: 700; font-size: 0.95rem; min-width: 18px; text-align: center; color: inherit;">${itemQty}</span>
                    
                    <!-- Кнопка "+" -->
                    <button type="button" onclick="updateQty(${index}, 1)" style="width: 28px; height: 28px; border: 1px solid rgba(150, 150, 150, 0.3); border-radius: 6px; background: rgba(150, 150, 150, 0.15); color: inherit; cursor: pointer; font-weight: bold; font-size: 0.9rem; display: flex; align-items: center; justify-content: center;">+</button>
                    
                    <!-- Сумма за позицию -->
                    <span style="font-weight: 800; color: inherit; font-size: 0.95rem; min-width: 65px; text-align: right;">${itemTotal} грн</span>
                    
                    <!-- Кнопка удаления -->
                    <button type="button" onclick="removeFromCart(${index})" style="background: none; border: none; color: #ef4444; font-size: 1.3rem; cursor: pointer; padding: 0 4px; line-height: 1; opacity: 0.85;">&times;</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (totalEl) totalEl.textContent = grandTotal;

    // === АКТИВАЦИЯ / БЛОКИРОВКА КНОПКИ ОФОРМЛЕНИЯ ===
    const checkoutBtn = document.getElementById('btn-go-to-checkout');
    if (checkoutBtn) {
        if (cart.length > 0) {
            checkoutBtn.removeAttribute('disabled');
            checkoutBtn.disabled = false;
            checkoutBtn.style.setProperty('background', 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 'important');
            checkoutBtn.style.setProperty('color', '#ffffff', 'important');
            checkoutBtn.style.setProperty('box-shadow', '0 4px 14px rgba(37, 99, 235, 0.35)', 'important');
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
            checkoutBtn.style.pointerEvents = 'auto';
        } else {
            checkoutBtn.setAttribute('disabled', 'true');
            checkoutBtn.disabled = true;
            checkoutBtn.style.setProperty('background', 'rgba(150, 150, 150, 0.2)', 'important');
            checkoutBtn.style.setProperty('color', 'rgba(150, 150, 150, 0.6)', 'important');
            checkoutBtn.style.setProperty('box-shadow', 'none', 'important');
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.cursor = 'not-allowed';
            checkoutBtn.style.pointerEvents = 'none';
        }
    }

    if (typeof checkTourQuestionsVisibility === 'function') {
        checkTourQuestionsVisibility();
    }
}

// ==========================================
// УНИВЕРСАЛЬНАЯ ПРОВЕРКА КОРЗИНЫ И ДАТ
// ==========================================
function updateCheckoutFormByCart() {
    try {
        const tourSelect = document.getElementById('checkout-tour-date');
        if (!tourSelect) return;

        if (!Array.isArray(cart) || cart.length === 0) return;

        // 1. Ищем поход в корзине
        const tourInCart = cart.find(item => {
            if (!item) return false;
            const itemType = String(item.type || '').toLowerCase();
            return itemType === 'tour' || 
                   itemType === 'походи' || 
                   itemType === 'похід' ||
                   (typeof toursData !== 'undefined' && toursData[item.id]);
        });

        if (!tourInCart) {
            console.log('ℹ️ В корзине нет похода — селект дат не заполняем');
            return;
        }

        console.log('🎯 Поход найден в корзине:', tourInCart);

        // 2. Определяем точный ключ в toursData
        let tourKey = tourInCart.id;

        if (typeof toursData !== 'undefined' && !toursData[tourKey]) {
            // Фоллбек: если ID не совпал, ищем по очищенному названию без эмодзи
            const cleanCartTitle = String(tourInCart.title || '').replace(/[^\w\sа-яА-ЯєЄіІїЇґҐ]/gi, '').toLowerCase().trim();

            const matchedKey = Object.keys(toursData).find(key => {
                const cleanDataTitle = String(toursData[key].title || '').replace(/[^\w\sа-яА-ЯєЄіІїЇґҐ]/gi, '').toLowerCase().trim();
                return cleanDataTitle && cleanCartTitle && (cleanDataTitle.includes(cleanCartTitle) || cleanCartTitle.includes(cleanDataTitle));
            });

            if (matchedKey) tourKey = matchedKey;
        }

        // 3. Заполняем даты
        const tourData = typeof toursData !== 'undefined' ? toursData[tourKey] : null;

        if (typeof populateTourDates === 'function') {
            populateTourDates(tourKey);
            console.log('✅ Вызвана populateTourDates для ключа:', tourKey);
        } else if (tourData && Array.isArray(tourData.dates)) {
            // Прямой фоллбек на случай если populateTourDates не объявлена
            tourSelect.innerHTML = '<option value="">Оберіть дату заходу</option>';
            tourData.dates.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = d;
                tourSelect.appendChild(opt);
            });
            console.log('🚀 Даты подставлены напрямую из toursData!');
        }

    } catch (err) {
        console.error('⚠️ Ошибка при авто-обновлении дат:', err);
    }
}

// ==========================================
// ЕДИНЫЙ ПЕРЕКЛЮЧАТЕЛЬ ШАГОВ КОРЗИНЫ
// ==========================================
window.goToDrawerStep = function(step, e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    // 🛡️ Блок: Не пускаем дальше Шага 1, если корзина пустая
    if (step > 1 && (!Array.isArray(cart) || cart.length === 0)) {
        console.warn('⛔ Корзина пуста! Переход заблокирован.');
        return false;
    }

    // 🚀 Обновляем даты для походов, защитив вызов от падений
    if (step === 2) {
        updateCheckoutFormByCart();
    }

    const s1 = document.getElementById('drawer-step-cart');
    const s2 = document.getElementById('drawer-step-checkout');
    const s3 = document.getElementById('drawer-step-3');

    // Собираем существующие шаги
    const steps = [s1, s2, s3].filter(Boolean);

    if (steps.length === 0) {
        console.error('❌ Ошибка: Не найдены блоки шагов! Проверь id в HTML (#drawer-step-cart, #drawer-step-checkout).');
        return false;
    }

    // Жестко скрываем все шаги
    steps.forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
    });

    // Включаем и жестко показываем нужный шаг
    let target = step === 1 ? s1 : (step === 2 ? s2 : s3);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
        target.scrollTop = 0;
    }

    return false;
};

// ==========================================
// 7. ЛОГИКА ДАТ И СЛОТОВ ВРЕМЕНИ (GLOBAL FIX)
// ==========================================
function initDateTimeValidation() {
    const rentalDateInput = document.getElementById('checkout-rental-date');
    const hiddenTimeInput = document.getElementById('checkout-rental-time');

    function getLocalTodayStr() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    if (rentalDateInput) {
        const todayStr = getLocalTodayStr();
        rentalDateInput.setAttribute('min', todayStr);
        if (!rentalDateInput.value) rentalDateInput.value = todayStr;

        rentalDateInput.addEventListener('change', updateTimeSlots);
        rentalDateInput.addEventListener('input', updateTimeSlots);
    }

    // Проверка и блокировка прошедших слотов
    function updateTimeSlots() {
        if (!rentalDateInput) return;

        const selectedDate = rentalDateInput.value;
        const now = new Date();
        const todayStr = getLocalTodayStr();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        const timeSlotBtns = document.querySelectorAll('.time-slot-btn');

        timeSlotBtns.forEach(btn => {
            const timeText = btn.textContent.trim();
            const [slotH, slotM] = timeText.split(':').map(Number);

            let isPast = false;

            if (selectedDate === todayStr) {
                if (slotH < currentHours || (slotH === currentHours && slotM <= currentMinutes)) {
                    isPast = true;
                }
            } else if (selectedDate < todayStr && selectedDate !== '') {
                isPast = true;
            }

            if (isPast) {
                btn.disabled = true;
                btn.setAttribute('disabled', 'disabled');
                btn.classList.add('slot-disabled');
                btn.classList.remove('active-slot', 'active', 'selected');

                if (hiddenTimeInput && hiddenTimeInput.value === timeText) {
                    hiddenTimeInput.value = '';
                }
            } else {
                btn.disabled = false;
                btn.removeAttribute('disabled');
                btn.classList.remove('slot-disabled');
            }
        });
    }

    // ==========================================
    // БРОНЕБОЙНЫЙ СБРОС И ВЫБОР ВРЕМЕНИ (TOGGLE)
    // ==========================================
    if (!window.__timeSlotsClickBound) {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.time-slot-btn');
            
            // ЖЕСТКИЙ ФИЛЬТР: Если кнопки нет, она заблокирована или со статусом slot-disabled — ИГНОРИРУЕМ КЛИК
            if (!btn || btn.disabled || btn.hasAttribute('disabled') || btn.classList.contains('slot-disabled')) {
                return;
            }

            // Глушим сторонние скрипты
            e.preventDefault();
            e.stopImmediatePropagation();

            const hiddenInput = document.getElementById('checkout-rental-time');
            
            const isSelected = btn.classList.contains('active-slot') || 
                               btn.classList.contains('active') || 
                               btn.classList.contains('selected');

            // 1. Снимаем выделение со всех слотов
            document.querySelectorAll('.time-slot-btn').forEach(b => {
                b.classList.remove('active-slot', 'active', 'selected');
            });

            if (isSelected) {
                // 2. Если повторный клик — очищаем значение
                if (hiddenInput) hiddenInput.value = '';
            } else {
                // 3. Если новый выбор — подсвечиваем и сохраняем время
                btn.classList.add('active-slot', 'active');
                if (hiddenInput) hiddenInput.value = btn.textContent.trim();
            }
        }, true);

        window.__timeSlotsClickBound = true;
    }

    // ОБЯЗАТЕЛЬНЫЙ ВЫЗОВ ПРОВЕРКИ ПРИ СТАРТЕ
    updateTimeSlots();
    window.updateTimeSlots = updateTimeSlots;
}

// ------------------------------------------
// АВТОЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ И СТРАНИЧНЫХ СОБЫТИЯХ
// ------------------------------------------
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDateTimeValidation);
} else {
    initDateTimeValidation();
}

// ==========================================
// ГЛОБАЛЬНЫЙ ПЕРЕХВАТ КЛИКОВ ПО СЛОТАМ
// ==========================================
// Вешаем один раз на весь документ — работает даже при динамической смене HTML
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.time-slot-btn');
    
    // Если кликнули не по кнопке слота — пролетаем мимо
    if (!btn) return;

    console.log('👉 Клик зафиксирован по кнопке:', btn.textContent.trim());

    // Если кнопка заблокирована — ничего не делаем
    if (btn.disabled || btn.classList.contains('slot-disabled')) {
        console.warn('⚠️ Слот заблокирован по времени');
        return;
    }

    e.preventDefault();

    // 1. Снимаем класс со ВСЕХ кнопок на странице
    document.querySelectorAll('.time-slot-btn').forEach(b => {
        b.classList.remove('active-slot');
        b.removeAttribute('style'); // Чистим инлайн-стили
    });

    // 2. Ставим класс на нажатую
    btn.classList.add('active-slot');

    // 3. Пишем значение в скрытый инпут
    const hiddenInput = document.getElementById('checkout-rental-time');
    if (hiddenInput) {
        hiddenInput.value = btn.textContent.trim();
        console.log('✅ В hidden-инпут записано:', hiddenInput.value);
    }
});

// ==========================================
// 8. СТАРТ И ПРИВЯЗКА СОБЫТИЙ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initProductCards();
    initDateTimeValidation();
    renderCart();
    updateCartBadge();

    // Открытие по кнопке "Кошик" снизу
    const navCartBtn = document.getElementById('nav-cart-btn');
    if (navCartBtn) {
        navCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openDrawer();
        });
    }

    initCheckoutForm();
});

// ==========================================
// 9. ПЕРЕКЛЮЧЕНИЕ ШТОРКИ (ПРЯМАЯ ЛОГИКА)
// ==========================================

// 1. Прямая функция для Шага 3 (Твой 100% рабочий код из консоли)
window.openStep3Directly = function() {
    console.log('🚀 Переход на Шаг 3!');

    // Закрываем модалку
    const modal = document.getElementById('check-order-modal');
    if (modal) modal.style.setProperty('display', 'none', 'important');

    // ТВОЯ СТРОЧКА ИЗ КОНСОЛИ
    document.querySelectorAll('#drawer-step-cart, #drawer-step-checkout').forEach(el => el.style.setProperty('display', 'none', 'important'));
    const s3 = document.getElementById('drawer-step-3');
    if (s3) s3.style.setProperty('display', 'block', 'important');
    if (typeof initPaymentCalculations === 'function') initPaymentCalculations();
};

// 3. Страховка на клик по кнопке в модалке
document.addEventListener('click', function(e) {
    const confirmBtn = e.target.closest('#check-confirm-btn');
    if (confirmBtn) {
        e.preventDefault();
        e.stopPropagation();
        window.openStep3Directly();
    }
}, true);

// ==========================================
// 10. УМНАЯ ПОДСТРОЙКА ПОЛЕЙ ПОД ТИП ЗАКAЗА
// ==========================================
function adjustCheckoutFieldsByCart() {
    const hasRental = cart.some(item => item.type === 'rental');
    const hasTour = cart.some(item => item.type === 'tour');

    const rentalBlock = document.querySelector('.booking-calendar-card > div:nth-child(2)');
    const tourBlock = document.querySelector('.booking-calendar-card > div:nth-child(3)');

    // Если в корзине только аренда — скрываем блок туров
    if (rentalBlock && tourBlock) {
        if (hasRental && !hasTour) {
            rentalBlock.style.display = 'block';
            tourBlock.style.display = 'none';
        } else if (hasTour && !hasRental) {
            rentalBlock.style.display = 'none';
            tourBlock.style.display = 'block';
        } else {
            rentalBlock.style.display = 'block';
            tourBlock.style.display = 'block';
        }
    }
}

// ==========================================
// 11. МАСКА ТЕЛЕФОНА И ИНИЦИАЛИЗА ФОРМЫ
// ==========================================
function initCheckoutForm() {
    const phoneInput = document.getElementById('user-phone');
    const form = document.getElementById('booking-checkout-form');

    // Маска и страховка от удаления префикса +380
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let val = e.target.value;
            if (!val.startsWith('+380')) {
                e.target.value = '+380';
            }
        });
    }

    // Обработка отправки формы (Переход к оплате)
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('user-name')?.value.trim();
            const phone = document.getElementById('user-phone')?.value.trim();
            const rentalDate = document.getElementById('checkout-rental-date')?.value;
            const rentalTime = document.getElementById('checkout-rental-time')?.value;
            const tourDate = document.getElementById('checkout-tour-date')?.value;

            const hasRental = cart.some(item => item.type === 'rental');

            // Валидация времени для самостоятельной аренды
            if (hasRental && !rentalTime) {
                alert('Будь ласка, оберіть час старту для оренды!');
                return;
            }

            // Собираем итоговый объект заказа
            const orderData = {
                customer: { name, phone },
                bookingDetails: {
                    rentalDate: rentalDate || null,
                    rentalTime: rentalTime || null,
                    tourDate: tourDate || null
                },
                items: cart,
                totalAmount: cart.reduce((sum, i) => sum + (i.price * i.qty), 0)
            };

            console.log('🚀 Заказ сформирован и готов к оплате/n8n:', orderData);

            // Сохраняем в localStorage для шага оплаты
            localStorage.setItem('green_lounge_pending_order', JSON.stringify(orderData));

            // Тут вызываем переход на шаг 3 (Оплата) или функцию отправки
            // goToDrawerStep(3);
            alert('Дані збережено! Переходимо до оплати...');
        });
    }
}

// ==========================================
// 12. МОДАЛКА ПРОВЕРКИ ДАННЫХ ПЕРЕД ОПЛАТОЙ ((CATALOG))
// ==========================================

// --- 1. ЕДИНАЯ ФУНКЦИЯ ПРОВЕРКИ ТИПА ТОВАРА ---
function isHikeItem(item) {
    if (!item) return false;
    const type = String(item.type || item.category || '').toLowerCase();
    const title = String(item.title || item.name || '').toLowerCase();
    
    return type === 'tour' || type === 'hike' || item.isHike || item.is_hike ||
           type.includes('tour') || type.includes('hike') || type.includes('pohod') ||
           title.includes('похід') || title.includes('поход') || title.includes('тур') || title.includes('сплав');
}

// --- 2. ЭКРАНИРОВАНИЕ HTML СТРОК ---
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text || '';
    return div.innerHTML;
}

// --- 3. МОДАЛКА ПРОВЕРКИ ЗАКАЗА (SAFE VERSION) ---
function openCheckOrderModal() {
    // Безопасные хелперы (чтобы скрипт не падал, если функций нет в глобале)
    const safeSync = () => {
        if (typeof syncCartDateFields === 'function') {
            try { syncCartDateFields(); } catch(e) { console.warn('syncCartDateFields error:', e); }
        }
    };

    const safeIsHike = (item) => {
        if (typeof isHikeItem === 'function') return isHikeItem(item);
        const title = (item.title || item.name || '').toLowerCase();
        return title.includes('похід') || item.type === 'hike';
    };

    const safeEscape = (str) => {
        if (typeof escapeHtml === 'function') return escapeHtml(str);
        if (!str) return '';
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // 0. Синхронизируем поля
    safeSync();

    // 1. Проверяем контакты
    const nameInput = document.getElementById('user-name') || document.getElementById('checkout-name') || document.getElementById('checkout-fullname');
    const phoneInput = document.getElementById('user-phone') || document.getElementById('checkout-phone');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (!name) {
        alert('Будь ласка, вкажіть ваше ім\'я');
        if (nameInput) nameInput.focus();
        return;
    }
    
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone || cleanPhone.length < 10) {
        alert('Будь ласка, вкажіть коректний номер телефону');
        if (phoneInput) phoneInput.focus();
        return;
    }

    // 2. Достаем корзину
    const currentCart = (typeof cart !== 'undefined' && Array.isArray(cart)) ? cart : (window.cart || []);

    if (!currentCart || currentCart.length === 0) {
        alert('Ваш кошик порожній!');
        return;
    }

    // 3. Определяем состав корзины через безопасный хелпер
    const hasHike = currentCart.some(item => safeIsHike(item));
    const hasRental = currentCart.some(item => !safeIsHike(item));

    console.log('🔍 Проверка состава корзины:', { hasHike, hasRental, currentCart });

    // 4. Элементы ввода дат
    const rentalDateInput = document.getElementById('checkout-rental-date');
    const rentalTimeInput = document.getElementById('checkout-rental-time');
    
    const hikeDateSelect = document.getElementById('checkout-tour-date') || 
                           document.getElementById('checkout-hike-date') || 
                           document.querySelector('.hike-date-select');

    let fullDateTimeString = '';

    // 5. УМНАЯ ВАЛИДАЦИЯ И СБОРКА СТРОКИ ДАТЫ/ВРЕМЕНИ
    if (hasHike && !hasRental) {
        const hikeDate = hikeDateSelect ? hikeDateSelect.value : '';
        if (!hikeDate) {
            alert('Будь ласка, оберіть дату заходу (походу)');
            if (hikeDateSelect) hikeDateSelect.focus();
            return;
        }
        fullDateTimeString = `Похід: ${hikeDate}`;
    } 
    else {
        const rentalDate = rentalDateInput ? rentalDateInput.value : '';
        const rentalTime = rentalTimeInput ? rentalTimeInput.value : '';

        if (!rentalDate) {
            alert('Будь ласка, оберіть дату оренди');
            if (rentalDateInput) rentalDateInput.focus();
            return;
        }

        if (!rentalTime) {
            alert('Будь ласка, оберіть час оренди');
            if (rentalTimeInput) rentalTimeInput.focus();
            return;
        }

        const formattedRentalDate = rentalDate.split('-').reverse().join('.');
        
        let dateParts = [];
        dateParts.push(`Оренда: ${formattedRentalDate} (${rentalTime})`);

        if (hasHike) {
            const hikeDate = hikeDateSelect ? hikeDateSelect.value : '';
            if (!hikeDate) {
                alert('Будь ласка, оберіть дату походу');
                if (hikeDateSelect) hikeDateSelect.focus();
                return;
            }
            dateParts.push(`Похід: ${hikeDate}`);
        }

        fullDateTimeString = dateParts.join(' | ');
    }

    // 6. Формирование списка товаров (УНИВЕРСАЛЬНЫЙ АДАПТИВНЫЙ СТИЛЬ)
    const cartItemsHtml = (currentCart || []).map(item => {
        const itemTitle = item.title || item.name || 'Послуга';
        const itemQty = Number(item.qty || item.quantity || item.count || 1);
        
        // Безопасный парсинг цены
        const rawPrice = parseFloat(String(item.price || 0).replace(/[^\d.]/g, ''));
        const itemPrice = rawPrice ? `${rawPrice * itemQty} грн` : '';

        return `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; color: inherit; padding: 4px 0;">
                <span style="font-weight: 500; line-height: 1.3; color: inherit; opacity: 0.9;">
                    • ${safeEscape(itemTitle)} ${itemQty > 1 ? `<b style="color: #2563eb; background: rgba(37, 99, 235, 0.12); padding: 1px 6px; border-radius: 6px; font-size: 0.78rem; margin-left: 4px;">×${itemQty}</b>` : ''}
                </span>
                <span style="font-weight: 800; color: inherit; margin-left: 8px; white-space: nowrap;">${itemPrice}</span>
            </div>
        `;
    }).join('');

    // 7. Итоговые суммы
    const totalPriceEl = document.getElementById('checkout-total-price') || document.querySelector('.total-price-val');
    const depositPriceEl = document.getElementById('checkout-deposit-price') || document.querySelector('.deposit-price-val');

    const totalPrice = totalPriceEl ? totalPriceEl.textContent.trim() : '';
    const depositPrice = depositPriceEl ? depositPriceEl.textContent.trim() : '';

    const hasTotal = totalPrice && totalPrice !== '0' && totalPrice !== '0 грн';
    const hasDeposit = depositPrice && depositPrice !== '0' && depositPrice !== '0 грн';

    // 8. Заполнение финального окна (УНИВЕРСАЛЬНЫЙ СТИЛЬ ДЛЯ СВЕТЛОЙ И ТЕМНОЙ ТЕМЫ)
    const detailsContainer = document.getElementById('check-order-details');
    if (detailsContainer) {
        detailsContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(150, 150, 150, 0.2); padding-bottom:10px;">
                <span style="opacity:0.7; color:inherit; font-size:0.85rem;">Ім'я:</span>
                <span style="font-weight:700; color:inherit;">${safeEscape(name)}</span>
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(150, 150, 150, 0.2); padding-bottom:10px;">
                <span style="opacity:0.7; color:inherit; font-size:0.85rem;">Телефон:</span>
                <span style="font-weight:700; color:inherit;">${safeEscape(phone)}</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(150, 150, 150, 0.2); padding-bottom:10px;">
                <span style="opacity:0.7; color:inherit; font-size:0.85rem;">Дата та час:</span>
                <span style="font-weight:700; color:#0284c7; background:rgba(2, 132, 199, 0.12); border:1px solid rgba(2, 132, 199, 0.25); padding:3px 10px; border-radius:8px; font-size:0.82rem;">${fullDateTimeString}</span>
            </div>

            <div style="margin-top:8px; padding:12px; background:rgba(150, 150, 150, 0.08); border-radius:14px; border:1px solid rgba(150, 150, 150, 0.18); backdrop-filter:blur(8px);">
                <div style="font-size:0.75rem; font-weight:800; opacity:0.7; color:inherit; text-transform:uppercase; margin-bottom:8px; letter-spacing:0.5px;">Ваше замовлення:</div>
                <div style="display:flex; flex-direction:column; gap:4px;">
                    ${cartItemsHtml || '<span style="opacity:0.5; color:inherit; font-size:0.82rem;">Список порожній</span>'}
                </div>
            </div>

            ${hasTotal ? `
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(150, 150, 150, 0.2); padding-top:10px; margin-top:8px;">
                <span style="opacity:0.7; color:inherit; font-size:0.85rem;">Загальна вартість:</span>
                <span style="font-weight:800; color:inherit; font-size:1.1rem;">${totalPrice}</span>
            </div>
            ` : ''}

            ${hasDeposit ? `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(16, 185, 129, 0.12); padding:10px 12px; border-radius:12px; border:1px solid rgba(16, 185, 129, 0.28); margin-top:8px;">
                <span style="color:#059669; font-size:0.85rem; font-weight:700;">Передплата до сплати:</span>
                <span style="font-weight:800; color:#059669; font-size:1.1rem;">${depositPrice}</span>
            </div>
            ` : ''}
        `;
    } else {
        console.warn('⚠️ Елемент #check-order-details не знайдено!');
    }

    // 9. Открываем модалку
    const modal = document.getElementById('check-order-modal');
    if (modal) {
        modal.style.display = 'flex';
        console.log('✅ Модалка успешно открыта!');
    } else {
        console.error('❌ Ошибка: модалка #check-order-modal не найдена в DOM!');
        alert('Помилка: не знайдено вікно підтвердження (#check-order-modal)');
    }
}

// Делаем функцию доступной глобально
window.openCheckOrderModal = openCheckOrderModal;

// --- 4. ФУНКЦИЯ СКРЫТИЯ/ПОКАЗА И СБРОСА БЛОКОВ ---
function syncCartDateFields() {
    // Достаем корзину отовсюду (массив cart, window.cart или localStorage)
    let currentCart = (typeof cart !== 'undefined' && Array.isArray(cart)) ? cart : (window.cart || []);
    
    // Страховка: если массив пуст, пробуем прочитать из localStorage
    if ((!currentCart || currentCart.length === 0) && localStorage.getItem('cart')) {
        try {
            currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        } catch (e) {}
    }

    const hasHikes = currentCart.some(item => isHikeItem(item));
    const hasRentals = currentCart.some(item => !isHikeItem(item));

    const rentalDateInput = document.getElementById('checkout-rental-date');
    const rentalTimeInput = document.getElementById('checkout-rental-time');
    const tourDateSelect = document.getElementById('checkout-tour-date') || document.getElementById('checkout-hike-date');

    // Умный поиск контейнеров
    const rentalBlock = document.getElementById('rental-section-block') || 
                        (rentalDateInput ? (rentalDateInput.closest('#rental-section-block') || rentalDateInput.parentElement.parentElement) : null);
                        
    const tourBlock = document.getElementById('tour-section-block') || 
                      (tourDateSelect ? (tourDateSelect.closest('#tour-section-block') || tourDateSelect.parentElement.parentElement) : null);

    // --- БЛОК ОРЕНДЫ ---
    if (rentalBlock) {
        if (!hasRentals) {
            rentalBlock.style.display = 'none';
            if (rentalDateInput) rentalDateInput.value = '';
            if (rentalTimeInput) rentalTimeInput.value = '';
            document.querySelectorAll('.time-slot-btn').forEach(btn => btn.classList.remove('active'));
        } else {
            rentalBlock.style.display = 'block';
        }
    }

    // --- БЛОК ПОХОДОВ / ТУРОВ ---
    if (tourBlock) {
        if (!hasHikes) {
            tourBlock.style.display = 'none';
            if (tourDateSelect) tourDateSelect.value = '';
        } else {
            tourBlock.style.display = 'block';
        }
    }
}

// Глобальный доступ к функциям
window.syncCartDateFields = syncCartDateFields;
window.openCheckOrderModal = openCheckOrderModal;

// --- 5. АВТО-ЗАПУСК И РЕАКТИВНАЯ СИНХРОНИЗАЦИЯ (БЕЗ F5) ---

// Каскадная проверка: стреляем 3 раза, чтобы точно поймать момент записи в корзину
function triggerCartSync() {
    syncCartDateFields();
    setTimeout(syncCartDateFields, 50);
    setTimeout(syncCartDateFields, 250);
    setTimeout(syncCartDateFields, 600);
}

document.addEventListener('DOMContentLoaded', function() {
    const rentalDateInput = document.getElementById('checkout-rental-date');
    if (rentalDateInput) {
        rentalDateInput.value = '';
    }

    triggerCartSync();
});

// Слушатель событий клика по любым кнопкам корзины и товаров
document.addEventListener('click', function(e) {
    const isCartInteraction = e.target.closest('.cart-remove') || 
                              e.target.closest('.remove-item') || 
                              e.target.closest('.delete-btn') ||
                              e.target.closest('.cart-qty-btn') ||
                              e.target.closest('.btn-add-to-cart') ||
                              e.target.closest('.add-to-cart') ||
                              e.target.closest('#btn-open-check-modal') ||
                              e.target.closest('[data-action]');

    if (isCartInteraction) {
        triggerCartSync();
    }
});

// ==========================================
// ВПОМОГАТЕЛЬНЫЕ ФУНКЦИИ РАСЧЕТА
// ==========================================

function roundTo50(num) {
    return Math.round(num / 50) * 50;
}

function calculatePaymentAmounts(total) {
    if (total <= 0) return { prepayAmount: 0, restAmount: 0 };
    
    // 1. Считаем 70% и округляем до ровной суммы для локации
    const rawRest = total * 0.70;
    let restAmount = roundTo50(rawRest);
    
    // Страховка от переполнения
    if (restAmount >= total) restAmount = total - 50;
    
    // 2. Предоплата — точный остаток от полной цены
    const prepayAmount = total - restAmount;
    
    return { prepayAmount, restAmount };
}

// ==========================================
// ПЕРЕХОД СО ШАГА 2 НА ШАГ 3 (С РАСЧЕТОМ ПРЕДОПЛАТЫ)
// ==========================================

document.addEventListener('click', function(e) {
    const btn = e.target.closest('#btn-show-requisites');
    if (!btn) return;

    e.preventDefault();

    // Всю валидацию, проверку дат, корзины и вывод алертов делает openCheckOrderModal
    if (typeof openCheckOrderModal === 'function') {
        openCheckOrderModal();
    }
});

// ==========================================
// 13. ЛОГИКА ШАГА ОПЛАТЫ И ПРЕДОПЛАТЫ
// ==========================================

// Функция инициализации расчетов при переходе на шаг 3
function initPaymentCalculations() {
    // 1. Считаем общую сумму из твоего массива cart
    const currentCart = (typeof cart !== 'undefined' && Array.isArray(cart)) ? cart : (window.cart || []);
    
    let totalFullPrice = 0;
    currentCart.forEach(item => {
        const itemQty = item.qty || item.quantity || item.count || 1;
        const itemPrice = item.price || 0;
        totalFullPrice += itemPrice * itemQty;
    });

    // Если корзина пуста через массив, пробуем вытащить из DOM
    if (totalFullPrice === 0) {
        const totalPriceEl = document.getElementById('checkout-total-price') || document.querySelector('.total-price-val');
        if (totalPriceEl) {
            totalFullPrice = parseInt(totalPriceEl.textContent.replace(/\D/g, '')) || 0;
        }
    }

    // 2. Считаем с ровным остатком на локации
    const { prepayAmount, restAmount } = calculatePaymentAmounts(totalFullPrice);

    // 3. Заполняем элементы в HTML Шага 3
    const elTotal = document.getElementById('payment-total-full');
    const elPrepay = document.getElementById('payment-prepay-amount');
    const elRest = document.getElementById('payment-rest-amount');

    if (elTotal) elTotal.textContent = `${totalFullPrice} грн`;
    if (elPrepay) elPrepay.textContent = `${prepayAmount} грн`;
    if (elRest) elRest.textContent = `${restAmount} грн`;
}

// 4. Логика копирования реквизитов (IBAN, ЕДРПОУ, Назначение) по клику
document.addEventListener('click', function(e) {
    const copyCard = e.target.closest('.copy-card');
    if (!copyCard) return;

    const targetId = copyCard.getAttribute('data-copy-target');
    const targetEl = document.getElementById(targetId);
    
    if (targetEl) {
        const textToCopy = targetEl.textContent.trim();
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalBg = copyCard.style.background;
            copyCard.style.background = '#f0fdf4';
            copyCard.style.borderColor = '#22c55e';
            
            const icon = copyCard.querySelector('.copy-icon');
            if (icon) {
                icon.className = 'fa-solid fa-check';
                icon.style.color = '#22c55e';
            }

            setTimeout(() => {
                copyCard.style.background = originalBg;
                copyCard.style.borderColor = '';
                if (icon) {
                    icon.className = 'fa-regular fa-copy';
                    icon.style.color = '';
                }
            }, 600);
        }).catch(err => {
            console.error('Помилка копіювання: ', err);
        });
    }
});

// 5. Интерактив загрузки и превью чека
const uploadZone = document.getElementById('upload-zone');
const receiptFileInput = document.getElementById('receipt-file-input');
const uploadIdleState = document.getElementById('upload-idle-state');
const uploadPreviewState = document.getElementById('upload-preview-state');
const receiptPreviewImg = document.getElementById('receipt-preview-img');

if (uploadZone && receiptFileInput) {
    uploadZone.addEventListener('click', () => {
        receiptFileInput.click();
    });

    receiptFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                if (receiptPreviewImg) {
                    receiptPreviewImg.src = event.target.result;
                }
                if (uploadIdleState) uploadIdleState.style.display = 'none';
                if (uploadPreviewState) uploadPreviewState.style.display = 'block';
                if (uploadZone) {
                    uploadZone.style.borderColor = '#22c55e';
                    uploadZone.style.background = '#f0fdf4';
                }
            }
            reader.readAsDataURL(file);
        }
    });
}

// 6. Обработка и отправка брони на Webhook n8n
const N8N_WEBHOOK_URL = 'https://tiktiok.xyz/webhook/219a97d0-2e45-4479-947d-08702f215d52';
const btnSubmitFinal = document.getElementById('btn-submit-final-booking');

if (btnSubmitFinal) {
    btnSubmitFinal.addEventListener('click', async function(e) {
        // 1. Отменяем стандартный submit формы (если кнопка внутри <form>)
        if (e) e.preventDefault();

        // 2. Безопасно находим инпут файла чек-оплаты
        const receiptFileInput = document.getElementById('receipt-file-input') 
                              || document.getElementById('receipt-file') 
                              || document.querySelector('input[type="file"]');
        
        const file = receiptFileInput && receiptFileInput.files ? receiptFileInput.files[0] : null;
        
        if (!file) {
            alert('Будь ласка, прикріпіть чек про оплату передоплати!');
            return;
        }

        // 3. Собираем ввод
        const name = (document.getElementById('user-name') || document.getElementById('checkout-name'))?.value.trim() || '';
        const phone = (document.getElementById('user-phone') || document.getElementById('checkout-phone'))?.value.trim() || '';
        const date = document.getElementById('checkout-rental-date')?.value || '';
        const time = document.getElementById('checkout-rental-time')?.value || '';

        // 4. Корзина и финансовый пересчет
        const currentCart = (typeof cart !== 'undefined' && Array.isArray(cart)) ? cart : (window.cart || []);
        let totalFullPrice = 0;
        currentCart.forEach(item => {
            const qty = item.qty || item.quantity || item.count || 1;
            totalFullPrice += (item.price || 0) * qty;
        });

        if (totalFullPrice === 0) {
            const totalPriceEl = document.getElementById('checkout-total-price') || document.querySelector('.total-price-val');
            if (totalPriceEl) {
                totalFullPrice = parseInt(totalPriceEl.textContent.replace(/\D/g, '')) || 0;
            }
        }

        // Безопасный вызов подсчета (если функция существует)
        let prepayAmount = 0;
        let restAmount = totalFullPrice;
        if (typeof calculatePaymentAmounts === 'function') {
            const calc = calculatePaymentAmounts(totalFullPrice);
            prepayAmount = calc.prepayAmount;
            restAmount = calc.restAmount;
        }

        // 5. Формируем мультипарт-данные
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('total_price', totalFullPrice);
        formData.append('prepay_amount', prepayAmount);
        formData.append('rest_amount', restAmount);
        formData.append('cart', JSON.stringify(currentCart));
        formData.append('receipt', file, file.name);

        // UX анимация кнопки
        const originalText = btnSubmitFinal.textContent;
        btnSubmitFinal.disabled = true;
        btnSubmitFinal.style.opacity = '0.6';
        btnSubmitFinal.textContent = 'Надсилаємо замовлення...';

        console.log('🚀 Отправляем данные на n8n...', { name, phone, date, time, totalFullPrice, file });

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                body: formData // При отправке FormData заголовок Content-Type браузер ставит автоматически с boundary!
            });

            console.log('📡 Ответ от n8n:', response.status, response.statusText);

            if (response.ok) {
                alert('Замовлення та чек успішно надіслано! Чекаємо на локації 🤙');
                if (typeof goToDrawerStep === 'function') {
                    goToDrawerStep(1);
                }
            } else {
                throw new Error(`Помилка сервера: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Помилка надсилання на вебхук:', error);
            alert('Не вдалося надіслати замовлення. Перевірте консоль браузера (F12).');
        } finally {
            btnSubmitFinal.disabled = false;
            btnSubmitFinal.style.opacity = '1';
            btnSubmitFinal.textContent = originalText;
        }
    });
}

// ==========================================
// 14. УНИВЕРСАЛЬНАЯ ОТПРАВКА В N8N, СОХРАНЕНИЕ И ОЧИСТКА
// ==========================================

// Кодирование файла чека в Base64
const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// --- СБОРОЧНЫЕ ИЩЕЙКИ ПО ТВОЕМУ HTML ---
// --- ВСЕЯДНЫЕ ИЩЕЙКИ ДЛЯ ОБЕИХ СТРАНИЦ (АРЕНДА И ПОХОДЫ) ---
const getSmartClientName = () => {
    const el = document.getElementById('user-name')
            || document.getElementById('checkout-fullname') 
            || document.getElementById('checkout-name')
            || document.getElementById('client-name');
    if (el && el.value && el.value.trim()) return el.value.trim();
    
    const fallback = document.querySelector('input[name="fullname"], input[name="name"], input[placeholder*="Ім"]');
    return fallback ? fallback.value.trim() : 'Не вказано';
};

// --- ЧЕТКИЙ СБОР ТЕЛЕФОНА И ИСТОЧНИКА ---
const getSmartClientPhone = () => {
    // 1. Ищем элемент
    const el = document.getElementById('user-phone') 
            || document.getElementById('checkout-phone');

    // 2. Если нашли, просто берем value, без всяких проверок
    if (el) {
        console.log("DEBUG: Я нашел телефон, значение сейчас:", el.value); // ЭТО ВАЖНО!
        return el.value.trim(); 
    }

    // 3. Fallback (если вдруг ID изменился)
    const fallback = document.querySelector('input[name="phone"], input[type="tel"]');
    if (fallback) {
        console.log("DEBUG: Нашел телефон через fallback, значение:", fallback.value);
        return fallback.value.trim();
    }

    return 'Не вказано';
};

const getSmartClientSource = () => {
    const el = document.getElementById('checkout-source') 
            || document.getElementById('source')
            || document.getElementById('client-source');
    if (el && el.value && el.value.trim()) return el.value.trim();

    const fallback = document.querySelector('select[name="source"], input[name="source"]');
    return fallback ? fallback.value.trim() : 'Не вказано';
};

const getSmartRentalDate = () => {
    const rentalDateEl = document.getElementById('checkout-rental-date');
    if (rentalDateEl && rentalDateEl.value && rentalDateEl.value.trim()) {
        return rentalDateEl.value.trim();
    }

    const tourDateEl = document.getElementById('checkout-tour-date');
    if (tourDateEl && tourDateEl.value && tourDateEl.value.trim()) {
        const selectedOption = tourDateEl.options[tourDateEl.selectedIndex];
        return selectedOption ? selectedOption.textContent.trim() : tourDateEl.value.trim();
    }

    return 'Не вказано';
};

const getSmartRentalTime = () => {
    const timeEl = document.getElementById('checkout-rental-time');
    if (timeEl && timeEl.value && timeEl.value.trim()) {
        return timeEl.value.trim();
    }
    return 'Не вказано';
};

// ==========================================
// 🧹 УМНАЯ И ПОЛНАЯ ОЧИСТКА КОРЗИНЫ (DATA + UI)
// ==========================================

function forceClearCart() {
    // 1. Обнуляем массив корзины в JS (длину в 0, чтобы обнулить по ссылке)
    if (typeof cart !== 'undefined' && Array.isArray(cart)) {
        cart.length = 0;
    }
    if (typeof window.cart !== 'undefined' && Array.isArray(window.cart)) {
        window.cart.length = 0;
    }

    // 2. Полностью вычищаем точный ключ из LocalStorage
    try {
        localStorage.removeItem('green_lounge_cart');
        localStorage.setItem('green_lounge_cart', JSON.stringify([]));
    } catch (e) {}

    // 3. Вызываем ТВОЮ функцию saveCart(), которая сама перерисует интерфейс и занулит счетчики
    if (typeof saveCart === 'function') {
        try {
            saveCart();
        } catch (e) {}
    }

    console.log('🧹 Корзина green_lounge_cart очищена и UI перерисован!');
}

// ==========================================
// 🧭 ТОЧНЫЙ ПОИСК ДАТЫ ПОХОДА / ТУРА
// ==========================================
function getSmartTourDate(cart) {
    // 1. Ищем напрямую в родном инпуте формы checkout-tour-date
    const tourInput = document.getElementById('checkout-tour-date');
    if (tourInput && tourInput.value) {
        console.log('📌 Найдена дата похода из #checkout-tour-date:', tourInput.value);
        return tourInput.value;
    }

    // 2. Страховка: проверяем карточки товаров в корзине
    if (Array.isArray(cart)) {
        for (const item of cart) {
            const isTour = item.type === 'tour' || item.type === 'hike' || 
                (item.title && (item.title.toLowerCase().includes('похід') || item.title.toLowerCase().includes('захід') || item.title.toLowerCase().includes('маршрут')));
            
            if (isTour) {
                const itemDate = item.tourDate || item.tour_date || item.date;
                if (itemDate) return itemDate;

                // Если дата зашита в название (например "Захід сонця 20 серпня")
                const dateInTitle = (item.title || '').match(/\d{1,2}\s+[а-яА-Яa-zA-Z]+/);
                if (dateInTitle) return dateInTitle[0];
            }
        }
    }

    return null;
}

// --- ОСНОВНОЙ ОБРАБОТЧИК КЛИКОВ ---
document.addEventListener('click', async function(e) {
    const submitFinalBtn = e.target.closest('#btn-submit-final-booking');
    if (submitFinalBtn) {
        e.preventDefault();
        e.stopPropagation();

        const N8N_WEBHOOK_URL = 'https://tiktiok.xyz/webhook/219a97d0-2e45-4479-947d-08702f215d52';

        // А) Чек
        const receiptFileInput = document.getElementById('receipt-file-input') 
                              || document.getElementById('receipt-file') 
                              || document.querySelector('input[type="file"]');
        
        const file = receiptFileInput && receiptFileInput.files ? receiptFileInput.files[0] : null;
        
        if (!file) {
            alert('Будь ласка, прикріпіть чек про оплату передоплати!');
            return;
        }

        // Б) ГЕНЕРИРУЕМ ЕДИНЫЙ АЙДИ ЗАКАЗА
        const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

        // В) Собираем базовые данные
        const name = getSmartClientName();
        const phone = getSmartClientPhone();
        const source = getSmartClientSource();
        const rentalDate = getSmartRentalDate();
        const rentalTime = getSmartRentalTime();

        // Г) Корзина
        const currentCart = Array.isArray(window.cart) ? window.cart : ((typeof cart !== 'undefined' && Array.isArray(cart)) ? cart : []);

        // 🔥 ДЕТЕКТИРУЕМ ТИП ЗАКАЗА (КОМБО / ОРЕНДА / ПОХІД) 🔥
        const hasTour = currentCart.some(item => 
            item.type === 'tour' || item.type === 'hike' || 
            (item.title && (item.title.toLowerCase().includes('похід') || item.title.toLowerCase().includes('захід') || item.title.toLowerCase().includes('маршрут')))
        );

        const hasRental = currentCart.some(item => 
            item.type === 'rental' || item.type === 'equipment' || 
            (item.title && (item.title.toLowerCase().includes('байдарка') || item.title.toLowerCase().includes('сап') || item.title.toLowerCase().includes('каяк') || item.title.toLowerCase().includes('оренда')))
        );

        let categoryName = '🛶 САМОСТІЙНА ОРЕНДА';
        if (hasTour && hasRental) {
            categoryName = '🔥 КОМБО ЗАМОВЛЕННЯ';
        } else if (hasTour) {
            categoryName = '🧭 ПОХІД / ТУР';
        }

        // Вытягиваем дату похода
        const tourDate = hasTour ? getSmartTourDate(currentCart) : null;

        let totalSum = 0;
        const itemsList = currentCart.map(item => {
            const price = Number(item.price || item.cost || 0);
            const count = Number(item.count || item.quantity || item.qty || 1);
            totalSum += price * count;

            return {
                name: item.title || item.name || 'Послуга',
                count: count,
                price: price,
                type: item.type || 'service'
            };
        });

        // Д) СЧИТЫВАЕМ ОБЩУЮ СУММУ ИЗ HTML
        const totalEl = document.getElementById('payment-total-full')
                     || document.getElementById('checkout-total-price') 
                     || document.getElementById('cart-total');

        if (totalEl) {
            const parsedTotal = parseFloat(totalEl.textContent.replace(/[^\d.]/g, ''));
            if (!isNaN(parsedTotal) && parsedTotal > 0) totalSum = parsedTotal;
        }

        // Е) ТОЧНЫЙ РАСЧЕТ ПРЕДОПЛАТЫ И ОСТАТКА
        let prepaySum = 0;
        let restSum = 0;

        const prepayEl = document.getElementById('payment-prepay-amount')
                      || document.getElementById('checkout-prepay-price') 
                      || document.querySelector('.checkout-prepay-price');

        const restEl = document.getElementById('payment-rest-amount');

        if (prepayEl) {
            const parsedPrepay = parseFloat(prepayEl.textContent.replace(/[^\d.]/g, ''));
            if (!isNaN(parsedPrepay) && parsedPrepay > 0) prepaySum = parsedPrepay;
        }

        if (restEl) {
            const parsedRest = parseFloat(restEl.textContent.replace(/[^\d.]/g, ''));
            if (!isNaN(parsedRest) && parsedRest >= 0) restSum = parsedRest;
        }

        if (prepaySum === 0 && totalSum > 0) {
            const calculated = calculatePaymentAmounts(totalSum);
            prepaySum = calculated.prepayAmount;
            restSum = calculated.restAmount;
        } else if (restSum === 0 && totalSum > 0) {
            restSum = Math.max(0, totalSum - prepaySum);
        }

        // UX анимация
        const originalText = submitFinalBtn.textContent;
        submitFinalBtn.disabled = true;
        submitFinalBtn.style.opacity = '0.6';
        submitFinalBtn.textContent = 'Обробка чека...';

        try {
            const receiptBase64 = await fileToBase64(file);
            submitFinalBtn.textContent = 'Надсилаємо замовлення...';

            // 🔥 ОБНОВЛЕННЫЙ PAYLOAD ДЛЯ N8N 🔥
            const payload = {
                order_id: orderId,
                category: categoryName,           // "🔥 КОМБО ЗАМОВЛЕННЯ" или "🛶 САМОСТІЙНА ОРЕНДА"
                is_combo: (hasTour && hasRental),  // true / false
                name: name,
                phone: phone,
                source: source,
                rental_date: rentalDate,           // Дата для оренды
                rental_time: rentalTime,           // Время для оренды
                tour_date: tourDate || rentalDate, // Дата для похода (если отдельная — берется она, иначе fallback)
                total_price: totalSum,
                prepay_amount: prepaySum,
                rest_amount: restSum,
                cart: itemsList,
                receipt: {
                    filename: file.name,
                    filetype: file.type,
                    base64: receiptBase64
                }
            };

            console.log('🚀 Отправка payload в n8n:', payload);

            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Ошибка n8n: ${response.status}`);

            console.log('✅ Успешно доставлено в n8n!');

            // СОХРАНЯЕМ В ИСТОРИЮ
            try {
                if (typeof saveOrderToHistory === 'function') {
                    saveOrderToHistory({
                        id: orderId,
                        category: categoryName,
                        rentalDate: rentalDate,
                        rentalTime: rentalTime,
                        tourDate: tourDate,
                        items: itemsList,
                        totalAmount: totalSum,
                        prepayAmount: prepaySum,
                        restAmount: restSum
                    });
                }
            } catch (err) { console.error('Ошибка истории:', err); }

            // 🔥 ОЧИСТКА КОРЗИНЫ И UI 🔥
            forceClearCart();

            if (receiptFileInput) receiptFileInput.value = '';

            document.querySelectorAll('#drawer-step-cart, #drawer-step-checkout, #drawer-step-3').forEach(el => {
                el.style.setProperty('display', 'none', 'important');
            });

            document.querySelectorAll('.open, .active, .show, .is-open').forEach(el => {
                if (el.id !== 'success-modal' && !el.contains(document.getElementById('success-modal'))) {
                    el.classList.remove('open', 'active', 'show', 'is-open');
                }
            });

            const successModal = document.getElementById('success-modal');
            if (successModal) successModal.style.setProperty('display', 'flex', 'important');

        } catch (error) {
            console.error('❌ Ошибка отправки:', error);
            alert('Не вдалося надіслати замовлення. Перевірте з’єднання.');
        } finally {
            submitFinalBtn.disabled = false;
            submitFinalBtn.style.opacity = '1';
            submitFinalBtn.textContent = originalText;
        }
        return;
    }

    // Закрытие модалки успеха
    const closeSuccessBtn = e.target.closest('#close-success-btn');
    if (closeSuccessBtn) {
        e.preventDefault();
        const successModal = document.getElementById('success-modal');
        if (successModal) successModal.style.setProperty('display', 'none', 'important');
        window.location.hash = '';
        window.location.reload();
    }
}, true);

// ==========================================
// 15. АВТОМАТИЧЕСКИЙ СТАРТ НА ВСЕХ СТРАНИЦАХ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Отрисовываем данные из localStorage при загрузке Любой страницы
    updateCartBadge();
    renderCart();

    // 2. Инициализируем карточки (если они есть на текущей странице)
    if (typeof initProductCards === 'function') {
        initProductCards();
    }

    // 3. Инициализируем валидацию даты (если форма есть на странице)
    if (typeof initDateTimeValidation === 'function') {
        initDateTimeValidation();
    }
});

// Синхронизация, если сайт открыт в нескольких вкладках
window.addEventListener('storage', (e) => {
    if (e.key === 'green_lounge_cart') {
        try {
            cart = JSON.parse(e.newValue) || [];
        } catch (err) {
            cart = [];
        }
        renderCart();
        updateCartBadge();
    }
});

// Функция скрывает/показывает блок вопросов в зависимости от содержимого корзины
function checkTourQuestionsVisibility() {
    const questionsBlock = document.getElementById('tour-questions-block');
    if (!questionsBlock) return;

    // Проверяем, есть ли в корзине хотя бы один Поход (tour)
    const hasTour = typeof cart !== 'undefined' && cart.some(item => item.type === 'tour');

    if (hasTour) {
        questionsBlock.style.display = 'block'; // Показываем опрос
    } else {
        questionsBlock.style.display = 'none';  // Прячем опрос для обычной аренды
    }
}

// Умный переключатель видимости Календарей (Аренда vs Поход)

function syncCheckoutCalendars() {
    // Ищем контейнеры в HTML
    const tourContainer = document.getElementById('tour-date-container') || document.getElementById('checkout-tour-date')?.closest('.form-group');
    const rentContainer = document.getElementById('rent-calendar-container') || document.getElementById('rent-date-picker')?.closest('.form-group');

    // Получаем текущие товары из корзины (из JS-массива или localStorage)
    const cartItems = typeof cart !== 'undefined' ? cart : JSON.parse(localStorage.getItem('cart') || '[]');

    // Проверяем типы товаров в корзине
    const hasRentals = cartItems.some(item => item.type === 'rental' || item.type === 'rent');
    const hasTours = cartItems.some(item => item.type === 'tour');

    // 1. Показываем/скрываем календарь АРЕНДЫ
    if (rentContainer) {
        rentContainer.style.display = hasRentals ? 'block' : 'none';
    }

    // 2. Показываем/скрываем селект ТУРОВ
    if (tourContainer) {
        tourContainer.style.display = (hasTours && !hasRentals) ? 'block' : 'none';
    }

    // 3. Если используешь Flatpickr / AirDatepicker для аренды — принудительно обновляем его вид
    const rentInput = document.getElementById('rent-date-picker');
    if (rentInput && rentInput._flatpickr) {
        rentInput._flatpickr.redraw();
    }
}

/**
 * Функция-мост: срабатывает при клике на «Забронювати» на любой карточке
 * @param {string} tourId - ID тура (например, 'nochivlya-na-ostrovi')
 */

function openBookingDrawer(tourId) {
    const tour = typeof toursData !== 'undefined' ? toursData[tourId] : null;
    if (!tour) return;

    const tourPrice = tour.numericPrice || tour.price || 0;
    const itemType = tour.type || (tour.category === 'rental' ? 'rental' : 'tour');

    // 1. Добавляем в корзину
    if (typeof addToCart === 'function') {
        addToCart(tour.id || tourId, tour.title, tourPrice, itemType, 1);
    }

    // 2. Переключаем шторку на Шаг 2 (Оформление)
    if (typeof goToDrawerStep === 'function') {
        goToDrawerStep(2);
    }

    // 🚀 3. ПРИНУДИТЕЛЬНО ПЕРЕРИСОВЫВАЕМ ИНТЕРФЕЙС ДАТ!
    renderCheckoutUI();
}

function renderCheckoutUI() {
    // 1. Берем товары из корзины (JS-переменная или localStorage)
    const cartItems = typeof cart !== 'undefined' ? cart : JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cartItems.length === 0) return;

    // Берем последний добавленный товар
    const lastItem = cartItems[cartItems.length - 1];

    // Определяем, это аренда или тур
    const isRental = lastItem.type === 'rental' || lastItem.type === 'rent';

    // 2. Синхронизируем видимость контейнеров
    const tourContainer = document.getElementById('tour-date-container') || document.getElementById('checkout-tour-date')?.closest('.form-group');
    const rentContainer = document.getElementById('rent-calendar-container') || document.getElementById('rent-date-picker')?.closest('.form-group');

    if (rentContainer) rentContainer.style.display = isRental ? 'block' : 'none';
    if (tourContainer) tourContainer.style.display = isRental ? 'none' : 'block';

    // 3. Запускаем рендер под конкретный тип
    if (isRental) {
        // 🔥 Вызываем функцию, которая рендерит календарь АРЕНДЫ
        if (typeof initRentCalendar === 'function') {
            initRentCalendar(); 
        } else if (typeof renderRentalDatePicker === 'function') {
            renderRentalDatePicker();
        }
    } else {
        // 🔥 Вызываем заполнение дат ТУРА
        if (typeof populateTourDates === 'function') {
            populateTourDates(lastItem.id);
        }
    }
}

// БЛОК СО СТАТИЧНЫМИ ДАТАМИ ДЛЯ ПОХОДОВ ( ТУРОВ )
const DAYS_UA = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS_UA = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];

/**
 * Заполняет select с датами для указанного тура
 * @param {string} tourId - ID тура из объекта toursData
 */
function populateTourDates(tourId) {
    const selectEl = document.getElementById('checkout-tour-date');
    if (!selectEl) return;

    // Очищаем селект
    selectEl.innerHTML = '<option value="">Оберіть дату заходу</option>';

    const tour = typeof toursData !== 'undefined' ? toursData[tourId] : null;
    if (!tour) return;

    const availableDates = [];

    // 1. Если у тура фиксированные даты (customDates)
    if (tour.customDates && tour.customDates.length > 0) {
        tour.customDates.forEach(dateStr => {
            const dateObj = new Date(dateStr + 'T00:00:00');
            availableDates.push({
                value: dateStr,
                label: formatDateLabel(dateObj)
            });
        });
    } 
    // 2. Если у тура плавающий график по дням недели (allowedDays)
    else if (tour.allowedDays && tour.allowedDays.length > 0) {
        const today = new Date();
        const daysToLookAhead = 30; // Генерируем даты на 30 дней вперед

        for (let i = 0; i <= daysToLookAhead; i++) {
            const checkDate = new Date();
            checkDate.setDate(today.getDate() + i);
            
            const dayOfWeek = checkDate.getDay();
            if (tour.allowedDays.includes(dayOfWeek)) {
                // Формат YYYY-MM-DD
                const year = checkDate.getFullYear();
                const month = String(checkDate.getMonth() + 1).padStart(2, '0');
                const day = String(checkDate.getDate()).padStart(2, '0');
                const isoDate = `${year}-${month}-${day}`;

                availableDates.push({
                    value: isoDate,
                    label: formatDateLabel(checkDate)
                });
            }
        }
    }

    // Выводим полученные даты в <select>
    availableDates.forEach(item => {
        const option = document.createElement('option');
        option.value = item.value;
        option.textContent = item.label;
        selectEl.appendChild(option);
    });
}

/**
 * Вспомогательная функция для форматирования даты вида: "15 серпня (Сб)"
 */
function formatDateLabel(dateObj) {
    const day = dateObj.getDate();
    const monthName = MONTHS_UA[dateObj.getMonth()];
    const dayOfWeek = DAYS_UA[dateObj.getDay()];
    return `${day} ${monthName} (${dayOfWeek})`;
}

// ==========================================
// ЛОГИКА РАЗДЕЛА "МОЇ ЗАМОВЛЕННЯ" (LOCALSTORAGE)
// ==========================================

// 1. Сохранение заказа в память (с авто-подстраховкой данных)
function saveOrderToHistory(orderData = {}) {
    try {
        let orders = JSON.parse(localStorage.getItem('my_orders_history') || '[]');

        // 🛡️ СТРАХОВКА 1: Если items не передали или они пустые, вытягиваем их из корзины
        let items = orderData.items;
        if (!items || !Array.isArray(items) || items.length === 0) {
            if (typeof cart !== 'undefined' && Array.isArray(cart) && cart.length > 0) {
                items = [...cart];
            } else if (localStorage.getItem('cart')) {
                try { 
                    items = JSON.parse(localStorage.getItem('cart')) || []; 
                } catch(e) { 
                    items = []; 
                }
            } else {
                items = [];
            }
        }

        // 🛡️ СТРАХОВКА 2: Если totalAmount = 0, сами пересчитываем сумму по товарам
        let totalAmount = parseFloat(orderData.totalAmount || 0);
        if ((!totalAmount || totalAmount === 0) && items.length > 0) {
            totalAmount = items.reduce((sum, item) => {
                const price = parseFloat(item.price || item.cost || 0);
                const qty = parseInt(item.count || item.quantity || item.qty || 1, 10);
                return sum + (price * qty);
            }, 0);
        }

        // Умный выбор даты (из календаря аренды или из календаря походов)
        const selectedDate = orderData.rentalDate || 
                             document.getElementById('checkout-rental-date')?.value || 
                             document.getElementById('checkout-tour-date')?.value || 
                             '---';

        const newOrder = {
            id: orderData.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
            createdAt: orderData.createdAt || new Date().toLocaleString('uk-UA', { 
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            }),
            rentalDate: selectedDate,
            rentalTime: orderData.rentalTime || document.getElementById('checkout-rental-time')?.value || '---',
            items: items,
            totalAmount: totalAmount,
            prepayAmount: orderData.prepayAmount || 0,
            restAmount: orderData.restAmount || (totalAmount - (orderData.prepayAmount || 0)),
            status: orderData.status || 'confirmed',
            statusText: orderData.statusText || 'Заброньовано'
        };

        orders.unshift(newOrder); // Добавляем свежий заказ самым первым
        localStorage.setItem('my_orders_history', JSON.stringify(orders));
        
        console.log('✅ Заказ успешно записан:', newOrder);

        // Перерисовываем список прямо сейчас
        loadAndRenderMyOrders();
    } catch (e) {
        console.error('❌ Ошибка записи заказа:', e);
    }
}

// 2. Отрисовка карточек внутри #orders-container
function loadAndRenderMyOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    const orders = JSON.parse(localStorage.getItem('my_orders_history') || '[]');

    // Если заказов нет — выводим заглушку
    if (orders.length === 0) {
        container.innerHTML = `
            <div style="background: #ffffff; padding: 24px 16px; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center; color: #64748b; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                <div style="font-size: 32px; margin-bottom: 8px;">🛒</div>
                <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">Немає активних замовлень</div>
                <div style="font-size: 13px; color: #94a3b8;">Ваші заброньовані товари з'являться тут</div>
            </div>
        `;
        return;
    }

    // Если заказы есть — рендерим карточки
    container.innerHTML = orders.map(order => {
        // Безопасно достаем и парсим товары
        let items = order.items || [];
        if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch(e) { items = []; }
        }

        // Формируем список позиций с защитой от разницы в названиях ключей
        const itemsMarkup = (Array.isArray(items) && items.length > 0)
            ? items.map(item => {
                const name = item.name || item.title || 'Товар';
                const count = item.count || item.quantity || item.qty || 1;
                const price = item.price || item.cost || 0;
                return `<li style="margin-bottom: 2px;">${name} (x${count}) — <strong>${price} грн</strong></li>`;
            }).join('')
            : '<li style="color: #94a3b8; list-style-type: none; margin-left: -20px;">Немає деталей по позиціях</li>';

        return `
            <div class="order-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 10px; font-size: 13px;">
                    <span style="font-weight: 700; color: #0f172a;">№ ${order.id}</span>
                    <span style="color: #94a3b8; font-size: 12px;">${order.createdAt}</span>
                    <span style="background: #dcfce7; color: #15803d; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 12px;">${order.statusText}</span>
                </div>
                
                <div style="font-size: 14px; color: #334155; margin-bottom: 12px;">
                    <div style="margin-bottom: 8px; font-weight: 500;">
                        📅 <strong>Бронь:</strong> ${order.rentalDate} ${order.rentalTime !== '---' ? 'о ' + order.rentalTime : ''}
                    </div>
                    <div>
                        🛒 <strong>Позиції:</strong>
                        <ul style="margin: 6px 0 0 0; padding-left: 20px; color: #475569; font-size: 13px;">
                            ${itemsMarkup}
                        </ul>
                    </div>
                </div>

                <div style="background: #f8fafc; padding: 10px 12px; border-radius: 10px; font-size: 13px; border: 1px solid #f1f5f9;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>Загальна сума:</span>
                        <strong style="font-size: 15px; color: #0f172a;">${order.totalAmount} грн</strong>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// 3. УНИВЕРСАЛЬНАЯ НАВИГАЦИЯ (UPGRADED)
// ==========================================

function activateTab(tabKey) {
    if (!tabKey) return;
    
    // Очищаем от решеток и 'tab-' (#orders или tab-orders -> orders)
    const cleanKey = tabKey.replace('#', '').replace('tab-', '');

    // Ищем целевой экран в HTML на ТЕКУЩЕЙ странице
    const targetElement = document.getElementById(`tab-${cleanKey}`) || document.getElementById(cleanKey);

    // 🚀 ФИКС МНОГОСТРАНИЧНОСТИ:
    // Если этого экрана НЕТ на текущей странице (например, мы на catalog.html и хотим на Главную)
    if (!targetElement) {
        // Жестко перенаправляем на главную страницу с нужным хешем!
        window.location.href = `index.html#${cleanKey}`;
        return;
    }

    // 🛡️ ГЛАВНЫЙ ФИКС: Убеждаемся, что основной контейнер сайта ВСЕГДА виден
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.style.display = 'block';
    }

    // 1. Снимаем подсветку со всех кнопок навигации
    document.querySelectorAll('.nav_item, .bottom_nav a').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 2. Находим и подсвечиваем нужную кнопку в меню
    const activeBtn = document.querySelector(`.bottom_nav [href*="${cleanKey}"], [data-tab*="${cleanKey}"]`);
    if (activeBtn) {
        const parentItem = activeBtn.closest('.nav_item') || activeBtn;
        parentItem.classList.add('active');
    }

    // 3. ❌ Прячем остальные экраны
    document.querySelectorAll('.tab_content, .page-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    // 4. Показываем нужный экран
    targetElement.style.display = 'block';
    targetElement.classList.add('active');

    // Если это Главная страница — включаем все её блоки (сбрасываем display на дефолтный, чтобы не ломать Flex/Grid)
    if (cleanKey === 'home' || cleanKey === 'main') {
        document.querySelectorAll('#tab-home > *, .home-content').forEach(el => {
            el.style.display = ''; 
        });
    }

    // 5. Если перешли в "Заказы" — обновляем их из памяти
    if (cleanKey === 'orders' && typeof loadAndRenderMyOrders === 'function') {
        loadAndRenderMyOrders();
    }
}

// ==========================================
// А) ЛЕГКИЙ И ЧИСТЫЙ ПЕРЕХВАТ НАВИГАЦИИ
// ==========================================

document.addEventListener('click', function(e) {
    // 1. Ищем кнопку меню
    const navBtn = e.target.closest('.bottom_nav .nav_item') || 
                   e.target.closest('.nav_item') || 
                   e.target.closest('[data-main-tab]');

    // Игнорируем корзину, модалки и клики мимо
    if (!navBtn || e.target.closest('#cart-modal, .cart-btn, .open-cart, [data-tab*="cart"]')) {
        return; 
    }

    // 2. Вытаскиваем ключ таба (из data-tab или из хэша # в href)
    const targetTab = navBtn.dataset.tab;
    const href = navBtn.getAttribute('href') || '';
    const hash = href.includes('#') ? href.split('#')[1] : null;

    const cleanKey = (targetTab || hash || '').replace('tab-', '');

    // 🚀 ЕСЛИ ЭТО ОБЫЧНАЯ ССЫЛКА (напр. href="./index.html" без data-tab) — 
    // скрипт сразу выходит, и браузер штатно переходит по странице!
    if (!cleanKey) return;

    // 3. Ищем целевую секцию на ТЕКУЩЕЙ странице
    let targetElement = document.getElementById(`tab-${cleanKey}`) || document.getElementById(cleanKey);
    if (!targetElement && ['start', 'home', 'main'].includes(cleanKey)) {
        targetElement = document.getElementById('tab-home') || document.getElementById('home');
    }

    // 4. Если секция ЕСТЬ на этой странице -> глушим перезагрузку и переключаем вкладку
    if (targetElement) {
        e.preventDefault();
        activateTab(cleanKey);
        history.pushState(null, null, `#${cleanKey}`);
    }
    // Если секции нет -> e.preventDefault() НЕ вызываем, браузер переходит по href сам!
});

// Б) Проверка хеша в адресной строке при ЗАГРУЗКЕ страницы
function checkHashOnLoad() {
    const hash = window.location.hash;
    if (hash) {
        activateTab(hash);
    } else {
        // Если хеша нет, гарантированно рендерим заказы при первой загрузке
        if (typeof loadAndRenderMyOrders === 'function') loadAndRenderMyOrders();
    }
}

// Запуск проверки при загрузке и при изменении хеша
window.addEventListener('hashchange', checkHashOnLoad);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkHashOnLoad);
} else {
    checkHashOnLoad();
}
