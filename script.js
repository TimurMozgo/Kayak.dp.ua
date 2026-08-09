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
    const name = item.productName || item.title || item.name || '';
    const id = item.productId || item.id || '';
    
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
// ХРАНИЛИЩЕ И ОТРИСОВКА ЗАКАЗОВ (ЖЕЛЕЗОБЕТОН)
// ==========================================================================

const ORDERS_KEY = 'kayakdpua_orders';

// 1. Сохранение заказа в LocalStorage
function saveOrderToHistory(bookingData) {
    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch (e) {
        orders = [];
    }

    // Собираем надежный объект заказа (с фоллбеками на случай пустых данных)
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

    // Закидываем НАВЕРХ массива (чтобы свежий был первым)
    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Сразу же принудительно перерисовываем
    renderOrdersHistory();
}

// ==========================================================================
// ОТРИСОВКА ЗАКАЗОВ (СВЕТЛАЯ ТЕМА, БЕЗ СТАТУСОВ)
// ==========================================================================

function renderOrdersHistory() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    // Принудительно отображаем контейнер
    container.style.display = 'block';

    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem('kayakdpua_orders')) || [];
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
            
            <!-- Шапка карточки без статусов -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">
                <span style="font-weight: 800; color: #111827; font-size: 0.95rem;">Замовлення #${order.id}</span>
            </div>
            
            <div style="font-size: 0.85rem; color: #4b5563; margin-bottom: 8px;">
                📅 <strong>Дата/Час броні:</strong> ${orderTimeText}
            </div>

            <!-- Список товаров -->
            <div style="margin-bottom: 10px;">
                ${(order.items || []).map(item => {
                    const name = item.productName || item.title || 'Товар';
                    
                    const isTour = (item.productId && (item.productId.includes('tour') || item.productId.includes('kino'))) ||
                                   name.includes('🌕') || 
                                   name.includes('🎬') || 
                                   name.toLowerCase().includes('тур') || 
                                   name.toLowerCase().includes('похід');

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

            <!-- Итог -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6; padding-top: 8px; margin-top: 8px;">
                <span style="font-size: 0.8rem; color: #6b7280;">Разом до сплати:</span>
                <span style="font-size: 1.1rem; font-weight: 800; color: #16a34a;">${order.totalPrice || 0} грн</span>
            </div>
        </div>
        `;
    }).join('');
}

// ==========================================================================
// 2. УПРАВЛЕНИЕ ШТОРКОЙ КОРЗИНЫ И ШАГАМИ
// ==========================================================================

function goToDrawerStep(stepNumber) {
    document.querySelectorAll('.drawer-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = ''; 
    });

    if (stepNumber === 1) {
        const step = document.getElementById('drawer-step-cart');
        if (step) step.classList.add('active');
        const title = document.getElementById('drawer-title');
        if (title) title.textContent = 'Кошик';
    } 
    else if (stepNumber === 2) {
        const step = document.getElementById('drawer-step-checkout');
        if (step) step.classList.add('active');
        const title = document.getElementById('drawer-title');
        if (title) title.textContent = 'Оформлення';
    } 
    else if (stepNumber === 3) {
        const step = document.getElementById('drawer-step-payment');
        if (step) step.classList.add('active');
        const title = document.getElementById('drawer-title');
        if (title) title.textContent = 'Оплата та передплата';
    }
}

// ==========================================================================
// 3. НАВИГАЦИЯ И ПЕРЕКЛЮЧЕНИЕ ТАБОВ (ЖЕЛЕЗОБЕТОННАЯ ЛОГИКА)
// ==========================================================================

function activateTab(tabId) {
    const targetTabEl = document.getElementById(tabId);
    if (!targetTabEl) return;

    // 1. Снимаем active со всех табов
    document.querySelectorAll('.tab_content').forEach(tab => tab.classList.remove('active'));
    
    // 2. Снимаем active со всех кнопок навигации
    document.querySelectorAll('.bottom_nav .nav_item').forEach(nav => nav.classList.remove('active'));

    // 3. Активируем нужный таб и подсвечиваем кнопку
    targetTabEl.classList.add('active');
    const activeNav = document.querySelector(`.bottom_nav .nav_item[data-tab="${tabId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // 4. Если перешли на заказы — рендерим их
    if (tabId === 'tab-orders' && typeof renderOrdersHistory === 'function') {
        renderOrdersHistory();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // A. Проверяем, на какой странице мы находимся
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');

    // B. Если мы на ГЛАВНОЙ — проверяем хэш в URL (#orders или #start)
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

    // C. Обработчик кликов по нижнему меню
    const navItems = document.querySelectorAll('.bottom_nav .nav_item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetTabId = item.getAttribute('data-tab');
            const targetTabEl = document.getElementById(targetTabId);

            // 🎯 СТРОГОЕ УСЛОВИЕ:
            // Переключаем табы без перезагрузки ТОЛЬКО если мы на Главной странице И нужный таб там реально есть
            if (isHomePage && targetTabId && targetTabEl) {
                e.preventDefault(); // Блокируем перезагрузку только на index.html
                activateTab(targetTabId);
            } 
            // Если мы на catalog.html (или любой другой странице) — e.preventDefault() НЕ ВЫЗЫВАЕТСЯ.
            // Браузер спокойно берет href="./index.html#start" и переходит на главную!
        });
    });

    // D. КЛИК ПО КНОПКЕ "ЧУДОВО" В МОДАЛКЕ УСПЕХА
    const closeSuccessBtn = document.getElementById('close-success-btn');
    const successModal = document.getElementById('success-modal');

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            // 1. Прячем модальное окно
            if (successModal) {
                successModal.style.display = 'none';
            }

            // 2. Если мы на index.html — мгновенно включаем таб Замовлення
            if (isHomePage && typeof activateTab === 'function') {
                activateTab('tab-orders');
            } else {
                // 3. Если мы на catalog.html — летим на главную прямиком в заказы
                window.location.href = './index.html#orders';
            }
        });
    }
});

// ==========================================================================
// 3. КОРЗИНА И РАСЧЕТЫ
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

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
}

function addToCart(itemData) {
    let cart = getCart();
    
    const rawPrice = itemData.price ?? itemData.cost ?? itemData.numericPrice ?? 0;
    const cleanPrice = typeof rawPrice === 'number' 
        ? rawPrice 
        : parseFloat(String(rawPrice).replace(/[^\d.]/g, '')) || 0;

    const itemId = String(itemData.id || itemData.tourId || Date.now());
    const itemType = String(itemData.type || itemData.category || 'ОРЕНДА').toUpperCase();
    const itemTitle = itemData.title || itemData.name || itemData.productName || 'Товар';
    const itemQty = Number(itemData.qty || itemData.quantity || itemData.count || 1);

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
            img: itemData.img || '',
            date: itemData.date || itemData.selectedDate || itemData.tourDate || '',
            time: itemData.time || itemData.selectedTime || itemData.rentalTime || ''
        });
    }

    saveCart(cart);
    openCart();
}

function changeCartQty(id, delta, type) {
    let cart = getCart();
    const index = cart.findIndex(item => String(item.id) === String(id) && (type ? item.type === type : true));

    if (index > -1) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
    }
}

function removeCartItem(id, type) {
    let cart = getCart();
    cart = cart.filter(item => !(String(item.id) === String(id) && (type ? item.type === type : true)));
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem('myCart');
    updateCartUI();
}

function updateCartUI() {
    const cart = getCart();
    
    // 1. Ищем контейнер товаров под любым возможным ID или классом
    const container = document.getElementById('drawer-cart-items-container') || 
                      document.getElementById('cart-items') || 
                      document.getElementById('drawer-items') ||
                      document.querySelector('.drawer-cart-items') ||
                      document.querySelector('.cart-drawer-items');

    const totalEl = document.getElementById('drawer-cart-grand-total') || document.getElementById('cart-total-price');
    const badgeEl = document.getElementById('cart-badge') || document.querySelector('.cart-badge');
    const checkoutBtn = document.getElementById('btn-go-to-checkout');

    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        // Подтягиваем цену с фоллбеками (если забыли передать price)
        const rawPrice = item.price ?? item.cost ?? item.numericPrice ?? 0;
        const cleanPrice = typeof rawPrice === 'number' 
            ? rawPrice 
            : parseFloat(String(rawPrice).replace(/[^\d.]/g, '')) || 0;
            
        const qty = Number(item.qty || item.quantity || 1);
        totalQty += qty;
        totalPrice += (cleanPrice * qty);
    });

    // Управление кнопкой оформления
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
        checkoutBtn.style.opacity = cart.length === 0 ? '0.4' : '1';
        checkoutBtn.style.pointerEvents = cart.length === 0 ? 'none' : 'auto';
    }

    // Бейдж количества
    if (badgeEl) {
        badgeEl.textContent = totalQty;
        badgeEl.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    // Итоговая сумма
    if (totalEl) {
        totalEl.textContent = `${totalPrice.toLocaleString('uk-UA')}`;
    }

    // Рендер списка товаров в шторке
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 10px; color: #a3a3a3;">
                    <p style="font-size: 1.1rem; font-weight: 600; color: #ffffff; margin-bottom: 5px;">Ваш кошик порожній</p>
                    <p style="font-size: 0.9rem; color: #737373;">Оберіть щось у каталозі або походах</p>
                </div>
            `;
        } else {
            container.innerHTML = cart.map(item => {
                const isTour = isTourItem(item) || item.type === 'TOUR' || item.type === 'ПОХІД';
                
                // Проверяем цену, если 0 — ставим заглушку
                const itemPrice = item.price || item.cost || 0;
                
                // Инфа о дате/времени
                let infoText = '';
                if (isTour) {
                    const tourDate = item.date || item.selectedDate || item.tourDate;
                    infoText = tourDate ? `📅 ${tourDate}` : '';
                } else {
                    const rentalTime = item.time || item.durationText || item.duration;
                    infoText = rentalTime ? `⏱ ${rentalTime}` : '';
                }

                return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: #18181b; border: 1px solid #27272a; border-radius: 12px; color: #ffffff;">
                    <div style="flex: 1; padding-right: 10px;">
                        <span style="font-size: 0.65rem; background: ${isTour ? '#7c2d12' : '#1e3a8a'}; color: ${isTour ? '#ffedd5' : '#dbeafe'}; padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase; display: inline-block; margin-bottom: 4px;">
                            ${item.type || (isTour ? 'ПОХІД' : 'ОРЕНДА')}
                        </span>
                        <div style="font-weight: 700; color: #ffffff; font-size: 0.9rem; line-height: 1.2;">
                            ${item.title || item.name || item.productName || 'Товар'}
                        </div>
                        ${infoText ? `<div style="font-size: 0.75rem; color: #10b981; font-weight: 600; margin-top: 2px;">${infoText}</div>` : ''}
                        <div style="color: #a1a1aa; font-size: 0.8rem; margin-top: 3px;">
                            ${itemPrice > 0 ? `${itemPrice} грн / шт` : '<span style="color:#ef4444;">Ціну не вказано</span>'}
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <button onclick="changeCartQty('${item.id}', -1, '${item.type}')" style="width: 28px; height: 28px; border: 1px solid #3f3f46; background: #27272a; color: #ffffff; border-radius: 6px; cursor: pointer; font-weight: 700;">-</button>
                        <span style="font-weight: 700; font-size: 0.85rem; min-width: 16px; text-align: center; color: #ffffff;">${item.qty}</span>
                        <button onclick="changeCartQty('${item.id}', 1, '${item.type}')" style="width: 28px; height: 28px; border: 1px solid #3f3f46; background: #27272a; color: #ffffff; border-radius: 6px; cursor: pointer; font-weight: 700;">+</button>
                        <button onclick="removeCartItem('${item.id}', '${item.type}')" style="background: none; border: none; color: #ef4444; font-size: 1.1rem; cursor: pointer; margin-left: 2px;">&times;</button>
                    </div>
                </div>
            `}).join('');
        }
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

// Экспортируем в окно
window.addToCart = addToCart;
window.updateCartUI = updateCartUI;
window.updatePaymentSummary = updatePaymentSummary;

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
    const chipsContainer = document.getElementById('time-chips-container');

    if (!chipsContainer) return;

    const timeSlots = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
        "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
        "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
    ];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (rentalDateInput) rentalDateInput.min = todayStr;
    if (tourDateInput) tourDateInput.min = todayStr;

    function renderTimeSlots() {
        chipsContainer.innerHTML = '';
        const selectedDate = rentalDateInput ? rentalDateInput.value : '';
        const currentNow = new Date();
        const currentDateStr = currentNow.toISOString().split('T')[0];
        const currentHour = currentNow.getHours();
        const currentMinute = currentNow.getMinutes();
        const isToday = (selectedDate === currentDateStr);

        timeSlots.forEach(time => {
            const chip = document.createElement('div');
            chip.classList.add('time-chip');
            chip.textContent = time;

            const [optHour, optMinute] = time.split(':').map(Number);

            if (isToday && (optHour < currentHour || (optHour === currentHour && optMinute <= currentMinute))) {
                chip.classList.add('disabled');
            } else {
                chip.addEventListener('click', () => {
                    chipsContainer.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    timeHiddenInput.value = time;
                });
            }

            if (timeHiddenInput.value === time && !chip.classList.contains('disabled')) {
                chip.classList.add('active');
            }
            chipsContainer.appendChild(chip);
        });

        const activeChip = chipsContainer.querySelector('.time-chip.active');
        if (!activeChip) timeHiddenInput.value = '';
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