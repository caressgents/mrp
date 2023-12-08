const { Server } = require('socket.io');
const InventoryItem = require('./models/InventoryItem');

const initializeSocketIo = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    try {
      const inventoryItems = await InventoryItem.find({});
      socket.emit('initialInventoryData', inventoryItems);
    } catch (error) {
      console.error('Error sending initial inventory data:', error);
    }

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    socket.on('deleteItem', async (itemId) => {
      try {
        const inventoryItem = await InventoryItem.findByIdAndDelete(itemId);
        if (inventoryItem) {
          io.emit('inventoryUpdate', { action: 'delete', itemId: itemId });
        } else {
          socket.emit('error', 'Item not found');
        }
      } catch (error) {
        socket.emit('error', 'Error deleting item');
      }
    });

    socket.on('inventoryUpdate', async () => {
      try {
        const inventoryItems = await InventoryItem.find({});
        io.emit('inventoryUpdate', inventoryItems);
      } catch (error) {
        console.error('Error sending inventory updates:', error);
      }
    });
  });

  return io;
};

module.exports = initializeSocketIo;
