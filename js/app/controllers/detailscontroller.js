/**
 * ownCloud - Tasks
 *
 * @author Raimund Schlüßler
 * @copyright 2016 Raimund Schlüßler <raimund.schluessler@googlemail.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

angular.module('Tasks').controller('DetailsController', [
	'$scope', '$window', 'TasksModel', 'TasksBusinessLayer', '$route', '$location', '$timeout', '$routeParams', 'SettingsModel', 'Loading', 'ListsModel',
	function($scope, $window, TasksModel, TasksBusinessLayer, $route, $location, $timeout, $routeParams, SettingsModel, Loading, ListsModel) {
	  var DetailsController;
	  DetailsController = (function() {
		function DetailsController(_$scope, _$window, _$tasksmodel,
		_tasksbusinesslayer, _$route, _$location, _$timeout, _$routeparams, _$settingsmodel, _Loading, _$listsmodel) {
			this._$scope = _$scope;
			this._$window = _$window;
			this._$tasksmodel = _$tasksmodel;
			this._$listsmodel = _$listsmodel;
			this._tasksbusinesslayer = _tasksbusinesslayer;
			this._$route = _$route;
			this._$location = _$location;
			this._$timeout = _$timeout;
			this._$routeparams = _$routeparams;
			this._$settingsmodel = _$settingsmodel;
			this._Loading = _Loading;
			this._$scope.task = _$tasksmodel.getById(_$scope.route.taskID);
			this._$scope.found = true;
			this._$scope.$on('$routeChangeSuccess', function() {
				var task = _$tasksmodel.getByUri(_$scope.route.taskID);

				if (!(angular.isUndefined(task) || task === null)) {
					_$scope.task = task;
					return _$scope.found = true;
				}  else if (_$scope.route.taskID !== void 0) {
					_$scope.found = false;
					// var calendar = _$listsmodel.getByUri(_$scope.route.calendarID);
					// return _tasksbusinesslayer.getTask(calendar, _$scope.route.taskID).then(function(task) {
					// 	_$scope.task = task;
					// 	_$scope.found = true;
					// });
				}
			});

			this._$scope.settingsmodel = this._$settingsmodel;
			this._$scope.settingsmodel.add({
				'id': 'various',
				'categories': []
			});
			this._$scope.isAddingComment = false;
			this._$scope.timers = [];
			this._$scope.durations = [{
					name: t('tasks', 'week'),
					names: t('tasks', 'weeks'),
					id: 'week'
				}, {
					name: t('tasks', 'day'),
					names: t('tasks', 'days'),
					id: 'day'
				}, {
					name: t('tasks', 'hour'),
					names: t('tasks', 'hours'),
					id: 'hour'
				}, {
					name: t('tasks', 'minute'),
					names: t('tasks', 'minutes'),
					id: 'minute'
				}, {
					name: t('tasks', 'second'),
					names: t('tasks', 'seconds'),
					id: 'second'
				}
			];
			this._$scope.loadTask = function(taskID) {
				var task = _$tasksmodel.getByUri(_$scope.route.taskID);
				if (!(angular.isUndefined(task) || task === null)) {
					_$scope.task = task;
					return _$scope.found = true;
				}
			};
			this._$scope.TaskState = function() {
				if (_$scope.found) {
					return 'found';
				} else {
					if (_Loading.isLoading()) {
						return 'loading';
					} else {
						return null;
					}
				}
			};
			this._$scope.params = [
				{
					name: t('tasks', 'before beginning'),
					invert: true,
					related: 'START',
					id: "10"
				}, {
					name: t('tasks', 'after beginning'),
					invert: false,
					related: 'START',
					id: "00"
				}, {
					name: t('tasks', 'before end'),
					invert: true,
					related: 'END',
					id: "11"
				}, {
					name: t('tasks', 'after end'),
					invert: false,
					related: 'END',
					id: "01"
				}
			];
			this._$scope.filterParams = function(params) {
				var task;
				task = _$tasksmodel.getById(_$scope.route.taskID);
				if (!(angular.isUndefined(task) || task === null)) {
				  if (task.due && task.start) {
					return params;
				  } else if (task.start) {
					return params.slice(0, 2);
				  } else {
					return params.slice(2);
				  }
				}
			};
			this._$scope.deleteTask = function(taskID) {
				return _$timeout(function() {
					return _tasksbusinesslayer.deleteTask(taskID);
				}, 500);
			};
			this._$scope.editName = function($event) {
				if (!$($event.target).is('a')) {
					_$scope.setEditRoute('name');
				}
			};
			this._$scope.editDueDate = function($event) {
				if ($($event.currentTarget).is($($event.target).closest('.handler'))) {
					_$scope.setEditRoute('duedate');
					return _tasksbusinesslayer.initDueDate(_$scope.route.taskID);
				}
			};
			this._$scope.editStart = function($event) {
				if ($($event.currentTarget).is($($event.target).closest('.handler'))) {
					_$scope.setEditRoute('startdate');
					return _tasksbusinesslayer.initStartDate(_$scope.route.taskID);
				}
			};
			this._$scope.editReminder = function($event) {
				if ($($event.currentTarget).is($($event.target).closest('.handler'))) {
					_$scope.setEditRoute('reminer');
					return _tasksbusinesslayer.initReminder(_$scope.route.taskID);
				}
			};
			this._$scope.editNote = function($event) {
				if ($($event.currentTarget).is($($event.target).closest('.handler'))) {
					if (!$($event.target).is('a')) {
						_$scope.setEditRoute('note');
					}
				}
			};
			this._$scope.editPriority = function($event) {
				if ($($event.currentTarget).is($($event.target).closest('.handler'))) {
					_$scope.setEditRoute('priority');
				}
			};
			this._$scope.editPercent = function($event) {
				if ($($event.currentTarget).is($($event.target).closest('.handler'))) {
					_$scope.setEditRoute('percent');
				}
			};
			this._$scope.endEdit = function($event) {
				if ($($event.target).closest('.end-edit').length || $($event.currentTarget).is($($event.target).closest('.handler'))) {
					_$scope.resetRoute();
				}
			};
		  this._$scope.endName = function($event) {
			if ($event.keyCode === 13) {
			  $event.preventDefault();
			  _$scope.resetRoute();
			}
			if ($event.keyCode === 27) {
			  return _$scope.resetRoute();
			}
		  };

		  	this._$scope.setEditRoute = function(type) {
				var calendarID;
				var collectionID;
				if (calendarID = _$scope.route.calendarID) {
					$location.path('/calendars/' + calendarID + '/tasks/' + _$scope.route.taskID + '/edit/' + type);
				} else if (collectionID = _$scope.route.collectionID) {
					$location.path('/collections/' + collectionID + '/tasks/' + _$scope.route.taskID + '/edit/' + type);
				}
		  	}

			this._$scope.resetRoute = function() {
				var calendarID;
				var collectionID;
				if (calendarID = _$scope.route.calendarID) {
					$location.path('/calendars/' + calendarID + '/tasks/' + _$scope.route.taskID);
				} else if (collectionID = _$scope.route.collectionID) {
					$location.path('/collections/' + collectionID + '/tasks/' + _$scope.route.taskID);
				}
			};
		  this._$scope.deleteDueDate = function() {
			return _tasksbusinesslayer.deleteDueDate(_$scope.route.taskID);
		  };
		  this._$scope.deletePercent = function() {
			return _tasksbusinesslayer.setPercentComplete(_$scope.route.taskID, 0);
		  };
		  this._$scope.deleteStartDate = function() {
			return _tasksbusinesslayer.deleteStartDate(_$scope.route.taskID);
		  };
		  this._$scope.deleteReminder = function() {
			return _tasksbusinesslayer.deleteReminderDate(_$scope.route.taskID);
		  };

			this._$scope.toggleCompleted = function(task) {
				if (task.completed) {
					_tasksbusinesslayer.setPercentComplete(task, 0);
				} else {
					_tasksbusinesslayer.setPercentComplete(task, 100);
				}
			};

			this._$scope.toggleStarred = function(task) {
				if (task.priority > 5) {
					_tasksbusinesslayer.setPriority(task, 0);
				} else {
					_tasksbusinesslayer.setPriority(task, 9);
				}
			};

		  this._$scope.deletePriority = function() {
			return _tasksbusinesslayer.unstarTask(_$scope.route.taskID);
		  };
		  this._$scope.isDue = function(date) {
			return _$tasksmodel.due(date);
		  };
		  this._$scope.isOverDue = function(date) {
			return _$tasksmodel.overdue(date);
		  };
		  this._$scope.setstartday = function(date) {
			return _tasksbusinesslayer.setStart(_$scope.route.taskID, moment(date, 'MM/DD/YYYY'), 'day');
		  };
		  this._$scope.setstarttime = function(date) {
			return _tasksbusinesslayer.setStart(_$scope.route.taskID, moment(date, 'HH:mm'), 'time');
		  };
		  this._$scope.setdueday = function(date) {
			return _tasksbusinesslayer.setDue(_$scope.route.taskID, moment(date, 'MM/DD/YYYY'), 'day');
		  };
		  this._$scope.setduetime = function(date) {
			return _tasksbusinesslayer.setDue(_$scope.route.taskID, moment(date, 'HH:mm'), 'time');
		  };
		  this._$scope.setreminderday = function(date) {
			return _tasksbusinesslayer.setReminderDate(_$scope.route.taskID, moment(date, 'MM/DD/YYYY'), 'day');
		  };
		  this._$scope.setremindertime = function(date) {
			return _tasksbusinesslayer.setReminderDate(_$scope.route.taskID, moment(date, 'HH:mm'), 'time');
		  };
		  this._$scope.reminderType = function(task) {
			if (!angular.isUndefined(task)) {
			  if (task.reminder === null) {
				if (moment(task.start, "YYYYMMDDTHHmmss").isValid() || moment(task.due, "YYYYMMDDTHHmmss").isValid()) {
				  return 'DURATION';
				} else {
				  return 'DATE-TIME';
				}
			  } else {
				return task.reminder.type;
			  }
			}
		  };
		  this._$scope.changeReminderType = function(task) {
			_tasksbusinesslayer.checkReminderDate(task.id);
			if (this.reminderType(task) === 'DURATION') {
			  if (task.reminder) {
				task.reminder.type = 'DATE-TIME';
			  } else {
				task.reminder = {
				  type: 'DATE-TIME'
				};
			  }
			} else {
			  if (task.reminder) {
				task.reminder.type = 'DURATION';
			  } else {
				task.reminder = {
				  type: 'DURATION'
				};
			  }
			}
			return _tasksbusinesslayer.setReminder(task.id);
		  };
		  this._$scope.setReminderDuration = function(taskID) {
			return _tasksbusinesslayer.setReminder(_$scope.route.taskID);
		  };
		  this._$scope.addComment = function() {
			var comment,
			  _this = this;
			if (_$scope.CommentContent) {
			  _$scope.isAddingComment = true;
			  comment = {
				tmpID: 'newComment' + Date.now(),
				comment: _$scope.CommentContent,
				taskID: _$scope.route.taskID,
				time: moment().format('YYYYMMDDTHHmmss'),
				name: $('#expandDisplayName').text()
			  };
			  _tasksbusinesslayer.addComment(comment, function(data) {
				_$tasksmodel.updateComment(data);
				return _$scope.isAddingComment = false;
			  }, function() {
				return _$scope.isAddingComment = false;
			  });
			  return _$scope.CommentContent = '';
			}
		  };
		  this._$scope.sendComment = function(event) {
			if (event.keyCode === 13) {
			  return _$scope.addComment();
			}
		  };
		  this._$scope.deleteComment = function(commentID) {
			return _tasksbusinesslayer.deleteComment(_$scope.route.taskID, commentID);
		  };
		  this._$scope.commentStrings = function() {
			return {
			  button: t('tasks', 'Comment'),
			  input: t('tasks', 'Add a comment')
			};
		  };
		  this._$scope.addCategory = function(category, model) {
			var categories;
			_tasksbusinesslayer.addCategory(_$scope.route.taskID, category);
			categories = _$scope.settingsmodel.getById('various').categories;
			if (!(categories.indexOf(category) > -1)) {
			  return categories.push(category);
			}
		  };
		  this._$scope.removeCategory = function(category, model) {
			_tasksbusinesslayer.removeCategory(_$scope.route.taskID, category);
			return _$scope.resetRoute();
		  };
		}

		return DetailsController;

	  })();
	  return new DetailsController($scope, $window, TasksModel, TasksBusinessLayer, $route, $location, $timeout, $routeParams, SettingsModel, Loading, ListsModel);
	}
]);
