var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Text },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true, displayGravatar: true },
	password: { type: Types.Password, initial: true, required: true },
	avatar: { type: Types.Url, initial: false },
	description: { type: Types.Textarea, initial: true },
	gitlabId: { type: Types.Text, initial: false },
	gitlabToken: { type: Types.Text, initial: false },
	createdAt: { type: Types.Datetime, default: Date.now }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.schema.post('save', (user) => {
	if (user.email && !user.avatar) {
		user.avatar = user._.email.gravatarUrl()
		user.save()
	}
})


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
