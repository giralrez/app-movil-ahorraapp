import { useApp } from '../app/context/AppContext';

export function useTransactions() {
  return useApp().transacciones;
}
