var webPathMap = {
    'controller': {
        'fileNameType': 'upper',
        'path': 'controller',
        'extension': 'es6'
    },
    'model': {
        'fileNameType': 'upper',
        'path': 'model',
        'extension': 'es6'
    },
    'components': {
        'fileNameType': 'upper',
        'path': 'view/components',
        'extension': 'jsx'
    },
    'mock': {
        'fileNameType': 'normal',
        'path': 'view/mocks',
        'extension': 'json'
    },
    'page': {
        'fileNameType': 'upper',
        'path': 'view/pages',
        'extension': 'jsx'
    },
    'style': {
        'fileNameType': 'normal',
        'path': 'view/styles',
        'extension': 'less'
    },
    'html': {
        'fileNameType': 'normal',
        'path': 'view',
        'extension': 'html'
    }
};
var directoryTemplate = {
    "path": "src",
    "name": "src",
    "type": "folder",
    "children": [
        {
            "path": "src/controller",
            "name": "controller",
            "type": "folder",
            "children": []
        },
        {
            "path": "src/model",
            "name": "model",
            "type": "folder",
            "children": []
        },
        {
            "path": "src/view/components",
            "name": "components",
            "type": "folder",
            "children": []
        },
        {
            "path": "src/view/mocks",
            "name": "mocks",
            "type": "folder",
            "children": []
        },
        {
            "path": "src/view/pages",
            "name": "pages",
            "type": "folder",
            "children": []
        },
        {
            "path": "src/view/styles",
            "name": "styles",
            "type": "folder",
            "children": []
        }
    ]
};
module.exports.reactDmConf = {
    BASE_PATH: process.cwd() + '/src',
    templateName: 'webpack_react_dm',
    webPathMap: webPathMap,
    directoryTemplate: directoryTemplate
}