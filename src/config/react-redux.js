var webPathMap = {
    'action': {
        'fileNameType': 'normal',
        'path': 'actions',
        'extension': 'es6'
    },
    'entry': {
        'fileNameType': 'normal',
        'path': 'entries',
        'extension': 'jsx'
    },
    'html': {
        'fileNameType': 'normal',
        'path': 'html',
        'extension': 'html'
    },
    'mock': {
        'fileNameType': 'normal',
        'path': 'html/mocks',
        'extension': 'json'
    },
    'reducer': {
        'fileNameType': 'normal',
        'path': 'reducers',
        'extension': 'es6'
    },
    'web': {
        'fileNameType': 'upper',
        'path': 'containers/web',
        'extension': 'jsx'
    },
    'style': {
        'fileNameType': 'normal',
        'path': 'less',
        'extension': 'less'
    }
};
var componentPathMap = {
    'component': {
        'fileNameType': 'upper',
        'path': 'components/web',
        'extension': 'jsx'
    },
    'style': {
        'fileNameType': 'upper',
        'path': 'components/web',
        'extension': 'less'
    }
};
var directoryTemplate = {
    "path": "src",
    "name": "src",
    "type": "folder",
    "children": [
        {
            "path": "src/actions",
            "name": "actions",
            "type": "folder",
            "children": []
        },
        {
            "path": "src/components",
            "name": "components",
            "type": "folder",
            "children": []
        },
        {
            "path": "src/containers",
            "name": "containers",
            "type": "folder",
            "children": []
        },
        {
            "path": "src/entries",
            "name": "entries",
            "type": "folder",
            "children": []
        },
        {
            "path": "src/html",
            "name": "html",
            "type": "folder",
            "children": []
        },
        {
            "path": "src/reducers",
            "name": "reducers",
            "type": "folder",
            "children": []
        }
    ]
};
module.exports.reactReduxConf = {
    BASE_PATH: process.cwd() + '/src',
    templateName: 'webpack_react_redux_cortex',
    webPathMap: webPathMap,
    componentPathMap: componentPathMap,
    directoryTemplate: directoryTemplate
}