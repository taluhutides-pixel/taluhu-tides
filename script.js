let cart = JSON.parse(localStorage.getItem("cart")) || [];

const buttons = document.querySelectorAll(".cart-button");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const modal = document.getElementById("product-modal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalClose = document.querySelector(".modal-close");
const modalCartButton = document.getElementById("modal-cart-button");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        addToCart(
            button.dataset.name,
            Number(button.dataset.price)
        );
    });
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    showNotification();
}

function updateCart() {
    let total = 0;
    let count = 0;

    if (cartItems) {
        cartItems.innerHTML = "";
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        if (cartItems) {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <span>Rp ${(item.price * item.quantity).toLocaleString("id-ID")}</span>
                <button onclick="removeItem(${index})">REMOVE</button>
            `;

            cartItems.appendChild(cartItem);
        }
    });

    if (cartTotal) {
        cartTotal.textContent =
            `Total: Rp ${total.toLocaleString("id-ID")}`;
    }

    if (cartCount) {
        cartCount.textContent = count;
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function showNotification() {
    const notification = document.createElement("div");
    notification.classList.add("cart-notification");
    notification.textContent = "CHECK CART";

    notification.addEventListener("click", () => {
        window.location.href = "cart.html";
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

const productImages = document.querySelectorAll(".product-image img");

productImages.forEach(image => {
    image.addEventListener("click", () => {
        const card = image.closest(".product-card");
        const name = card.querySelector("h3").textContent;
        const priceText = card.querySelector(".price").textContent;
        const button = card.querySelector(".cart-button");

        modalImage.src = image.src;
        modalName.textContent = name;
        modalPrice.textContent = priceText;

        modalCartButton.dataset.name =
            button.dataset.name;

        modalCartButton.dataset.price =
            button.dataset.price;

        modal.classList.add("show");
    });
});

if (modalClose) {
    modalClose.addEventListener("click", () => {
        modal.classList.remove("show");
    });
}

if (modal) {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
}

if (modalCartButton) {
    modalCartButton.addEventListener("click", () => {
        addToCart(
            modalCartButton.dataset.name,
            Number(modalCartButton.dataset.price)
        );

        modal.classList.remove("show");
    });
}

const checkoutButton =
    document.getElementById("checkout-button");

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
        } else {
            window.location.href = "checkout.html";
        }
    });
}

updateCart();
// ===============================
// PO BATCH 1 POPUP
// ===============================

const poPopup = document.getElementById("po-popup");
const popupClose = document.getElementById("popup-close");
const popupShop = document.getElementById("popup-shop");

if (poPopup) {
    const popupShown = sessionStorage.getItem("poPopupShown");

    if (popupShown === "true") {
        poPopup.style.display = "none";
    } else {
        sessionStorage.setItem("poPopupShown", "true");
    }
}

if (popupClose) {
    popupClose.addEventListener("click", () => {
        poPopup.style.display = "none";
    });
}

if (popupShop) {
    popupShop.addEventListener("click", () => {
        poPopup.style.display = "none";

        const shopSection = document.getElementById("shop");

        if (shopSection) {
            shopSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}
// ===============================
// CHECKOUT ORDER SUMMARY
// ===============================

const checkoutItems =
    document.getElementById("checkout-items");

const checkoutTotal =
    document.getElementById("checkout-total");

const orderDetails =
    document.getElementById("order-details");

const totalField =
    document.getElementById("total");

if (checkoutItems && checkoutTotal) {
    let checkoutTotalPrice = 0;
    let details = [];

    cart.forEach(item => {
        const itemTotal =
            item.price * item.quantity;

        checkoutTotalPrice += itemTotal;

        const checkoutItem =
            document.createElement("div");

        checkoutItem.classList.add("checkout-item");

        checkoutItem.innerHTML = `
            <span>${item.name}</span>
            <span>${item.quantity}</span>
            <span>
                Rp ${itemTotal.toLocaleString("id-ID")}
            </span>
        `;

        checkoutItems.appendChild(checkoutItem);

        details.push(
            `${item.name} × ${item.quantity} - Rp ${itemTotal.toLocaleString("id-ID")}`
        );
    });

    checkoutTotal.textContent =
        `Total: Rp ${checkoutTotalPrice.toLocaleString("id-ID")}`;

    if (orderDetails) {
        orderDetails.value =
            details.join("\n") +
            `\nTotal: Rp ${checkoutTotalPrice.toLocaleString("id-ID")}`;
    }

    if (totalField) {
        totalField.value =
            `Rp ${checkoutTotalPrice.toLocaleString("id-ID")}`;
    }
}

// ===============================
// INTERNAL / EXTERNAL
// ===============================

const checkoutOptions =
    document.querySelectorAll(".checkout-option");

checkoutOptions.forEach(option => {
    option.addEventListener("click", () => {
        checkoutOptions.forEach(button => {
            button.classList.remove("selected");
        });

        option.classList.add("selected");

        const customerType =
            document.getElementById("customer-type");

        if (customerType) {
            customerType.value =
                option.dataset.type;
        }
    });
});

// ===============================
// DELIVERY OPTION
// ===============================

const deliveryOptions =
    document.querySelectorAll(".delivery-option");

deliveryOptions.forEach(option => {
    option.addEventListener("click", () => {
        deliveryOptions.forEach(button => {
            button.classList.remove("selected");
        });

        option.classList.add("selected");

        const deliveryMethod =
            document.getElementById("delivery-method");

        if (deliveryMethod) {
            deliveryMethod.value =
                option.dataset.delivery;
        }
    });
});

// ===============================
// PAYMENT SCREENSHOT
// ===============================

const paymentScreenshot =
    document.getElementById("payment-screenshot");

const fileName =
    document.getElementById("file-name");

const paymentPreview =
    document.getElementById("payment-preview");

if (paymentScreenshot) {
    paymentScreenshot.addEventListener("change", () => {
        const file =
            paymentScreenshot.files[0];

        if (file) {
            fileName.textContent =
                file.name;

            const reader =
                new FileReader();

            reader.onload = function(event) {
                paymentPreview.src =
                    event.target.result;

                paymentPreview.style.display =
                    "block";
            };

            reader.readAsDataURL(file);
        }
    });
}

// ===============================
// SUBMIT ORDER TO GOOGLE SHEETS
// ===============================

const checkoutForm =
    document.getElementById("checkout-form");

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxyuZP-DsynLfpwhCawi1n4-f37XPp2YvhbqXthReGG4ql8weFsmgAXliA_CJ6mmjF9UA/exec";

if (checkoutForm) {

    checkoutForm.addEventListener("submit", async event => {

        event.preventDefault();

        const fullName =
            document.getElementById("full-name").value.trim();

        const phoneNumber =
            document.getElementById("phone-number").value.trim();

        const selectedCustomer =
            document.querySelector(".checkout-option.selected");

        const selectedDelivery =
            document.querySelector(".delivery-option.selected");

        if (!fullName) {
            alert("Please enter your full name.");
            return;
        }

        if (!phoneNumber) {
            alert("Please enter your active phone number.");
            return;
        }

        if (!selectedCustomer) {
            alert("Please select Internal or External.");
            return;
        }

        if (!selectedDelivery) {
            alert("Please select a delivery option.");
            return;
        }

        if (
            !paymentScreenshot ||
            !paymentScreenshot.files.length
        ) {
            alert("Please upload your payment screenshot.");
            return;
        }

        const customerType =
            selectedCustomer.dataset.type;

        const deliveryMethod =
            selectedDelivery.dataset.delivery;

        const total =
            cart.reduce(
                (sum, item) =>
                    sum + item.price * item.quantity,
                0
            );

        const details = cart.map(item => {
            const itemTotal =
                item.price * item.quantity;

            return `${item.name} × ${item.quantity} - Rp ${itemTotal.toLocaleString("id-ID")}`;
        });

        const orderDetails =
            details.join("\n") +
            `\nTotal: Rp ${total.toLocaleString("id-ID")}`;

        const file =
            paymentScreenshot.files[0];

        const submitButton =
            document.getElementById("submit-order");

        submitButton.disabled = true;
        submitButton.innerHTML = "SENDING...<br>please wait a moment<br>DO NOT REFRESH.";

        const reader = new FileReader();

        reader.onload = async function(event) {

            const paymentScreenshotData =
                event.target.result;

            const orderData = {
                full_name: fullName,
                phone_number: phoneNumber,
                customer_type: customerType,
                delivery_method: deliveryMethod,
                order_details: orderDetails,
                total: `Rp ${total.toLocaleString("id-ID")}`,
                payment_screenshot: paymentScreenshotData
            };

            try {

                await fetch(
                    GOOGLE_SCRIPT_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },
                        body: JSON.stringify(orderData)
                    }
                );

                alert(
                    "Order submitted successfully!"
                );

                localStorage.removeItem("cart");

                window.location.href =
                    "thankyou.html";

            } catch (error) {

                console.error(
                    "Order submission error:",
                    error
                );

                alert(
                    "Something went wrong while submitting your order. Please try again."
                );

                submitButton.disabled = false;
                submitButton.textContent =
                    "SUBMIT ORDER";
            }
        };

        reader.readAsDataURL(file);
    });
}