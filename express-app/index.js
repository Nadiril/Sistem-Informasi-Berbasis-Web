const express = require("express");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

app.get("/", (req, res) => {
  res.send("Selamat Datang");
});


app.get("/home", (req, res) => {
  res.send("Halaman Home!");
});

//Route menuju Get ke /user
app.get("/profile", (req, res) => {
  res.send("Halaman Profile!");
});

app.get('/users/snack', (req, res) => {
  res.send(`Halaman Produk Snack`);
});

app.get('/users/drink', (req, res) => {
  res.send(`Halaman Produk Minuman`);
});

app.get('/users/snack/:id', (req, res) => {
  const snackId = req.params.id;
  res.send(`Halaman Produk Snack - ID: ${snackId}`);
});

app.get('/users/drink/:id', (req, res) => {
  const drinkId = req.params.id;
  res.send(`Halaman Produk Minuman - ID: ${drinkId}`);
});
//Memulai server dan mendengarkan pada port yang ditentukan
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
