var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */
var Project = new keystone.List('Project', {
	track: true
});

Project.add({
	title: { type: Types.Textarea, initial: true },
	gitTitle: { type: Types.Text },
	node: { type: Types.Relationship, ref: 'Node', many: true },
	leader: { type: Types.Relationship, ref: 'User' },
	description: { type: Types.Textarea },
	member: { type: Types.Relationship, ref: 'User', many: true },
	imageUrls: { type: Types.TextArray },
	codelab: { type: Types.Relationship, ref: 'Codelab' },
	story: { type: Types.Markdown },
	gitId: { type: Types.Text },
	gitSSH: { type: Types.Textarea }
})

Project.defaultColumns = 'title';
Project.register();
