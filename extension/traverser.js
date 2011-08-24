// The script which works in tab

// Answer to the popup menu. 
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
	  console.log("Request received");
      sendResponse({content: getContentInPage(document.documentElement)});
  });

// Get text in the current element.
function getContentInPage(element)
{
	if(element.nodeType == Node.TEXT_NODE) {
		return element.data;
	}
	var tagName = null;
	if(element.nodeType == Node.ELEMENT_NODE) {
		tagName = element.tagName.toLowerCase();
		if(tagName == "head") {
			return "";
		}else if(tagName == "br") {
			return "\n";
		}else if(tagName == "script") {
			return "";
		}else if(tagName == "textarea") {
			return element.value;
		}else if(tagName == "input") {
			if(element.type == "checkbox") {
				if(element.checked) {
					return "■";
				}else{
					return "□";
				}
			}else if(element.type == "radio") {
				if(element.checked) {
					return "●";
				}else{
					return "○";
				}
			}
			return element.value;
		}else if(tagName == "select") {
			var index = element.selectedIndex;
			if(index < 0) {
				return "";
			}
	        return element.options[index].value;		
		}
	}
	if(element.hasChildNodes() == false) {
		return "";
	}
	var childNodes = element.childNodes;
	var content = "";
	for(var i = 0; i < childNodes.length; i ++) {
		var childNode = childNodes.item(i);
		if(childNode.nodeType == Node.TEXT_NODE) {
			content += childNode.data.replace(/\s/g, "");
		}else if(childNode.nodeType == Node.CDATA_SECTION_NODE) {
			content += childNode.data.replace(/\s/g, "");
		}else if(childNode.nodeType == Node.ELEMENT_NODE){
			content += getContentInPage(childNode);
		}
	}
	if(tagName == "p" || tagName == "li" || tagName.match(/h[0-9]/i) || tagName == "form" || tagName == "label") {
		content += "\n";
	}
	return content;
}