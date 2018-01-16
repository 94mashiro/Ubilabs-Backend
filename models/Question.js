var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */
var Question = new keystone.List('Question', {
	track: true
});

Question.add({
	title: { type: Types.Text, index: true, initial: true },
	node: { type: Types.Relationship, ref: 'Node', initial: true },
	author: { type: Types.Relationship, ref: 'User' },	
	answer: { type: Types.Relationship, ref: 'Answer', many: true },
	content: { type: Types.Markdown }
})

Question.schema.virtual('url').get(function () {
	return `/forum/question/${this._id}`
});

Question.defaultColumns = 'title|20%, node|10%, content';
Question.register();
