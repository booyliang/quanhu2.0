<template>

</template>

<script type="text/javascript">
	import Validator from './';

	let validator = new Validator({
		'age': [
			{
				rule: 'required',
				message: '请填写年龄'
			}
		],
		'tel': [
			'required',
			{
				rule: 'mobile',
				message: '自定义的提示'
			},
		],
		'address': [
			{
				test: /^武汉/,
				message: '请输入武汉市内地址'
			}
		],
		'gender': [
			{
				test(value) {
					return [
						'男',
						'女',
					].includes(value)
				},
				message: '请输入合法的性别'
			}
		],
		'bankcard': [
			'bankcard'
		]
	});

	validator.validate([
		{
			name: 'age',
			value: ''
		},
		{
			name: 'tel',
			value: '110'
		},
		{
			name: 'address',
			value: '哈尔滨'
		},
		{
			name: 'gender',
			value: '中性'
		},
		{
			name: 'bankcard',
			value: '111111'
		}
	]);
</script>