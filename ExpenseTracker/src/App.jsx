import { useState, useEffect } from 'react'
import TransactionForm from './TransactionForm';
import MoneyInfo from './MoneyInfo';
import TransactionList from './TransactionList';
import './styles.css'
import { auth } from './firebaseConfig';
import { signInWithGoogle, signOutUser } from './auth'; 
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';




export default function myAPP(){
  const [user] = useAuthState(auth)
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
        <TransactionForm
              date={date}
              amount={amount}
              description={description}
              isIncome={isIncome}
              isExpense={isExpense}
              setDate={setDate}
              setAmount={setAmount}
              setDescription={setDescription}
              setIsIncome={setIsIncome}
              setIsExpense={setIsExpense}
        />

        {/* Income and Expense Totals */}
        <MoneyInfo expense={expense} income={income} />

        {/* Transaction History Section */}
        <div className='transaction-list'>
          <div className='searchbar-container'>
            <input type='text' placeholder='Search Transaction' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>

          <TransactionList filteredHistory={filteredHistory} />
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