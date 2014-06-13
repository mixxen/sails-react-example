/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

define(['app/utils'], function (Utils) {
  'use strict';

  // Generic "model" object. You can use whatever
  // framework you want. For this application it
  // may not even be worth separating this logic
  // out, but we do this to demonstrate one way to
  // separate out parts of your application.
  var TodoModel = function (url, socket) {
    this.url = url;
    this.socket = socket;
    this.onChanges = [];
    this.todos = [];
  };

  TodoModel.prototype.set = function(data) {
    this.todos = data;
    this.inform();
  };

  TodoModel.prototype.subscribe = function (onChange) {
    this.onChanges.push(onChange);
  };

  TodoModel.prototype.inform = function () {
    this.onChanges.forEach(function (cb) { cb(); });
  };

  TodoModel.prototype.addTodo = function (title) {
    var todo = {
      uid: Utils.uuid(), //not used anymore
      title: title,
      completed: false
    };

    this.socket.post(this.url, todo, function whenServerResponds(data) {
      this.todos = this.todos.concat(data);
      console.log('Message posted :: ', data);
    }.bind(this));

  };

  TodoModel.prototype.toggleAll = function (checked) {    
    this.todos.forEach(function (todo) {
      this.socket.put(this.url + '/' + todo.id, {completed: checked}, function whenServerResponds(data) {
        console.log('Message toggleAll :: ', data);
      });
    }.bind(this));
  };

  TodoModel.prototype.toggle = function (todoToToggle) {
    this.socket.put(this.url + '/' + todoToToggle.id, {completed: !todoToToggle.completed}, function whenServerResponds(data) {
      console.log('Message toggle :: ', data);
    });
  };

  TodoModel.prototype.destroy = function (todo) {
    this.socket.delete(this.url + '/' + todo.id, function whenServerResponds(data) {
      console.log('Message destroy :: ', data);
    });
  };

  TodoModel.prototype.save = function (todoToSave, text) {
    this.socket.put(this.url + '/' + todoToSave.id, {title: text}, function whenServerResponds(data) {
      console.log('Message save :: ', data);
    });
  };

  TodoModel.prototype.clearCompleted = function () {
    this.todos.forEach(function (todo) {
      if(todo.completed)
        this.socket.delete(this.url + '/' + todo.id, function whenServerResponds(data) {
          console.log('Message destroy :: ', data);
        });
    }.bind(this));
  };

  return TodoModel;

});
