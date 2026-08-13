// ==========================================================================
// 1. БАЗА ДАННЫХ ТУРОВ (ТВОЙ ФУНДАМЕНТ)
// ==========================================================================
const toursData = {
    // 🌅 1. ЧАРІВНІ ЗАХОДИ СОНЦЯ (Вт, Чт, Пт, Сб, Нд)
    'magic-sunset-parus': {
        id: 'magic-sunset-parus',
        title: " Чарівні заходи сонця",
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
        title: "Дводенний сплав по Орелі",
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
        title: "Магія вечірнього багаття",
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
        title: "Ночівля на острові з kayak.dp.ua",
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
        title: " Захід Сонця на SUP — Ідеальний Вечір",
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

window.openTourDetails = function(tourId) {
    const tour = toursData[tourId];
    if (!tour) {
        console.error('❌ Тур не найден:', tourId);
        return;
    }

    const modal = document.getElementById('tourModal');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) {
        console.error('❌ Элементы модалки не найдены!');
        return;
    }

    // Заливаем адаптированный под темную тему HTML
    modalBody.innerHTML = `
        <!-- Бейдж / Акция -->
        ${tour.badge ? `
            <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(249, 115, 22, 0.15); color: #fb923c; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; margin-bottom: 16px; border: 1px solid rgba(249, 115, 22, 0.3);">
                ${tour.badge}
            </div>
        ` : ''}

        <!-- Четкий белый заголовок -->
        <h2 style="font-size: 1.6rem; font-weight: 800; color: #ffffff; margin: 0 0 14px 0; line-height: 1.3;">
            ${tour.title}
        </h2>

        <!-- Локация и Время -->
        <div style="display: flex; gap: 18px; flex-wrap: wrap; font-size: 0.9rem; color: #94a3b8; margin-bottom: 18px; font-weight: 500;">
            <span style="display: flex; align-items: center; gap: 6px;">📍 ${tour.location}</span>
            <span style="display: flex; align-items: center; gap: 6px;">⏱️ ${tour.time}</span>
        </div>

        <!-- Краткое описание -->
        <p style="font-size: 1.05rem; color: #f1f5f9; font-weight: 600; line-height: 1.5; margin-bottom: 14px;">
            ${tour.intro}
        </p>

        <!-- Полный текст -->
        <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.6; margin-bottom: 22px;">
            ${tour.description}
        </p>

        <!-- Блок "В стоимость входит" в стиле Dark Glass -->
        ${tour.features && tour.features.length ? `
            <div style="background: rgba(255, 255, 255, 0.04); border-radius: 16px; padding: 20px; margin-bottom: 24px; border: 1px solid rgba(255, 255, 255, 0.08);">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: #ffffff; margin: 0 0 14px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                    У вартість входить:
                </h4>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                    ${tour.features.map(f => `
                        <li style="font-size: 0.95rem; color: #e2e8f0; display: flex; align-items: center; gap: 8px; line-height: 1.4;">
                            ${f}
                        </li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}

        <!-- Футер: Цена + Кнопка -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 18px; margin-top: 10px;">
            <div>
                <span style="display: block; font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">ЦІНА ЗА ЛЮДИНУ:</span>
                <span style="font-size: 1.6rem; font-weight: 800; color: #38bdf8;">${tour.price}</span>
            </div>
            <button type="button" onclick="closeTourDetails(); openBookingDrawer('${tour.id}')" style="background: #0088cc; color: #ffffff; border: none; border-radius: 12px; padding: 14px 28px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(0, 136, 204, 0.3);">
                Забронювати
            </button>
        </div>
    `;

    modal.classList.add('active', 'open', 'show');
    modal.style.setProperty('display', 'flex', 'important');
};

// ==========================================
// ЗАКРЫТИЕ МОДАЛКИ ПОДРОБНОСТЕЙ (ЖЕЛЕЗОБЕТОН)
// ==========================================

window.closeTourDetails = function() {
    console.log('🔒 Закрываем модалку подробностей');
    const modal = document.getElementById('tourModal');
    if (modal) {
        modal.classList.remove('active', 'open', 'show');
        modal.style.setProperty('display', 'none', 'important');
    }
};

// Перехватчик кликов: реагирует на крестик, оверлей и ESC
document.addEventListener('click', function(e) {
    const isCloseBtn = e.target.closest('.modal-close-btn');
    const isOverlay = e.target.classList.contains('modal-overlay');

    if (isCloseBtn || isOverlay) {
        e.preventDefault();
        e.stopPropagation();
        window.closeTourDetails();
    }
}, true);

// Закрытие по кнопке Esc на клавиатуре
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        window.closeTourDetails();
    }
});