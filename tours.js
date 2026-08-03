// ==========================================================================
// БАЗА ДАННЫХ ТУРОВ
// ==========================================================================
const toursData = {
    'moon-tour': {
        id: 'moon-tour',
        title: "🌕 Повний місяць на воді — Оленяча повня",
        price: "1200 грн/особа",
        numericPrice: 1200,
        format: "каяк або SUP (на вибір)",
        intro: "Оленяча повня — одна з найкрасивіших повень року. Саме в цей період у оленів виростають нові роги, тому ця повня символізує оновлення, силу та новий етап.",
        description: "Уяви: тиша плавнів, гладь води, зоряне небо і величезний золотий Місяць, що віддзеркалюється у річці. Це той момент, який неможливо передати на фото — його потрібно прожити.",
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
        price: "1900 грн (замість 3000 грн)",
        numericPrice: 1900,
        format: "нічний тур / намети / кіно просто неба",
        intro: "Неймовірна пригода, що починається із заходом сонця! Коли місто засинає — природа оживає магією. Влаштуй собі вечір, який ти запам’ятаєш надовго.",
        description: "На тебе чекає тепле багаття, казкові гірлянди, кіно просто неба на великому екрані, смачний плов, сміх, музика та душевна компанія до півночі із зустріччю світанку на острові.",
        features: [
            "🛶 Збір групи та екіпірування на ж/м Парус (20:00 - 09:00, щосуботи)",
            "🛡 Інструктаж та виїзд на безлюдний острів під вечірнє сонце",
            "🏕 Розміщення в таборі, гірлянди, фотозони та ночівля в наметах",
            "🍲 Ароматний плов на вогнищі + чаювання зі смаколиками та сніданок",
            "🎬 Кіно просто неба на великому екрані серед природи",
            "🔥 Живе багаття, душевні розмови та пісні під гітару / караоке",
            "🎲 Веселі ігри: Еліас, Крокодил, етно-барабани та челенджі",
            "🌅 Зустріч неймовірного світанку на острові"
        ]
    },

    'sich-golden-hour': {
        id: 'sich-golden-hour',
        title: "🌅 Магія золотої години в Яхт-клубі «Січ»",
        price: "від 750 грн (замість 1500 грн)",
        numericPrice: 750,
        format: "каяк або SUP (на вибір)",
        intro: "Вечір, коли місто залишається позаду, а перед вами — лише вода, золоте сонце та неймовірні краєвиди яхт-клубу «Січ».",
        description: "Навіть якщо це ваша перша прогулянка на каяку чи SUP — усе просто. Кілька хвилин інструктажу, і ви вже насолоджуєтеся одним із найкрасивіших заходів сонця в Дніпрі. Акційна ціна діє при бронюванні до кінця липня або при купівлі подарункового сертифіката на сезон 2026.",
        features: [
            "📍 Старт: Яхт-клуб «Січ» (м. Дніпро, вул. Набережна Перемоги, 77Б)",
            "⏰ Час: 18:30–21:00 (Щочетверга, щоп’ятниці, щосуботи, щонеділі)",
            "🛶 Прогулянка на каяках або SUP під керівництвом інструктора",
            "🌅 Вихід на воду в наймальовничішу «золоту годину» заходу сонця",
            "☕ Затишне чаювання просто на воді",
            "📸 Яскраві фото та відео на згадку",
            "💳 Вартість: Будні — 750 грн / Вихідні — 950 грн (замість 1500 грн)"
        ]
    },

    'magic-sunset-parus': {
        id: 'magic-sunset-parus',
        title: "🌅 Чарівні заходи сонця",
        price: "від 750 грн (замість 1500 грн)",
        numericPrice: 750,
        format: "каяк або SUP (на вибір)",
        intro: "Вечір, коли місто відпускає. Ти на воді, навколо тиша, і перед тобою — захід, який неможливо повторити.",
        description: "Підходить навіть якщо ти вперше здобуваєш знання з веслування 😍. Це найпопулярніша прогулянка сезону. Ідеально для побачення, перезавантаження або просто щоб відчути щось справжнє. ⚡️ Акційна ціна діє при бронюванні до кінця липня або при купівлі сертифікату на весь сезон 2026.",
        features: [
            "📍 Старт: м.Дніпро, ж/м Парус, вул. Набережна Заводська,106",
            "⏰ Час: 18:00 – 21:00 (Вт, Ср, Чт, Пт, Сб, Вс!)",
            "🛶 Легка прогулянка на каяках",
            "🌅 Вихід у золоту годину",
            "☕️ Чаювання прямо на воді",
            "📸 Дивовижні фото та відео на згадку",
            "💳 Вартість: Будні — 750 грн / Вихідні — 950 грн (замість 1500 грн)"
        ]
    }
    
};

// ==========================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ УПРАВЛЕНИЯ КОРЗИНОЙ
// ==========================================================================
function openCartDrawer() {
    const cartDrawer = document.getElementById('cart-drawer');
    if (cartDrawer) {
        cartDrawer.classList.add('active');
        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
    }
}

function closeCartDrawer() {
    const cartDrawer = document.getElementById('cart-drawer');
    if (cartDrawer) {
        cartDrawer.classList.remove('active');
    }
}

// ==========================================================================
// 1. ФУНКЦИЯ ДЛЯ КНОПКИ "ЗАБРОНЮВАТИ" В КАРТОЧКЕ
// ==========================================================================
function openBookingDrawer(tourId) {
    const id = tourId || 'moon-tour';
    bookTourAction(id);
    // 🔥 Корзину НЕ открываем автоматически! Юзер сам откроет, когда захочет
}

// ==========================================================================
// 2. ОТКРЫТИЕ МОДАЛКИ С ДЕТАЛЯМИ
// ==========================================================================
function openTourDetails(tourId) {
    const tour = toursData[tourId];
    if (!tour) return;

    const modal = document.getElementById('tourModal');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) {
        console.error("Не найден элемент #tourModal или #modalBody!");
        return;
    }

    modalBody.innerHTML = `
        <h2 style="color: #f8fafc; font-size: 1.3rem; margin-bottom: 12px; line-height: 1.3;">${tour.title}</h2>
        
        <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5; margin-bottom: 12px;">
            ${tour.intro}
        </p>

        <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5; margin-bottom: 20px; font-style: italic;">
            ${tour.description}
        </p>

        <h3 style="color: #f8fafc; font-size: 1rem; margin-bottom: 10px;">На вас чекає:</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
            ${tour.features.map(item => `<li style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 8px;">${item}</li>`).join('')}
        </ul>

        <div style="background: rgba(255, 255, 255, 0.05); padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.08);">
            <div style="color: #facc15; font-weight: 700; font-size: 1rem; margin-bottom: 4px;">💸 Вартість: ${tour.price}</div>
            <div style="color: #94a3b8; font-size: 0.9rem;">🚣 Формат: ${tour.format}</div>
        </div>

        <button onclick="bookTourAction('${tour.id}');" class="btn-book" style="width: 100%; padding: 14px; font-weight: 800; font-size: 1rem; background: #facc15; color: #0b0f19; border: none; border-radius: 12px; cursor: pointer;">
            Забронювати
        </button>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ==========================================================================
// 3. ЗАКРЫТИЕ МОДАЛКИ ДЕТАЛЕЙ
// ==========================================================================
function closeTourDetails() {
    const modal = document.getElementById('tourModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==========================================================================
// 4. ДОБАВЛЕНИЕ В КОРЗИНУ
// ==========================================================================
function bookTourAction(tourId) {
    const tour = toursData[tourId];
    if (!tour) return;

    if (typeof addToCart === 'function') {
        addToCart({
            id: tour.id,
            tourId: tour.id,
            title: tour.title,
            name: tour.title,
            price: tour.numericPrice || 1200,
            cost: tour.numericPrice || 1200,
            qty: 1,
            quantity: 1,
            count: 1,
            type: 'tour',      // 🔥 Четкий тип для корзины
            category: 'похід'
        });
    } else {
        console.error("Функция addToCart не найдена!");
    }

    closeTourDetails();

    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
}

// ==========================================================================
// 5. ИНИЦИАЛИЗАЦИЯ И ОБРАБОТЧИКИ
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    const cartDrawer = document.getElementById('cart-drawer');

    // 1. Открытие корзины по клику на нижнюю кнопку навигации
    const navCartBtn = document.getElementById('nav-cart-btn');
    if (navCartBtn) {
        navCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();

            const step1 = document.getElementById('drawer-step-cart');
            const step2 = document.getElementById('drawer-step-form');
            if (step1 && step2) {
                step1.style.display = 'block';
                step2.style.display = 'none';
            }
        });
    }

    // 2. ГЛОБАЛЬНЫЙ КЛИК-КОНТРОЛЛЕР
    document.addEventListener('click', (e) => {

        // А) Закрытие корзины (крестик или непосредственно клик по тёмному фону)
        if (e.target.closest('#close-cart-btn') || e.target.id === 'cart-overlay') {
            e.preventDefault();
            closeCartDrawer();
        }

        // Б) Переход к опросу (Шаг 1 -> Шаг 2)
        if (e.target.closest('#btn-go-to-checkout')) {
            e.preventDefault();
            const step1 = document.getElementById('drawer-step-cart');
            const step2 = document.getElementById('drawer-step-form');

            if (step1 && step2) {
                step1.style.display = 'none';
                step2.style.display = 'block';
            } else {
                console.error("❌ Не найден #drawer-step-cart или #drawer-step-form!");
            }
        }

        // В) Возврат к корзине (Шаг 2 -> Шаг 1)
        if (e.target.closest('#btn-back-to-cart')) {
            e.preventDefault();
            const step1 = document.getElementById('drawer-step-cart');
            const step2 = document.getElementById('drawer-step-form');

            if (step1 && step2) {
                step2.style.display = 'none';
                step1.style.display = 'block';
            }
        }
    });

    // ==========================================================================
    // ОТПРАВКА ФОРМЫ С АВТО-РАЗДЕЛЕНИЕМ ИМЕНИ И ТЕЛЕФОНА
    // ==========================================================================
    const checkoutForm = document.getElementById('tour-checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // 1. Достаем корзину
            const currentCart = (typeof cart !== 'undefined' && Array.isArray(cart) && cart.length > 0) ? cart 
                            : (typeof window.cart !== 'undefined' && Array.isArray(window.cart)) ? window.cart 
                            : [];

            // 2. Считываем сырые данные полей
            let rawName = document.getElementById('checkout-fullname')?.value || '';
            let rawPhone = document.getElementById('checkout-phone')?.value || '';

            // 🎯 МИГИЯ ДЕЛЕНИЯ: Если телефон вписали прямо в поле Имени — вытаскиваем его оттуда!
            const phoneRegex = /(\+?\d[\d\s\-\(\)]{8,}\d)/;
            const match = rawName.match(phoneRegex);

            let cleanPhone = rawPhone.trim();
            let cleanName = rawName.trim();

            if (match) {
                if (!cleanPhone || cleanPhone === 'Не указано') {
                    cleanPhone = match[0].trim(); // Забираем найденный номер
                }
                cleanName = cleanName.replace(match[0], '').trim(); // Вырезаем номер из имени
            }

            // 3. Собираем анкету
            const experienceVal = document.querySelector('input[name="experience"]:checked')?.value || '';
            const boatsVal = document.getElementById('checkout-boats')?.value || '';
            const participantsVal = document.getElementById('checkout-participants')?.value || '';
            const hasTourQuiz = (experienceVal !== '' && experienceVal !== 'Не вказано') || boatsVal.trim() !== '' || participantsVal.trim() !== '';

            const isTourCart = currentCart.some(i => i.type === 'tour' || i.type === 'похід' || i.category === 'похід');
            const isRentCart = currentCart.some(i => i.type === 'rent' || i.type === 'оренда' || i.category === 'оренда');

            let calculatedOrderType = 'ОРЕНДА';
            if ((isTourCart || hasTourQuiz) && isRentCart) {
                calculatedOrderType = 'КОМБО (Похід + Оренда)';
            } else if (isTourCart || hasTourQuiz) {
                calculatedOrderType = 'ПОХІД';
            }

            // 4. Считаем итоговую сумму
            let calculatedTotal = currentCart.reduce((sum, item) => sum + ((item.price || item.cost || 0) * (item.qty || item.quantity || 1)), 0);

            // Если корзина была пустой, но заполнен поход — ставим дефолтную стоимость похода (например 1200 грн)
            if (calculatedTotal === 0 && (isTourCart || hasTourQuiz)) {
                calculatedTotal = 1200; 
            }

            const formData = {
                fullname: cleanName || 'Клієнт',
                phone: cleanPhone || 'Не вказано',
                source: document.getElementById('checkout-source')?.value || 'Не указано',
                experience: experienceVal || 'Не вказано',
                boats: boatsVal || 'Не вказано',
                participants: participantsVal || '1 особа',
                
                cartItems: currentCart.map(item => ({
                    id: item.id,
                    title: item.title || item.name,
                    price: item.price || item.cost,
                    qty: item.qty || item.quantity || 1,
                    type: item.type || 'tour'
                })),
                
                totalPrice: calculatedTotal,
                orderType: calculatedOrderType,
                timestamp: new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })
            };

            // 5. Отправка на n8n
            const webhookUrl = 'https://tiktiok.xyz/webhook/219a97d0-2e45-4479-947d-08702f215d52';

            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                console.log('✅ Данные ушли на n8n!');
            } catch (error) {
                console.error('❌ Ошибка отправки:', error);
            }

            // 6. Сброс и очистка + навешивание закрытия на "Чудово"
            closeCartDrawer();
            const successModal = document.getElementById('success-modal');
            
            if (successModal) {
                // 1. Показываем плашку успеха
                successModal.style.display = 'flex';

                // 2. Находим кнопку "Чудово" или крестик внутри модалки
                const closeBtn = successModal.querySelector('button') 
                              || successModal.querySelector('.close-modal')
                              || document.getElementById('close-success-btn');

                if (closeBtn) {
                    // При клике на "Чудово" скрываем плашку
                    closeBtn.onclick = function() {
                        successModal.style.display = 'none';
                    };
                }

                // 3. Закрытие при клике мимо модалки (по темному фону)
                successModal.onclick = function(e) {
                    if (e.target === successModal) {
                        successModal.style.display = 'none';
                    }
                };
            }

            // Очищаем корзины в памяти
            if (typeof cart !== 'undefined' && Array.isArray(cart)) cart.length = 0;
            if (typeof window.cart !== 'undefined' && Array.isArray(window.cart)) window.cart.length = 0;
            if (typeof updateCartUI === 'function') updateCartUI();
            
            this.reset();
        });
    }
});