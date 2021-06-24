const { nanoid } = require('nanoid');
const books = require('./books');

// handler simpan buku
const addBooksHandler = (request, h) => {
  // menyiapkan data
  const id = nanoid(16);
  const {
    name, year,
    author, summary,
    publisher, pageCount,
    readPage, reading,
  } = request.payload;
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // gagalkan jika tidak ada name
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // gagalkan jika readPage > page Count
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // jika lolos penyaringan diatas masukan buku
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // cek buku apakah buku berhasil ditambahkan
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // ketika lolos penyaringan tapi gagal disimpan karna generic error
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// mengambil semua buku
const getAllBooksHandler = (request, h) => {
  // ambil query
  const { name, finished, reading } = request.query;

  // masukan books ke dalam book jika tidak ada params maka akan menampilkan semua
  let filteredBooks = books;

  // jika ada params name ambil berdasarkan name
  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  // jika ada params finished ambil berdasarkan finished
  if (reading) {
    filteredBooks = filteredBooks.filter((book) => book.reading === Boolean(Number(reading)));
  }

  // jika ada params reading ambil berdasarkan reading
  if (finished) {
    filteredBooks = filteredBooks.filter((book) => book.finished === Boolean(Number(finished)));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  })
    .code(200);
  return response;
};

// mengambil detail buku by id
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  // cari buku
  const book = books.filter((bk) => bk.id === id)[0];

  // cek buku berhasil diambil/tidak
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// memperbaharui buku
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year,
    author, summary,
    publisher, pageCount,
    readPage, reading,
  } = request.payload;
  const finished = pageCount === readPage ? true : false;
  const updatedAt = new Date().toISOString();

  // gagalkan jika tidak ada name
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // gagalkan jika readPage > page Count
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  // cari index by id
  const index = books.findIndex((book) => book.id === id);

  // gagalkan jika id tidak ditemukan
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // berhasil jika lolos semua penyaringan
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

// menghapus buku
const deleteBookByIdHandler = (request, h) => {
  // ambil dan cari index by id
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  // gagalkan jika id tidak ditemukan
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // ketika ditemukan hapus dan kembalikan 200
  books.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
