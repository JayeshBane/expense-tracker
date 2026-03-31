const { PrismaPg } = require("@prisma/adapter-pg");

const { PrismaClient } = require("../generated/prisma/client");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = global.prima ?? new PrismaClient({ adapter, log: ["error"] });

if (process.env.NODE_ENV != "production") global.prisma = prisma;

module.exports = prisma;
