import { useState, useEffect } from 'react'
import './styles.css'

export default function myAPP(){
  const [balance, setBalance] = useState(0)
  const [expense, setExpense] = useState(0)
  const [income, setIncome] = useState(0)
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState(0)
  const [history, setHistory] = useState([])
  const [isIncome, setIsIncome] = useState(false) 
  const [isExpense, setIsExpense] = useState(true)

  const handleNewTransaction = (e) =>{
    e.preventDefault();

    if(!amount || (!isIncome && !isExpense) || !date){
      alert("Please fill in all fields and select a transaction type");
      return;
    }

    const newTransaction = {
      date,
      amount: parseFloat(amount),
      description,
      type: isIncome ? 'Income' : 'Expense',
    };

    setHistory([...history, newTransaction]);

    if (isExpense) {
      setExpense(expense + Number(amount));
      setBalance(balance - Number(amount));
    } else if (isIncome) {
      setIncome(income + Number(amount));
      setBalance(balance + Number(amount));
    }

    setDescription('');
    setDate('');
    setAmount(0);
    setIsIncome(false);
    setIsExpense(false);

  };

  useEffect(() => {
    console.log('Updated history:', history);
  }, [history]);


  return (
    <>
    <div className='app-container'>
      <h1>Expense Tracker</h1>
      <div className='top-info'>
        <h1>Balance: ${balance}</h1>
        <button onClick={handleNewTransaction}>New Transaction</button>
      </div>

      <div className='New-Transaction'>
        <input type='date' placeholder='date..' value={date} onChange={(e) => setDate(e.target.value)}/>
        <input type='number' placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)}/>
        <input type='text' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}/>
          <div className='typeTransaction'>
            <input type="radio" id='expense' name='transaction-type' checked={isExpense} onChange={() => {setIsExpense(true); setIsIncome(false); }}/>
              <label for='expense'>Expense</label>
            <input type="radio" id='income' name='transaction-type' checked={isIncome} onChange={() => { setIsIncome(true); setIsExpense(false); }}/>
              <label for='income'>Income</label>
          </div>  
      </div>

      <div className='money-info'>
        <div className='expense'>
          <p>Expenses:</p>
          <span>${expense}</span>
        </div>
        <div className='income'>
          <p>Income:</p>
          <span>${income}</span>
        </div>
      </div>

      <div className='transaction-list'>
        <div className='searchbar-container'>
          <input type='text' placeholder='Search Transaction'/>
        </div>
        <div className='transaction-history'>
        <ul>
          {history.map((transaction, index) => (
            <li key={index} className={`transaction-item ${transaction.type === 'Income' ? 'income' : 'expense'}`}>
              <span>{transaction.date}</span> {/* Date */}
              <span>{transaction.description}</span> {/* Description */}
              <span>{transaction.type === 'Income' ? `+${transaction.amount}` : `-${transaction.amount}`}</span> {/* Amount */}
            </li>
          ))}
        </ul>
        </div>  
      </div>


    </div> 
    </>
  )
}
