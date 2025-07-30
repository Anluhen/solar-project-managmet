const deliveries = Array.from({ length: 25 }, (_, i) => {
  const id = (i + 1).toString();
  const day = 30 - (i % 30); // Cycle days from 30 down to 24
  const date = `${String(day).padStart(2, '0')}/07/2025`;
  const salesOrder = `5${(10000000 + i).toString().slice(1)}`; // Ensures 8-digit starting with 5
  const generator = `18${(100000 + i).toString().padStart(6, '0')}`; // Ensures 8-digit starting with 18
  const projectSuffix = `${(i + 1)}1`; // e.g., 11, 21, 31...
  const projectId = `136-2500000-${projectSuffix}`;
  const itemBase = i * 2;
  const status = 0;
  
  return {
    id,
    date,
    salesOrder,
    generator,
    projectId,
    status,
    items: [
      {
        id: (1000000000 + itemBase).toString(),
        description: 'Component A',
        quantity: (1 + (i % 5)).toString(),
      },
      {
        id: (1000000001 + itemBase).toString(),
        description: 'Component B',
        quantity: (2 + (i % 3)).toString(),
      }
    ]
  };
});

export default deliveries;