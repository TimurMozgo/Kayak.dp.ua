// ==========================================================================
// 0. ДИНАМИЧЕСКИЕ СТИЛИ (ДЛЯ ПРАВИЛЬНОГО РОУТИНГА)
// ==========================================================================
if (!document.getElementById('app-dynamic-styles')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'app-dynamic-styles';
    styleTag.innerHTML = `
        .page-hidden-mode { display: none !important; }
        #orders-section { min-height: 80vh; padding: 20px 15px; width: 100%; box-sizing: border-box; }
    `;
    document.head.appendChild(styleTag);
}

// ==========================================================================
// 1. НАСТРОЙКИ N8N И TELEGRAM WEBAPP
// ==========================================================================
const N8N_WEBHOOK_URL = 'https://tiktiok.xyz/webhook/219a97d0-2e45-4479-947d-08702f215d52'; 
const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;

if (tg) {
    tg.expand();
    tg.ready();
}

// Проверка: позиция является туром/ивентом или обычным прокатом
function isTourItem(item) {
    if (!item) return false;
    const name = item.productName || item.title || item.name || '';
    const id = String(item.productId || item.id || '');
    
    return id.includes('tour') || 
           id.includes('kino') || 
           name.includes('🌕') || 
           name.includes('🎬') || 
           name.includes('🌅') || 
           name.toLowerCase().includes('тур') || 
           name.toLowerCase().includes('похід') || 
           name.toLowerCase().includes('магія');
}

// ==========================================================================
// 2. ХРАНИЛИЩЕ И ОТРИСОВКА ЗАКАЗОВ
// ==========================================================================
const ORDERS_KEY = 'kayakdpua_orders';

function saveOrderToHistory(bookingData) {
    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch (e) {
        orders = [];
    }

    const newOrder = {
        id: bookingData?.id || Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleDateString('uk-UA'),
        time: bookingData?.scheduledAt || bookingData?.time || '12 Серпня, 15:00',
        totalPrice: bookingData?.totalPrice || bookingData?.total || 1500,
        status: 'В обробці',
        items: (bookingData?.items && bookingData.items.length > 0) ? bookingData.items : [
            { productName: 'Каяк / SUP-борд', quantity: 1, durationText: '2 години' }
        ]
    };

    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    renderOrdersHistory();
}

function renderOrdersHistory() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    container.style.display = 'block';

    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch (e) {
        orders = [];
    }

    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
                <p style="font-size: 1rem; font-weight: 700; color: #1f2937;">У вас поки немає активних замовлень</p>
                <p style="font-size: 0.85rem; margin-top: 6px;">Перейдіть до каталогу, щоб зробити бронь!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => {
        const orderTimeText = order.time || order.scheduledAt || order.date || 'Час не вказано';
        
        return `
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px; margin-bottom: 12px; font-family: inherit; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">
                <span style="font-weight: 800; color: #111827; font-size: 0.95rem;">Замовлення #${order.id}</span>
            </div>
            
            <div style="font-size: 0.85rem; color: #4b5563; margin-bottom: 8px;">
                📅 <strong>Дата/Час броні:</strong> ${orderTimeText}
            </div>

            <div style="margin-bottom: 10px;">
                ${(order.items || []).map(item => {
                    const name = item.productName || item.title || 'Товар';
                    const isTour = isTourItem(item);

                    let rightSideInfo = '';
                    if (isTour) {
                        const tourDate = item.date || item.scheduledAt || (orderTimeText !== 'Час не вказано' ? orderTimeText : '');
                        rightSideInfo = tourDate ? `📅 ${tourDate}` : '';
                    } else {
                        rightSideInfo = item.duration || item.durationText || '';
                    }

                    return `
                        <div style="font-size: 0.85rem; color: #374151; display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                            <span>• ${name} ${item.quantity ? `x${item.quantity}` : ''}</span>
                            <span style="color: #6b7280; font-size: 0.8rem; margin-left: 8px; text-align: right;">${rightSideInfo}</span>
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6; padding-top: 8px; margin-top: 8px;">
                <span style="font-size: 0.8rem; color: #6b7280;">Разом до сплати:</span>
                <span style="font-size: 1.1rem; font-weight: 800; color: #16a34a;">${order.totalPrice || 0} грн</span>
            </div>
        </div>
        `;
    }).join('');
}

// ==========================================================================
// 3. УПРАВЛЕНИЕ ШТОРКОЙ КОРЗИНЫ
// ==========================================================================

function openCart() {
    const drawer = document.getElementById('cart-drawer') || 
                   document.getElementById('drawer') || 
                   document.querySelector('.cart-drawer') || 
                   document.querySelector('.cart-modal');
    if (drawer) {
        drawer.style.display = 'block';
        drawer.classList.add('active', 'open');
    }
    
    // 🎯 ДОБАВЬ ЭТУ СТРОКУ СЮДА:
    if (typeof syncTourDatesFromLocalStorage === 'function') {
        syncTourDatesFromLocalStorage();
    }

    goToDrawerStep(1);
    updateCartUI();
}

// ==========================================================================
// ЕДИНЫЙ ЦЕНТР УПРАВЛЕНИЯ ШАГАМИ ШТОРКИ
// ==========================================================================
function goToDrawerStep(stepNumber) {
    // 1. Проверка при переходе на Шаг 2 (Оформление)
    if (stepNumber === 2) {
        const currentCart = typeof getCart === 'function' ? getCart() : [];

        if (!currentCart || currentCart.length === 0) {
            alert("Ваш кошик порожній! Оберіть щось перед оформленням.");
            return; // Не пускаем дальше, если корзина реально пустая
        }
    }

    // 2. Сбрасываем видимость со всех шагов
    document.querySelectorAll('.drawer-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });

    // 3. Включаем нужный шаг
    if (stepNumber === 1) {
        const step = document.getElementById('drawer-step-cart');
        if (step) { step.classList.add('active'); step.style.display = 'block'; }
        const title = document.getElementById('drawer-title');
        if (title) title.textContent = 'Кошик';
    } 
    else if (stepNumber === 2) {
        // Всеядность: ищем или checkout, или form (что есть в HTML)
        const step = document.getElementById('drawer-step-checkout') || document.getElementById('drawer-step-form');
        if (step) { step.classList.add('active'); step.style.display = 'block'; }
        const title = document.getElementById('drawer-title');
        if (title) title.textContent = 'Оформлення';
    } 
    else if (stepNumber === 3) {
        const step = document.getElementById('drawer-step-payment');
        if (step) { step.classList.add('active'); step.style.display = 'block'; }
        const title = document.getElementById('drawer-title');
        if (title) title.textContent = 'Оплата та передплата';
    }
}

// Экспортируем на уровень window, чтобы inline onclick="goToDrawerStep(...)" из HTML точно ее видели
window.goToDrawerStep = goToDrawerStep;

// ==========================================================================
// 4. НАВИГАЦИЯ И ПЕРЕКЛЮЧЕНИЕ ТАБОВ
// ==========================================================================
function activateTab(tabId) {
    const targetTabEl = document.getElementById(tabId);
    if (!targetTabEl) return;

    document.querySelectorAll('.tab_content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.bottom_nav .nav_item').forEach(nav => nav.classList.remove('active'));

    targetTabEl.classList.add('active');
    const activeNav = document.querySelector(`.bottom_nav .nav_item[data-tab="${tabId}"]`);
    if (activeNav) activeNav.classList.add('active');

    if (tabId === 'tab-orders' && typeof renderOrdersHistory === 'function') {
        renderOrdersHistory();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');

    if (isHomePage) {
        const currentHash = window.location.hash.replace('#', '');
        if (currentHash === 'orders') {
            activateTab('tab-orders');
        } else if (currentHash === 'start') {
            activateTab('tab-start');
        } else {
            if (typeof renderOrdersHistory === 'function') renderOrdersHistory();
        }
    }

    const navItems = document.querySelectorAll('.bottom_nav .nav_item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetTabId = item.getAttribute('data-tab');
            const targetTabEl = document.getElementById(targetTabId);

            if (isHomePage && targetTabId && targetTabEl) {
                e.preventDefault();
                activateTab(targetTabId);
            } 
        });
    });

    const closeSuccessBtn = document.getElementById('close-success-btn');
    const successModal = document.getElementById('success-modal');

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            if (successModal) {
                successModal.style.display = 'none';
            }

            if (isHomePage && typeof activateTab === 'function') {
                activateTab('tab-orders');
            } else {
                window.location.href = './index.html#orders';
            }
        });
    }
});

// ==========================================================================
// 5. КОРЗИНА И РАСЧЕТЫ
// ==========================================================================
const CART_KEY = 'timurtour_cart';

function getCart() {
    const primaryCart = localStorage.getItem(CART_KEY);
    if (primaryCart) return JSON.parse(primaryCart);
    
    const legacyCart = localStorage.getItem('myCart');
    if (legacyCart) {
        const parsedLegacy = JSON.parse(legacyCart);
        localStorage.setItem(CART_KEY, JSON.stringify(parsedLegacy));
        localStorage.removeItem('myCart');
        return parsedLegacy;
    }
    return [];
}

// СТАТИЧНЫЙ ВЫБОР ОПРЕДЕЛЕННОЙ ДАТЫ ДЛЯ РАЗДЕЛА ПОХОДЫ 

// 1. Вспомогательный генератор разрешенных дат
function getAvailableDatesForTour(tourId) {
    if (typeof toursData === 'undefined' || !toursData[tourId]) return [];
    const tour = toursData[tourId];

    const todayStr = new Date().toISOString().split('T')[0];

    // Точечные даты (customDates)
    if (tour.customDates && tour.customDates.length > 0) {
        return tour.customDates.filter(date => date >= todayStr);
    }

    // Дни недели (allowedDays)
    if (tour.allowedDays && tour.allowedDays.length > 0) {
        const validDates = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);

            if (tour.allowedDays.includes(d.getDay())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                validDates.push(`${year}-${month}-${day}`);
            }
        }
        return validDates;
    }

    return [];
}

// 2. Функция подгрузки валидных дат с ВОССТАНОВЛЕНИЕМ выбранной даты
function updateCheckoutTourDates(tourId, savedDate = '') {
    const tourDateInput = document.getElementById('checkout-tour-date');
    if (!tourDateInput) return;

    const availableDates = getAvailableDatesForTour(tourId);
    const daysMap = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

    // Если дата уже была выбрана в DOM — запоминаем её
    const currentDateVal = savedDate || tourDateInput.value;

    tourDateInput.innerHTML = '<option value="">-- Оберіть дату походу --</option>';
    
    availableDates.forEach(dateStr => {
        const [y, m, d] = dateStr.split('-');
        // Безбаговый парсинг локальной даты
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        const dayName = daysMap[dateObj.getDay()];
        
        const option = document.createElement('option');
        option.value = dateStr;
        option.textContent = `${d}.${m}.${y} (${dayName})`;

        // ЕСЛИ ЭТО ВЫБРАННАЯ ДАТА — ДЕЛАЕМ ЕЁ SELECTED!
        if (dateStr === currentDateVal) {
            option.selected = true;
        }

        tourDateInput.appendChild(option);
    });
}

function syncTourDatesFromLocalStorage() {
    const select = document.getElementById('checkout-tour-date');
    if (!select) return;

    // Читаем правильный ключ корзины
    const cart = JSON.parse(localStorage.getItem('timurtour_cart') || '[]');
    
    // Ищем элемент похода (используем встроенную isTourItem или проверку по type)
    const tourItem = cart.find(item => {
        if (typeof isTourItem === 'function') return isTourItem(item);
        const t = String(item.type || '').toUpperCase();
        return t === 'TOUR' || t === 'ПОХІД' || t === 'POHID';
    });

    if (!tourItem) {
        select.innerHTML = '<option value="">-- Оберіть спочатку похід --</option>';
        return;
    }

    // Вытаскиваем ID изо всех возможных полей
    let tourId = tourItem.id || tourItem.tourId || tourItem.productId || tourItem.slug;

    // Страховка: если ID всё равно не найден, ищем в window.toursData по совпадению названия
    if (!tourId && window.toursData) {
        const itemTitle = tourItem.title || tourItem.name || tourItem.productName;
        const foundTour = Object.values(window.toursData).find(t => t.title === itemTitle);
        if (foundTour) tourId = foundTour.id;
    }

    // Получаем даты
    const dates = (typeof window.getAvailableDatesForTour === 'function' && tourId) 
        ? window.getAvailableDatesForTour(tourId) 
        : [];

    if (dates.length > 0) {
        const daysMap = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        let html = '<option value="">-- Оберіть дату походу --</option>';

        const currentDateVal = tourItem.date || tourItem.selectedDate || tourItem.bookingDate || select.value;

        dates.forEach(dateStr => {
            const [y, m, d] = dateStr.split('-');
            const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            const dayName = daysMap[dateObj.getDay()];
            
            const isSelected = (dateStr === currentDateVal) ? 'selected' : '';
            html += `<option value="${dateStr}" ${isSelected}>${d}.${m}.${y} (${dayName})</option>`;
        });

        select.innerHTML = html;
    } else {
        select.innerHTML = '<option value="">-- Немає доступних дат --</option>';
    }
}

// 4. Сохранение корзины
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (typeof updateCartUI === 'function') updateCartUI();
    syncTourDatesFromLocalStorage();
}

// 5. ГЛАВНЫЙ ФИКС: Слушатель выбора даты пользователем
function initTourDateListener() {
    const tourDateSelect = document.getElementById('checkout-tour-date');
    if (!tourDateSelect) return;

    tourDateSelect.addEventListener('change', (e) => {
        const chosenDate = e.target.value;
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        
        const tourInCart = cart.find(item => item.type === 'TOUR' || (typeof toursData !== 'undefined' && toursData[item.id]));
        
        if (tourInCart) {
            // Пишем дату прямо в товар корзины!
            tourInCart.bookingDate = chosenDate;
            // Сохраняем напрямую в localStorage
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        }
    });
}

// 🎯 Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    syncTourDatesFromLocalStorage();
    initTourDateListener();
});

// ДОБАВЛЕНИЕ В КОРЗИНУ

function addToCart(itemData) {
    let cart = getCart();
    
    const rawPrice = itemData.price ?? itemData.cost ?? itemData.numericPrice ?? 0;
    const cleanPrice = typeof rawPrice === 'number' 
        ? rawPrice 
        : parseFloat(String(rawPrice).replace(/[^\d.]/g, '')) || 0;

    // Гарантируем уникальный ID
    const itemId = String(itemData.id || itemData.productId || itemData.tourId || Date.now());
    const itemType = String(itemData.type || itemData.category || 'ОРЕНДА').toUpperCase();
    const itemTitle = itemData.title || itemData.name || itemData.productName || 'Товар';
    
    // Безопасный парсинг количества
    const parsedQty = parseInt(itemData.qty || itemData.quantity || itemData.count, 10);
    const itemQty = (!isNaN(parsedQty) && parsedQty > 0) ? parsedQty : 1;

    const existingIndex = cart.findIndex(item => String(item.id) === itemId && item.type === itemType);

    if (existingIndex > -1) {
        cart[existingIndex].qty += itemQty;
    } else {
        cart.push({
            id: itemId,
            title: itemTitle,
            price: cleanPrice,
            type: itemType,
            qty: itemQty,
            duration: itemData.duration || '',
            img: itemData.img || '',
            date: itemData.date || itemData.selectedDate || itemData.tourDate || '',
            time: itemData.time || itemData.selectedTime || itemData.rentalTime || ''
        });
    }

    saveCart(cart);
    
    // Вызываем открытие корзины
    if (typeof openCart === 'function') {
        openCart();
    }
}

function changeCartQty(identifier, delta, type) {
    let cart = getCart();
    let index = -1;

    if (typeof identifier === 'number' && identifier < cart.length) {
        index = identifier;
    } else {
        index = cart.findIndex(item => String(item.id) === String(identifier) && (type ? item.type === type : true));
    }

    if (index > -1) {
        cart[index].qty = Number(cart[index].qty || 1) + delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
    }
}

function removeCartItem(identifier, type) {
    let cart = getCart();
    if (typeof identifier === 'number' && identifier < cart.length) {
        cart.splice(identifier, 1);
    } else {
        cart = cart.filter(item => !(String(item.id) === String(identifier) && (type ? item.type === type : true)));
    }
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem('myCart');
    updateCartUI();
}

function updateCartUI() {
    const cart = getCart();

    const badgeEl = document.getElementById('cart-badge') || document.querySelector('.cart-badge');
    
    const container = document.getElementById('cart-items-container') || 
                      document.getElementById('drawer-cart-items-container') || 
                      document.getElementById('cart-items') || 
                      document.getElementById('drawer-items') ||
                      document.querySelector('.drawer-cart-items') ||
                      document.querySelector('.cart-drawer-items');

    const grandTotalEl = document.getElementById('cart-grand-total') || 
                         document.getElementById('drawer-cart-grand-total') || 
                         document.getElementById('cart-total-price');

    const checkoutBtn = document.getElementById('btn-go-to-checkout');

    let totalQty = 0;
    let grandTotal = 0;

    cart.forEach(item => {
        const qty = Number(item.qty || item.quantity || 1);
        const rawPrice = item.price ?? item.cost ?? item.numericPrice ?? 0;
        const cleanPrice = typeof rawPrice === 'number' 
            ? rawPrice 
            : parseFloat(String(rawPrice).replace(/[^\d.]/g, '')) || 0;

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

    if (typeof updatePaymentSummary === 'function') {
        updatePaymentSummary();
    }

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
                        <span style="background: ${isTour ? '#c2410c' : '#1e40af'} !important; color: #ffffff !important; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 4px; letter-spacing: 0.5px; text-transform: uppercase;">
                            ${item.type || (isTour ? 'ПОХІД' : 'ОРЕНДА')}
                        </span>
                        <div style="font-weight: 700; color: #ffffff !important; font-size: 0.95rem; line-height: 1.3;">
                            ${item.title || item.name || item.productName || 'Товар'}
                        </div>
                    </div>
                    <button type="button" onclick="window.removeCartItem(${index}, '${item.type || ''}')" style="background: none; border: none; color: #ef4444 !important; font-size: 1.2rem; cursor: pointer; padding: 0 0 0 8px; line-height: 1;">
                        &times;
                    </button>
                </div>

                ${infoText ? `<div style="font-size: 0.8rem; color: #10b981 !important; font-weight: 600;">${infoText}</div>` : ''}

                <div style="font-size: 0.85rem; color: #a1a1aa !important;">
                    ${price > 0 ? `${price} грн / ${isTour ? 'людина' : 'шт'}` : '<span style="color:#ef4444 !important;">Ціну не вказано</span>'}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                    <div style="display: flex; align-items: center; background: #09090b !important; border: 1px solid #27272a !important; border-radius: 6px; overflow: hidden;">
                        <button type="button" onclick="window.changeCartQty(${index}, -1, '${item.type || ''}')" style="background: none; border: none; color: #ffffff !important; width: 28px; height: 28px; cursor: pointer; font-weight: bold;">-</button>
                        <span style="padding: 0 8px; color: #ffffff !important; font-size: 0.85rem; font-weight: 600;">${qty}</span>
                        <button type="button" onclick="window.changeCartQty(${index}, 1, '${item.type || ''}')" style="background: none; border: none; color: #ffffff !important; width: 28px; height: 28px; cursor: pointer; font-weight: bold;">+</button>
                    </div>
                    <div style="font-weight: 800; color: #ffffff !important; font-size: 0.95rem;">
                        ${itemTotal} грн
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // 🎯 ВОТ ЭТА СТРОКА РЕШАЕТ ВСЕ ПРОБЛЕМЫ С ДАТАМИ:
    if (typeof syncTourDatesFromLocalStorage === 'function') {
        syncTourDatesFromLocalStorage();
    }
}

function updatePaymentSummary() {
    const cart = getCart() || [];
    const total = cart.reduce((sum, item) => {
        const rawPrice = item.price ?? item.cost ?? item.numericPrice ?? 0;
        const cleanPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(/[^\d.]/g, '')) || 0;
        const qty = Number(item.qty || item.quantity || 1);
        return sum + (cleanPrice * qty);
    }, 0);

    const prepay = Math.round(total * 0.3); // 30%
    const rest = total - prepay;            // 70%

    const totalEl = document.getElementById('payment-total-full');
    const prepayEl = document.getElementById('payment-prepay-amount');
    const restEl = document.getElementById('payment-rest-amount');

    if (totalEl) totalEl.textContent = `${total.toLocaleString('uk-UA')} грн`;
    if (prepayEl) prepayEl.textContent = `${prepay.toLocaleString('uk-UA')} грн`;
    if (restEl) restEl.textContent = `${rest.toLocaleString('uk-UA')} грн`;
}

// ==========================================================================
// 6. ЭКСПОРТ В ГЛОБАЛЬНЫЙ SCOPE (WINDOW)
// ==========================================================================
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.changeCartQty = changeCartQty;
window.changeQty = changeCartQty;
window.removeCartItem = removeCartItem;
window.clearCart = clearCart;
window.updateCartUI = updateCartUI;
window.updatePaymentSummary = updatePaymentSummary;

window.openCart = openCart;
window.closeCart = closeCart;
window.goToDrawerStep = goToDrawerStep;
window.activateTab = activateTab;

window.saveOrderToHistory = saveOrderToHistory;
window.renderOrdersHistory = renderOrdersHistory;

// ==========================================================================
// 5. УПРАВЛЕНИЕ ШТОРКОЙ, МОДАЛКАМИ И РОУТИНГ
// ==========================================================================
function goToStep(stepNumber) {
    const step1 = document.getElementById('drawer-step-cart');
    const step2 = document.getElementById('drawer-step-form');
    const step3 = document.getElementById('drawer-step-pay') || document.getElementById('drawer-step-payment');

    if (step1) step1.style.display = stepNumber === 1 ? 'block' : 'none';
    if (step2) step2.style.display = stepNumber === 2 ? 'block' : 'none';
    if (step3) step3.style.display = stepNumber === 3 ? 'block' : 'none';
}

function openCart() {
    const drawer = document.getElementById('cart-drawer') || document.querySelector('.cart-drawer') || document.getElementById('drawer-cart');
    if (drawer) {
        drawer.classList.add('active');
        drawer.style.display = 'block';
    }
    goToStep(1);
    updateCartUI();
}

function closeCart() {
    const drawer = document.getElementById('cart-drawer') || document.querySelector('.cart-drawer') || document.getElementById('drawer-cart');
    if (drawer) {
        drawer.classList.remove('active');
        drawer.style.display = 'none';
    }
}

function switchPage(targetPage) {
    const ordersSection = document.getElementById('orders-section') || document.getElementById('orders-container-wrapper') || document.getElementById('orders-container');
    const pageBlocks = document.querySelectorAll('header, main, footer, .main-content, .catalog-section, .hero-section, .features-section');

    if (targetPage === 'orders') {
        pageBlocks.forEach(block => {
            if (block !== ordersSection && !block.contains(ordersSection)) {
                block.classList.add('page-hidden-mode');
            }
        });
        if (ordersSection) {
            ordersSection.classList.remove('page-hidden-mode');
            ordersSection.style.display = 'block';
        }
        renderOrders();
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } else {
        pageBlocks.forEach(block => {
            block.classList.remove('page-hidden-mode');
        });
        if (ordersSection) {
            ordersSection.style.display = 'none';
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
}

// ==========================================================================
// УНИВЕРСАЛЬНЫЙ ПОКАЗ МОДАЛКИ И АВТО-СОХРАНЕНИЕ
// ==========================================================================

function showSuccessModal(bookingData) {
    let finalOrderData = bookingData;

    // 1. Если данные не передали или передали без товаров — сама авто-собирает данные из корзины
    if (!finalOrderData || !finalOrderData.items || finalOrderData.items.length === 0) {
        // Делаем глубокую копию текущей корзины
        const cartSnapshot = (typeof cart !== 'undefined' && Array.isArray(cart)) 
            ? JSON.parse(JSON.stringify(cart)) 
            : [];
        
        // Считаем итоговую сумму
        let total = 0;
        if (typeof currentTotalPrice !== 'undefined' && currentTotalPrice > 0) {
            total = currentTotalPrice;
        } else if (cartSnapshot.length > 0) {
            total = cartSnapshot.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
        }

        finalOrderData = {
            id: Math.floor(1000 + Math.random() * 9000),
            scheduledAt: document.getElementById('selected-date-time')?.textContent?.trim() || 'Найближчий час',
            totalPrice: total,
            items: cartSnapshot
        };
    }

    // 2. СНАЧАЛА СОХРАНЯЕМ В ИСТОРИЮ (пока корзина еще не очищена!)
    if (typeof saveOrderToHistory === 'function') {
        saveOrderToHistory(finalOrderData);
    }

    // 3. ПОКАЗЫВАЕМ ПЛАШКУ УСПЕХА
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'flex';
    }

    // 4. И ТОЛЬКО ТЕПЕРЬ ОЧИЩАЕМ КОРЗИНУ
    if (typeof cart !== 'undefined') {
        cart = [];
        if (typeof updateCartUI === 'function') updateCartUI();
        if (typeof renderCartDrawer === 'function') renderCartDrawer();
    }
}

// 2. Функция закрытия модалки + редирект в заказы
function hideSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }

    // Проверяем, где находимся
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/');

    if (isHomePage && typeof activateTab === 'function') {
        // Если уже на главной — сразу переключаем таб
        activateTab('tab-orders');
    } else {
        // Если в каталоге — отправляем на главную в раздел заказов
        window.location.href = './index.html#orders';
    }
}

// 3. Автоматическая привязка к кнопке "Чудово"
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('close-success-btn');
    if (closeBtn) {
        // Убираем старые слушатели, вешаем чистый вызов
        closeBtn.removeEventListener('click', hideSuccessModal);
        closeBtn.addEventListener('click', hideSuccessModal);
    }
});

// ==========================================================================
// 6. РЕНДЕР ИСТОРИИ ЗАКАЗОВ
// ==========================================================================
function renderOrders() {
    userOrders = JSON.parse(localStorage.getItem('timurtour_orders')) || [];
    const container = document.getElementById('orders-container');
    if (!container) return;

    if (!userOrders || userOrders.length === 0) {
        container.innerHTML = `
            <div class="orders_empty" style="text-align: center; padding: 60px 20px;">
                <div class="empty_icon" style="font-size: 3rem; margin-bottom: 10px;">🛶</div>
                <h3>У вас поки немає замовлень</h3>
                <p style="color: #a1a1aa; margin-bottom: 20px;">Оберіть каяк у каталозі та вирушайте у яскраву пригоду на воді!</p>
                <a href="#" class="btn_to_catalog" onclick="switchPage('main'); return false;" style="display: inline-block; padding: 12px 24px; background: #22c55e; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">Перейти до каталогу</a>
            </div>
        `;
        return;
    }

    let cardsHtml = '<div class="orders_list">';
    userOrders.forEach((order) => {
        const isConfirmed = order.status === 'confirmed' || order.status === 'active';
        const badgeClass = isConfirmed ? 'badge_confirmed' : 'badge_completed';
        const badgeText = isConfirmed ? '🟢 Підтверджено' : '🏁 Завершено';
        
        const btnHtml = isConfirmed 
            ? `<button class="order_btn_details" onclick="openLocation('${order.id}')">Маршрут / Локація</button>`
            : `<button class="order_btn_repeat" onclick="repeatBooking('${order.productId}')">Замовити знову</button>`;

        cardsHtml += `
            <div class="order_card">
                <div class="order_card_header">
                    <span class="order_id">№ ${order.id}</span>
                    <span class="order_badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="order_card_body">
                    <div class="order_thumb">
                        <img src="${order.img || './img/LiteRowing_9.5.webp'}" alt="${order.productName}">
                    </div>
                    <div class="order_details">
                        <h3 class="order_product_title">${order.productName}</h3>
                        <div class="order_meta"><span>🛶 ${order.quantity || 1} шт.</span></div>
                        <div class="order_time_box">
                            📅 <strong>${order.date || 'Дата не вказана'}</strong> ${order.time ? 'о <strong>' + order.time + '</strong>' : ''}
                        </div>
                    </div>
                </div>
                <div class="order_card_footer">
                    <div class="order_price_box">
                        <span class="price_label">${isConfirmed ? 'До сплати:' : 'Сплачено:'}</span>
                        <span class="price_val">${order.totalPrice} грн</span>
                    </div>
                    ${btnHtml}
                </div>
            </div>
        `;
    });
    cardsHtml += '</div>';
    container.innerHTML = cardsHtml;
}

// ==========================================================================
// 7. ЛОГИКА ВЫБОРА ДАТЫ И ВРЕМЕНИ
// ==========================================================================
function initDateAndTime() {
    const rentalDateInput = document.getElementById('checkout-rental-date');
    const tourDateInput = document.getElementById('checkout-tour-date');
    const timeHiddenInput = document.getElementById('checkout-rental-time');
    
    // Поддерживаем оба возможных ID контейнера
    const chipsContainer = document.getElementById('time-chips-container') || document.getElementById('time-slots-grid');

    // 1. СНАЧАЛА БЛОКИРУЕМ ПРОШЛЫЕ ДАТЫ (по локальному времени)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (rentalDateInput) rentalDateInput.min = todayStr;
    if (tourDateInput) tourDateInput.min = todayStr;

    // 2. ЕСЛИ КОНТЕЙНЕРА ВРЕМЕНИ НЕТ — ВЫХОДИМ (но календарь УЖЕ заблокирован!)
    if (!chipsContainer) return;

    const timeSlots = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
        "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
        "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
    ];

    function renderTimeSlots() {
        chipsContainer.innerHTML = '';
        const selectedDate = rentalDateInput ? rentalDateInput.value : '';
        
        const currentNow = new Date();
        const currentYear = currentNow.getFullYear();
        const currentMonth = String(currentNow.getMonth() + 1).padStart(2, '0');
        const currentDay = String(currentNow.getDate()).padStart(2, '0');
        const currentDateStr = `${currentYear}-${currentMonth}-${currentDay}`;

        const currentHour = currentNow.getHours();
        const currentMinute = currentNow.getMinutes();
        const isToday = (selectedDate === currentDateStr);

        timeSlots.forEach(time => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.classList.add('time-chip', 'time-slot-btn');
            chip.textContent = time;

            const [optHour, optMinute] = time.split(':').map(Number);

            // Если дата совпадает с сегодняшней и время уже прошло — блочим
            if (isToday && (optHour < currentHour || (optHour === currentHour && optMinute <= currentMinute))) {
                chip.classList.add('disabled');
                chip.disabled = true;
            } else {
                chip.addEventListener('click', () => {
                    chipsContainer.querySelectorAll('.time-chip, .time-slot-btn').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    if (timeHiddenInput) timeHiddenInput.value = time;
                });
            }

            if (timeHiddenInput && timeHiddenInput.value === time && !chip.classList.contains('disabled')) {
                chip.classList.add('active');
            }

            chipsContainer.appendChild(chip);
        });

        const activeChip = chipsContainer.querySelector('.active');
        if (!activeChip && timeHiddenInput) timeHiddenInput.value = '';
    }

    if (rentalDateInput) rentalDateInput.addEventListener('change', renderTimeSlots);
    renderTimeSlots();
}

// ==========================================================================
// 8. ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ И СЛУШАТЕЛИ КЛИКОВ
// ==========================================================================
function initApp() {
    const ordersSection = document.getElementById('orders-section') || document.getElementById('orders-container-wrapper') || document.getElementById('orders-container');
    if (ordersSection) ordersSection.style.display = 'none';

    renderOrders();
    updateCartUI();
    initDateAndTime();

    const phoneInput = document.getElementById('checkout-phone') || document.getElementById('checkout-phone-number');
    if (phoneInput) {
        phoneInput.addEventListener('focus', () => {
            if (!phoneInput.value) phoneInput.value = '+380';
        });
        phoneInput.addEventListener('input', () => {
            if (!phoneInput.value.startsWith('+380')) phoneInput.value = '+380';
        });
    }

    // ЕДИНЫЙ ГЛОБАЛЬНЫЙ СЛУШАТЕЛЬ КЛИКОВ (ДЕЛЕГИРОВАНИЕ)
    document.addEventListener('click', (e) => {
        
        // Переключение страниц
        if (e.target.closest('#nav-orders-btn, #btn-my-orders, [data-page="orders"], .btn-my-orders')) {
            e.preventDefault();
            switchPage('orders');
            return;
        }
        if (e.target.closest('#nav-home-btn, #btn-to-catalog, [data-page="catalog"], .btn_to_catalog')) {
            e.preventDefault();
            switchPage('main');
            return;
        }

        // Добавление в корзину
        const bookBtn = e.target.closest('#cta-order-btn, #cta-btn, [data-action="book"], .add-to-cart');
        if (bookBtn) {
            e.preventDefault();
            const itemId = bookBtn.dataset.id || bookBtn.getAttribute('data-id');
            const itemTitle = bookBtn.dataset.title || bookBtn.getAttribute('data-title') || bookBtn.dataset.name;
            const itemPrice = bookBtn.dataset.price || bookBtn.getAttribute('data-price');
            const itemType = bookBtn.dataset.type || bookBtn.getAttribute('data-type') || 'ОРЕНДА';
            const itemImg = bookBtn.dataset.img || bookBtn.getAttribute('data-img');

            if (itemTitle || itemPrice || itemId) {
                addToCart({
                    id: itemId || Date.now(),
                    title: itemTitle || 'Замовлення каяка',
                    price: Number(itemPrice) || 0,
                    type: itemType,
                    img: itemImg || ''
                });
            }
            return;
        }

        // Шторка корзины
        if (e.target.closest('#open-cart-btn, #nav-cart-btn, .cart-icon, .btn-open-cart')) {
            e.preventDefault();
            openCart();
            return;
        }
        if (e.target.closest('#close-cart-btn, #btn-close-cart') || e.target.id === 'cart-overlay') {
            e.preventDefault();
            closeCart();
            return;
        }

        // Навигация по шагам оформления
        if (e.target.closest('#btn-go-to-checkout, .checkout-btn, #open-checkout')) {
            e.preventDefault();
            const cart = getCart();
            if (!cart || cart.length === 0) {
                alert("Ваш кошик порожній!");
                return;
            }
            setTimeout(updatePaymentSummary, 50); // Легкий таймаут для гарантии рендера
            goToStep(2);
            return;
        }
        if (e.target.closest('#btn-go-to-payment, .btn-submit-booking, #btn-show-requisites')) {
            e.preventDefault();
            const fullnameInput = document.getElementById('checkout-fullname');
            if (fullnameInput && !fullnameInput.value.trim()) {
                alert("Будь ласка, вкажіть ваше ім'я та прізвище");
                fullnameInput.focus();
                return;
            }
            const phone = phoneInput ? phoneInput.value.trim() : '';
            if (!phone || phone.length < 7) {
                alert("Будь ласка, вкажіть контактний номер телефону!");
                if (phoneInput) phoneInput.focus();
                return;
            }
            updatePaymentSummary();
            goToStep(3);
            return;
        }
        if (e.target.closest('#btn-back-to-cart')) {
            e.preventDefault();
            goToStep(1);
            return;
        }
        if (e.target.closest('#btn-back-to-form')) {
            e.preventDefault();
            goToStep(2);
            return;
        }
        if (e.target.closest('#close-success-btn')) {
            e.preventDefault();
            hideSuccessModal();
            return;
        }

        // Копирование реквизитов
        const copyCard = e.target.closest('.copy-card');
        if (copyCard) {
            e.preventDefault();
            const targetId = copyCard.dataset.copyTarget;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                navigator.clipboard.writeText(targetEl.textContent.trim()).then(() => {
                    const icon = copyCard.querySelector('.copy-icon');
                    const originalClass = icon ? icon.className : '';
                    const originalColor = icon ? icon.style.color : '';

                    if (icon) {
                        icon.className = 'copy-icon fa-solid fa-check';
                        icon.style.color = '#22c55e';
                    }
                    copyCard.style.borderColor = '#22c55e';

                    setTimeout(() => {
                        if (icon) {
                            icon.className = originalClass;
                            icon.style.color = originalColor;
                        }
                        copyCard.style.borderColor = '#444444';
                    }, 1500);
                });
            }
            return;
        }
    });

    // ==========================================================================
    // 9. ЗАГРУЗКА ЧЕКА И ОТПРАВКА В N8N
    // ==========================================================================
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('receipt-file-input');
    const idleState = document.getElementById('upload-idle-state');
    const previewState = document.getElementById('upload-preview-state');
    const previewImg = document.getElementById('receipt-preview-img');

    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', (e) => {
            if (e.target !== fileInput) fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (previewImg) previewImg.src = event.target.result;
                    if (idleState) idleState.style.display = 'none';
                    if (previewState) previewState.style.display = 'block';
                    uploadZone.style.borderColor = '#22c55e';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const finalBtn = document.getElementById('btn-final-submit');
    if (finalBtn) {
        finalBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const cart = getCart();
            if (!cart || cart.length === 0) {
                alert("Ваш кошик порожній!");
                return;
            }

            if (!fileInput || !fileInput.files[0]) {
                alert("Будь ласка, прикріпіть скріншот чека про оплату!");
                return;
            }

            finalBtn.disabled = true;
            finalBtn.textContent = 'Надсилання...';

            let totalPrice = 0;
            cart.forEach(i => totalPrice += (i.price * i.qty));

            const expRadio = document.querySelector('input[name="experience"]:checked');
            const orderId = String(Math.floor(100000 + Math.random() * 900000));
            const userPhone = phoneInput ? phoneInput.value : '';

            const rentalDate = document.getElementById('checkout-rental-date')?.value || '';
            const rentalTime = document.getElementById('checkout-rental-time')?.value || '';
            const tourDate = document.getElementById('checkout-tour-date')?.value || '';
            const todayStr = new Date().toISOString().split('T')[0];

            const cartWithDates = cart.map(item => {
                const isTour = String(item.type).toUpperCase().includes('ПОХІД') || 
                               String(item.type).toUpperCase().includes('TOUR') || 
                               String(item.type).toUpperCase().includes('ТУР');
                return {
                    ...item,
                    date: isTour ? (tourDate || todayStr) : (rentalDate || todayStr),
                    time: isTour ? 'За розкладом' : (rentalTime || 'Час не вказано')
                };
            });

            const formData = new FormData();
            formData.append('receipt_file', fileInput.files[0]);
            formData.append('order_id', orderId);
            formData.append('created_at', new Date().toISOString());
            formData.append('fullname', document.getElementById('checkout-fullname')?.value || '');
            formData.append('phone', userPhone);
            formData.append('rental_date', rentalDate);
            formData.append('rental_time', rentalTime);
            formData.append('tour_date', tourDate);
            formData.append('source', document.getElementById('checkout-source')?.value || '');
            formData.append('experience', expRadio ? expRadio.value : '');
            formData.append('boats', document.getElementById('checkout-boats')?.value || '');
            formData.append('participants', document.getElementById('checkout-participants')?.value || '');
            formData.append('total_price', totalPrice);
            formData.append('cart_items', JSON.stringify(cartWithDates));

            if (typeof tg !== 'undefined' && tg?.initDataUnsafe?.user) {
                formData.append('telegram_user', JSON.stringify(tg.initDataUnsafe.user));
            }

            try {
                if (typeof N8N_WEBHOOK_URL !== 'undefined' && N8N_WEBHOOK_URL) {
                    await fetch(N8N_WEBHOOK_URL, {
                        method: 'POST',
                        body: formData
                    });
                }
            } catch (err) {
                console.warn("Фоновое уведомление сети:", err);
            }

            // Дописываем хвост кода: фиксация профита в историю
            const primaryItem = cartWithDates[0];
            const newBooking = {
                id: orderId,
                productId: primaryItem.id,
                productName: primaryItem.title,
                quantity: primaryItem.qty,
                totalPrice: totalPrice,
                date: primaryItem.date,
                time: primaryItem.time,
                img: primaryItem.img,
                status: 'active'
            };
            
            addNewOrder(newBooking);

            // Очищаем кэш и показываем успех
            clearCart();
            closeCart();
            showSuccessModal();

            // Возвращаем кнопку в дефолт
            finalBtn.textContent = 'Надіслати скріншот';
            finalBtn.disabled = false;
        });
    }
}

// Запуск после полной загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

