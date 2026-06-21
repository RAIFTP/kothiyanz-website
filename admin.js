// admin.js - Admin dashboard logic (module)
import {
  auth,
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from './firebase-config.js';
import { setAdminClaim } from './admin-helpers.js';

// UI refs
const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert('Login failed: ' + e.message);
  }
});

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, user => {
  if (user) {
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
    logoutBtn.style.display = 'inline-block';
    initDashboard();
  } else {
    loginSection.style.display = 'block';
    dashboard.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
});

// simple section navigation
document.querySelectorAll('nav button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  const sec = document.getElementById(b.dataset.section);
  sec.style.display = 'block';
}));

async function initDashboard(){
  await loadOrders();
  await loadReservations();
  await loadFeedback();
  await loadMenu();
  await loadTables();
  initUserControls();
}

function initUserControls(){
  const promoteBtn = document.getElementById('promoteBtn');
  if(!promoteBtn) return;
  promoteBtn.addEventListener('click', async ()=>{
    const url = document.getElementById('fn-url').value.trim();
    const secret = document.getElementById('fn-secret').value.trim();
    const uid = document.getElementById('user-uid').value.trim();
    const out = document.getElementById('promoteOut');
    if(!url || !secret || !uid){ out.textContent = 'Provide function URL, secret and uid'; return; }
    out.textContent = 'Promoting...';
    try{
      const res = await setAdminClaim(url, uid, secret);
      out.textContent = JSON.stringify(res, null, 2);
    }catch(e){ out.textContent = 'Error: ' + e.message; }
  });
}

async function loadOrders(){
  const ordersEl = document.getElementById('orders');
  ordersEl.innerHTML = '<h2>Orders</h2>';
  const q = query(collection(db,'orders'), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  const table = document.createElement('table');
  table.innerHTML = '<tr><th>ID</th><th>Table</th><th>Items</th><th>Status</th></tr>';
  snap.forEach(d=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${d.id}</td><td>${d.data().table || '—'}</td><td>${JSON.stringify(d.data().items||[])} </td><td>${d.data().status||'pending'}</td>`;
    table.appendChild(tr);
  });
  ordersEl.appendChild(table);
}

async function loadReservations(){
  const el = document.getElementById('reservations');
  el.innerHTML = '<h2>Reservations</h2>';
  const snap = await getDocs(collection(db,'reservations'));
  const ul = document.createElement('div');
  snap.forEach(d=>{ ul.innerHTML += `<div class="card"><strong>${d.data().name}</strong> — ${d.data().date} ${d.data().time} — ${d.data().guests} guests</div>` });
  el.appendChild(ul);
}

async function loadFeedback(){
  const el = document.getElementById('feedback');
  el.innerHTML = '<h2>Feedback</h2>';
  const snap = await getDocs(collection(db,'feedback'));
  snap.forEach(d=>{ el.innerHTML += `<div class="card">Rating: ${d.data().rating} — ${d.data().review || ''} <div>${d.data().customer||''}</div></div>` });
}

async function loadMenu(){
  const el = document.getElementById('menu');
  el.innerHTML = '<h2>Menu</h2>';
  el.innerHTML += '<div class="controls"><input id="menu-name" placeholder="Name"><input id="menu-price" placeholder="Price"><button id="addMenuBtn">Add</button></div>';
  document.getElementById('addMenuBtn').addEventListener('click', async ()=>{
    const name = document.getElementById('menu-name').value;
    const price = parseFloat(document.getElementById('menu-price').value)||0;
    await addDoc(collection(db,'menu'), { name, price, category: 'Uncategorized' });
    loadMenu();
  });
  const snap = await getDocs(collection(db,'menu'));
  snap.forEach(d=>{ el.innerHTML += `<div class="card">${d.data().name} — ${d.data().price}</div>` });
}

async function loadTables(){
  const el = document.getElementById('tables');
  el.innerHTML = '<h2>Tables</h2>';
  el.innerHTML += '<div class="controls"><input id="table-name" placeholder="Table name/number"><button id="addTableBtn">Create Table</button></div>';
  document.getElementById('addTableBtn').addEventListener('click', async ()=>{
    const name = document.getElementById('table-name').value;
    await addDoc(collection(db,'tables'), { name, status: 'Available' });
    loadTables();
  });
  const snap = await getDocs(collection(db,'tables'));
  snap.forEach(d=>{ el.innerHTML += `<div class="card">${d.data().name} — ${d.data().status} <button data-id="${d.id}" class="qr">QR</button></div>` });
  // QR click handler (delegated)
  el.querySelectorAll('.qr').forEach(b=>b.addEventListener('click', ()=>{
    const id = b.dataset.id;
    const qrUrl = `${location.origin}${location.pathname}?table=${id}`;
    const googleQr = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(qrUrl)}`;
    window.open(googleQr, '_blank');
  }));
}
