var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Node Model
 * ==========
 */
var Article = new keystone.List('Article', {
	track: true
});

Article.add({
	title: { type: Types.Text, index: true, initial: true },
	imageUrl: { type: Types.Url },
	content: { type: Types.Markdown },
	author: { type: Types.Relationship, ref: 'User'},	
})

Article.schema.virtual('url').get(function () {
	return `/forum/article/${this._id}`
});


Article.defaultColumns = 'title|20%, content';
Article.register();
