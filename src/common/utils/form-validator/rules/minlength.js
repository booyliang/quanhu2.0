import * as utils from '../utils'

export default {
	name: 'minlength',	
	validate(val, props) {
		if (props.minlength && !utils.isEmpty(val)) {
			return String(val).length >= props.minlength;
		}
	}
	
}