const {location} = global;
let search;

try {
	search = location ? new URLSearchParams(location.search) : new Map;
} catch (e) {
	search = new Map;
	console.error(e);
}

function getDebug(str) {
	return (str || "").split(",").reduce((res, name) => {
		res[name] = true;
		return res;
	}, {});
}

export default function isQuery(name) {
	const map = getDebug(search.get(name));
	return val => map[val];
}

export function getSearch(name) {
	return search.get(name);
}

export const isDebug = isQuery("debug");