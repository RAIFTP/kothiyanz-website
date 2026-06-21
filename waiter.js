// waiter.js - Create and edit orders from waiter device
import { db, collection, getDocs, addDoc } from './firebase-config.js';

const loadMenuBtn = document.getElementById('loadMenu');
const menuList = document.getElementById('menuList');
const cartItemsEl = document.getElementById('cartItems');
const placeOrderBtn = document.getElementById('placeOrder');

let menu = [];
let cart = [];

loadMenuBtn.addEventListener('click', async ()=>{
  const snap = await getDocs(collection(db,'menu'));
  menu = [];
  menuList.innerHTML = '';
  snap.forEach(d=>{ const item = { id: d.id, ...d.data() }; menu.push(item); menuList.innerHTML += `<div>${item.name} - ${item.price} <button data-id="${item.id}" class="add">Add</button></div>` });
  menuList.querySelectorAll('.add').forEach(b=>b.addEventListener('click', ()=>{
    const id = b.dataset.id; const it = menu.find(m=>m.id===id); addToCart(it);
  }));
});

function addToCart(item){
  const existing = cart.find(c=>c.id===item.id);
  if(existing) existing.qty++;
  else cart.push({ ...item, qty:1 });
  renderCart();
}

function renderCart(){
  cartItemsEl.innerHTML = '';
  cart.forEach((c, idx)=>{ cartItemsEl.innerHTML += `<div>${c.name} x ${c.qty} <button data-idx="${idx}" class="dec">-</button><button data-idx="${idx}" class="inc">+</button></div>` });
  cartItemsEl.querySelectorAll('.inc').forEach(b=>b.addEventListener('click', ()=>{ cart[+b.dataset.idx].qty++; renderCart(); }));
  cartItemsEl.querySelectorAll('.dec').forEach(b=>b.addEventListener('click', ()=>{ const i=+b.dataset.idx; cart[i].qty--; if(cart[i].qty<=0) cart.splice(i,1); renderCart(); }));
}

placeOrderBtn.addEventListener('click', async ()=>{
  const tableId = document.getElementById('tableId').value || null;
  if(cart.length===0) return alert('Cart empty');
  const payload = {
    table: tableId,
    items: cart.map(c=>({ id:c.id, name:c.name, price:c.price, qty:c.qty })),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  await addDoc(collection(db,'orders'), payload);
  cart = []; renderCart();
  alert('Order placed');
});
