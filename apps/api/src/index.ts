// apps/api/src/index.ts
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Pass the local path configuration object directly into the Prisma 7 driver wrapper
const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });
// Initialize Prisma Client passing the required adapter
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-mess-key-123';

app.use(cors());
app.use(express.json());

// --- 1. REGISTER ROUTE ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Encrypt the password so it's safely protected
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user and their empty fixed cost profile
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        fixedCost: {
          create: {}, // Creates an empty cost sheet initialized to 0
        },
      },
      include: { fixedCost: true },
    });

    // Create a login token
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET);

    // Return the user data (minus password) and token
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed internal server error' });
  }
});

// --- 2. LOGIN ROUTE ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { fixedCost: true, home: true }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare entered password with stored encrypted password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Create login token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MealMate Backend running on http://localhost:${PORT}`);
});