function bindMethods (object, context) {
	Object.keys(object).forEach((key) => {
		if (typeof object[key] === 'function') {
			// console.log('bind', key);
			// object[key] = object[key].bind(context);
			context[key] = object[key];
		}
	});

	if (object.init){
		object.init.call(context);
	}
}

function isEqual (a, b) {
	if (a === b) {
		return true;
	}
	if (!a && b || a && !b) {
		return false;
	}
	return JSON.stringify(a) === JSON.stringify(b);
}

module.exports = {
	bindMethods,
	isEqual
};
