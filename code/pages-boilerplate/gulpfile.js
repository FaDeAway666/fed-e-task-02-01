// 实现这个项目的构建任务
const {src, dest, series, parallel, watch} = require('gulp')

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins() // 一次性加载所有gulp-*的插件
// const sass = require('gulp-sass')
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')
const del = require('del')

const bs = require('browser-sync')
const cwd = process.cwd()

let config = {
    build: {
        src: 'src',
        dist: 'dist',
        tmp: 'tmp',
        public: 'public',
        paths: {
            styles: 'assets/styles/*.scss',
            scripts: 'assets/scripts/*.js',
            pages: '*.html',
            images: 'assets/images/**',
            fonts: 'assets/fonts/**'
        }
    },
    data: {}
}

try {
    const localConf = require(`${cwd}/pages.config.js`)
    config = Object.assign({}, config, localConf)
} catch(e) {}


const style = () => {
    return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src}) // 添加一个src option
        .pipe(plugins.sass({
            outputStyle: 'expanded'
        }))
        .pipe(dest(config.build.tmp))
        .pipe(bs.reload({stream: true})) // 也可以用这种方法，就不要再bs.init里面用files
}

const script = () => {
    return src(config.build.paths.scripts, { base: config.build.src, cwd: config.build.src})
        .pipe(plugins.babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(dest(config.build.tmp))
        .pipe(bs.reload({stream: true})) // 也可以用这种方法，就不要再bs.init里面用files
}

const page = () => {
    return src(config.build.paths.pages, { base: config.build.src, cwd: config.build.src})
        .pipe(plugins.swig(config.data))
        .pipe(dest(config.build.tmp))
        .pipe(bs.reload({stream: true})) // 也可以用这种方法，就不要再bs.init里面用files
}

const image = () => {
    return src(config.build.paths.images, { base: config.build.src, cwd: config.build.src})
        .pipe(plugins.imagemin())
        .pipe(dest(config.build.dist))
}

const font = () => {
    return src(config.build.paths.fonts, { base: config.build.src, cwd: config.build.src})
        .pipe(plugins.imagemin())
        .pipe(dest(config.build.dist))
}

const extra = () => {
    return src('**', { base: config.build.public, cwd: config.build.public})
        .pipe(dest(config.build.dist))
}

const clean = () => {
    return del([config.build.dist,config.build.tmp])
}

const serve = () => {
    watch(config.build.paths.styles, { cwd: config.build.src }, style)
    watch(config.build.paths.scripts, { cwd: config.build.src }, script)
    watch(config.build.paths.pages, { cwd: config.build.src }, page) 

    // 当图片或字体发生改变的时候，reload浏览器，而不是进行构建
    watch([config.build.paths.images,config.build.paths.fonts], { cwd: config.build.src }, bs.reload) 

    watch('**', { cwd: config.build.public }, bs.reload)

    bs.init({
        port: 3000,
        // files: 'tmp/**', // 监听文件变化
        server: {
            baseDir: [config.build.tmp, config.build.src, config.build.public], // 如果第一个找不到，就回到后面的目录中寻找
            routes: {
                // /node_modules开头的请求都被转发到node_modules文件夹中
                '/node_modules': 'node_modules' 
            }
        }
    })
}

const useref = () => {
    return src(config.build.paths.pages, {base: config.build.tmp, cwd: config.build.tmp})
        .pipe(plugins.useref({ searchPath: [config.build.tmp, '.']})) // 根据注释，将外部引用的依赖进行合并
        .pipe(plugins.if(/\.js$/, plugins.uglify())) // 压缩js，css，html
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true})))
        .pipe(dest(config.build.dist))
}

const compile = parallel(style, script, page)

const dev = series(compile, serve)

const build = series(clean, parallel(series(compile, useref), image, font, extra))

module.exports = {
    build,
    clean,
    dev
}