/**
* List all accepted file types
* 'type' is used to identify file type, it's not really related to file extension
* 'mime' is the exact Mime type
*/
export const acceptedFileTypes: Array<{type: string, mime: string}> = [
 { type: 'jpeg', mime: 'image/jpeg' },
 { type: 'png', mime: 'image/png' },
 { type: 'bmp', mime: 'image/bmp' },
 { type: 'gif', mime: 'image/gif' },
 { type: 'pdf', mime: 'application/pdf' },
 { type: 'json', mime: 'application/json' },
 { type: 'gpx', mime: 'application/gpx+xml' },
 { type: 'ods', mime: 'application/vnd.oasis.opendocument.spreadsheet' },
 { type: 'xls', mime: 'application/vnd.ms-excel' },
 { type: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
 { type: 'csv', mime: 'text/csv' },
 { type: 'odt', mime: 'application/vnd.oasis.opendocument.text' },
 { type: 'doc', mime: 'application/msword' },
 { type: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
];
