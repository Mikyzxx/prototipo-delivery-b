/**
 * prototipo-delivery-b/script.js — Variante B (A/B)
 * Misma lógica que delivery base; UI diferenciada por styles-ab-b.css + HTML.
 */

(function () {
  'use strict';

  var RESTAURANTES = [
    { id: 'r1', nombre: 'Pizzería Napoli', categoria: 'pizza', img: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=720' },
    { id: 'r2', nombre: 'Sushi Roll', categoria: 'asiatica', img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=720&q=80' },
    { id: 'r3', nombre: 'Burger Norte', categoria: 'hamburguesas', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=720&q=80' },
    { id: 'r4', nombre: 'Mamma Mia Express', categoria: 'pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=720&q=80' }
  ];

  /** Platos por restaurante (cada uno con imagen en ./assets/) */
  var MENU = {
    r1: [
      { id: 'm1', nombre: 'Margarita', precio: 8.5, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=720&q=80', desc: 'Clásica con salsa de tomate y queso mozzarella.' },
      { id: 'm2', nombre: 'Cuatro quesos', precio: 10.9, img: 'https://images.unsplash.com/photo-1529442315503-2338b939d915?auto=format&fit=crop&w=720&q=80', desc: 'Mezcla cremosa de mozzarella, gorgonzola, parmesano y gouda.' }
    ],
    r2: [
      { id: 'm3', nombre: 'Menú maki (12 pzs)', precio: 14.0, img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=720&q=80', desc: 'Selección fresca con rollos variados y salsa de soja.' },
      { id: 'm4', nombre: 'Yakisoba', precio: 9.5, img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=720&q=80', desc: 'Tallarin salteado con verduras, huevo y salsa especial.' }
    ],
    r3: [
      { id: 'm5', nombre: 'Clásica + patatas', precio: 11.0, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=720&q=80', desc: 'Hamburguesa jugosa con queso, lechuga y patatas crujientes.' },
      { id: 'm6', nombre: 'Veggie', precio: 10.5, img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=720&q=80', desc: 'Opción vegetal con queso, tomate y salsa especial.' }
    ],
    r4: [
      { id: 'm7', nombre: 'Calzone', precio: 9.0, img: 'https://images.unsplash.com/photo-1544389710-2339f4b5ca1c?auto=format&fit=crop&w=720&q=80', desc: 'Empanada rellena de queso, jamón y tomate.' },
      { id: 'm8', nombre: 'Prosciutto', precio: 11.5, img: 'https://images.unsplash.com/photo-1514516870924-1a8b744b6562?auto=format&fit=crop&w=720&q=80', desc: 'Pizza premium con jamón serrano y rúcula fresca.' }
    ]
  };

  var restauranteActual = null;
  /** pedido: { idPlato, nombre, precioUnit, cantidad } */
  var pedido = [];
  var MAX_PLATOS = 10;

  var elFiltro = document.getElementById('filtro-cat');
  var elListaRest = document.getElementById('lista-restaurantes');
  var elStepRest = document.getElementById('step-restaurante');
  var elStepProd = document.getElementById('step-productos');
  var elStepRes = document.getElementById('step-resumen');
  var elStepPago = document.getElementById('step-pago');
  var elStepConf = document.getElementById('step-confirmacion');
  var elTituloRest = document.getElementById('titulo-restaurante');
  var elListaPlatos = document.getElementById('lista-platos');
  var elListaResumen = document.getElementById('lista-resumen');
  var elListaPago = document.getElementById('lista-pago');
  var elResumenVacio = document.getElementById('resumen-vacio');
  var elTotal = document.getElementById('total-delivery');
  var elTotalPago = document.getElementById('total-pago');
  var elCartItemsCount = document.getElementById('cart-items-count');
  var elCartTotal = document.getElementById('cart-total');
  var elCheckoutForm = document.getElementById('checkout-form');
  var elMsgConfirm = document.getElementById('msg-confirm');
  var elBtnHome = document.getElementById('btn-home');
  var elBtnCarrito = document.getElementById('btn-carrito');
  var elBtnIrAPago = document.getElementById('btn-ir-a-pago');
  var elBtnVolverResumen = document.getElementById('btn-volver-resumen');

  function mostrarSoloPanel(panel) {
    var panels = [elStepRest, elStepProd, elStepRes, elStepPago, elStepConf];
    for (var i = 0; i < panels.length; i++) {
      var p = panels[i];
      var on = p === panel;
      p.classList.toggle('active', on);
      p.hidden = !on;
    }
    actualizarIndicadoresPasos(panel);
  }

  function actualizarIndicadoresPasos(panel) {
    var n = '0';
    if (panel === elStepRest) n = '1';
    if (panel === elStepProd) n = '2';
    if (panel === elStepRes) n = '3';
    if (panel === elStepPago || panel === elStepConf) n = '4';

    var indicadores = document.querySelectorAll('[data-step-indicator]');
    for (var i = 0; i < indicadores.length; i++) {
      var el = indicadores[i];
      var step = el.getAttribute('data-step-indicator');
      el.classList.toggle('active', step === n);
    }
  }

  function actualizarBotonesAgregar() {
    var deshabilitar = totalItems() >= MAX_PLATOS;
    var botones = elListaPlatos.querySelectorAll('[data-add-plato]');
    for (var i = 0; i < botones.length; i++) {
      botones[i].disabled = deshabilitar;
    }
  }

  function actualizarCarritoWidget() {
    var cantidad = 0;
    for (var i = 0; i < pedido.length; i++) {
      cantidad += pedido[i].cantidad;
    }
    elCartItemsCount.textContent = cantidad;
    elCartTotal.textContent = formatEuros(totalPedido());
    elBtnCarrito.disabled = cantidad === 0;
    actualizarBotonesAgregar();
  }

  function filtrarRestaurantes() {
    var cat = elFiltro.value;
    elListaRest.innerHTML = '';
    for (var i = 0; i < RESTAURANTES.length; i++) {
      var r = RESTAURANTES[i];
      if (cat !== 'todas' && r.categoria !== cat) continue;
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card-rest';
      btn.setAttribute('data-rest', r.id);
      btn.innerHTML =
        '<span class="card-rest__media"><img src="' +
        r.img +
        '" width="72" height="72" alt="" loading="lazy"></span>' +
        '<span class="card-rest__body"><strong>' +
        escapeHtml(r.nombre) +
        '</strong><span class="tag">' +
        escapeHtml(r.categoria) +
        '</span></span>';
      li.appendChild(btn);
      elListaRest.appendChild(li);
    }
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, '&quot;');
  }

  function lineaPedido(idPlato) {
    for (var i = 0; i < pedido.length; i++) {
      if (pedido[i].idPlato === idPlato) return pedido[i];
    }
    return null;
  }

  function totalItems() {
    var cantidad = 0;
    for (var i = 0; i < pedido.length; i++) {
      cantidad += pedido[i].cantidad;
    }
    return cantidad;
  }

  function agregarPlato(idPlato, nombre, precio, img) {
    if (totalItems() >= MAX_PLATOS) {
      alert('Solo puedes agregar hasta ' + MAX_PLATOS + ' platillos.');
      return;
    }
    var linea = lineaPedido(idPlato);
    if (linea) {
      linea.cantidad += 1;
    } else {
      pedido.push({
        idPlato: idPlato,
        nombre: nombre,
        precioUnit: precio,
        cantidad: 1,
        img: img
      });
    }
    actualizarCarritoWidget();
  }

  function totalPedido() {
    var t = 0;
    for (var i = 0; i < pedido.length; i++) {
      t += pedido[i].precioUnit * pedido[i].cantidad;
    }
    return t;
  }

  function formatEuros(n) {
    return Number(n).toFixed(2).replace('.', ',') + ' €';
  }

  function eliminarPlato(idPlato) {
    for (var i = 0; i < pedido.length; i++) {
      if (pedido[i].idPlato === idPlato) {
        pedido.splice(i, 1);
        break;
      }
    }
    actualizarCarritoWidget();
    pintarResumen();
  }

  function pintarResumen() {
    elListaResumen.innerHTML = '';
    if (pedido.length === 0) {
      elResumenVacio.hidden = false;
    } else {
      elResumenVacio.hidden = true;
    }
    for (var i = 0; i < pedido.length; i++) {
      var l = pedido[i];
      var li = document.createElement('li');
      li.className = 'resumen-line';
      li.innerHTML =
        '<img class="resumen-thumb" src="' +
        l.img +
        '" width="40" height="40" alt="">' +
        '<span class="resumen-nombre">' +
        escapeHtml(l.nombre) +
        ' × ' +
        l.cantidad +
        '</span><span class="resumen-precio">' +
        formatEuros(l.precioUnit * l.cantidad) +
        '</span>' +
        '<button type="button" class="btn-mini btn-mini--danger" data-remove-plato="' +
        l.idPlato +
        '">Eliminar</button>';
      elListaResumen.appendChild(li);
    }
    elTotal.textContent = formatEuros(totalPedido());
  }

  function pintarPago() {
    elListaPago.innerHTML = '';
    for (var i = 0; i < pedido.length; i++) {
      var l = pedido[i];
      var li = document.createElement('li');
      li.className = 'resumen-line';
      li.innerHTML =
        '<img class="resumen-thumb" src="' +
        l.img +
        '" width="40" height="40" alt="">' +
        '<span class="resumen-nombre">' +
        escapeHtml(l.nombre) +
        ' × ' +
        l.cantidad +
        '</span><span class="resumen-precio">' +
        formatEuros(l.precioUnit * l.cantidad) +
        '</span>';
      elListaPago.appendChild(li);
    }
    elTotalPago.textContent = formatEuros(totalPedido());
  }

  function reiniciarPedido() {
    pedido = [];
    actualizarCarritoWidget();
    pintarResumen();
    elCheckoutForm.reset();
  }

  function abrirMenu(restId) {
    restauranteActual = restId;
    var r = null;
    for (var i = 0; i < RESTAURANTES.length; i++) {
      if (RESTAURANTES[i].id === restId) {
        r = RESTAURANTES[i];
        break;
      }
    }
    elTituloRest.textContent = r ? r.nombre : 'Menú';
    var platos = MENU[restId] || [];
    elListaPlatos.innerHTML = '';
    for (var j = 0; j < platos.length; j++) {
      var pl = platos[j];
      var li = document.createElement('li');
      li.className = 'plato-row';
      li.innerHTML =
        '<img class="plato-thumb" src="' +
        pl.img +
        '" width="112" height="112" alt="' +
        escapeAttr(pl.nombre) +
        '">' +
        '<div class="plato-info">' +
        '<span class="plato-nombre">' +
        escapeHtml(pl.nombre) +
        '</span>' +
        '<p class="plato-desc">' +
        escapeHtml(pl.desc || '') +
        '</p>' +
        '<span class="plato-precio">' +
        formatEuros(pl.precio) +
        '</span>' +
        '</div>' +
        '<button type="button" class="btn-mini" data-add-plato="' +
        pl.id +
        '" data-nombre="' +
        escapeAttr(pl.nombre) +
        '" data-precio="' +
        pl.precio +
        '" data-img="' +
        escapeAttr(pl.img) +
        '">Agregar</button>';
      elListaPlatos.appendChild(li);
    }
    mostrarSoloPanel(elStepProd);
    actualizarBotonesAgregar();
  }

  elListaRest.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-rest]');
    if (!btn) return;
    abrirMenu(btn.getAttribute('data-rest'));
  });

  elFiltro.addEventListener('change', filtrarRestaurantes);

  elListaPlatos.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add-plato]');
    if (!b) return;
    var id = b.getAttribute('data-add-plato');
    var nombre = b.getAttribute('data-nombre');
    var precio = parseFloat(b.getAttribute('data-precio'), 10);
    var imgPlato = b.getAttribute('data-img') || '';
    agregarPlato(id, nombre, precio, imgPlato);
  });

  elListaResumen.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-remove-plato]');
    if (!btn) return;
    eliminarPlato(btn.getAttribute('data-remove-plato'));
  });

  document.getElementById('btn-volver-rest').addEventListener('click', function () {
    mostrarSoloPanel(elStepRest);
  });

  document.getElementById('btn-volver-locales').addEventListener('click', function () {
    if (restauranteActual) {
      abrirMenu(restauranteActual);
    } else {
      mostrarSoloPanel(elStepRest);
    }
  });

  elBtnHome.addEventListener('click', function () {
    restauranteActual = null;
    mostrarSoloPanel(elStepRest);
  });

  elBtnCarrito.addEventListener('click', function () {
    if (pedido.length === 0) {
      alert('Agrega al menos un plato para ver el carrito.');
      return;
    }
    pintarResumen();
    mostrarSoloPanel(elStepRes);
  });

  document.getElementById('btn-seguir-comprando').addEventListener('click', function () {
    if (restauranteActual) {
      abrirMenu(restauranteActual);
    } else {
      mostrarSoloPanel(elStepRest);
    }
  });

  elBtnIrAPago.addEventListener('click', function () {
    if (pedido.length === 0) {
      alert('Tu carrito está vacío. Agrega algo antes de continuar.');
      return;
    }
    pintarPago();
    mostrarSoloPanel(elStepPago);
  });

  elBtnVolverResumen.addEventListener('click', function () {
    pintarResumen();
    mostrarSoloPanel(elStepRes);
  });

  elCheckoutForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!elCheckoutForm.checkValidity()) {
      elCheckoutForm.reportValidity();
      return;
    }
    var nombreRest = '';
    for (var i = 0; i < RESTAURANTES.length; i++) {
      if (RESTAURANTES[i].id === restauranteActual) {
        nombreRest = RESTAURANTES[i].nombre;
        break;
      }
    }
    var nombreCliente = elCheckoutForm.nombre.value;
    elMsgConfirm.textContent =
      'Gracias, ' +
      nombreCliente +
      '. Tu pedido en ' +
      nombreRest +
      ' por ' +
      formatEuros(totalPedido()) +
      ' está en preparación. En breve llegará a tu dirección.';
    reiniciarPedido();
    mostrarSoloPanel(elStepConf);
  });

  document.getElementById('btn-nuevo').addEventListener('click', function () {
    restauranteActual = null;
    mostrarSoloPanel(elStepRest);
  });

  filtrarRestaurantes();
  actualizarCarritoWidget();
})();
