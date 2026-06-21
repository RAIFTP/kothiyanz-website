// customer-menu.js
// Include on your customer-facing `index.html` as:
// <script type="module" src="customer-menu.js"></script>
// This script reads `?table=<id>` and renders a digital menu, search, cart and ordering that links orders to a table.
import { db, collection, getDocs, addDoc } from './firebase-config.js';

const params = new URLSearchParams(location.search);
const tableId = params.get('table') || null;

async function loadMenu(){
  const container = document.getElementById('digital-menu');
  if(!container) return; // nothing to render
  const snap = await getDocs(collection(db,'menu'));
  const items = [];
  snap.forEach(d=> items.push({ id: d.id, ...d.data() }));
  renderMenu(container, items);
}

let cart = [];

function renderMenu(container, items){
  container.innerHTML = '';
  container.innerHTML += `<div>Table: ${tableId || 'N/A'}</div>`;
  container.innerHTML += `<input id="menuSearch" placeholder="Search menu...">`;
  const list = document.createElement('div');
  list.id = 'menuItems';
  container.appendChild(list);
  const search = container.querySelector('#menuSearch');
  function doRender(filter=''){
    list.innerHTML = '';
    items.filter(i=>i.name.toLowerCase().includes(filter.toLowerCase())).forEach(i=>{
      const el = document.createElement('div');
      el.innerHTML = `<strong>${i.name}</strong> — ${i.price} <button data-id="${i.id}" class="add">Add</button>`;
      list.appendChild(el);
    });
    list.querySelectorAll('.add').forEach(b=>b.addEventListener('click', ()=>{ const id=b.dataset.id; const it=items.find(x=>x.id===id); addToCart(it);}));
  }
  search.addEventListener('input', ()=> doRender(search.value));
  doRender('');
  renderCartUI(container);
}

function addToCart(item){
  const ex = cart.find(c=>c.id===item.id);
  if(ex) ex.qty++; else cart.push({ ...item, qty:1 });
  renderCartUI(document.getElementById('digital-menu'));
}

function renderCartUI(container){
  let cartDiv = container.querySelector('#cartUI');
  if(!cartDiv){ cartDiv = document.createElement('div'); cartDiv.id = 'cartUI'; container.appendChild(cartDiv); }
  cartDiv.innerHTML = '<h3>Cart</h3>' + (cart.length? '' : '<div>Empty</div>');
  cart.forEach((c,idx)=>{ cartDiv.innerHTML += `<div>${c.name} x ${c.qty} <button data-idx="${idx}" class="inc">+</button><button data-idx="${idx}" class="dec">-</button></div>` });
  cartDiv.innerHTML += '<div><button id="placeOrderBtn">Place Order</button> <button id="whatsBtn">Send WhatsApp</button></div>';
  cartDiv.querySelectorAll('.inc').forEach(b=>b.addEventListener('click', ()=>{ cart[+b.dataset.idx].qty++; renderCartUI(container);}));
  cartDiv.querySelectorAll('.dec').forEach(b=>{ b.addEventListener('click', ()=>{ const i=+b.dataset.idx; cart[i].qty--; if(cart[i].qty<=0) cart.splice(i,1); renderCartUI(container); }); });
  cartDiv.querySelector('#placeOrderBtn').addEventListener('click', placeOrder);
  cartDiv.querySelector('#whatsBtn').addEventListener('click', sendWhatsApp);
}

async function placeOrder(){
  if(cart.length===0) return alert('Cart empty');
  const payload = {
    table: tableId,
    items: cart.map(c=>({ id:c.id, name:c.name, price:c.price, qty:c.qty })),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  await addDoc(collection(db,'orders'), payload);
  cart = []; renderCartUI(document.getElementById('digital-menu'));
  alert('Order placed — thank you!');
}

function sendWhatsApp(){
  if(cart.length===0) return alert('Cart empty');
  const lines = cart.map(c=>`${c.name} x ${c.qty} — ${c.price}`).join('\n');
  const text = `Order for table ${tableId || 'N/A'}:\n${lines}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(wa, '_blank');
}

// Feedback helper — call this from your customer feedback form
export async function submitFeedback({name, rating, review}){
  await addDoc(collection(db,'feedback'), { customer: name, rating, review, createdAt: new Date().toISOString() });
}

// Reservation helper — call from reservation form
export async function submitReservation({ name, phone, date, time, guests, notes }){
  const payload = { name, phone, date, time, guests: Number(guests)||1, notes, createdAt: new Date().toISOString(), status: 'requested' };
  await addDoc(collection(db,'reservations'), payload);
}

// WhatsApp reservation helper (opens chat prefilled)
export function sendWhatsAppReservation({ name, phone, date, time, guests, notes }){
  const text = `Reservation request:\nName: ${name}\nPhone: ${phone}\nDate: ${date} ${time}\nGuests: ${guests}\nNotes: ${notes||''}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(wa, '_blank');
}

// automatically render if there's a placeholder
document.addEventListener('DOMContentLoaded', ()=>{
  const placeholder = document.getElementById('digital-menu');
  if(placeholder) loadMenu();
  // wire reservation form if present
  const resForm = document.getElementById('reservationForm');
  if(resForm){
    resForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const payload = {
        name: document.getElementById('res-name').value,
        phone: document.getElementById('res-phone').value,
        date: document.getElementById('res-date').value,
        time: document.getElementById('res-time').value,
        guests: document.getElementById('res-guests').value,
        notes: document.getElementById('res-notes').value
      };
      await submitReservation(payload);
      alert('Reservation requested — we will confirm shortly');
      resForm.reset();
    });
    const whatsBtn = document.getElementById('resWhats');
    whatsBtn.addEventListener('click', ()=>{
      const payload = {
        name: document.getElementById('res-name').value || '—',
        phone: document.getElementById('res-phone').value || '—',
        date: document.getElementById('res-date').value || '—',
        time: document.getElementById('res-time').value || '—',
        guests: document.getElementById('res-guests').value || 1,
        notes: document.getElementById('res-notes').value || ''
      };
      sendWhatsAppReservation(payload);
    });
  }
});
