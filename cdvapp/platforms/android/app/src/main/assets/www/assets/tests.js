'use strict';

define('web-app/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/connect-4.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/connect-4.js should pass ESLint\n\n9:21 - \'createjs\' is not defined. (no-undef)\n12:21 - \'createjs\' is not defined. (no-undef)\n54:28 - \'createjs\' is not defined. (no-undef)\n63:29 - \'createjs\' is not defined. (no-undef)\n76:5 - \'createjs\' is not defined. (no-undef)\n95:13 - \'y\' is already defined. (no-redeclare)\n96:13 - \'state\' is already defined. (no-redeclare)\n109:11 - \'createjs\' is not defined. (no-undef)\n246:11 - Unexpected console statement. (no-console)\n253:9 - Unexpected console statement. (no-console)\n255:9 - \'createjs\' is not defined. (no-undef)\n289:11 - \'createjs\' is not defined. (no-undef)\n290:11 - \'createjs\' is not defined. (no-undef)\n292:9 - \'createjs\' is not defined. (no-undef)\n293:9 - \'createjs\' is not defined. (no-undef)\n295:9 - \'createjs\' is not defined. (no-undef)\n315:13 - \'markers\' is already defined. (no-redeclare)\n325:7 - \'createjs\' is not defined. (no-undef)\n326:7 - \'createjs\' is not defined. (no-undef)\n327:7 - \'createjs\' is not defined. (no-undef)');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/con4.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/con4.js should pass ESLint\n\n');
  });
});
define('web-app/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('web-app/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'web-app/tests/helpers/start-app', 'web-app/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var resolve = Ember.RSVP.resolve;
});
define('web-app/tests/helpers/resolver', ['exports', 'web-app/resolver', 'web-app/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('web-app/tests/helpers/start-app', ['exports', 'web-app/app', 'web-app/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('web-app/tests/integration/components/connect-4-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('connect-4', 'Integration | Component | connect 4', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "fXe8hnYp",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"connect-4\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "sFbgxBHG",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"connect-4\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('web-app/tests/test-helper', ['web-app/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('web-app/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/connect-4-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/connect-4-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/con4-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/con4-test.js should pass ESLint\n\n');
  });
});
define('web-app/tests/unit/routes/con4-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:con4', 'Unit | Route | con4', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
require('web-app/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
