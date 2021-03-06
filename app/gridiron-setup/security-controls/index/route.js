import Ember from 'ember';
import SPDRouteMixin from 'diesel/mixins/routes/spd-route';

export default Ember.Route.extend(SPDRouteMixin, {
  stepName: 'security-controls',
  model() {
    return this.modelFor('gridiron-setup.security-controls');
  },

  setupController(controller, model) {
    let organizationUrl = this.modelFor('gridiron-organization').get('organization.data.links.self');

    controller.set('model', model);
    controller.set('organizationUrl', organizationUrl);
  },

  actions: {
    onNext() {
      let transition;

      this.currentModel.forEach((securityControlGroup) => {
        if (!securityControlGroup.completed && !transition) {
          transition = this.transitionTo('gridiron-setup.security-controls.show', securityControlGroup);
        }
      });

      if (!transition) {
        transition = this.finish();
      }
    }
  }
});
