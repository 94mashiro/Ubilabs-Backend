var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */
var Activity = new keystone.List('Activity', {
	track: true
});

Activity.add({
	title: { type: Types.Text, index: true, initial: true },
	imageUrls: { type: Types.TextArray },
	content: { type: Types.Markdown },
	author: { type: Types.Relationship, ref: 'User' },
	node: { type: Types.Relationship, ref: 'Node' },
	startDate: { type: Types.Datetime }
})

Activity.defaultColumns = 'title|20%, content';
Activity.register();
