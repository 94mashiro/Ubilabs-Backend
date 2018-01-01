var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */
var Comment = new keystone.List('Comment', {
	track: true
});

Comment.add({
	author: { type: Types.Relationship, ref: 'User'},	
	article: { type: Types.Relationship, ref: 'Article' },
	answer: { type: Types.Relationship, ref: 'Answer' },
	activity: { type: Types.Relationship, ref: 'Activity'},
	content: { type: Types.Markdown }
})

Comment.defaultColumns = 'content';
Comment.register();
