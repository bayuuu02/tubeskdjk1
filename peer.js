const WebSocket = require('ws');
const crypto = require('crypto');

const SECRET_KEY = '12345678901234567890123456789012'; // Kunci rahasia untuk AES-256
const IV = '1234567890123456'; // IV (Initialization Vector)

let clients = [];  // Menyimpan semua klien yang terhubung
let clientCount = 0;  // Menyimpan jumlah klien untuk memberi nama

// Fungsi untuk mengenkripsi pesan
function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Fungsi untuk mendekripsi pesan
function decrypt(encryptedText) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), IV);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Kesalahan saat mendekripsi data:", error.message);
        return "";
    }
}

// Fungsi untuk memulai server WebSocket
function startServer(port) {
    const wss = new WebSocket.Server({ port: port });

    wss.on('connection', (ws) => {
        clientCount++;  // Menambah jumlah klien yang terhubung
        const clientName = `Client ${clientCount}`;  // Nama untuk klien yang baru
        clients.push({ ws, clientName });  // Menyimpan klien dan nama mereka
        console.log(`${clientName} connected`);

        // Kirimkan nama klien ke klien
        ws.send(`Welcome ${clientName}`);

        ws.on('message', (data) => {
            const message = decrypt(data.toString()); // Dekripsi pesan dari klien
            console.log(`${clientName} says: ${message}`);

            // Kirim pesan ke semua klien yang terhubung
            clients.forEach(client => {
                if (client.ws.readyState === WebSocket.OPEN) {
                    const encryptedMessage = encrypt(`${clientName}: ${message}`); // Enkripsi pesan sebelum dikirim ke klien lain
                    client.ws.send(encryptedMessage);
                }
            });
        });

        ws.on('close', () => {
            clients = clients.filter(client => client.ws !== ws); // Hapus klien yang terputus
            console.log(`${clientName} disconnected`);
        });

        ws.on('error', (err) => {
            console.error('WebSocket error:', err);
        });
    });

    console.log(`WebSocket server listening on port ${port}`);
}

// Mulai server
const port = 3000;  // Ganti dengan port yang sesuai jika diperlukan
startServer(port);
