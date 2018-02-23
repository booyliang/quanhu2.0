import * as utils from '../utils'
export default {
	name: 'regex',
	validate(val, props) {
		if (props.regex && !utils.isEmpty(val)) {
			var regex = props.regex;
			if (typeof regex === 'string') {
				regex = new RegExp(regex);
			} else if (regex instanceof RegExp) {
				regex = props.regex;
			}
			return regex.test(val)
				
		}
	}
}