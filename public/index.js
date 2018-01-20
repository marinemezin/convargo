'use strict';
//test
//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

console.log(truckers);
console.log(deliveries);
console.log(actors);


for (let i = 0; i < deliveries.length; i++) {
    var price_km = priceKm(deliveries[i].truckerId);
    var price_vol = priceVol(deliveries[i].truckerId);
    var decrease = calculate_decrease(deliveries[i].volume);
    var shipping_price = deliveries[i].distance * price_km + deliveries[i].volume * price_vol;
    shipping_price -= shipping_price * decrease;
    deliveries[i].price = shipping_price;
    console.log("Before option : Shipping price for " + (i + 1) + "th delivery : " + shipping_price);
    calculate_commission(i);
    calculate_deductible(i);
    console.log("After option : Shipping price for " + (i + 1) + "th delivery : " + deliveries[i].price);
    addPriceInArray(deliveries[i].id);
}

function priceKm(delId) {
    for (let j = 0; j < truckers.length; j++) {
        if (truckers[j].id == delId) {
            return truckers[j].pricePerKm;
        }
    }
}

function priceVol(delId) {
    for (let j = 0; j < truckers.length; j++) {
        if (truckers[j].id == delId) {
            return truckers[j].pricePerVolume;
        }
    }
}

function calculate_decrease(volume) {
    if (volume > 25) {
        return 0.5;
    }
    if (volume > 10) {
        return 0.3;
    }
    if (volume > 5) {
        return 0.1;
    }
    return 0;
}

function calculate_commission(index) {
    let commission = deliveries[index].price * 0.3;
    let insurance = commission / 2;
    let treasury = 1 + Math.trunc(deliveries[index].distance / 500);
    let convargo = commission - insurance - treasury;
    deliveries[index].commission.insurance = insurance;
    deliveries[index].commission.treasury = treasury;
    deliveries[index].commission.convargo = convargo;
}

function calculate_deductible(index) {
    let additionalCharge = 0;
    if (deliveries[index].options.deductibleReduction) {
        additionalCharge = deliveries[index].volume;
        deliveries[index].price += additionalCharge;
        deliveries[index].commission.convargo += additionalCharge;
    }
}

function addPriceInArray(delId) {
    for (let i = 0; i < actors.length; i++) {
        if (actors[i].deliveryId == delId) {
            for (let j = 0; j < actors[i].payment.length; j++) {
                if (actors[i].payment[j].who == 'shipper') {
                    //shipper
                    actors[i].payment[j].amount = findShipperPrice(actors[i].deliveryId);
                    console.log("Shipper : " + actors[i].payment[j].amount);
                }
                if (actors[i].payment[j].who == 'trucker') {
                    //trucker
                    actors[i].payment[j].amount = findTruckerPrice(actors[i].deliveryId);
                    console.log("Trucker : " + actors[i].payment[j].amount);
                }
                if (actors[i].payment[j].who == 'insurance') {
                    //insurance
                    actors[i].payment[j].amount = findInsurancePrice(actors[i].deliveryId);
                    console.log("Insurance : " + actors[i].payment[j].amount);
                }
                if (actors[i].payment[j].who == 'treasury') {
                    //treasury
                    actors[i].payment[j].amount = findTreasuryPrice(actors[i].deliveryId);
                    console.log("Treasury : " + actors[i].payment[j].amount);
                }
                if (actors[i].payment[j].who == 'convargo') {
                    //convargo
                    actors[i].payment[j].amount = findConvargoPrice(actors[i].deliveryId);
                    console.log("Convargo : " + actors[i].payment[j].amount);
                }
            }
        }
    }
}

function findShipperPrice(delId) {
    for (let i = 0; deliveries.length; i++) {
        if (delId == deliveries[i].id) {
            return deliveries[i].price;
        }
    }
    return null;
}

function findTruckerPrice(delId) {
    for (let i = 0; deliveries.length; i++) {
        if (delId == deliveries[i].id) {
            return shipping_price * 0.7;
        }
    }
    return null;
}

function findInsurancePrice(delId) {
    for (let i = 0; deliveries.length; i++) {
        if (delId == deliveries[i].id) {
            return deliveries[i].commission.insurance;
        }
    }
    return null;
}

function findTreasuryPrice(delId) {
    for (let i = 0; deliveries.length; i++) {
        if (delId == deliveries[i].id) {
            return deliveries[i].commission.treasury;
        }
    }
    return null;
}

function findConvargoPrice(delId) {
    for (let i = 0; deliveries.length; i++) {
        if (delId == deliveries[i].id) {
            return deliveries[i].commission.convargo;
        }
    }
    return null;
}