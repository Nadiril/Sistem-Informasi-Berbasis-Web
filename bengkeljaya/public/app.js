/* ================================
   KONFIGURASI ENTITAS
   Satu tempat untuk semua data:
   column = isi tabel, field = isi form
=============================== */
const entities = {
    sparepart: {
        title: 'Data Sparepart',
        subtitle: 'Kelola persediaan sparepart bengkel.',
        kode: 'kode_sparepart',
        columns: [
            { key: 'kode_sparepart', label: 'Kode' },
            { key: 'nama_sparepart', label: 'Nama Sparepart' },
            { key: 'kategori', label: 'Kategori' },
            { key: 'merk', label: 'Merk' },
            { key: 'harga_beli', label: 'Harga Beli', format: 'rupiah' },
            { key: 'harga_jual', label: 'Harga Jual', format: 'rupiah' },
            { key: 'stok', label: 'Stok' },
            { key: 'satuan', label: 'Satuan' }
        ],
        fields: [
            { key: 'kode_sparepart', label: 'Kode Sparepart', type: 'text', required: true },
            { key: 'nama_sparepart', label: 'Nama Sparepart', type: 'text', required: true },
            { key: 'kategori', label: 'Kategori', type: 'text' },
            { key: 'merk', label: 'Merk', type: 'text' },
            { key: 'harga_beli', label: 'Harga Beli', type: 'number' },
            { key: 'harga_jual', label: 'Harga Jual', type: 'number' },
            { key: 'stok', label: 'Stok', type: 'number' },
            { key: 'satuan', label: 'Satuan', type: 'text' }
        ]
    },
    karyawan: {
        title: 'Data Karyawan',
        subtitle: 'Kelola data karyawan bengkel.',
        kode: 'kode_karyawan',
        columns: [
            { key: 'kode_karyawan', label: 'Kode' },
            { key: 'nama_karyawan', label: 'Nama Karyawan' },
            { key: 'alamat', label: 'Alamat' },
            { key: 'no_telepon', label: 'No. Telepon' },
            { key: 'jabatan', label: 'Jabatan' }
        ],
        fields: [
            { key: 'kode_karyawan', label: 'Kode Karyawan', type: 'text', required: true },
            { key: 'nama_karyawan', label: 'Nama Karyawan', type: 'text', required: true },
            { key: 'alamat', label: 'Alamat', type: 'text' },
            { key: 'no_telepon', label: 'No. Telepon', type: 'text' },
            { key: 'jabatan', label: 'Jabatan', type: 'text' }
        ]
    },
    pelanggan: {
        title: 'Data Pelanggan',
        subtitle: 'Kelola data pelanggan bengkel.',
        kode: 'kode_pelanggan',
        columns: [
            { key: 'kode_pelanggan', label: 'Kode' },
            { key: 'nama_pelanggan', label: 'Nama Pelanggan' },
            { key: 'alamat', label: 'Alamat' },
            { key: 'no_telepon', label: 'No. Telepon' }
        ],
        fields: [
            { key: 'kode_pelanggan', label: 'Kode Pelanggan', type: 'text', required: true },
            { key: 'nama_pelanggan', label: 'Nama Pelanggan', type: 'text', required: true },
            { key: 'alamat', label: 'Alamat', type: 'text' },
            { key: 'no_telepon', label: 'No. Telepon', type: 'text' }
        ]
    }
};

/* ================================
   ELEMEN DOM
=============================== */
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');
const statusMessage = document.getElementById('statusMessage');
const refreshButton = document.getElementById('refreshButton');
const addButton = document.getElementById('addButton');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const formCard = document.getElementById('formCard');
const formTitle = document.getElementById('formTitle');
const dataForm = document.getElementById('dataForm');
const formFields = document.getElementById('formFields');
const submitButton = document.getElementById('submitButton');
const cancelButton = document.getElementById('cancelButton');
const closeFormButton = document.getElementById('closeFormButton');
const tabButtons = document.querySelectorAll('.tab-button');

/* ================================
   STATE
=============================== */
let currentEntity = 'sparepart';
let editingKode = null; // null = mode tambah, selain itu = mode ubah

/* ================================
   FUNGSI BANTUAN
=============================== */
function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(Number(value));
}

function formatCell(value, format) {
    if (value === null || value === undefined || value === '') return '-';
    if (format === 'rupiah') return formatRupiah(value);
    return value;
}

function setStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = 'status-' + type;
}

function api(path, options = {}) {
    return fetch(path, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
}

/* ================================
   RENDER TABEL
=============================== */
function renderTableHead() {
    const cols = entities[currentEntity].columns;
    tableHead.innerHTML = `
        <tr>
            ${cols.map((col) => `<th>${col.label}</th>`).join('')}
            <th>Aksi</th>
        </tr>
    `;
}

function renderRows(rows) {
    const config = entities[currentEntity];
    const colCount = config.columns.length + 1;

    tableBody.replaceChildren();

    if (rows.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = colCount;
        cell.textContent = 'Belum ada data.';
        cell.className = 'empty-cell';
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    rows.forEach((item) => {
        const row = document.createElement('tr');

        config.columns.forEach((col) => {
            const cell = document.createElement('td');
            cell.textContent = formatCell(item[col.key], col.format);
            row.appendChild(cell);
        });

        // Kolom aksi: Ubah + Hapus
        const actionCell = document.createElement('td');
        actionCell.className = 'action-cell';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn-small btn-edit';
        editBtn.textContent = 'Ubah';
        editBtn.addEventListener('click', () => openForm(item));

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-small btn-delete';
        deleteBtn.textContent = 'Hapus';
        deleteBtn.addEventListener('click', () => deleteRow(item));

        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

async function loadData() {
    setStatus('Memuat data...');
    refreshButton.disabled = true;

    try {
        const response = await api(`/api/${currentEntity}`);

        if (!response.ok) {
            throw new Error('Gagal mengambil data dari server.');
        }

        const rows = await response.json();
        renderRows(rows);
        setStatus(`Berhasil memuat ${rows.length} data.`, 'success');
    } catch (error) {
        console.error(error);
        renderRows([]);
        setStatus('Gagal memuat data. Periksa server dan endpoint API.', 'error');
    } finally {
        refreshButton.disabled = false;
    }
}

/* ================================
   FORM TAMBAH / UBAH
=============================== */
function buildForm() {
    const config = entities[currentEntity];

    formFields.innerHTML = '';

    config.fields.forEach((field) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';

        const label = document.createElement('label');
        label.setAttribute('for', `field-${field.key}`);
        label.textContent = field.label + (field.required ? ' *' : '');

        const input = document.createElement('input');
        input.type = field.type;
        input.id = `field-${field.key}`;
        input.name = field.key;
        input.required = Boolean(field.required);

        if (field.type === 'number') {
            input.min = '0';
        }
        if (field.key === config.kode) {
            input.placeholder = 'Contoh: SP-001';
        }

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        formFields.appendChild(wrapper);
    });
}

function openForm(item = null) {
    const config = entities[currentEntity];
    editingKode = item ? item[config.kode] : null;

    formTitle.textContent = editingKode ? 'Ubah Data' : 'Tambah Data';
    submitButton.textContent = editingKode ? 'Simpan Perubahan' : 'Simpan';
    formCard.classList.remove('hidden');
    formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Kosongkan semua input dulu
    dataForm.reset();

    config.fields.forEach((field) => {
        const input = document.getElementById(`field-${field.key}`);
        if (!input) return;

        if (editingKode) {
            input.value = item[field.key] ?? '';
            // Kode tidak bisa diubah saat mode ubah
            if (field.key === config.kode) {
                input.disabled = true;
            }
        } else {
            input.disabled = false;
        }
    });

    // Fokus ke input pertama yang aktif
    const firstInput = formFields.querySelector('input:not(:disabled)');
    if (firstInput) firstInput.focus();
}

function closeForm() {
    formCard.classList.add('hidden');
    editingKode = null;
    dataForm.reset();
}

async function submitForm(event) {
    event.preventDefault();

    const config = entities[currentEntity];
    const body = {};

    config.fields.forEach((field) => {
        const input = document.getElementById(`field-${field.key}`);
        if (!input) return;
        // Input yang disabled (kode saat mode ubah) tidak ikut dikirim
        if (input.disabled) return;

        if (field.type === 'number') {
            body[field.key] = input.value === '' ? 0 : Number(input.value);
        } else {
            body[field.key] = input.value.trim();
        }
    });

    const isEdit = Boolean(editingKode);
    const url = isEdit
        ? `/api/${currentEntity}/${encodeURIComponent(editingKode)}`
        : `/api/${currentEntity}`;
    const options = {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(body)
    };

    submitButton.disabled = true;

    try {
        const response = await api(url, options);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || 'Terjadi kesalahan pada server.');
        }

        setStatus(result.message || 'Data berhasil disimpan.', 'success');
        closeForm();
        await loadData();
    } catch (error) {
        console.error(error);
        setStatus(error.message, 'error');
    } finally {
        submitButton.disabled = false;
    }
}

/* ================================
   HAPUS DATA
=============================== */
async function deleteRow(item) {
    const config = entities[currentEntity];
    const kode = item[config.kode];
    const nama = item[config.fields[1].key] || kode;

    const konfirmasi = confirm(`Hapus data "${nama}" (${kode})?`);
    if (!konfirmasi) return;

    try {
        const response = await api(
            `/api/${currentEntity}/${encodeURIComponent(kode)}`,
            { method: 'DELETE' }
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || 'Gagal menghapus data.');
        }

        setStatus(result.message || 'Data berhasil dihapus.', 'success');
        await loadData();
    } catch (error) {
        console.error(error);
        setStatus(error.message, 'error');
    }
}

/* ================================
   GANTI TAB
=============================== */
function switchEntity(entity) {
    currentEntity = entity;
    editingKode = null;
    closeForm();

    const config = entities[currentEntity];
    pageTitle.textContent = config.title;
    pageSubtitle.textContent = config.subtitle;

    tabButtons.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.entity === entity);
    });

    renderTableHead();
    loadData();
}

/* ================================
   EVENT LISTENERS
=============================== */
tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => switchEntity(btn.dataset.entity));
});

refreshButton.addEventListener('click', loadData);
addButton.addEventListener('click', () => openForm());
cancelButton.addEventListener('click', closeForm);
closeFormButton.addEventListener('click', closeForm);
dataForm.addEventListener('submit', submitForm);

/* ================================
   MULAI
=============================== */
renderTableHead();
loadData();
