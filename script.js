// ==========================================================================
// 1. ИНИЦИАЛИЗАЦИЯ TELEGRAM WEBAPP
// ==========================================================================
const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;

if (tg) {
    tg.expand();
    tg.ready();
    console.log("Telegram WebApp успешно запущен!");
} else {
    console.log("Режим браузера: Telegram WebApp не обнаружен.");
}

// ==========================================================================
// 2. ХРАНИЛИЩЕ И УПРАВЛЕНИЕ ЗАКАЗАМИ (LOCALSTORAGE)
// ==========================================================================
let userOrders = JSON.parse(localStorage.getItem('timurtour_orders')) || [];

function addNewOrder(newBooking) {
    userOrders.unshift(newBooking);
    localStorage.setItem('timurtour_orders', JSON.stringify(userOrders));
    renderOrders();
}

function openLocation(orderId) {
    console.log(`Маршрут / локація для замовлення №${orderId}`);
}

function repeatBooking(productId) {
    console.log(`Повторне замовлення товару: ${productId}`);
    const startTabBtn = document.querySelector('.bottom_nav .nav_item');
    if (startTabBtn) startTabBtn.click();
}

// ==========================================================================
// 3. ЕДИНАЯ КОРЗИНА (ПОХОДЫ + ОРЕНДА)
// ==========================================================================
const CART_KEY = 'timurtour_cart';

// 3.1. Получить текущее состояние корзины
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// 3.2. Сохранить корзину и перерисовать интерфейс
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
}

// 3.3. Универсальное добавление (вызывается из catalog.js и tours.js)
function addToCart(itemData) {
    let cart = getCart();
    
    // Безопасный парсинг цены
    const rawPrice = itemData.price || itemData.cost || itemData.numericPrice || 0;
    const cleanPrice = typeof rawPrice === 'number' 
        ? rawPrice 
        : parseFloat(String(rawPrice).replace(/[^\d.]/g, '')) || 0;

    const itemId = String(itemData.id || itemData.tourId || Date.now());
    const itemType = (itemData.type || itemData.category || 'ОРЕНДА').toUpperCase();
    const itemTitle = itemData.title || itemData.name || 'Товар';
    const itemQty = Number(itemData.qty || itemData.quantity || itemData.count || 1);

    // Ищем товар по ID и ТИПУ
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
            img: itemData.img || ''
        });
    }

    saveCart(cart);
}

// 3.4. Изменение количества (+1 / -1)
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

// 3.5. Удаление конкретной позиции
function removeCartItem(id, type) {
    let cart = getCart();
    cart = cart.filter(item => !(String(item.id) === String(id) && (type ? item.type === type : true)));
    saveCart(cart);
}

// 3.6. Очистка корзины
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartUI();
}

// 3.7. Обновление внешнего вида корзины и счетчиков на странице
function updateCartUI() {
    const cart = getCart(); // Читаем из правильного CART_KEY ('timurtour_cart')

    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-grand-total');
    const badgeEl = document.getElementById('cart-badge');

    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalQty += item.qty;
        totalPrice += (item.price * item.qty);
    });

    // 1. Обновляем бейджик счетчика
    if (badgeEl) {
        badgeEl.textContent = totalQty;
        badgeEl.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    // 2. Обновляем итоговую сумму
    if (totalEl) {
        totalEl.textContent = totalPrice;
    }

    // 3. Рендерим список товаров
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 10px; color: #64748b;">
                    <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 5px;">Ваш кошик порожній</p>
                    <p style="font-size: 0.9rem;">Оберіть щось у каталозі або походах</p>
                </div>
            `;
            return;
        }

        container.innerHTML = cart.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                <div>
                    <span style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700;">
                        ${item.type}
                    </span>
                    <div style="font-weight: 700; color: #0f172a; margin-top: 4px; font-size: 0.95rem;">
                        ${item.title}
                    </div>
                    <div style="color: #64748b; font-size: 0.85rem;">
                        ${item.price} грн / шт
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                    <button onclick="changeCartQty('${item.id}', -1, '${item.type}')" style="width: 28px; height: 28px; border: 1px solid #cbd5e1; background: #fff; border-radius: 6px; cursor: pointer; font-weight: bold;">-</button>
                    <span style="font-weight: 700; font-size: 0.9rem; min-width: 18px; text-align: center;">${item.qty}</span>
                    <button onclick="changeCartQty('${item.id}', 1, '${item.type}')" style="width: 28px; height: 28px; border: 1px solid #cbd5e1; background: #fff; border-radius: 6px; cursor: pointer; font-weight: bold;">+</button>
                    <button onclick="removeCartItem('${item.id}', '${item.type}')" style="background: none; border: none; color: #ef4444; font-size: 1.1rem; cursor: pointer; margin-left: 5px;">&times;</button>
                </div>
            </div>
        `).join('');
    }
}

// ==========================================================================
// 4. ДИНАМИЧЕСКИЙ РЕНДЕР РАЗДЕЛУ «МОЇ ЗАМОВЛЕННЯ»
// ==========================================================================
function renderOrders() {
    userOrders = JSON.parse(localStorage.getItem('timurtour_orders')) || [];

    const container = document.getElementById('orders-container');
    if (!container) return;

    if (!userOrders || userOrders.length === 0) {
        container.innerHTML = `
            <div class="orders_empty">
                <div class="empty_icon">🛶</div>
                <h3>У вас поки немає замовлень</h3>
                <p>Оберіть каяк у каталозі та вирушайте у яскраву пригоду на воді!</p>
                <a href="./catalog.html" class="btn_to_catalog">
                    Перейти до каталогу
                </a>
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
                        <div class="order_meta">
                            <span>🛶 ${order.quantity} шт.</span>
                            <span>⏱️ ${order.duration}</span>
                        </div>
                        <div class="order_time_box">
                            📅 <strong>${order.date}</strong> о <strong>${order.time}</strong>
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
// 5. ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
// ==========================================================================
function initApp() {
    renderOrders();
    updateCartUI();

    const langItems = document.querySelectorAll('.lang-item');
    langItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            langItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            
            const selectedLang = item.getAttribute('data-lang');
            console.log(`Мову змінено на: ${selectedLang}`);
        });
    });

    const navItems = document.querySelectorAll('.bottom_nav .nav_item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');

            if (href && !href.startsWith('#')) {
                return; 
            }

            e.preventDefault();

            navItems.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab_content').forEach(tab => tab.classList.remove('active'));

            item.classList.add('active');

            let targetTabId = item.getAttribute('data-tab');
            if (!targetTabId) {
                if (href && href.startsWith('#')) {
                    targetTabId = 'tab-' + href.replace('#', '');
                }
            }

            if (targetTabId) {
                const targetTab = document.getElementById(targetTabId);
                if (targetTab) {
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    
                    targetTab.classList.add('active');
                }
            }
        });
    });

    const ctaBtn = document.getElementById('cta-order-btn') || document.getElementById('cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            const startTabBtn = document.querySelector('.bottom_nav .nav_item');
            if (startTabBtn) startTabBtn.click();
        });
    }

    if (window.location.hash === '#orders') {
        const ordersBtn = document.querySelector('.bottom_nav .nav_item[data-tab="tab-orders"]') || 
                          document.querySelector('.bottom_nav .nav_item[href="#orders"]');
        if (ordersBtn) {
            ordersBtn.click();
        }
    }
}

// ==========================================================================
// 6. БЕЗОПАСНЫЙ ЗАПУСК
// ==========================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}