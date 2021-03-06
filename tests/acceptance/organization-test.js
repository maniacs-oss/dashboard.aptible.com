import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance: Organization', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /organization', function(assert) {
  stubStacks();
  stubOrganization({ id: 1 });
  stubBillingDetail({ id: 1 });
  setFeature('organization-settings', true);
  signInAndVisit('/organizations/1');
  andThen(function() {
    assert.equal(currentPath(), 'requires-authorization.organization.members.index');
    expectLink('/organizations/1/members');
    expectLink('/organizations/1/roles');
  });
});
