import { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';

export function useTransactions() {
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    setTransacciones(getTransactions());
  }, []);

  return transacciones;
}