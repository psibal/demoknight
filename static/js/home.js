// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var App, DayView, HomeModel, HomeView, InputView, PlanDayView, PlanView, PlannerView, TaskView, WeekView, json_data, weekdays;
    json_data = {};
    $.ajax({
      url: '/home_data',
      async: false,
      success: function(data) {
        return json_data = data;
      }
    });
    console.log(json_data);
    weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    HomeModel = Backbone.Model.extend({
      initialize: function() {
        return console.log("dashboard model initialized");
      }
    });
    HomeView = Backbone.View.extend({
      el: '#home',
      initialize: function() {
        this.model = new HomeModel();
        this.input = new InputView({
          model: this.model
        });
        this.thisWeek = new WeekView({
          which: 'this',
          model: this.model
        });
        this.nextWeek = new WeekView({
          which: 'next',
          model: this.model
        });
        return this.planner = new PlannerView({
          model: this.model
        });
      }
    });
    WeekView = Backbone.View.extend({
      initialize: function() {
        var day, i, _results, _results1;
        if (this.options.which === 'this') {
          this.el = $('#this_week');
          this.days = [];
          i = 0;
          _results = [];
          while (i < 7) {
            day = new DayView({
              which: i,
              model: this.model,
              parent: this.el
            });
            this.days.push(day);
            _results.push(i += 1);
          }
          return _results;
        } else if (this.options.which === 'next') {
          this.el = $('#next_week');
          this.days = [];
          i = 7;
          _results1 = [];
          while (i < 14) {
            day = new DayView({
              which: i,
              model: this.model,
              parent: this.el
            });
            this.days.push(day);
            _results1.push(i += 1);
          }
          return _results1;
        } else {
          return console.log('You done goofed, son.');
        }
      }
    });
    PlannerView = Backbone.View.extend({
      el: '#planner',
      initialize: function() {
        var i, planday, _results;
        this.plandays = [];
        i = 0;
        _results = [];
        while (i < 7) {
          planday = new PlanDayView({
            which: i,
            model: this.model
          });
          this.plandays.push(planday);
          _results.push(i += 1);
        }
        return _results;
      },
      render: function() {}
    });
    DayView = Backbone.View.extend({
      template: _.template($('#day_template').html()),
      initialize: function() {
        var f_or_s, i, segment, task_detail, tasks_list, weekday, _i, _len;
        i = this.options.which;
        this.parent = this.options.parent;
        this.tasks = [];
        weekday = weekdays[i % 7];
        segment = this.template({
          day: json_data.two_weeks[i]
        });
        if (i < 7) {
          f_or_s = "First";
        } else {
          f_or_s = "Second";
        }
        tasks_list = json_data.tasks[f_or_s][weekday];
        for (_i = 0, _len = tasks_list.length; _i < _len; _i++) {
          task_detail = tasks_list[_i];
          this.tasks.push(new TaskView({
            model: this.model,
            detail: task_detail
          }));
        }
        return this.render(segment);
      },
      render: function(segment) {
        var task, _i, _len, _ref;
        this.parent.append(segment);
        _ref = this.tasks;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          task = _ref[_i];
          this.$el.append(task.render());
        }
        return this;
      }
    });
    PlanDayView = Backbone.View.extend({
      template: _.template($('#planday_template').html()),
      initialize: function() {
        var i, plan, plan_detail, weekday, _i, _len, _ref;
        i = this.options.which;
        this.plans = [];
        weekday = weekdays[i];
        _ref = json_data.planned[weekday];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          plan_detail = _ref[_i];
          plan = new PlanView({
            model: this.model,
            detail: plan_detail
          });
          this.plans.push(plan);
        }
        return this.render(i);
      },
      render: function(i) {
        $('#planner').append(this.template({
          day: json_data.two_weeks[i]
        }));
        return this;
      }
    });
    TaskView = Backbone.View.extend({
      template: _.template($("#task_template").html()),
      initialize: function() {
        return this.details = this.options.detail;
      },
      render: function() {
        this.$el.html(this.template({
          done: this.details.completed,
          name: this.details.name
        }));
        this.delegateEvents();
        return this;
      }
    });
    PlanView = Backbone.View.extend({
      initialize: function() {},
      toggleDone: function() {},
      move: function() {}
    });
    InputView = Backbone.View.extend({
      el: $('#input_container'),
      template: _.template($('#inputter_template').html()),
      events: {
        "click .add_task": "new_task"
      },
      initialize: function() {
        var now, nowTemp;
        this.render();
        nowTemp = new Date();
        now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
        $('#dawg').datepicker({
          onRender: function(date) {
            if (date.valueOf() < now.valueOf()) {
              return "disabled";
            } else {
              return "";
            }
          }
        });
        this.task_name = this.$("#task_name");
        this.task_date = this.$("#task_date");
        return this.task_length = this.$("#task_length");
      },
      render: function() {
        $(this.el).html(this.template({
          today: json_data.today
        }));
        return this;
      },
      new_task: function() {
        var data;
        data = {
          name: this.task_name.val(),
          date: this.task_date.val(),
          length: this.task_length.val()
        };
        this.model.trigger('new_task', data);
        return $.post("/addtask", data, function(d, st, xr) {
          return console.log("Done");
        });
      }
    });
    return App = new HomeView();
  });

}).call(this);
