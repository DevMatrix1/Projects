const billInput = document.getElementById("bill-input");
const tipBtns = document.getElementsByClassName("tip-btn");
const tipInput = document.getElementById("tip-input");
const countOfPeople = document.getElementById("nof-people");
const tipAmountDisplay = document.getElementById("tip-amount-per-person");
const totalAmountDisplay = document.getElementById("total-per-person");
const resetBtn = document.getElementById("reset-btn");
const errorMessagePpl = document.getElementById("nppl-error");
const errorMessageBill = document.getElementById("bill-error");
const errorMessageTip = document.getElementById("tip-error");
const containerAmounts= document.querySelectorAll(".container_amount");

// reset all values 
resetBtn.addEventListener("click", function() {
    billInput.value = "";
    tipInput.value = "";
    countOfPeople.value = "";
    tipAmountDisplay.textContent = "0.00";
    totalAmountDisplay.textContent = "0.00";
    for (let j = 0; j< 5; j++){
        
        // set styling of all tipBtns except selected btn to initial 
        if (j == 2){
            // styling of 2nd index is different by default
            tipBtns[j].style.backgroundColor = 'rgb(38, 192, 171)';
            tipBtns[j].style.color = 'hsl(183, 100%, 15%)';
            tipBtns[j].style.fontWeight = '600';
        } else {
            tipBtns[j].style.backgroundColor = 'hsl(183, 100%, 15%)';
            tipBtns[j].style.color = 'hsl(0, 0%, 100%)';
            tipBtns[j].style.fontWeight = 'revert';
        }
        
    }
})

// countOfPeople and billAmount cannot be 0
function showError(InputEl, errorEl, message){
    let tempVal = InputEl.value
    if (message === "Can't be decimal" || Number(tempVal) <= 0){
        errorEl.innerText = message
        errorEl.style.color = "#ef4444"
        InputEl.style.border = "2px solid #ef4444"
        InputEl.style.borderColor ="#ef4444"
        InputEl.style.outlineColor ="#ef4444"
        InputEl.style.borderRadius = "8px"
        // countOfPeople.style.borderColor="coral"
    } else {
        errorEl.innerText = ""
        errorEl.style.color = "revert"
        InputEl.style.border = "initial"
        InputEl.style.outlineColor = "#26c0ab"
        InputEl.style.borderRadius = "revert"
    }
    

}

function setStyleToDefault(InputEl,errorEl){
    errorEl.innerText = ""
    errorEl.style.color = "revert"
    InputEl.style.border = "initial"
    InputEl.style.outlineColor = "#26c0ab"
    InputEl.style.borderRadius = "revert"
}
    
// Since there is no submit button, display of result should be dynamic
// So any any input or click, values should be obtained everytime and changed

function validateInput(e){
    // console.log("event", e)
    if (e.key == '-'){
        // console.log("event.key from inside", e.key)
        e.preventDefault()
        
    }
}

const inputEventArray = [billInput,tipInput,countOfPeople]
for (let inputElement of inputEventArray){
    inputElement.addEventListener("keydown",validateInput)
    inputElement.addEventListener("input",function(event){
        if (event.target === tipInput){
            console.log("event.target:",event.target)
            // set styling of all tipBtns to initial if tipInput is event.target
            for (let i=0; i<5; i++){
                
                tipBtns[i].style.backgroundColor = 'hsl(183, 100%, 15%)';
                tipBtns[i].style.color = 'hsl(0, 0%, 100%)';
                tipBtns[i].style.fontWeight = 'revert';
                
            }
        }
        calculate(event)
    })

}

for (let i=0; i<5; i++){
    tipBtns[i].addEventListener("click",function(event){
        let currentIndex = i
        // change selected btns color permanenetly untill clicked again
        tipBtns[i].style.backgroundColor = 'hsl(185, 41%, 84%)';
        tipBtns[i].style.color = 'hsl(183, 100%, 15%)';
        tipBtns[i].style.fontWeight = '600';
        for (let j = 0; j< 5; j++){
            if (j !== currentIndex){
                // set styling of all tipBtns except selected btn to initial 
                
                tipBtns[j].style.backgroundColor = 'hsl(183, 100%, 15%)';
                tipBtns[j].style.color = 'hsl(0, 0%, 100%)';
                tipBtns[j].style.fontWeight = 'revert';
                
            }
        }
        calculate(event)
    })
}



function calculate(event){
    // set error styling back to default on every input (if error has occured in previous iteration)
    setStyleToDefault(billInput,errorMessageBill)
    setStyleToDefault(countOfPeople,errorMessagePpl)
    
    // intialising variable
    let finalTip;
    let stringTAPP = 0;
    let flag= false;
    let billValue = billInput.value
    // console.log("billInput.value",billValue)
    let numPeople = countOfPeople.value
    let tipInputValue = tipInput.value
    let eventValBtnCase = event.target.value
    // console.log("typeof numPeople with/without input:",typeof numPeople)
    // console.log("eventValBtnCase:",eventValBtnCase)
    // console.log("tipInputValue:",tipInputValue)
    // console.log("countOfPeople.value:",numPeople)
    if (event instanceof PointerEvent){
        // console.log("hey")
        finalTip = Number(eventValBtnCase)
        tipInput.value = finalTip;
    } else {
        finalTip = Number(tipInputValue)
    }
    // console.log("finaltip:",finalTip)

    // 0 error checking for bill and n.people
    if (Number(numPeople == 0) && numPeople.length >= 1){
        console.log("called true from here ")
        showError(countOfPeople,errorMessagePpl,"Can't be zero")
        flag = true;
        
    }
    if (Number(billValue == 0) && billValue.length >= 1){
        showError(billInput,errorMessageBill,"Can't be zero")
        // console.log("called true from here ")
        flag = true;
    }
    
    billValue = Number(billValue);
    numPeople = Number(numPeople);
    tipInputValue = Number(tipInputValue);
  
    if (numPeople < 0){
        showError(countOfPeople,errorMessagePpl,"Can't be negative")
        // console.log("called true from here ")
        flag = true;  
    }
    if (numPeople % 1 != 0){
        showError(countOfPeople,errorMessagePpl,"Can't be decimal")
        // console.log("called true from here ")
        flag = true;
    }
    if (billValue < 0){
        showError(billInput,errorMessageBill,"Can't be negative")
        // console.log("called true from here ")
        flag = true;  
    }

    if (tipInputValue < 0){
        showError(tipInput,errorMessageTip,"Can't be negative")
        // console.log("called true from here ")
        flag = true;  
    } else {
        errorMessageTip.innerText = ""
        errorMessageTip.style.color = "revert"
        tipInput.style.border = "initial"
        tipInput.style.outlineColor = "#26c0ab"
        tipInput.style.borderRadius = "revert"
    }


    if ( flag === true){
        return;
    }
    
    
    // calculate function per person
    let tipAmountTotal;
    if (finalTip === 0) {
        tipAmountTotal = 0
    } else {
        tipAmountTotal = (billValue * finalTip)/100;
    }
    // console.log("tipAmountTotal:",tipAmountTotal)
    // console.log("numPeople 136: ",numPeople)
    if (numPeople === 0) {
        numPeople = 1;
    } 
    // console.log("numPeople 140: ",numPeople)
    // console.log("billInput.value",billValue)
    // console.log("finaltip:",finalTip)

    let totalAmountPerPerson = ((billValue + tipAmountTotal)/numPeople).toFixed(2)
    let tipAmountPerPerson = (tipAmountTotal/numPeople).toFixed(2)
    let DoesMatchMedia = window.matchMedia("(width <= 650px)")
    // console.log("tipAmountPerPerson:",tipAmountPerPerson)
    // console.log("totalAmountPerPerson:",totalAmountPerPerson)

    for (let containerAt of containerAmounts){
        stringTAPP = totalAmountPerPerson.toString()
        // console.log("string length", stringTAPP.length)
        if (DoesMatchMedia.matches) {
            if (stringTAPP.length > 6){
                containerAt.style.fontSize = '1.5rem'
            }
            if (stringTAPP.length >10){
                containerAt.style.fontSize = '1.2rem'
            }
            if (stringTAPP.length >15){
                containerAt.style.fontSize = '0.9rem'
            }
            if (stringTAPP.length >20){
                containerAt.style.fontSize = '0.7rem'
            }
        } else {
            if (stringTAPP.length > 6){
                containerAt.style.fontSize = '2rem'
            }
            if (stringTAPP.length >10){
                containerAt.style.fontSize = '1.7rem'
            }
            if (stringTAPP.length >13){
                containerAt.style.fontSize = '1.2rem'
            }
            if (stringTAPP.length >20){
                containerAt.style.fontSize = '1rem'
            }

        }
        
        // console.log("containerAt.style.fontsize:",containerAt.style.fontsize)
    }
    
    totalAmountDisplay.textContent = totalAmountPerPerson
    tipAmountDisplay.textContent = tipAmountPerPerson

}

