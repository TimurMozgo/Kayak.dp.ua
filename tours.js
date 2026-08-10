// ==========================================================================
// 1. БАЗА ДАННЫХ ТУРОВ
// ==========================================================================
const toursData = {
    'moon-tour': {
        id: 'moon-tour',
        title: "🌕 Повний місяць на воді — Оленяча повня",
        price: "1200 грн/особа",
        numericPrice: 1200,
        format: "каяк або SUP (на вибір)",
        intro: "Оленяча повня — одна з найкрасивіших повень року. Саме в цей період у оленів виростають нові роги, тому ця повня символізує оновлення, силу та новий етап.",
        description: "Уяви: тиша плавнів, гладь води, зоряне небо і величезний золотий Місяць, що віддзеркалюється у річці.",
        features: [
            "🛶 короткий інструктаж перед стартом",
            "🌿 вечірня подорож Діївськими плавнями",
            "🌕 зустріч Оленячої повні просто посеред води",
            "🫖 чайна пауза під зорями",
            "📸 атмосферні фото та незабутні емоції"
        ]
    },
    'kino-na-ostrovi': {
        id: 'kino-na-ostrovi',
        title: "🎬 Кіно на острові",
        price: "1900 грн",
        numericPrice: 1900,
        format: "нічний тур / намети / кіно просто неба",
        intro: "Неймовірна пригода, що починається із заходом сонця!",
        description: "На тебе чекає тепле багаття, казкові гірлянди, кіно просто неба на великому екрані, смачний плов, сміх, музика та душевна компанія.",
        features: [
            "🛶 Збір групи та екіпірування на ж/м Парус",
            "🏕 Розміщення в таборі та ночівля в наметах",
            "🍲 Ароматний плов на вогнищі + чаювання",
            "🎬 Кіно просто неба на великому екрані",
            "🌅 Зустріч неймовірного світанку на острові"
        ]
    },
    'sich-golden-hour': {
        id: 'sich-golden-hour',
        title: "🌅 Магія золотої години в Яхт-клубі «Січ»",
        price: "750 грн",
        numericPrice: 750,
        format: "каяк або SUP (на вибір)",
        intro: "Вечір, коли місто залишається позаду, а перед вами — лише вода, золоте сонце та краєвиди.",
        description: "Невеликий інструктаж — и вы наслаждаетесь красивейшим закатом.",
        features: [
            "📍 Старт: Яхт-клуб «Січ»",
            "🛶 Прогулянка під керівництвом інструктора",
            "☕ Затишне чаювання просто на воді",
            "📸 Яскраві фото та відео на згадку"
        ]
    },
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
    }
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