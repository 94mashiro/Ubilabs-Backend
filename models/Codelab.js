var keystone = require('keystone');
var Types = keystone.Field.Types;
var generate = require('../utils/generate-gitbook')

/**
 * Node Model
 * ==========
 */
var Codelab = new keystone.List('Codelab', {
	track: true
});

var fileStorage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: keystone.expandPath('./archive/codelabs')
	}
})

Codelab.add({
	title: { type: Types.Text, index: true, initial: true },
	author: { type: Types.Relationship, ref: 'User' },
	node: { type: Types.Relationship, ref: 'Node' },
	file: {
		type: Types.File,
		storage: fileStorage
	}
})

Codelab.schema.post('save', async (codelab) => {
	try {
		await generate(codelab.file.filename, codelab._id)
	} catch (err) {
		console.log(err)
	}
})

Codelab.defaultColumns = 'title|20%, content';
Codelab.register();
