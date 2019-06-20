# TbDropfileLib

Le projet est composée de 3 applications :

- **tb-tsb-lib** : la librairie
- **tb-tsb-lib-app** : l'application qui fait tourner la librairie (test)
- **tb-tsb-lib-app-e2e** : les tests e2e (généré automatiquement par Angular)


Voir le fichier [**angular.json**](https://github.com/steph-del/tb-dropfile-lib/blob/master/angular.json) à la racine du projet.

## Installation de la librairie

- `yarn add https://github.com/steph-del/tb-dropfile-lib/releases/download/v0.0.1/tb-dropfile-lib-0.0.1.tgz` (voir la dernière version)
- ou `npm install https://github.com/steph-del/tb-dropfile-lib/releases/download/v0.0.1/tb-dropfile-lib-0.0.1.tgz`
- Dasn l'appli principale, vérifier les versions des dépendances (peer dependencies) de la librairie (angular/common, /core, /material, /cdk et rxjs)
- Importer un thème angular material dans le fichier css de l'application principale
- Ajouter les icones Material dans l'index.html de l'application principale :
`<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`

Importer `TbDropfileLibModule` dans `app.module.ts` :`import { TbDropfileLibModule } from 'tb-dropfile-lib'`

## Utilisation du composant `<tb-dropfile-box>`

Exemple d'utilisation :
[**Application test**](https://github.com/steph-del/tb-dropfile-lib/tree/master/src/app)

Le composant gère l'upload de fichiers en général mais une distinction est faire entre les images et les autres types de fichiers.

Les images sont déterminées comme telles en fonction du type décrit dans le blob du fichiers (il doit contenir 'image').

Les autres types de fichiers sont déterminés à partir de leur type MIME, sauf pour les fichiers GPX et SHP pour lesquels, si le type MIME ne correspond pas, l'extension suffit.

Ci-dessous et dans le code, les fichiers non images sont désignés comme 'file' et les images comme 'imageFile'.


### Paramètres en entrée @Input

| Paramètre                 | Requis | Type     | Valeurs | Valeur par défaut | Description |
| ---                       | ---    | ---      | ---     | ---               | ---         |
| label                     |        | string   |         | "Glissez vos fichiers ici" | description de la dropbox dans son état inital |
| labelHelp                 |        | string   |         | ""                | aide de la dropbox dans son état initial (apparait en italique) |
| labelFullWindow           |        | string   |         | "Glissez vos fichiers ici" | description de la dropbox en mode plein écran |
| maxFileSize               | oui    | number   |         | - | taille maximale (en kilo-octets) pour la prise en charge d'un fichier (ex. 5000 -> 5Mo)|
| maxImageFileSize          | oui    | number   |         | - | taille maximale (en kilo-octets) pour la prise en charge d'une photo |
| ignoreOversizedFiles      |        | boolean  |         | true | si `true`, les fichiers trop volumineux sont 'rejetés' càd que les métadonnées sont émises via l'@Output `rejectedFiles` avec un message d'erreur 'Droppable directive: oversized file'. Si false, aucun évenement n'est émis |
| ignoreOversizedImageFiles |        | boolean  |         | true | idem pour les photos |
| allowFullWindowDrop       |        | boolean  |         | false | si true, la dropbox passe en plein écran lors du survol de la souris pour déposer un iu plusieurs fichiers. Attention, ne pas utiliser cette option si plusieurs dropbox sont utilisées dans l'application (une seule active) |
| allowedFileTypes          | non mais recommandé ! | Array<string>  |         | 'jpeg', 'png', 'bmp', 'gif', 'pdf', 'json', 'ods', 'xls', 'xlsx', 'csv', 'odt', 'doc', 'docx', 'gpx', 'shp' | types de fichiers à prendre en compte |
| uploadTbPhotoFiles        |        | boolean  |         | false              | active l'upload des photos
| showTable                 |        | boolean  |         | true               | affiche les informations des fichiers en table |
| showThumbnails            |        | boolean  |         | false              | affiche les miniatures des ficihers |
| enabled                   |        | boolean  |         | true               | si false, la zone drag&drop est grisée et non cliquable / dropable
| reset                     |        | boolean  |         | false              | RAZ du composant si true |
| photoUploadBaseUrl        |        | string   |         | 'http://127.0.0.1:8000/api'   | adresse de base de l'API pour l'envoi des photos |

### Paramètres en sortie @Output

| Propriété             | Valeur(s)                            | Description |
| ---                   | ---                                  | ---         |
| acceptedFiles         | FileData\[]                          | ensemble des fichiers retenus pour l'upload  |
| rejectedFiles         | RejectedFileData\[]                  | ensemble des fichiers rejetés pour l'upload |
| deletedFiles          | FileData\[]                          | ensemble des fichiers supprimés par l'utilisateur |
| uploadedFiles         | Json                                 | réponse du serveur à chaque upload réussi |
| geolocatedPhotoLatLng | LatLngDMSAltitudePhotoName\[]        | données provenant des photos géolocalisées |


FileData :

index: number;

file: File;

arrayBuffer: any;

dataUrl: any;

initialFileSize?: number;

imageReducerIterations?: number;

imageIsToBigForUpload?: boolean;

exifMetadata?: Array<{x: string}> | false;

exifGPSLat?: {deg: number, min: number, sec: number};

exifGPSLng?: {deg: number, min: number, sec: number};

exifGPSAltitude?: number;

uploaded: boolean | 'error';


RejectedFileData : 

file: File;

message: string;


LatLngDMS :

lat: {deg: number, min: number, sec: number};

lng: {deg: number, min: number, sec: number};

altitude: number;

photoName: string; 

### Taille des images
Attention, si une image dépasse la taille maximale autorisée dans php.ini, son type Mime est alors interprété (modifié ?) en "octet/stream" et l'image est illisible par le back-end.

## Serveur de développement

Ne pas oublier de reconstruire la librairie avant de servir l'application (`npm run build_serve` fait les deux à la suite).

## Build
-  `npm run build_lib` pour construire la librairie
-  `npm run build_serve` pour construire la librairie et servir l'application principale
-  `npm run build_pack` for construire et packager la librairie


> The --prod meta-flag compiles with AOT by default.


Le build et la package sont dans le répertoire `dist/`.

## Tests unitaires
...





------
autoResizeImage : les images sont resimensionnnées (facteur 0.7) tant que leur taille est > maxImageSize (3 passes maxi). Si, après les 3 passes, l'image est toujours trop volumineuse, elle n'est pas uploadée.
