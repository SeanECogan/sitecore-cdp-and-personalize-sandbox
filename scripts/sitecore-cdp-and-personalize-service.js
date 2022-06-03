var commonParams = {
    'channel': 'WEB',
    'language': 'EN',
    'currency': 'USD',
    'page': 'Sitecore CDP and Personalize Sandbox',
    'pos': 'sean-cogan' //Must be equal to _boxever_settings.pointOfSale value (in boxever.js)
};

var order = [];

function initializeBoxever() {
    _boxeverq.push(function () {
        $('#debug-browser-id').text(Boxever.getID());
        $('#debug-bucket-id').text(Boxever.bucket_number);

        var urlParams = new URLSearchParams(window.location.search);
        var context = {
            'channel': commonParams.channel,
            'language': commonParams.language,
            'currencyCode': commonParams.currency,
            'pointOfSale': _boxever_settings.pointOfSale,
            'browserId': Boxever.getID(),
            'clientKey': _boxever_settings.client_key,
            'friendlyId': 'sean-web-experience', //Name of the experience in CDP
            'params': { 'fo': urlParams.has('fo') ? urlParams.get('fo') : '' }
        };
    });
}

function logView() {
    _boxeverq.push(function () {
        var viewEvent = Object.assign(commonParams, { 'type': 'VIEW', 'browser_id': Boxever.getID() });
        viewEvent = Boxever.addUTMParams(viewEvent);//Track campaigns catching UTM params

        Boxever.eventCreate(
            viewEvent,
            function (data) {
                var debugLogMessage = (data.status === 'OK') ? 'View event was logged successfully.' : 'Error occurred logging view event.';

                addDebugLogMessage(debugLogMessage);
            },
            'json');
    });
}

function logIdentity() {
    var firstName = $('#first-name-input').val();
    var lastName = $('#last-name-input').val();
    var email = $('#email-input').val();

    _boxeverq.push(function () {
        Boxever.eventCreate(
            Object.assign(commonParams, {
                'type': 'IDENTITY', 'browser_id': Boxever.getID(),
                'email': email,
                'country': 'US',
                'city': 'Cleveland',
                'firstname': firstName,
                'lastname': lastName,
                'identifiers': [{
                    'provider': 'CRM',
                    'id': generateString(5)
                }]
            }),
            function (data) {
                var debugLogMessage = (data.status === 'OK') ? ('Logged in with the following user information. Email: ' + email + ' / ' + 'Name: ' + firstName + ' ' + lastName) : 'Error occurred while logging in.';

                addDebugLogMessage(debugLogMessage);

                //Could be changed by IDENTITY request
                $('#debug-browser-id').text(Boxever.getID());
                $('#debug-bucket-id').text(Boxever.bucket_number);
                $('#debug-email').text(email);
                $('#debug-full-name').text(firstName + ' ' + lastName);

                if (data.status === 'OK') {
                    $('#login-container').hide();
                    $('#products-container').show();
                }
            },
            'json');
    });
}

function logAddItemToOrder(itemId, itemName, itemPrice) {
    _boxeverq.push(function () {
        Boxever.eventCreate(
            Object.assign(commonParams, {
                'type': 'ADD', 'browser_id': Boxever.getID(),
                'product': {
                    'type': 'PRODUCT',
                    'item_id': itemId,
                    'name': itemName,
                    'currency': commonParams.currency,
                    'price': itemPrice,
                    'product_id': itemId,
                    'quantity': 1,
                    'orderedAt': new Date().toISOString()
                }
            }),
            function (data) {
                var debugLogMessage = (data.status === 'OK') ? ('Added following item to order. Item ID: ' + itemId + ' / Item Name: ' + itemName + ' / Item Price: $' + itemPrice) : 'Error occurred while adding item to order.';

                addDebugLogMessage(debugLogMessage);

                $('#checkout-container').show();
                $('#cancel-order-button').show();
                $('#confirm-order-button').show();

                order.push({
                    'item_id': itemId
                });
            },
            'json');
    });
}

function logCancelOrder() {
    _boxeverq.push(function () {
        Boxever.eventCreate(
            Object.assign(commonParams, { 'type': 'FORCE_CLOSE', 'browser_id': Boxever.getID() }),
            function (data) {
                var debugLogMessage = (data.status === 'OK') ? 'Cancelled order.' : 'Error occurred while cancelling order.';

                addDebugLogMessage(debugLogMessage);

                $('#checkout-container').hide();
                $('#cancel-order-button').hide();
                $('#confirm-order-button').hide();
                $('#checkout-button').hide();

                order = [];
            },
            'json');
    });
}

function logConfirmOrder() {
    _boxeverq.push(function () {
        Boxever.eventCreate(
            Object.assign(commonParams, {
                'type': 'CONFIRM', 'browser_id': Boxever.getID(),
                'product': order
            }),
            function (data) {
                var debugLogMessage = (data.status === 'OK') ? ('Confirmed order of ' + order.length + ' items.') : 'Error occurred while confirming order.';

                addDebugLogMessage(debugLogMessage);

                $('#cancel-order-button').hide();
                $('#confirm-order-button').hide();
                $('#checkout-button').show();
            },
            'json');
    });
}

function logCheckout() {
    var orderId = generateString(8);

    _boxeverq.push(function () {
        Boxever.eventCreate(
            Object.assign(commonParams, { 'type': 'CHECKOUT', 'browser_id': Boxever.getID(), 'status': 'PURCHASED', 'reference_id': orderId }),
            function (data) {
                var debugLogMessage = (data.status === 'OK') ? ('Checked out order ' + orderId + '.') : 'Error occurred while checking out.';

                addDebugLogMessage(debugLogMessage);

                $('#checkout-container').hide();
                $('#cancel-order-button').hide();
                $('#confirm-order-button').hide();
                $('#checkout-button').hide();
            },
            'json');
    });
}

function addDebugLogMessage(message) {
    var currentTimestamp = new Date().toLocaleString();

    $('#debug-log').append('<p>[' + currentTimestamp + '] ' + message + '</p>');
}

/* Tool to generate a random uppercase string */
function generateString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}