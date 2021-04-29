let state = {
    balance: 0,
    income:0,
    expense:0,
    transactions: [
        {
            id: uniqueId(),
            name: 'Salary', 
            amount:5000,
            type: 'income'
        },
        {
            id: uniqueId(),
            name: 'Groceries', 
            amount:120,
            type: 'expense'
        },
        {
            id: uniqueId(),
            name: 'Books', 
            amount:40,
            type: 'expense'
        }
    ]
}

let balanceEl = document.querySelector('#balance');
let incomeEl = document.querySelector('#income');
let expenseEl = document.querySelector('#expense');
let transactionsEl = document.querySelector('#transaction');

// listen for button clicks
let incomeBtn = document.querySelector('#incomeBtn');
let expenseBtn = document.querySelector('#expenseBtn');

// Get inputs
let nameInputEl = document.querySelector('#name');
let amountInputEl = document.querySelector('#amount');

function init(){

    let localState = JSON.parse(localStorage.getItem('expenseTracker'));

    if(localState !== null){
        state = localState;
    }

    updateState();

    initListeners();

}

function uniqueId(){
    return Math.floor(Math.random() * 100000);
}

function initListeners(){
    incomeBtn.addEventListener('click', addIncome);
    expenseBtn.addEventListener('click', addExpense);
}

function addTransaction(name,amount,type){
    if(name !== '' && amount!==''){
        if (amount > 0){
            let transaction = {
                id: uniqueId(),
                name: name,
                amount: parseInt(amount),
                type: type
            }
        
            state.transactions.push(transaction);
            updateState();
            
            nameInputEl.value = '';
            amountInputEl.value='';
        } else {
            alert('Please enter a valid amount');
        }
        
    } else {
        alert('Please enter valid values!');
    }

}

function addIncome(){
    let name = nameInputEl.value;
    let amount = amountInputEl.value;
    
    addTransaction(name,amount,'income');
    
}

function addExpense(){
    let name = nameInputEl.value;
    let amount = amountInputEl.value;

    addTransaction(name,amount,'expense');
    
}

function onDeleteClick(event){
    
    let id = parseInt(event.target.getAttribute('data-id'));
    let deleteIndex = -1;
    //console.log(id);

    for(let i = 0; i < state.transactions.length;i++){
        console.log(state.transactions[i].id);
        if(state.transactions[i].id === id){
            deleteIndex = i;
            break;

        }
    }

    if (deleteIndex >= 0){
        state.transactions.splice(deleteIndex,1);
        updateState();
    }
}

function updateState(){
    //debugger;
    let balance = 0;
    let income = 0;
    let expense = 0;
    for(let i = 0; i < state.transactions.length;i++){
        let item = state.transactions[i];

        if (item.type === 'income'){
            income += item.amount;
        } else if(item.type === 'expense'){
            expense += item.amount;
        }
    }

    // Calculate balance
    balance = (income - expense);

    // Update state
    state.balance = balance;
    state.expense = expense;
    state.income = income;

    localStorage.setItem('expenseTracker',JSON.stringify(state));


    render();
}

function render(){

    balanceEl.innerHTML = `£ ${state.balance}`;
    incomeEl.innerHTML = `£ ${state.income}`;
    expenseEl.innerHTML = `£ ${state.expense}`;


    let transactionEl;
    let containerEl;
    let amountEl;
    let buttomEl;

    // Clear the transactions
    transactionsEl.innerHTML ='';

    for (let i = 0; i < state.transactions.length;i++){

        let item = state.transactions[i];

        transactionEl = document.createElement('li');
        transactionEl.append(state.transactions[i].name);
        transactionsEl.appendChild(transactionEl);

        // Create the container
        containerEl = document.createElement('div');
        amountEl = document.createElement('span');
        
        if(item.type === 'expense'){
            amountEl.classList.add('expense-amt');
        } else if (item.type === 'income') {
            amountEl.classList.add('income-amt')
        }

        amountEl.innerHTML = `£ ${item.amount}`;

        containerEl.appendChild(amountEl);

        buttonEl = document.createElement('button');
        buttonEl.setAttribute('data-id',item.id);
        buttonEl.innerHTML = 'X';

        buttonEl.addEventListener('click',onDeleteClick);

        containerEl.appendChild(buttonEl);

        // Add the container
        transactionEl.appendChild(containerEl);

    }
}

init();