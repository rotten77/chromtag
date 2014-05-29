var App = {};
	App.showFolders = (localStorage.showfolders) ? localStorage.showfolders : 0;
	App.tagsJson = "";

App.init = function() {
	App.getFolders();
	App.getTags();
	App.getBookmarks();
}
/**
 * Folders
 */
App.processFolder = function(node) {
	if(node.children) {
		if(node.title) {

			var folderElement = '<li><a href="#" class="label" data-parent="'+node.parentId+'" data-id="'+node.id+'" data-tag="'+App.tagSlug(node.title)+'" data-index="'+node.index+'">'+node.title+'</a></li>';
			var added = false;
			$('#folders li a').each(function(){

				if($(this).text() > node.title) {
					$(folderElement).insertBefore($(this).parent());
					added = true;
					return false;
				}
			});
			if(!added) $(folderElement).appendTo($('#folders'));
			
			$('#folder').append('<option value="'+node.id+'" data-index="'+node.index+'">'+node.title+'</option>');
		}
		node.children.forEach(function(child) {
			App.processFolder(child);
		});
	}
}

App.getFolders = function(bookmark) {
	$('#folders').html('');
	$('#folder').html('');

	chrome.bookmarks.getTree(function(itemTree){
		itemTree.forEach(function(item){
			App.processFolder(item);
		});
	});
}
/**
 * Tags
 */
App.tagSlug = function(tag) {
	// v 1.3
	// var find = '\u00E1\u010D\u010F\u00E9\u011B\u00ED\u0148\u00F3\u0159\u0161\u0165\u00FA\u016F\u00FD\u017E';
	// var repl = 'acdeeinorstuuyz';
	// return tag.toLowerCase().replace(new RegExp('[' + find + ']', 'g'), function (str) { return repl[find.indexOf(str)]; }).replace(/[^a-z0-9_]+/g, '-').replace(/^-|-\$/g, '').substr(0, tag.length);

	// v 1.4
	var find = '\u00E1\u010D\u010F\u00E9\u011B\u00ED\u0148\u00F3\u0159\u0161\u0165\u00FA\u016F\u00FD\u017E';
	var repl = 'acdeeinorstuuyz';
	return tag.toLowerCase().replace(new RegExp('[' + find + ']', 'g'), function (str) { return repl[find.indexOf(str)]; });
}
App.removeTag = function(title) {
	var matchTags = App.matchTags(title);
	for(var i=0; i < matchTags.length; i++) {
		// v 1.3
		// title = title.replace(new RegExp("(#"+matchTags[i]+")", 'gi'), '');

		// v 1.4
		title = title.replace(new RegExp("("+matchTags[i]+")", 'gi'), '');
	}
	title.replace(/^\s+|\s+$/g, '');
	return title;
}
App.matchTags = function(title) {
	var matched = [];
	// v 1.3
	// var matchTags = title.match(/\S*#(?:\[[^\]]+\]|\S+)/g);

	// v 1.4
	var matchTags = title.toLowerCase().match(/#([^\s]*)/g);

	if(matchTags!=null) {
		for(var i=0; i < matchTags.length; i++) {
			matched.push(App.tagSlug(matchTags[i]));
		}
	}

	return matched;
}
App.processTag = function(node) {
	if(node.children) {
		node.children.forEach(function(child) {
			App.processTag(child);
		});
	}

	if(node.url) {
		
		var matchTags = App.matchTags(node.title);

		for(var i=0; i < matchTags.length; i++) {
			if($('#tags a[data-tag="'+matchTags[i]+'"]').size()==0) {

				// tags
				var tagElement = '<li><a href="#" class="label hashtag" data-tag="'+matchTags[i]+'">'+matchTags[i].replace("#", "")+'</a></li>';
				var added = false;
				$('#tags li a').each(function(){

					if($(this).text().replace("#", "") > matchTags[i].replace("#", "")) {
						$(tagElement).insertBefore($(this).parent());
						added = true;
						return false;
					}
				});
				if(!added) $(tagElement).appendTo($('#tags'));

				// editor
				var tagElement = '<li><a href="#" class="hashtag add-tag" data-tag="'+matchTags[i]+'">'+matchTags[i].replace("#", "")+'</a></li>';
				var added = false;
				$('#addTag li a').each(function(){

					if($(this).text().replace("#", "") > matchTags[i].replace("#", "")) {
						$(tagElement).insertBefore($(this).parent());
						added = true;
						return false;
					}
				});
				if(!added) $(tagElement).appendTo($('#addTag'));
			}
		}

	}
}

App.getTags = function(bookmark) {
	$('#tags').html('');
	$('#addTag').html('');

	chrome.bookmarks.getTree(function(itemTree){
		itemTree.forEach(function(item){
			App.processTag(item);
		});
	});
}
/**
 * Bookmaks
 */
 App.processBookmark = function(node) {
	if(node.children) {
		node.children.forEach(function(child) {
			App.processBookmark(child);
		});
	}

	if(node.url && node.url.substring(0,11)!="javascript:") {

		var nodeTags = App.matchTags(node.title);
		var nodeSearch = App.tagSlug(node.title);
		if(node.parentId) {
			var nodeFolder = $('#folders li a[data-id="'+node.parentId+'"]').text();
			nodeSearch+="-"+App.tagSlug(nodeFolder);
		}
		var bookmarkHtml = '<li class="bookmark">';
			// bookmarkHtml+= '	';
			bookmarkHtml+= '	<a href="'+node.url+'" class="title" target="_blank" data-search="'+nodeSearch+'" data-title="'+node.title+'" data-parent="'+node.parentId+'" data-id="'+node.id+'"><span class="favicon"><img src="chrome://favicon/'+node.url+'" /></span>'+App.removeTag(node.title)+'</a>';
			bookmarkHtml+= '	<span class="url">'+node.url+'</span>';
			bookmarkHtml+= '	<span class="labels">';

			if(node.parentId) {
				if($('a[data-id="'+node.parentId+'"]').hasClass('active')) filtersBookmark++;
				if(nodeFolder!="") bookmarkHtml+= '	<span class="label">'+nodeFolder+'</span>';
			}

			for(i=0; i < nodeTags.length; i++) {
				bookmarkHtml+= '	<span class="label hashtag">'+nodeTags[i].replace("#", "")+'</span>';
			}

			bookmarkHtml+= '	</span>';

			bookmarkHtml+= '	<a href="#" class="edit" data-id="'+node.id+'">&#9998;</a>';
			bookmarkHtml+= '	<span class="clearfix">&nbsp;</span>';

			bookmarkHtml+= '</li>';

		$('#bookmarks').append(bookmarkHtml);

		App.getSearch();
	}
}
App.getBookmarks = function(bookmark) {
	$('#bookmarks').html('');

	chrome.bookmarks.getTree(function(itemTree){
		itemTree.forEach(function(item){
			App.processBookmark(item);
		});
	});
}
/**
 * Search
 */
App.getSearch = function() {
	var  keywords = new Array();
	var search = App.tagSlug($('#search').val());
	if(search!="") keywords.push(search);

	$('.label.active').each(function(){
		keywords.push($(this).data("tag"));
	});

	if(keywords.length>0) {
		$('.bookmark').hide();
		var searchSelector = '';

		for(i=0;i<keywords.length;i++) {
			searchSelector+='[data-search*="'+keywords[i]+'"]';
		}
		$('.bookmark a'+searchSelector).parent().show();
	} else {
		$('.bookmark').show();
	}
}
/**
 * App
 */
$(function(){
	App.init();
	$(".nano").nanoScroller();
	$(document.body).on('click', 'a.label', function(){

		if($(this).data("id")) {
			$('#folders .label').not(this).removeClass("active");
		}
			
		$(this).toggleClass("active");
		App.getSearch();
	});

	/**
	 * Search
	 */
	$('#search').focus().keyup(function(){
		App.getSearch();
	});

	/**
	 * Editor
	 */
	function closeEditor() {
		$('#over, #editor').hide();
	}
	function editorCallback() {
		App.init();
		closeEditor();
	}
	closeEditor();
	$('#over').click(function(){ closeEditor(); });
	$('#cancel').click(function(){ closeEditor(); });

	$(document.body).on('click', 'a.edit', function(){
		$('#over, #editor').show();
		var id = $(this).data("id");
		var bookmark = $('.bookmark a[data-id="'+id+'"]');
		$('#title').val(bookmark.data("title"));
		$('#url').val(bookmark.attr("href"));
		$('#id').val(id);
		$('#move').val(bookmark.data("parent"));
		$('#folder option').removeAttr("selected");
		$('#folder option[value="'+bookmark.data("parent")+'"]').attr("selected", true);
		return false;
	});
	$('#delete').click(function(){
		chrome.bookmarks.remove($('#id').val(), editorCallback);
	});
	$('#save').click(function(){
		var folder = $('#folder option:selected').val();
		if(folder!=$('#move').val()) {
			chrome.bookmarks.move(
				$('#id').val(),
				{
					parentId: folder,
					index: $('#folder option:selected').data("index")
				}
			);
		}

		chrome.bookmarks.update(
			$('#id').val(),
			{
				title: $('#title').val(),
				url: $('#url').val(),
			},
			editorCallback
			);
	});

	$(document.body).on('click', '#addTag li a', function(){
		console.log($(this).data("tag"));
		$('#title').val($('#title').val()+" "+$(this).data("tag"));
	});
	

	/**
	 * Options
	 */
	$('a[data-action="show-all"]').click(function(){

		$('#search').val("");

		if($('.active').size()>0) {
			$('.label').removeClass("active");
		}

		App.getSearch();
		return false;
	});
	$('a[data-action="show-folders"]').click(function(){
		App.showFolders = 0;
		$(this).hide();
		$('a[data-action="hide-folders"]').show();
		localStorage.showfolders = 0;
		$('#folders').show();
		return false;
	});

	$('a[data-action="hide-folders"]').click(function(){
		App.showFolders = 1;
		$(this).hide();
		$('a[data-action="show-folders"]').show();
		localStorage.showfolders = 1;
		$('#folders').hide();
		return false;
	});
	$('a[data-action="'+(App.showFolders==1 ? 'hide' : 'show')+'-folders"]').click();

	$('a[data-action="close"]').click(function(){
		window.close();
		return false;
	});

});