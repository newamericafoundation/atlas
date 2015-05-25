if CKEDITOR?
	CKEDITOR.config.allowedContent = true
	CKEDITOR.config.format_tags = 'p;h1;h2;h3;h4'
	CKEDITOR.config.format_h4 = { element: 'h4', attributes: { 'class': 'Notes under tables' } }
	CKEDITOR.config.toolbar = [
		[ 'Source','-','Undo','Redo','Cut','Copy','Paste','-','Find','Replace' ]
		[ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','-','Link','Unlink','-','Format','-','TextColor','BGColor' ]
	]
	CKEDITOR.config.height = '500px';