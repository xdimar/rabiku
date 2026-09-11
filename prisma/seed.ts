import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const user = await prisma.user.upsert({
    where: { email: "demo@rabiku.my.id" },
    update: {},
    create: {
      id: "demo-user",
      email: "demo@rabiku.my.id",
      name: "Demo Couple",
    },
  });

  const demoInvitation = await prisma.invitation.upsert({
    where: { slug: "preview-demo" },
    update: {},
    create: {
      id: "demo",
      slug: "preview-demo",
      title: "The Wedding of Raden & Kirana",
      groomName: "Raden",
      brideName: "Kirana",
      userId: user.id,
      layoutData: "{}",
      isPublished: true,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
  });

  // Also seed a couple of guestbook entries
  await prisma.guestbookEntry.deleteMany({
    where: { invitationId: demoInvitation.id },
  });

  await prisma.guestbookEntry.createMany({
    data: [
      {
        invitationId: demoInvitation.id,
        guestName: "Dimas & Sarah",
        attendanceStatus: "ATTENDING",
        message: "Selamat untuk Raden & Kirana! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
      },
      {
        invitationId: demoInvitation.id,
        guestName: "Budi Santoso",
        attendanceStatus: "ATTENDING",
        message: "Barakallah, lancar sampai hari H ya sahabatku!",
      },
      {
        invitationId: demoInvitation.id,
        guestName: "Anindya Putri",
        attendanceStatus: "TENTATIVE",
        message: "Happy wedding kalian berdua! Semoga selalu bahagia selamanya.",
      },
    ],
  });

  console.log("Database seeded successfully! Demo invitation ready at /preview-demo and /editor/demo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
