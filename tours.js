// ==========================================================================
// 1. БАЗА ДАННЫХ ТУРОВ (ТВОЙ ФУНДАМЕНТ)
// ==========================================================================
const toursData = {
    // 🌅 1. ЧАРІВНІ ЗАХОДИ СОНЦЯ (Вт, Чт, Пт, Сб, Нд)
    'magic-sunset-parus': {
        id: 'magic-sunset-parus',
        title: "🌅 Чарівні заходи сонця",
        price: "750 грн",
        numericPrice: 750,
        unit: "людина",
        format: "Каяк або SUP (на вибір)",
        location: "Ж/м Парус",
        time: "18:00 – 21:00",
        days: "Вт, Чт, Пт, Сб, Нд",
        intro: "Вечір, коли місто відпускає. Ти на воді, навколо тиша, і перед тобою — захід сонця.",
        description: "Ідеально для побачення, перезавантаження або просто щоб відчути щось справжнє.",
        features: [
            "📍 Старт: ж/м Парус",
            "🛶 Легка прогулянка на каяках або SUP",
            "☕️ Чаювання прямо на воді",
            "📸 Дивовижні фото та відео"
        ],
        allowedDays: [2, 4, 5, 6, 0] // 2=Вт, 4=Чт, 5=Пт, 6=Сб, 0=Нд
    },

    // 🌿 2. ТАЄМНИЦІ ПЛАВНІВ (Щосуботи та щонеділі)
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
        allowedDays: [6, 0] // 6=Сб, 0=Нд
    },

    // 🚣‍♂️ 3. ДВОДЕННИЙ СПЛАВ ПО ОРЕЛІ (Конкретні дати)
    'dvodenniy-splav-po-oreli': {
        id: 'dvodenniy-splav-po-oreli',
        title: "Дводенний сплав по Орелі 🛶",
        price: "5700 грн",
        numericPrice: 5700,
        regularPrice: 8700,
        unit: "людина",
        location: "Старт з м. Дніпро (трансфер)",
        time: "2 дні (Субота – Неділя)",
        days: "За розкладом выїздів",
        badge: "🔥 Акція 5700 грн (до 15.08)",
        intro: "Запрошуємо на насичену подорож найчистішою притокою Дніпра — Ореллю! 2 дні природи, вогнища, спорту та крутої компанії 🚣‍♂️🔥",
        description: "Маршрут (~8–16 км/день) дикими берегами та заплавними луками. У вартість 5700 грн включено все спорядження для веслування, 4-разове харчування, перекуси, чаювання та супровід інструкторів. Додатково: трансфер (800-1000 грн) та прокат наметів/спальників. Знижка 30% дітям до 12 років та УБД.",
        features: [
            "🚣‍♂️ Маршрут по найцікавішій частині Орелі (~8–16 км/день)",
            "🔥 4-разове харчування на вогні + перекуси та чаювання",
            "🏕 Все спорядження для веслування та супровід інструкторів",
            "🏐 Рухливі ігри (бадмінтон, фрізбі)",
            "📸 Яскраві живі фото від інструкторів",
            "🤝 Позитивна та активна компанія"
        ],
        customDates: ["2026-08-15", "2026-08-29", "2026-09-12"]
    },

    // 🚣 4. EASY HIKE (П'ятниця та Субота)
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
        allowedDays: [5, 6] // 5=Пт, 6=Сб
    },

    // 🔥 5. МАГІЯ ВЕЧІРНЬОГО БАГАТТЯ (Щосуботи)
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
        allowedDays: [6] // 6=Сб
    },

    // ⛺️ 6. НОЧІВЛЯ НА ОСТРОВІ (Конкретні дати)
    'nochivlya-na-ostrovi': {
        id: 'nochivlya-na-ostrovi',
        title: "Ночівля на острові з kayak.dp.ua 🔥",
        price: "3000 грн",
        numericPrice: 3000,
        regularPrice: 3500,
        unit: "людина",
        location: "Ж/м Парус (вул. Набережна Заводська, 106)",
        time: "Сб 11:00 – Нд 11:00 (доба)",
        days: "За розкладом (Сб–Нд)",
        badge: "⛺️ Дводенна пригода",
        intro: "Два дні повного перезавантаження: захід та світанок на воді, найсмачніший плов на багатті та ночівля в наметах 🌅🔥",
        description: "Дводенний сплав Діївськими плавнями з ночівлею на острові! У вартість включено все необхідне спорядження (якісні намети, спальники, стільці), смачне харчування на багатті та фото/відеоспогади. Знижка 30% для УБД та дітей до 12 років.",
        features: [
            "🛶 Похід на острів та розбиття табору",
            "🔥 Найсмачніший плов та їжа на вогнищі + сніданок",
            "🚣 Сплав найвидовищнішими місцями Діївських плавнів",
            "🌅 Захід сонця та світанок о 5-й ранку на каяках",
            "🎶 Теплий музичний вечір та нічні розмови біля вогнища",
            "🏕 Ночівля у зручних наметах (спорядження включено)",
            "📸 Фото та відеоспогади"
        ],
        customDates: [
            "2026-08-22", "2026-08-29", "2026-09-12", "2026-09-19", 
            "2026-10-03", "2026-10-17", "2026-10-31"
        ]
    },

    // 🧘‍♀️ 7. ЗАХІД СОНЦЯ НА SUP (Середа, П'ятниця, Субота)
    'zahid-sonca-na-sup': {
        id: 'zahid-sonca-na-sup',
        title: "🧘‍♀️🌅 Захід Сонця на SUP — Ідеальний Вечір",
        price: "700 грн (будні) / 800 грн (вихідні)",
        numericPrice: 700,
        regularPrice: 1500,
        unit: "людина",
        format: "SUP-борд",
        location: "Ж/м Парус, Дніпро",
        time: "19:00 – 21:00",
        days: "Щосереди, щоп’ятниці та щосуботи",
        badge: "🧘‍♀️ SUP-релакс (від 700 грн)",
        intro: "Шукаєш, де перезавантажитись після роботи? 2 години — і ти інша людина: SUP, захід сонця, тиша та чай 🌅",
        description: "Ідеальна вечірня SUP-прогулянка для повного релаксу! Навчимо веслувати навіть якщо ти стаєш на дошку вперше. У вартість входить інструктаж, супровід, чай, купання та естетичні фото.",
        features: [
            "✅ Навчимо веслувати з нуля (навіть якщо вперше)",
            "🏄‍♀️ SUP-прогулянка з досвідченими інструкторами",
            "🌅 Захід сонця над рікою",
            "🫖 Затишне чаювання, купання та повний релакс",
            "📸 Естетичні фото на згадку",
            "🚣‍♀️ Повернення з відчуттям «Хочу ще!»"
        ],
        allowedDays: [3, 5, 6] // 3=Середа, 5=П'ятниця, 6=Субота
    }
};

window.toursData = toursData; // Экспортируем в глобальную область

// ==========================================================================
// 2. ДВИЖОК ДАТ (ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ)
// ==========================================================================
window.getAvailableDatesForTour = function(tourId) {
    if (!window.toursData) return [];
    
    const tour = window.toursData[tourId] || Object.values(window.toursData).find(t => t.id === tourId);
    if (!tour) return [];

    // Жестко заданные даты (срабатывают первыми)
    if (tour.customDates && Array.isArray(tour.customDates) && tour.customDates.length > 0) {
        return tour.customDates;
    }
    if (tour.dates && Array.isArray(tour.dates) && tour.dates.length > 0) {
        return tour.dates;
    }

    // Дни недели: генерируем ликвидность на 45 дней вперед
    if (tour.allowedDays && Array.isArray(tour.allowedDays) && tour.allowedDays.length > 0) {
        const dates = [];
        const today = new Date();
        
        for (let i = 0; i < 45; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dayOfWeek = d.getDay();
            
            if (tour.allowedDays.includes(dayOfWeek)) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                dates.push(`${yyyy}-${mm}-${dd}`);
            }
        }
        return dates;
    }

    return [];
};

window.renderTourDateSelectOptions = function(tourId, selectElement, selectedValue = '') {
    if (!selectElement) return;

    const dates = window.getAvailableDatesForTour(tourId);

    if (!dates || dates.length === 0) {
        selectElement.innerHTML = '<option value="">-- Немає доступних дат --</option>';
        return;
    }

    const daysMap = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    let html = '<option value="">-- Оберіть дату походу --</option>';

    dates.forEach(dateStr => {
        const [y, m, d] = dateStr.split('-');
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        const dayName = daysMap[dateObj.getDay()];
        
        const isSelected = (dateStr === selectedValue) ? 'selected' : '';
        html += `<option value="${dateStr}" ${isSelected}>${d}.${m}.${y} (${dayName})</option>`;
    });

    selectElement.innerHTML = html;
};

// ==========================================================================
// 3. РЕНДЕР И РАБОТА С КОРЗИНОЙ (TIMURTOUR_CART)
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
window.changeCartQty = changeQty; // Делаем доступной для HTML

function removeCartItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}
window.removeCartItem = removeCartItem;

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

// Проверка: Тур или Оренда?
function isTourItem(item) {
    const t = String(item.type || '').toUpperCase();
    if (t === 'TOUR' || t === 'ПОХІД' || t === 'POHID') return true;
    const itemId = item.id || item.tourId || item.productId;
    if (window.toursData && itemId && window.toursData[itemId]) return true;
    return false;
}

// Отрисовка визуала корзины
function updateCartUI() {
    const cart = getCart();
    const badgeEl = document.getElementById('cart-badge') || document.querySelector('.cart-badge');
    const container = document.getElementById('cart-items-container') || document.getElementById('drawer-cart-items-container');
    const grandTotalEl = document.getElementById('cart-grand-total') || document.getElementById('drawer-cart-grand-total');
    const checkoutBtn = document.getElementById('btn-go-to-checkout');

    let totalQty = 0;
    let grandTotal = 0;

    cart.forEach(item => {
        const qty = Number(item.qty || item.quantity || 1);
        const rawPrice = item.price ?? item.cost ?? item.numericPrice ?? 0;
        const cleanPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(/[^\d.]/g, '')) || 0;

        totalQty += qty;
        grandTotal += (cleanPrice * qty);
    });

    if (badgeEl) {
        badgeEl.textContent = totalQty;
        badgeEl.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
        checkoutBtn.style.opacity = cart.length === 0 ? '0.4' : '1';
        checkoutBtn.style.pointerEvents = cart.length === 0 ? 'none' : 'auto';
    }

    if (grandTotalEl) {
        grandTotalEl.textContent = grandTotal.toLocaleString('uk-UA');
    }

    updatePaymentAmounts(grandTotal);

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 35px 10px; color: #a1a1aa !important;">
                <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px; color: #a1a1aa !important;">Кошик порожній</p>
                <p style="font-size: 0.85rem; color: #a1a1aa !important;">Оберіть похід або тур для бронювання</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map((item, index) => {
        const isTour = isTourItem(item);
        const qty = Number(item.qty || item.quantity || 1);
        const rawPrice = item.price ?? item.cost ?? 0;
        const price = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(/[^\d.]/g, '')) || 0;
        const itemTotal = price * qty;

        let infoText = '';
        if (isTour) {
            const tourDate = item.date || item.selectedDate || item.tourDate;
            infoText = tourDate ? `📅 ${tourDate}` : '';
        } else {
            const rentalTime = item.time || item.durationText || item.duration;
            infoText = rentalTime ? `⏱ ${rentalTime}` : '';
        }

        return `
            <div style="background: #18181b !important; border: 1px solid #27272a !important; border-radius: 12px; padding: 12px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <span style="background: ${isTour ? '#c2410c' : '#1e40af'} !important; color: #ffffff !important; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 4px; text-transform: uppercase;">
                            ${item.type || (isTour ? 'ПОХІД' : 'ОРЕНДА')}
                        </span>
                        <div style="font-weight: 700; color: #ffffff !important; font-size: 0.95rem;">
                            ${item.title || item.name || item.productName || 'Товар'}
                        </div>
                    </div>
                    <button type="button" onclick="window.removeCartItem(${index})" style="background: none; border: none; color: #ef4444 !important; font-size: 1.2rem; cursor: pointer; padding: 0 0 0 8px;">
                        &times;
                    </button>
                </div>
                ${infoText ? `<div style="font-size: 0.8rem; color: #10b981 !important; font-weight: 600;">${infoText}</div>` : ''}
                <div style="font-size: 0.85rem; color: #a1a1aa !important;">
                    ${price > 0 ? `${price} грн / ${isTour ? 'людина' : 'шт'}` : '<span style="color:#ef4444 !important;">Ціну не вказано</span>'}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                    <div style="display: flex; align-items: center; background: #09090b !important; border: 1px solid #27272a !important; border-radius: 6px; overflow: hidden;">
                        <button type="button" onclick="window.changeCartQty(${index}, -1)" style="background: none; border: none; color: #ffffff !important; width: 28px; height: 28px; cursor: pointer;">-</button>
                        <span style="padding: 0 8px; color: #ffffff !important; font-size: 0.85rem; font-weight: 600;">${qty}</span>
                        <button type="button" onclick="window.changeCartQty(${index}, 1)" style="background: none; border: none; color: #ffffff !important; width: 28px; height: 28px; cursor: pointer;">+</button>
                    </div>
                    <div style="font-weight: 800; color: #ffffff !important; font-size: 0.95rem;">
                        ${itemTotal} грн
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Синхронизируем чекаут даты после каждого рендера
    if (typeof window.syncTourDatesFromLocalStorage === 'function') {
        window.syncTourDatesFromLocalStorage();
    }
}
window.updateCartUI = updateCartUI;

// Железобетонная синхронизация дат чекаута с корзиной
window.syncTourDatesFromLocalStorage = function() {
    const select = document.getElementById('checkout-tour-date');
    if (!select) return;

    const cart = getCart();
    
    // Ищем поход в корзине
    const tourItem = cart.find(item => isTourItem(item));

    if (!tourItem) {
        select.innerHTML = '<option value="">-- Оберіть спочатку похід --</option>';
        return;
    }

    let tourId = tourItem.id || tourItem.tourId || tourItem.productId || tourItem.slug;
    
    // Страховка по названию
    if (!tourId && window.toursData) {
        const title = tourItem.title || tourItem.name || tourItem.productName;
        const found = Object.values(window.toursData).find(t => t.title === title);
        if (found) tourId = found.id;
    }

    const currentVal = tourItem.date || tourItem.selectedDate || tourItem.bookingDate || select.value;
    window.renderTourDateSelectOptions(tourId, select, currentVal);
};

// ==========================================================================
// 4. УПРАВЛЕНИЕ ШТОРКОЙ КОРЗИНЫ
// ==========================================================================
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer') || document.querySelector('.cart-drawer') || document.querySelector('.cart-modal');
    const overlay = document.getElementById('cart-overlay') || document.querySelector('.cart-overlay');

    if (drawer) {
        drawer.classList.add('active', 'open');
        drawer.style.display = 'block';
    }
    if (overlay) {
        overlay.classList.add('active', 'open');
        overlay.style.display = 'block';
    }

    updateCartUI();
    
    if (typeof window.goToDrawerStep === 'function') window.goToDrawerStep(1);
    else if (typeof goToDrawerStep === 'function') goToDrawerStep(1);
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer') || document.querySelector('.cart-drawer') || document.querySelector('.cart-modal');
    const overlay = document.getElementById('cart-overlay') || document.querySelector('.cart-overlay');

    if (drawer) {
        drawer.classList.remove('active', 'open');
        drawer.style.display = 'none';
    }
    if (overlay) {
        overlay.classList.remove('active', 'open');
        overlay.style.display = 'none';
    }
}
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;

// ==========================================================================
// 5. ДЕЙСТВИЯ С ТУРАМИ И МОДАЛКОЙ
// ==========================================================================
window.updateCheckoutTourDates = function(tourId) {
    const select = document.getElementById('checkout-tour-date');
    if (select) window.renderTourDateSelectOptions(tourId, select);
};

function openBookingDrawer(tourId) {
    bookTourAction(tourId || 'moon-tour');
}

function openTourDetails(tourId) {
    const tour = window.toursData[tourId];
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
            <div style="color: #94a3b8; font-size: 0.9rem;">🚣 Формат: ${tour.format || 'Груповий'}</div>
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
    const tour = window.toursData[tourId];
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

    saveCart(cart); // Это автоматически вызовет updateCartUI() и syncTourDatesFromLocalStorage()
    closeTourDetails();
    
    // Мгновенно открываем шторку
    openCartDrawer();
}

window.openBookingDrawer = openBookingDrawer;
window.openTourDetails = openTourDetails;
window.closeTourDetails = closeTourDetails;
window.bookTourAction = bookTourAction;

// ==========================================================================
// 6. ИНИЦИАЛИЗАЦИЯ И СОБЫТИЯ
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // 🎯 1. Первичная отрисовка корзины
    updateCartUI();

    // 🎯 2. Кнопка вызова корзины в шапке
    const navCartBtn = document.getElementById('nav-cart-btn');
    if (navCartBtn) {
        navCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    }

    // 🎯 3. Сохранение выбранной даты из селектора похода
    const tourDateSelect = document.getElementById('checkout-tour-date');
    if (tourDateSelect) {
        tourDateSelect.addEventListener('change', (e) => {
            const chosenDate = e.target.value;
            const cart = getCart();
            const tourItem = cart.find(item => isTourItem(item));

            if (tourItem) {
                tourItem.date = chosenDate;
                tourItem.bookingDate = chosenDate;
                saveCart(cart);
            }
        });
    }

    // 🎯 4. Обработка кликов внутри шторки (делегирование)
    document.addEventListener('click', (e) => {

        // Закрытие корзины
        if (e.target.closest('#close-cart-btn') || e.target.id === 'cart-overlay') {
            e.preventDefault();
            closeCartDrawer();
        }

        // Переход к шагу 2 (Анкета)
        if (e.target.closest('#btn-go-to-checkout')) {
            e.preventDefault();
            window.syncTourDatesFromLocalStorage();
            if (typeof window.goToDrawerStep === 'function') window.goToDrawerStep(2);
        }

        // Возврат на Шаг 1
        if (e.target.closest('#btn-back-to-cart')) {
            e.preventDefault();
            if (typeof window.goToDrawerStep === 'function') window.goToDrawerStep(1);
        }

        // Переход к Шагу 3 (Реквизиты)
        if (e.target.closest('#btn-show-requisites')) {
            e.preventDefault();
            const form = document.getElementById('tour-checkout-form');
            if (form && !form.checkValidity()) {
                form.reportValidity();
                return;
            }
            if (typeof window.goToDrawerStep === 'function') window.goToDrawerStep(3);
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

        // Закрытие окна успеха
        if (e.target.closest('#close-success-btn')) {
            const modal = document.getElementById('success-modal');
            if (modal) modal.style.display = 'none';
            closeCartDrawer();
            localStorage.removeItem('timurtour_cart');
            updateCartUI();
        }
    });

    // 🎯 5. Загрузка файла чека
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

    // 🎯 6. Финальная отправка чека
    const finalBtn = document.getElementById('btn-final-submit');
    if (finalBtn) {
        finalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('success-modal');
            if (modal) modal.style.display = 'flex';
        });
    }
});