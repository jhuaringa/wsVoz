const { Server } = require('socket.io');
const http = require('http');

// Crear un servidor HTTP
const server = http.createServer();

// Crear un servidor de Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",  // Permitir conexiones desde cualquier origen
    methods: ["GET", "POST"]
  }
});

// Crear un objeto para almacenar los nombres de usuario asociados a los IDs de socket
const userNames = {};

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  // Enviar un mensaje de bienvenida al cliente cuando se conecta
  socket.emit('message', '¡Bienvenido!');

  // Recibir el nombre de usuario al momento de la conexión
  socket.on('setUsername', (username) => {
    userNames[socket.id] = username;  // Guardar el nombre de usuario en el objeto userNames
    console.log(`${username} se ha conectado con el ID: ${socket.id}`);
  });

  // Escuchar mensajes del cliente
  socket.on('message', (msg) => {
    console.log('Mensaje recibido del cliente:', msg);
    
    // Obtener el nombre del usuario usando el socket.id
    const username = userNames[socket.id] || "Usuario desconocido";  // Si no se encuentra el usuario, asignar "Usuario desconocido"
    
    // Emitir el mensaje a todos los clientes conectados
    io.emit('message', { username, text: msg.text });  // Ahora emitimos el nombre y el texto
  });

  // Manejar la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    delete userNames[socket.id];  // Eliminar el usuario desconectado
  });
});

// Iniciar el servidor en el puerto 8080
server.listen(8080, '0.0.0.0', () => {
  console.log('Servidor Socket.io en http://0.0.0.0:8080');
});