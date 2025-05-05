<h1>基底專案</h1>

<h2>目次</h2>
<!-- TOC -->

- [使用技術](#1-使用技術)
- [2. 開發環境需求](#2-開發環境需求)
- [3. 開發環境設定](#3-開發環境設定)
  - [3.1. 安裝 Node.js](#31-安裝-nodejs)
    - [3.1.1. volta 常用指令](#311-volta-常用指令)
    - [3.1.2. npm 常用指令](#312-npm-常用指令)
- [4. 常用建立檔案指令](#4-常用建立檔案指令)
- [5. 使用stanalone模式](#5-使用stanalone模式)
- [6. Angular響應式表單整合](#6-Angular響應式表單整合)
- [7. Material-Icon](#7-Material-Icon)
- [8. 程式風格](#8-程式風格)
  - [8.1. 單一職責](#81-單一職責)
  - [8.2. 命名](#82-命名)
    - [8.2.1 總體命名規則](#821-總體命名規則)
    - [8.2.2 component命名](#822-component命名)
    - [8.2.3 directive命名](#823-directive命名)
    - [8.2.4 pipe命名](#824-pipe命名)
- [9. 應用程式結構](#9-應用程式結構)
  - [9.1 總體結構指導原則](#91-總體結構指導原則)
  - [9.2 不在pipe中新增排序及過濾邏輯](#92-不在pipe中新增排序及過濾邏輯)
- [10. 元件component](#10-元件component)
  - [10.1 內聯輸入和輸出屬性裝飾器](#101-內聯輸入和輸出屬性裝飾器)
  - [10.2 參數&函式](#102-參數&函式)
  - [10.3 邏輯放到服務裡](#103-邏輯放到服務裡)
  - [10.4 不要給輸出屬性加字首](#104-不要給輸出屬性加字首)
  - [10.5 初始化input輸入屬性](#105-初始化input輸入屬性)
- [11. 指令directive](#11-指令directive)
  - [11.1 監聽事件](#111-監聽事件)
- [12. 服務service](#12-服務service)
  - [12.1 單一職責](#121-單一職責)
- [13. 生命週期鉤子](#13-生命週期鉤子)
- [14. git-conventional-commits](#14-git-conventional-commits)
  - [14.1 git-commit-範例](#141-git-commit-範例)
- [15. i18n國際化語系](#15-i18n國際化語系)
- [16. sonarqube掃描](#16-sonarqube掃描)
- [17. snyk 掃描](#17-Snyk-掃描)

# 1. 使用技術

- [Angular - v19](https://angular.io)
  - 前端框架
- [TypeScript](https://www.typescriptlang.org)
  - 靜態型別檢查
- [RxJS - v7](https://rxjs.dev)
  - Reactive Extensions Library
- [SCSS](https://sass-lang.com)
  - CSS Preprocessor
- [Angular Material v19](https://v19.material.angular.io/)
  - 適用於Angular的UI套件
- [Material Icon](https://fonts.google.com/icons?icon.set=Material+Icons)
  - google提供的icon庫

# 2. 開發環境需求

- 瀏覽器 : [Google Chrome](https://www.google.com/chrome/) 或是 [Microsoft Edge](https://www.microsoft.com/zh-tw/edge/browser-features?source=edgefeatures)
- 瀏覽器擴充套件 :
  - [Angular DevTools](https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh)
- 編譯 : [Node.js v22.14.0](https://nodejs.org/en/download)
  - npm v10.9.2
- 編輯器 : [Visual Studio Code >= 1.91.0](https://code.visualstudio.com/)

  - Extension :
    - \* [Angular Extension Pack](https://marketplace.visualstudio.com/items?itemName=doggy8088.angular-extension-pack) : Angular 開發用的 Extension 集合包
      - \* [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
      - \* [Angular 17 Snippets](https://marketplace.visualstudio.com/items?itemName=Mikael.Angular-BeastCode) : Angular 2 ~ 10 Code Snippets
      - \* [Angular Snippets (Version 18)](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2) : Angular 13 Code Snippets
      - \* [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets) : ES6 Code Snippets
      - \* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) : 程式碼檢查
      - \* [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) : Prettier 程式碼格式化
      - \* [Nx Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) : Nx UI Console
    - \* [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) : CSS 檢查
    - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) : 拼字檢查
    - [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) : git 視覺化
    - [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) : 快速查看與 highlight 註解標籤

  > Note : \* 為必須安裝

  - 已包含在 Visual Studio Code extension 提到的 Angular Extension Pack

# 3. 開發環境設定

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

建立元件庫
ng generate library @common/sdk --standalone --project-root=libs/common/sdk

建立裝飾器
ng generate directive control --standalone --path libs/common/sdk/form/src/directives/control --project @common/sdk

# 5. 使用Stanalone模式

- Directive、Component除非有必要，否則一律使用Stanalone模式

# 6. Angular響應式表單整合

- @common/sdk/form

## 裝飾器 (Directive)

**ControlDirective**

使用 **hostDirectives** 綁定在表單元件

```typescript
@Component({
  selector: 'app-example-input',
  ...
  standalone: true,
  imports: [ReactiveFormsModule, ControlDirective],
  hostDirectives: [ControlDirective],
})
export class ExampleInputComponent<ValueT> {}
```

# 7. Material-Icon

```html
<!-- Outlined -->
<span class="material-icons-outlined"> search </span>
<!-- Filled -->
<span class="material-icons"> search </span>
<!-- Rounded -->
<span class="material-symbols-rounded"> search </span>
<!-- Sharp -->
<span class="material-icons-sharp"> search </span>
<!-- Two tone -->
<span class="material-icons-two-tone"> search </span>
```

# 8. 程式風格

- [Angular官方風格指南](https://angular.tw/guide/styleguide#rule-of-one)

## 8.1 單一職責

- 單一規則
  讓程式碼更加可複用、更容易閱讀，減少出錯的可能性。
  每個檔案只定義一樣東西（例如服務或元件）。<br>
  請參考[angular官方風格指南-風格01-01](https://angular.tw/guide/styleguide#style-01-01)

- 小函式
  請使用各個pure function小函式，一次只做一件事，有需要再組合成大函式
  小函式可避免易在大函式中產生的隱蔽性錯誤。<br>
  請參考[angular官方風格指南-風格01-02](https://angular.tw/guide/styleguide#style-01-02)

## 8.2 命名

### 8.2.1 總體命名規則

- 請勿使用簡寫，務必完整表達意義
- 檔名

  - feature : 特性使用中線命名法。
    - e.g. user-profile
  - type : Component、Directive、Module、Pipe、Service

  - Class名
    - 使用大駝峰(UpperCamelCase)，將feature、type合併。
    - e.g. UserProfileService

### 8.2.2 Component命名

- @Component中的selector，使用中線命名法。
  - e.g. toh-hero-button
- 如果檔名命名時較為簡單，則selector應加上形容詞描述，防止與其他元件衝突。
  - e.g. users.component.ts預設的selector為users，應多加形容詞描述admin-users

### 8.2.3 Directive命名

- @Directive中的selector，使用小駝峰命名法 (lowerCamelCase)。
- 如果檔名命名時較為簡單，則selector應加上形容詞描述，防止與其他元件衝突。
  - e.g.
    validate.directive.ts預設的selector為validate，應多加形容詞描述tohValidate (toh => tour of heros)

### 8.2.4 Pipe命名

- Class名稱應該使用大駝峰 (UpperCamelCase)。
  - e.g. export class EllipsisPipe
- name 字串應該使用小駝峰 (lowerCamelCase)。
  - e.g. @Pipe({ name: ‘ellipsis’ })

### 8.2.5 NgModule命名

- Class名請使用大駝峰 (UpperCamelCase)。
- RoutingModule的檔名請多加feature，並使用中線命名法。
  - e.g.
    Class名 : export class HeroesRoutingModule
    檔名 : heroes-routing.module.ts

# 9. 應用程式結構

## 9.1 總體結構指導原則

- 如果元件具有多個伴生檔案 (.ts、.html、.css 和 .spec)，就為它建立一個資料夾。

## 9.2 不在Pipe中新增排序及過濾邏輯

- 排序及過濾的邏輯是1個相當耗效能的行為，由於Angular每秒可能會呼叫很多次Pipe的方法，所以假如現在用Pipe排序大型列表，會嚴重降低使用者的體驗。
- 建議可以將邏輯放在元件或服務內，並進行提前計算。
  <br>
  請參考[angular官方風格指南-風格04-13](https://angular.tw/guide/styleguide#style-04-13)

# 10. 元件(Component)

## 10.1 內聯輸入和輸出屬性裝飾器

- 使用 input() 和 output()，而非 @Directive 和 @Component 裝飾器的 inputs 和 outputs 屬性。
- 避免除非有重要目的，否則不要為輸入和輸出指定別名。

## 10.2 參數&函式

- 先放公共成員，再放私有成員，並按照字母順序排列。
- 屬性成員放在前面，方法成員放在後面。<br>
  請參考[angular官方風格指南-風格05-14](https://angular.tw/guide/styleguide#style-05-14)
- 嚴格定義型別。
- 參數如果沒有預設值，且無特殊原因，請使用『?』不要使用『!』。
  僅僅使用 ! 來抑制 TypeScript 報錯是不夠的，應該避免它，因為這樣做會阻止型別檢查器來確保必須提供此輸入值。

## 10.3 邏輯放到服務裡

- 元件中只包含與檢視相關的邏輯(資料檢視)。
- template不做任何有關邏輯的事情。
- 所有其它邏輯都應該放到服務中。<br>
  請參考[angular官方風格指南-風格05-15](https://angular.tw/guide/styleguide#style-05-15)

## 10.4 不要給輸出屬性加字首

- 命名事件時，不要帶字首 on，事件處理器方法才要有 on

## 10.5 初始化Input輸入屬性

- 盡量給元件依賴的某個值預設值 input('預設值')
- 如果元件依賴某個值則使用 input.require()
- 如果元件依賴某個值為可選則使用 input()

# 11. 指令(Directive)

## 11.1 監聽事件

- 如果要在template上建立畫面邏輯時，請使用指令。
  - 畫面資料Highlight之類的畫面邏輯。<br>
    請參考[angular官方風格指南-風格06-01](https://angular.tw/guide/styleguide#style-06-01)
  - 優先使用 @HostListener 和 @HostBinding，而不是 @Directive 和 @Component 裝飾器的 host 屬性。

# 12. 服務(Service)

## 12.1 單一職責

- 當服務成長到超出單一用途時，建立一個新服務。
- 在服務的 @Injectable 裝飾器上，指定透過應用的根注入器提供服務
  (providedIn: ‘root’)。
- 使用 @Injectable() 類別裝飾器，而非 @Inject() 引數裝飾器。
- 把資料操作和與資料互動的邏輯重構到服務裡。

# 13. 生命週期鉤子

堅持實現生命週期鉤子介面
請參考[angular官方風格指南-風格09-01](https://angular.tw/guide/styleguide#style-09-01)

# 14. Git Conventional Commits

| type     | 說明                                                                              |
| -------- | --------------------------------------------------------------------------------- |
| feat     | 新增 / 修改功能 (feature)。                                                       |
| fix      | 修補 bug (bug fix)。                                                              |
| docs     | 文件 (documentation)。                                                            |
| style    | 格式 (不影響程式碼運行的變動) white-space, formatting, missing semi colons, etc。 |
| refactor | 重構 (既不是新增功能，也不是修補 bug 的程式碼變動)。                              |
| perf     | 改善效能 (A code change that improves performance)。                              |
| test     | 增加測試 (when adding missing tests)。                                            |
| chore    | 建構程序或輔助工具的變動 (maintain)。                                             |
| revert   | 撤銷回覆先前的 commit 例如：revert: type (scope): subject (回覆版本：xxxx)。      |

## 14.1 Git commit 範例

- feat: 新增 login 頁面
- feat(core): 新增 共用元件
- fix: 修正 api 串接錯誤
- [Conventional Commits 詳細規範](https://www.conventionalcommits.org/zh-hant/v1.0.0/)

# 15. i18n國際化語系

- @common/sdk/i18n
- [i18n](https://ngneat.github.io/transloco/docs/getting-started/installation)
  - 多語系套件

## [模板翻譯](https://ngneat.github.io/transloco/docs/translation-in-the-template)

使用以下功能前需先導入i18n模組**TranslocoModule**

### 管道 (Pipe)

```html
<span>{{ 'i18nKey' | transloco }}</span>
```

### 裝飾器 (Directive)

```html
<span transloco="i18nKey"></span>
```

### 語法糖

```html
<ng-container *transloco="let t">
  <p>{{ t('i18nKey') }}</p>

  <example-component [title]="t('i18nKey')"></example-component>
</ng-container>
```

## 惰性載入用法(Standalone Component 開發)

```typescript
  @Component({
  selector: '?????',
  standalone: true,
  ...
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'validate-messages', // 第2層資料夾
        alias: 'vm', // 使用別稱
      },
      multi: true,
    },
  ],
  ...
})
export class ????Component {
  ...
  private _translocoService = inject(TranslocoService);
  private _someText = ''
  private _sub =  this._translocoService.events$.subscribe(val => {
      // 確保翻譯檔已載入
      if (
        val.payload.scope === '????-scope' &&
        val.type === 'translationLoadSuccess'
      ) {
        this._someText = this._translocoService.translate('????-key');
      }
      this._sub.unsubscribe();
      this._sub = null;
    });
}
```

```html
{{ 'vm.xxx-key' | transloco }}
```

# 16. SonarQube掃描

- 指令

```html
npx sonar-scanner
```

# 17. Snyk 掃描

- 指令

1. 登入

```cmd=
npx snyk auth
```

2. 掃描

```cmd=
npx snyk monitor
```

3. 掃描後Cmd會顯示結果網址，點下去即可查看
