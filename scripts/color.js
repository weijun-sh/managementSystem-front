const path = require('path');
const {generateTheme} = require('antd-theme-generator');

const options = {
    // 这个就是样式根目录，就是这么定的，当然路径都可以改
    stylesDir: path.join(__dirname, '../src/styles'), //  antd包目录
    antDir: path.join(__dirname, '../node_modules/antd'), // less变量文件
    varFile: path.join(__dirname, '../src/styles/vars.less'), // 主样式包，实际上可以在这里写一些公共样式
    mainLessFile: path.join(__dirname, '../src/styles/main.less'), // 主题变量
    themeVariables: ['@primary-color', '@secondary-color', '@text-color', '@text-color-secondary', '@heading-color', '@layout-body-background', '@btn-primary-bg', '@layout-header-background', '@border-color-base', '@white'], // 样式执行的页面
    indexFileName: 'index.html', // 主题样式生成的包文件以及目录
    outputFilePath: path.join(__dirname, '../public/color.less'), customColorRegexArray: [/^fade\(.*\)$/]
}

generateTheme(options).then(less => {
    console.log('Theme generated successfully');
})
.catch(error => {
    console.log('Error', error);
});
