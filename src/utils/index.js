const bcrypt = require('bcrypt');
const saltRounds = 10;

const hasRole = (userRole, allowedRoles) => {
	if (typeof userRole === 'undefined') {
		return false;
	}

	userRole = userRole.trim().toUpperCase();

	return allowedRoles.includes(userRole);
};

const hashPass = (password) => bcrypt.hashSync(password, saltRounds);
const compPass = (password, hashedPass) =>  bcrypt.compareSync(password, hashedPass);

module.exports = {
	auth: {
		hasRole,
		hashPass,
		compPass
	},
};
