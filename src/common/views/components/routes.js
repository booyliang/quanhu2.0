import Demo from './demo';

export default [
	{
		path: '/demo/:name',
		component: Demo
	},
	{
		path: '/demo/:type/:name',
		component: Demo
	},
]

