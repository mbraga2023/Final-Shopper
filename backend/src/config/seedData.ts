import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedUsers() {
  try {
    const existingUsers = await prisma.user.findMany();
    if (existingUsers.length > 0) {
      console.log("Users already exist, skipping seed.");
      return;
    }

    const usersData = [
      { name: "John Doe" },
      { name: "Jane Smith" },
    ];

    for (const user of usersData) {
      await prisma.user.create({
        data: user,
      });
      console.log(`User ${user.name} added successfully.`);
    }
    console.log("All users added successfully.");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}

export async function seedDrivers() {
  try {
    const existingDrivers = await prisma.driver.findMany();
    if (existingDrivers.length > 0) {
      console.log("Drivers already exist, skipping seed.");
      return;
    }

    const driversData = [
      {
        driver_id: 1,
        name: "Homer Simpson",
        description:
          "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
        car: "Plymouth Valiant 1973 rosa e enferrujado",
        rating: "2/5 Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.",
        rate: 2.5,
        minKm: 1,
      },
      {
        driver_id: 2,
        name: "Dominic Toretto",
        description:
          "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
        car: "Dodge Charger R/T 1970 modificado",
        rating:
          "4/5 Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
        rate: 5,
        minKm: 5,
      },
      {
        driver_id: 3,
        name: "James Bond",
        description:
          "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
        car: "Aston Martin DB5 clássico",
        rating:
          "5/5 Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
        rate: 10,
        minKm: 10,
      },
    ];

    for (const driver of driversData) {
      await prisma.driver.create({
        data: driver,
      });
      console.log(`Driver ${driver.name} added successfully.`);
    }
    console.log("All drivers added successfully.");
  } catch (error) {
    console.error("Error seeding drivers:", error);
  }
}

export async function seedData() {
  try {
    await seedDrivers();
    await seedUsers();
    console.log("Seeding complete.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await prisma.$disconnect(); 
  }
}
