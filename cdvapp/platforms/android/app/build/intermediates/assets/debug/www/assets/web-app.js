"use strict";



define('web-app/app', ['exports', 'web-app/resolver', 'ember-load-initializers', 'web-app/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('web-app/components/connect-4', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    playing: false, //playing set to false as default, changed once the player presses/clicks Start.
    winner: undefined, //Winner variable to be changed once someone wins the game.
    draw: false, //draw variable is set to false by default, due to the game not being complete.

    didInsertElement: function didInsertElement() {
      var stage = new createjs.Stage(this.$('#stage')[0]);

      // Draw the game board
      var board = new createjs.Shape();
      var graphics = board.graphics;
      graphics.beginFill('#ffffff');

      //Draw outer box
      graphics.drawRect(0, 0, 340, 2);
      graphics.drawRect(340, 0, 2, 300);
      graphics.drawRect(0, 0, 2, 300);
      graphics.drawRect(0, 300, 340, 2);

      //Draw Vertical Grid
      graphics.drawRect(48.5, 0, 2, 300);
      graphics.drawRect(97, 0, 2, 300);
      graphics.drawRect(145.5, 0, 2, 300);
      graphics.drawRect(194, 0, 2, 300);
      graphics.drawRect(242.5, 0, 2, 300);
      graphics.drawRect(291, 0, 2, 300);

      //Draw Horizontal Grid
      graphics.drawRect(0, 50, 340, 2);
      graphics.drawRect(0, 100, 340, 2);
      graphics.drawRect(0, 150, 340, 2);
      graphics.drawRect(0, 200, 340, 2);
      graphics.drawRect(0, 250, 340, 2);

      board.x = 20;
      board.y = 40;
      //board alpha = 0 makes the board transparrent. When game loads the board will not be visible.
      board.alpha = 0;
      this.set('board', board);
      stage.addChild(board);

      //create variable for markers... B for Blue, G for Green.
      var markers = {
        'b': [],
        'g': []
        //create 22 markers for each player (7 x 6 = 42)
      };for (var x = 0; x < 22; x++) {
        //create blue circle marker with radius of 23.
        var blueMarker = new createjs.Shape();
        graphics = blueMarker.graphics;
        graphics.beginFill('blue');
        graphics.drawCircle(0, 0, 23);
        graphics.endFill();
        blueMarker.visible = false; //hide marker as default until played.
        stage.addChild(blueMarker);
        markers.b.push(blueMarker);
        //create green circle marker with radius of 23.
        var greenMarker = new createjs.Shape();
        graphics = greenMarker.graphics;
        graphics.beginFill('green');
        graphics.drawCircle(0, 0, 23);
        graphics.endFill();
        greenMarker.visible = false; //hide marker as default until played.
        stage.addChild(greenMarker);
        markers.g.push(greenMarker);
      }

      this.set('markers', markers);
      this.set('stage', stage);
      stage.addChild(board);
      createjs.Ticker.addEventListener("tick", stage);
    },

    click: function click(ev) {
      //if the game has been started and there is no winner yet do this.
      if (this.get('playing') && !this.get('winner')) {
        //The board starts at 20/40 pixels and is 360px wide and 340px tall. Clicks will only be handled if clicked inside these parameters.
        if (ev.target.tagName.toLowerCase() == 'canvas' && ev.offsetX >= 20 && ev.offsetY >= 40 && ev.offsetX < 360 && ev.offsetY < 340) {
          // console.log(ev.offsetX);
          // console.log(ev.offsetY);

          //as the board started 20 pixels across, the 20 pixels have to be subtracted. Dividing by 48.5 calculates the value of each column, as each column is 48.5px tall.
          var x = Math.floor((ev.offsetX - 20) / 48.5);
          //as the board started 40 pixels dpwn, the 40 pixels have to be subtracted. Dividing by 50 calculates the value of each column, as each row is 50px wide.
          var y = Math.floor((ev.offsetY - 40) / 50);
          var state = this.get('state');

          //Var y value of 5.
          var y = 5;
          var state = this.get('state');
          //console.log(state);

          //each time marker is placed, subrtact 1 from the Y variable relevant to the column it is placed in.
          while (state[x][y] == 'b' || state[x][y] == 'g') {
            y = y - 1;
            //console.log(y);
          }

          //if the column is not full (y variable bigger than or equal to one. The column will be blocked if variable reaches -1.), do this.
          if (y >= 0) {
            //as marker is placed, play 'place-marker' sound
            createjs.Sound.play('place-marker');
            var player = this.get('player');
            state[x][y] = player;

            var move_count = this.get('moves')[player];
            var marker = this.get('markers')[player][move_count];
            marker.visible = true;

            //where to place marker.
            marker.x = 45 + x * 48.5;
            marker.y = 66 + y * 50;

            this.get('moves')[player] = move_count + 1;
            //as each plaer has a go, change which player's go it is.
            if (player == 'b') {
              this.set('player', 'g');
            } else {
              this.set('player', 'b');
            }
            if (this.get('winner') && window.plugins && window.plugins.toast) {
              window.plugins.toast.showShortBottom(this.get('player').toUpperCase() + ' to play next.');
            }
            this.get('stage').update();
          }
          //check if any of the patterns outlined in the 'check_winner' function match the current game state.
          this.check_winner();
        }
      }
    },

    check_winner: function check_winner() {
      //outline patterns of a win.
      var patterns = [

      //1st column vertical
      [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 1], [0, 2], [0, 3], [0, 4]], [[0, 2], [0, 3], [0, 4], [0, 5]],
      //2nd column vertical
      [[1, 0], [1, 1], [1, 2], [1, 3]], [[1, 1], [1, 2], [1, 3], [1, 4]], [[1, 2], [1, 3], [1, 4], [1, 5]],
      //3rd column vertical
      [[2, 0], [2, 1], [2, 2], [2, 3]], [[2, 1], [2, 2], [2, 3], [2, 4]], [[2, 2], [2, 3], [2, 4], [2, 5]],
      //4th column vertical
      [[3, 0], [3, 1], [3, 2], [3, 3]], [[3, 1], [3, 2], [3, 3], [3, 4]], [[3, 2], [3, 3], [3, 4], [3, 5]],
      //5th column  vertical
      [[4, 0], [4, 1], [4, 2], [4, 3]], [[4, 1], [4, 2], [4, 3], [4, 4]], [[4, 2], [4, 3], [4, 4], [4, 5]],
      //6th column  vertical
      [[5, 0], [5, 1], [5, 2], [5, 3]], [[5, 1], [5, 2], [5, 3], [5, 4]], [[5, 2], [5, 3], [5, 4], [5, 5]],
      //7th column  vertical
      [[6, 0], [6, 1], [6, 2], [6, 3]], [[6, 1], [6, 2], [6, 3], [6, 4]], [[6, 2], [6, 3], [6, 4], [6, 5]],

      //1st column  Horizontal
      [[0, 5], [1, 5], [2, 5], [3, 5]], [[1, 5], [2, 5], [3, 5], [4, 5]], [[2, 5], [3, 5], [4, 5], [5, 5]], [[3, 5], [4, 5], [5, 5], [6, 5]],
      //2nd column  Horizontal
      [[0, 4], [1, 4], [2, 4], [3, 4]], [[1, 4], [2, 4], [3, 4], [4, 4]], [[2, 4], [3, 4], [4, 4], [5, 4]], [[3, 4], [4, 4], [5, 4], [6, 4]],
      //3rd column  Horizontal
      [[0, 3], [1, 3], [2, 3], [3, 3]], [[1, 3], [2, 3], [3, 3], [4, 3]], [[2, 3], [3, 3], [4, 3], [5, 3]], [[3, 3], [4, 3], [5, 3], [6, 3]],
      //4th column  Horizontal
      [[0, 2], [1, 2], [2, 2], [3, 2]], [[1, 2], [2, 2], [3, 2], [4, 2]], [[2, 2], [3, 2], [4, 2], [5, 2]], [[3, 2], [4, 2], [5, 2], [6, 2]],
      //5th column  Horizontal
      [[0, 1], [1, 1], [2, 1], [3, 1]], [[1, 1], [2, 1], [3, 1], [4, 1]], [[2, 1], [3, 1], [4, 1], [5, 1]], [[3, 1], [4, 1], [5, 1], [6, 1]],
      //6th column  Horizontal
      [[0, 0], [1, 0], [2, 0], [3, 0]], [[1, 0], [2, 0], [3, 0], [4, 0]], [[2, 0], [3, 0], [4, 0], [5, 0]], [[3, 0], [4, 0], [5, 0], [6, 0]],

      //Diagonals (Left to Right)
      [[3, 0], [2, 1], [1, 2], [0, 3]], //work
      [[4, 0], [3, 1], [2, 2], [1, 3]], //work
      [[3, 1], [2, 2], [1, 3], [0, 4]], //work
      [[5, 0], [4, 1], [3, 2], [2, 3]], //work
      [[4, 1], [3, 2], [2, 3], [1, 4]], //work
      [[3, 2], [2, 3], [1, 4], [0, 5]], //work
      [[5, 1], [4, 2], [3, 3], [2, 4]], //work
      [[4, 2], [3, 3], [2, 4], [1, 5]], //work
      [[3, 3], [4, 2], [5, 1], [6, 0]], //Work
      [[5, 2], [4, 3], [3, 4], [2, 5]], //work
      [[3, 4], [4, 3], [5, 2], [6, 1]], //work
      [[3, 5], [4, 4], [5, 3], [6, 2]], //work


      //Diagonals (Right to Left)
      [[6, 3], [5, 2], [4, 1], [3, 0]], //work
      [[6, 4], [5, 3], [4, 2], [3, 1]], //work
      [[5, 3], [4, 2], [3, 1], [2, 0]], //work
      [[5, 3], [4, 2], [3, 1], [2, 0]], //work
      [[6, 5], [5, 4], [4, 3], [3, 2]], //work
      [[5, 4], [4, 3], [3, 2], [2, 1]], //work
      [[4, 3], [3, 2], [2, 1], [1, 0]], //work
      [[5, 5], [4, 4], [3, 3], [2, 2]], //work
      [[4, 4], [3, 3], [2, 2], [1, 1]], //work
      [[3, 3], [2, 2], [1, 1], [0, 0]], //work
      [[4, 5], [3, 4], [2, 3], [1, 2]], //work
      [[3, 4], [2, 3], [1, 2], [0, 1]], //work
      [[3, 5], [2, 4], [1, 3], [0, 2]]];

      var state = this.get('state');

      for (var pidx = 0; pidx < patterns.length; pidx++) {
        var pattern = patterns[pidx];
        var winner = state[pattern[0][0]][pattern[0][1]];

        if (winner) {
          //loop over all co-ordinates starting at idx 1
          for (var idx = 1; idx < pattern.length; idx++) {

            if (winner != state[pattern[idx][0]][pattern[idx][1]]) {
              winner = undefined;
              console.log(winner);
              break;
            }
          }
          //identify winner and set B or G to 'winner'.
          if (winner) {
            this.set('winner', winner);
            console.log(winner);
            //play winner sound.
            createjs.Sound.play('winner');
            break;
          }
        }
      }

      //if no winner, check this to see if it is a draw.
      if (!this.get('winner')) {
        var draw = true;
        for (var x = 0; x <= 6; x++) {
          for (var y = 0; y <= 5; y++) {
            if (!state[x][y]) {
              draw = false;
              break;
            }
          }
        }
        this.set('draw', draw);
      }
    },

    actions: {
      start: function start() {
        //toast plugin for cordova mobile app. Pop up message.
        if (window.plugins && window.plugins.toast) {
          window.plugins.toast.showShortBottom('Green to play next.');
        }

        var board = this.get('board');
        board.alpha = 0; //If game is restarted, this will make the board fade out back to being transparrent.
        if (this.get('playing')) {
          var markers = this.get('markers');
          for (var idx = 0; idx < 22; idx++) {
            createjs.Tween.get(markers.g[idx]).to({ y: 600 }, 500); //when game restarts, move all of the markers out of visible area (y: 600) with an animation time of 500ms.
            createjs.Tween.get(markers.b[idx]).to({ y: 600 }, 500);
          }
          createjs.Sound.play('falling'); //play falling sound effect to match the animations.
          createjs.Tween.get(board).wait(500).to({ alpha: 1 }, 1000); //make board visible within 1 second (fade).
        } else {
          createjs.Tween.get(board).to({ alpha: 1 }, 1000); //make board visible within 1 second (fade).
        }

        this.set('playing', true); //Once the user clicks start, this function will be used to change the 'playing' variable to 'true'
        this.set('winner', undefined); //Winner is undefined at the start of the game.
        this.set('draw', false);
        //current state of the game upon start. Undefined indicates that no player has played in that slot yet.
        this.set('state', [[undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined], [undefined, undefined, undefined, undefined, undefined, undefined]]);
        //Reset number of moves each user has had to 0 upon start of game/restart.
        this.set('moves', { 'b': 0, 'g': 0 });
        //Starting player is Green.
        this.set('player', 'g');
        var markers = this.get('markers');

        //redraw the stage.
        this.get('stage').update();
      }
    },

    //initialise/load all of the sounds and assign names/tags to each.
    init: function init() {
      this._super.apply(this, arguments);
      createjs.Sound.registerSound('assets/sounds/click.wav', 'place-marker');
      createjs.Sound.registerSound('assets/sounds/falling.mp3', 'falling');
      createjs.Sound.registerSound('assets/sounds/win.wav', 'winner');
    }

  });
});
define('web-app/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('web-app/helpers/app-version', ['exports', 'web-app/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('web-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('web-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('web-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'web-app/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _config$APP = _environment.default.APP,
      name = _config$APP.name,
      version = _config$APP.version;
  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('web-app/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('web-app/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('web-app/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('web-app/initializers/export-application-global', ['exports', 'web-app/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('web-app/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('web-app/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('web-app/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("web-app/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('web-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('web-app/router', ['exports', 'web-app/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('con4', { path: '/' });
  });

  exports.default = Router;
});
define('web-app/routes/con4', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('web-app/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define("web-app/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "pPQ3smFq", "block": "{\"symbols\":[],\"statements\":[[6,\"section\"],[9,\"id\",\"app\"],[7],[0,\"\\n    \"],[6,\"header\"],[7],[0,\"\\n        \"],[6,\"h1\"],[7],[4,\"link-to\",[\"con4\"],null,{\"statements\":[[0,\"Connect 4\"]],\"parameters\":[]},null],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"article\"],[7],[0,\"\\n        \"],[1,[18,\"outlet\"],false],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"footer\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"float-left\"],[7],[0,\"\\n            | by Jonny Mars\\n        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"float-right\"],[7],[0,\"\\n            created using \"],[6,\"a\"],[9,\"href\",\"https://www.emberjs.com/\"],[7],[0,\"Ember\"],[8],[0,\" |\\n        \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "web-app/templates/application.hbs" } });
});
define("web-app/templates/components/connect-4", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "3AyoZkVo", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"text-center\"],[7],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"playing\"]]],null,{\"statements\":[[4,\"if\",[[19,0,[\"winner\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[7],[0,\"\\n      Player \"],[1,[18,\"winner\"],false],[0,\" Won!\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[19,0,[\"draw\"]]],null,{\"statements\":[[0,\"    Let's call it a draw.\\n\"]],\"parameters\":[]},null],[0,\"  \"],[6,\"button\"],[3,\"action\",[[19,0,[]],\"start\"]],[7],[0,\"Restart\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"button\"],[3,\"action\",[[19,0,[]],\"start\"]],[7],[0,\"Start!\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[6,\"canvas\"],[9,\"id\",\"stage\"],[9,\"width\",\"380\"],[9,\"height\",\"380\"],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "web-app/templates/components/connect-4.hbs" } });
});
define("web-app/templates/con4", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "a4/KTJWE", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"connect-4\"],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "web-app/templates/con4.hbs" } });
});


define('web-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'web-app';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("web-app/app")["default"].create({"name":"web-app","version":"0.0.0+f324830f"});
}
//# sourceMappingURL=web-app.map
