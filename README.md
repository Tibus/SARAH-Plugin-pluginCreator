SARAH-Plugin-PluginCreator
==========================

Plugin de création de phrases/actions depuis un fichier excel en local ou sur google docs

## Création du fichier local
Il n'y a rien à faire a part ouvrir le fichier Document.txt dans excel (sisi, promis ;D)

Quand vous modifier le document, faites-bien attention de ne pas avoir de retour à la ligne à l'intérieur des cases!
Il faut ensuite indiquer à SARAH de récupérer les modifications en lui disant `SARAH mets à jour le créateur de plugin`.

## Création du fichier Google Docs

Tout d'abord, il vous faut creer un fichier excel dans google Docs.
(vous pouvez dupliquez celui d'exemple que j'ai fait ici pour plus de simplicité (fichier/créer un copie): 
https://docs.google.com/spreadsheet/ccc?key=0AmgsAcIbiLOtdGhjX1cxWkxEaEtXMVctNjBJY043ZkE&usp=drive_web#gid=0
)

### Sauvegarde du fichiers

Après chaques modifications, avant de vouloir mettre à jour le plugin Sarah, il va falloir "publier le fichier sur le web". (Pas d'inquiétude, c'est juste pour que le plugin puisse le téléchargé mais il ne se retrouvera pas en publique sur le net ;D).

 Fichier/Publier sur le Web
Si c'est la première fois, cliquez sur le bouton "**Démarrer la publication**"
Puis, à chaques modifications (même si la checkbox "Republier automatiquement après chaque modification" est cochée (Merci google, ça marche pas vos truc ;D), il faudra cliquer sur le bouton **Republier maintenant**.

Il faut ensuite indiquer à SARAH de récupérer les modifications en lui disant `SARAH mets à jour le créateur de plugin`.

### Paramètrage du plugin
Dans google docs, dans le panneau Fichier/Publier sur le Web, il va falloir récupérer l'url de publication au format "tsv". Pour cela, quelques petites manipulations sont nécessaires : 
- Dans ce même panneau ""publier sur le Web"" récupérez l'adresse de publication qui devrai ressembler à : 
https://docs.google.com/spreadsheets/d/**XXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX**/pubhtml
- Comme vous l'aurez compris, les **XXX** donne l'id du document. Récupérez la et insérez la dans l'url suivante : 
https://docs.google.com/spreadsheet/pub?key=**XXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX**&output=tsv
- Ensuite, vous pouvez copier l'url et aller le mettre dans les paramètre du plugin Sarah dans la variable ***google Doc***

## Edition du Document

### Creer des phrases
Comment expliquer cela???
Chaque case corresponds à un bout de phrase.
Chaque case peut contenir plusieur possibilité séparé par un point-virgule ayant la même fonctionnalité.
par exemple : 
``` Allume les lumières; Allume la lampe; Allume la lumière ```

Chaque colonne représente un groupe/sous-groupe de phrase.
La première colone sera les possibilités après le mots "Sarah"
``` Sarah allume la lampe ```

La deuxième colonne représente les possibilités de bouts de phrase après le premier groupe.
``` Sarah allume la lampe du salon```

La troisieme colonne représente les possibilités de bouts de phrase après le deuxieme groupe
``` Sarah allume la lampe du salon à 0 pourcent```

Il y a 5 sous-groupe possible.

Pour créer les phrases d'allumage de lampe, on fera donc : 

| Group         | SubGroup      | SubGroup  |
| ------------- |:-------------:| -----:|
| Allume la lampe; Allume la lumière      |  |  |
| | du salon |  |
| |  | à 0 pourcent  |
| |  | à 10 pourcent  |
| | de la chambre |  |

Les phrases possibles seront donc : 

 - Allume la lampe du salon à 0 pourcent
 - Allume la lampe du salon à 10 pourcent
 - Allume la lampe de la chambre
 - Allume la lumière du salon à 0 pourcent
 - Allume la lumière du salon à 10 pourcent
 - Allume la lumière de la chambre
 
Si vous voulez qu'un sous-group soit facultatif, il suffit que le premier enfant de ce sous-group sois "--" :

| Group         | SubGroup      | SubGroup  |
| ------------- |:-------------:| -----:|
| Allume la lampe |  |  |
| | du salon | -- |
| |  | à 0 pourcent  |
| |  | à 10 pourcent  |
| | de la chambre |  |

Vous pourrez alors dire 

 - Allume la lampe du salon


### Gestion des actions
Chaque ligne/group/sous group peut avoir une action
 * Envoi d'une requete HTTP/HTTPS,...
 * Appel d'un autre plugin Sarah
 * Appel de la fonction askme pour demander confirmation ou précision et appeler une action en fonction de la réponse.
 * Appel d'un script ou d'un programme externe
 
Une colonne ***Action*** permet de spécifier l'action propre à un groupe ou à une seul proposition :

#### Creer une action de requète HTTP
Entrez dans la colonne d'action le mot clé ```url : ``` suivi de l'url. par exemple :
```
url : http://localhost:8888/?tts=bonjour je m'appelle Sarah
```

#### Appeler un autre plugin Sarah
Entrez dans la colonne d'action le mot clé ```plugin : ``` suivi du nom du plugin, de ``` : ``` et d'un json avec les paramêtre à donner au plugin, par exemple : 
```
plugin : eedomus : {"periphId": 10, "periphValue":100, "quiet":true}
```

#### Appeler la fonction askme
On ne présente plus la fonction ***askme*** de SARAH qui permet de demander une confirmation plusieurs possibilités
Pour l'utilisé comme action, c'est un peu plus compliqué mair rien d'impossible : 
Dans la colonne d'action, ajouter le mot clé ```askme : ```
Suivi de la phrase à demander (par exemple : ```êtes-vous sur de vouloir éteindre toutes les lumières```) suivi de deux point ```: ```
ensuite, entre paranthèse séparé par des points-virgules, les différentes possibilité puis deux point : ```(non;oui) : ```
ensuite, entre paranthèse séparé par des points-virgules, les différentes actions a effectuer en fonction de la réponse (actions cités si dessus). (pour qu'il n'y ai pas d'action, il faut quand même mettre un espace. 

par exemple, si on veux qu'un oui ne fasse rien mais qu'un non lance une action, on écrira : 
```( ; plugin : eedomus : {"periphId": $$id, "periphValue":100, "quiet":true}) :```

ensuite, entre paranthèse séparé par des points-virgules, les différents callback : ```(ok; j'ai lancé le plugin eedomus)```

Cela parait un peu barbare comme ça, mais c'est en fait assez simple. pour demander un confirmation à l'extinction des lampe (deux possibilité : oui/non) il suffit d'écrire : 
```
askme : 
êtes-vous sur de vouloir éteindre toutes les lumières : 
(non;oui) : 
( ; plugin : eedomus : {"periphId": $$id, "periphValue":100, "quiet":true}) :
(ok, dommage; plugin eedomus appelé)
```

***Au timeout de la fonction askme, si aucune réponse n'est donné par l'utilisateur, c'est la première action qui sera appelée***

#### Appeler un script ou un programme externe
Entrez dans la colonne d'action le mot clé ```exec : ``` suivi du chemin complet de lancement du script ou du .exe. Certain chemins ne fonctionnent pas. (notament, peut-être les .exe dans C: mais cela reste à confirmer et je ne sais pas pourquoi... ;D)
par exemple pour lancer un curl externe on fera : 

```
exec : C:\Users\julien.delnatte\Documents\curl.exe http://localhost:8888/?tts=coucou
```

### Gestion des variables
Vous pouvez utiliser des variables dans les actions et/ou dans les Callback.
A chaque envoi d'une action ou d'un callback, le plugin cherchera chaque variable et la remplacera par sa valeur.
par exemple, si on définit la variable ```id```à 0 et qu'on a une action ```plugin:eedomus:{"periphId":id}```, l'action deviendra ```plugin:eedomus:{"periphId":0}``` avant d'être traitée.

Il existe des variables globales et des variables locale.

#### définition d'une variable global
Le début du fichier doit toujours commencer par une ligne dont la première case est ***Variables***
Ensuite, chaque case de la première colone sera une variable globale et la deuxieme colone sa valeur
par exemple : 

| Variables | |
| --- | --- |
| $$domoticzURL | http://192.168.1.100:8080/ |
| @lid | 102 |

Et pour l'utiliser dans une requète par exemple : ```url : $$domoticzURL/?id=@lid``` sera remplacé par ```url : http://192.168.1.100:8080/?id=102```

#### définition d'une variable local
Le même principe que les variables global mais par ligne. Une colonne Variable est destiné à la création de variable par ligne. les varaibles doivent être des clé/valeurs séparé par un egal. Vous pouvez définir plusieur variable avec un point-virgule. par exemple ```lid=1; level=100```

### Gestion des callbacks
Comme les variables local, une colonne sert au callback exprimé par le client Sarah à l'appel de la ligne. On peut définir plusieurs réponses possible. Le plugin choisira aléatoirement parmis les différentes possibilités. Pour cela, vous pouvez séparé les possibilités par des point-virgules ou par des pipes (|). (le mieu étant les | qui marchent aussi dans les callback de Askme,...

Par exemple, dans ce tableau : 

| Group         | SubGroup      | SubGroup  | CallBack |
| ------------- |:-------------:|:---------:|:--------:|
| Allume la lampe |  |  | |
| | du salon | -- | lampe du salon allumée; Je l'ai fait; D'accord, c'est fait; Comme tu voudras... |
| |  | à 0 pourcent  | lampe allumée à 0 pourcent |
| |  | à 10 pourcent  | lampe allumée à 0 pourcent |
| | de la chambre |  | lampe de la chambre allumée |

si je dis Allume la lampe de la chambre, Sarah dira "lampe de la chambre allumée" ou "Je l'ai Fait" ou "D'accord, c'est fait" ou encore "Comme tu voudras..."

### Hierarchie des actions, des variables et des callbacks
Les actions, les variables et les callbacks ont une hiérarchie simple...

Tableau d'exemple : 

| Group           | SubGroup      | SubGroup       | Action   | Variable | Callback        |
| --------------- |:-------------:|:--------------:|:--------:|:--------:|:---------------:|
| Allume la lampe |               |                | Action 1 |id=0; g=1 | Lampe allumée   |
|                 | du salon      | --             | Action 2 |id=1      | Lampe du salon allumée   |
|                 |               | à 0 pourcent   |          |          | Lampe du salon allumée à 0 pourcent  |
|                 |               | à 10 pourcent  | Action 3 |id=3      |    |
|                 | de la chambre |                |          |          |    |


 - Si aucunes action n'est définie pour une ligne, c'est l'action du groupe parents qui sera appelé.
 - Si aucuns callback n'est défini pour une ligne, c'est le callback du parents qui sera dis
 - toutes les variables des groupes parents sont utilisé et son écrasé par les enfant.
 
mise en cituation :

```Allume la lampe```
 - rien n'est fait car le premier sous-groupe est obligatoire

```Allume la lampe du salon```
 - variable : id=1; g=1 (écrase id=0 récupère g=1 depuis sont parent)
 - Action : Action 2
 - Callback : Lampe du salon allumée

```Allume la lampe du salon à 0 pourcent```
 - variable : id=1; g=1 (récupère id=1 de son parent, écrase id=0 récupère g=1 depuis sont grand parent)
 - Action : Action 2
 - Callback : Lampe du salon allumée à 0 pourcent

```Allume la lampe du salon à 10 pourcent```
 - variable : id=3; g=1 (écrase id=1 et id=0 récupère g=1 depuis sont grand parent)
 - Action : Action 3
 - Callback : Lampe du salon allumée (récupéré depuis son parent direct)
 
```Allume de la chambre```
 - variable : id=0; g=1 (récupéré par son parent)
 - Action : Action 1 (récupéré par son parent)
 - Callback : Lampe allumée  (récupéré par son parent)
