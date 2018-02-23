## Constructor

### `new Validator(rules)`

#### Arguments

| 名称		| 类型		| 说明										|
| ---		| ---		| ---										|
| `rules`	| `Object`	| 各个字段的验证规则。键为字段名，值为规则数组。	|

规则数组中的每一项，可以是字符串，如 `'required'`。此时表示调用预设规则。

可以是对象。此时有以下属性：

| 名称		| 类型					| 说明				| 取值																																|
| ---		| ---					| ---				| ---																																|
| `rule`	| `String`				| 预设规则的名称。	| `'required'`：必填；<br>`'mobile'`：手机号；<br>`'id'`：身份证号；<br>`'number'`：数字；<br>`'email'`：邮箱；<br>`'bankcard'`：银行卡号。	|
| `test`	| `Function / RegExp`	| 规则的测试主体。	| 当类型为 `Function` 时，接受 `value` 作为参数，返回一个 `Boolean` 值，决定该规则是否验证通过。											|
| `message`	| `String`				| 验证失败时的消息。	| -																																	|

例如：

```javascript
{
	rule: 'required'
}
```

这与字符串值效果相同。

也可以覆盖预设规则，除了 `rule` 之外，额外传入你需要覆盖的属性：

```javascript
{
	rule: 'mobile',
	message: '自定义的错误消息'
}
```

这将覆盖预设的 `mobile` 规则的默认表现。

也可以自定义规则：

```javascript
{
	test: /^120$/,
	message: '该号码是假冒急救中心'
}

// Or

{
	test(value) {
		return value.length <= 10;
	},
	message: '不能超过 10 个字'
}
```

## Methods

### `validate`

重载方法，有以下调用方式：

#### `validate(fieldName, fieldValue)`

##### Arguments

| 名称			| 类型		| 说明		|
| ---			| ---		| ---		|
| `fieldName`	| `String`	| 字段名。	|
| `fieldValue`	| -			| 字段值。	|

#### `validate(field)`

##### Arguments

| 名称		| 类型		| 说明							|
| ---		| ---		| ---							|
| `field`	| `Object`	| 单个字段。键为字段名，值为字段值。	|

#### `validate(fields)`

##### Arguments

| 名称		| 类型				| 说明																			|
| ---		| ---				| ---																			|
| `fields`	| `Array<Object>`	| 字段组成的数组。其中每一项的键为字段名，值为字段值。	将按顺序验证，一旦验证失败则终止。	|

#### Return

验证通过，返回一个 resolved 的 `Promise`；验证失败，弹出 `Toast`，返回一个 rejected 的 `Promise`。