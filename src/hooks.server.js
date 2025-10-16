// THIS IS ONLY INCLUDED FOR TESTING PURPOSES. NEEDS TO BE REMOVED IN PRODUCTION
// SHOULD NEVER LOG UNHANDLED INTERNAL ERRORS TO THE BROWSER

/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event, status, message }) {
	return {
		message: error,
	};
}