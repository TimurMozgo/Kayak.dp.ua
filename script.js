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
// 3. ДИНАМІЧЕСКИЙ РЕНДЕР РОЗДІЛУ «МОЇ ЗАМОВЛЕННЯ»
// ==========================================================================

function renderOrders() {

    userOrders = JSON.parse(localStorage.getItem('timurtour_orders')) || [];

    const container = document.getElementById('orders-container');
    if (!container) return;

    // --- ЕСЛИ ЗАКАЗОВ НЕТ ---
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

    // --- ЕСЛИ ЗАКАЗЫ ЕСТЬ (выводим полный реестр заявок) ---
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
// 4. ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
// ==========================================================================
function initApp() {
    // 4.1. Отрисовываем заказы из localStorage
    renderOrders();

    // 4.2. Переключение языков
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

    // 4.3. НАВИГАЦИЯ ПО ТАБАМ И ВНЕШНИМ ССЫЛКАМ
    const navItems = document.querySelectorAll('.bottom_nav .nav_item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');

            // ЕСЛИ ССЫЛКА ВЕДЕТ НА ОТДЕЛЬНУЮ СТРАНИЦУ (например, catalog.html) — ОТПУСКАЕМ ТОРМОЗА
            if (href && !href.startsWith('#')) {
                return; // Браузер спокойно перейдет по ссылке
            }

            // ДЛЯ ВНУТРЕННИХ ТАБОВ — ПЕРЕХВАТЫВАЕМ И КРУТИМ ЛОГИКУ
            e.preventDefault();

            // 1. Снимаем active со всех кнопок меню
            navItems.forEach(btn => btn.classList.remove('active'));

            // 2. Снимаем active со всех вкладок
            document.querySelectorAll('.tab_content').forEach(tab => tab.classList.remove('active'));

            // 3. Подсвечиваем нажатую кнопку
            item.classList.add('active');

            // 4. Находим ID нужного блока
            let targetTabId = item.getAttribute('data-tab');
            if (!targetTabId) {
                if (href && href.startsWith('#')) {
                    targetTabId = 'tab-' + href.replace('#', '');
                }
            }

            // 5. Показываем нужный блок
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

    // 4.4. Кнопка CTA
    const ctaBtn = document.getElementById('cta-order-btn') || document.getElementById('cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            const startTabBtn = document.querySelector('.bottom_nav .nav_item');
            if (startTabBtn) startTabBtn.click();
        });
    }

    // 4.5. АВТОПЕРЕКЛЮЧЕНИЕ НА ВКЛАДКУ, ЕСЛИ ПЕРЕШЛИ ПО ХЭШУ (например, index.html#orders)
    if (window.location.hash === '#orders') {
        const ordersBtn = document.querySelector('.bottom_nav .nav_item[data-tab="tab-orders"]') || 
                          document.querySelector('.bottom_nav .nav_item[href="#orders"]');
        if (ordersBtn) {
            ordersBtn.click(); // Имитируем клик по вкладке "Замовлення"
        }
    }
}


// ==========================================================================
// 5. БЕЗОПАСНЫЙ ЗАПУСК (НЕ ЗАВИСИТ ОТ СКОРОСТИ ЗАГРУЗКИ DOM)
// ==========================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}