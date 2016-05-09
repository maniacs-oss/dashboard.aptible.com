import { moduleFor, test } from 'ember-qunit';

moduleFor('route:organization/environments/new', {
  unit: true,
  needs: ['service:analytics', 'service:elevation']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
