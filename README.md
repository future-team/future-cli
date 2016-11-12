# Future-cli
cli for f2e future static 

## Install

```bash
$ npm install -g gfs-cli
```

## Usage
### gfs

```bash
$ gfs 
```
### gfs init
Init project at current folder, user can choose different project template
```bash
$ mkdir myApp && cd myApp
$ gfs init -t react 
```

### gfs serve
Create a static server for debugger, just like anywhere, default use port `8080`
```bash
$ gfs serve -p 8080
```

### npm alias
Some aliases for npm script 
```bash
$ gfs build
$ gfs dev
```

### gfs add <project-type> <generator-name> <name> <options>
Add generator-name to current project
```bash
$ gfs add react component question-detail
$ gfs add react web question
```

###gfs rm <project-type> <generator-name> <name> <options>
Remove generator-name from current project, it will give a prompt before remove
```bash
$ gfs rm react component question-detail
$ gfs rm react web question
```