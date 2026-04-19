// console.log(require.resolve("@prisma/client"));
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { PrismaPg } = require("@prisma/adapter-pg");

const { PrismaClient } = require("../generated/prisma/client");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Food", color: "#f97316" },
      { name: "Transport", color: "#3b82f6" },
      { name: "Bills", color: "#ef4444" },
      { name: "Shopping", color: "#a855f7" },
      { name: "Health", color: "#22c55e" },
      { name: "Entertainment", color: "#ec4899" },
      { name: "Travel", color: "#14b8a6" },
      { name: "Other", color: "#a8a49e" },
    ],
    skipDuplicates: true,
  });

  await prisma.paymentMethod.createMany({
    data: [
      { name: "Cash" },
      { name: "Credit Card" },
      { name: "Debit Card" },
      { name: "PayPal" },
      { name: "Venmo" },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded categories and payment methods.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
