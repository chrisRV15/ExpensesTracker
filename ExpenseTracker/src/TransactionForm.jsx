import React from 'react';

export default function TransactionForm({
  date,
  amount,
  description,
  isIncome,
  isExpense,
  setDate,
  setAmount,
  setDescription,
  setIsIncome,
  setIsExpense,
}) {
  return (
    <div className='New-Transaction'>
      <input
        type='date'
        placeholder='Date..'
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type='number'
        placeholder='Amount'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type='text'
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

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
  );
}