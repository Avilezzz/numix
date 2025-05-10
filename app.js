document.addEventListener('DOMContentLoaded', function() {
  // Variables globales
  let planSeleccionado = null;
  let operadoraSeleccionada = null; // Nueva variable para almacenar la operadora
  const modalPlanes = document.getElementById('planesModal');
  const modalConfirmar = document.getElementById('confirmarModal');
  const tuNumeroWhatsapp = '59378652638'; // Tu número de WhatsApp
  
  // Cargar los datos del JSON
  fetch('paquetes.json')
    .then(response => response.json())
    .then(data => {
      const operadorasData = data.operadoras;
      
      // Asignar evento click a cada logo de operadora
      document.querySelectorAll('.card_operadora a').forEach((link, index) => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          operadoraSeleccionada = operadorasData[index]; // Guardar la operadora
          mostrarPlanes(operadoraSeleccionada);
        });
      });
    })
    .catch(error => console.error('Error al cargar los paquetes:', error));

  // Función para mostrar los planes en el modal
  function mostrarPlanes(operadora) {
    const operadoraNombre = document.getElementById('operadoraNombre');
    const planesContainer = document.getElementById('planesContainer');
    
    // Limpiar contenedor
    planesContainer.innerHTML = '';
    
    // Establecer nombre de la operadora
    operadoraNombre.textContent = operadora.nombre;
    
    // Crear cards para cada plan
    operadora.paquetes.forEach(plan => {
      const planCard = document.createElement('div');
      planCard.className = 'plan-card';
      
      planCard.innerHTML = `
        <img src="${plan.imagen}" alt="Plan ${plan.numero}" class="plan-img">
        <div class="plan-precio">$${plan.precio.toFixed(2)}</div>
      `;
      
      // Agregar evento click al plan
      planCard.addEventListener('click', () => {
        planSeleccionado = plan;
        mostrarConfirmacion();
        cerrarModal(modalPlanes);
      });
      
      planesContainer.appendChild(planCard);
    });
    
    // Mostrar modal
    abrirModal(modalPlanes);
  }
  
  // Función para mostrar la confirmación de recarga
  function mostrarConfirmacion() {
    if (!planSeleccionado) return;
    
    document.getElementById('planSeleccionadoImg').src = planSeleccionado.imagen;
    document.getElementById('planSeleccionadoDesc').textContent = planSeleccionado.descripcion;
    document.getElementById('planSeleccionadoPrecio').textContent = `$${planSeleccionado.precio.toFixed(2)}`;
    
    abrirModal(modalConfirmar);
  }
  
  // Funciones auxiliares para abrir/cerrar modales
  function abrirModal(modal) {
    modal.style.display = 'block';
  }
  
  function cerrarModal(modal) {
    modal.style.display = 'none';
  }
  
  // Eventos para cerrar modales
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      cerrarModal(modal);
    });
  });
  
  // Cerrar modal al hacer click fuera del contenido
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      cerrarModal(event.target);
    }
  });
  
  // Evento para el botón Cancelar
  document.querySelector('.btn-cancelar').addEventListener('click', function() {
    cerrarModal(modalConfirmar);
  });
  
  // Expresión regular para validar números ecuatorianos
  function validarNumeroEcuatoriano(numero) {
    // Patrón: 09xxxxxxxx o 5939xxxxxxxx
    const regex = /^(09\d{8}|593\d{9})$/;
    return regex.test(numero);
  }
  
  // Formatear número para WhatsApp
  function formatearNumeroWhatsapp(numero) {
    // Si empieza con 0, reemplazar con 593
    if (numero.startsWith('0')) {
      return '593' + numero.substring(1);
    }
    return numero;
  }
  
  // Evento para el formulario de recarga
  document.getElementById('formRecarga').addEventListener('submit', function(e) {
    e.preventDefault();
    const formGroup = document.querySelector('.form-group');
    const errorMessage = document.getElementById('telefonoError');
    let numeroTelefono = document.getElementById('numeroTelefono').value.trim();
    
    // Limpiar errores previos
    formGroup.classList.remove('error');
    errorMessage.style.display = 'none';
    
    // Limpiar el número (quitar espacios, guiones, etc.)
    numeroTelefono = numeroTelefono.replace(/\D/g, '');
    
    // Validar número de teléfono ecuatoriano
    if (!validarNumeroEcuatoriano(numeroTelefono)) {
      formGroup.classList.add('error');
      errorMessage.style.display = 'block';
      
      // Enfocar el input
      document.getElementById('numeroTelefono').focus();
      return;
    }
    
    // Resto del código para enviar a WhatsApp...
    const numeroWhatsapp = formatearNumeroWhatsapp(numeroTelefono);
    const mensaje = `¡Hola! Quiero solicitar una recarga:\n\n` +
                   `*Operadora:* ${operadoraSeleccionada.nombre}\n` +
                   `*Plan:* ${planSeleccionado.descripcion}\n` +
                   `*Precio:* $${planSeleccionado.precio.toFixed(2)}\n` +
                   `*Número a recargar:* ${numeroTelefono}\n\n` +
                   `Por favor confírmame la disponibilidad y el proceso de pago.`;
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${tuNumeroWhatsapp}?text=${mensajeCodificado}`, '_blank');
    
    // Cerrar modal y resetear formulario
    cerrarModal(modalConfirmar);
    this.reset();
    planSeleccionado = null;
    operadoraSeleccionada = null;
  });
});