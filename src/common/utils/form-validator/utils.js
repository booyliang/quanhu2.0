import DefaultMsg from './error-message'
export function isEmpty(val) {
	return val === undefined || val === null || !String(val).trim().length;
}
export function getDefaultMsg(ruleName) {
	return DefaultMsg[ruleName]
}
const pattern = /\{[0-9]\}/g;
export function format(msg, ...params) {
	if (params.length > 0)
		return msg.replace(pattern, (match) => {
			let index = parseInt(match[1])
			return params[index]
		});

	return msg;
}
export function formatError(rule) {	
	let {title, ruleMessage, ruleName, ruleValue} = rule;
	let formatMsg = ruleMessage || DefaultMsg[ruleName];
	return format(formatMsg, title, ruleValue)
}
		
