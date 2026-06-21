// billing.js - compute bill, tax, discount, print and mark paid
import { db, getDoc, doc, updateDoc } from './firebase-config.js';

const loadBtn = document.getElementById('loadOrder');
const billEl = document.getElementById('bill');

loadBtn.addEventListener('click', async ()=>{
  const id = document.getElementById('orderId').value;
  if(!id) return alert('Enter order id');
  const snap = await getDoc(doc(db,'orders',id));
  if(!snap.exists()) return alert('Order not found');
  const data = snap.data();
  renderBill(id, data);
});

function renderBill(id, order){
  const subtotal = (order.items||[]).reduce((s,i)=>s + (i.price||0) * (i.qty||1), 0);
  const taxRate = 0.1; // 10%
  const tax = subtotal * taxRate;
  const discount = order.discount || 0;
  const total = subtotal + tax - discount;
  billEl.innerHTML = `<h3>Order ${id}</h3><div>Table: ${order.table||'—'}</div><div>Subtotal: ${subtotal.toFixed(2)}</div><div>Tax: ${tax.toFixed(2)}</div><div>Discount: ${discount.toFixed(2)}</div><div><strong>Total: ${total.toFixed(2)}</strong></div><div><button id="printBtn">Print</button><button id="markPaid">Mark Paid</button></div>`;
  document.getElementById('printBtn').addEventListener('click', ()=>{ window.print(); });
  document.getElementById('markPaid').addEventListener('click', async ()=>{ await updateDoc(doc(db,'orders',id), { status:'paid', paidAt: new Date().toISOString() }); alert('Marked paid'); });
}
