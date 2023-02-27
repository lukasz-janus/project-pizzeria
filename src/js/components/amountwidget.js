import { select, settings } from '../settings.js';

class AmountWidget {
  constructor(element){
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.initActions();
    thisWidget.setValue(thisWidget.input.value);
      
    console.log('amountWidget:', thisWidget);
    // console.log('constructor arguments:', element);
  }

  getElements(element){
    const thisWidget = this;
    
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value){
    const thisWidget = this;
    thisWidget.value = settings.amountWidget.defaultValue;

      
    const newValue = parseInt(value);

    /* TODO: Add validation */
    if(thisWidget.value !== newValue && !isNaN(newValue) && newValue <= settings.amountWidget.defaultMax && newValue >= settings.amountWidget.defaultMin) {
      thisWidget.value = newValue;
      thisWidget.announce();
      // console.log('new value :', newValue);
    }
    console.log('new value ogolne :', newValue);   
    thisWidget.input.value = thisWidget.value;
    console.log('value:', thisWidget.value);

  }

  initActions(){
    const thisWidget = this;

    thisWidget.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.input.value);
      // console.log('thisWidget.value1:', thisWidget.value);
    });

    thisWidget.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      if(thisWidget.value > settings.amountWidget.defaultMin){
        thisWidget.setValue(thisWidget.value - 1);
        // console.log('thisWidget.value2:', thisWidget.value);
        thisWidget.announce();
      }
    });

    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      if(thisWidget.value < settings.amountWidget.defaultMax){
        thisWidget.setValue(thisWidget.value + 1);
        thisWidget.announce();
      }
    });
  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated',{
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;