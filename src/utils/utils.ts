export function filterExpensesByMonth(itemsArr: expense[], monthName: string) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const targetMonth = months.indexOf(monthName);
  if (targetMonth === -1) {
    console.error('Invalid month name.');
    return [];
  }
  const filterdItems = itemsArr.filter((item) => {
    const createdAtDate = new Date(item.createdAt); // Convert to milliseconds
    return createdAtDate.getMonth() === targetMonth;
  });
  return filterdItems;
}

export function compareCreatedAt(a: { createdAt: number }, b: { createdAt: number }) {
  return a.createdAt - b.createdAt;
}

export function reduceMonth(items: expense[]) {
  const monthsSet = new Set();

  items.forEach((item) => {
    const createdAt = new Date(item.createdAt);
    const month = createdAt.toLocaleString('en-US', { month: 'long' });

    monthsSet.add(month);
  });
  return Array.from(monthsSet) as string[]
}

