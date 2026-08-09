// ==========================================================================
// 1. КОНСТАНТЫ И ГЛОБАЛЬНЫЙ СТЕЙТ
// ==========================================================================
const availableTimeSlots = [
    "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00"
];

// Названия месяцев для календаря
const ukMonths = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
const ukMonthsGenitive = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];

// Кэшируем глобальные элементы
const timeSlotsGrid = document.getElementById('time-slots-grid');
const hiddenDateTimeInput = document.getElementById('checkout-rental-time');

// Глобальный стейт — корзина из localStorage
let cart = JSON.parse(localStorage.getItem('timurtour_cart')) || [];

// Выбранные пользователем дата и время
let selectedDate = null; // "YYYY-MM-DD"
let selectedTime = null; // "HH:MM"

// Текущая дата для навигации внутри календаря
let navDate = new Date();

// ==========================================================================
// 2. ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА (DOMContentLoaded)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Запуск полной инициализации скрипта...");

    // ----------------- ЭЛЕМЕНТЫ ИНТЕРФЕЙСА -----------------
    const productCards = document.querySelectorAll(".product-card");
    
    // Drawer (Заказ / Корзина)
    const bookingDrawer = document.querySelector(".booking-drawer") || document.getElementById("booking-drawer");
    const btnCloseDrawer = document.getElementById("btn-close-drawer") || document.querySelector(".close-drawer-btn");
    const drawerOverlay = document.querySelector(".drawer-overlay") || document.getElementById("drawer-close-overlay");
    const checkoutForm = document.getElementById("booking-checkout-form");

    // Шаги внутри Drawer
    const stepCart = document.getElementById("drawer-step-cart");
    const stepCheckout = document.getElementById("drawer-step-checkout");
    const btnGoToCheckout = document.getElementById("btn-go-to-checkout");
    const btnBackToCart = document.getElementById("btn-back-to-cart");
    const drawerTitle = document.getElementById("drawer-title");

    // Модальное окно проверки заказа
    const checkModal = document.getElementById("check-order-modal");
    const detailsContainer = document.getElementById("check-order-details");

    // Гибкий поиск кнопок внутри модалки проверки
    const confirmPaymentBtn = document.getElementById("confirm-payment-btn") 
        || checkModal?.querySelector('.btn-confirm') 
        || checkModal?.querySelectorAll('button')[1] 
        || checkModal?.querySelector('button:last-child');

    const cancelCheckModalBtn = document.getElementById("btn-close-check-modal") 
        || checkModal?.querySelector('.btn-back') 
        || checkModal?.querySelectorAll('button')[0] 
        || checkModal?.querySelector('button:first-child');

    // Плавающая кнопка корзины
    const floatingCart = document.getElementById("floating-cart");

    // Элементы Календаря
    const btnOpenCalendar = document.getElementById("btn-open-calendar");
    const calendarModal = document.getElementById("calendar-modal");
    const calendarModalOverlay = document.getElementById("calendar-modal-overlay");
    const calMonthYearTitle = document.getElementById("cal-month-year-title");
    const calDaysGrid = document.getElementById("cal-days-grid");
    const calPrevBtn = document.getElementById("cal-prev-month");
    const calNextBtn = document.getElementById("cal-next-month");
    const selectedDateText = document.getElementById("selected-date-text");

    // Modal (Детали товара)
    const detailsModal = document.getElementById("details-modal");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const detailsOverlay = document.getElementById("details-overlay");
    const modalBookBtn = document.getElementById("modal-book-btn");

    // ----------------- TELEGRAM WEBAPP -----------------
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        console.log("Telegram найден ✅", Telegram.WebApp.initDataUnsafe?.user);
    } else {
        console.log("Telegram НЕ найден ❌");
    }

    // ----------------- УПРАВЛЕНИЕ ШТОРКОЙ (DRAWER) -----------------
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
            if (href && !href.startsWith('#')) return;

            e.preventDefault();
            const targetTabId = button.dataset.tab;

            if (targetTabId === "tab-cart") {
                window.openBookingDrawer();
                return;
            }

            navItems.forEach(btn => btn.classList.remove("active"));
            document.querySelectorAll(".tab_content").forEach(tab => {
                tab.style.display = "none";
            });

            button.classList.add("active");
            if (targetTabId) {
                const targetTab = document.getElementById(targetTabId);
                if (targetTab) targetTab.style.display = "block";
            }
        });
    });

    // ----------------- СОХРАНЕНИЕ И ОБНОВЛЕНИЕ КОРЗИНЫ -----------------
    function saveAndUpdateCart() {
        localStorage.setItem('timurtour_cart', JSON.stringify(cart));
        
        const totalQty = cart.reduce((sum, item) => sum + (Number(item.qty || item.quantity) || 0), 0);
        const totalSum = cart.reduce((sum, item) => {
            const itemQty = Number(item.qty || item.quantity) || 1;
            const itemPrice = Number(item.price || item.pricePerUnit || (item.totalPrice ? item.totalPrice / itemQty : 0)) || 0;
            return sum + (itemPrice * itemQty);
        }, 0);

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

        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
    }

    saveAndUpdateCart();

    if (floatingCart) {
        floatingCart.addEventListener("click", window.openBookingDrawer);
    }

    // ----------------- ИНИЦИАЛИЗАЦИЯ КАРТОЧЕК ТОВАРОВ -----------------
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
                const computedTotal = Number(currentPricePerUnit) * Number(currentQty);

                const existingItem = cart.find(item => 
                    (item.id === productId || item.productId === productId) && 
                    (item.durationText === cleanDurationText || item.duration === cleanDurationText)
                );

                if (existingItem) {
                    const newQty = Number(existingItem.qty || existingItem.quantity || 0) + Number(currentQty);
                    const unitPrice = Number(existingItem.pricePerUnit || existingItem.price || currentPricePerUnit);

                    existingItem.qty = newQty;
                    existingItem.quantity = newQty;
                    existingItem.count = newQty;
                    existingItem.totalPrice = newQty * unitPrice;
                    existingItem.price = unitPrice;
                } else {
                    cart.push({
                        id: productId,
                        productId: productId,
                        title: productName,
                        productName: productName,
                        name: productName,
                        duration: cleanDurationText,
                        durationText: cleanDurationText,
                        subtitle: cleanDurationText,
                        qty: Number(currentQty),
                        quantity: Number(currentQty),
                        count: Number(currentQty),
                        price: Number(currentPricePerUnit),
                        pricePerUnit: Number(currentPricePerUnit),
                        totalPrice: computedTotal,
                        cost: Number(currentPricePerUnit),
                        type: 'ОРЕНДА'
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
                
                if (detailsModal) detailsModal.style.display = "flex";
            });
        }
    });

    if (modalBookBtn) {
        modalBookBtn.addEventListener("click", () => {
            const targetId = modalBookBtn.getAttribute("data-target-id");
            if (targetId) {
                if (detailsModal) detailsModal.style.display = "none";
                const targetCard = document.querySelector(`.product-card[data-id="${targetId}"]`);
                if (targetCard) {
                    const targetBookBtn = targetCard.querySelector(".book-btn");
                    if (targetBookBtn) targetBookBtn.click();
                }
            }
        });
    }

    // ----------------- ГЛОБАЛЬНЫЙ КЛИК ПО ".book-btn" -----------------
    document.addEventListener("click", (e) => {
        const bookBtn = e.target.closest(".book-btn");
        if (!bookBtn) return;

        if (typeof window.openBookingDrawer === "function") {
            window.openBookingDrawer();
        }
    });

    // ----------------- РЕНДЕР КОРЗИНЫ В DRAWER -----------------
    function renderCart() {
        const container = document.getElementById("cart-items-container");
        const grandTotalDisplay = document.getElementById("cart-grand-total");
        if (!container) return;

        container.innerHTML = "";
        let grandTotal = 0;

        if (!cart || cart.length === 0) {
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 35px 10px; color: #64748b;">
                    <p style="font-size: 1.1rem; font-weight: 700; margin: 0 0 6px 0; color: #0f172a;">Ваш кошик порожній</p>
                    <span style="font-size: 0.88rem; color: #64748b;">Оберіть щось у каталозі</span>
                </div>
            `;
            if (grandTotalDisplay) grandTotalDisplay.textContent = "0";
            saveAndUpdateCart();
            return;
        }

        cart.forEach((item, index) => {
            const title = item.productName || item.title || item.name || "Товар";
            const subtitle = item.durationText || item.duration || item.type || "";
            const qty = Number(item.quantity || item.qty || item.count || 1);
            
            const unitPrice = Number(item.pricePerUnit || item.price || (item.totalPrice ? item.totalPrice / qty : 0));
            const itemTotal = Number(item.totalPrice) || (unitPrice * qty);
            
            item.quantity = qty;
            item.qty = qty;
            item.pricePerUnit = unitPrice;
            item.price = unitPrice;
            item.totalPrice = itemTotal;

            grandTotal += itemTotal;

            const cartItemHtml = `
                <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border-radius: 12px; padding: 12px 16px; border: 1px solid #e2e8f0; margin-bottom: 8px;">
                    <div style="display: flex; flex-direction: column; gap: 4px; max-width: 45%;">
                        <span style="font-weight: 700; color: #0f172a; font-size: 0.95rem; line-height: 1.2;">${title}</span>
                        <span style="font-size: 0.8rem; color: #64748b; font-weight: 500;">${subtitle}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px 8px;">
                        <button type="button" class="drawer-qty-minus" data-index="${index}" style="background: none; border: none; cursor: pointer; font-weight: bold; color: #64748b;">-</button>
                        <span style="font-weight: 700; font-size: 0.9rem; min-width: 16px; text-align: center;">${qty}</span>
                        <button type="button" class="drawer-qty-plus" data-index="${index}" style="background: none; border: none; cursor: pointer; font-weight: bold; color: #64748b;">+</button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-weight: 800; color: #0f172a; font-size: 0.95rem; min-width: 70px; text-align: right;">${itemTotal} грн</span>
                        <button type="button" class="btn-remove-cart-item" data-index="${index}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.3rem; font-weight: bold;">&times;</button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", cartItemHtml);
        });

        if (grandTotalDisplay) grandTotalDisplay.textContent = grandTotal;

        // ПЛЮС
        container.querySelectorAll(".drawer-qty-plus").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                const currentItem = cart[idx];
                const currentQty = Number(currentItem.quantity || currentItem.qty || 1) + 1;
                const unitPrice = Number(currentItem.pricePerUnit || currentItem.price || 0);

                currentItem.quantity = currentQty;
                currentItem.qty = currentQty;
                currentItem.totalPrice = currentQty * unitPrice;

                saveAndUpdateCart();
                renderCart();
            });
        });

        // МИНУС
        container.querySelectorAll(".drawer-qty-minus").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                const currentItem = cart[idx];
                const currentQty = Number(currentItem.quantity || currentItem.qty || 1);
                
                if (currentQty > 1) {
                    const newQty = currentQty - 1;
                    const unitPrice = Number(currentItem.pricePerUnit || currentItem.price || 0);

                    currentItem.quantity = newQty;
                    currentItem.qty = newQty;
                    currentItem.totalPrice = newQty * unitPrice;

                    saveAndUpdateCart();
                    renderCart();
                }
            });
        });

        // УДАЛЕНИЕ
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
                        selectedDateText.innerHTML = `<i class="fa-regular fa-calendar-check" style="color: #0088cc; font-size: 1.1rem;"></i> ${day} ${ukMonthsGenitive[month]} ${year}`;
                        selectedDateText.style.color = "#0f172a";
                    }
                    
                    const rentalDateInput = document.getElementById('checkout-rental-date');
                    if (rentalDateInput) rentalDateInput.value = selectedDate;

                    initTimeSlots();
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
        const grid = document.getElementById('time-slots-grid');
        if (!grid || typeof availableTimeSlots === 'undefined') return;

        grid.innerHTML = "";

        const rentalDateInput = document.getElementById('checkout-rental-date');
        if (rentalDateInput && rentalDateInput.value) {
            selectedDate = rentalDateInput.value;
        }

        const now = new Date();
        const todayStr = now.toLocaleDateString('sv'); 
        const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
        const isToday = (selectedDate === todayStr);

        availableTimeSlots.forEach(time => {
            const timeBtn = document.createElement("button");
            timeBtn.type = "button";
            timeBtn.classList.add("time-slot-btn");
            timeBtn.textContent = time;

            if (selectedTime === time) {
                timeBtn.classList.add("active");
            }

            let isPastSlot = false;
            if (isToday) {
                const [h, m] = time.split(':').map(Number);
                const slotTotalMinutes = h * 60 + m;
                if (slotTotalMinutes <= currentTotalMinutes) {
                    isPastSlot = true;
                }
            }

            if (isPastSlot) {
                timeBtn.style.cssText = "background: #f1f5f9 !important; color: #cbd5e1 !important; border: 1px solid #e2e8f0 !important; cursor: not-allowed !important; opacity: 0.6;";
                timeBtn.disabled = true;
            } else {
                timeBtn.addEventListener("click", () => {
                    document.querySelectorAll(".time-slot-btn").forEach(el => el.classList.remove("active"));
                    timeBtn.classList.add("active");

                    selectedTime = time;

                    const hiddenTimeInput = document.getElementById('checkout-rental-time');
                    if (hiddenTimeInput) {
                        hiddenTimeInput.value = time;
                    }
                });
            }

            grid.appendChild(timeBtn);
        });
    }

    initTimeSlots();

    const rentalDateInput = document.getElementById('checkout-rental-date');
    if (rentalDateInput) {
        rentalDateInput.addEventListener('change', (e) => {
            selectedDate = e.target.value;
            selectedTime = null;

            const hiddenTimeInput = document.getElementById('checkout-rental-time');
            if (hiddenTimeInput) hiddenTimeInput.value = "";

            initTimeSlots();
        });
    }

    // ----------------- 3. ПРОВЕРКА ДАННЫХ И МОДАЛКА ЧЕКА -----------------
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!cart || cart.length === 0) {
                alert("Ваш кошик порожній!");
                return;
            }

            const dateInput = document.getElementById("checkout-rental-date");
            const timeInput = document.getElementById("checkout-rental-time");

            const effectiveDate = dateInput?.value || selectedDate;
            const effectiveTime = timeInput?.value || selectedTime;

            if (!effectiveDate || !effectiveTime) {
                alert("Будь ласка, оберіть дату та час для бронювання!");
                return;
            }

            selectedDate = effectiveDate;
            selectedTime = effectiveTime;

            const nameInput = document.getElementById("user-name");
            const phoneInput = document.getElementById("user-phone");

            const name = nameInput ? nameInput.value.trim() : "Не вказано";
            const phone = phoneInput ? phoneInput.value.trim() : "Не вказано";
            
            const totalCartPrice = cart.reduce((sum, item) => {
                const itemQty = Number(item.qty || item.quantity || 1);
                const itemPrice = Number(item.price || item.pricePerUnit || (item.totalPrice ? item.totalPrice / itemQty : 0));
                return sum + (Number(item.totalPrice) || (itemPrice * itemQty));
            }, 0);

            const itemsSummary = cart.map(item => {
                const title = item.productName || item.title || item.name || "Товар";
                const duration = item.durationText || item.duration || item.subtitle || "1 година";
                const qty = item.quantity || item.qty || 1;
                return `${title} (${duration}) x${qty}`;
            }).join("<br>");

            const dateParts = selectedDate.split("-");
            const formattedDate = dateParts.length === 3 ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}` : selectedDate;

            if (detailsContainer) {
                detailsContainer.innerHTML = `
                    <div><strong style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 2px;">ІМ'Я:</strong> <span style="font-weight: 700; color: #0f172a;">${name}</span></div>
                    <div style="border-top: 1px dashed #e2e8f0; padding-top: 8px;"><strong style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 2px;">ТЕЛЕФОН:</strong> <span style="font-weight: 700; color: #0f172a;">${phone}</span></div>
                    <div style="border-top: 1px dashed #e2e8f0; padding-top: 8px;"><strong style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 2px;">ДАТА ТА ЧАС:</strong> <span style="font-weight: 700; color: #0f172a;">📅 ${formattedDate} о ${selectedTime}</span></div>
                    <div style="border-top: 1px dashed #e2e8f0; padding-top: 8px;"><strong style="color: #64748b; font-size: 0.85rem; display: block; margin-bottom: 2px;">ЗАМОВЛЕННЯ:</strong> <span style="font-weight: 600; color: #0f172a; line-height: 1.3;">${itemsSummary}</span></div>
                    <div style="border-top: 1px dashed #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;"><strong style="color: #64748b; font-size: 0.85rem;">ЗАГАЛЬНА СУМА:</strong> <span style="font-weight: 800; color: #0284c7; font-size: 1.1rem;">${totalCartPrice} грн</span></div>
                `;
            }

            if (checkModal) {
                checkModal.style.display = "flex";
                setTimeout(() => { 
                    if (checkModal.firstElementChild) checkModal.firstElementChild.style.transform = "scale(1)"; 
                }, 50);
            }
        });
    }

    // Закрытие модалки проверки
    const closeCheckModal = () => {
        if (checkModal) checkModal.style.display = "none";
    };

    const checkBackBtn = document.getElementById("check-back-btn");
    if (checkBackBtn) {
        checkBackBtn.addEventListener("click", closeCheckModal);
    }

    if (checkModal) {
        checkModal.addEventListener("click", (e) => {
            if (e.target === checkModal) closeCheckModal();
        });
    }

    // Кнопка «Внести передплату»: переводит на Шаг 5 (Оплата)
    const checkConfirmBtn = document.getElementById("check-confirm-btn");
    if (checkConfirmBtn) {
        checkConfirmBtn.addEventListener("click", () => {
            closeCheckModal();

            // Расчет 30% предоплаты и 70% остатка
            const totalCartPrice = cart.reduce((sum, item) => {
                const itemQty = Number(item.qty || item.quantity || 1);
                const itemPrice = Number(item.price || item.pricePerUnit || (item.totalPrice ? item.totalPrice / itemQty : 0));
                return sum + (Number(item.totalPrice) || (itemPrice * itemQty));
            }, 0);

            const prepay30 = Math.round(totalCartPrice * 0.3);
            const rest70 = totalCartPrice - prepay30;

            // Подставляем значения в карточку оплаты
            const totalElem = document.getElementById("payment-total-full");
            const prepayElem = document.getElementById("payment-prepay-amount");
            const restElem = document.getElementById("payment-rest-amount");

            if (totalElem) totalElem.textContent = `${totalCartPrice} грн`;
            if (prepayElem) prepayElem.textContent = `${prepay30} грн`;
            if (restElem) restElem.textContent = `${rest70} грн`;

            // Переключаем шаги в Drawer
            if (stepCart) stepCart.style.display = "none";
            if (stepCheckout) stepCheckout.style.display = "none";
            
            const stepPayment = document.getElementById("drawer-step-payment");
            if (stepPayment) stepPayment.style.display = "block";

            if (drawerTitle) drawerTitle.textContent = "Деталі оплати";

            if (typeof window.openBookingDrawer === "function") {
                window.openBookingDrawer();
            }
        });
    }

    // ----------------- 4. ОБРАБОТКА ЧЕКА, КОПИРОВАНИЕ И ОТПРАВКА В N8N -----------------
    
    // Загрузка и превью скриншота чека
    const uploadZone = document.getElementById("upload-zone");
    const receiptFileInput = document.getElementById("receipt-file-input");
    const uploadIdleState = document.getElementById("upload-idle-state");
    const uploadPreviewState = document.getElementById("upload-preview-state");
    const receiptPreviewImg = document.getElementById("receipt-preview-img");

    if (uploadZone && receiptFileInput) {
        uploadZone.addEventListener("click", () => receiptFileInput.click());

        receiptFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                window.currentReceiptFile = file;
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (receiptPreviewImg) receiptPreviewImg.src = event.target.result;
                    if (uploadIdleState) uploadIdleState.style.display = "none";
                    if (uploadPreviewState) uploadPreviewState.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Клик-копирование реквизитов (IBAN, ЄДРПОУ, Призначення)
    document.querySelectorAll(".copy-card").forEach(card => {
        card.addEventListener("click", () => {
            const targetId = card.getAttribute("data-copy-target");
            const targetElem = document.getElementById(targetId);
            if (targetElem) {
                navigator.clipboard.writeText(targetElem.textContent.trim());
                alert("Скопійовано в буфер обміну!");
            }
        });
    });

    // Функция отправки заказа на n8n webhook
    const executeOrderSubmission = async () => {
        const btnSubmitFinal = document.getElementById("btn-submit-final-booking");

        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user || null;
        const telegramId = tgUser?.id ? String(tgUser.id) : "Сайт (Браузер)";

        const name = document.getElementById("user-name")?.value.trim() || "Не вказано";
        const phone = document.getElementById("user-phone")?.value.trim() || "Не вказано";

        const rentalDate = document.getElementById("checkout-rental-date")?.value || selectedDate || "";
        const rentalTime = document.getElementById("checkout-rental-time")?.value || selectedTime || "";
        const tourDate = document.getElementById("checkout-tour-date")?.value || "";

        const totalCartPrice = cart.reduce((sum, item) => {
            const itemQty = Number(item.qty || item.quantity || 1);
            const itemPrice = Number(item.price || item.pricePerUnit || (item.totalPrice ? item.totalPrice / itemQty : 0));
            return sum + (Number(item.totalPrice) || (itemPrice * itemQty));
        }, 0);

        const generatedOrderId = Math.floor(100000 + Math.random() * 900000).toString();
        const scheduledAtFormatted = (rentalDate || tourDate) ? `${rentalDate || tourDate} ${rentalTime}`.trim() : 'Не вказано';

        const payload = {
            id: generatedOrderId,
            customer: { name, phone, telegramId },
            booking: {
                id: generatedOrderId,
                scheduledAt: scheduledAtFormatted,
                items: cart.map(item => {
                    const pName = (item.productName || item.title || item.name || "").toLowerCase();
                    const pId = (item.productId || item.id || "").toLowerCase();

                    const isTour = item.isTour || item.type === 'tour' || 
                                   pId.includes('tour') || pName.includes('похід') || 
                                   pName.includes('тур') || pName.includes('подія');

                    let itemDate = item.date || item.rentalDate || item.tourDate || item.selectedDate || "";
                    let itemTime = item.time || item.rentalTime || item.selectedTime || "";

                    if (!itemDate) itemDate = isTour ? (tourDate || rentalDate) : rentalDate;
                    if (!itemTime && !isTour) itemTime = rentalTime;

                    const qty = Number(item.quantity || item.qty || 1);
                    const itemTotalPrice = item.totalPrice !== undefined && item.totalPrice !== null && !isNaN(Number(item.totalPrice))
                        ? Number(item.totalPrice)
                        : (Number(item.price || 0) * qty);

                    return {
                        productId: item.productId || item.id || 'unknown',
                        productName: item.productName || item.title || item.name || 'Товар',
                        duration: item.durationText || item.duration || '1 година',
                        quantity: qty,
                        totalPrice: itemTotalPrice,
                        date: itemDate || 'Дата не вказана',
                        time: itemTime || '',
                        img: item.img || item.image || item.imgSrc || item.photo || ''
                    };
                }),
                totalPrice: totalCartPrice,
                rentalDate: rentalDate,
                rentalTime: rentalTime,
                tourDate: tourDate
            },
            meta: {
                source: "Website Catalog",
                createdAt: new Date().toISOString()
            }
        };

        // Защита от спам-кликов
        let originalText = "";
        if (btnSubmitFinal) {
            originalText = btnSubmitFinal.textContent;
            btnSubmitFinal.disabled = true;
            btnSubmitFinal.textContent = "Обробка...";
        }

        saveOrderToHistory(payload.booking);

        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload));
        
        const receiptInput = document.getElementById('receipt-file-input');
        const fileToSend = window.currentReceiptFile || receiptInput?.files?.[0];
        
        if (fileToSend) {
            formData.append("receipt_file", fileToSend);
        }

        try {
            const response = await fetch(
                "https://tiktiok.xyz/webhook/219a97d0-2e45-4479-947d-08702f215d52",
                { method: "POST", body: formData }
            );

            if (!response.ok) throw new Error(`Помилка сервера: ${response.status}`);

            // Очистка состояния после успешной отправки
            cart = [];
            selectedDate = null;
            selectedTime = null;
            window.currentReceiptFile = null;

            saveAndUpdateCart();

            document.getElementById("booking-checkout-form")?.reset();

            if (uploadIdleState) uploadIdleState.style.display = "flex";
            if (uploadPreviewState) uploadPreviewState.style.display = "none";
            if (receiptFileInput) receiptFileInput.value = "";

            closeCheckModal();
            window.closeBookingDrawer?.();

            // Показываем окно успеха
            const successModal = document.getElementById("success-modal");
            if (successModal) {
                successModal.style.display = "flex";
                setTimeout(() => {
                    if (successModal.firstElementChild) successModal.firstElementChild.style.transform = "scale(1)";
                }, 50);
            }

        } catch (error) {
            console.error("Помилка відправки:", error);
            alert("❌ Не вдалося відправити бронювання. Спробуйте ще раз.");
        } finally {
            if (btnSubmitFinal) {
                btnSubmitFinal.disabled = false;
                btnSubmitFinal.textContent = originalText || "Підтвердити та надіслати";
            }
        }
    };

    // Навешиваем клик на финальную кнопку отправки
    const btnSubmitFinal = document.getElementById("btn-submit-final-booking");
    if (btnSubmitFinal) {
        btnSubmitFinal.addEventListener("click", executeOrderSubmission);
    }

    // Закрытие окна успеха по кнопке «Чудово»
    const closeSuccessBtn = document.getElementById("close-success-btn");
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener("click", () => {
            const successModal = document.getElementById("success-modal");
            if (successModal) successModal.style.display = "none";
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    renderOrdersHistory();
});