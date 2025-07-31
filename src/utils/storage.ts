const STORAGE_KEY = 'solar-material-flow-deliveries';

export function getStorageDeliveries() {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setStorageDeliveries(deliveries: any[]) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deliveries));
}
