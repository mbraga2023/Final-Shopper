import { PrismaClient } from '@prisma/client';

const DATABASE_URL = "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: DATABASE_URL,
        },
    },
});

async function main() {
    const users = await prisma.user.findMany();
    console.log(users);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
