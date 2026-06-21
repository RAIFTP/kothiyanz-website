// kitchen.js - shows orders by status and allows status updates
import { db, collection, getDocs, updateDoc, doc } from './firebase-config.js';

const refreshBtn = document.getElementById('refresh');
const pendingEl = document.getElementById('pending');
const preparingEl = document.getElementById('preparing');
const readyEl = document.getElementById('ready');

refreshBtn.addEventListener('click', loadOrders);

async function loadOrders(){
  pendingEl.innerHTML = '<h3>Pending</h3>';
  preparingEl.innerHTML = '<h3>Preparing</h3>';
  readyEl.innerHTML = '<h3>Ready</h3>';
  const snap = await getDocs(collection(db,'orders'));
  snap.forEach(d=>{
    const data = d.data();
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${d.id}</strong> Table: ${data.table||'—'} <div>${JSON.stringify(data.items)}</div>`;
    if(data.status==='preparing') card.innerHTML += `<div><button class="markReady" data-id="${d.id}">Mark Ready</button></div>`;
    if(data.status==='pending') card.innerHTML += `<div><button class="startPrep" data-id="${d.id}">Start Preparing</button></div>`;
    if(data.status==='ready') card.innerHTML += `<div><button class="markServed" data-id="${d.id}">Mark Served</button></div>`;
    if(data.status==='pending') pendingEl.appendChild(card);
    if(data.status==='preparing') preparingEl.appendChild(card);
    if(data.status==='ready') readyEl.appendChild(card);
  });
  // wire buttons
  document.querySelectorAll('.startPrep').forEach(b=>b.addEventListener('click', e=>updateStatus(e.target.dataset.id,'preparing')));
  document.querySelectorAll('.markReady').forEach(b=>b.addEventListener('click', e=>updateStatus(e.target.dataset.id,'ready')));
  document.querySelectorAll('.markServed').forEach(b=>b.addEventListener('click', e=>updateStatus(e.target.dataset.id,'served')));
}

async function updateStatus(id, status){
  await updateDoc(doc(db,'orders',id), { status });
  loadOrders();
}

loadOrders();
