import * as utils from '../utils'

export default {
	name: 'maxlength',	
	validate(val, props) {
		if (props.maxlength && !utils.isEmpty(val)) {
			return String(val).length <= props.maxlength;
		}
	},	
	
}