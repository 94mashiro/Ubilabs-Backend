var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */
var Answer = new keystone.List('Answer', {
	track: true
});

Answer.add({
	question: { type: Types.Relationship, ref: 'Question', initial: true },
	author: { type: Types.Relationship, ref: 'User'},	
	content: { type: Types.Markdown }
})

Answer.defaultColumns = 'content';
Answer.register();
