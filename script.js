const carouselTrack = document.getElementById('carousel-track');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const carouselPlayBtn = document.getElementById('carousel-play');

let carouselIndex = 0;
let carouselTimer = null;

if (carouselTrack) {
  const items = Array.from(carouselTrack.querySelectorAll('.carousel-item'));
  const total = items.length;

  function showCarousel(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    carouselIndex = index;
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() { showCarousel(carouselIndex + 1); }
  function prevSlide() { showCarousel(carouselIndex - 1); }

  carouselNext?.addEventListener('click', nextSlide);
  carouselPrev?.addEventListener('click', prevSlide);

  function startAutoplay() {
    stopAutoplay();
    carouselTimer = setInterval(nextSlide, 3000);
    if (carouselPlayBtn) carouselPlayBtn.textContent = 'Pausar';
  }
  function stopAutoplay() {
    if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
    if (carouselPlayBtn) carouselPlayBtn.textContent = 'Retomar';
  }

  startAutoplay();
  carouselPlayBtn?.addEventListener('click', () => {
    if (carouselTimer) stopAutoplay(); else startAutoplay();
  });

  carouselTrack.parentElement?.addEventListener('mouseenter', stopAutoplay);
  carouselTrack.parentElement?.addEventListener('mouseleave', startAutoplay);
}

document.querySelectorAll('.acc-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.nextElementSibling;
    const isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';
    document.querySelectorAll('.acc-panel').forEach(p => p.style.maxHeight = null);
    if (!isOpen) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = null;
    }
  });
});

const form = document.getElementById('order-form');
const orderMsg = document.getElementById('order-msg');
const savedOrders = document.getElementById('saved-orders');
const clearOrdersBtn = document.getElementById('clear-orders');

function getOrders() {
  const raw = localStorage.getItem('cafe_orders');
  return raw ? JSON.parse(raw) : [];
}
function saveOrder(o) {
  const arr = getOrders();
  arr.push(o);
  localStorage.setItem('cafe_orders', JSON.stringify(arr));
}
function clearOrders() {
  localStorage.removeItem('cafe_orders');
  renderOrders();
}

function renderOrders() {
  if (!savedOrders) return;
  const arr = getOrders();
  if (arr.length === 0) { savedOrders.textContent = 'Nenhum pedido salvo.'; return; }
  const ul = document.createElement('ul');
  arr.forEach((it, idx) => {
    const li = document.createElement('li');
    li.textContent = `${idx+1}. ${it.custName} — ${it.item} x${it.qty} — ${it.pickupDate} ${it.pickupTime}`;
    ul.appendChild(li);
  });
  savedOrders.innerHTML = '';
  savedOrders.appendChild(ul);
}

function validateOrder(data) {
  if (!data.custName) return { ok:false, err:'Nome é obrigatório.'};
  if (!data.custEmail || !data.custEmail.includes('@')) return { ok:false, err:'Email inválido.'};
  if (!data.custPhone) return { ok:false, err:'Telefone é obrigatório.'};
  if (!data.pickupDate) return { ok:false, err:'Escolha a data.'};
  if (!data.pickupTime) return { ok:false, err:'Escolha o horário.'};
  if (!data.item) return { ok:false, err:'Escolha um item.'};
  if (!data.qty || Number(data.qty) < 1) return { ok:false, err:'Quantidade inválida.'};
  if (!data.agree) return { ok:false, err:'Confirme a retirada.'};
  return { ok:true };
}

if (form) {
  renderOrders();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      custName: document.getElementById('custName').value.trim(),
      custEmail: document.getElementById('custEmail').value.trim(),
      custPhone: document.getElementById('custPhone').value.trim(),
      pickupDate: document.getElementById('pickupDate').value,
      pickupTime: document.getElementById('pickupTime').value,
      item: document.getElementById('item').value,
      qty: document.getElementById('qty').value,
      payment: document.getElementById('payment').value,
      notes: document.getElementById('notes').value.trim(),
      agree: document.getElementById('agree').checked
    };

    const v = validateOrder(data);
    if (!v.ok) {
      orderMsg.textContent = v.err;
      orderMsg.style.color = 'crimson';
      return;
    }

    saveOrder(data);
    orderMsg.textContent = 'Pedido salvo! Chegue no horário combinado.';
    orderMsg.style.color = 'green';
    form.reset();
    renderOrders();
  });

  clearOrdersBtn?.addEventListener('click', () => {
    if (confirm('Deseja apagar todos os pedidos salvos?')) {
      clearOrders();
    }
  });
}

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');

document.querySelectorAll('.thumb').forEach(t => {
  t.addEventListener('click', () => {
    if (!modal || !modalImg) return;
    modalImg.src = t.dataset.full;
    modalImg.alt = t.alt || 'Imagem ampliada';
    modal.setAttribute('aria-hidden', 'false');
  });
});

modalClose?.addEventListener('click', () => {
  modal.setAttribute('aria-hidden', 'true');
  modalImg.src = '';
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
  }
});


