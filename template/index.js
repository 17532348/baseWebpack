const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

module.exports = function (creator, options, callback) {
    const { name, description } = options;

    // 获取当前命令的执行目录，注意和项目目录区分
    const cwd = process.cwd();

    const projectPath = path.join(cwd, name);
    const buildPath = path.join(projectPath, 'build');
    const srcPath = path.join(projectPath, 'src');

    // 新建项目目录
    fs.mkdirSync(projectPath);
    fs.mkdirSync(buildPath);
    fs.mkdirSync(srcPath);
    // 创建package.json
    creator.copyTpl('package.json', path.join(projectPath, 'package.json'), {
        name,
        description,
    });


    creator.copy('build/webpack.dev.js', path.join(buildPath, 'webpack.dev.js'));
    creator.copy('build/webpack.prod.js', path.join(buildPath, 'webpack.prod.js'));

    creator.copy('src/main.js', path.join(srcPath, 'main.js'));
    creator.copy('src/index.html', path.join(srcPath, 'index.html'));
    creator.copy('.babelrc',  path.join(projectPath, '.babelrc'));
    creator.copy('postcss.config.js',  path.join(projectPath, 'postcss.config.js'));

    creator.fs.commit(() => {
        console.log(`${chalk.grey(`创建项目: ${name}`)} ${chalk.green('✔ ')}`);
        console.log(`${chalk.grey(`创建目录: ${name}/build`)} ${chalk.green('✔ ')}`);
        console.log(`${chalk.grey(`创建目录: ${name}/src`)} ${chalk.green('✔ ')}`);
        callback();
    });
}