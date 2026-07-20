// Глобальный стейт — наш инвестиционный портфель
let cart = [];

// Выбранные пользователем дата и время
let selectedDate = null; // Будет хранить "YYYY-MM-DD"
let selectedTime = null; // Будет хранить "HH:MM"

// Текущая дата для навигации внутри календаря
let navDate = new Date();

document.addEventListener("DOMContentLoaded", () => {
    const productCards = document.querySelectorAll(".product-card");
    
    // Элементы Drawer (Заказ)
    const bookingDrawer = document.getElementById("booking-drawer");
    const btnCloseDrawer = document.getElementById("btn-close-drawer");
    const drawerCloseOverlay = document.getElementById("drawer-close-overlay");
    const checkoutForm = document.getElementById("booking-checkout-form");

    // Плавающая кнопка корзины
    const floatingCart = document.getElementById("floating-cart");

    // Элементы нового календаря
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

    // Элементы Modal (Детали)
    const detailsModal = document.getElementById("details-modal");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const detailsOverlay = document.getElementById("details-overlay");
    const modalBookBtn = document.getElementById("modal-book-btn");

    // Локализация для календаря
    const ukMonths = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
    const ukMonthsGenitive = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
    const availableTimeSlots = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"];

    // ================= ОБНОВЛЕНИЕ ПЛАВАЮЩЕЙ КНОПКИ =================
    function updateFloatingCart() {
        const cartCount = document.getElementById("floating-cart-count");
        const cartTotal = document.getElementById("floating-cart-total");
        if (!floatingCart) return;
        
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalSum = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        
        if (totalQty > 0) {
            floatingCart.style.display = "flex";
            if (cartCount) cartCount.textContent = totalQty;
            if (cartTotal) cartTotal.textContent = totalSum;
        } else {
            floatingCart.style.display = "none";
            closeBookingDrawer();
        }
    }

    if (floatingCart) {
        floatingCart.addEventListener("click", () => {
            openBookingDrawer();
        });
    }

    // ================= ИНИЦИАЛИЗАЦИЯ КАРТОЧЕК ТОВАРОВ =================
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

        const productName = card.querySelector(".product-name").textContent;
        const productId = card.getAttribute("data-id");

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
                dropdown.classList.toggle("open");
            });
        }

        dropdownItems.forEach(item => {
            item.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdownItems.forEach(el => el.classList.remove("active"));
                item.classList.add("active");

                currentDurationText = item.textContent;
                if (textSpan) textSpan.textContent = currentDurationText;

                currentPricePerUnit = parseInt(item.getAttribute("data-price")) || 300;
                dropdown.classList.remove("open");
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
                    qtyValue.textContent = currentQty;
                    updateCardPrice();
                }
            });
        }

        if (btnPlus) {
            btnPlus.addEventListener("click", () => {
                if (currentQty < 10) {
                    currentQty++;
                    qtyValue.textContent = currentQty;
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

                const originalContent = bookBtn.innerHTML;
                bookBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Додано!`;
                bookBtn.style.background = "#10b981";
                bookBtn.style.borderColor = "#10b981";
                
                setTimeout(() => {
                    bookBtn.innerHTML = originalContent;
                    bookBtn.style.background = "";
                    bookBtn.style.borderColor = "";
                }, 1200);

                updateFloatingCart();
            });
        }

        if (detailsBtn) {
            detailsBtn.addEventListener("click", () => {
                const productImg = card.querySelector(".product-img-box img").src;
                const productDesc = card.querySelector(".product-desc").textContent;
                const productSpecsHtml = card.querySelector(".product-specs").innerHTML;

                document.getElementById("modal-product-name").textContent = productName;
                document.getElementById("modal-product-img").src = productImg;
                document.getElementById("modal-product-img").alt = productName;
                document.getElementById("modal-product-desc").textContent = productDesc;
                document.getElementById("modal-product-specs").innerHTML = productSpecsHtml;

                modalBookBtn.setAttribute("data-target-id", productId);
                openDetailsModal();
            });
        }
    });

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

    // ================= ДИНАМИЧЕСКИЙ РЕНДЕР КОРЗИНЫ =================
    function renderCart() {
        const container = document.getElementById("cart-items-container");
        const grandTotalDisplay = document.getElementById("cart-grand-total");
        if (!container) return;
        container.innerHTML = "";
        let grandTotal = 0;

        cart.forEach((item, index) => {
            grandTotal += item.totalPrice;
            const cartItemHtml = `
                <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border-radius: 12px; padding: 12px 16px; border: 1px solid #e2e8f0;">
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

        document.querySelectorAll(".drawer-qty-plus").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                cart[idx].quantity++;
                cart[idx].totalPrice = cart[idx].quantity * cart[idx].pricePerUnit;
                renderCart();
                updateFloatingCart();
            });
        });

        document.querySelectorAll(".drawer-qty-minus").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity--;
                    cart[idx].totalPrice = cart[idx].quantity * cart[idx].pricePerUnit;
                    renderCart();
                    updateFloatingCart();
                }
            });
        });

        document.querySelectorAll(".btn-remove-cart-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                cart.splice(idx, 1);
                renderCart();
                updateFloatingCart();
            });
        });
    }

    // ================= ГЕНЕРАЦИЯ МАТРИЧНОГО КАЛЕНДАРЯ НА ЛЮБОЙ МЕСЯЦ =================
    function renderFullCalendar() {
        const year = navDate.getFullYear();
        const month = navDate.getMonth();
        
        // Пишем месяц в шапку модалки
        calMonthYearTitle.textContent = `${ukMonths[month]} ${year}`;
        calDaysGrid.innerHTML = "";

        // Смещение дней (какой день недели первый в месяце)
        let firstDayIndex = new Date(year, month, 1).getDay();
        firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Делаем Пн = 0, Вс = 6

        // Сколько всего дней в текущем месяце
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Заполняем пустые слоты до начала месяца
        for (let i = 0; i < firstDayIndex; i++) {
            calDaysGrid.insertAdjacentHTML("beforeend", "<div></div>");
        }

        // Сегодняшняя дата в формате YYYY-MM-DD для сверки
        const todayStr = new Date().toISOString().split('T')[0];

        // Генерируем дни
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isPast = dateStr < todayStr;
            const isSelected = dateStr === selectedDate;

            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = day;
            
            // Стилизация кнопок дней на лету
            btn.style.cssText = `width: 46px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: none; font-weight: 700; font-size: 0.85rem; cursor: pointer; margin: auto; transition: all 0.15s;`;

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

            // Клик по конкретному дню
            if (!isPast) {
                btn.addEventListener("click", () => {
                    selectedDate = dateStr;
                    selectedDateText.innerHTML = `<i class="fa-regular fa-calendar-check" style="color: #10b981; font-size: 1.1rem;"></i> ${day} ${ukMonthsGenitive[month]} ${year}`;
                    selectedDateText.style.color = "#0f172a";
                    updateHiddenInput();
                    closeCalendarModal();
                });
            }

            calDaysGrid.appendChild(btn);
        }
    }

    // Листание месяцев
    calPrevBtn.addEventListener("click", () => {
        // Не пускаем листать назад дальше текущего месяца
        const currentRealDate = new Date();
        if (navDate.getFullYear() === currentRealDate.getFullYear() && navDate.getMonth() === currentRealDate.getMonth()) {
            return;
        }
        navDate.setMonth(navDate.getMonth() - 1);
        renderFullCalendar();
    });

    calNextBtn.addEventListener("click", () => {
        navDate.setMonth(navDate.getMonth() + 1);
        renderFullCalendar();
    });

    // Управление модалкой календаря
    function openCalendarModal() {
        calendarModal.style.display = "flex";
        renderFullCalendar();
    }

    function closeCalendarModal() {
        calendarModal.style.display = "none";
    }

    if (btnOpenCalendar) btnOpenCalendar.addEventListener("click", openCalendarModal);
    if (calendarModalOverlay) calendarModalOverlay.addEventListener("click", closeCalendarModal);

    // ================= ГЕНЕРАЦИЯ СЛОТОВ ВРЕМЕНИ =================
    function initTimeSlots() {
        timeSlotsGrid.innerHTML = "";
        selectedTime = null;
        hiddenDateTimeInput.value = "";

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

    function updateHiddenInput() {
        if (selectedDate && selectedTime) {
            hiddenDateTimeInput.value = `${selectedDate}T${selectedTime}`;
        } else {
            hiddenDateTimeInput.value = "";
        }
    }

    // ================= УПРАВЛЕНИЕ DRAWER =================
    function openBookingDrawer() {
        initTimeSlots();
        renderCart();
        bookingDrawer.classList.add("open");
    }

    function closeBookingDrawer() {
        bookingDrawer.classList.remove("open");
        closeCalendarModal();
    }

    btnCloseDrawer.addEventListener("click", closeBookingDrawer);
    drawerCloseOverlay.addEventListener("click", closeBookingDrawer);

    // ================= MODAL ДЕТАЛЕЙ =================
    function openDetailsModal() { detailsModal.classList.add("open"); }
    function closeDetailsModal() { detailsModal.classList.remove("open"); }
    btnCloseModal.addEventListener("click", closeDetailsModal);
    detailsOverlay.addEventListener("click", closeDetailsModal);

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeBookingDrawer();
            closeDetailsModal();
            closeCalendarModal();
        }
    });

    // ================= ОТПРАВКА ДАННЫХ В N8N С ПРЕДВАРИТЕЛЬНОЙ ПРОВЕРКОЙ =================
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault(); // 1. СТОПАЕМ автоматическую отправку

        if (cart.length === 0) {
            alert("Ваш кошик порожній!");
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert("Будь ласка, оберіть дату та час для бронювання!");
            return;
        }

        // Вытаскиваем то, что юзер ввел в инпуты прямо сейчас
        const name = document.getElementById("user-name").value.trim();
        const phone = document.getElementById("user-phone").value.trim();
        const totalCartPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

        // Собираем красивый текстовый список каяков для плашки проверки
        const itemsSummary = cart.map(item => `${item.productName} (${item.durationText}) x${item.quantity}`).join("<br>");

        // Красиво форматируем дату для вывода человеку (из "2026-07-17" делаем человеческий вид)
        const dateParts = selectedDate.split("-");
        const formattedDate = dateParts.length === 3 ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}` : selectedDate;

        // 2. ЗАПИХИВАЕМ ДАННЫЕ В ПЛАШКУ ПРОВЕРКИ
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

        // 3. ПОКАЗЫВАЕМ ПЛАШКУ ПРОВЕРКИ
        const checkModal = document.getElementById("check-order-modal");
        if (checkModal) {
            checkModal.style.display = "flex";
            setTimeout(() => { checkModal.firstElementChild.style.transform = "scale(1)"; }, 50);
        }
    });

    // КНОПКА «НАЗАД» В ПЛАШКЕ ПРОВЕРКИ: Просто закрываем её
    document.getElementById("check-back-btn")?.addEventListener("click", () => {
        const checkModal = document.getElementById("check-order-modal");
        if (checkModal) {
            checkModal.style.display = "none";
            checkModal.firstElementChild.style.transform = "scale(0.9)";
        }
    });

    // КНОПКА «ЗАБРОНЮВАТИ» В ПЛАШКЕ ПРОВЕРКИ: Вот тут реальный улет данных в n8n!
    // КНОПКА «ЗАБРОНЮВАТИ» В ПЛАШКЕ ПРОВЕРКИ: Отправка данных на вебхук n8n
    document.getElementById("check-confirm-btn")?.addEventListener("click", () => {
        // Прячем окно проверки
        const checkModal = document.getElementById("check-order-modal");
        if (checkModal) checkModal.style.display = "none";

        const name = document.getElementById("user-name").value.trim();
        const phone = document.getElementById("user-phone").value.trim();
        const totalCartPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

        // Формируем payload для нашего жесткого Аудитора в n8n
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
                scheduledAt: hiddenDateTimeInput.value
            },
            meta: {
                source: "Website Catalog Verified Confirmation",
                createdAt: new Date().toISOString()
            }
        };

        console.log("✈️ Отправка пакета:", payload);

        // ================= ОТПРАВКА НА ВЕБХУК N8N =================
        fetch("https://tiktiok.xyz/webhook/219a97d0-2e45-4479-947d-08702f215d52", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка сети при отправке");
            }
            console.log("✅ Данные успешно доставлены!");
        })
        .catch(error => {
            console.error("❌ Не удалось отправить данные:", error);
        });
        // ==========================================================

        // Очищаем данные сайта (корзину и календарь)
        cart = [];
        selectedDate = null;
        selectedTime = null;
        if (selectedDateText) {
            selectedDateText.innerHTML = `<i class="fa-regular fa-calendar-days" style="color: #0284c7; font-size: 1.1rem;"></i> Натисніть, щоб обрати дату`;
            selectedDateText.style.color = "#64748b";
        }
        
        updateFloatingCart();
        checkoutForm.reset();
        closeBookingDrawer();

        // Вызываем красивое окошко успеха
        const successModal = document.getElementById("success-modal");
        if (successModal) {
            successModal.style.display = "flex";
            setTimeout(() => { successModal.firstElementChild.style.transform = "scale(1)"; }, 50);
        }
    });

    // КНОПКА «ЧУДОВО» В ПЛАШКЕ УСПЕХА: Закрывает всё окончательно
    document.getElementById("close-success-btn")?.addEventListener("click", () => {
        const successModal = document.getElementById("success-modal");
        if (successModal) {
            successModal.style.display = "none";
            successModal.firstElementChild.style.transform = "scale(0.9)";
        }
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".custom-dropdown").forEach(el => el.classList.remove("open"));
    });
});

