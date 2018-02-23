
export default {
	name: 'required',
	
	validate(val) {
		return !(val === undefined || val === null || !String(val).trim().length);
	}
}