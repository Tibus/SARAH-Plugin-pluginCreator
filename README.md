SARAH-Plugin-PluginCreator
==========================

Plugin de création de phrases/actions depuis un fichier excel sur google docs


## Création du fichier Google Docs

Tout d'abord, il vous faut creer un fichier excel dans google Docs.
(vous pouvez dupliquez celui d'exemple que j'ai fait ici pour plus de simplicité (fichier/créer un copie): 
https://docs.google.com/spreadsheet/ccc?key=0AmgsAcIbiLOtdGhjX1cxWkxEaEtXMVctNjBJY043ZkE&usp=drive_web#gid=0
)

## Sauvegarde du fichiers

Après chaques modifications, avant de vouloir mettre à jour le plugin Sarah, il va falloir "publier le fichier sur le web". (Pas d'inquiétude, c'est juste pour que le plugin puisse le téléchargé mais il ne se retrouvera pas en publique sur le net ;D).

 Fichier/Publier sur le Web
Si c'est la première fois, cliquez sur le bouton "**Démarrer la publication**"
Puis, à chaques modifications (même si la checkbox "Republier automatiquement après chaque modification" est cochée (Merci google, ça marche pas vos truc ;D), il faudra cliquer sur le bouton **Republier maintenant**.

## Paramètrage du plugin
Dans google docs, dans le panneau Fichier/Publier sur le Web, il va falloir récupérer l'url de publication au format "text brut". Pour cela, dans la partie basse du panneau, changer le mode d'export de "page Web" à "***TXT (texte brut)***".
Ensuite, vous pouvez copier l'url du dessous et aller le mettre dans les paramètre du plugin Sarah dans la variable ***google Doc***

## Edition du Document

#### Creer des phrases
Comment expliquer cela???
Chaque case corresponds à un bout de phrase.
Chaque case peut contenir plusieur possibilité séparé par un point-virgule ayant la même fonctionnalité.
par exemple : 
 Allume les lumières; Allume la lampe; Allume la lumière

Chaque colonne représente un groupe/sous-groupe de phrase.
La première colone sera les possibilités après le mots "Sarah"
 Sarah allume la lampe

La deuxième colonne représente les possibilités de bouts de phrase après le premier groupe.
 Sarah allume la lampe du salon

La troisieme colonne représente les possibilités de bouts de phrase après le deuxieme groupe
 Sarah allume la lampe du salon à 0 pourcent

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
 Allume la lampe du salon à 0 pourcent
 Allume la lampe du salon à 10 pourcent
 Allume la lampe de la chambre
 Allume la lumière du salon à 0 pourcent
 Allume la lumière du salon à 10 pourcent
 Allume la lumière de la chambre
 
Si vous voulez qu'un sous-group soit facultatif, il suffit que le premier enfant de ce sous-group sois "--"
 
 

#### Gestion des variables
Vous pouvez utiliser des variables dans les actions et/ou dans les Callback.
