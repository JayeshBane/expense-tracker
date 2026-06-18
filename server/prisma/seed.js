// console.log(require.resolve("@prisma/client"));
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const { PrismaClient } = require("../generated/prisma/client");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// The single seeded account. Override via env when seeding a real deployment.
const SEED_EMAIL = (process.env.SEED_EMAIL || "demo@example.com").toLowerCase();
const SEED_PASSWORD = process.env.SEED_PASSWORD || "password123";

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  // Idempotent: re-running the seed won't create duplicate users.
  const user = await prisma.user.upsert({
    where: { email: SEED_EMAIL },
    update: {},
    create: { email: SEED_EMAIL, passwordHash, name: "Demo User" },
  });

  await prisma.category.createMany({
    data: [
      { name: "Food", color: "#f97316", userId: user.id },
      { name: "Transport", color: "#3b82f6", userId: user.id },
      { name: "Bills", color: "#ef4444", userId: user.id },
      { name: "Shopping", color: "#a855f7", userId: user.id },
      { name: "Health", color: "#22c55e", userId: user.id },
      { name: "Entertainment", color: "#ec4899", userId: user.id },
      { name: "Travel", color: "#14b8a6", userId: user.id },
      { name: "Other", color: "#a8a49e", userId: user.id },
    ],
    skipDuplicates: true,
  });

  await prisma.paymentMethod.createMany({
    data: [
      { name: "Cash", userId: user.id },
      { name: "Credit Card", userId: user.id },
      { name: "Debit Card", userId: user.id },
      { name: "PayPal", userId: user.id },
      { name: "Venmo", userId: user.id },
    ],
    skipDuplicates: true,
  });

  console.log(
    `Seeded user ${SEED_EMAIL} (password: ${SEED_PASSWORD}) with categories and payment methods.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
