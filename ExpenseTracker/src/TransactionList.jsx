import React from 'react';

export default function TransactionList ({ filteredHistory })  {
  return (
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
  );
};
