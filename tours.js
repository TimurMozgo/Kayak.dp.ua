// ==========================================================================
// 1. БАЗА ДАННЫХ ТУРОВ
// ==========================================================================
const toursData = {
    'magic-sunset-parus': {
        id: 'magic-sunset-parus',
        title: "🌅 Чарівні заходи сонця",
        price: "750 грн",
        numericPrice: 750,
        format: "каяк або SUP (на вибір)",
        intro: "Вечір, коли місто відпускає. Ти на воді, навколо тиша, і перед тобою — захід сонця.",
        description: "Ідеально для побачення, перезавантаження або просто щоб відчути щось справжнє.",
        features: [
            "📍 Старт: ж/м Парус",
            "🛶 Легка прогулянка на каяках",
            "☕️ Чаювання прямо на воді",
            "📸 Дивовижні фото та відео"
        ]
    },
    'easy-hike': {
        id: 'easy-hike',
        title: "Easy Hike (Easy Travel) — твій перший крок у світ каякінгу!",
        price: "1000 грн",
        numericPrice: 1000,
        unit: "людина",
        location: "Ж/м Парус",
        time: "09:30 – 12:30",
        days: "Кожної пʼятниці та суботи",
        badge: "✨ Для першого разу",
        intro: "Легка та захоплива прогулянка мальовничими протоками, яка ідеально підходить для першого знайомства з каяками 🚣‍♂️",
        description: "Найкращий маршрут для першого разу! Спокійний темп, коротка техніка безпеки, чайний пікнік на півострові та круті фото.",
        features: [
            "📝 Короткий інструктаж",
            "🚣‍♂️ Прогулянка новими мальовничими протоками",
            "☕️ Чайна пауза з висадкою на півострів",
            "📸 Красиві локації для фото",
            "🛶 Повернення на берег із новими враженнями"
        ],
        // Дни недели для генератора дат (5 = Пятница, 6 = Суббота)
        allowedDays: [5, 6]
    },
    'taemnytsi-plavni': {
        id: 'taemnytsi-plavni',
        title: "«Таємниці Плавнів» — оновлений великий маршрут",
        price: "1700 грн",
        numericPrice: 1700,
        regularPrice: 2500,
        unit: "людина",
        location: "Ж/м Парус-1 (вул. Набережна Заводська, 106)",
        time: "10:00 – 17:00",
        days: "Щосуботи та щонеділі",
        badge: "🔥 Акція 1700 грн (до 15 серпня)",
        intro: "Ця прогулянка як перше кохання… назавжди у спогадах, а серце жадає повторення ❤️‍🔥",
        description: "Оновлений маршрут водною акваторією: заплутані затоки, вузькі протоки та справжня природа! Акційна ціна 1700 грн діє при бронюванні до 15 серпня (далі — 2500 грн).",
        features: [
            "🛶 Оновлений маршрут водною акваторією",
            "🌿 Найцікавіші затоки плавнів",
            "🔥 Смачний обід на багатті",
            "🏹 Активний відпочинок на острові",
            "🌅 Яскраві емоції та теплі спогади",
            "🎥📷 Фото та відео на згадку"
        ],
        // Дни недели для генератора дат (6 = Суббота, 0 = Воскресенье)
        allowedDays: [6, 0]
    },
    'nochivlya-na-ostrovi': {
        id: 'nochivlya-na-ostrovi',
        title: "Ночівля на острові з kayak.dp.ua 🔥",
        price: "3000 грн !!!  ЗАМІСТЬ 3500 грн",
        numericPrice: 3000,
        regularPrice: 3500,
        unit: "людина",
        location: "Ж/м Парус (вул. Набережна Заводська, 106)",
        time: "Сб 11:00 – Нд 11:00 (доба)",
        days: "За розкладом (Сб–Нд)",
        badge: "⛺️ Дводенна пригода",
        intro: "Два дні повного перезавантаження: захід та світанок на воді, найсмачніший плов на багатті та ночівля в наметах 🌅🔥",
        description: "Дводенный сплав Діївськими плавнями з ночівлею на острові! У вартість включено все необхідне спорядження (якісні намети, спальники, стільці), смачне харчування на багатті та фото/відеоспогади. Знижка 30% для УБД та дітей до 12 років.",
        features: [
            "🛶 Похід на острів та розбиття табору",
            "🔥 Найсмачніший плов та їжа на вогнищі + сніданок",
            "🚣 Сплав найвидовищнішими місцями Діївських плавнів",
            "🌅 Захід сонця та світанок о 5-й ранку на каяках",
            "🎶 Теплий музичний вечір та нічні розмови біля вогнища",
            "🏕 Ночівля у зручних наметах (спорядження включено)",
            "📸 Фото та відеоспогади"
        ],
        // Конкретные даты старта (Субботы) 2026 года
        availableDates: [
            "2026-08-22", 
            "2026-08-29", 
            "2026-09-12", 
            "2026-09-19", 
            "2026-10-03", 
            "2026-10-17", 
            "2026-10-31"
        ]
    },
    'magiya-bagattya': {
        id: 'magiya-bagattya',
        title: "Магія вечірнього багаття 🔥",
        price: "1700 грн",
        numericPrice: 1700,
        regularPrice: 3000,
        unit: "людина",
        location: "Ж/м Парус",
        time: "Сб вечір – Нд ранок",
        days: "Щосуботи",
        badge: "🔥 Акція 1700 грн (замість 3000)",
        intro: "Неймовірна пригода, що починається із заходом сонця! Тепле багаття, казкові гірлянди, смачний плов, музика та душевна компанія 🌅🔥",
        description: "Коли місто засинає — природа оживає магією. Затишний виїзд на острів: жива музика, пісні під гітару, караоке біля багаття, ігри, смачна вечеря на вогні, ночівля в наметах та зустріч світанку.",
        features: [
            "🛶 Виїзд на острів під вечірнє сонце та інструктаж",
            "🏕 Табір з казковими гірляндами та фотозонами",
            "🍲 Ароматний плов на вогнищі + чаювання зі смаколиками",
            "🔥 Живе багаття, пісні під гітару, етно-барабани та караоке",
            "🎲 Настільні та командні ігри (Еліас, Крокодил, челенджі)",
            "⛺️ Ночівля в наметах та зустріч світанку на острові",
            "🍳 Сніданок і легка ранкова прогулянка"
        ],
        // 6 = Суббота
        allowedDays: [6]
    },
};

// ==========================================================================
// 2. РЕНДЕР И РАБОТА С КОРЗИНОЙ (TIMURTOUR_CART)
// ==========================================================================
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('timurtour_cart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('timurtour_cart', JSON.stringify(cart));
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
}

function changeQty(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].qty = (cart[index].qty || 1) + delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
}

function removeCartItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function updatePaymentAmounts(total) {
    const prepay = Math.round(total * 0.3);
    const rest = total - prepay;

    const fullEl = document.getElementById('payment-total-full');
    const prepayEl = document.getElementById('payment-prepay-amount');
    const restEl = document.getElementById('payment-rest-amount');

    if (fullEl) fullEl.textContent = `${total} грн`;
    if (prepayEl) prepayEl.textContent = `${prepay} грн`;
    if (restEl) restEl.textContent = `${rest} грн`;
}

// ==========================================================================
// 3. УПРАВЛЕНИЕ ШТОРКОЙ КОРЗИНЫ
// ==========================================================================
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer') || 
                   document.getElementById('drawer') || 
                   document.querySelector('.cart-drawer') || 
                   document.querySelector('.cart-modal');
    const overlay = document.getElementById('cart-overlay') || 
                    document.querySelector('.cart-overlay');

    if (drawer) {
        drawer.classList.add('active', 'open');
        drawer.style.display = 'block';
    }
    if (overlay) {
        overlay.classList.add('active', 'open');
        overlay.style.display = 'block';
    }

    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
    
    // Вызываем единую функцию переключения шагов из script.js
    if (typeof window.goToDrawerStep === 'function') {
        window.goToDrawerStep(1);
    } else if (typeof goToDrawerStep === 'function') {
        goToDrawerStep(1);
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer') || 
                   document.getElementById('drawer') || 
                   document.querySelector('.cart-drawer') || 
                   document.querySelector('.cart-modal');
    const overlay = document.getElementById('cart-overlay') || 
                    document.querySelector('.cart-overlay');

    if (drawer) {
        drawer.classList.remove('active', 'open');
        drawer.style.display = 'none';
    }
    if (overlay) {
        overlay.classList.remove('active', 'open');
        overlay.style.display = 'none';
    }
}

// Экспортируем функции открытия/закрытия в глобальную область
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;

// ==========================================================================
// 4. ДЕЙСТВИЯ С ТУРАМИ И МОДАЛКОЙ
// ==========================================================================
function openBookingDrawer(tourId) {
    bookTourAction(tourId || 'moon-tour');
}

function openTourDetails(tourId) {
    const tour = toursData[tourId];
    if (!tour) return;

    const modal = document.getElementById('tourModal');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <h2 style="color: #f8fafc; font-size: 1.3rem; margin-bottom: 12px;">${tour.title}</h2>
        <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 12px;">${tour.intro}</p>
        <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 20px; font-style: italic;">${tour.description}</p>
        <h3 style="color: #f8fafc; font-size: 1rem; margin-bottom: 10px;">На вас чекає:</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
            ${tour.features.map(f => `<li style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 8px;">${f}</li>`).join('')}
        </ul>
        <div style="background: rgba(255, 255, 255, 0.05); padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.08);">
            <div style="color: #facc15; font-weight: 700; font-size: 1rem; margin-bottom: 4px;">💸 Вартість: ${tour.price}</div>
            <div style="color: #94a3b8; font-size: 0.9rem;">🚣 Формат: ${tour.format}</div>
        </div>
        <button onclick="bookTourAction('${tour.id}');" style="width: 100%; padding: 14px; font-weight: 800; font-size: 1rem; background: #facc15; color: #0b0f19; border: none; border-radius: 12px; cursor: pointer;">
            Забронювати
        </button>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTourDetails() {
    const modal = document.getElementById('tourModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function bookTourAction(tourId) {
    const tour = toursData[tourId];
    if (!tour) return;

    const cart = getCart();
    const existingIndex = cart.findIndex(i => i.id === tour.id);

    if (existingIndex > -1) {
        cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
    } else {
        cart.push({
            id: tour.id,
            title: tour.title,
            price: tour.numericPrice,
            qty: 1,
            durationText: tour.format,
            type: 'TOUR'
        });
    }

    saveCart(cart);
    closeTourDetails();
    
    // Мгновенно открываем шторку с товаром
    if (typeof openCart === 'function') {
        openCart();
    } else {
        openCartDrawer();
    }
}

window.openBookingDrawer = openBookingDrawer;
window.openTourDetails = openTourDetails;
window.closeTourDetails = closeTourDetails;
window.bookTourAction = bookTourAction;

// ==========================================================================
// 5. ИНИЦИАЛИЗАЦИЯ И СОБЫТИЯ
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // Первичная отрисовка
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }

    // 1. Кнопка вызова корзины
    const navCartBtn = document.getElementById('nav-cart-btn');
    if (navCartBtn) {
        navCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    }

    // 2. Обработка кликов внутри шторки
    document.addEventListener('click', (e) => {

        // Закрытие
        if (e.target.closest('#close-cart-btn') || e.target.id === 'cart-overlay') {
            e.preventDefault();
            closeCartDrawer();
        }

        // Переход к шагу 2 (Анкета)
        if (e.target.closest('#btn-go-to-checkout')) {
            e.preventDefault();
            if (typeof goToDrawerStep === 'function') {
                goToDrawerStep(2);
            }
        }

        // Возврат на Шаг 1
        if (e.target.closest('#btn-back-to-cart')) {
            e.preventDefault();
            if (typeof goToDrawerStep === 'function') {
                goToDrawerStep(1);
            }
        }

        // Переход к Шагу 3 (Реквизиты)
        if (e.target.closest('#btn-show-requisites')) {
            e.preventDefault();
            const form = document.getElementById('tour-checkout-form');
            if (form && !form.checkValidity()) {
                form.reportValidity();
                return;
            }
            if (typeof goToDrawerStep === 'function') {
                goToDrawerStep(3);
            }
        }

        // Скопировать реквизиты
        const copyCard = e.target.closest('.copy-card');
        if (copyCard) {
            const targetId = copyCard.getAttribute('data-copy-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                navigator.clipboard.writeText(targetEl.textContent.trim()).then(() => {
                    const originalBg = copyCard.style.background;
                    copyCard.style.background = '#22c55e22';
                    setTimeout(() => copyCard.style.background = originalBg, 1000);
                });
            }
        }

        // Закрытие успеха
        if (e.target.closest('#close-success-btn')) {
            const modal = document.getElementById('success-modal');
            if (modal) modal.style.display = 'none';
            closeCartDrawer();
            localStorage.removeItem('timurtour_cart');
            if (typeof updateCartUI === 'function') {
                updateCartUI();
            }
        }
    });

    // 3. Загрузка чека
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('receipt-file-input');
    const idleState = document.getElementById('upload-idle-state');
    const previewState = document.getElementById('upload-preview-state');
    const previewImg = document.getElementById('receipt-preview-img');

    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (previewImg) previewImg.src = event.target.result;
                    if (idleState) idleState.style.display = 'none';
                    if (previewState) previewState.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 4. Финальная отправка чека
    const finalBtn = document.getElementById('btn-final-submit');
    if (finalBtn) {
        finalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('success-modal');
            if (modal) modal.style.display = 'flex';
        });
    }
});