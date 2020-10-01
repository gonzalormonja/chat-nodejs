var params = new URLSearchParams(window.location.search);

//referencias
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
var labelSala = $('#labelSala');

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var nombre = params.get('nombre');
var sala = params.get('sala');


//funciones para renderizar usuarios
function renderizarUsuarios(personas) { //[{},{}]
    console.log(personas);
    var html = '';
    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + ' </span></a > ';
    html += '</li>';
    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '   <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    divUsuarios.html(html);
    html = '<h3 class="box-title">Sala de chat <small>' + params.get('sala') + '</small></h3>';
    labelSala.html(html);

}

function renderizarMensaje(mensaje, yo) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    if (mensaje.nombre === "Admin") {
        html += '<li class="animated fadeIn col-12" >';
        html += '   <div class="chat-content">';
        html += '       <h5>' + mensaje.mensaje + '</h5>';
        html += '   </div>';
        html += '   <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else if (!yo) {
        html += '<li class="animated fadeIn  col-12" >';
        html += '   <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '       <div class="chat-content">';
        html += '           <h5>' + mensaje.nombre + '</h5>';
        html += '       <div class="box bg-light-info">' + mensaje.mensaje + '</div>';
        html += '   </div>';
        html += '   <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="reverse animated fadeIn col-12">';
        html += '   <div class="chat-content">';
        html += '       <h5>' + mensaje.nombre + '</h5>';
        html += '   <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '   </div>';
        html += '   <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '   <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    divChatbox.append(html);
    scrollBottom();
}

//Listeners
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }
});

formEnviar.on('submit', function(e) {
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        console.log(mensaje);
        renderizarMensaje(mensaje, true);
    });
});