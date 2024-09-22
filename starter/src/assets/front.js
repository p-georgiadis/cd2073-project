let currencySymbol = '$';
let exchangeRates = {
    USD: 1, // Base currency
    EUR: 0.85,
    YEN: 110
};
let currentCurrency = 'USD';  // Track the current selected currency

// Convert price based on the selected currency (for display purposes)
function convertPrice(priceInUSD, currency) {
    return (priceInUSD * exchangeRates[currency]).toFixed(2);
}

// Draws product list with converted prices
function drawProducts() {
    let productList = document.querySelector('.products');
    let productItems = '';
    products.forEach((element) => {
        const convertedPrice = convertPrice(element.price, currentCurrency);
        productItems += `
            <div data-productId='${element.productId}'>
                <img src='${element.image}' alt='${element.name}'>
                <h3>${element.name}</h3>
                <p>price: ${currencySymbol}${convertedPrice}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
    });
    productList.innerHTML = productItems;
}

// Draws cart with converted totals
function drawCart() {
    let cartList = document.querySelector('.cart');
    let cartItems = '';
    cart.forEach((element) => {
        const itemTotalUSD = element.price * element.quantity;
        const itemTotalConverted = convertPrice(itemTotalUSD, currentCurrency);

        cartItems += `
            <div data-productId='${element.productId}'>
                <h3>${element.name}</h3>
                <p>price: ${currencySymbol}${convertPrice(element.price, currentCurrency)}</p>
                <p>quantity: ${element.quantity}</p>
                <p>total: ${currencySymbol}${itemTotalConverted}</p>
                <button class="qup">+</button>
                <button class="qdown">-</button>
                <button class="remove">remove</button>
            </div>
        `;
    });
    cart.length ? (cartList.innerHTML = cartItems) : (cartList.innerHTML = 'Cart Empty');
}

// Draws checkout with converted totals
function drawCheckout() {
    let checkout = document.querySelector('.cart-total');
    checkout.innerHTML = '';

    let cartSum = cartTotal(); // Get total in USD
    let convertedCartSum = convertPrice(cartSum, currentCurrency); // Convert for display

    let div = document.createElement('div');
    div.innerHTML = `<p>Cart Total: ${currencySymbol}${convertedCartSum}</p>`;
    checkout.append(div);
}

// Function to handle currency switching
function switchCurrency(currency) {
    currentCurrency = currency;

    switch (currency) {
        case 'USD':
            currencySymbol = '$';
            break;
        case 'EUR':
            currencySymbol = '€';
            break;
        case 'YEN':
            currencySymbol = '¥';
            break;
        default:
            currencySymbol = '$';
    }

    drawProducts();
    drawCart();
    drawCheckout();
}

// Initialize store with products, cart, and checkout
drawProducts();
drawCart();
drawCheckout();

// Event listener for adding products to the cart
document.querySelector('.products').addEventListener('click', (e) => {
    let productId = e.target.parentNode.getAttribute('data-productId');
    productId *= 1;
    addProductToCart(productId);
    drawCart();
    drawCheckout();
});

// Event listener for handling cart actions
document.querySelector('.cart').addEventListener('click', (e) => {
    function runCartFunction(fn) {
        let productId = e.target.parentNode.getAttribute('data-productId');
        productId *= 1;
        fn(productId);
        drawCart();
        drawCheckout();
    }

    if (e.target.classList.contains('remove')) {
        runCartFunction(removeProductFromCart);
    } else if (e.target.classList.contains('qup')) {
        runCartFunction(increaseQuantity);
    } else if (e.target.classList.contains('qdown')) {
        runCartFunction(decreaseQuantity);
    }
});

// Event listener for payment
document.querySelector('.pay').addEventListener('click', (e) => {
    e.preventDefault();
    let amountReceived = parseFloat(document.querySelector('.received').value);

    // If the input is empty or NaN, set amountReceived to 0
    if (isNaN(amountReceived)) {
        amountReceived = 0;
    }

    // Convert amount received into USD before performing calculations
    let amountInUSD = amountReceived / exchangeRates[currentCurrency];
    let cashReturnUSD = pay(amountInUSD); // Calculations done in USD

    let paymentSummary = document.querySelector('.pay-summary');
    let div = document.createElement('div');

    // Convert the cash return to the current currency for display
    let cashReturnConverted = convertPrice(Math.abs(cashReturnUSD), currentCurrency);

    if (cashReturnUSD >= 0) {
        div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amountReceived.toFixed(2)}</p>
            <p>Cash Returned: ${currencySymbol}${cashReturnConverted}</p>
            <p>Thank you!</p>
            <p><button class="restart-btn">Click here to start again</button></p>
        `;
        emptyCart();
        drawCart();
        drawCheckout();

        // Add event listener to "restart" button for page reload
        div.querySelector('.restart-btn').addEventListener('click', () => {
            location.reload();  // Reloads the page to start fresh
        });
    } else {
        document.querySelector('.received').value = '';  // Reset the cash input field
        div.innerHTML = `
            <p>Cash Received: ${currencySymbol}${amountReceived.toFixed(2)}</p>
            <p>Remaining Balance: ${currencySymbol}${cashReturnConverted}</p>
            <p>Please pay the additional amount.</p>
            <hr/>
        `;
    }

    paymentSummary.append(div);
});

// Mock Credit Card Payment Event Listener
document.querySelector('.submit-payment').addEventListener('click', (e) => {
    e.preventDefault();

    const cardNumber = document.querySelector('.card-number').value;
    const expDate = document.querySelector('.exp-date').value;
    const cvv = document.querySelector('.cvv').value;
    const receipt = document.querySelector('.pay-summary');

    // Simple validation logic
    if (cardNumber.length === 16 && expDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/) && cvv.length === 3) {
        // Display successful payment message with card details
        receipt.innerHTML = `
            <p>Payment successful with card ending in ${cardNumber.slice(-4)}. Thank you!</p>
            <p><button class="restart-btn">Click here to start again</button></p>
        `;

        // Clear the cart and checkout after the payment
        emptyCart();
        drawCart();
        drawCheckout();

        // Add event listener to "restart" button for page reload
        receipt.querySelector('.restart-btn').addEventListener('click', () => {
            location.reload();  // Reloads the page to start fresh
        });
    } else {
        receipt.innerHTML = `<p>Invalid credit card details. Please check your information.</p>`;
    }
});

// Remove all items from the cart (Empty Cart button)
function dropCart() {
    let shoppingCart = document.querySelector('.empty-btn');
    let div = document.createElement("button");
    div.classList.add("empty");
    div.innerHTML = `Empty Cart`;
    shoppingCart.append(div);
}
dropCart();

document.querySelector('.empty-btn').addEventListener('click', (e) => {
    if (e.target.classList.contains('empty')) {
        emptyCart();
        drawCart();
        drawCheckout();
    }
});

// Currency switcher
function currencyBuilder() {
    let currencyPicker = document.querySelector('.currency-selector');
    let select = document.createElement("select");
    select.classList.add("currency-select");
    select.innerHTML = `
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="YEN">YEN</option>`;
    currencyPicker.append(select);
}
currencyBuilder();

document.querySelector('.currency-select').addEventListener('change', function handleChange(event) {
    switchCurrency(event.target.value);
});

// Add Product Form Handling
document.querySelector('.add-product-btn').addEventListener('click', (e) => {
    e.preventDefault();

    const productName = document.querySelector('#product-name').value;
    const productPrice = parseFloat(document.querySelector('#product-price').value);
    const productImage = document.querySelector('#product-image').value;

    // Create a new product object and add it to the products array
    const newProductId = products.length + 100; // Generate a new product ID
    const newProduct = {
        name: productName,
        price: productPrice,
        quantity: 0,
        productId: newProductId,
        image: productImage
    };

    products.push(newProduct); // Add new product to the array

    drawProducts(); // Redraw the products to show the new one
});
