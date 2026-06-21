// init-sample-data.js - tiny helper to be used from test harness to seed more data if needed
import { db, collection, addDoc } from './firebase-config.js';

export async function seedAll(){
  const menu = [
    { name: 'Shawarma', price: 180, category: 'Mains' },
    { name: 'Loaded Fries', price: 120, category: 'Sides' },
    { name: 'Mint Lime', price: 80, category: 'Beverages' }
  ];
  for(const m of menu) await addDoc(collection(db,'menu'), m);
  for(let i=1;i<=8;i++) await addDoc(collection(db,'tables'), { name:`T-${i}`, status:'Available' });
  await addDoc(collection(db,'feedback'), { customer:'Test Guest', rating:5, review:'Lovely' });
}
