const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', (qr) => {
    console.log('SCAN QR INI:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Bot Siap Digunakan!');
});

client.on('message', msg => {
    // Format yang kamu inginkan: "Nama" "Harga" "Diskon"
    // Contoh: "Lampu LED" "769350" "30%"
    if (msg.body.includes('"')) {
        const parts = msg.body.split('"');
        
        // parts[1] = Nama Barang, parts[3] = Harga, parts[5] = Diskon
        if (parts.length >= 6) {
            const namaBarang = parts[1];
            const hargaAsli = parseFloat(parts[3].replace(/\./g, '')); // Menghilangkan titik jika ada
            const persenDiskon = parseFloat(parts[5].replace('%', ''));

            if (!isNaN(hargaAsli) && !isNaN(persenDiskon)) {
                const nilaiDiskon = (persenDiskon / 100) * hargaAsli;
                const hargaAkhir = hargaAsli - nilaiDiskon;

                msg.reply(
                    `✅ *HASIL HITUNG OTOMATIS* ✅\n\n` +
                    `📦 *Barang:* ${namaBarang}\n` +
                    `💰 *Harga Awal:* Rp ${hargaAsli.toLocaleString('id-ID')}\n` +
                    `🏷️ *Diskon:* ${persenDiskon}%\n` +
                    `📉 *Potongan:* Rp ${nilaiDiskon.toLocaleString('id-ID')}\n` +
                    `──────────────\n` +
                    `💵 *HARGA NETT:* *Rp ${hargaAkhir.toLocaleString('id-ID')}*`
                );
            }
        }
    }
});

client.initialize();