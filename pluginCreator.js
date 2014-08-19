var DEBUG = false;
var fs, request, XML;
var exec = require('child_process').exec;

fs = require('fs');
request = require('request');

var variables = {};
var questions = [];

var SarahAPI;
try
{
	variables = require('./save/variables');
	questions = require('./save/questions');
	console.log("pluginCreator a trouvé les fichiers de save");
}catch(e)
{
	console.log("pluginCreator n'a pas trouver les fichiers de save");
}

exports.action = function(data, callback, config, SARAH)
{	
	SarahAPI = SARAH;
	config = config.modules.pluginCreator;
	if(data.command == "update")
	{	
		loadGoogleDocs(config.googleDoc, callback);
	}
	else
	{
		doAction(data.command, callback)
	}
}

function loadGoogleDocs(sSource, callback)
{
	log(sSource);
	request({ 'uri' : sSource }, function (err, response, body)
	{
		if (err || response.statusCode != 200)
		{
			if(callback)
				return callback({"tts":"Erreur durant le chargement du fichier gougueul"});
			else
				return console.log("PluginCreator : Erreur durant le chargement du fichier google");
		}

		parseCSV(body);
		createXML();

		if(callback)
				return callback({"tts":"mis à jour depuis gougueul"});//Le XML et les actions ont été mis à jours depuis le fichier 
			else
				return console.log("PluginCreator : Le XML et les actions ont été mis à jours depuis le fichier gougueul");
	});
}

function parseAction(action)
{
	var actionIds = action.split("_");
	action = "";
	callback = "";
	var actionVariables = "";
	var node;
	var vars = {};
	{
		if(actionIds.length>1)
		{
			node = questions.child[actionIds[1]];
			if(node.action != "") action = node.action;
			if(node.callback != "") callback = node.callback;
			actionVariables+=";"+node.variables;
		}
		if(actionIds.length>2)
		{
			node = questions.child[actionIds[1]].child[actionIds[2]];
			if(node.action != "") action = node.action;
			if(node.callback != "") callback = node.callback;
			actionVariables+=";"+node.variables;
		}
		if(actionIds.length>3)
		{
			node = questions.child[actionIds[1]].child[actionIds[2]].child[actionIds[3]];
			if(node.action != "") action = node.action;
			if(node.callback != "") callback = node.callback;
			actionVariables+=";"+node.variables;
		}
		if(actionIds.length>4)
		{
			node = questions.child[actionIds[1]].child[actionIds[2]].child[actionIds[3]].child[actionIds[4]];
			if(node.action != "") action = node.action;
			if(node.callback != "") callback = node.callback;
			actionVariables+=";"+node.variables;
		}
		if(actionIds.length>5)
		{
			node = questions.child[actionIds[1]].child[actionIds[2]].child[actionIds[3]].child[actionIds[4]].child[actionIds[5]];
			if(node.action != "") action = node.action;
			if(node.callback != "") callback = node.callback;
			actionVariables+=";"+node.variables;
		}
		if(actionIds.length>6)
		{
			node = questions.child[actionIds[1]].child[actionIds[2]].child[actionIds[3]].child[actionIds[4]].child[actionIds[5]].child[actionIds[6]];
			if(node.action != "") action = node.action;
			if(node.callback != "") callback = node.callback;
			actionVariables+=";"+node.variables;
		}
		
		var values;
		actionVariables = actionVariables.split(";");
		for(var i=0; i<actionVariables.length;i++)
		{
			values = actionVariables[i].split("=");
			if(values.length == 2)
				vars[values[0].split(" ").join("")] = values[1];
		}
		
		for(var i in variables)
		{
			action = action.split(i).join(variables[i]);
			callback = callback.split(i).join(variables[i]);	
		}
		
		for(var i in vars)
		{
			action = action.split(i).join(vars[i]);
			callback = callback.split(i).join(vars[i]);
		}
	}

	return {action:action, callback:callback};
}

function executeAction(action, callback)
{
	//console.log("action", action);
	action.action = action.action.split(":");
	var actionKey = action.action.shift().split(" ").join("");
	var actionValue = action.action.join(":");
	var actionCallback = action.callback;
	if(actionCallback.indexOf(";")>-1)
	{
		actionCallback = actionCallback.split(";");
		actionCallback = actionCallback[Math.ceil(Math.random() * actionCallback.length) -1];
	}else if(actionCallback.indexOf("|")>-1)
	{
		actionCallback = actionCallback.split("|");
		actionCallback = actionCallback[Math.ceil(Math.random() * actionCallback.length) -1];
	}
	
	log("callback : "+actionCallback);
	
	switch(actionKey)
	{
		case "" :
		case " " :
		{
			return callback({"tts":actionCallback});
		}
		case "exec" :
		case "script" :
		{
			console.log("run : "+actionValue);
			exec(actionValue, function (error, stdout, stderr) {
				if (error !== null)
				{
					console.log(error);
					return callback({"tts":"j'ai rencontré une erreur en lancant le script"});
				}
				return callback({"tts":actionCallback});
			});
			//return callback({"tts":actionCallback});
			break
		}
		case "url" :
		case "http" :
		case "request" :
		{
			log("request URL : "+actionValue);
			request({ 'uri' : actionValue }, function (err, response, body)
			{
				if (err || response.statusCode != 200)
				{
					console.log(err+" ,"+response.statusCode);
					return callback({"tts":"L'action n'as pas pu être exécutée..."});
				}
				
				return callback({"tts":actionCallback});
			});
			break;
		}
		case "plugin" :
		case "plugins" :
		{
			var plugins = actionValue.split(":");
			var pluginName = plugins.shift();
			pluginName = pluginName.split(" ").join("");
			var pluginValue = plugins.join(":");
			log(pluginName +" : "+pluginValue);
			SarahAPI.run(pluginName, JSON.parse(pluginValue));
			
			return callback({"tts":actionCallback});
			break;
		}
		case "askme" :
		case "Askme" :
		case "AskMe" :
		{
			actionValue = actionValue.split(":");
			var questions = actionValue.shift().split(';');
			actionValue = actionValue.join(":");
			
			actionValue = actionValue.split("(");
			actionValue.shift();
			actionValue = actionValue.join("(");
			actionValue = actionValue.split(")");
			var responses = actionValue.shift().split(";");
			actionValue = actionValue.join(")");
			
			actionValue = actionValue.split("(");
			actionValue.shift();
			actionValue = actionValue.join("(");
			actionValue = actionValue.split(")");
			var actions = actionValue.shift().split(";");
			actionValue = actionValue.join(")");

			actionValue = actionValue.split("(");
			actionValue.shift();
			actionValue = actionValue.join("(");
			actionValue = actionValue.split(")");
			var callbacks = actionValue.shift().split(";");
			actionValue = actionValue.join(")");

			log("ask : " + questions);
			log("responses : " + responses);
			log("actions : " + actions);
			log("callbacks : " + callbacks);

			var responsesString = {};
			for (var i = 0; i < responses.length; i++)
			{
				responsesString[responses[i]] = i;
			};
					
			SarahAPI.askme(questions, responsesString, 10000, function(answer, end)
			{
				if(answer == false) //si la réponse est false, réponse envoyé à la fin du timeout
					answer = 0; // on mets la valeur 0 à la place
				answer = parseInt(answer);
				if(actions.length>answer) //si on a bien assez d'action pour trouver celle qui correspond à la réponds
				{	
					executeAction({action:actions[answer], callback:callbacks[answer]}, callback);
					SarahAPI.speak(callbacks[answer], function(){
						end(); // MUST be called when job done
					});	
				}else
				{
					end();
				}
			});
			callback();
			
			break;
		}
	}
}

function doAction(action, callback)
{
	executeAction(parseAction(action), callback);
}

function createXML()
{
	fs.readFile(__dirname+"/pluginCreator.xml", 'utf8', function(err,data){
	    if(err) {
	        console.log("Could not open file"+ err);
	        return;
	    }
	    
	    XML = '';
	    groupToXML(questions, "0", 2)

	    data = data.split("<!-- XMLGenerator -->");
	    data[1] = "\n"+XML+"\n";
	    data = data.join("<!-- XMLGenerator -->");

	    var resultSaveQuestion = fs.writeFile(__dirname+"/pluginCreator.xml", data, function(oError) {
	        if ((oError != null ? oError.code : void 0) === 'ENOENT') {
	          return console.log("error: " + "The target folder doesn't exists or is not writeable !");
	        } else if (oError != null) {
	          return console.log("error: " +"Unknow error while writing file : ./pluginCreator.xml");
	        } else {
	          return console.log("success: ./pluginCreator.xml generated.");
	        }
	    });
	});
}

function groupToXML(group, actionID, indentation)
{
	if(group.name == "--")
		return;

	var i, element;
	var indent = '\n	';
	var asAction = false;
	for(i = 0; i<indentation; i++)
	{
		indent += "\t";
	}
	
	XML += indent+'<item>';
	indentation++;
	
	if(group.name != "")
	{
		if(group.variables != "" || group.action != "" || group.callback != "")
			asAction = true;
		
		if(group.child.length>0)
			XML += indent+'\t<item>';
		else
			XML += indent+'\t';
		
		if(group.name.length == 1)
		{
			XML += group.name;
		}

		if(asAction)
			XML += '<tag>out.action.command="'+actionID+'"</tag>';
		
		if(group.name.length > 1)
		{
			XML += indent+'\t\t<one-of>';
			for (var i = 0; i < group.name.length; i++)
			{
				XML += indent+'\t\t\t<item>'+group.name[i]+'</item>';
			}
			XML += indent+'\t\t</one-of>';
			XML += indent+'\t';
		}

		if(group.child.length>0)
			XML += '</item>';
	}
	
	if(group.child.length>0 && group.child[0].name[0] != "--")
	{
		XML += indent+'\t<one-of>';
	}
	else if(group.child.length>0  && group.child[0].name[0] == "--")
	{
		XML += indent+'\t<item repeat="0-1">';
		indentation++;
		XML += indent+'\t\t<one-of>';
	}
	
	indentation++;
	for(i = 0; i < group.child.length; i++)
	{
		element = group.child[i];
		groupToXML(element, actionID+"_"+i, indentation);
	}
	indentation--;
	
	if(group.child.length>0 && group.child[0].name[0] != "--")
	{
		XML += indent+'\t</one-of>';
	}
	else if(group.child.length>0 && group.child[0].name[0] == "--")
	{
		indentation--;
		XML += indent+'\t\t</one-of>';
		XML += indent+'\t</item>';
	}
	
	XML += indent+'</item>';
}

function saveVariables()
{
	var resultSaveQuestion = fs.writeFile(__dirname+"/save/variables.json", JSON.stringify(variables, null, 4), function(oError) {
        if ((oError != null ? oError.code : void 0) === 'ENOENT') {
          return console.log("error: " + "The target folder doesn't exists or is not writeable !");
        } else if (oError != null) {
          return console.log("error: " +"Unknow error while writing file : ./save/variables.json");
        } else {
          return console.log("success: ./save/variables.json generated.");
        }
    });
}

function saveQuestions()
{
	var resultSaveQuestion = fs.writeFile(__dirname+"/save/questions.json", JSON.stringify(questions, null, 4), function(oError) {
        if ((oError != null ? oError.code : void 0) === 'ENOENT') {
          return console.log("error: " + "The target folder doesn't exists or is not writeable !");
        } else if (oError != null) {
          return console.log("error: " +"Unknow error while writing file : ./save/questions.json");
        } else {
          return console.log("success: ./save/questions.json generated.");
        }
    });
}

function parseCSV(sRawCSVData)
{
	var aParsedData, ligne, group, groupVariables,groupAction, currentGroup0, currentGroup1, currentGroup2, currentGroup3,currentGroup4,currentGroup5, variablesMode = false, questionsMode = false;
	aParsedData = sRawCSVData.split("\n");
	questions = {name:"", variables:"", action:"", callback:"", child:[]};
	for(var i = 0; i< aParsedData.length; i++)
	{
		ligne = aParsedData[i].split("\t");
		if(ligne[0] == "Variables" || ligne[0] == "Variable")
		{
			variablesMode = true;
			continue;
		}else if(ligne[0] == "Questions" || ligne[0] == "Question" || ligne[0] == "Group")
		{
			variablesMode = false;
			questionsMode = true;
			continue;
		}
		
		if(variablesMode)
		{
			variables[ligne[0]] = ligne[1];
		}
		else if(questionsMode)
		{
			if(ligne[0]=="Group")
				continue;
			if(ligne[0]!="")
			{
				group = questions.child;
				currentGroup0 = group.length;
				groupVariables = ligne[7];
				groupAction = ligne[6];
				if(ligne[1]!="" && ligne[1]!="--")
					groupVariables = groupAction = "";
				group.push({name:ligne[0].split(";"), variables: groupVariables, action:groupAction, callback:ligne[8], child:[]});
			}
			if(ligne[1]!="")
			{
				group = questions.child[currentGroup0].child;
				currentGroup1 = group.length;
				groupVariables = ligne[7];
				groupAction = ligne[6];
				if(ligne[2]!="" && ligne[2]!="--")
					groupVariables = groupAction = "";
				group.push({name:ligne[1].split(";"), variables: groupVariables, action:groupAction, callback:ligne[8],child:[]});
			}
			if(ligne[2]!="")
			{
				group = questions.child[currentGroup0].child[currentGroup1].child;
				currentGroup2 = group.length;
				groupVariables = ligne[7];
				groupAction = ligne[6];
				if(ligne[3]!="" && ligne[3]!="--")
					groupVariables = groupAction = "";
				group.push({name:ligne[2].split(";"), variables: groupVariables, action:groupAction, callback:ligne[8],child:[]});
			}
			if(ligne[3]!="")
			{
				group = questions.child[currentGroup0].child[currentGroup1].child[currentGroup2].child;
				currentGroup3 = group.length;
				groupVariables = ligne[7];
				groupAction = ligne[6];
				if(ligne[4]!="" && ligne[4]!="--")
					groupVariables = groupAction = "";
				group.push({name:ligne[3].split(";"), variables: groupVariables, action:groupAction, callback:ligne[8],child:[]});
			}
			if(ligne[4]!="")
			{
				group = questions.child[currentGroup0].child[currentGroup1].child[currentGroup2].child[currentGroup3].child;
				currentGroup4 = group.length;
				groupVariables = ligne[7];
				groupAction = ligne[6];
				if(ligne[5]!="" && ligne[5]!="--")
					groupVariables = groupAction = "";
				group.push({name:ligne[4].split(";"), variables: groupVariables, action:groupAction, callback:ligne[8],child:[]});
			}
			if(ligne[5]!="")
			{
				group = questions.child[currentGroup0].child[currentGroup1].child[currentGroup2].child[currentGroup3].child[currentGroup4].child;
				currentGroup5 = group.length;
				groupVariables = ligne[7];
				groupAction = ligne[6];
				group.push({name:ligne[5].split(";"), variables: groupVariables, action:groupAction, callback:ligne[8],child:[]});
			}
		}
	}
	
	saveVariables();
	saveQuestions();
	
	//console.log(JSON.stringify(questions, null, 4));
}

function log(value)
{
	if(DEBUG)
		console.log(value);
}
