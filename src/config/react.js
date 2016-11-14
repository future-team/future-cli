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
module.exports.BASE_PATH = process.cwd() + '/src'
module.exports.webPathMap = webPathMap
module.exports.componentPathMap = componentPathMap