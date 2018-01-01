var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */
var Node = new keystone.List('Node', {
	track: true
});

Node.add({
	name: { type: Types.Text, index: true, initial: true },
	description: { type: Types.Textarea, initial: true },
})

Node.defaultColumns = 'name|10%, description|90%';
Node.register();
