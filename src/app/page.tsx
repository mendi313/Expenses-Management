'use client';
import { useCallback, useEffect, useState } from 'react';
import { collection, addDoc, getDoc, QuerySnapshot, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { compareCreatedAt, filterExpensesByMonth, reduceMonth } from '@/utils/utils';
import { Loader } from '@/components/Loader';

export default function Home() {
  const [isLoad, setIsLoad] = useState(true);
  const [items, setItems] = useState<expense[]>([]);
  const [filterdItems, setFilterdItems] = useState<expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [newItem, setNewItem] = useState({ name: '', price: 0 });
  const total = filterdItems.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.price;
  }, 0);
  const monthsName = reduceMonth(items);

  async function addExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newItem.name !== ' ' && newItem.price !== 0) {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: newItem.price,
        createdAt: new Date().getTime(),
      });
      setNewItem({ name: '', price: 0 });
    }
  }

  async function deleteItem(id: string) {
    await deleteDoc(doc(db, 'items', id));
  }



  const filterExpenses = useCallback((itemsArr: expense[], monthName?: string) => {
    if (monthName) setSelectedMonth(monthName);
    const filterdItems = filterExpensesByMonth(itemsArr, monthName || selectedMonth);
    setFilterdItems(filterdItems);
  }, [selectedMonth]);

  useEffect(() => {  
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let itemsArr: expense[] = [];
      QuerySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id } as expense);
      });
      setItems(itemsArr.sort(compareCreatedAt));

      filterExpenses(itemsArr);
      setTimeout(() => {
        setIsLoad(false);
      }, 500);

      return () => unsubscribe();
    });
  }, [filterExpenses]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-800">
      {isLoad ? (
        Loader
      ) : (
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm ">
          <h1 className="text-center text-white text-xl">Expenses Management</h1>
          <div className="bg-slate-700 p-2 rounded-lg">
            {
              <div className="bg-slate-700 p-2 rounded-lg mt-2">
                <ul className="flex flex-wrap">
                  {monthsName.map((month, index) => (
                    <li key={index} className="text-white px-4 py-2">
                      <button
                        className={selectedMonth === month ? 'bg-slate-400 px-2 rounded-lg text-black' : ''}
                        onClick={(e) => filterExpenses(items, month)}
                      >
                        {month}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            }
            <form onSubmit={addExpense} className="grid grid-cols-6 items-center text-black  ">
              <input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="col-span-3 p-3 border"
                type="text"
                placeholder="enter name"
              />
              <input
                value={newItem.price === 0 ? '' : newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) })}
                className="col-span-2 p-3 border mx-1"
                type="number"
                min="0"
                placeholder="enter$"
              />
              <button className="text-white bg-slate-950 p-3 hover:bg-slate-900 text-xl" type="submit">
                +
              </button>
            </form>
            <ul>
              {filterdItems.map((item, index) => {
                return (
                  <li className="my-1 text-white w-full flex justify-between bg-slate-950" key={index}>
                    <div className="flex p-3 w-full  justify-between">
                      <span>{item.name}</span>
                      <span>${item.price}</span>
                    </div>
                    <button onClick={() => deleteItem(item.id)} className="text-white border border-slate-900 ml-8 p-4 hover:bg-slate-900 w-16 ">
                      X
                    </button>
                  </li>
                );
              })}
            </ul>
            {!filterdItems.length ? (
              ''
            ) : (
              <div className="text-white p-2 flex justify-between">
                <span>total</span>
                <span className="px-9">${total}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
