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

    document.getElementById("check-confirm-btn")?.addEventListener("click", () => {
        const checkModal = document.getElementById("check-order-modal");
        if (checkModal) checkModal.style.display = "none";

        const nameInput = document.getElementById("user-name");
        const phoneInput = document.getElementById("user-phone");

        const name = nameInput ? nameInput.value.trim() : "";
        const phone = phoneInput ? phoneInput.value.trim() : "";
        const totalCartPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

        const payload = {
            customer: { name, phone },
            booking: {
                items: cart.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    duration: item.durationText,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice
                })),
                totalPrice: totalCartPrice,
                scheduledAt: hiddenDateTimeInput?.value || ""
            },
            meta: {
                source: "Website Catalog Verified Confirmation",
                createdAt: new Date().toISOString()
            }
        };

        console.log("✈️ Отправка пакета Аудитору:", payload);

        fetch("https://tiktiok.xyz/webhook-test/219a97d0-2e45-4479-947d-08702f215d52", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) throw new Error("Ошибка сети при отправке");
            console.log("✅ Данные успешно доставлены в n8n!");
        })
        .catch(error => {
            console.error("❌ Ошибка отправки:", error);
        });

        // Сброс состояния после отправки
        cart = [];
        selectedDate = null;
        selectedTime = null;
        if (selectedDateText) {
            selectedDateText.innerHTML = `<i class="fa-regular fa-calendar-days" style="color: #0284c7; font-size: 1.1rem;"></i> Виберіть бажану дату`;
            selectedDateText.style.color = "#64748b";
        }
        
        saveAndUpdateCart();
        if (checkoutForm) checkoutForm.reset();
        window.closeBookingDrawer();

        const successModal = document.getElementById("success-modal");
        if (successModal) {
            successModal.style.display = "flex";
            setTimeout(() => { if (successModal.firstElementChild) successModal.firstElementChild.style.transform = "scale(1)"; }, 50);
        }
    });

    document.getElementById("close-success-btn")?.addEventListener("click", () => {
        const successModal = document.getElementById("success-modal");
        if (successModal) {
            successModal.style.display = "none";
            if (successModal.firstElementChild) successModal.firstElementChild.style.transform = "scale(0.9)";
        }
    });

    // ----------------- ЯЗЫКОВОЙ ПЕРЕКЛЮЧАТЕЛЬ И CTA -----------------
    document.querySelectorAll('.lang-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.lang-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        });
    });

    const ctaBtn = document.getElementById('cta-order-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', window.openBookingDrawer);
    }

    // Закрытие dropdown по клику вне их зоны
    document.addEventListener("click", () => {
        document.querySelectorAll(".custom-dropdown").forEach(el => el.classList.remove("open"));
    });
});