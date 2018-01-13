const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */
const Milestone = new keystone.List('Milestone', {
	track: true
});

Milestone.add({
	name: { type: Types.Textarea, initial: true },
	description: { type: Types.Textarea },
	deadline: { type: Types.Date },
	finishTime: { type: Types.Date },
	project: { type: Types.Relationship, ref: 'Project' }
})

Milestone.register();
