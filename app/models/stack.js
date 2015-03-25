import Ember from 'ember';
import DS from 'ember-data';

let roleUrlRegex = new RegExp('/roles/([a-zA-Z0-9\-]+)$');

function getRoleIdFromPermission(permission){
  var roleUrl = permission.get('data.links.role');

  if (roleUrl && roleUrlRegex.test(roleUrl)) {
    var id = roleUrlRegex.exec(roleUrl)[1];

    return Ember.RSVP.resolve(id);
  } else {
    return permission.get('role').then(function(role){
      return role.get('id');
    });
  }
}

export default DS.Model.extend({
  // properties
  name: DS.attr('string'),
  handle: DS.attr('string'),
  number: DS.attr('string'),
  type: DS.attr('string'),
  syslogHost: DS.attr('string'),
  syslogPort: DS.attr('string'),
  organizationUrl: DS.attr('string'),

  // relationships
  apps: DS.hasMany('app', {async: true}),
  databases: DS.hasMany('database', {async: true}),
  permissions: DS.hasMany('permission', {async:true}),
  organization: DS.belongsTo('organization', {async:true}),
  logDrains: DS.hasMany('log-drain', {async:true}),

  // computed properties
  allowPHI: Ember.computed.match('type', /production/),
  appContainerCentsPerHour: function() {
    return this.get('allowPHI') ? 10 : 6;
  }.property('allowPHI'),

  permitsRole(role, scope){
    let permissions;

    if(role.get('privileged') && role.get('data.links.organization') === this.get('data.links.organization')) {
      return true;
    }

    return this.get('permissions').then(function(_permissions){
      permissions = _permissions;

      let promises = permissions.map(function(perm){
        return getRoleIdFromPermission(perm).then(function(roleId){
          return {
            roleId: roleId,
            scope:  perm.get('scope')
          };
        });
      });

      return Ember.RSVP.all(promises);
    }).then(function(stackRoleScopes){
      return stackRoleScopes.any(function(stackRoleScope){
        if (role.get('id') !== stackRoleScope.roleId) {
          // skip irrelevant role
          return false;
        }

        return stackRoleScope.scope === 'manage' ||
          stackRoleScope.scope === scope;
      });
    });
  }
});
