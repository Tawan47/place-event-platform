import { prisma } from '@/lib/prisma'; async function test() { const user = await prisma.user.findFirst(); console.log(user); } test();
