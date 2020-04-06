const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const memFs = require('mem-fs'); // 在内存中创建一个临时的文件store
const memFsEditor = require('mem-fs-editor'); // 通过ejs的语法去编辑我们的文件

class Creator {
    constructor() {
        // 内存创建store
        const store = memFs.create();
        this.fs = memFsEditor.create(store);

        this.options = {
            name: '',
            description: ''
        }
        // 当前根目录
        this.rootPath = path.resolve(__dirname, '../');
        // 模版目录
        this.tplDirPath = path.join(this.rootPath, 'template');
    };
    // 初始化
    init() {
        console.log(chalk.green('init~'));
        this.ask().then((answers) => {
            this.options = Object.assign({}, this.options, answers);
            this.write();
        });
    }
    // 命令行交互
    ask() {
        // 问题
        const prompt = [];
        prompt.push({
            type: 'input',
            name: 'name',
            message: '请输入项目名称',
            validate(input) {
                if (!input) {
                    return '请输入项目名称!';
                }
                if (fs.existsSync(input)) {
                    return '项目名已重复!'
                }
                return true;
            }
        });
        prompt.push({
            type: 'input',
            name: 'description',
            message: '请输入项目描述',
        });
        // 返回promise
        return inquirer.prompt(prompt);
    }
    // 拷贝&写数据
    write() {
        console.log(chalk.green('构建~'));
        const tplBuilder = require('../template/index.js');
        tplBuilder(this, this.options, () => {
            console.log(chalk.green('my cli 构建完成'));
            console.log(chalk.grey(`开始项目:  cd ${this.options.name} && npm install && npm run dev`));
        });
    }
    getTplPath(file) {
        return path.join(this.tplDirPath, file);
    }
    // 拷贝文件并注入数据
    copyTpl(file, to, data = {}) {
        const tplPath = this.getTplPath(file);
        this.fs.copyTpl(tplPath, to, data);
    }
    // 直接拷贝文件
    copy(file, to) {
        const tplPath = this.getTplPath(file);
        this.fs.copy(tplPath, to);
    }
}

module.exports = Creator
