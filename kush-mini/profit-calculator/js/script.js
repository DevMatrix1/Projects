'use strict';

const purchaseInput = document.getElementById('purchase-input');
const quantityInput = document.getElementById('quantity');
const currentPriceInput = document.getElementById('current-price-input');

const btnCheck = document.getElementById('check-btn');

const labelPercent = document.getElementById('label-percentage');
const labelPercentText = document.getElementById('label-percentage-value');
const labelTotalLoss = document.getElementById('total-loss');
const labelTotalLossText = document.getElementById('label-total-loss-value');

const leftSectionDisplay = document.querySelector('.section-right');

const gainImg = document.querySelector('.gainimg');
const lossImg = document.querySelector('.lossimg');

btnCheck.addEventListener('click', () => {
    let purchase = Number(purchaseInput.value);
    let quantity = Number(quantityInput.value);
    let currentPrice = Number(currentPriceInput.value);

    console.log(quantity);

    let oldPriceBuy = purchase * quantity;
    let newPriceBuy = currentPrice * quantity;

    if (purchase < 0 || quantity < 0 || currentPrice <  0) {
        alert('Please enter all field with a valid number');
    }

    else if(purchase ===  currentPrice )
    {
        gainImg.style.display = "none";
        lossImg.style.display = "none";

        labelPercentText.textContent = "Percent";
        labelTotalLossText.textContent = "Total Money";

        leftSectionDisplay.style.display = "block";
    }


    else if (oldPriceBuy < newPriceBuy) {

        let profit = newPriceBuy - oldPriceBuy;

        labelTotalLoss.textContent =  profit;
        labelPercent.textContent = Math.floor((profit/oldPriceBuy) * 100) +"%";
    
        labelPercentText.textContent = "Gain";
        labelTotalLossText.textContent = "Total Gain";

        gainImg.style.display = "block";
        lossImg.style.display = "none";

        leftSectionDisplay.style.display = "block";
    }

    else if (oldPriceBuy > newPriceBuy) {
        labelTotalLoss.textContent = oldPriceBuy - newPriceBuy;
    
        labelPercentText.textContent = "Loss";
        labelTotalLossText.textContent = "Total Loss";

        gainImg.style.display = "none";
        lossImg.style.display = "block";  

        let loss =  oldPriceBuy - newPriceBuy;

        labelTotalLoss.textContent =  loss;
        labelPercent.textContent = Math.floor((loss/oldPriceBuy) * 100) +"%";

        leftSectionDisplay.style.display = "block";
    }
    
    else {
        alert('Please enter all field with a valid number');
    }
});