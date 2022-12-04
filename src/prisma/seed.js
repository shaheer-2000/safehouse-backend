const { config } = require('dotenv');
config();

const { auth } = require('../utils');
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

	if (process.env.NODE_ENV !== "development") {
		return;
	}

	const safehouse = await prisma.login.create({
		data: {
			username: 'safehouse', password: auth.hashPass('pass123'),
			role: {
				create: {
					roleId: 1
				}
			}
		},
	});

	const admin = await prisma.login.create({
		data: {
			username: 'admin', password: auth.hashPass('pass123'),
			role: {
				create: {
					roleId: 1
				}
			}
		}
	});

	const ngo1 = await prisma.login.create({
		data: {
			username: 'ngo1', password: auth.hashPass('pass123'),
			role: {
				create: {
					roleId: 2
				}
			},
			org: {
				create: {
					name: 'NGO-1',
					desc: '...',
					website: '...',
					email: '...',
					address: '...',
					phoneNum: '...',
					logo: '...',
				}
			}
		}
	});

	const ngo2 = await prisma.login.create({
		data: {
			username: 'ngo2', password: auth.hashPass('pass123'),
			role: {
				create: {
					roleId: 2
				}
			},
			org: {
				create: {
					name: 'NGO-2',
					desc: '...',
					website: '...',
					email: '...',
					address: '...',
					phoneNum: '...',
					logo: '...',
				}
			}
		}
	});

	const lister1 = await prisma.login.create({
		data: {
			username: 'lister1', password: auth.hashPass('pass123'),
			role: {
				create: {
					roleId: 3
				}
			},
			userLogin: {
				create: {
					firstname: 'Lister',
					lastname: '1',
					email: '',
					gender: 'MALE',
					profileImage: '',
					dateOfBirth: new Date('22 March 2000'),
					phoneNum: '',
					address: '',
					orgUsername: 'ngo1'
				}
			}
		}
	});

	const lister2 = await prisma.login.create({
		data: {
			username: 'lister2', password: auth.hashPass('pass123'),
			role: {
				create: {
					roleId: 3
				}
			},
			userLogin: {
				create: {
					firstname: 'Lister',
					lastname: '2',
					email: '',
					gender: 'FEMALE',
					profileImage: '',
					dateOfBirth: new Date('22 March 2000'),
					phoneNum: '',
					address: '',
					orgUsername: 'ngo2'
				}
			}
		}
	});

	const user1 = await prisma.login.create({
		data: {
			username: 'user1', password: auth.hashPass('pass123'),
			role: {
				create: {
					roleId: 4
				}
			},
			userLogin: {
				create: {
					firstname: 'User',
					lastname: '2',
					email: '',
					gender: 'FEMALE',
					profileImage: '',
					dateOfBirth: new Date('22 March 2000'),
					phoneNum: '',
					address: '',
					orgUsername: 'ngo1'
				}
			}
		}
	});

	const user2 = await prisma.login.create({
		data: {
			username: 'user2', password: auth.hashPass('pass123'),
			role: {
				create: {
					roleId: 4
				}
			},
			userLogin: {
				create: {
					firstname: 'User',
					lastname: '2',
					email: '',
					gender: 'MALE',
					profileImage: '',
					dateOfBirth: new Date('22 March 2000'),
					phoneNum: '',
					address: '',
					orgUsername: 'ngo2'
				}
			}
		}
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
