var express = require('express');
var cors = require('cors');

const app = express();
const PORT = 9595;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//enable pre-flight across-the-board
app.options('*', cors());

app.get('/', async (req, res) => {
  return res.json({
    data: [
      {
        name: 'Ali Fareh',
        Age: 31,
      },
    ],
  });
});

app.get('/accounts', async (req, res) => {
  return res.json({ accounts: [] });
});

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`);
});
