import React from 'react';

export default function MoneyInfo ({ expense, income }) {
  return (
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
  );
};