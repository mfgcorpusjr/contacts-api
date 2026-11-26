import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const NO_OF_USERS = 2;
const NO_CONTACTS_PER_USER = 10;
const DEFAULT_PASSWORD = "secret123";

const generateContacts = () => {
  return Array.from({ length: NO_CONTACTS_PER_USER }).map(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
  }));
};

async function main() {
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  await Promise.all(
    Array.from({ length: NO_OF_USERS }).map(async (_, index) => {
      const password = await bcrypt.hash(DEFAULT_PASSWORD, 10);

      await prisma.user.create({
        data: {
          email: `${index}_${faker.internet.email()}`,
          password,
          name: faker.person.fullName(),
          contacts: {
            create: generateContacts(),
          },
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
