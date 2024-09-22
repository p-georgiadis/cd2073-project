// Array to store products
const products = [
   {
      name: "Cherry",
      price: 5,
      quantity: 0,
      productId: 100,
      image: "./images/cherry.jpg"
   },
   {
      name: "Orange",
      price: 3,
      quantity: 0,
      productId: 101,
      image: "./images/orange.jpg"
   },
   {
      name: "Strawberry",
      price: 7,
      quantity: 0,
      productId: 102,
      image: "./images/strawberry.jpg"
   }
];

// Array to store cart items
let cart = [];

// Helper function to find a product in the products array
function findProduct(productId) {
   return products.find(product => product.productId === productId);
}

// Helper function to find a cart item
function findCartItem(productId) {
   return cart.find(item => item.productId === productId);
}

// Function to add product to cart
function addProductToCart(productId) {
   const product = findProduct(productId);
   if (!product) return;

   product.quantity += 1;  // Increase product quantity

   const cartItem = findCartItem(productId);
   if (cartItem) {
      cartItem.quantity += 1;
   } else {
      cart.push({ ...product, quantity: 1 });
   }
}

// Function to increase the quantity of a product in the cart
function increaseQuantity(productId) {
   const product = findProduct(productId);
   if (!product) return;

   product.quantity += 1;  // Increase product quantity
   const cartItem = findCartItem(productId);
   if (cartItem) cartItem.quantity += 1;
}

// Function to decrease the quantity of a product in the cart
function decreaseQuantity(productId) {
   const product = findProduct(productId);
   const cartItemIndex = cart.findIndex(item => item.productId === productId);

   if (cartItemIndex !== -1) {
      if (cart[cartItemIndex].quantity > 1) {
         cart[cartItemIndex].quantity -= 1;
         product.quantity -= 1;
      } else {
         removeProductFromCart(productId);
      }
   }
}

// Function to remove a product from the cart
function removeProductFromCart(productId) {
   const product = findProduct(productId);
   const productIndex = cart.findIndex(item => item.productId === productId);

   if (productIndex !== -1) {
      product.quantity = 0;  // Reset product quantity
      cart.splice(productIndex, 1);  // Remove the item from the cart
   }
}

// Function to calculate the total cost of the cart
function cartTotal() {
   return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to empty the cart
function emptyCart() {
   cart.forEach(item => {
      const product = findProduct(item.productId);
      if (product) product.quantity = 0;
   });
   cart = [];
   totalPaid = 0;  // Reset totalPaid when emptying the cart
}

// Function to handle payment
let totalPaid = 0;

function pay(amount) {
   totalPaid += amount;
   const totalCost = cartTotal();

   if (totalPaid >= totalCost) {
      const change = totalPaid - totalCost;
      totalPaid = 0;  // Reset after payment
      return change;
   } else {
      return totalPaid - totalCost;
   }
}

// Exporting the functions for testing
module.exports = {
   products,
   cart,
   addProductToCart,
   increaseQuantity,
   decreaseQuantity,
   removeProductFromCart,
   cartTotal,
   pay,
   emptyCart,
};

