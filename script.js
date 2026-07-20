// Безопасно инициализируем Telegram WebApp, чтобы скрипт не падал в обычном браузере
const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;

if (tg) {
    // Код выполнится только если мы внутри Telegram
    tg.expand();
    tg.ready();
    console.log("Telegram WebApp успешно запущен!");
} else {
    // Защита от падения: если открыли просто в Chrome/Safari
    console.log("Режим браузера: Telegram WebApp не обнаружен, включаем обычный режим.");
}

// Десктопный скрипт: минимум воды, максимум конверсии
document.addEventListener("DOMContentLoaded", () => {
    const ctaButton = document.getElementById("cta-btn");

    // Проверяем наличие кнопки перед вешанием события
    if (ctaButton) {
        ctaButton.addEventListener("click", () => {
            const modalHtml = `
                <div id="demo-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                    <div style="background: #070b19; border: 1px solid rgba(0, 242, 254, 0.3); padding: 40px; border-radius: 20px; max-width: 500px; text-align: center; color: #fff;">
                        <h2 style="margin-bottom: 15px; font-family: 'Outfit', sans-serif;">🚀 Прототип загружен</h2>
                        <p style="color: #a0aec0; margin-bottom: 25px; line-height: 1.5; font-family: 'Outfit', sans-serif;">Богдан, привет! По клику на эту кнопку клиенты будут переходить в каталог, выбирать лодку и оплачивать в два клика. Без почты и звонков.</p>
                        <button onclick="document.getElementById('demo-modal').remove()" style="background: linear-gradient(135deg, #00f2fe, #0072ff); border: none; padding: 12px 30px; border-radius: 8px; color: #fff; font-weight: bold; cursor: pointer; font-family: 'Outfit', sans-serif;">Круто, закрыть</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        });
    }

    // Плавный скролл при клике на ссылки в навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Скролл к блоку: ' + this.getAttribute('href'));
        });
    });
});

// Единый контейнер для всех событий загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // ================= ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКОВ =================
    const langItems = document.querySelectorAll('.lang-item');

    langItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            langItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            
            const selectedLang = item.getAttribute('data-lang');
            console.log(`Язык переключен на: ${selectedLang}`);
        });
    });

    // ================= ЛОГИКА КНОПКИ ДЕЙСТВИЯ (CTA) =================
    const ctaBtn = document.getElementById('cta-order-btn');

    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            console.log('Клик по кнопке заказа. Логика перехода к форме.');
            alert('Тут сработает логика: откроется форма бронирования или скролл вниз.');
        });
    }

    // ================= ЛОГИКА БУРГЕР-МЕНЮ =================
    const burgerBtn = document.getElementById('burgerToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (burgerBtn && mobileNav) {
        burgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            burgerBtn.classList.toggle('active');
            mobileNav.classList.toggle('open');
            console.log('Бургер успешно сработал! Классы добавлены.');
        });
    } else {
        console.error('Аудитор недоволен: Кнопка бургера или панель меню не найдены в HTML!');
    }
});