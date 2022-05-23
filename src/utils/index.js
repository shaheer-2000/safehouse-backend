const bcrypt = require('bcrypt');
const { DateTime } = require('luxon');
const { nanoid } = require('nanoid');
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
const genTempPass = () => nanoid(16);

const toUTCString = (dateTime, format="") => {
	console.log(typeof dateTime, dateTime.isLuxonDateTime)
	if (typeof dateTime === 'string') {
		dateTime = DateTime.fromFormat(dateTime, format);
	} else if (typeof dateTime === 'object' && !dateTime.isLuxonDateTime) {
		dateTime = DateTime.fromJSDate(dateTime);
	} else if (typeof dateTime === 'number') {
		dateTime = DateTime.fromMillis(dateTime);
	}

	return dateTime.toUTC().toISO()
};

const toLocaleTimeString = (dateTime) => {
	if (typeof dateTime !== 'string' && typeof dateTime !== 'object') {
		return;
	}

	if (typeof dateTime === 'object') {
		dateTime = dateTime.toISOString();
	}

	return DateTime.fromISO(dateTime).toISO();
};

const getDateUnits = (dateTime) => {
	if (typeof dateTime !== 'string') {
		return;
	}

	const d = DateTime.fromISO(dateTime);
	const day = d.day.toString();
	const dayLong = day.length === 1 ? `0${day}` : day;

	return [dayLong, d.monthLong, d.year];
};

module.exports = {
	auth: {
		hasRole,
		hashPass,
		compPass,
		genTempPass
	},
	dateTime: {
		toUTCString,
		toLocaleTimeString,
		getDateUnits
	}
};
