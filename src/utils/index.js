const hasRole = (userRole, allowedRoles) => {
	if (typeof userRole === 'undefined') {
		return false;
	}

	return allowedRoles.includes(userRole);
};

module.exports = {
	auth: {
		hasRole
	}
};
