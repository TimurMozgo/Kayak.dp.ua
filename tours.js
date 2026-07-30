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

        <button onclick="bookTourAction('${tour.id}')" class="btn-book" style="width: 100%; padding: 14px; font-weight: 800; font-size: 1rem; background: #facc15; color: #0b0f19; border: none; border-radius: 12px; cursor: pointer;">
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
// 4. ДОБАВЛЕНИЕ В КОРЗИНУ (УНИВЕРСАЛЬНЫЕ КЛЮЧИ ДЛЯ КАТАЛОГА)
// ==========================================================================
function bookTourAction(tourId) {
    const tour = toursData[tourId];
    if (!tour) return;

    if (typeof addToCart === 'function') {
        addToCart({
            // Передаем все популярные наименования id и названия
            id: tour.id,
            tourId: tour.id,
            
            title: tour.title,
            name: tour.title,
            
            // Передаем цену во всех форматах (и число, и строку)
            price: tour.numericPrice || 1200,
            cost: tour.numericPrice || 1200,
            
            // Количество товара
            qty: 1,
            quantity: 1,
            count: 1,
            
            // Доп параметры
            type: 'похід',
            category: 'похід'
        });
    } else {
        console.error("Функция addToCart не найдена в script.js!");
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
            e.preventDefault(); // Запрещаем ссылке переходить по #cart
            
            if (cartDrawer) {
                cartDrawer.classList.add('active'); // Открываем шторку
                
                // При открытии сбрасываем вид на Step 1 (список товаров)
                const step1 = document.getElementById('drawer-step-cart');
                const step2 = document.getElementById('drawer-step-form');
                if (step1 && step2) {
                    step1.style.display = 'block';
                    step2.style.display = 'none';
                }

                // Обновляем UI корзины, если функция существует
                if (typeof updateCartUI === 'function') {
                    updateCartUI();
                }
            } else {
                console.error("Ошибка: Блок #cart-drawer не найден на странице!");
            }
        });
    }

    // 2. ГЛОБАЛЬНЫЙ КЛИК-КОНТРОЛЛЕР (Закрытие, Переход на форму, Назад)
    document.addEventListener('click', (e) => {

        // А) Закрытие корзины (крестик или затемнение)
        if (e.target.closest('#close-cart-btn') || e.target.closest('#cart-overlay')) {
            e.preventDefault();
            if (cartDrawer) {
                cartDrawer.classList.remove('active');
            }
        }

        // Б) Переход к опросу (Шаг 1 -> Шаг 2)
        if (e.target.closest('#btn-go-to-checkout')) {
            e.preventDefault();
            
            const step1 = document.getElementById('drawer-step-cart');
            const step2 = document.getElementById('drawer-step-form');

            if (step1 && step2) {
                step1.style.display = 'none';
                step2.style.display = 'block';
                console.log("✅ Успешный переход на анкету!");
            } else {
                console.error("❌ Ошибка переключения: Не найден #drawer-step-cart или #drawer-step-form!");
            }
        }

        // В) Возврат из опроса назад к списку (Шаг 2 -> Шаг 1)
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

});