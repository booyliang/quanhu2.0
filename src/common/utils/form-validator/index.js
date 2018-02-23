import rules from './rules'
import * as utils from './utils'

function validate(value, props) {
	let errors = [];
	for (let rule of rules) {
		if (props[rule.name] && !rule.validate(value, props)) {
			let ruleResult = {ruleName: rule.name, value, ruleMessage: props[rule.name + 'Errmsg'], ruleValue: props[rule.name], title: props.title || props.field }
			ruleResult.errorMessage = utils.formatError(ruleResult)
			errors.push(ruleResult)
		}
	}
	if (errors.length > 0) {
		return {hasError: true, errors};
	}
		
	return {hasError: false};

}


export {
	validate,	
}