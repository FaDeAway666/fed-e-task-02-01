# 1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。

工程化是指对项目进行模块化、规范化、系统化，所有的重复性的操作都使用自动化的方式进行处理，实现项目的降本增效。

工程化主要解决了以下几个问题：

1. 制定了各项规范，使得工程结构更加清晰，代码风格统一，不再会出现项目中不同模块代码书写风格迥异，每次新增项目都要重新搭建框架等问题。
2. 使用版本控制工具，加强了团队协作效率，降低了误操作成本。
3. 引入工具集成了热更新、自动构建、自动打包、source map等功能，提高了开发效率，一定程度上降低了故障排查的难度。自动化的部署流程更是对产品的发布迭代提供了很大的便捷

# 2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？

脚手架工具的诞生也是工程化的一种体现，为了避免重复性新建项目，开发者抽出项目共性的部分，每次新建项目时执行脚手架指令即可自动创建一个包含基础功能的工程。

脚手架的意义除了创建基础项目工程，还提供了项目的各项规范与配置，包括使用的工具，基础的依赖等，可以根据开发者的需要进行自定义，以响应多变的项目需求。

