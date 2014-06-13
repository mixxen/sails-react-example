/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
define(['react', 'app/TodoFooter', 'app/TodoItem', 'app/utils'], function (React, TodoFooter, TodoItem, Utils) {
  'use strict';

  var ENTER_KEY = 13;

  var TodoApp = React.createClass({
    getInitialState: function () {
      return {
        nowShowing: Utils.ALL_TODOS,
        editing: null
      };
    },

    componentDidMount: function () {
      var setState = this.setState;
      var router = Router({
        '/': setState.bind(this, {nowShowing: Utils.ALL_TODOS}),
        '/active': setState.bind(this, {nowShowing: Utils.ACTIVE_TODOS}),
        '/completed': setState.bind(this, {nowShowing: Utils.COMPLETED_TODOS})
      });
      router.init('/');
    },

    handleNewTodoKeyDown: function (event) {
      if (event.which !== ENTER_KEY) {
        return;
      }

      var val = this.refs.newField.getDOMNode().value.trim();

      if (val) {
        this.props.model.addTodo(val);
        this.refs.newField.getDOMNode().value = '';
      }

      return false;
    },

    toggleAll: function (event) {
      var checked = event.target.checked;
      this.props.model.toggleAll(checked);
    },

    toggle: function (todoToToggle) {
      this.props.model.toggle(todoToToggle);
    },

    destroy: function (todo) {
      this.props.model.destroy(todo);
    },

    edit: function (todo, callback) {
      // refer to todoItem.js `handleEdit` for the reasoning behind the
      // callback
      this.setState({editing: todo.id}, function () {
        callback();
      });
    },

    save: function (todoToSave, text) {
      this.props.model.save(todoToSave, text);
      this.setState({editing: null});
    },

    cancel: function () {
      this.setState({editing: null});
    },

    clearCompleted: function () {
      this.props.model.clearCompleted();
    },

    render: function () {
      var footer;
      var main;
      var todos = this.props.model.todos;

      var shownTodos = todos.filter(function (todo) {
        switch (this.state.nowShowing) {
        case Utils.ACTIVE_TODOS:
          return !todo.completed;
        case Utils.COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
        }
      }, this);

      var todoItems = shownTodos.map(function (todo) {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={this.toggle.bind(this, todo)}
            onDestroy={this.destroy.bind(this, todo)}
            onEdit={this.edit.bind(this, todo)}
            editing={this.state.editing === todo.id}
            onSave={this.save.bind(this, todo)}
            onCancel={this.cancel}
          />
        );
      }, this);

      var activeTodoCount = todos.reduce(function (accum, todo) {
        return todo.completed ? accum : accum + 1;
      }, 0);

      var completedCount = todos.length - activeTodoCount;

      if (activeTodoCount || completedCount) {
        footer =
          <TodoFooter
            count={activeTodoCount}
            completedCount={completedCount}
            nowShowing={this.state.nowShowing}
            onClearCompleted={this.clearCompleted}
          />;
      }

      if (todos.length) {
        main = (
          <section id="main">
            <input
              id="toggle-all"
              type="checkbox"
              onChange={this.toggleAll}
              checked={activeTodoCount === 0}
            />
            <ul id="todo-list">
              {todoItems}
            </ul>
          </section>
        );
      }

      return (
        <div>
          <header id="header">
            <h1>todos</h1>
            <input
              ref="newField"
              id="new-todo"
              placeholder="What needs to be done?"
              onKeyDown={this.handleNewTodoKeyDown}
              autoFocus={true}
            />
          </header>
          {main}
          {footer}
        </div>
      );
    }
  });

  return TodoApp;

});
