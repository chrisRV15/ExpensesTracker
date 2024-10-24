import { useState } from 'react'
import './styles.css'

export default function myAPP(){
  const [balance, setBalance] = useState(0)
  const [expense, setExpense] = useState(0)
  const [income, setIncome] = useState(0)
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState(0)
  const [history, setHistory] = useState([])

  const handleNewTransaction = (e) =>{
    e.preventDefault();

    if(!amount || (!isIncome && !isExpense)){
      alert("Please fill in all fields and select a transaction type");
      return;
    }

  const newTransaction = {
    id: date.now(),
    description,
    date,
    amount: parseFloat(amount),
    type: isIncome ? 'income' : 'expense',
  };

  setHistory([newTransaction, ...history]);

  if(isIncome){
    setIncome(income + parseFloat(amount));
    setBalance(balance + parseFloat(amount));
  }else{
    setExpense(expense + parseFloat(amount));
    setBalance(balance - parseFloat(amount));
  }
  setDescription('');
  setDate('');
  setAmount(0);
  setIsIncome(false);
  setIsExpense(false);

  };



  return (
    <>
    <div className='app-container'>
      <h1>Expense Tracker</h1>
      <div className='top-info'>
        <h1>Balance: {balance}$</h1>
        <button onClick={handleNewTransaction}>New Transaction</button>
      </div>

      <div className='New-Transaction'>
        <input type='date' placeholder='date..' value={date} onChange={(e) => setDate(e.target.value)}/>
        <input type='number' placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)}/>
        <input type='text' placeholder='Description'/>
          <div className='typeTransaction'>
            <input type="radio" id='expense' name='transaction-type' checked={!isIncome} onChange={() => {setIsIncome(false); setIsExpense(true); }}/>
              <label for='expense'>Expense</label>
            <input type="radio" id='income' name='transaction-type' checked={isIncome} onChange={() => { setIsIncome(true); setIsExpense(false); }}/>
              <label for='income'>Income</label>
          </div>  
      </div>

      <div className='money-info'>
        <div className='expense'>
          <p>Expenses:</p>
          <span>{expense}</span>
        </div>
        <div className='income'>
          <p>Income:</p>
          <span>{income}</span>
        </div>
      </div>

      <div className='transaction-list'>
        <div className='searchbar-container'>
          <input type='text' placeholder='Search Transaction'/>
        </div>
        <div className='transaction-history'>
          <li>Salay $1000</li>
          <li>Groceries -$200</li>
          <li>Groceries -$200</li>
          <li>Groceries -$200</li>
        </div>
      </div>


    </div> 
    </>
  )
}
