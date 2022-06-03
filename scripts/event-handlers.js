$(document).ready(function () {
    $('#products-container').hide();
    $('#checkout-container').hide();
    $('#cancel-order-button').hide();
    $('#confirm-order-button').hide();
    $('#checkout-button').hide();

    initializeBoxever();

    logView();
});

$('#login-button').click(function () {
    logIdentity();    
});

$('#add-to-order-product-001-button').click(function () {
    logAddItemToOrder(1, 'Awesome Product 001', 99.99);
});

$('#add-to-order-product-002-button').click(function () {
    logAddItemToOrder(2, 'Awesome Product 002', 149.99);
});

$('#add-to-order-product-003-button').click(function () {
    logAddItemToOrder(3, 'Awesome Product 003', 199.99);
});

$('#cancel-order-button').click(function () {
    logCancelOrder();
});

$('#confirm-order-button').click(function () {
    logConfirmOrder();
});

$('#checkout-button').click(function () {
    logCheckout();
});