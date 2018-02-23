export default [
	{
		path: '/redirect/:moduleEnum/:id',
		component: require('./index') // 
	},
	{
		path: '/redirect/coterie/:coterieId/:moduleEnum/:id',
		component: require('./index')
	},
	{path: '/redirect/:moduleEnum/:id/:type', component: require('./index')},
	{path: '/redirect/:moduleEnum/:id/:type/:custId/:transferId', component: require('./index')},

]

