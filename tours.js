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
    updateCartUI();
}

function updateCartUI() {
    const cart = getCart();

    // 1. Обновляем счетчик (Badge) на иконке корзины
    const badgeEl = document.getElementById('cart-badge');
    const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    if (badgeEl) {
        if (totalCount > 0) {
            badgeEl.textContent = totalCount;
            badgeEl.style.display = 'flex'; // Показываем бейджик
        } else {
            badgeEl.textContent = '0';
            badgeEl.style.display = 'none'; // Скрываем, если пусто
        }
    }

    // 2. Отрисовка списка товаров в шторке
    const container = document.getElementById('cart-items-container');
    const grandTotalEl = document.getElementById('cart-grand-total');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px 10px; color: #a3a3a3;">
                <p style="font-size: 1.1rem; margin-bottom: 8px;">Кошик порожній 🛶</p>
                <p style="font-size: 0.85rem;">Оберіть похід або тур для бронювання</p>
            </div>
        `;
        if (grandTotalEl) grandTotalEl.textContent = '0';
        updatePaymentAmounts(0);
        return;
    }

    let grandTotal = 0;
    let html = '';

    cart.forEach((item, index) => {
        const itemTotal = (item.price || 0) * (item.qty || 1);
        grandTotal += itemTotal;

        html += `
            <div style="background: #111111; border: 1px solid #262626; border-radius: 12px; padding: 12px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="font-weight: 700; color: #ffffff; font-size: 0.95rem; line-height: 1.3;">
                        ${item.title || item.name || 'Тур'}
                    </div>
                    <button onclick="removeCartItem(${index})" style="background: none; border: none; color: #ef4444; font-size: 1.2rem; cursor: pointer; padding: 0 0 0 8px; line-height: 1;">
                        &times;
                    </button>
                </div>
                <div style="font-size: 0.8rem; color: #a3a3a3;">
                    ${item.durationText || 'Формат: каяк/SUP'}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                    <div style="display: flex; align-items: center; background: #000; border: 1px solid #333; border-radius: 6px; overflow: hidden;">
                        <button onclick="changeQty(${index}, -1)" style="background: none; border: none; color: #fff; width: 28px; height: 28px; cursor: pointer; font-weight: bold;">-</button>
                        <span style="padding: 0 8px; color: #fff; font-size: 0.85rem; font-weight: 600;">${item.qty || 1}</span>
                        <button onclick="changeQty(${index}, 1)" style="background: none; border: none; color: #fff; width: 28px; height: 28px; cursor: pointer; font-weight: bold;">+</button>
                    </div>
                    <div style="font-weight: 800; color: #ffffff; font-size: 0.95rem;">
                        ${itemTotal} грн
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (grandTotalEl) grandTotalEl.textContent = grandTotal;
    updatePaymentAmounts(grandTotal);
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
// 3. УПРАВЛЕНИЕ ШТОРКОЙ И ШАГАМИ
// ==========================================================================
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');

    if (drawer) {
        drawer.classList.add('active');
        drawer.style.display = 'block';
    }
    if (overlay) {
        overlay.classList.add('active');
        overlay.style.display = 'block';
    }

    updateCartUI();
    goToDrawerStep(1);
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');

    if (drawer) {
        drawer.classList.remove('active');
        drawer.style.display = 'none';
    }
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
    }
}

function goToDrawerStep(stepNumber) {
    const step1 = document.getElementById('drawer-step-cart');
    const step2 = document.getElementById('drawer-step-form');
    const step3 = document.getElementById('drawer-step-payment');

    if (step1) step1.style.display = (stepNumber === 1) ? 'block' : 'none';
    if (step2) step2.style.display = (stepNumber === 2) ? 'block' : 'none';
    if (step3) step3.style.display = (stepNumber === 3) ? 'block' : 'none';
}

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
    openCartDrawer();
}

// ==========================================================================
// 5. ИНИЦИАЛИЗАЦИЯ И СОБЫТИЯ
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // Первичная отрисовка
    updateCartUI();

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
            if (getCart().length === 0) {
                alert('Кошик порожній!');
                return;
            }
            goToDrawerStep(2);
        }

        // Возврат на Шаг 1
        if (e.target.closest('#btn-back-to-cart')) {
            e.preventDefault();
            goToDrawerStep(1);
        }

        // Переход к Шагу 3 (Реквизиты)
        if (e.target.closest('#btn-show-requisites')) {
            e.preventDefault();
            const form = document.getElementById('tour-checkout-form');
            if (form && !form.checkValidity()) {
                form.reportValidity();
                return;
            }
            goToDrawerStep(3);
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
            updateCartUI();
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