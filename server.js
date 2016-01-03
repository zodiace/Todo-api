var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var id = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('todo API root/');
});

app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	}	else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {$like: '%' + query.q + '%'};
	}

	db.todo.findAll({where: where}).then(function (todos) {
		if (!!todos) {
			res.json(todos);
		} else {
			res.status(404).send('"message": "No matching item"');
		}
	}, function (e) {
		res.status(500).send(e.toJSON());
	});
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send('"message": "No matching item"');
		}
	}, function (e) {
		res.status(500).send(e.toJSON());
	});
});

app.post('/todos', function(req, res) {
	var body = req.body;
	body = _.pick(body, 'description', 'completed');

	if (!_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(404).send();
	}

	body.description = body.description.trim();

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}).catch(function (e) {
		res.status(404).send(e.toJSON());
	})
});

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
		id: todoId
		}
	}).then(function (rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				"error": "No todo with id"
			})
		} else {
			res.status(204).send();
		}
	}, function () {
		res.status(500).send();
	})

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			return todo.destroy();
		} else {
			res.status(404).send('"message": "No matching item"');
		}
	}).then(function (todo) {
		res.json(todo);
	});
});

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	var body = req.body;
	body = _.pick(body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);

	res.json(matchedTodo);
})

db.sequelize.sync().then(function () {
	app.listen(PORT, function() {
		console.log('Express server started, listening on port ' + PORT + '...');
	});
});



