<h1>基底專案</h1>

<h2>目次</h2>
<!-- TOC -->

- [1. 使用技術](#1-使用技術)
- [2. 開發環境需求](#2-開發環境需求)
- [3. 開發環境設定](#3-開發環境設定)
  - [3.1. 安裝 Node.js](#31-安裝-nodejs)
    - [3.1.1. volta 常用指令](#311-volta-常用指令)
    - [3.1.2. npm 常用指令](#312-npm-常用指令)
- [4. 建立元件庫](#4-建立元件庫)

## 1. 使用技術

- [Angular - v14](https://angular.io)
  - 前端框架
- [TypeScript](https://www.typescriptlang.org)
  - 靜態型別檢查
- [RxJS - v7](https://rxjs.dev)
  - Reactive Extensions Library
- [SCSS](https://sass-lang.com)
  - CSS Preprocessor
- [Bootstrap v5.2](https://getbootstrap.com/docs/5.2)
  - CSS framework
- [ng-bootstrap v13](https://ng-bootstrap.github.io/releases/13.x/#/getting-started)
  - Bootstrap widgets for angular
- [Nx](https://nx.dev/)
  - Monorepo Build System
- [StoryBook](https://storybook.js.org/docs/angular/get-started/introduction)
  - 構建和測試 UI 元件的 open source tools

## 2. 開發環境需求

- 瀏覽器 : [Google Chrome](https://www.google.com/chrome/) 或是 [Microsoft Edge](https://www.microsoft.com/zh-tw/edge/browser-features?source=edgefeatures)
- 瀏覽器擴充套件 :
  - [Angular DevTools](https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh)
- 編譯 : [Node.js 18.12.1](https://Node.js.org/zh-tw/)
  - npm v8.19.2
- 編輯器 : [Visual Studio Code >= 1.74.2](https://code.visualstudio.com/)

  - Extension :
    - \* [Angular Extension Pack](https://marketplace.visualstudio.com/items?itemName=doggy8088.angular-extension-pack) : Angular 開發用的 Extension 集合包
      - \* [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
      - \* [Angular 10 Snippets](https://marketplace.visualstudio.com/items?itemName=Mikael.Angular-BeastCode) : Angular 2 ~ 10 Code Snippets
      - \* [Angular Snippets (Version 13)](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2) : Angular 13 Code Snippets
      - \* [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets) : ES6 Code Snippets
      - \* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) : 程式碼檢查
      - \* [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) : Prettier 程式碼格式化
      - \* [Nx Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) : Nx UI Console
    - \* [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) : CSS 檢查
    - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) : 拼字檢查
    - [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) : git 視覺化
    - [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) : 快速查看與 highlight 註解標籤

  > Note : \* 為必須安裝

- [Nx Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
  - 已包含在 Visual Studio Code extension 提到的 Angular Extension Pack

## 3. 開發環境設定

### 3.1. 安裝 Node.js

- 建議使用 [volta](https://docs.volta.sh/guide/getting-started) 來安裝，因為不同專案可能會有不同版本的需求，方便隨時切換版本。
- 輸入 `node -v` 指令查看當前版本號。
- 因為在 `.npmrc` 有設定 `engine-strict = true`，版本號必須符合 `package.json` 中的 `engines` 的設定，否則安裝 npm 套件會報錯。
- `npm` 預設是內建於 Node.js，故版本是跟著 Node.js，如無特殊需求則不需要另外安裝 `npm`。

> Note : `npm` 從 `v7` 開始 `package-lock.json` 中的 `lockfileVersion` 已變更為 2。
>
> 如果有開發者使用舊版 `npm` 執行安裝指令，`lockfileVersion` 會變回 1，這可能會造成一直覆蓋的問題，故請確保使用正確的 Node.js 版本(請安裝 `volta`)。
>
> 發生此問題請先切換到正確的 Node.js 版本，然後刪除 `package-lock.json` 和 `node_modules` 資料夾，再執行 `npm install` 指令來重新建立 `package-lock.json` 即可。

> Note : Windows 在 npm 安裝套件失敗時，請以 `系統管理員身分` 開啟 `命令提示字元` 輸入以下指令 :
> `npm install --global --production windows-build-tools`

#### 3.1.1. volta 常用指令

- `volta --help` : 查看 `volta` 指令。
- `volta list` : 查看當前啟用的套件管理版本。
- `volta list all` : 查看當前所安裝的套件管理版本清單。
- `volta install node[@版本號]` : 安裝指定的 Node.js 版本或是變更預設版本。
- `volta pin node[@version]` : 設定專案 Node.js 版本的 。

#### 3.1.2. npm 常用指令

- `npm ls` : 查看當前專案下安裝的 Node.js 套件清單。
- `npm install(npm i)` : 安裝專案下的 Node.js 套件 (無特殊情況請使用 `npm ci` 取代)。
  - 已有 `package-lock.json` 時，建議使用 `npm ci` 取代，避免版本可能會有些許差異。
- `npm install <name>` : 安裝某個 Node.js 套件。
  - `-g, --global` : 安裝電腦上(不分專案)
  - `-D, --save-dev` : 套件將會在 `package.json` 裡的 `devDependencies`。
- `npm ci` : 先清除 `node_modules` 再依照 `package-lock.json` 中鎖定的版號安裝專案下的套件。
- `npm uninstall <name>` : 解除安裝 Node.js 套件。
- `npm run <name>` : 執行 `package.json` 裡的 `scripts`。

# 4. 常用建立檔案指令

建立元件庫'
ng generate library @common/sdk --standalone --project-root=libs/common/sdk

建立裝飾器
ng generate directive control --standalone --path libs/common/sdk/form/src/directives/control --project @common/sdk
