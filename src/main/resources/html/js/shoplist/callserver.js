/*
http://127.0.0.1:8080
function callGetArticles() {
    return mockDico;
}*/

function callAddCart(qty) {
    let article = byId(selectedItemId).innerHTML;
    let found = false;
    for (let i = 0 ; i < cart.length && !found ; i++) {
        if (cart[i].id == selectedItemId) {
            cart[i] += qty;
            found = true;
        }
    }
    // callAddCart
    if (!found) {
        cart.push({id:selectedItemId, name:article, qty:qty}); // TODO a valider si ca marche (ajouter un article qu on a deja
    }
    console.log('cmd '+article+' x '+qty);
    console.log(JSON.stringify(cart));
    callUpdateCart(cart);
}


function callUpdateCart(data) {
    log('data to post : ' + JSON.stringify(data));
    $.post('/api/carts/'+currentOpenCartId, JSON.stringify(data));
}

function doWithRetry(lamda, limitRetry) {
    let attempt = 0;
    let sendWithRetry = function() {
        try {
            lamda();
        } catch (e) {
            log("failure number " + attempt + " = "+e);
            attempt++;
            if (attempt < limitRetry) {
                msgQueue.push(sendWithRetry);
                waitAtLeastOneEvent();
            } else {
                // alert error
            }
        }
    };
    msgQueue.push(sendWithRetry);
    waitAtLeastOneEvent();
}

function callRefreshArticles() {

}

function callGetLatestCartId(initializer) {
    $.get( "/api/carts", function( data ) {
              log(data);
              initializer(data.id);
        });
}

function callGetArticlesInCart(idCart, initializer) {
    $.get( "/api/carts/"+idCart, function( data ) {
          log(data);
          let articles = [];
          for (let articleName in data) {
            let qty = data[articleName];
            cart.push({id:'id'+articleName, name:articleName, qty:qty});
          }
          initializer(articles);
    });
}

function callGetArticles(initializer) {
    $.get( "/api/articles", function( data ) {
          log(data);
          initializer(data);
    });
}

function sendListe() {
    log('Sending liste de courses');
    $.post('/api/carts/'+currentOpenCartId + '/send', function (data) {
        callGetLatestCartId(loadCart);
        clearArticlesInCartModal();
        clearArticlesInModal();
        cart = [];
    });
}
