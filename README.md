# Space Intruders Prototype

本项目是一个纯前端的 Space Intruders 克隆原型，重点验证“配置驱动关卡”与“无资源美术”的可行性。双击 `index.html` 便可在 Chrome 中直接游玩。

## 目录结构

- `index.html` – 页面骨架、HUD、文档面板入口
- `styles/` – 全局样式与布局
- `src/`
  - `main.js` – 启动游戏并接管文档面板交互
  - `core/` – 游戏主循环、关卡加载、场景调度
  - `entities/` – 玩家、敌人、子弹与特效实现
  - `systems/` – 输入、碰撞、渲染系统
  - `config/` – 敌人类型和关卡配置文件
- `docs/design.html` – 设计文档，可在游戏内打开

## 本地运行

1. 在 macOS Finder 中直接双击 `index.html` 并选择 **Chrome** 打开。
2. 若浏览器限制文件访问，可退而求其次运行 `python3 -m http.server` 后访问 `http://localhost:8000`。
3. 游戏加载后自动开始，也可在控制台执行 `SpaceIntruders.game.start()` 重新开局。

## 扩展关卡

- 在 `src/config/levels` 下新增文件并导出关卡配置对象。
- 在 `index.js` 中引入并加入导出的数组即可投入使用。
- 新的敌人类型只需在 `src/config/enemies.js` 添加条目，并在 `src/entities/types` 中实现对应子类（若无特殊行为可复用 `EnemyBase`）。

## 设计文档

游戏右上角的“查看设计文档”按钮会暂停游戏并展示 `docs/design.html`，其中记录了本项目的设计思路、数据格式及后续扩展方向。

祝玩得开心，也欢迎基于该结构继续扩充更多关卡和敌人！
