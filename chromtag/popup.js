var App = {};
	App.showFolders = (localStorage.showfolders) ? localStorage.showfolders : 0;

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
			$('#folders').append('<li><a href="#" class="label" data-parent="'+node.parentId+'" data-id="'+node.id+'">'+node.title+'</a></li>');
		}
		node.children.forEach(function(child) {
			App.processFolder(child);
		});
	}
}

App.getFolders = function(bookmark) {
	$('#folders').html('');

	chrome.bookmarks.getTree(function(itemTree){
		itemTree.forEach(function(item){
			App.processFolder(item);
		});
	});
}
App.getChildren = function() {
	$('#folders li .label').each(function(){
		// todo		
	});
}
/**
 * Tags
 */
App.tagSlug = function(tag) {
	return tag.replace("#","").toLowerCase();
}
App.removeTag = function(title) {
	var matchTags = App.matchTags(title);
	for(var i=0; i < matchTags.length; i++) {
		title = title.replace(new RegExp("(#"+matchTags[i]+")", 'gi'), '');
	}
	title.replace(/^\s+|\s+$/g, '');
	return title;
}
App.matchTags = function(title) {
	var matched = [];
	var matchTags = title.match(/\S*#(?:\[[^\]]+\]|\S+)/g);

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
				$('#tags').append('<li><a href="#" class="label hashtag" data-tag="'+matchTags[i]+'">'+matchTags[i]+'</a></li>');
			}
		}

	}
}

App.getTags = function(bookmark) {
	$('#tags').html('');

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

		//var showBookmark = $('a.active').size()>0 ? false : true;
		var filtersAll = $('a.active').size();
		var filtersBookmark = 0;

		var nodeTags = App.matchTags(node.title);

		var bookmarkHtml = '<li class="bookmark">';
			bookmarkHtml+= '	<a href="'+node.url+'" class="title" target="_blank">'+App.removeTag(node.title)+'</a>';
			bookmarkHtml+= '	<span class="url">'+node.url+'</span>';
			bookmarkHtml+= '	<span class="labels">';

			if(node.parentId) {
				if($('a[data-id="'+node.parentId+'"]').hasClass('active')) filtersBookmark++;
				var nodeFolder = $('#folders li a[data-id="'+node.parentId+'"]').text();
				if(nodeFolder!="") bookmarkHtml+= '	<span class="label">'+nodeFolder+'</span>';
			}

			for(i=0; i < nodeTags.length; i++) {
				if($('a[data-tag="'+nodeTags[i]+'"]').hasClass('active')) filtersBookmark++;
				bookmarkHtml+= '	<span class="label hashtag">'+nodeTags[i]+'</span>';
			}

			bookmarkHtml+= '	</span>';
			bookmarkHtml+= '	<span class="clearfix">&nbsp;</span>';
			bookmarkHtml+= '</li>';

		if(filtersAll==0 || (filtersAll>0 && filtersAll==filtersBookmark)) $('#bookmarks').append(bookmarkHtml);

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
 * App
 */
$(function(){
	App.init();
	$(".nano").nanoScroller();
	$(document.body).on('click', 'a.label', function(){

		if($('#folders li a[data-children]').size()==0) {
			App.getChildren();
		}

		if($(this).data("id")) {
			$('#folders .label').not(this).removeClass("active");
		}
			
		$(this).toggleClass("active");

		App.getBookmarks();
		
	});

	/**
	 * Options
	 */
	$('a[data-action="show-all"]').click(function(){
		if($('.active').size()>0) {
			$('.label').removeClass("active");
			App.getBookmarks();
		}
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