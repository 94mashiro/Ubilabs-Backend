var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */
var Follow = new keystone.List('Follow', {
	track: true
});

Follow.add({
	follower: { type: Types.Relationship, ref: 'User'},	
	following: { type: Types.Relationship, ref: 'User' }
})

Follow.register();
