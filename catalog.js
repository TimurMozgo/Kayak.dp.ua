// Глобальный стейт — подтягиваем сохраненные товары из localStorage при старте
let cart = JSON.parse(localStorage.getItem('timurtour_cart')) || [];

// Выбранные пользователем дата и время
let selectedDate = null; // "YYYY-MM-DD"
let selectedTime = null; // "HH:MM"

// Текущая дата для навигации внутри календаря
let navDate = new Date();

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Запуск полной инициализации скрипта...");

    // ----------------- ЭЛЕМЕНТЫ ИНТЕРФЕЙСА -----------------
    const productCards = document.querySelectorAll(".product-card");
    
    // Drawer (Заказ / Корзина) - ищем по классу и ID для надежности
    const bookingDrawer = document.querySelector(".booking-drawer") || document.getElementById("booking-drawer");
    const btnCloseDrawer = document.getElementById("btn-close-drawer") || document.querySelector(".close-drawer-btn");
    const drawerOverlay = document.querySelector(".drawer-overlay") || document.getElementById("drawer-close-overlay");
    const checkoutForm = document.getElementById("booking-checkout-form");

    // Элементы для двух шагов внутри Drawer'а
    const stepCart = document.getElementById("drawer-step-cart");
    const stepCheckout = document.getElementById("drawer-step-checkout");
    const btnGoToCheckout = document.getElementById("btn-go-to-checkout");
    const btnBackToCart = document.getElementById("btn-back-to-cart");
    const drawerTitle = document.getElementById("drawer-title");

    // Плавающая кнопка корзины
    const floatingCart = document.getElementById("floating-cart");

    // Календарь
    const btnOpenCalendar = document.getElementById("btn-open-calendar");
    const calendarModal = document.getElementById("calendar-modal");
    const calendarModalOverlay = document.getElementById("calendar-modal-overlay");
    const calMonthYearTitle = document.getElementById("cal-month-year-title");
    const calDaysGrid = document.getElementById("cal-days-grid");
    const calPrevBtn = document.getElementById("cal-prev-month");
    const calNextBtn = document.getElementById("cal-next-month");
    const selectedDateText = document.getElementById("selected-date-text");

    const timeSlotsGrid = document.getElementById("time-slots-grid");
    const hiddenDateTimeInput = document.getElementById("booking-datetime");

    // Modal (Детали товара)
    const detailsModal = document.getElementById("details-modal");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const detailsOverlay = document.getElementById("details-overlay");
    const modalBookBtn = document.getElementById("modal-book-btn");

    // Локализация для календаря
    const ukMonths = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
    const ukMonthsGenitive = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
    const availableTimeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];


    if (window.Telegram?.WebApp) {

        Telegram.WebApp.ready();
        Telegram.WebApp.expand();

        console.log("Telegram найден ✅");

        console.log("initData:", Telegram.WebApp.initData);

        console.log("initDataUnsafe:", Telegram.WebApp.initDataUnsafe);

        console.log("user:", Telegram.WebApp.initDataUnsafe.user);

    } else {

        console.log("Telegram НЕ найден ❌");

    }
    // ----------------- УПРАВЛЕНИЕ ШТОРКОЙ (DRAWER) И ШАГАМИ ----------------
    function showCartStep() {
        if (stepCart) stepCart.style.display = "block";
        if (stepCheckout) stepCheckout.style.display = "none";
        if (drawerTitle) drawerTitle.textContent = "Кошик";
    }

    function showCheckoutStep() {
        if (stepCart) stepCart.style.display = "none";
        if (stepCheckout) stepCheckout.style.display = "block";
        if (drawerTitle) drawerTitle.textContent = "Оформлення замовлення";
    }

    window.openBookingDrawer = function() {
        if (!bookingDrawer) {
            console.error("❌ Элемент шторки (.booking-drawer) не найден в DOM!");
            return;
        }
        showCartStep();
        if (typeof renderCart === "function") renderCart();
        bookingDrawer.classList.add("open");
    };

    window.closeBookingDrawer = function() {
        if (bookingDrawer) bookingDrawer.classList.remove("open");
    };

    window.toggleBookingDrawer = function() {
        if (!bookingDrawer) return;
        if (bookingDrawer.classList.contains("open")) {
            window.closeBookingDrawer();
        } else {
            window.openBookingDrawer();
        }
    };

    if (btnCloseDrawer) btnCloseDrawer.addEventListener("click", window.closeBookingDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener("click", window.closeBookingDrawer);

    if (btnGoToCheckout) {
        btnGoToCheckout.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Ваш кошик порожній! Оберіть щось перед оформленням.");
                return;
            }
            showCheckoutStep();
        });
    }

    if (btnBackToCart) {
        btnBackToCart.addEventListener("click", showCartStep);
    }

    // ----------------- НИЖНЯЯ НАВИГАЦИЯ (BOTTOM NAV) -----------------

    const navItems = document.querySelectorAll('.bottom_nav .nav_item, .bottom_nav a');

    navItems.forEach(button => {

        button.addEventListener('click', (e) => {

            const href = button.getAttribute('href');

            // Если ссылка ведет на другую страницу — не мешаем браузеру
            if (href && !href.startsWith('#')) return;

            e.preventDefault();

            const targetTabId = button.dataset.tab;

            // =======================
            // КНОПКА "КОШИК"
            // =======================

            if (targetTabId === "tab-cart") {

                window.openBookingDrawer();

                return;
            }

            // =======================
            // ОБЫЧНЫЕ ВКЛАДКИ
            // =======================

            navItems.forEach(btn => btn.classList.remove("active"));

            document.querySelectorAll(".tab_content").forEach(tab => {
                tab.style.display = "none";
            });

            button.classList.add("active");

            if (targetTabId) {

                const targetTab = document.getElementById(targetTabId);

                if (targetTab) {
                    targetTab.style.display = "block";
                }

            }

        });

    });

    // ----------------- СОХРАНЕНИЕ И ОБНОВЛЕНИЕ КОРЗИНЫ -----------------
    function saveAndUpdateCart() {
        localStorage.setItem('timurtour_cart', JSON.stringify(cart));
        
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalSum = cart.reduce((sum, item) => sum + item.totalPrice, 0);

        if (floatingCart) {
            if (totalQty > 0) {
                floatingCart.style.display = "flex";
                const cartCount = document.getElementById("floating-cart-count");
                const cartTotal = document.getElementById("floating-cart-total");
                if (cartCount) cartCount.textContent = totalQty;
                if (cartTotal) cartTotal.textContent = totalSum;
            } else {
                floatingCart.style.display = "none";
            }
        }

        const badge = document.getElementById('cart-badge');
        if (badge) {
            badge.textContent = totalQty;
            badge.style.display = totalQty > 0 ? 'flex' : 'none';
        }
    }

    saveAndUpdateCart();

    if (floatingCart) {
        floatingCart.addEventListener("click", window.openBookingDrawer);
    }

    // ----------------- ИНИЦИАЛИЗАЦИЯ КАРТОЧЕК -----------------
    productCards.forEach(card => {
        const dropdown = card.querySelector(".custom-dropdown");
        const dropdownTrigger = card.querySelector(".dropdown-trigger");
        const dropdownItems = card.querySelectorAll(".dropdown-item");

        const qtyValue = card.querySelector(".card-qty-value");
        const qtyBtns = card.querySelectorAll(".card-qty-btn");
        const btnMinus = qtyBtns[0];
        const btnPlus = qtyBtns[1];

        const priceVal = card.querySelector(".price-val");
        const bookBtn = card.querySelector(".book-btn");
        const detailsBtn = card.querySelector(".details-btn");

        const productName = card.querySelector(".product-name")?.textContent.trim() || "Товар";
        const productId = card.getAttribute("data-id") || Math.random().toString();

        let currentQty = 1;
        let currentPricePerUnit = priceVal ? (parseInt(priceVal.textContent) || 300) : 300;
        
        const textSpan = card.querySelector(".dropdown-selected-text");
        let currentDurationText = textSpan ? textSpan.textContent.trim() : "1 година";

        if (dropdownTrigger) {
            dropdownTrigger.addEventListener("click", (e) => {
                e.stopPropagation();
                document.querySelectorAll(".custom-dropdown").forEach(el => {
                    if (el !== dropdown) el.classList.remove("open");
                });
                if (dropdown) dropdown.classList.toggle("open");
            });
        }

        dropdownItems.forEach(item => {
            item.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdownItems.forEach(el => el.classList.remove("active"));
                item.classList.add("active");

                currentDurationText = item.textContent.trim();
                if (textSpan) textSpan.textContent = currentDurationText;

                currentPricePerUnit = parseInt(item.getAttribute("data-price")) || 300;
                if (dropdown) dropdown.classList.remove("open");
                updateCardPrice();
            });
        });

        function updateCardPrice() {
            if (priceVal) priceVal.textContent = currentPricePerUnit * currentQty;
        }

        if (btnMinus) {
            btnMinus.addEventListener("click", () => {
                if (currentQty > 1) {
                    currentQty--;
                    if (qtyValue) qtyValue.textContent = currentQty;
                    updateCardPrice();
                }
            });
        }

        if (btnPlus) {
            btnPlus.addEventListener("click", () => {
                if (currentQty < 10) {
                    currentQty++;
                    if (qtyValue) qtyValue.textContent = currentQty;
                    updateCardPrice();
                }
            });
        }

        if (bookBtn) {
            bookBtn.addEventListener("click", () => {
                const cleanDurationText = currentDurationText.split(" (")[0];
                const totalPrice = currentPricePerUnit * currentQty;

                const existingItem = cart.find(item => item.productId === productId && item.durationText === cleanDurationText);

                if (existingItem) {
                    existingItem.quantity += currentQty;
                    existingItem.totalPrice = existingItem.quantity * existingItem.pricePerUnit;
                } else {
                    cart.push({
                        productId,
                        productName,
                        durationText: cleanDurationText,
                        pricePerUnit: currentPricePerUnit,
                        quantity: currentQty,
                        totalPrice
                    });
                }

                saveAndUpdateCart();
            });
        }

        if (detailsBtn) {
            detailsBtn.addEventListener("click", () => {
                const productImg = card.querySelector(".product-img-box img")?.src || "";
                const productDesc = card.querySelector(".product-desc")?.textContent || "";
                const productSpecsHtml = card.querySelector(".product-specs")?.innerHTML || "";

                const nameElem = document.getElementById("modal-product-name");
                const imgElem = document.getElementById("modal-product-img");
                const descElem = document.getElementById("modal-product-desc");
                const specsElem = document.getElementById("modal-product-specs");

                if (nameElem) nameElem.textContent = productName;
                if (imgElem) { imgElem.src = productImg; imgElem.alt = productName; }
                if (descElem) descElem.textContent = productDesc;
                if (specsElem) specsElem.innerHTML = productSpecsHtml;

                if (modalBookBtn) modalBookBtn.setAttribute("data-target-id", productId);
                openDetailsModal();
            });
        }
    });

    if (modalBookBtn) {
        modalBookBtn.addEventListener("click", () => {
            const targetId = modalBookBtn.getAttribute("data-target-id");
            if (targetId) {
                closeDetailsModal();
                const targetCard = document.querySelector(`.product-card[data-id="${targetId}"]`);
                if (targetCard) {
                    const targetBookBtn = targetCard.querySelector(".book-btn");
                    if (targetBookBtn) targetBookBtn.click();
                }
            }
        });
    }

    // ----------------- РЕНДЕР КОРЗИНЫ В DRAWER -----------------
    function renderCart() {
        const container = document.getElementById("cart-items-container");
        const grandTotalDisplay = document.getElementById("cart-grand-total");
        if (!container) return;

        container.innerHTML = "";
        let grandTotal = 0;

        if (!cart || cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 30px 10px; color: #64748b;">
                    <p style="font-size: 1.1rem; font-weight: 600;">Ваш кошик порожній 🛶</p>
                    <span style="font-size: 0.85rem;">Оберіть байдарку або сапборд у каталозі</span>
                </div>
            `;
            if (grandTotalDisplay) grandTotalDisplay.textContent = "0";
            saveAndUpdateCart();
            return;
        }

        cart.forEach((item, index) => {
            grandTotal += item.totalPrice;
            const cartItemHtml = `
                <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border-radius: 12px; padding: 12px 16px; border: 1px solid #e2e8f0; margin-bottom: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 4px; max-width: 45%;">
                        <span style="font-weight: 700; color: #0f172a; font-size: 0.95rem; line-height: 1.2;">${item.productName}</span>
                        <span style="font-size: 0.8rem; color: #64748b; font-weight: 500;">${item.durationText}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px 8px;">
                        <button type="button" class="drawer-qty-minus" data-index="${index}" style="background: none; border: none; cursor: pointer; font-weight: bold; color: #64748b;">-</button>
                        <span style="font-weight: 700; font-size: 0.9rem; min-width: 16px; text-align: center;">${item.quantity}</span>
                        <button type="button" class="drawer-qty-plus" data-index="${index}" style="background: none; border: none; cursor: pointer; font-weight: bold; color: #64748b;">+</button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-weight: 800; color: #0f172a; font-size: 0.95rem; min-width: 70px; text-align: right;">${item.totalPrice} грн</span>
                        <button type="button" class="btn-remove-cart-item" data-index="${index}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.3rem; font-weight: bold;">&times;</button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", cartItemHtml);
        });

        if (grandTotalDisplay) grandTotalDisplay.textContent = grandTotal;

        container.querySelectorAll(".drawer-qty-plus").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                cart[idx].quantity++;
                cart[idx].totalPrice = cart[idx].quantity * cart[idx].pricePerUnit;
                saveAndUpdateCart();
                renderCart();
            });
        });

        container.querySelectorAll(".drawer-qty-minus").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity--;
                    cart[idx].totalPrice = cart[idx].quantity * cart[idx].pricePerUnit;
                    saveAndUpdateCart();
                    renderCart();
                }
            });
        });

        container.querySelectorAll(".btn-remove-cart-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                cart.splice(idx, 1);
                saveAndUpdateCart();
                renderCart();
            });
        });

        saveAndUpdateCart();
    }

    // ----------------- КАЛЕНДАРЬ -----------------
    function renderFullCalendar() {
        const year = navDate.getFullYear();
        const month = navDate.getMonth();
        
        if (calMonthYearTitle) calMonthYearTitle.textContent = `${ukMonths[month]} ${year}`;
        if (calDaysGrid) calDaysGrid.innerHTML = "";

        let firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement("div");
            emptyDiv.style.cssText = "width: 100%; aspect-ratio: 1;";
            if (calDaysGrid) calDaysGrid.appendChild(emptyDiv);
        }

        const todayStr = new Date().toISOString().split('T')[0];

        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isPast = dateStr < todayStr;
            const isSelected = dateStr === selectedDate;

            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = day;
            btn.style.cssText = `
                width: 100%; max-width: 38px; aspect-ratio: 1; 
                display: flex; align-items: center; justify-content: center; 
                border-radius: 50%; border: none; font-weight: 700; font-size: 0.85rem; 
                cursor: pointer; margin: 0 auto; padding: 0; box-sizing: border-box; transition: all 0.15s ease;
            `;

            if (isPast) {
                btn.style.background = "none";
                btn.style.color = "#cbd5e1";
                btn.style.cursor = "not-allowed";
                btn.disabled = true;
            } else if (isSelected) {
                btn.style.background = "#0284c7";
                btn.style.color = "#ffffff";
                btn.style.boxShadow = "0 4px 10px rgba(2, 132, 199, 0.3)";
            } else {
                btn.style.background = "#f8fafc";
                btn.style.color = "#0f172a";
                btn.addEventListener("mouseenter", () => btn.style.background = "#e2e8f0");
                btn.addEventListener("mouseleave", () => btn.style.background = "#f8fafc");
            }

            if (!isPast) {
                btn.addEventListener("click", () => {
                    selectedDate = dateStr;
                    if (selectedDateText) {
                        selectedDateText.innerHTML = `<i class="fa-regular fa-calendar-check" style="color: #10b981; font-size: 1.1rem;"></i> ${day} ${ukMonthsGenitive[month]} ${year}`;
                        selectedDateText.style.color = "#0f172a";
                    }
                    updateHiddenInput();
                    closeCalendarModal();
                });
            }

            if (calDaysGrid) calDaysGrid.appendChild(btn);
        }
    }

    if (calPrevBtn) {
        calPrevBtn.addEventListener("click", () => {
            const currentRealDate = new Date();
            if (navDate.getFullYear() === currentRealDate.getFullYear() && navDate.getMonth() === currentRealDate.getMonth()) return;
            navDate.setDate(1);
            navDate.setMonth(navDate.getMonth() - 1);
            renderFullCalendar();
        });
    }

    if (calNextBtn) {
        calNextBtn.addEventListener("click", () => {
            navDate.setDate(1);
            navDate.setMonth(navDate.getMonth() + 1);
            renderFullCalendar();
        });
    }

    function openCalendarModal() {
        if (calendarModal) calendarModal.style.display = "flex";
        renderFullCalendar();
    }

    function closeCalendarModal() {
        if (calendarModal) calendarModal.style.display = "none";
    }

    if (btnOpenCalendar) btnOpenCalendar.addEventListener("click", openCalendarModal);
    if (calendarModalOverlay) calendarModalOverlay.addEventListener("click", closeCalendarModal);

    // ----------------- СЛОТЫ ВРЕМЕНИ -----------------
    function initTimeSlots() {
        if (!timeSlotsGrid) return;
        timeSlotsGrid.innerHTML = "";
        selectedTime = null;
        if (hiddenDateTimeInput) hiddenDateTimeInput.value = "";

        availableTimeSlots.forEach(time => {
            const timeBtn = document.createElement("button");
            timeBtn.type = "button";
            timeBtn.classList.add("time-slot-btn");
            timeBtn.textContent = time;

            timeBtn.addEventListener("click", () => {
                document.querySelectorAll(".time-slot-btn").forEach(el => el.classList.remove("active"));
                timeBtn.classList.add("active");
                selectedTime = time;
                updateHiddenInput();
            });

            timeSlotsGrid.appendChild(timeBtn);
        });
    }
    
    initTimeSlots();

    function updateHiddenInput() {
        if (hiddenDateTimeInput) {
            hiddenDateTimeInput.value = (selectedDate && selectedTime) ? `${selectedDate}T${selectedTime}` : "";
        }
    }

    function openDetailsModal() { if (detailsModal) detailsModal.classList.add("open"); }
    function closeDetailsModal() { if (detailsModal) detailsModal.classList.remove("open"); }
    if (btnCloseModal) btnCloseModal.addEventListener("click", closeDetailsModal);
    if (detailsOverlay) detailsOverlay.addEventListener("click", closeDetailsModal);

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            window.closeBookingDrawer();
            closeDetailsModal();
            closeCalendarModal();
        }
    });

    // ----------------- ОТПРАВКА ДАННЫХ В N8N -----------------
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                alert("Ваш кошик порожній!");
                return;
            }

            if (!selectedDate || !selectedTime) {
                alert("Будь ласка, оберіть дату та час для бронювання!");
                return;
            }

            const nameInput = document.getElementById("user-name");
            const phoneInput = document.getElementById("user-phone");

            const name = nameInput ? nameInput.value.trim() : "";
            const phone = phoneInput ? phoneInput.value.trim() : "";
            const totalCartPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

            const itemsSummary = cart.map(item => `${item.productName} (${item.durationText}) x${item.quantity}`).join("<br>");
            const dateParts = selectedDate.split("-");
            const formattedDate = dateParts.length === 3 ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}` : selectedDate;

            const detailsContainer = document.getElementById("check-order-details");
            if (detailsContainer) {
                detailsContainer.innerHTML = `
                    <div><strong style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 2px;">ІМ'Я:</strong> <span style="font-weight: 700; color: #0f172a;">${name}</span></div>
                    <div style="border-top: 1px dashed #e2e8f0; padding-top: 8px;"><strong style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 2px;">ТЕЛЕФОН:</strong> <span style="font-weight: 700; color: #0f172a;">${phone}</span></div>
                    <div style="border-top: 1px dashed #e2e8f0; padding-top: 8px;"><strong style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 2px;">ДАТА ТА ЧАС:</strong> <span style="font-weight: 700; color: #0f172a;">📅 ${formattedDate} о ${selectedTime}</span></div>
                    <div style="border-top: 1px dashed #e2e8f0; padding-top: 8px;"><strong style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 2px;">ЗАМОВЛЕННЯ:</strong> <span style="font-weight: 600; color: #0f172a; line-height: 1.3;">${itemsSummary}</span></div>
                    <div style="border-top: 1px dashed #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;"><strong style="color: #64748b; font-size: 0.85rem;">ЗАГАЛЬНА СУМА:</strong> <span style="font-weight: 800; color: #0284c7; font-size: 1.1rem;">${totalCartPrice} грн</span></div>
                `;
            }

            const checkModal = document.getElementById("check-order-modal");
            if (checkModal) {
                checkModal.style.display = "flex";
                setTimeout(() => { if (checkModal.firstElementChild) checkModal.firstElementChild.style.transform = "scale(1)"; }, 50);
            }
        });
    }

    document.getElementById("check-back-btn")?.addEventListener("click", () => {
        const checkModal = document.getElementById("check-order-modal");
        if (checkModal) {
            checkModal.style.display = "none";
            if (checkModal.firstElementChild) checkModal.firstElementChild.style.transform = "scale(0.9)";
        }
    });

    // ==========================================
    // ЭТАП 1: Переход с проверки на Шаг 3 (Оплата и Загрузка чека)
    // ==========================================
    document.getElementById("check-confirm-btn")?.addEventListener("click", () => {
        // 1. Закрываем модалку проверки (если она была открыта)
        const checkModal = document.getElementById("check-order-modal");
        if (checkModal) checkModal.style.display = "none";

        // 2. Переключаем шаги внутри боковой панели (Drawer)
        const stepCheckout = document.getElementById("drawer-step-checkout");
        const stepPayment = document.getElementById("drawer-step-payment");

        if (stepCheckout) stepCheckout.style.display = "none";
        if (stepPayment) stepPayment.style.display = "block";

        // 3. Обновляем суммы на шаге оплаты
        const totalCartPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        const payPriceElem = document.getElementById("pay-item-price");
        const payDepositElem = document.getElementById("pay-deposit-amount");

        if (payPriceElem) payPriceElem.innerText = `${totalCartPrice} UAH`;
        if (payDepositElem) payDepositElem.innerText = `${totalCartPrice} грн`;
    });

    // ==========================================
    // 1. Вспомогательная функция: сброс картинок и возврат на Шаг 1
    // ==========================================
    function resetBookingState() {
        // Очищаем input файла и превью картинки
        const fileInput = document.getElementById('receipt-file-input');
        const idleState = document.getElementById('upload-idle-state');
        const previewState = document.getElementById('upload-preview-state');
        const previewImg = document.getElementById('receipt-preview-img');

        if (fileInput) fileInput.value = '';
        if (previewImg) previewImg.src = '';
        if (idleState) idleState.style.display = 'flex';
        if (previewState) previewState.style.display = 'none';

        // Переключаем шторку обратно на Шаг 1 (Корзина)
        const stepCart = document.getElementById('drawer-step-cart');
        const stepCheckout = document.getElementById('drawer-step-checkout');
        const stepPayment = document.getElementById('drawer-step-payment');

        if (stepCart) stepCart.style.display = 'block';
        if (stepCheckout) stepCheckout.style.display = 'none';
        if (stepPayment) stepPayment.style.display = 'none';
    }

    // ==========================================
    // 2. Обработчик клика кнопки «Підтвердити та надіслати»
    // ==========================================
    document.getElementById("btn-submit-final-booking")?.addEventListener("click", async () => {

        const fileInput = document.getElementById("receipt-file-input");
        const uploadZone = document.getElementById("upload-zone");

        // Проверяем наличие чека
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("⚠️ Будь ласка, прикріпіть скріншот або квитанцію про оплату!");

            if (uploadZone) {
                uploadZone.style.border = "2px dashed #ef4444";
                uploadZone.style.backgroundColor = "#fef2f2";
                uploadZone.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
            return;
        }

        if (uploadZone) {
            uploadZone.style.border = "";
            uploadZone.style.backgroundColor = "";
        }

        // --------------------------------------------------
        // Получаем Telegram пользователя
        // --------------------------------------------------
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user || null;
        const telegramId = tgUser?.id ? String(tgUser.id) : "Сайт (Браузер)";

        // --------------------------------------------------
        // Собираем данные
        // --------------------------------------------------
        const name = document.getElementById("user-name")?.value.trim() || "";
        const phone = document.getElementById("user-phone")?.value.trim() || "";
        const scheduledAt = document.getElementById("booking-datetime")?.value || "";
        const totalCartPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

        const payload = {
            customer: {
                name,
                phone,
                telegramId
            },
            booking: {
                items: cart.map(item => ({
                productId: item.productId,
                productName: item.productName,
                duration: item.durationText,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                // 👇 Пробрасываем картинку байдарки из объекта корзины
                img: item.img || item.image || item.imgSrc || item.photo || item.icon
            })),
                totalPrice: totalCartPrice,
                scheduledAt
            },
            meta: {
                source: "Website Catalog Verified Confirmation",
                createdAt: new Date().toISOString()
            }
        };

        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload));
        formData.append("receipt_file", fileInput.files[0]);

        console.log("📦 Payload:", payload);

        try {
            // ⚠️ Не забудь сменить /webhook-test/ на боевой /webhook/ в n8n когда включишь Workflow!
            const response = await fetch(
                "https://tiktiok.xyz/webhook/219a97d0-2e45-4479-947d-08702f215d52",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error(`Помилка сервера: ${response.status}`);
            }

            console.log("✅ Успешно отправлено в n8n");

            // 🎯 СОХРАНЯЕМ ПОЛНЫЙ ЗАКАЗ В ИСТОРИЮ (Только после успешной отправки!)
            if (typeof saveOrderToHistory === "function") {
                saveOrderToHistory({
                    items: payload.booking.items,
                    totalPrice: payload.booking.totalPrice,
                    scheduledAt: payload.booking.scheduledAt
                });
            }

            // Очищаем корзину
            cart = [];
            selectedDate = null;
            selectedTime = null;

            if (typeof saveAndUpdateCart === "function") {
                saveAndUpdateCart();
            }

            document.getElementById("booking-checkout-form")?.reset();

            if (typeof resetBookingState === "function") {
                resetBookingState();
            }

            window.closeBookingDrawer?.();

            const successModal = document.getElementById("success-modal");
            if (successModal) {
                successModal.style.display = "flex";
                setTimeout(() => {
                    successModal.firstElementChild?.style.setProperty(
                        "transform",
                        "scale(1)"
                    );
                }, 50);
            }

            const closeSuccessBtn = document.getElementById("close-success-btn");
            if (closeSuccessBtn) {
                closeSuccessBtn.addEventListener("click", () => {
                    const successModal = document.getElementById("success-modal");
                    if (successModal) successModal.style.display = "none";
                });
            }

        } catch (error) {
            console.error("Помилка відправки:", error);
            alert("❌ Не вдалося відправити бронювання. Спробуйте ще раз.");
        }
    });

});

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Универсальное копирование по клику на карточку
    // ==========================================
    document.querySelectorAll('.copy-card').forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-copy-target');
            const textElem = document.getElementById(targetId);
            const iconElem = card.querySelector('.copy-icon');

            if (!textElem) return;

            // Для IBAN и ЄДРПОУ вычищаем пробелы, обычный текст оставляем как есть
            let cleanText = textElem.innerText.trim();
            if (targetId === 'iban-text' || targetId === 'edrpou-val') {
                cleanText = cleanText.replace(/\s+/g, '');
            }

            navigator.clipboard.writeText(cleanText).then(() => {
                if (!iconElem) return;

                // Сохраняем исходное состояние иконки
                const originalClass = iconElem.className;
                const originalColor = iconElem.style.color;

                // Включаем зелёную галочку
                iconElem.className = 'copy-icon fa-solid fa-check';
                iconElem.style.color = '#10b981';

                // Через 1.8 секунды возвращаем иконку назад
                setTimeout(() => {
                    iconElem.className = originalClass;
                    iconElem.style.color = originalColor;
                }, 1800);

            }).catch(err => {
                console.error('Помилка копіювання:', err);
            });
        });
    });

    // ----------------------------------------------------
    // 2. Работа со скриншотом оплаты
    // ----------------------------------------------------

    window.currentReceiptFile = null;

    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('receipt-file-input');

    const idleState = document.getElementById('upload-idle-state');
    const previewState = document.getElementById('upload-preview-state');
    const previewImg = document.getElementById('receipt-preview-img');

    function renderImagePreview(file) {

        if (!file) return;

        if (!file.type.startsWith('image/')) return;

        window.currentReceiptFile = file;

        const imageUrl = URL.createObjectURL(file);

        if (previewImg) {
            previewImg.src = imageUrl;
        }

        if (idleState) {
            idleState.style.display = 'none';
        }

        if (previewState) {
            previewState.style.display = 'block';
        }

        if (uploadZone) {
            uploadZone.style.border = '';
            uploadZone.style.backgroundColor = '';
        }

    }

    if (uploadZone && fileInput) {

        uploadZone.addEventListener('click', () => {

            fileInput.click();

        });

        fileInput.addEventListener('change', e => {

            const file = e.target.files?.[0];

            if (file) {

                renderImagePreview(file);

            }

        });

        document.addEventListener('paste', e => {

            const items = e.clipboardData?.items;

            if (!items) return;

            for (const item of items) {

                if (item.type.startsWith('image/')) {

                    const file = item.getAsFile();

                    if (file) {

                        renderImagePreview(file);

                    }

                    break;

                }

            }

        });

    }

});

function saveOrderToHistory(bookingData) {
    if (!bookingData || !bookingData.items || bookingData.items.length === 0) return;

    let existingOrders = [];
    try {
        existingOrders = JSON.parse(localStorage.getItem('kayakdpua_orders')) || [];
    } catch (e) {
        existingOrders = [];
    }

    const mainItem = bookingData.items[0];
    const totalQuantity = bookingData.items.reduce((sum, item) => sum + item.quantity, 0);

    const now = new Date();
    const dateStr = now.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

    // Ищем путь к картинке среди всех возможных ключей объекта
    const detectedImg = mainItem.img || mainItem.image || mainItem.imgSrc || mainItem.photo || mainItem.icon;

    const newOrder = {
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        productId: mainItem.productId || 'kayak-1',
        productName: bookingData.items.length > 1 
            ? `${mainItem.productName} (+ ще ${bookingData.items.length - 1})` 
            : mainItem.productName,
        quantity: totalQuantity,
        duration: mainItem.duration || '1 година',
        scheduledAt: bookingData.scheduledAt 
            ? bookingData.scheduledAt.replace('T', ' o ') 
            : `${dateStr} o ${timeStr}`,
        totalPrice: bookingData.totalPrice,
        status: 'Очікує підтвердження',
        img: detectedImg // Сохраняем реальный URL картинки
    };

    existingOrders.unshift(newOrder);
    localStorage.setItem('kayakdpua_orders', JSON.stringify(existingOrders));

    if (typeof renderOrdersHistory === 'function') {
        renderOrdersHistory();
    }
}

function renderOrdersHistory() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem('kayakdpua_orders')) || [];
    } catch (e) {
        orders = [];
    }

    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #94a3b8;">
                <i class="fa-solid fa-box-open" style="font-size: 2.5rem; margin-bottom: 12px; color: #cbd5e1;"></i>
                <p style="margin: 0; font-weight: 600; font-size: 0.95rem;">У вас поки немає активних замовлень</p>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => {
        // 🎯 1. Улучшенный автоматический поиск картинки товара из каталога
        let productImg = order.img || order.image || ''; // В первую очередь берем из самого заказа

        // Проверяем все возможные глобальные массивы каталога на сайте
        const allProducts = window.PRODUCTS || window.catalog || window.productsData || window.CATALOG || [];

        if (allProducts.length > 0) {
            // Ищем сначала по ID, а если не нашли — по названию товара (productName)
            const foundProduct = allProducts.find(p => 
                (p.id && String(p.id) === String(order.productId)) ||
                (p.productId && String(p.productId) === String(order.productId)) ||
                (p.title && p.title.trim().toLowerCase() === order.productName?.trim().toLowerCase()) ||
                (p.name && p.name.trim().toLowerCase() === order.productName?.trim().toLowerCase())
            );

            if (foundProduct) {
                // Извлекаем путь к картинке из любого возможного свойства
                productImg = foundProduct.img || foundProduct.image || foundProduct.imgSrc || foundProduct.photo || foundProduct.icon || productImg;
            }
        }

        // Резервная заглушка, если вообще ничего не нашлось
        if (!productImg) {
            productImg = './img/LiteRowing_9.5.webp';
        }

        // 🎯 2. Цвета и стили плашки статуса
        const rawStatus = (order.status || '').trim();
        
        // По умолчанию ставим "Очікує підтвердження" (оранжевый)
        let currentStatus = 'Очікує підтвердження';
        let statusBg = '#fef3c7';    // Светло-желтый/оранжевый
        let statusColor = '#b45309'; // Темно-оранжевый
        let dotColor = '#f59e0b';    // Оранжевая точка

        // Зеленый цвет даем ТОЛЬКО если статус явно подтвержден
        if (rawStatus === 'Підтверджено' || rawStatus === 'Подтверждено' || rawStatus === 'Confirmed') {
            currentStatus = 'Підтверджено';
            statusBg = '#dcfce7';    // Светло-зеленый
            statusColor = '#166534'; // Темно-зеленый
            dotColor = '#22c55e';    // Зеленая точка
        }

        return `
            <div class="order-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                
                <!-- Шапка карточки -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
                    <span style="font-weight: 700; font-size: 1.05rem; color: #0f172a;">№ ${order.id}</span>
                    <span style="background: ${statusBg}; color: ${statusColor}; font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 99px; display: inline-flex; align-items: center; gap: 6px;">
                        <span style="width: 7px; height: 7px; background: ${dotColor}; border-radius: 50%;"></span>
                        ${currentStatus}
                    </span>
                </div>

                <!-- Тело карточки (Картинка подтягивается сама из базы) -->
                <div style="display: flex; gap: 14px; margin-bottom: 14px;">
                    <img src="${productImg}" style="width: 75px; height: 75px; border-radius: 12px; object-fit: cover; flex-shrink: 0;" alt="${order.productName}">
                    <div>
                        <div style="font-weight: 700; font-size: 0.95rem; color: #0f172a; margin-bottom: 6px;">${order.productName}</div>
                        <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 4px; display: flex; align-items: center; gap: 10px;">
                            <span>🚣 ${order.quantity} шт.</span>
                            <span>⏱️ ${order.duration}</span>
                        </div>
                        <div style="font-size: 0.82rem; color: #0f172a; font-weight: 600;">
                            📅 ${order.scheduledAt}
                        </div>
                    </div>
                </div>

                <!-- Футер карточки -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                    <div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">До сплати:</div>
                        <div style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">${order.totalPrice} грн</div>
                    </div>
                    <button type="button" style="background: #f1f5f9; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 600; font-size: 0.82rem; color: #0f172a; cursor: pointer;">
                        Маршрут / Локація
                    </button>
                </div>

            </div>
        `;
    }).join('');
}

// 3. Вызываем отрисовку при стартe страницы
document.addEventListener('DOMContentLoaded', () => {
    renderOrdersHistory();
});
