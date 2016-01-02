var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	dialect: 'sqlite',
	storage: __dirname + '/basic-sqlite-database.storage.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	}, 
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({force: false}).then(function () {
	console.log('Everything is good...');

	Todo.findById(3).then(function (todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('No todo found.')
		}
	});

	// Todo.create({
	// 	description: 'Walking my dog down the street',
	// 	completed: true
	// }).then(function (todo) {
	// 	return Todo.create({
	// 		description: 'Send rocket to the moon'
	// 	})
	// }).then(function (todo) {
	// 	return Todo.findById(2);
	// }).then(function (todo) {
	// 	if (todo) {
	// 		console.log(todo.toJSON());
	// 	} else {
	// 		console.log('Item not found.')
	// 	}
	// }).catch(function (e) {
	// 	console.log(e.message);
	// })
});