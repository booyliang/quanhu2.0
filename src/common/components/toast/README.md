此组件继承了 [`Popup`][popup]，请先去[这里][popup]查看相关信息。

## Methods

### `Toast(message, options)`

弹出一个 toast。

#### Alias

- `Vue.Toast`
- `Vue#$toast`

#### Parameters

- `message {String}`

	弹出的消息。

- `options {Object}`

	> 基础选项参见 [`Popup`](../popup#options)。

	| 名称				| 默认值		|
	| ---				| ---		|
	| `autoClose`		| `true`	|
	| `transparentMask`	| `true`	|

#### Return

| 类型		| 说明					|
| ---		| ---					|
| `Promise`	| 关闭时执行 `resolve`。	|

[popup]: ../popup/

## [Example](http://localhost/demo/toast)