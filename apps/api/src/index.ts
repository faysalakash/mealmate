import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'MealMate API is running!' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
