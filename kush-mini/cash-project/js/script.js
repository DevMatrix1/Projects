'use strict';

const firstInput = document.getElementById('first-input');
const secondInput = document.getElementById('second-input');

const next = document.querySelector('.nxt');
const check = document.querySelector('.check');

const firstReset = document.querySelector('.first-reset');
const secondReset = document.querySelector('.second-reset');

const labelBill = document.querySelector('.label-bill');
const labelPaid = document.querySelector('.label-paid');
const labelReturned = document.querySelector('.label-returned');

const twoThousand = document.querySelector('.two-thousand');
const fiveHundred = document.querySelector('.five-hundred');
const twoHundred = document.querySelector('.two-hundred');
const oneHundred = document.querySelector('.one-hundred');
const fifty = document.querySelector('.fifty');
const twenty = document.querySelector('.twenty');
const ten = document.querySelector('.ten');
const five = document.querySelector('.five');
const two = document.querySelector('.two');
const one = document.querySelector('.one');

const allNotes = [twoThousand, fiveHundred, twoHundred, oneHundred, fifty, twenty, ten, five, two, one];


let bill;
let received;
let returned



next.addEventListener('click', () => { 
    const enteredNumber = Number(firstInput.value); 

    if (enteredNumber === 0) {
        firstInput.value = '';
    }
    else if (enteredNumber > 0) {
        bill = enteredNumber;
        firstInput.value = bill + "  ✔️";
        

        check.style.display = 'inline';
        secondReset.style.display = 'inline';

    }
    else {
        firstInput.value = '';
    }
});

firstReset.addEventListener('click', () => {
    firstInput.value = '';
    next.style.display = 'inline';
    bill = 0;

    for (let i = 0; i < allNotes.length; i++) {
        allNotes[i].textContent = 0;
    }
});


let countMoney = (money) => {
    let notes =      [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1 ];
    let notesCount = [ 0,    0,    0,   0,  0,  0,  0, 0, 0, 0 ];
    

    for (let i = 0; i < notes.length; i++) {
        if (money >= notes[i]) {
            notesCount[i] = Math.floor(money / notes[i]);
            money -= (notes[i] * notesCount[i]);
            allNotes[i].textContent = notesCount[i];
        }
    }

};



check.addEventListener('click', () => { 
    const enteredNumber = Number(secondInput.value);  

    if (enteredNumber === 0) {
        secondInput.value = '';
    }

    else if (enteredNumber === bill) { 
        received = enteredNumber;
        returned = bill - received;

        secondInput.value = received + "  ✔️";
        

        labelBill.textContent = bill;
        labelPaid.textContent = received;
        labelReturned.textContent = returned;
    }

    else if (enteredNumber > bill) {
        received = enteredNumber;
        returned =  received - bill;
        secondInput.value = received + "  ✔️";
               

        labelBill.textContent = bill;
        labelPaid.textContent = received;
        labelReturned.textContent = returned;

        countMoney(returned);


    }
    
    else {
        secondInput.value = '';
    }
});

secondReset.addEventListener('click', () => {
    secondInput.value = '';

    for (let i = 0; i < allNotes.length; i++) {
        allNotes[i].textContent = 0;
    }
});


