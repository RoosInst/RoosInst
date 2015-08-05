﻿﻿﻿﻿﻿﻿﻿/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
 
CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.plugins =
		'enterkey,' +
		'entities,' +
		'link,' +
		'pastetext,' +
		'selectall,' +
		'sourcearea,' +
		'wysiwygarea,' +
		'ibmurllink,' +
		'ibmcharactercounter'
		;
	
	config.skin = 'oneui3';
	config.toolbar = 'Empty';
	config.toolbar_Empty = [['']];
	config.disableNativeSpellChecker = false;
	config.forceEnterMode = true;
	config.useComputedState = true;
	config.ignoreEmptyParagraph = false;
	
	//add a border to the default styling for find_highlight (specified in plugins/find/plugin.js) so that found text is also visibly highlighted in high contrast mode
	config.find_highlight = { element : 'span', styles : { 'background-color' : '#004', 'color' : '#fff', 'border' : '1px solid #004' } };

	// Paste from Word (Paste Special) configuration, ignore all font related formatting styles
	config.pasteFromWordRemoveFontStyles = true;
	config.pasteFromWordRemoveStyles = true;
	
	//Convert links as you type
	config.ibmAutoConvertUrls = true;
	//Generate event when link pasted 
	config.ibmEnablePasteLinksEvt = true;
	
	config.forcePasteAsPlainText = true;
	
	//ACF configs
	config.allowedContent = true;			//turn off ACF by default
};
	
//Disable doubleclick action on @mentions links in inline editor
CKEDITOR.on ('instanceReady', function(e){
	e.editor.on('doubleclick', function(evt) {
		if (typeof evt.data.dialog !== 'undefined' && evt.data.dialog !== '') {
			evt.data.dialog = '';
		}
	}, null, null, 900);
});

//CKReleaser %REMOVE_START%
// script to update the set of languages that are supported by IBM. This file gets packed into ckeditor.js
// during the build process, and this block gets removed.
CKEDITOR.scriptLoader.load('../_source/extensions/supportedLanguages.js');
CKEDITOR.scriptLoader.load('../_source/extensions/apis.js');
// CKReleaser %REMOVE_END% 

// %LEAVE_UNMINIFIED% %REMOVE_LINE%