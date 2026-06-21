// test-firestore.js - browser based CRUD test harness
import { db, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from './firebase-config.js';

const output = document.getElementById('output');
function log(...args){ output.textContent += args.map(a=> typeof a === 'object' ? JSON.stringify(a,null,2) : String(a)).join(' ') + '\n'; output.scrollTop = output.scrollHeight; }

document.getElementById('initData').addEventListener('click', async ()=>{
  log('Initializing sample data...');
  try{
    // sample menu
    const menuItems = [
      { name: 'Shawarma', price: 180 },
      { name: 'Loaded Fries', price: 120 },
      { name: 'Mint Lime', price: 80 }
    ];
    for(const it of menuItems){ await addDoc(collection(db,'menu'), it); }
    // sample tables
    for(let i=1;i<=6;i++){ await addDoc(collection(db,'tables'), { name: `T-${i}`, status: 'Available' }); }
    // sample reservation
    await addDoc(collection(db,'reservations'), { name:'Sample Guest', phone:'0000000000', date:'2026-06-22', time:'19:00', guests:2, notes:'Test' });
    log('Sample data created');
  }catch(e){ log('Error:', e.message); }
});

document.getElementById('crudTests').addEventListener('click', async ()=>{
  log('Running CRUD tests...');
  try{
    // create
    const od = await addDoc(collection(db,'orders'), { table:'T-1', items:[{name:'Shawarma',qty:1,price:180}], status:'pending', createdAt: new Date().toISOString() });
    log('Created order:', od.id);
    // read
    const snap = await getDocs(collection(db,'orders'));
    log('Orders count:', snap.size);
    // update
    await updateDoc(doc(db,'orders',od.id), { status:'preparing' });
    log('Updated order status to preparing');
    // delete
    await deleteDoc(doc(db,'orders',od.id));
    log('Deleted test order');
    log('CRUD tests completed');
  }catch(e){ log('Error:', e.message); }
});
