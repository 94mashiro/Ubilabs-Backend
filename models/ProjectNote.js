var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */
var ProjectNote = new keystone.List('ProjectNote', {
	track: true
});

ProjectNote.add({	
	project: { type: Types.Relationship, ref: 'Project' },
	article: { type: Types.Relationship, ref: 'Article' },
	author: { type: Types.Relationship, ref: 'User' }
})
ProjectNote.register();
