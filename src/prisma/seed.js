const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	const roles = await prisma.role.createMany({
		data: [
			{ name: 'ADMIN', desc: '', authLevel: 100 },
			{ name: 'NGO', desc: '', authLevel: 50 },
			{ name: 'LISTER', desc: '', authLevel: 10 },
			{ name: 'USER', desc: '', authLevel: 5 },
		],
		skipDuplicates: true
	});
};

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
