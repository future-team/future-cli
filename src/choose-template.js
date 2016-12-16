'use strict'
var request = require('request')
var chalk = require('chalk')
var inquirer = require('inquirer')
var fullname = require('fullname')
var _ = require('lodash')
var ncp = require('ncp').ncp
var uid = require('uid')
ncp.limit = 16;
/**
 * Padding.
 */
process.on('exit', function () {
    console.log()
})
var pkg_json = {
    "webpack+react+redux+cortex": {
        "peerDependencies": {},
        "dependencies": {
            "babel-polyfill": "^6.3.14",
            "bootstrap": "^3.3.6",
            "classnames": "^2.2.0",
            "eagle-ui": "^1.4.5",
            "eg-tools": "^6.0.1",
            "es5-shim": "^4.5.9",
            "extend": "^3.0.0",
            "history": "^1.13.1",
            "immutable": "^3.7.5",
            "lodash": "^3.10.1",
            "phoenix-styles": "^0.1.5",
            "phoenix-ui": "^0.1.3",
            "react": "^0.14.3",
            "react-dom": "~0.14.8",
            "react-redux": "^4.0.0",
            "react-router": "^1.0.0",
            "redux": "^3.0.4",
            "redux-thunk": "^1.0.0",
            "whatwg-fetch": "^0.10.1",
            "console-polyfill": "^0.2.3"
        },
        "devDependencies": {
            "autoprefixer": "^6.3.7",
            "autoprefixer-loader": "^3.2.0",
            "babel": "^6.0.15",
            "babel-core": "^5.8.23",
            "babel-loader": "^5.3.2",
            "babel-preset-es2015": "^6.1.18",
            "babel-preset-react": "^6.1.18",
            "babel-preset-stage-0": "^6.1.18",
            "cortex-recombiner": "^1.0.13",
            "cortex-recombiner-webpack-plugin": "^1.0.3",
            "css-loader": "0.17.0",
            "extend": "^3.0.0",
            "extract-text-webpack-plugin": "^0.8.2",
            "file-loader": "^0.9.0",
            "glob": "^7.0.5",
            "gulp": "^3.9.0",
            "gulp-babel": "^5.3.0",
            "gulp-h-manifest": "^1.0.2",
            "gulp-htmlincluder": "^0.1.0",
            "gulp-less": "^3.0.3",
            "gulp-load-plugins": "^1.0.0-rc.1",
            "gulp-minify-css": "^1.2.1",
            "gulp-open": "^2.0.0",
            "gulp-rename": "^1.2.2",
            "gulp-rimraf": "^0.2.0",
            "gulp-util": "^3.0.6",
            "gulp-webpack": "^1.5.0",
            "handlebars-loader": "^1.3.0",
            "html-webpack-plugin": "^2.22.0",
            "less": "^2.5.1",
            "less-loader": "^2.2.0",
            "postcss-color-rebeccapurple": "^2.0.0",
            "postcss-initial": "^1.5.2",
            "postcss-loader": "^0.9.1",
            "raw-loader": "^0.5.1",
            "react-hot-loader": "^1.3.0",
            "run-sequence": "^1.1.5",
            "style-loader": "^0.12.3",
            "url-loader": "^0.5.7",
            "webpack": "^1.12.1",
            "webpack-bower-resolver": "0.0.1",
            "webpack-dev-server": "^1.10.1",
            "babel-eslint": "^6.1.2",
            "es3ify-loader": "^0.2.0",
            "eslint": "^3.4.0",
            "eslint-loader": "^1.5.0",
            "eslint-plugin-react": "^6.2.0",
            "es3ify-webpack-plugin": "0.0.1"
        },
        "scripts": {
            "demo": "node_modules/.bin/gulp ",
            "build": "node_modules/.bin/gulp ",
            "dev": "node_modules/.bin/gulp dev",
            "start": "node_modules/.bin/gulp dev"
        }
    },
    "webpack+jquery+handlebars+cortex": {
        "peerDependencies": {},
        "dependencies": {
            "babel-polyfill": "^6.3.14",
            "bootstrap": "^3.3.6",
            "handlebars": "^4.0.5",
            "jq-modal": "^0.1.3",
            "jquery": "^2.2.4",
            "underscore": "^1.8.3",
            "es5-shim": "^4.5.9"
        },
        "devDependencies": {
            "es3ify-webpack-plugin": "0.0.1",
            "autoprefixer": "^6.3.7",
            "autoprefixer-loader": "^3.2.0",
            "babel": "^6.0.15",
            "babel-core": "^5.8.23",
            "babel-loader": "^5.3.2",
            "babel-polyfill": "^6.8.0",
            "cortex-recombiner-webpack-plugin": "^1.0.3",
            "css-loader": "0.17.0",
            "ejs-loader": "^0.3.0",
            "extend": "^3.0.0",
            "extract-text-webpack-plugin": "^0.8.2",
            "file-loader": "^0.9.0",
            "glob": "^5.0.14",
            "gulp": "^3.9.0",
            "gulp-babel": "^5.3.0",
            "gulp-htmlincluder": "^0.1.0",
            "gulp-less": "^3.0.3",
            "gulp-load-plugins": "^1.0.0-rc.1",
            "gulp-minify-css": "^1.2.1",
            "gulp-open": "^2.0.0",
            "gulp-rename": "^1.2.2",
            "gulp-rimraf": "^0.2.0",
            "gulp-util": "^3.0.6",
            "gulp-webpack": "^1.5.0",
            "handlebars-loader": "^1.3.0",
            "html-webpack-plugin": "^2.22.0",
            "less": "^2.5.1",
            "less-loader": "^2.2.0",
            "postcss-color-rebeccapurple": "^2.0.0",
            "postcss-initial": "^1.5.2",
            "postcss-loader": "^0.9.1",
            "raw-loader": "^0.5.1",
            "react-hot-loader": "^1.3.0",
            "run-sequence": "^1.2.1",
            "style-loader": "^0.12.3",
            "url-loader": "^0.5.7",
            "webpack": "^1.12.1",
            "webpack-bower-resolver": "0.0.1",
            "webpack-dev-server": "^1.10.1"
        },
        "scripts": {
            "demo": "node_modules/.bin/gulp ",
            "build": "node_modules/.bin/gulp ",
            "dev": "node_modules/.bin/gulp dev",
            "start": "node_modules/.bin/gulp dev"
        }
    },
    "module-template(jquery or react)":{
        "main": "lib/",
        "dependencies": {
            "extend": "^3.0.0",
            "classnames": "^2.1.3",
            "handlebars": "^4.0.5"
        },
        "peerDependencies": {
        },
        "devDependencies": {
            "babel": "^6.0.15",
            "babel-core": "^5.8.23",
            "babel-loader": "^5.3.2",
            "babel-polyfill": "^6.8.0",
            "css-loader": "0.17.0",
            "es3ify-webpack-plugin": "0.0.1",
            "extract-text-webpack-plugin": "^0.8.2",
            "glob": "^5.0.14",
            "gulp": "^3.9.0",
            "gulp-babel": "^5.3.0",
            "gulp-karma": "0.0.5",
            "gulp-less": "^3.0.3",
            "gulp-load-plugins": "^1.0.0-rc.1",
            "gulp-minify-css": "^1.2.1",
            "gulp-open": "^2.0.0",
            "gulp-rename": "^1.2.2",
            "gulp-util": "^3.0.6",
            "gulp-webpack": "^1.5.0",
            "handlebars-loader": "^1.3.0",
            "jasmine-core": "^2.3.4",
            "karma": "^0.13.15",
            "karma-chrome-launcher": "^0.2.1",
            "karma-cli": "^0.1.1",
            "karma-jasmine": "^0.3.6",
            "karma-webpack": "^1.7.0",
            "less": "^2.5.1",
            "less-loader": "^2.2.0",
            "raw-loader": "^0.5.1",
            "react": "^0.14.3",
            "react-hot-loader": "^1.3.0",
            "style-loader": "^0.12.3",
            "webpack": "^1.12.1",
            "url-loader": "^0.5.7",
            "webpack-bower-resolver": "0.0.1",
            "webpack-dev-server": "^1.10.1",
            "es3ify-loader": "^0.2.0",
            "eslint": "^3.4.0",
            "eslint-loader": "^1.5.0",
            "babel-eslint": "^6.1.2",
            "eslint-plugin-react": "^6.2.0",
            "del": "^2.2.2"
        },
        "scripts": {
            "build": "node_modules/.bin/gulp && node_modules/.bin/gulp min",
            "test": "karma start",
            "demo": "node_modules/.bin/gulp demo",
            "doc": "smartDoc ||node_modules/.bin/smartDoc",
            "start":"npm run demo",
            "prepublish": " npm run build"
        }
    }
};
var temppalteToPackageMap = {
    "webpack-react-redux": "webpack+react+redux+cortex",
    "webpack-jquery-handlebars": "webpack+jquery+handlebars+cortex",
    'module-template':'module-template(jquery or react)'
};
/**
 * List repos.
 */
var ckRepo = require('../src/check-repo').init();
ckRepo.lookup(function(err){
    if (err) console.log(err)
    var requestBody = ckRepo.templates;
    if (Array.isArray(requestBody)) {
        console.log('Available official templates:')
        var choices = []
        requestBody.forEach(function (repo) {
            repo.command = 'run';
            choices.push({
                name: repo.name,
                value: repo
            })
        });

        fullname().then(function(name){
            var allo = name ? '\'Allo ' + name.split(' ')[0] + '! ' : '\'Allo! ';
            inquirer.prompt([{
                name: 'whatNext',
                type: 'list',
                message: allo + 'What would you like to do?',
                choices: _.flatten([
                    new inquirer.Separator('Choose a template'),
                    choices,
                ])
            }], function (answer) {
                if (answer.whatNext.command === 'run') {
                    // app.navigate('run', answer.whatNext.generator);
                    console.log(answer);
                    // 根据选择的下载模版到本地并创建模版文件 & 对应的 package.json
                    // 根据 yo 的逻辑 先clone 下来 然后 cp
                    ncp(answer.whatNext.path, '/Users/dpDev/Documents/github/gfs-cli/demo/test-template-'+ uid(), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        // 生成json 文件
                        var tempIndex = require(answer.whatNext.base);
                        // tempIndex.props.boilerplate = temppalteToPackageMap[answer.whatNext.name];
                        // TODO 生成packjson文件
                        pkg_json[temppalteToPackageMap[answer.whatNext.name]]
                        this.pkg = extend({
                            name: _.kebabCase(this.props.name),
                            version: this.props.version,
                            description: this.props.description,
                            repository: {
                                type: 'git',
                                url: this.props.repo
                            },
                            author: {
                                name: this.props.author,
                                email: this.props.email
                            },
                            keywords: [],
                            "dependencies": pkg_json.dependencies || {},
                            "devDependencies": pkg_json.devDependencies || {},
                            "scripts": pkg_json.scripts || {},
                            "bugs": {
                                "url": "http://" + getHomeUrl(this.props.repo) + "/issues"
                            },
                            "homepage": "http://" + getHomeUrl(this.props.repo)
                        }, currentPkg);

                        if(pkg_json.main){
                            this.pkg.main = pkg_json.main;
                        }

                        // Combine the keywords
                        if (this.props.keywords) {
                            this.pkg.keywords = _.uniq(this.props.keywords.concat(this.pkg.keywords));
                        }

                        // Let's extend package.json so we're not overwriting user previous fields
                        this.fs.writeJSON(this.destinationPath('package.json'), this.pkg);

                        console.log('done!', tempIndex);
                    });
                    return;
                }
                if (answer.whatNext === 'exit') {
                    return;
                }
            });
        });

    } else {
        console.error(requestBody.message)
    }
});
