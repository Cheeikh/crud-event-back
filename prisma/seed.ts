import { PrismaClient } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();
  console.log(`Début du seeding ...`);

  try {
    // Hasher les mots de passe
    const passwordUser1 = await bcrypt.hash('password123', 10);
    const passwordUser2 = await bcrypt.hash('password456', 10);

    // Créer des utilisateurs
    const user1 = await prisma.user.create({
      data: {
        email: 'alice@example.com',
        name: 'Alice Wonderland',
        password: passwordUser1,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: 'bob@example.com',
        name: 'Bob The Builder',
        password: passwordUser2,
      },
    });

    console.log(`Utilisateurs créés: ${user1.name}, ${user2.name}`);

    // Créer des posts pour Alice
    await prisma.post.create({
      data: {
        title: "Premier post d'Alice",
        content: "Ceci est le contenu du premier post d'Alice.",
        published: true,
        authorId: user1.id,
      },
    });

    await prisma.post.create({
      data: {
        title: 'Voyage au pays des merveilles',
        content: 'Un récit de mes aventures récentes.',
        published: true,
        authorId: user1.id,
      },
    });

    // Créer un post pour Bob
    await prisma.post.create({
      data: {
        title: 'Construire une maison en bois',
        content: 'Guide étape par étape pour les débutants.',
        published: false, // Post non publié
        authorId: user2.id,
      },
    });

    console.log(`Posts créés.`);
    console.log(`Seeding terminé.`);
  } catch (e) {
    console.error('Erreur pendant le seeding:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 