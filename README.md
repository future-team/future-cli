# Future-cli
cli for f2e future static 

## Install

```bash
$ npm install -g future-cli
```

## Usage
### gfs
Default show help
```bash
$ gfs 
```

### gfs add <project-type> <generator-name> <name> <options>
Add generator-name to current project
```bash
$ gfs add --template react --type component --name question-detail
$ gfs add --template react --type web --name question
```  

###gfs rm <project-type> <generator-name> <name> <options>
Remove generator-name from current project, it will give a prompt before remove
```bash
$ gfs rm --template react --type component --name question-detail
$ gfs rm --template react --type web --name question
```
NOTE: At current version, only support project template is `webpack+react+redux+cortex`, the `--template` option is default config as `react`, so you can just type `gfs add/rm --type component --name question-detail`


### npm alias
Some aliases for npm script, this dependency your `package.json` script config
```bash
$ gfs build
$ gfs dev
$ gfs demo
$ gfs start
```