import { select, classNames, templates, settings } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './cartproduct.js';

class Cart{
  constructor(element){
    const thisCart = this;
      
    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

    // console.log('new cart', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);

    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(event){
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;

    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);

    /* create DOM using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /* add productList to DOM */
    thisCart.dom.productList.appendChild(generatedDOM);

    // console.log('adding product', menuProduct);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    // console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }
    
  update(){
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for(let product of thisCart.products){
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;

      console.log('totalNumber:', thisCart.totalNumber);
      console.log('subtotalPrice:', thisCart.subtotalPrice);
    }

    if(thisCart.totalNumber != 0){
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    } else {
      thisCart.totalPrice = 0;
      thisCart.dom.deliveryFee.innerHTML = 0;
    }
    console.log('totalPrice:', thisCart.totalPrice);

    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;

    for(let price of thisCart.dom.totalPrice){
      price.innerHTML = thisCart.totalPrice;
    }

    console.log('totalNumber:', thisCart.totalNumber , 'subtotalPrice:', thisCart.subtotalPrice , 'totalPrice:', thisCart.totalPrice);
  }

  remove(event){
    const thisCart = this;

    const productArrayLength = thisCart.products.length;
    console.log('productArrayLength', productArrayLength);

    const removeCartProduct = thisCart.products.indexOf(event);
    thisCart.products.splice(removeCartProduct, 1);
      
    console.log('removeCartProduct', removeCartProduct);
    console.log('productArrayLength', productArrayLength);
    console.log('address es:', thisCart.payload.address);

    event.dom.wrapper.remove();

    thisCart.update();
  }

  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

      
    thisCart.payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: []
    };

    for(let prod of thisCart.products) {
      thisCart.payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thisCart.payload),
    };
      
    fetch(url, options)
      .then(function(rawResponse){
        return rawResponse.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });

    // console.log('adres:', thisCart.payload.address);
    // console.log('phone:', thisCart.payload.phone);
    // console.log('totalPrice:', thisCart.payload.totalPrice);
    // console.log('subtotalPrice:', thisCart.payload.subtotalPrice);
    // console.log('totalNumber:', thisCart.payload.totalNumber);
    // console.log('deliveryFee:', thisCart.payload.deliveryFee);
    // console.log('products:', thisCart.payload.products);
  }
}

export default Cart;