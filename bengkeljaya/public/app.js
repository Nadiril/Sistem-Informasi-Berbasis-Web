const tableBody = document.getElementById('sparepartTable');
const statusMessage = document.getElementById('statusMessage');
const refreshButton = document.getElementById('refreshButton');

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(Number(value));
}

async function loadSparepart() {
    statusMessage.textContent = 'Memuat data sparepart...';
    refreshButton.disabled = true;

    try {
        const response = await fetch('/api/sparepart');

        if (!response.ok) {
            throw new Error('Gagal mengambil data dari server.');
        }

        const sparepart = await response.json();
        tableBody.replaceChildren();

        if (sparepart.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');

            cell.colSpan = 8;
            cell.textContent = 'Belum ada data sparepart.';
            row.appendChild(cell);
            tableBody.appendChild(row);
        } else {
            sparepart.forEach((item) => {
                const row = document.createElement('tr');

                const values = [
                    item.kode_sparepart,
                    item.nama_sparepart,
                    item.kategori,
                    item.merk,
                    formatRupiah(item.harga_beli),
                    formatRupiah(item.harga_jual),
                    item.stok,
                    item.satuan
                ];

                values.forEach((value) => {
                    const cell = document.createElement('td');
                    cell.textContent = value ?? '-';
                    row.appendChild(cell);
                });

                tableBody.appendChild(row);
            });
        }

        statusMessage.textContent =
            `Berhasil memuat ${sparepart.length} data sparepart.`;
    } catch (error) {
        console.error(error);
        tableBody.replaceChildren();
        statusMessage.textContent =
            'Gagal memuat data. Periksa server dan endpoint API.';
    } finally {
        refreshButton.disabled = false;
    }
}

refreshButton.addEventListener('click', loadSparepart);

loadSparepart();