//Appml 2.0.2- Created by Refsnes Data for W3Schools. Please don't remove this line.
var appmlObjects = [];
function appml(appmlname) {
    for (var i = 0; i < appmlObjects.length; i++) {
        if (appmlname == appmlObjects[i].appName) {return appmlObjects[i]; }
    }
}
function getAppmlApplication(appmlname) { return appml(appmlname);}
function appmlObject(appmlname) { return appml(appmlname);}
function appmlObj(appmlname) { return appml(appmlname);}
(function () {
    var x = function () { var z = new AppML("", "", "invoke"); z.invokeAppML(); }
    if (window.addEventListener) {
        window.addEventListener("load", x);
    } else if (window.attachEvent) {
        window.attachEvent("onload", x);
    }
})();
function AppML(container, appsrc, appmlname) {
    if (appmlname != "invoke") {
        appmlObjects.push(this);
    }
    this.appName = appmlname;
    if (manageContainers(container, this) === -1) {return -1; }
    if (typeof window[appsrc] == "object") {
        this.dataObject = appsrc;
    } else {
        this.dataSource = appsrc;
    }
    this.error = {};
    this.appmlID = "";
    this.displayType = "list";
    this.queryFields = [];
    this.queryValues = [];
    this.queryDisplayValues = [];
    this.queryTypes = [];
    this.queryOperators = [];
    this.queryDisplayOperators = [];
    this.orderBys = [];
    this.orderByDirections = [];
    this.maxRecords = 0;
    this.data = {};
    this.data.keyField = "";    
    this.data.filteritems = [];
    this.data.sortitems = [];
    this.invokeAppML = function () {
        var z, i, a, j, datasource, controller, appmlname, count, att, xmlhttp;
        z = document.getElementsByTagName("*");
        for (i = 0; i < z.length; i++) { //Manage Includes:
            if (z[i].getAttribute("appml-include-html")) {
                a = z[i].cloneNode(false);
                xmlhttp = this.xmlHttp(z[i].getAttribute("appml-include-html"), "", "GET", false);
                a.removeAttribute("appml-include-html");
                a.innerHTML = xmlhttp.responseText;
                z[i].parentNode.replaceChild(a, z[i]);
            }
        }
        for (i = 0; i < z.length; i++) { //Manage Appml Applications:
            if (z[i].hasAttributes && ((att = z[i].getAttribute("appml-controller")) !== null || (att = z[i].getAttribute("appml-data")) !== null)) {
                controller = z[i].getAttribute("appml-controller");
                datasource = z[i].getAttribute("appml-data");
                appmlname = z[i].id;
                z[i].removeAttribute("appml-controller");
                if (controller || datasource) {
                    new AppML(z[i], datasource, appmlname);
                    count = appmlObjects.length;
                    if (controller) {
                        appmlObjects[count-1].controller = controller;
                    }
               }
           } 
        }
        for (i = appmlObjects.length -1; i > -1; i--) {
            if (appmlObjects[i].controller) {
                if (typeof window[appmlObjects[i].controller] == "undefined") {
                    window.alert("The controller " + controller + " does not exist");
                } else {
                    appmlObjects[i].message = "ready";
                    if (window[appmlObjects[i].controller](appmlObjects[i]) == -1) {
                        continue;
                    } else {
                        appmlObjects[i].run();
                    };
                }
            } else {
                appmlObjects[i].run();
            }
        }
    };
    this.appmlInit = function (id) {
        this.getData(1, id);
    };
    this.gotData = function () {
        this.message = "loaded";
        if (this.controller) {
            window[this.controller](this);
        }
        this.displayHTML();
    };
    this.run = function (id) {
        if (this.getData(1, id) === -1) {return -1; }
    };
    this.fnpl = function (nav) {
        this.getData(nav);
    };
    this.getData = function (nav, id) {
        var navigate = nav, fromrec, xmlhttp, xml = "", errmsg = null, i, cc, ext;
        if (id) {this.appmlID = id; }       
        if (navigate === 1) {navigate = "first"; }
        if (!navigate || navigate === "") {navigate = "first"; }
        if (navigate === "first") {fromrec = 1; }
        if (navigate === "next") {fromrec = (this.data.recPos + this.rowsperpage); }
        if (navigate === "previous") {
        	fromrec = (this.data.recPos - this.rowsperpage);
        	if (fromrec < 1) {fromrec = 1; }
        }
        if (navigate === "last") {fromrec = -1; }
        if (navigate === "same") {fromrec = this.data.fromRec; }
        if (this.dataSource) {
            if (this.dataSource.indexOf(".") == -1 && this.dataSource.indexOf("local?") == -1) {errmsg = "The datasource " + this.dataSource + " does not exist"; }
            if (errmsg == null && this.dataSource.indexOf("?model=") > -1) {
		        this.data.records = [];
		        if (this.appmlID === "NULL") {fromrec = 0; }
				this.app = {};
				this.app.displayType = this.displayType.toLowerCase();
				this.app.action = "GET";
				this.app.appmlid = this.appmlID;
				this.app.rowsperpage = this.rowsperpage;
				this.app.totalRecCounter = this.data.totalRecCounter;
				this.app.fromrec = fromrec;
				this.app.filters = {};
				this.app.filters.queryFields = this.queryFields;
				this.app.filters.queryOperators = this.queryOperators;
				this.app.filters.queryValues = this.queryValues;
				this.app.filters.orderBys = this.orderBys;
				this.app.filters.orderByDirections = this.orderByDirections;
				xml = JSON.stringify(this.app);
		        //this.displayMessage("Request to the server:\n" + xml);
	    		if (this.dataSource.substr(0,12) === "local?model=") {
                    ext = ".js"
                    if (this.dataSource.substr(12).indexOf(".") > -1) {ext = ""; }
	                this.appFile = this.dataSource.substr(12) + ext;
	                localStorage(this, this.callBack);
	                return -1;
	            }
                xmlhttp = this.xmlHttp(this.dataSource, xml, "POST", false);
            } else if (errmsg == null) {
                xmlhttp = this.xmlHttp(this.dataSource, "", "GET", false);
            }
	        //this.displayMessage("Answer from the server:\n" + xmlhttp.responseText);
            if (errmsg == null) {
                try {
	    	        this.data = JSON.parse(xmlhttp.responseText);
                } catch (er) {
	                errmsg = xmlhttp.responseText;
                }
                if (xmlhttp.status == 404) {errmsg = "The page cannot be found: " + this.dataSource; }
                if (this.data.error) {errmsg = this.data.error; }
            }
            if (errmsg !== null) {
	        	errmsg = this.translate(errmsg);
	            if (errmsg === "") {errmsg = "Empty response."; }
	            try {
	                this.displayMessage(errmsg);
	            } catch (er) {
	                window.alert(errmsg);
	            }
	            return -1;
	        }
        } else if (this.dataObject) {
	        this.data = window[this.dataObject];
        }
        this.data.dateFormat = (this.data.dateFormat || "dd.mm.yyyy");
        this.rowsperpage = (this.rowsperpage || this.data.rowsperpage); 
        if (this.data.records) {
            this.data.itemNames = [];
            i = -1;
            for (cc in this.data.records[0]) {
                i++
                this.data.itemNames[i] = cc;
            }
        }
        this.gotData();
    };
    this.displayHTML = function () {
        var arr = [], a, l, ll, rowClone, x, j, i, ii, iii, cc, repeat, repeatObj, repeatX = "";
        //if (this.container) {this.container.style.display = ""; }
        if (this.messageDIV) {this.closeMessage(); }
        if (!this.template) {manageTemplate(this); }
        if (!this.template) {return false; }
        if (this.template === null) {
            this.displayMessage("The template does not exist.");
            return false;
        }
        //if (this.data.records && this.data.records.length === 0) {this.container.innerHTML = ""; return false; }
        this.html = this.template.cloneNode(true);
        arr = this.getElementsByAttribute(this.html, "appml-repeat");
        l = arr.length
        for (j = 0; j < l; j++) {
            cc = arr[j].getAttribute("appml-repeat").split(" ");
            if (cc.length == 1) {
                repeat = cc[0];
            } else {
                repeatX = cc[0];
                repeat = cc[2];
            }
            arr[j].removeAttribute("appml-repeat");
            repeatObj = (eval("this.data." + repeat) || eval("this." + repeat));
            if (!repeatObj) {
                this.displayMessage("appml-repeat must be an array.\n\n'" + repeat + "' is not an Array.\n\n");
                return -1;
            }
            if (repeatObj && typeof repeatObj === "object" && repeatObj.length != "undefined") {
                i = 0;
				for (x in repeatObj) {
                    i++
				    rowClone = arr[j].cloneNode(true);
                    rowClone = this.needleInHaystack(rowClone, "element", repeatX, repeatObj[x]);
                    a = rowClone.attributes;
                    for (ii = 0; ii < a.length; ii++) {
                        a[ii].value = this.needleInHaystack(a[ii], "attribute", repeatX, repeatObj[x]).value;
                    }
				    if (i === repeatObj.length) {
				        arr[j].parentNode.replaceChild(rowClone, arr[j]);
				    } else {
				        arr[j].parentNode.insertBefore(rowClone, arr[j]);
				    }
				}
            }
        }
        this.html = this.needleInHaystack(this.html, "element");
        if (this.data.records) {
            for (i = 1; i <= this.data.records.length; i++) {
                for (j = 0; j < 3; j++) {
                    if (j === 0) {a = this.html.getElementsByTagName("select"); }
                    if (j === 1) {a = this.html.getElementsByTagName("input"); }
                    if (j === 2) {a = this.html.getElementsByTagName("textarea"); }
                    l = a.length;
                    for (ii = 0; ii < l; ii++) {
                        ll = this.data.itemNames.length;
                        for (iii = 0; iii < ll; iii++) {
                            if (a[ii].id.toLowerCase() === this.data.itemNames[iii].toLowerCase()) {a[ii].value = this.data.records[i - 1][this.data.itemNames[iii]]; }
                        }
                    }
                }
            }
        }
        this.container.parentNode.replaceChild(this.html, this.container);
        this.container = this.html;
        this.setCommandsClick();
        this.message = "done";
        if (this.controller) {
            window[this.controller](this);
        }
    };
    this.needleInHaystack = function (elmnt, typ, repeatX, x) {
        var rowClone, pos1, haystack, pos2, needle = [], needleToReplace, orPos1, orPos2, i, ii, cc, replaceFast = -1;
        rowClone = elmnt;
	    pos1 = 0;
	    while (pos1 > -1) {
            if (typ == "attribute") {
                haystack = rowClone.value;
            } else {
      	        haystack = rowClone.innerHTML;
            }
	        pos1 = haystack.indexOf("{{", pos1);
	        if (pos1 === -1) {break; }
	        pos2 = haystack.indexOf("}}", pos1 + 1);
	        needleToReplace = haystack.substring(pos1 + 2, pos2);
	        needle = needleToReplace.split("||");
            for (i = 0; i < needle.length; i++) {
                this.display = {};
                needle[i] = appmlTrim(needle[i]);
                this.display.name = needle[i];
	            try {
	                this.display.value = eval("this.data." + needle[i]);
	            } catch (er) {
	                this.display.value = undefined
	            }
	            if (this.display.value == undefined) {
	                try {
	                    this.display.value = eval("this." + needle[i]);
	                } catch (er) {
	                    this.display.value = undefined
	                }
	            }
	            if (this.display.value == undefined) {
	                try {
	                    cc = needle[i].split(".");
	                    if (cc[0] == repeatX) {this.display.value = x[cc[1]]; this.display.name = cc[1]; }
	                } catch (er) {
	                    this.display.value = undefined;
                        this.display.name = needle[i];
	                }
	            }
	            if (this.display.value == undefined) {
	               try {
	                    this.display.value = x[needle[i]];
	                } catch (er) {
	                    this.display.value = undefined;
	                }
	            }
	            if (this.display.value == undefined) {
	                try {
	                    if (needle[i] == repeatX) {this.display.value = x; }
	                } catch (er) {
	                    this.display.value = undefined;
	                }
	            }
                if (this.display.value != undefined && this.controller) {
                    this.message = "display";
                    window[this.controller](this);
                    break;
                }
            }
            if (this.display.value != undefined) {
	            r = "{{" + needleToReplace + "}}";
                if (typ == "attribute") {
		            rowClone.value = rowClone.value.replace(r, this.display.value);
                } else {
    		        if (replaceFast === -1) {replaceFast = checkReplaceInnerHTML(rowClone); }
                        this.replaceHTML(rowClone, r, this.display.value, replaceFast);
                    }
                }
	        pos1 = pos1 + 1;
	    }
        return rowClone;
    };    
    this.replaceHTML = function (a, r, result, replaceFast) {
        var b, bb, l, ll, lll, i, ii, iii, cc, ccOK;
        if (a.hasAttributes()) {
            b = a.attributes;
            l = b.length;
            for (i = 0; i < l; i++) {
                if (b[i].value.indexOf(r) > -1) {b[i].value = b[i].value.replace(r, result); }
            }
        }
        if (replaceFast === 1) {
            a.innerHTML = a.innerHTML.replace(r, result);
        } else {
            b = a.getElementsByTagName("*");
            l = b.length;
            if (l == 0 && a.innerHTML != "") {
                if (a.innerHTML.indexOf(r) > -1) {a.innerHTML = a.innerHTML.replace(r, result); }
            }
            for (iii = 0; iii < l; iii++) {
                if (b[iii].outerHTML.indexOf(r) > -1) {
                    if (b[iii].tagName !== "TBODY" && b[iii].tagName !== "TR") {
                        if (b[iii].innerHTML.indexOf(r) > -1) {b[iii].innerHTML = b[iii].innerHTML.replace(r, result); }
                    } else {
                        if (b[iii].hasAttributes()) {
                            bb = b[iii].attributes;
                            lll = bb.length;
                            for (iiii = 0; iiii < lll; iiii++) {
                                if (bb[iiii].value.indexOf(r) > -1) {bb[iiii].value = bb[iiii].value.replace(r, result); }
                            }
                        }
                    }
                }
            }
            b = a.childNodes;
            l = b.length;
            for (iii = 0; iii < l; iii++) {
                if (b[iii].nodeName !="#text" && b[iii].hasAttributes()) {
                    bb = b[iii].attributes;
                    lll = bb.length;
                    for (iiii = 0; iiii < lll; iiii++) {
                        if (bb[iiii].value.indexOf(r) > -1) {bb[iiii].value = bb[iiii].value.replace(r, result); }
                    }
                }
            }
        }
    };
    this.getElement = function (id, parent) {//Search within a specified element, or the appml container if no parent is defined. Return the element with the specified id:
        var parentObj = (parent || this.container);
        if (!parentObj) {return false; }
        var y = parentObj.getElementsByTagName("*"), l = y.length, i, z = id.toUpperCase();
        for (i = 0; i < l; i++) {
            if (y[i].id.toUpperCase() === z) {return y[i]; }
        }
    };
    this.getElementsByAttribute = function (x, att) {//Search within a specified element, and return all elements with the specified attribute
        var arr = [], arrCount = -1, i, l, y = x.getElementsByTagName("*"), z = att.toUpperCase();
        l = y.length;
        for (i = -1; i < l; i++) {
            if (i == -1) {y[i] = x; }
            if (y[i].getAttribute(z) !== null) {arrCount++; arr[arrCount] = y[i];}
        }
        return arr;
    };
    this.setCommandsClick = function () {
        var cc, i, x, typ, fc, recout, from, to, count, obj = this;
        cc = this.getElement("appmlbtn_query");
        if (cc) {cc.onclick = function () {obj.appmlQuery(); }; }
        cc = this.getElement("appmlbtn_queryOK");
        if (cc) {cc.onclick = function () {obj.makeQuery(); }; }
        cc = this.getElement("appmlbtn_queryClose");
        if (cc) {cc.onclick = function () {obj.getElement("appml_filtercontainer").style.display="none"; }; }
        cc = this.getElement("appmlbtn_new");
        if (cc) {cc.onclick = function () {obj.appmlNew(); }; }
        cc = this.getElement("appmlbtn_save");
        if (cc) {cc.onclick = function () {obj.putRecord("UPDATE"); }; }
        cc = this.getElement("appmlbtn_delete");
        if (cc) {cc.onclick = function () {obj.deleteRecord(); }; }
        cc = this.getElement("appmlbtn_close");
        if (cc) {cc.onclick = function () {obj.closeForm(); }; }
        if (!this.data.records) {return false; }
        fc = this.data.records.length
        from = this.data.fromRec; to = this.data.toRec; count = this.data.totalRecCounter;
        if (this.displayType.toUpperCase() != "LIST" && this.displayType.toUpperCase() != "FORM") {return false; }
        for (i = 1; i <= 4; i++) {
            typ = "";
            if (i === 1) {
                x = "first";
                if (from <= 1 && (to===fc || to===count)) {typ = "disable"; }
            }
            if (i === 2) {
                x = "previous";
                if (from <= 1) {typ = "disable"; }
            }
            if (i === 3) {
                x = "next";
                if (to === count) {typ = "disable"; }
            }
            if (i === 4) {
                x = "last";
                if (((to === count) && ((Number(from) - 1) === (Number(to) - Number(fc)))) || (Number(count) < Number(fc))) {typ = "disable"; }
            }
            if (this.getElement("appmlbtn_" + x) && typ === "disable") {
                this.disableFNPL(x);
            } else {
                this.enableFNPL(x);
            }
        }
        if (to === "0") {from = "0"; }
        recout = from + " - " + to + " " + this.translate("APPML_MESSAGE_OF") + " " + count;
        if (this.maxRecords !== 0) {if (Number(count) >= Number(this.maxRecords)) {recout = recout + "+"; } }
        cc = this.getElement("appmlbtn_text");
        if (cc) {cc.innerHTML = recout; }
    };
    this.disableFNPL = function (nav) {
        if (this.getElement("appmlbtn_" + nav)) {
            addClass(this.getElement("appmlbtn_" + nav), "disabled");
            this.getElement("appmlbtn_" + nav).onclick = function () {return false; };
        }
    };
    this.enableFNPL = function (nav) {
        var obj = this;
        if (this.getElement("appmlbtn_" + nav)) {
            removeClass(this.getElement("appmlbtn_" + nav), "disabled");
            this.getElement("appmlbtn_" + nav).onclick = function () {obj.fnpl(nav); };
        }
    };
    this.translate = function (txt) {
    	var patt;
    	patt = /APPML_ERR_USN_OR_PWD_REQ/g; txt = txt.replace(patt, "Username or password required");
    	patt = /APPML_ERR_ACTION_REQ/g; txt = txt.replace(patt, "Action required");    	
    	patt = /APPML_ERR_MODEL_REQ/g; txt = txt.replace(patt, "Model required");    	
    	patt = /APPML_ERR_MODEL_ERR/g; txt = txt.replace(patt, "Error in Model");
    	patt = /APPML_ERR_NO_LOGIN/g; txt = txt.replace(patt, "You are not logged in");
    	patt = /APPML_ERR_NOT_AUTHORIZED/g; txt = txt.replace(patt, "You are not authorized to perform this action");    	
    	patt = /APPML_ERR_DATASOURCE_REQ/g; txt = txt.replace(patt, "Datasource required");    	
    	patt = /APPML_ERR_KEYFIELD_REQ/g; txt = txt.replace(patt, "Keyfield required");    	
    	patt = /APPML_ERR_MAINTABLE_REQ/g; txt = txt.replace(patt, "Maintable required");    	
    	patt = /APPML_ERR_ILLEGAL_ACTION/g; txt = txt.replace(patt, "Illegal action");    	
    	patt = /APPML_ERR_DATAMODEL/g; txt = txt.replace(patt, "Error in datamodel");    	
    	patt = /APPML_ERR_INPUT_MIN/g; txt = txt.replace(patt, "Minimum value error");    	
    	patt = /APPML_ERR_INPUT_MAX/g; txt = txt.replace(patt, "Maximum value error");    	
    	patt = /APPML_ERR_INPUT_REQ/g; txt = txt.replace(patt, "Required value error");    	
    	patt = /APPML_ERR_ILLEGAL_QUERY/g; txt = txt.replace(patt, "Illegal query error");    	
    	patt = /APPML_ERR_UKNOWN_DB/g; txt = txt.replace(patt, "Unknown database");    	
    	patt = /APPML_ERR_UKNOWN_DB_FIELD/g; txt = txt.replace(patt, "Unknown database field");    	
    	patt = /APPML_ERR_INVALID_KEY/g; txt = txt.replace(patt, "Invalid key");    	
    	patt = /APPML_ERR_ERROR/g; txt = txt.replace(patt, "Error");    	
    	patt = /APPML_MESSAGE_RECORD_UPDATED/g; txt = txt.replace(patt, "Record updated");    	
    	patt = /APPML_MESSAGE_RECORD_ADDED/g; txt = txt.replace(patt, "Record added");
    	patt = /APPML_MESSAGE_RECORD_DELETED/g; txt = txt.replace(patt, "Record deleted");
    	patt = /APPML_MESSAGE_OF/g; txt = txt.replace(patt, "of");    	
    	return txt;
    };
    this.displayMessage = function (txt) {
        var messageDIV = (this.messageDIV || this.getElement("appmlmessage") || "")
        if (messageDIV === "") {

            if (txt === "") {return; }
            window.alert(txt); return;
        }
        if (txt === "") {
            messageDIV.innerHTML = "";
            messageDIV.style.display = "none";
        } else {
            this.getElement("message", messageDIV).innerHTML = txt;
            messageDIV.style.display = "block";
        }
    };
    this.setError = function (n, desc) {
        this.error.number = n;
        this.error.description = desc;
        if (this.controller) {
            this.message = "error";
            if (window[this.controller](this) == -1) {return -1; }
        }
        this.displayMessage(this.error.description);
    };
    this.putRecord = function (param) {
        var xml, i, j, k, l, felmnt, fname, fvalue, apptyp, errmsg = "", http, httpText, action = param;
        if (this.controller) {
            this.message = "submit";
            if (window[this.controller](this) == -1) {return -1; }
        }
        if (action === "UPDATE") {
            if (this.data.records[0][this.data.keyField] === "") {action = "ADD"; }            
        }
		this.app = {};
		this.app.action = action;
		if (action !== "ADD") {
		    this.app.appmlid = this.data.records[0][this.data.keyField];
		}
		this.app.record = {};
		this.app.record.items = [];
		this.app.record.values = [];
		this.app.record.types = [];
        if (action !== "DELETE") {
            l = this.data.updateItems.length;
            for (i = 0; i < l; i++) {
                felmnt = this.getElement(this.data.updateItems[i].item)
                if (felmnt) {
                    fname = felmnt.id;
                    fvalue = felmnt.value;
                    //apptyp = "number";
                    //for (j = 0; j < this.data.itemCounter; j++) {
                    //    if (this.data.itemNames[j].toLowerCase() === fname.toLowerCase()) {apptyp = this.data.itemTypes[j]; }
                    //}
                    //if (apptyp === "date") {fvalue = reformatDate(fvalue, this.data.dateFormat); }
					this.app.record.items.push(fname);
					this.app.record.values.push(fvalue);
					//this.app.record.types.push(apptyp);
                }
            }
        }
  		if (this.dataSource.substr(0,5) === "local") {
            this.appFile = this.dataSource.substr(6);
            localStorage(this);
            return;
        }
		xml = JSON.stringify(this.app);
        //this.displayMessage("UPDATE to the server:\n" + xml);
        http = this.xmlHttp(this.dataSource, xml, "POST");
        //this.displayMessage("Answer from the server:\n" + http.responseText);
        try {
	        this.upd = JSON.parse(http.responseText);
        } catch (er) {
            errmsg = http.responseText;
        }
        if (this.upd && this.upd.error) {errmsg = this.upd.error;}
        if (errmsg != "") {this.displayMessage(errmsg); return -1; }
        httpText = this.translate(this.upd.updatemessage);
        if (action === "ADD") {
		    this.app.appmlid = this.upd.updateID;
		    this.data.records[0][this.data.keyField] = this.upd.updateID;
        }
        this.displayMessage(httpText);
        if (action === "DELETE") {this.clear(); }
        if (this.list) {this.list.data.totalRecCounter = 0; this.list.fnpl("same"); }
    };
    this.deleteRecord = function () {
        var s = confirm("Are you sure you want to delete this record?")
        if (s === false) {return -1; }
        this.putRecord("DELETE");
    };
    this.appmlNew = function () {
		this.run("NULL");
    };
    this.newRecord = function () {
		this.run("NULL");
    };
    this.saveRecord = function () {
        this.putRecord("UPDATE");
    };
    this.clear = function () {
        this.closeMessage();
        this.container.style.display = "none";
    };
    this.closeForm = function () {
        this.clear();
    };
    this.closeMessage = function () {
        this.displayMessage("");
    };
    this.xmlHttp = function (target, xml, method, a, readyfunc) {
        var httpObj, async = a;
        if (async !== true) {async = false; }
        if (method !== "GET" && method !== "POST") {
            window.alert("The httpRequest requires GET or POST");
            return false;
        }
        if (window.XMLHttpRequest) {
            httpObj = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            httpObj = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (httpObj) {
            if (async === true) {
                if (readyfunc) {httpObj.onreadystatechange = readyfunc; }
            }
            httpObj.open(method, target, async);
            httpObj.send(xml);
            if (async === false) {return httpObj; }
        }
    };
    function manageContainers(container, obj) {
        if (container !== undefined) {
            if (typeof container === "object") {
                obj.container = container;
	        } else {
        		obj.container = document.getElementById(container);
	        }
	    }
	    if (obj.container === undefined || obj.container === null) {
	        if (container !== "" && container !== undefined) {
	            window.alert("The container '" + container + "' does not exist.");
		        return -1;
	        } else {
	            return;
	        }
	    }
	}
    function manageTemplate(obj) {
        if (obj.container) {obj.template = obj.container.cloneNode(true); }
	}
    function appmlTrim(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    }
    function addClass(x, addclass) {
        var clsnm = x.className;
        if (clsnm === addclass) {return false; }
        if (clsnm.indexOf(addclass + " ") === 0) {return false; }
        if (clsnm.indexOf(" " + addclass) > -1) {
            if (clsnm.indexOf(addclass) + addclass.length === clsnm.length) {return false; }
            if (clsnm.indexOf(" " + addclass + " ") > -1) {return false; }
        }
        x.className = clsnm + " " + addclass;
    }
    function removeClass(x, removeclass) {
        var clsnm = x.className;
        if (clsnm === removeclass) {
            clsnm = "";
        } else {
            if (clsnm.indexOf(removeclass) === 0) {
                clsnm = clsnm.replace(removeclass + " ", "");
            } else {
                if (clsnm.indexOf(removeclass) + removeclass.length === clsnm.length) {
                    clsnm = clsnm.replace(" " + removeclass, "");
                } else {
                    clsnm = clsnm.replace(" " + removeclass + " ", "");
                }
            }
        }
        x.className = clsnm;
    }
    function reformatDate(txt, dtype) {
        var d, m, y;
        if (txt !== "") {
            d = txt.substr(dtype.indexOf("dd"), 2);
            m = txt.substr(dtype.indexOf("mm"), 2);
            y = txt.substr(dtype.indexOf("yyyy"), 4);
            return y + "/" + m + "/" + d;
        }
        return "";
    }
    function checkReplaceInnerHTML(elmnt) { // checking how the browser replaces the innerHTML, IE has problems replacing the innerHTML of some elements, like TR
        var cc, cc1, cc2, cc3, x = 1;
        try {
            cc = elmnt.cloneNode(true);
            cc1 = cc.innerHTML.length;
            cc3 = cc.innerHTML;
            cc.innerHTML = cc3;
            cc2 = cc.innerHTML.length;
            if (cc1 !== cc2) {x = 0; }
        } catch (er) {
            x = 0;
        }
        return x;
    }
    function isDate(x) {
        return (null !== x) && !isNaN(x) && (x.getDate !== "undefined");
    }
    this.appmlQuery = function () {
        queryElmnt = this.getElement("appml_filtercontainer")
        l = (this.queryFields) ? this.queryFields.length : 0;
        for (i = 0; i < l; i++) {
            qfname = this.queryFields[i];
            qvalue = (this.queryValues[i] || "");
            qoper = (this.queryOperators[i] || "");
            if (this.getElement("appml_query_" + qfname, queryElmnt)) {this.getElement("appml_query_" + qfname, queryElmnt).value = qvalue; }
            if (qoper !== "") {
                if (this.getElement("appml_operator_" + qfname, queryElmnt)) {this.getElement("appml_operator_" + qfname, queryElmnt).value = qoper; }
            }
        }
        if (!this.data.filteritems || this.data.filteritems.length === 0) {this.getElement("appml_filter", queryElmnt).style.display = "none"; }
        l = (this.orderBys) ? this.orderBys.length : 0;
        for (i = 0; i < l; i++) {
            ovalue = (this.orderBys[i] || "");
            odir = (this.orderByDirections[i] || "asc");
            this.getElement("appml_orderselect", queryElmnt).value = ovalue;
            this.getElement("appml_orderdirection_" + odir, queryElmnt).checked = true;
        }
        if (this.getElement("appml_orderby", queryElmnt) && (!this.data.sortitems || this.data.sortitems.length === 0)) {this.getElement("appml_orderby", queryElmnt).style.display = "none"; }
        queryElmnt.style.display="block";
    };
    this.makeQuery = function () {
        var x, xx, l, ll, i, ii, xml = "", fname, fvalue = "", foper = "=", ftype = "", ocount, ofname = [], oflabel = [], odir = [], odirvalue, qcount = -1, fromDate, toDate, dateOK, displayvalue;
        l = this.queryFields.length;
        for (i = 0; i < l; i++) {
            this.queryFields.pop();
        }
        x = this.getElement("appml_filtercontainer").getElementsByTagName("*");
        l = x.length;
        for (i = 0; i < l; i++) {
            if (x[i].id) {
                if (x[i].id.substr(0, 12) === "appml_query_") {
                    fname = x[i].id.substr(12);
                    fvalue = x[i].value;
                    foper = Number(this.getElement("appml_operator_" + fname).value);
                    ftype = this.getElement("appml_datatype_" + fname).value.toLowerCase();
                    if (fvalue.length > 0) {
                        qcount++;
                        this.queryFields[qcount] = fname;
                        this.queryValues[qcount] = [];
                        displayvalue = fvalue;
                        if (ftype === "number") {
                            if (!Number(fvalue)) {
                                window.alert("Illegal Number");
                                fvalue = "2...1";
                            }
                        }
                        if (ftype === "date") {
                            fromDate = "";
                            toDate = "";
                            dateOK = 0;
                            try {
                                if (fvalue.length === 10 || fvalue.length === 9 || fvalue.length === 8) {
                                    fromDate = new Date(reformatDate(fvalue, this.data.dateFormat));
                                    dateOK = 1;
                                }
                                if (fvalue.length === 7 || fvalue.length === 6) {
                                    fromDate = new Date(reformatDate("01/" + fvalue, this.data.dateFormat));
                                    toDate = new Date(fromDate);
                                    toDate.setMonth(fromDate.getMonth() + 1);
                                    toDate.setDate(0);
                                    dateOK = 1;
                                }
                                if (fvalue.length === 4) {
                                    fromDate = new Date(fvalue + "/01/01");
                                    toDate = new Date(fvalue + "/12/31");
                                    dateOK = 1;
                                }
                            } catch (er) {
                                dateOK = 0;
                            }
                            if (dateOK === 1) {
                                dateOK = 0;
                                if (isDate(fromDate)) {dateOK = 1; }
                                if (dateOK === 1 && toDate !== "") {
                                    if (isDate(toDate)) {dateOK = 1; }
                                }
                            }
                            if (dateOK === 0) {
                                window.alert("Illegal Date");
                                fromDate = new Date("2012/01/01");
                                toDate = new Date("2011/12/31");// does not return any result
                            }
                            fvalue = "#" + fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate() + "#";
                            if (toDate !== "") {
                                fvalue = fvalue + "...#" + toDate.getFullYear() + "/" + (toDate.getMonth() + 1) + "/" + toDate.getDate() + "#";
                            }
                        }
                        if (fvalue.indexOf("...") > -1) {
                            this.queryValues[qcount][0] = fvalue.split("...")[0];
                            this.queryOperators[qcount] = 5;
                            qcount++;
                            this.queryFields[qcount] = fname;
                            this.queryValues[qcount] = [];
                            this.queryValues[qcount][0] = fvalue.split("...")[1];
                            this.queryOperators[qcount] = 4;
                        } else {
                            this.queryValues[qcount] = fvalue.split("|");
                            this.queryOperators[qcount] = foper;
                        }
                        this.queryDisplayValues[qcount] = displayvalue;
                        this.queryDisplayOperators[qcount] = foper;
                    }
                }
            }
        }
        x = this.getElement("appml_filtercontainer").getElementsByTagName("*");
        l = x.length;
        ocount = 0;
        for (i = 0; i < l; i++) {
            if (x[i].id && x[i].id === "appml_orderselect") {
                ocount++;
                ofname[ocount] = x[i].value;
                xx = this.getElement("appml_filtercontainer").getElementsByTagName("input");
                ll = xx.length;
                for (ii = 0; ii < ll; ii++) {
                    if (xx[ii].name === "appml_orderdirection") {
                        odirvalue = "asc";
                        if (xx[ii].checked === true) {odirvalue = xx[ii].value; }
                        odir[ocount] = odirvalue;
                    }
                }
            }
        }
        xml = "";
        for (i = 1; i <= ocount; i++) {
            this.orderBys[i-1] = ofname[i];
            this.orderByDirections[i-1] = odir[i];
        }
        this.data.totalRecCounter = 0;
        this.fnpl();
    };
    this.resetQuery = function () {
        var i, l, x = this.getElement("appmlquery").getElementsByTagName("INPUT");
        l = x.length;
        for (i = 0; i < l; i++) {
            if (x[i].id.substr(0, 12) === "appml_query_") {
                if (x[i].getAttribute("reset") !== "no") {x[i].value = ""; }
            }
        }
        x = this.getElement("appmlquery").getElementsByTagName("SELECT");
        l = x.length;
        for (i = 0; i < l; i++) {
            if (x[i].id.substr(0, 12) === "appml_query_") {            
                if (x[i].getAttribute("reset") !== "no") {x[i].value = ""; }
            }
        }
    };
    this.setQuery = function (field, value, type) {
        var l = this.queryFields.length;
        if (!l) {l = -1; }
        l++;
        this.queryFields[l] = field;
        if (!type) {type = "text"; }
        this.queryTypes[l] = "number";
        this.queryValues[l] = [];
        if (typeof value === "object") {
            this.queryValues[l] = value;
        } else {
            this.queryValues[l][0] = value;
        }
        this.queryDisplayValues[l] = value;
        this.queryOperators[l] = 0;
        this.queryDisplayOperators[l] = 0;
        this.data.totalRecCounter = 0;        
    };
    this.clearQuery = function () {
        this.queryFields = [];
        this.queryValues = [];
        this.queryDisplayValues = [];
        this.queryTypes = [];
        this.queryOperators = [];
        this.queryDisplayOperators = [];
        this.data.totalRecCounter = 0;        
    };
    this.adoptQuery = function (adoptObj) {
        this.queryFields = adoptObj.queryFields;
        this.queryValues = adoptObj.queryValues;
        this.queryDisplayValues = adoptObj.queryDisplayValues;
        this.queryTypes = adoptObj.queryTypes;
        this.queryOperators = adoptObj.queryOperators;
        this.queryDisplayOperators = adoptObj.queryDisplayOperators;
        this.orderBys = adoptObj.orderBys;
        this.orderByDirections = adoptObj.orderByDirections;
        this.data.totalRecCounter = 0;        
    };
    this.query = function (field, value, type) {
        this.setQuery(field, value, type);
        this.run();
    };
    this.setOrder = function (field, direction) {
        var dir = "asc";
        if (!direction || direction === "") {
            if (this.orderBys[0] === field) {
                if (this.orderByDirections[0] === "asc") {dir = "desc"; }
            }
        }
        this.orderBys.splice(0, 0, field);
        this.orderByDirections.splice(0, 0, dir);
    };
    this.order = function (field, direction) {
        this.setOrder(field, direction);
        this.fnpl();
    };
    function localStorage(obj, cb) {
        if (!w3schoolsWebSQLOK) {
            obj.displayMessage("Your browser does not support Local Storage Database (WebSQL).");
            return;
        }
        if (obj.app.action === "GET") {
            xmlhttp = obj.xmlHttp(obj.appFile + "?r=" + Math.random(), "", "GET", false);
            obj.data = JSON.parse(xmlhttp.responseText);
        }
        w3schoolsWebSQL1.runSQL(obj, cb);
    }
}
//////////////////////////////////////////////////////
var appmlLocalDatabase;
var w3schoolsWebSQLOK = !!window.openDatabase;
if (w3schoolsWebSQLOK) {w3schoolsWebSQL1 = new w3WebSQLInit(); }
function w3WebSQLInit() {
	var w3DBObj = this;
    var testObj;
	appmlLocalDatabase = window.openDatabase('AppMLDemoDatabase_1', '1.0', 'W3SchoolsDemoDatabase', 2 * 1024 * 1024);
	this.runSQL = function(obj, cb) {
        testObj = obj;
        var keyValue, cc, sql = obj.data.database.sql, paramCount = 0, params = [], names = [], values = [], executesql = [];
        executesql = obj.data.database.execute;
        if (executesql) {
            w3DBObj.w3ExecuteSQL("", obj, cb, "execute", executesql);
        }
        mainTable = (obj.data.database.maintable || "");
        keyField = (obj.data.database.keyfield || "");
        keyValue = (obj.app.appmlid || "");
        if (keyField != "") {
            obj.data.keyField = keyField;
            keyCounter = 1;
            keyType = (obj.data.database.keytype || "");
            if (keyType == "") {keyType = "number"; }
            if (keyValue == "") {keyValue = "NULL"; }
        }
        if (obj.app.action == "DELETE") {
            if (obj.app.record) {
                sql="DELETE FROM " + mainTable;
                sql += " WHERE " + keyField + "='" + keyValue + "';";
                w3DBObj.w3ExecuteSQL(sql, obj, cb);
            }
        } else if (obj.app.action == "ADD") {
            if (obj.app.record) {
                updCount = 0;
                for (i = 0; i < obj.data.updateItems.length; i++) {
                    for (j = 0; j < obj.app.record.items.length; j++) {
                        if (obj.data.updateItems[i].item.toLowerCase() == obj.app.record.items[j].toLowerCase()) {
                            updCount++
                            names[updCount] = obj.data.updateItems[i].item;
                            values[updCount] = obj.app.record.values[j];
                        }
                    }
                }
                if (updCount > 0) {
                    sql="INSERT INTO " + mainTable  + " (";
                    for (i = 1; i <= updCount; i++) {
                        sql += names[i];
                        if (i < updCount) {sql = sql + ","; }
                    }
                    sql += ") VALUES (";
                    for (i = 1; i <= updCount; i++) {
                        sql += "'" + values[i] + "'";
                        if (i < updCount) {sql = sql + ","; }
                    }
                    sql += ");";
                    w3DBObj.w3ExecuteSQL(sql, obj, cb);
                }
            }
        } else if (obj.app.action == "UPDATE") {
            if (obj.app.record) {
                updCount = 0;
                for (i = 0; i < obj.data.updateItems.length; i++) {
                    for (j = 0; j < obj.app.record.items.length; j++) {
                        if (obj.data.updateItems[i].item.toLowerCase() == obj.app.record.items[j].toLowerCase()) {
                            //if (obj.data.updateItems[i].value != obj.app.record.values[j]) {
                                updCount++
                                names[updCount] = obj.data.updateItems[i].item;
                                values[updCount] = obj.app.record.values[j];
                            //}
                        }
                    }
                }
                if (updCount > 0) {
                    sql="UPDATE " + mainTable  + " SET ";
                    for (i = 1; i <= updCount; i++) {
                        sql += names[i] + "='" + values[i] + "'";
                        if (i < updCount) {sql = sql + ","; }
                    }
                    sql += " WHERE " + keyField + "='" + keyValue + "';";
                    w3DBObj.w3ExecuteSQL(sql, obj, cb);
                }
            }
        } else {
            if (sql) {
                if (keyValue != "") {
                    if (keyValue == "NULL") { keyValue = "-1"; }
                    sql = sql + " WHERE " + add_brackets(mainTable) + "." + add_brackets(keyField) + "='" + keyValue + "';";
                } else {
                    cc = appml_GetQueryWhere(obj,paramCount,params);
                    if (cc) {sql = sql + " WHERE "+ cc; }
                    cc = appml_GetOrderby(obj);
                    if (cc) {sql = sql  + cc; }
                }
                w3DBObj.w3ExecuteSQL(sql, obj, cb, "", 0, keyValue);
            }
        }
	};
	this.w3ExecuteSQL = function(sql, obj, cb, exe, exeObj, keyValue) {
		var json = "";
		appmlLocalDatabase.transaction(function (tx) {
            if (exe === "execute") {
                for (var i = 0; i < exeObj.length; i++) {
                    var successFunc = function () {};
                    if (i == exeObj.length-1) {
                        if (cb) {
                            successFunc = cb;
                        }
                    }
                    var runSQL = exeObj[i];
    			    tx.executeSql(exeObj[i],[],successFunc,function (transaction,err) {
                        obj.displayMessage("SQL Error : " + err.message + " SQL: " + runSQL);
                        return true;
			        });
                }
                return;
            }
			tx.executeSql(sql,[],function (tx, results) {
                if (exe === "execute") {
                    if (exeno == 1) {
                        obj.displayMessage("Executing " + exelen + " statements.");
                    }
                    if (exeno == exelen) {
                        obj.displayMessage("Done! Executed " + exelen + " statement(s)");
                    }
                    return;
                }
                if (obj.app.action == "UPDATE" || obj.app.action == "ADD" || obj.app.action == "DELETE") {
                    if (obj.app.action == "UPDATE") {httpText = obj.translate("1 APPML_MESSAGE_RECORD_UPDATED"); }
                    if (obj.app.action == "ADD") {httpText = obj.translate("1 APPML_MESSAGE_RECORD_ADDED"); }
                    if (obj.app.action == "DELETE") {httpText = obj.translate("1 APPML_MESSAGE_RECORD_DELETED"); }
                    if (obj.app.action === "ADD") {
                        kx = results.insertId;
                        obj.app.appmlid = kx;
                        obj.data.records[0][obj.data.keyField] = kx;
                    } 
                    obj.displayMessage(httpText);
                    //if (obj.app.action === "DELETE") {obj.clear(); }
                    if (obj.list) {obj.list.data.totalRecCounter = 0; obj.list.fnpl("same"); }
                    return;
                }
				var len = results.rows.length, toRec, cc, i, j, m, txt, columns = [], DBChanges = 0, recPos, fromRec, totalCounter = len;
                recPos = (obj.app.fromrec || 1);
                fromRec = recPos;
                if (!obj.app.rowsperpage) {
                    obj.app.rowsperpage = (obj.data.rowsperpage || 500);
                }
                obj.rowsperpage = (obj.rowsperpage || obj.app.rowsperpage); 
                toRec=app_setToPosition(obj.app.fromrec,obj.app.rowsperpage);
                if (toRec == 0) {toRec = totalCounter;}
                if (recPos == -1) {
                    fromRec=totalCounter - obj.app.rowsperpage + 1;
                    toRec=totalCounter;
                }
                obj.data.user = 0;
                obj.data.recPos = fromRec;
                obj.data.fromRec = fromRec;
                obj.data.toRec = toRec;
                obj.data.totalRecCounter = totalCounter;
                json += ' [';
				if (len > 0) {
					for (m in results.rows.item(0)) {
					    columns.push(m);
					}
					for (i = 0; i < len; i++) {
                        if ((i+1) >= fromRec && (i+1) <= toRec) {
							for (j = 0; j < columns.length; j++) {
	                            if (j === 0) {json += '{'; }
	                            if (j > 0) {json += ','; }
                                if (keyValue == "-1") {
       	                            json += '"' + columns[j] + '":""';
                                } else {
	                                json += '"' + columns[j] + '":"' + results.rows.item(i)[columns[j]] + '"';
                                }
	                            if (j === (columns.length - 1)) {
	                                json += '}';
	                                if (i < (len -1) && (i+1) < toRec) {json += ','; }
	                            }
                            }
						}
					}
                    json += ']';
                    if (totalCounter < toRec) {obj.data.toRec = totalCounter; }
                    obj.data.records = JSON.parse(json);
                    if (obj.data.records) {
                        obj.data.itemNames = [];
                        i = -1;
                        for (cc in obj.data.records[0]) {
                            i++
                            obj.data.itemNames[i] = cc;
                        }
                    }
                    obj.gotData();
				} else {
                    obj.data.recPos = 0;
                    obj.data.fromRec = 0;
                    obj.data.toRec = 0;
                    obj.data.totalRecCounter = 0;
				    obj.data.records = [];
                    obj.gotData();
				}
			},function (transaction, err) {
                obj.displayMessage("SQL Error : " + err.message + "<br>" + sql);
                return true;
			})
		});
	};

    function app_setToPosition(from,lines) {
        to = from +  lines-1;
        if (lines == 0) {to=lines; }
        return to;
    }

    function appml_GetOrderby(obj) {
        txtOrderby = (obj.data.database.orderby || "");
        txtsortitems = obj.data.sortitems;
        requestFilter = obj.app.filters;
        legalOrderbyField = [];
        legalOrderbyDir = [];
        osfield = [];
        osdir = [];
        legalOrderbyFieldcount = 0;
        orderby = "";
        if (txtsortitems != undefined) {
            l = txtsortitems.length;
            for (i = 0; i < l; i++) {
                legalOrderbyField[i] = txtsortitems[i].item;
                legalOrderbyDir[i] = "asc";
            }
        }
        legalOrderbyFieldcount = legalOrderbyField.length;
        arr = obj.app.filters.orderBys;
        l = arr.length;
        for (i = 0; i < l; i++) {
            osfield[i] = arr[i];
            osdir[i] = obj.app.filters.orderByDirections[i];
        }
        orderselect = "";
        l = osfield.length;
        for (i = 0; i < l; i++) {
            if (osfield[i] != "") {
                orderbyOK = 0;
                for (j = 0; j < legalOrderbyFieldcount; j++) {
                    if (osfield[i] == legalOrderbyField[j]) {
                        orderbyOK = 1;
                        break;
                    }
                }
                if (orderbyOK == 1) {
                    if (orderselect != "") {orderselect += ",";}
                    orderselect += " " + osfield[i] + " " + osdir[i];
                }
            }
        }
        if (orderselect != "" && orderby != "") {
            orderby = orderselect + ", " + orderby;
        } else {
            if (orderselect != "" && orderby == "") {
                orderby = orderselect;
            }
        }
        if (orderby == "") {
          orderby = txtOrderby;
        }
        if (orderby != "") {
            orderby = " ORDER BY " + orderby;
        }
        return orderby;
    }
    function appml_GetQueryWhere(obj,paramCount,params) {
        txtParam = obj.data.database.where;
        filter = obj.data.filteritems;
        requestFilter = obj.app.filters;
        legalQueryField = [];
        legalQueryFieldType = [];
        qvalue = [];
        qvaluecount = 0;
        where = (txtParam || "");
        legalQueryFieldcount = 0;
        txt = filter;
        if (txt != undefined) {
            l = txt.length;
            for (i=0; i<l; i++) {
              legalQueryField[i] = txt[i].item;
              legalQueryFieldType[i] = txt[i].type;
            }
        }
        legalQueryFieldcount = legalQueryField.length;
        arr = requestFilter.queryFields;
        l = arr.length;
        for (j = 0; j < l; j++) {    
            qOK = 1;
            qlabel = "";
            qvaluecount = 0;
            qoper = "";
            qname = arr[j];
            qlabel = "";
            valuearr = requestFilter.queryValues[j];
            ll = valuearr.length;
            for (i = 0; i < ll; i++) {
                qvaluecount++;
                qvalue[i] = valuearr[i];
            }
            qoper = requestFilter.queryOperators[j];
            queryOK = 0;
            for (i = 0; i < legalQueryFieldcount; i++) {
                if (qname.toLowerCase() == legalQueryField[i].toLowerCase()) {
                    qtype = legalQueryFieldType[i];
                    queryOK=1;
                    break;
                }
            }
            if (queryOK == 0) {obj.displayMessage("APPML_ERR_ILLEGAL_QUERY: " + qname); return -1;}
            for (i = 0; i < qvaluecount; i++) {
                if (qvalue[i] == "&nbsp;") {qvalue[i] = " ";}
                if (qlabel == "") {qlabel = qname;}
                if (qoper == "") {qoper = "=";}
                if (qoper == "0") {qoper = "=";}
                if (qoper == "1") {qoper = "<>";}
                if (qoper == "2") {qoper = "<";}
                if (qoper == "3") {qoper = ">";}
                if (qoper == "4") {qoper = "<=";}
                if (qoper == "5") {qoper = ">=";}
                if (qoper == "6") {qoper = "%";}
                if (qoper == "10") {qoper = "==";}
                if (qoper == "11") {qoper = "!=";}
                if (qvalue[i] != "") {
                    if (where == "") {
                        where = " (";
                    } else {
                        if (i == 0) {
                            where += " AND (";
                        } else {
                            if (qoper == "=" || qoper == "==" || qoper == "%") {
                                where += " OR ";
                            } else {
                                where +=" AND ";
                            }
                        }
                    }
                    if (qtype == "number" || qtype == "date") {
                        if (qOK == 1) {
                            xqoper = qoper;
                            if (xqoper == "==") {xqoper="=";}
                            if (xqoper == "!=") {xqoper="<>";}
                            where +="(" + add_brackets(qname) + xqoper + "'" + qvalue[i] + "')";
                        } else {
                            where +=" (" + add_brackets(qname) + ">0 AND " + add_brackets(qname) + "<0)";
                        }
                    } else {
                        if (qvalue[i] == " ") {
                            if (qoper == "=" || qoper == "==") {where += "(" + add_brackets(qname) + "='')";}
                            if (qoper == "<>" || qoper == "!=") {where += "(" + add_brackets(qname) + "<>'')";}
                            if (qoper == "<" || qoper == ">" || qoper == "<=" || qoper == ">=") {
                                where += "(" + add_brackets(qname) + qoper + "'')";
                            }
                            if (qoper == "%") {where += "(" + add_brackets(qname) + " LIKE '% %')";}
                        } else {
                            if (qoper == "=") {
                                where += "(" + add_brackets(qname) + " LIKE '" + qvalue[i] + "%'" + ")";
                            }
                            if (qoper == "==") {
                                where += "(" + add_brackets(qname) + " = '" + qvalue[i] + "'" + ")";
                            }
                            if (qoper == "<" || qoper == ">") {
                                where += "(" + add_brackets(qname) + qoper + "'" + qvalue[i] + "'" + ")";
                            }
                            if (qoper == "<>") {
                                where += "(" + add_brackets(qname) + qoper + "'" + qvalue[i] + "' AND " + add_brackets(qname) + " NOT LIKE '" + qvalue[i] + "%')";
                            }
                            if (qoper == "!=") {
                                where += "(" + add_brackets(qname) + "<> '" + qvalue[i] + "')";
                            }
                            if (qoper == "<=" || qoper == ">=") {
                                where += "(" + add_brackets(qname) + qoper + " '" + qvalue[i] + "' OR " + add_brackets(qname) + " LIKE '" + qvalue[i] + "%')";
                            }
                            if (qoper == "%") {
                                where += "(" + add_brackets(qname) + " LIKE '%" + qvalue[i] + "%')";
                            }
                        }
                    }
                }
                if (i == (qvaluecount-1)) {where +=")";}
            }
        }
        return where;
    }  
    function remove_quotes(ttt) {
        out = "";
        if (ttt == "" || ttt == undefined || ttt == "undefined") {return "";}
        for (i = 1; i <= ttt.length; i++) {
            c = ttt.substr(i-1, 1);
            if (c == "'") {c = "''";}
            out += c;
        }
        return out;
    }
    function add_brackets(txt) {
        return txt;
    }
}