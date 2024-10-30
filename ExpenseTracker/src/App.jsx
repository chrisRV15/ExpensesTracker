import { useState, useEffect } from 'react'
import './styles.css'
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getDoc, getFirestore } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import {collection, addDoc, getDocs} from 'firebase/firestore'



const firebaseConfig = {
  apiKey: "AIzaSyADpKILRtkEsk0DCaCppqSK_BzTALupV6Q",
  authDomain: "expensetracker-4255c.firebaseapp.com",
  projectId: "expensetracker-4255c",
  storageBucket: "expensetracker-4255c.appspot.com",
  messagingSenderId: "914204917667",
  appId: "1:914204917667:web:c0fe422982c483d4aea416",
  measurementId: "G-7YYRFLKE3S"
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)



export default function myAPP(){
  const [user] = useAuthState(auth)
  const provider = new GoogleAuthProvider()
  const [balance, setBalance] = useState(0)
  const [expense, setExpense] = useState(0)
  const [income, setIncome] = useState(0)
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState(0)
  const [history, setHistory] = useState([])
  const [isIncome, setIsIncome] = useState(false) 
  const [isExpense, setIsExpense] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')


  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => console.log("User signed in: ", result.user))
      .catch((error) => console.error("Error signing in: ",error))
  };

  const signOutUser = () => {
    signOut(auth)
      .then(() => console.log("User signed out"))
      .catch((error) => console.error("Error signing out: ", error))
  };

  async function addTransactionToFirestore(transaction) {
    if(!user) return;
  
    try{
      const transactionRef = collection(db, 'users', user.uid, 'transaction');
      await addDoc(transactionRef, transaction);
      console.log("Transaction added to Firestore");
    }catch (error) {
      console.error("Error adding transaction: ", error);
    }
  }

  const loadTransaction  = async () => {
    if(user) {
      const transactionsRef = collection(db, "users", user.uid, "transaction");
      const transactionsSnapshot = await getDocs(transactionsRef);
      const transactionData = transactionsSnapshot.docs.map(doc =>({ id: doc.id, ...doc.data() }));
       
      setHistory(transactionData);
      let totalBalance = 0;
      let totalIncome = 0;
      let totalExpense = 0;


    
      transactionData.forEach(transaction => {
        if (transaction.type === 'Income') {
          totalIncome += transaction.amount;
          totalBalance += transaction.amount;
          
        } else if (transaction.type === 'Expense') {
          totalExpense += transaction.amount;
          totalBalance -= transaction.amount;
          
        }
      });

      
      setIncome(totalIncome);
      setExpense(totalExpense);
      setBalance(totalBalance);
    }
    }


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
    addTransactionToFirestore(newTransaction);

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

  const filteredHistory = history.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.amount.toString().includes(searchTerm) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    if (user) {
      loadTransaction();
    }
  }, [user]);


  return (
    <>
    {user ? (
    <div>
      <p className='welcomeUser'>Welcome, {user.displayName}</p>
      <button className='signOut' onClick={signOutUser}>Sign Out</button>
      <div className='app-container'>
        <h1>Expense Tracker</h1>
        {/* Balance Display and New Transaction Button */}
        <div className='top-info'>
          <h1>Balance: ${balance}</h1>
          <button onClick={handleNewTransaction}>New Transaction</button>
        </div>

        {/* New Transaction Form */}
        <div className='New-Transaction'>
          <input type='date' placeholder='date..' value={date} onChange={(e) => setDate(e.target.value)} />
          <input type='number' placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input type='text' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
          
          <div className='typeTransaction'>
            <input
              type="radio"
              id='expense'
              name='transaction-type'
              checked={isExpense}
              onChange={() => { setIsExpense(true); setIsIncome(false); }}
            />
            <label htmlFor='expense'>Expense</label>

            <input
              type="radio"
              id='income'
              name='transaction-type'
              checked={isIncome}
              onChange={() => { setIsIncome(true); setIsExpense(false); }}
            />
            <label htmlFor='income'>Income</label>
          </div>
        </div>

        {/* Income and Expense Totals */}
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

        {/* Transaction History Section */}
        <div className='transaction-list'>
          <div className='searchbar-container'>
            <input type='text' placeholder='Search Transaction' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>

          <div className='transaction-history'>
            <ul>
              {filteredHistory.map((transaction, index) => (
                <li
                  key={index}
                  className={`transaction-item ${transaction.type === 'Income' ? 'income' : 'expense'}`}
                >
                  <span>{transaction.date}</span> {/* Date */}
                  <span>{transaction.description}</span> {/* Description */}
                  <span>{transaction.type === 'Income' ? `+${transaction.amount}` : `-${transaction.amount}`}</span> {/* Amount */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
        ) : (
          <div className='signIn'>
            <h1>Expense Tracker</h1>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
          </div>
        )}
    </>
  )
}