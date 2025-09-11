/**
 * Command Trainer
 *
 * @copyright 2025 Kikkun
 * @license   All Rights Reserved
 *
 * このソフトウェアは著作権法で保護されています。
 * Kikkunの書面による事前の許可なく、
 * このソフトウェアの全部または一部を複製、改変、配布、
 * または逆コンパイル、リバースエンジニアリングすることは
 * 固く禁じられています。
 *
 * This software is protected by copyright law.
 * Unauthorized reproduction, modification, distribution,
 * reverse compiling, or reverse engineering of this software,
 * in whole or in part, is strictly prohibited without the
 * prior written permission of Kikkun.
 */

// 厳格モードを有効にし、コードの品質を高める
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /**
   * アプリケーション全体の設定を管理するオブジェクト
   * @type {object}
   */
  const CONFIG = {
    // DOM要素のセレクタ
    SELECTORS: {
      body: 'body',
      problemSelectorList: '#problem-selector-list',
      themeSelect: '#themeSelect',
      customProblemUpload: '#customProblemUpload',
      resetCustomProblemsBtn: '#resetCustomProblemsBtn',
      myProblemAddLabel: 'label[for="customProblemUpload"]',
      jsonFormatTooltip: '#jsonFormatTooltip',
      screen: '#screen',
      problemElement: '#problem',
      solutionDisplayElement: '#solutionDisplay',
      problemNavList: '#problem-navigation-list',
      bookmarkCheck: '#bookmarkCheck',
      prevBtn: '#prevBtn',
      nextBtn: '#nextBtn',
      showAnsBtn: '#showAnsBtn',
      resetBtn: '#resetBtn',
      resizer: '#resizer',
      mainContent: '.main-content',
      problemCard: '.problem-card',
      terminal: '.terminal',
    },
    // ローカルストレージのキー
    STORAGE_KEYS: {
      CUSTOM_PROBLEMS: 'linux-terminal-custom-problems',
      THEME: 'linux-terminal-theme',
      BOOKMARK_PREFIX: 'linux-terminal-bookmarks',
      SIDEBAR_WIDTH: 'linux-command-trainer-sidebar-width',
    },
    // CSSクラス名
    CSS_CLASSES: {
      SUCCESS: 'text--success',
      ERROR: 'text--error',
      HINT: 'text--hint',
      EXPLANATION: 'text--explanation',
      MUTED: 'text--muted',
      PROBLEM_NUM: 'text--problem-num',
      EXECUTED_COMMAND: 'executed-command',
      VISIBLE: 'is-visible',
      RESIZING: 'is-resizing',
      CURRENT: 'is-current',
      COMPLETED: 'is-completed',
      BOOKMARKED: 'is-bookmarked',
      CLOSED: 'is-closed',
    },
    // テーマ名
    THEMES: {
      DEFAULT: 'default',
      UBUNTU: 'ubuntu',
      LIGHT: 'light',
      POWERSHELL: 'powershell'
    },
    // 表示メッセージ
    MESSAGES: {
      ALL_COMPLETE: '全てのコマンドを学習しました！<br>右下のリセットボタンで最初から再挑戦できます。',
      LOADING: '読み込み中...',
      SESSION_START: 'サイドバーで学習したい問題にチェックを入れてください。',
      PREV_PROBLEM_SUCCESS: '前の問題に戻りました',
      PREV_PROBLEM_FAIL: '最初の問題です。これ以上は戻れません。',
      NEXT_PROBLEM_SUCCESS: '次の問題に進みました',
      NEXT_PROBLEM_FAIL: '最後の問題です。次へは進めません。',
      JUMP_TO_PROBLEM: (index) => `問題 ${index} に移動しました`,
      CONFIRM_RESET_CUSTOM: '保存されているすべてのMy問題を削除します。よろしいですか？',
      CUSTOM_PROBLEM_ADDED: 'My問題セットが正常に追加されました！',
      CUSTOM_PROBLEM_DELETED: 'My問題を削除しました。',
      FILE_READ_ERROR: 'ファイルの読み込みに失敗しました。',
      JSON_PARSE_ERROR: (errorMsg) => `エラー: ${errorMsg}\nJSONの形式を確認してください。`,
    },
    // その他の定数
    PROMPT_TEXT: 'user@linux:~$',
    TERMINAL_HISTORY_LIMIT: 50,
    MIN_SIDEBAR_WIDTH: 200, // px
  };

  /**
   * 初期状態で組み込まれている問題データ
   * @type {object}
   */
  const INITIAL_PROBLEM_DATA = {
      "ls": {
        name: "ls 編",
        problems: [
          { id: 1, question: "隠しファイルを含めてすべてのファイルを表示してください。", answers: ["ls -a"], explanation: "ls -a で '.' や '..' を含めた隠しファイルを表示できます。", output: ".  ..  test.txt  -test.txt  docs" },
          { id: 2, question: "ファイルやディレクトリの詳細情報（パーミッション・サイズなど）を表示してください。", answers: ["ls -l"], explanation: "ls -l で詳細情報付きのリスト表示ができます。", output: "-rw-r--r-- 1 user user   120 Sep  6 12:00 test.txt\n-rw-r--r-- 1 user user   512 Sep  6 12:05 -test.txt\ndrwxr-xr-x 2 user user  4096 Sep  6 12:10 docs" },
          { id: 3, question: "隠しファイルを含め、詳細情報（パーミッション・サイズなど）を表示してください。", answers: ["ls -la", "ls -al"], explanation: "ls -la または ls -al で隠しファイルを含む詳細リスト表示ができます。", output: "drwxr-xr-x   3 user user  4096 Sep  6 12:15 .\ndrwxr-xr-x  22 user user  4096 Sep  6 12:15 ..\n-rw-r--r--   1 user user   120 Sep  6 12:00 test.txt\n-rw-r--r--   1 user user   512 Sep  6 12:05 -test.txt\ndrwxr-xr-x   2 user user  4096 Sep  6 12:10 docs" }
        ]
      },
      "cd": {
          name: "cd 編",
          problems: [
          { id: 1, question: "カレントディレクトリにある `docs` ディレクトリに移動してください。", answers: ["cd docs"], explanation: "`cd [ディレクトリ名]`で指定したディレクトリに移動できます。\n<span class='text--muted'>(プロンプトのパスは変わりませんが、docsディレクトリに移動したと想定してください)</span>", output: "" },
          { id: 2, question: "一つ上の階層のディレクトリ（親ディレクトリ）に移動してください。", answers: ["cd .."], explanation: "`..` は親ディレクトリを表します。`cd ..` で一つ上の階層に移動できます。\n<span class='text--muted'>(親ディレクトリに戻ったと想定してください)</span>", output: "" },
          { id: 3, question: "ホームディレクトリに移動してください。（2通りの答え方があります）", answers: ["cd ~", "cd"], explanation: "`~` はホームディレクトリを表す特殊な記号です。また、`cd`コマンドを引数なしで実行した場合もホームディレクトリに移動します。\n<span class='text--muted'>(ホームディレクトリに戻ったと想定してください)</span>", output: "" }
          ]
      }
  };

  /**
   * UIの操作と更新を専門に担当するクラス (View)
   */
  class UIManager {
    /**
     * @constructor
     */
    constructor() {
      this.dom = {};
      this._cacheDOMElements();
    }

    /**
     * 必要なDOM要素をキャッシュする
     * @private
     */
    _cacheDOMElements() {
      for (const [key, selector] of Object.entries(CONFIG.SELECTORS)) {
        this.dom[key] = document.querySelector(selector);
      }
    }

    /**
     * ターミナル画面にメッセージを表示する
     * @param {string} text - 表示するテキスト（HTML可）
     * @param {string} [className=''] - 付与するCSSクラス名
     */
    printToScreen(text = '', className = '') {
      const line = document.createElement('div');
      if (className) {
        line.innerHTML = `<span class="${className}">${text}</span>`;
      } else {
        line.innerHTML = text;
      }
      this.dom.screen.appendChild(line);
      this.scrollToBottom();
    }

    /**
     * ターミナル画面を最下部までスクロールする
     */
    scrollToBottom() {
      this.dom.screen.scrollTop = this.dom.screen.scrollHeight;
    }
    
    /**
     * 新しいコマンド入力行を作成して返す
     * @returns {HTMLInputElement} 新しく作成されたinput要素
     */
    createNewPromptLine() {
      const promptLine = document.createElement('div');
      promptLine.className = 'terminal__prompt-line';

      const prompt = document.createElement('span');
      prompt.className = 'terminal__prompt';
      prompt.textContent = CONFIG.PROMPT_TEXT;

      const input = document.createElement('input');
      input.className = 'terminal__input';
      input.type = 'text';
      input.autocomplete = 'off';
      input.autofocus = true;

      promptLine.append(prompt, input);
      this.dom.screen.appendChild(promptLine);
      input.focus();
      this.scrollToBottom();
      return input;
    }

    /**
     * 入力されたコマンドをロック（編集不可に）する
     * @param {HTMLInputElement} inputElement - ロック対象のinput要素
     */
    lockInput(inputElement) {
      inputElement.disabled = true;
      const parent = inputElement.parentElement;
      if (!parent) return;

      const executedCmdText = document.createElement('span');
      executedCmdText.className = CONFIG.CSS_CLASSES.EXECUTED_COMMAND;
      executedCmdText.textContent = inputElement.value;
      parent.appendChild(executedCmdText);
      inputElement.remove();
    }

    /**
     * 問題表示エリアを更新する
     * @param {object|null} problem - 表示する問題オブジェクト
     * @param {number} currentIndex - 現在の問題インデックス
     * @param {number} totalProblems - 問題の総数
     */
    updateProblemDisplay(problem, currentIndex, totalProblems) {
      if (!problem) {
        this.dom.problemElement.innerHTML = CONFIG.MESSAGES.ALL_COMPLETE;
        return;
      }
      const { PROBLEM_NUM } = CONFIG.CSS_CLASSES;
      this.dom.problemElement.innerHTML = `<span class="${PROBLEM_NUM}">問題 ${currentIndex + 1} / ${totalProblems}:</span><br>${problem.question}`;
    }

    /**
     * 解答表示エリアをクリアする
     */
    clearSolutionDisplay() {
      this.dom.solutionDisplayElement.innerHTML = '';
      this.dom.solutionDisplayElement.style.display = 'none';
    }

    /**
     * 解答を表示する
     * @param {object|null} problem - 解答を表示する問題オブジェクト
     */
    showSolutionDisplay(problem) {
      const { SUCCESS, EXPLANATION } = CONFIG.CSS_CLASSES;
      let solutionText = '';
      if (problem) {
        const answers = problem.answers.join(' / ');
        solutionText += `<span class="${SUCCESS}">答え: ${answers}</span><br>`;
        if (problem.explanation) solutionText += `<span class="${EXPLANATION}">説明: ${problem.explanation}</span><br>`;
        if (problem.output) solutionText += `<span class="${EXPLANATION}">（想定される出力）<br>${problem.output}</span>`;
      } else {
        solutionText = `<span class="${SUCCESS}">全ての問題をクリアしています。</span>`;
      }
      this.dom.solutionDisplayElement.innerHTML = solutionText;
      this.dom.solutionDisplayElement.style.display = 'block';
    }
    
    /**
     * 問題ナビゲーションを描画する
     * @param {Array<object>} problems - 問題の配列
     * @param {Function} jumpToProblemCallback - ナビゲーションボタンクリック時のコールバック
     */
    renderProblemNavigation(problems, jumpToProblemCallback) {
      this.dom.problemNavList.innerHTML = '';
      const fragment = document.createDocumentFragment();
      problems.forEach((_, index) => {
        const navBtn = document.createElement('button');
        navBtn.className = 'problem-nav-btn';
        navBtn.textContent = index + 1;
        navBtn.dataset.problemIndex = index;
        navBtn.addEventListener('click', (e) => jumpToProblemCallback(e));
        fragment.appendChild(navBtn);
      });
      this.dom.problemNavList.appendChild(fragment);
    }

    /**
     * 問題ナビゲーションの表示状態（現在位置、完了、ブックマーク）を更新する
     * @param {Array<object>} problems - 問題の配列
     * @param {number} currentIndex - 現在の問題インデックス
     * @param {Set<string>} bookmarkedIds - ブックマークされた問題IDのセット
     * @param {Function} getUniqueIdCallback - 問題オブジェクトからユニークIDを取得するコールバック
     */
    updateProblemNavigation(problems, currentIndex, bookmarkedIds, getUniqueIdCallback) {
      const { CURRENT, COMPLETED, BOOKMARKED } = CONFIG.CSS_CLASSES;
      const navBtns = this.dom.problemNavList.children;
      for (let i = 0; i < problems.length; i++) {
        const btn = navBtns[i];
        const problem = problems[i];
        btn.classList.remove(CURRENT, COMPLETED, BOOKMARKED);

        if (i < currentIndex) btn.classList.add(COMPLETED);
        else if (i === currentIndex) btn.classList.add(CURRENT);

        const uniqueId = getUniqueIdCallback(problem);
        if (uniqueId && bookmarkedIds.has(uniqueId)) {
          btn.classList.add(BOOKMARKED);
        }
      }
    }

    /**
     * 新しい学習セッションのためにUIをリセットする
     */
    resetUIForNewSession() {
      this.dom.screen.innerHTML = '';
      this.dom.problemElement.innerHTML = CONFIG.MESSAGES.LOADING;
      this.dom.solutionDisplayElement.style.display = 'none';
      this.dom.problemNavList.innerHTML = '';
    }
  }
  
  /**
   * テーマの管理を専門に担当するクラス
   */
  class ThemeManager {
      /**
       * @constructor
       * @param {HTMLBodyElement} bodyElement - body要素
       * @param {HTMLSelectElement} themeSelectElement - テーマ選択プルダウン
       */
      constructor(bodyElement, themeSelectElement) {
          this.body = bodyElement;
          this.themeSelect = themeSelectElement;
          this.THEME_CLASSES = Object.values(CONFIG.THEMES).filter(t => t !== 'default').map(t => `${t}-theme`);
      }

      /**
       * テーマを適用する
       * @param {string} themeName - 適用するテーマ名
       */
      applyTheme(themeName) {
          this.body.classList.remove(...this.THEME_CLASSES);
          if (themeName !== CONFIG.THEMES.DEFAULT) {
              this.body.classList.add(`${themeName}-theme`);
          }
          this.themeSelect.value = themeName;
      }

      /**
       * テーマをlocalStorageに保存する
       * @param {string} themeName - 保存するテーマ名
       */
      saveTheme(themeName) {
          localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, themeName);
      }

      /**
       * 保存されたテーマを読み込んで適用する
       */
      loadSavedTheme() {
          const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || CONFIG.THEMES.DEFAULT;
          this.applyTheme(savedTheme);
      }
  }
  
  /**
   * レイアウト関連の機能（リサイズなど）を初期化するクラス
   */
  class LayoutManager {
      /**
       * @constructor
       * @param {object} domElements - UI Managerから渡されるDOM要素のキャッシュ
       */
      constructor(domElements) {
          this.dom = domElements;
      }
      
      /**
       * すべてのレイアウト機能を初期化する
       */
      initialize() {
          this.initSidebarResizer();
          this.initTerminalHeightSync();
      }

      /**
       * サイドバーのリサイズ機能を初期化する
       */
      initSidebarResizer() {
          const { resizer, mainContent, body } = this.dom;
          
          const savedWidth = localStorage.getItem(CONFIG.STORAGE_KEYS.SIDEBAR_WIDTH);
          if (savedWidth) {
              mainContent.style.gridTemplateColumns = `${savedWidth} 4px 1fr`;
          }

          const resize = (e) => {
              e.preventDefault();
              const rect = mainContent.getBoundingClientRect();
              let newWidth = e.clientX - rect.left;
              if (newWidth < CONFIG.MIN_SIDEBAR_WIDTH) newWidth = CONFIG.MIN_SIDEBAR_WIDTH;
              mainContent.style.gridTemplateColumns = `${newWidth}px 4px 1fr`;
          };

          const stopResize = () => {
              window.removeEventListener('mousemove', resize);
              window.removeEventListener('mouseup', stopResize);
              body.classList.remove(CONFIG.CSS_CLASSES.RESIZING);
              const currentWidth = mainContent.style.gridTemplateColumns.split(' ')[0];
              localStorage.setItem(CONFIG.STORAGE_KEYS.SIDEBAR_WIDTH, currentWidth);
          };

          resizer.addEventListener('mousedown', (e) => {
              e.preventDefault();
              window.addEventListener('mousemove', resize);
              window.addEventListener('mouseup', stopResize);
              body.classList.add(CONFIG.CSS_CLASSES.RESIZING);
          });
      }
      
      /**
       * ターミナルと問題カードの高さ同期機能を初期化する
       */
      initTerminalHeightSync() {
          const { problemCard, terminal } = this.dom;
          // ResizeObserverを使用して、ターミナルの高さの変更を監視する
          const resizeObserver = new ResizeObserver(entries => {
              window.requestAnimationFrame(() => {
                  if (!entries || !entries.length) return;
                  for (let entry of entries) {
                      const newHeight = entry.contentBoxSize ? entry.contentBoxSize[0].blockSize : entry.contentRect.height;
                      problemCard.style.height = `${newHeight}px`;
                  }
              });
          });
          resizeObserver.observe(terminal);
      }
  }

  /**
   * ターミナル学習アプリケーションのメインクラス
   */
  class TerminalApp {
    /**
     * @constructor
     * @param {string} commandSetName - コマンドセット名
     * @param {Array<object>} problems - 学習する問題の配列
     * @param {UIManager} uiManager - UI操作を行うマネージャ
     */
    constructor(commandSetName, problems, uiManager) {
      this.commandSetName = commandSetName;
      this.problems = problems;
      this.ui = uiManager;
      this.bookmarkStorageKey = `${CONFIG.STORAGE_KEYS.BOOKMARK_PREFIX}_${this.commandSetName}`;

      this._initState();
      this._init();
    }

    /**
     * 内部状態を初期化する
     * @private
     */
    _initState() {
      this.state = {
        currentProblemIndex: 0,
        commandHistory: [],
        historyPointer: -1,
        currentInput: null,
        bookmarkedProblemIds: new Set(),
      };
    }

    /**
     * アプリケーションを非同期で初期化・起動する
     * @private
     */
    async _init() {
      this._loadBookmarks();
      this.ui.renderProblemNavigation(this.problems, (e) => this._jumpToProblem(e));
      this._bindEvents();

      await this._playBootAnimation(false);

      this._displayCurrentProblem();
      this._printWelcomeMessages();
      this.state.currentInput = this.ui.createNewPromptLine();
    }

    /**
     * UI要素にイベントリスナーを登録する
     * @private
     */
    _bindEvents() {
      const { prevBtn, nextBtn, showAnsBtn, resetBtn, screen, bookmarkCheck } = this.ui.dom;
      
      // ハンドラをプロパティとして保持し、destroyで確実に削除できるようにする
      this._eventHandlers = {
          handlePrevClick: () => this._prevProblem(),
          handleNextClick: () => this._nextProblem(),
          handleShowAnsClick: () => this.ui.showSolutionDisplay(this.problems[this.state.currentProblemIndex]),
          handleResetClick: async () => await this.reset(),
          handleScreenClick: () => this.state.currentInput?.focus(),
          handleBookmarkChange: () => this._toggleBookmark(),
          handleScreenKeyDown: (e) => this._handleScreenKeyDown(e),
      };

      prevBtn.addEventListener('click', this._eventHandlers.handlePrevClick);
      nextBtn.addEventListener('click', this._eventHandlers.handleNextClick);
      showAnsBtn.addEventListener('click', this._eventHandlers.handleShowAnsClick);
      resetBtn.addEventListener('click', this._eventHandlers.handleResetClick);
      screen.addEventListener('click', this._eventHandlers.handleScreenClick);
      screen.addEventListener('keydown', this._eventHandlers.handleScreenKeyDown);
      bookmarkCheck.addEventListener('change', this._eventHandlers.handleBookmarkChange);
    }

    /**
     * 登録したイベントリスナーをすべて解除する（クリーンアップ用）
     */
    destroy() {
      if (!this._eventHandlers) return;
      const { prevBtn, nextBtn, showAnsBtn, resetBtn, screen, bookmarkCheck } = this.ui.dom;
      prevBtn.removeEventListener('click', this._eventHandlers.handlePrevClick);
      nextBtn.removeEventListener('click', this._eventHandlers.handleNextClick);
      showAnsBtn.removeEventListener('click', this._eventHandlers.handleShowAnsClick);
      resetBtn.removeEventListener('click', this._eventHandlers.handleResetClick);
      screen.removeEventListener('click', this._eventHandlers.handleScreenClick);
      screen.removeEventListener('keydown', this._eventHandlers.handleScreenKeyDown);
      bookmarkCheck.removeEventListener('change', this._eventHandlers.handleBookmarkChange);
    }

    /**
     * コマンド入力を処理する
     * @param {string} command - 入力されたコマンド
     * @private
     */
    _handleCommandInput(command) {
      this._addCommandToHistory(command);
      this.ui.clearSolutionDisplay();

      if (command === 'date') {
        this.ui.printToScreen(new Date().toString());
        this.state.currentInput = this.ui.createNewPromptLine();
        return;
      }

      const currentProblem = this.problems[this.state.currentProblemIndex];

      if (!currentProblem) {
        this.ui.printToScreen("学習はすべて完了しています。リセットしてください。", CONFIG.CSS_CLASSES.ERROR);
      } else if (this._isAnswerCorrect(command, currentProblem.answers)) {
        this._handleCorrectAnswer(currentProblem);
      } else {
        this._handleIncorrectAnswer(command);
      }
      this.state.currentInput = this.ui.createNewPromptLine();
    }

    /**
     * 正解時の処理
     * @param {object} problem - 正解した問題オブジェクト
     * @private
     */
    _handleCorrectAnswer(problem) {
      if (problem.output) {
        this.ui.printToScreen(problem.output, CONFIG.CSS_CLASSES.EXPLANATION);
      }
      this.state.currentProblemIndex++;
      this._displayCurrentProblem();
    }

    /**
     * 不正解時の処理
     * @param {string} command - 入力されたコマンド
     * @private
     */
    _handleIncorrectAnswer(command) {
      this.ui.printToScreen(`bash: ${command}: command not correct`, CONFIG.CSS_CLASSES.ERROR);
    }

    /**
     * 入力された答えが正解かどうかを判定する
     * @param {string} input - ユーザーの入力
     * @param {Array<string>} answers - 正解の配列
     * @returns {boolean} 正解であればtrue
     * @private
     */
    _isAnswerCorrect(input, answers) {
      const normalize = (s) => s.trim().replace(/\s+/g, ' ');
      const normalizedInput = normalize(input);
      return answers.some((answer) => normalize(answer) === normalizedInput);
    }

    /**
     * 問題を変更する
     * @param {number} newIndex - 新しい問題のインデックス
     * @private
     */
    _changeProblem(newIndex) {
      this.ui.clearSolutionDisplay();
      this.state.currentProblemIndex = newIndex;
      this._displayCurrentProblem();
      this.state.currentInput?.focus();
    }
    
    _prevProblem() { this._moveProblem(-1, CONFIG.MESSAGES.PREV_PROBLEM_SUCCESS, CONFIG.MESSAGES.PREV_PROBLEM_FAIL); }
    _nextProblem() { this._moveProblem(1, CONFIG.MESSAGES.NEXT_PROBLEM_SUCCESS, CONFIG.MESSAGES.NEXT_PROBLEM_FAIL); }

    /**
     * 問題を前後に移動する汎用メソッド
     * @param {number} direction - 移動方向 (-1 or 1)
     * @param {string} successMessage - 移動成功時のメッセージ
     * @param {string} boundaryMessage - 端に到達した時のメッセージ
     * @private
     */
    _moveProblem(direction, successMessage, boundaryMessage) {
      const newIndex = this.state.currentProblemIndex + direction;
      if (newIndex >= 0 && newIndex < this.problems.length) {
        this._changeProblem(newIndex);
        this.ui.printToScreen(`\n(${successMessage})\n`, CONFIG.CSS_CLASSES.MUTED);
      } else {
        this.ui.printToScreen(`\n${boundaryMessage}\n`, CONFIG.CSS_CLASSES.ERROR);
      }
    }

    /**
     * 特定の問題にジャンプする
     * @param {Event} event - クリックイベント
     * @private
     */
    _jumpToProblem(event) {
      const newIndex = parseInt(event.target.dataset.problemIndex, 10);
      this._changeProblem(newIndex);
      this.ui.printToScreen(`\n(${CONFIG.MESSAGES.JUMP_TO_PROBLEM(newIndex + 1)})\n`, CONFIG.CSS_CLASSES.MUTED);
    }

    /**
     * 学習セッションをリセットする
     */
    async reset() {
      if (this.state.currentInput) this.state.currentInput.disabled = true;
      this.ui.dom.screen.innerHTML = '';
      this.ui.clearSolutionDisplay();

      await this._playBootAnimation(true);

      const savedBookmarks = this.state.bookmarkedProblemIds;
      this._initState();
      this.state.bookmarkedProblemIds = savedBookmarks;

      this._displayCurrentProblem();
      this._printWelcomeMessages();
      this.state.currentInput = this.ui.createNewPromptLine();
    }

    /**
     * 現在の問題を画面に表示する
     * @private
     */
    _displayCurrentProblem() {
      const { currentProblemIndex } = this.state;
      const currentProblem = this.problems[currentProblemIndex];

      this.ui.clearSolutionDisplay();
      this.ui.updateProblemDisplay(currentProblem, currentProblemIndex, this.problems.length);

      if (currentProblem) {
        const uniqueId = this._getUniqueProblemId(currentProblem);
        this.ui.dom.bookmarkCheck.checked = uniqueId ? this.state.bookmarkedProblemIds.has(uniqueId) : false;
      }
      this._updateProblemNavigation();
    }

    /**
     * 問題ナビゲーションの表示を更新する
     * @private
     */
    _updateProblemNavigation() {
      this.ui.updateProblemNavigation(
        this.problems,
        this.state.currentProblemIndex,
        this.state.bookmarkedProblemIds,
        (problem) => this._getUniqueProblemId(problem)
      );
    }
    
    /**
     * 問題オブジェクトからユニークなIDを生成する
     * @param {object} problem - 問題オブジェクト
     * @returns {string|null} ユニークID
     * @private
     */
    _getUniqueProblemId(problem) {
      if (!problem || typeof problem.commandKey === 'undefined' || typeof problem.id === 'undefined') return null;
      return `${problem.commandKey}:${problem.id}`;
    }
    
    /**
     * ターミナル画面でのキー入力を処理する
     * @param {KeyboardEvent} e - キーボードイベント
     * @private
     */
    _handleScreenKeyDown(e) {
      if (e.target !== this.state.currentInput) return;
      const input = e.target;
      switch (e.key) {
        case 'Enter':
          this.ui.lockInput(input);
          this._handleCommandInput(input.value.trim());
          break;
        case 'ArrowUp':
          e.preventDefault();
          this._navigateHistory(input, 'up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          this._navigateHistory(input, 'down');
          break;
        case 'l':
          if (e.ctrlKey) {
            e.preventDefault();
            this.ui.dom.screen.innerHTML = '';
            this.state.currentInput = this.ui.createNewPromptLine();
          }
          break;
      }
    }

    /**
     * コマンド履歴にコマンドを追加する
     * @param {string} command - 追加するコマンド
     * @private
     */
    _addCommandToHistory(command) {
      if (!command) return;
      this.state.commandHistory.push(command);
      if (this.state.commandHistory.length > CONFIG.TERMINAL_HISTORY_LIMIT) {
        this.state.commandHistory.shift();
      }
      this.state.historyPointer = this.state.commandHistory.length;
    }
    
    /**
     * コマンド履歴を辿る
     * @param {HTMLInputElement} inputElement - 操作対象のinput要素
     * @param {'up'|'down'} direction - 履歴を辿る方向
     * @private
     */
    _navigateHistory(inputElement, direction) {
      const { commandHistory } = this.state;
      if (commandHistory.length === 0) return;

      if (direction === 'up' && this.state.historyPointer > 0) {
        this.state.historyPointer--;
      } else if (direction === 'down' && this.state.historyPointer < commandHistory.length) {
        this.state.historyPointer++;
      }
      inputElement.value = commandHistory[this.state.historyPointer] || '';
    }

    _loadBookmarks() {
      try {
        const savedBookmarks = localStorage.getItem(this.bookmarkStorageKey) || '[]';
        this.state.bookmarkedProblemIds = new Set(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarks:", e);
        this.state.bookmarkedProblemIds = new Set();
      }
    }

    _saveBookmarks() {
      localStorage.setItem(this.bookmarkStorageKey, JSON.stringify(Array.from(this.state.bookmarkedProblemIds)));
    }

    _toggleBookmark() {
      const currentProblem = this.problems[this.state.currentProblemIndex];
      if (!currentProblem) return;

      const uniqueId = this._getUniqueProblemId(currentProblem);
      if (!uniqueId) return;

      if (this.ui.dom.bookmarkCheck.checked) {
        this.state.bookmarkedProblemIds.add(uniqueId);
      } else {
        this.state.bookmarkedProblemIds.delete(uniqueId);
      }
      this._saveBookmarks();
      this._updateProblemNavigation();

      const sidebarLabel = document.getElementById(`sidebar-problem-${currentProblem.commandKey}-${currentProblem.id}`);
      if (sidebarLabel) {
        sidebarLabel.classList.toggle(CONFIG.CSS_CLASSES.BOOKMARKED, this.ui.dom.bookmarkCheck.checked);
      }
    }

    _printWelcomeMessages() {
      const { SUCCESS } = CONFIG.CSS_CLASSES;
      this.ui.printToScreen('# Command Trainerへようこそ！', SUCCESS);
      this.ui.printToScreen('# コマンドを入力してEnterキーを押してください。', SUCCESS);
      this.ui.printToScreen('# 正解すると次の問題に進みます。', SUCCESS);
      this.ui.printToScreen('');
    }
    
    /**
     * 起動時のアニメーションを再生する
     * @param {boolean} isReboot - リブート（リセット）かどうか
     * @private
     */
    async _playBootAnimation(isReboot = false) {
      const bootSequence = [
        { text: 'Booting Linux Learning Environment...', delay: 100 },
        { text: '[    0.001234] Initializing core components...', delay: 200 },
        { text: '[    0.023456] Loading kernel modules...', delay: 150 },
        { text: '[    0.045678] Starting virtual memory manager...', delay: 200 },
        { text: '[    0.078901] Detecting hardware...', delay: 250 },
        { text: '[    0.123456] Loading problem sets...', delay: 150 },
        { text: '[    0.234567] Starting virtual file system...', delay: 250 },
        { text: `[<span class="${CONFIG.CSS_CLASSES.SUCCESS}">  OK  </span>] Mounted /dev/root.`, delay: 100 },
        { text: `[<span class="${CONFIG.CSS_CLASSES.SUCCESS}">  OK  </span>] Activated swap space.`, delay: 100 },
        { text: `[<span class="${CONFIG.CSS_CLASSES.SUCCESS}">  OK  </span>] Reached target Basic System.`, delay: 100 },
        { text: `[<span class="${CONFIG.CSS_CLASSES.SUCCESS}">  OK  </span>] Started Learning Services.`, delay: 100 },
        { text: `[<span class="${CONFIG.CSS_CLASSES.SUCCESS}">  OK  </span>] System ready - Created by kikkun.`, delay: 120 },
        { text: '', delay: 300 },
      ];
      const rebootSequence = [
        { text: 'Rebooting system...', delay: 100 },
        { text: '[    0.012345] Stopping User Manager for UID 1000...', delay: 120 },
        { text: '[    0.045678] Stopping Network Manager...', delay: 150 },
        { text: '[    0.067890] Stopping Virtual File Systems...', delay: 180 },
        { text: '[    0.089012] Unmounting /home...', delay: 180 },
        { text: '[    0.123456] Unmounting file systems...', delay: 200 },
        { text: '[    0.234567] System shutdown complete.', delay: 400 },
        { text: '', delay: 500 },
      ];
      const messagesToPlay = isReboot ? [...rebootSequence, ...bootSequence] : bootSequence;
      for (const msg of messagesToPlay) {
        this.ui.printToScreen(msg.text);
        await new Promise(resolve => setTimeout(resolve, msg.delay));
      }
    }
  }

  /**
   * アプリケーション全体を管理するコントローラークラス
   */
  class AppController {
    /**
     * @constructor
     */
    constructor() {
      this.ui = new UIManager();
      this.themeManager = new ThemeManager(this.ui.dom.body, this.ui.dom.themeSelect);
      this.initialProblemData = { ...INITIAL_PROBLEM_DATA };
      this.customProblemData = this._loadCustomProblemsFromStorage();
      this.currentApp = null;
      
      new LayoutManager(this.ui.dom).initialize();
      
      this._init();
    }
    
    /**
     * AppControllerを初期化する
     * @private
     */
    _init() {
      this.themeManager.loadSavedTheme();
      this.renderSidebar(); 
      this._bindGlobalEvents();
      this.startNewSession(); 
    }

    /**
     * グローバルなイベントリスナーを登録する
     * @private
     */
    _bindGlobalEvents() {
      this.ui.dom.themeSelect.addEventListener('change', (e) => {
          this.themeManager.applyTheme(e.target.value);
          this.themeManager.saveTheme(e.target.value);
      });
      this.ui.dom.customProblemUpload.addEventListener('change', (e) => this._handleFileUpload(e));
      this.ui.dom.resetCustomProblemsBtn.addEventListener('click', () => {
        if (confirm(CONFIG.MESSAGES.CONFIRM_RESET_CUSTOM)) {
          this._resetCustomProblems();
        }
      });
      this._bindTooltipEvents();
    }

    /**
     * JSONフォーマット説明用のツールチップイベントを登録する
     * @private
     */
    _bindTooltipEvents() {
      const tooltipContainer = this.ui.dom.myProblemAddLabel.closest('.tooltip-container');
      if (tooltipContainer) {
        tooltipContainer.addEventListener('mouseenter', () => this.ui.dom.jsonFormatTooltip.classList.add(CONFIG.CSS_CLASSES.VISIBLE));
        tooltipContainer.addEventListener('mouseleave', () => this.ui.dom.jsonFormatTooltip.classList.remove(CONFIG.CSS_CLASSES.VISIBLE));
      }
    }

    /**
     * サイドバーの問題選択リストを生成・再描画する
     */
    renderSidebar() {
      const { problemSelectorList } = this.ui.dom;
      problemSelectorList.innerHTML = '';
      
      const fragment = document.createDocumentFragment();

      Object.entries(this.initialProblemData).forEach(([key, data], index) => {
        fragment.appendChild(this._createProblemGroupEl(key, data, index === 0));
      });
      
      if (Object.keys(this.customProblemData).length > 0) {
        fragment.appendChild(this._createCustomProblemSection());
      }

      problemSelectorList.appendChild(fragment);

      problemSelectorList.querySelectorAll('.command-group').forEach(group => {
        this._updateParentCheckboxState(group);
      });
    }
    
    /**
     * サイドバーの「My問題」セクションを生成する
     * @returns {HTMLDivElement} 生成された要素
     * @private
     */
    _createCustomProblemSection() {
      const { CLOSED } = CONFIG.CSS_CLASSES;
      const customContainer = document.createElement('div');
      customContainer.className = `command-group ${CLOSED}`;

      const title = document.createElement('div');
      title.className = 'command-title';
      title.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') return;
        customContainer.classList.toggle(CLOSED);
      });

      const groupCheckbox = document.createElement('input');
      groupCheckbox.type = 'checkbox';
      groupCheckbox.style.marginRight = '8px';

      const titleText = document.createElement('span');
      titleText.textContent = 'My問題';
      
      title.append(groupCheckbox, titleText);

      const listContainer = document.createElement('div');
      listContainer.className = 'problem-checklist';
      listContainer.style.paddingLeft = '0';
      listContainer.style.margin = '0';

      Object.entries(this.customProblemData).forEach(([key, data]) => {
        listContainer.appendChild(this._createProblemGroupEl(key, data, false));
      });
      
      groupCheckbox.addEventListener('change', (e) => {
        listContainer.querySelectorAll('input[type="checkbox"]').forEach(child => child.checked = e.target.checked);
        this.startNewSession();
      });

      customContainer.append(title, listContainer);
      return customContainer;
    }
    
    /**
     * サイドバーの各問題グループ要素を生成する
     * @param {string} commandKey - コマンド名 (e.g., "ls")
     * @param {object} commandData - 問題データ
     * @param {boolean} isOpen - 初期状態で開いているか
     * @returns {HTMLDivElement} 生成された要素
     * @private
     */
    _createProblemGroupEl(commandKey, commandData, isOpen) {
      const group = document.createElement('div');
      group.className = `command-group ${!isOpen ? CONFIG.CSS_CLASSES.CLOSED : ''}`;
      group.dataset.command = commandKey;
      
      const { title, groupCheckbox } = this._createGroupTitle(commandData.name);
      const list = this._createProblemList(commandKey, commandData.problems);
      
      this._attachGroupEventListeners(title, group, groupCheckbox, list);
      
      group.append(title, list);
      return group;
    }

    /**
     * 問題グループのタイトル要素を作成する
     * @param {string} name - グループ名
     * @returns {{title: HTMLDivElement, groupCheckbox: HTMLInputElement}} タイトル要素とチェックボックス
     * @private
     */
    _createGroupTitle(name) {
      const title = document.createElement('div');
      title.className = 'command-title';
      
      const groupCheckbox = document.createElement('input');
      groupCheckbox.type = 'checkbox';
      groupCheckbox.style.marginRight = '8px';
      
      const titleText = document.createElement('span');
      titleText.textContent = name;
      
      title.append(groupCheckbox, titleText);
      return { title, groupCheckbox };
    }
    
    /**
     * 問題グループ内の問題リスト(ul)を作成する
     * @param {string} commandKey - コマンドキー
     * @param {Array<object>} problems - 問題の配列
     * @returns {HTMLUListElement} 生成されたリスト要素
     * @private
     */
    _createProblemList(commandKey, problems) {
      const { BOOKMARKED } = CONFIG.CSS_CLASSES;
      // ブックマーク情報はlocalStorageから都度取得する
      const allBookmarksKey = `${CONFIG.STORAGE_KEYS.BOOKMARK_PREFIX}_customSelection`;
      const allBookmarkedIds = new Set(JSON.parse(localStorage.getItem(allBookmarksKey) || '[]'));
      
      const list = document.createElement('ul');
      list.className = 'problem-checklist';
      
      problems.forEach(problem => {
        const uniqueId = `${commandKey}:${problem.id}`;
        const listItem = document.createElement('li');
        const label = document.createElement('label');
        label.id = `sidebar-problem-${uniqueId.replace(':', '-')}`;
        if (allBookmarkedIds.has(uniqueId)) {
          label.classList.add(BOOKMARKED);
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.problemId = uniqueId;

        const text = document.createElement('span');
        text.textContent = `問題 ${problem.id}: ${problem.question.substring(0, 20)}...`;

        label.append(checkbox, text);
        listItem.appendChild(label);
        list.appendChild(listItem);
      });
      return list;
    }
    
    /**
     * 問題グループにイベントリスナーを設定する
     * @param {HTMLDivElement} titleEl - タイトル要素
     * @param {HTMLDivElement} groupEl - グループ全体の要素
     * @param {HTMLInputElement} checkboxEl - グループのチェックボックス
     * @param {HTMLUListElement} listEl - 問題リスト要素
     * @private
     */
    _attachGroupEventListeners(titleEl, groupEl, checkboxEl, listEl) {
      // タイトルクリックでアコーディオン開閉
      titleEl.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') return;
        groupEl.classList.toggle(CONFIG.CSS_CLASSES.CLOSED);
      });

      // グループチェックボックスで配下のチェックボックスを一括変更
      checkboxEl.addEventListener('click', e => e.stopPropagation());
      checkboxEl.addEventListener('change', (e) => {
        listEl.querySelectorAll('input[type="checkbox"]').forEach(child => child.checked = e.target.checked);
        this.startNewSession();
      });

      // 個別チェックボックスの変更で親の状態を更新し、セッションを再開
      listEl.addEventListener('change', (e) => {
          if (e.target.type === 'checkbox') {
              this._updateParentCheckboxState(groupEl);
              const parentContainer = groupEl.closest('.command-group').parentElement?.closest('.command-group');
              if (parentContainer) this._updateParentCheckboxState(parentContainer);
              this.startNewSession();
          }
      });
    }
    
    /**
     * 親チェックボックスの状態（チェック済み、不確定）を更新する
     * @param {HTMLElement} groupEl - 問題グループのコンテナ要素
     * @private
     */
    _updateParentCheckboxState(groupEl) {
      const parentCheckbox = groupEl.querySelector(':scope > .command-title input[type="checkbox"]');
      const childCheckboxes = Array.from(groupEl.querySelectorAll(':scope > .problem-checklist input[type="checkbox"], :scope > .problem-checklist .command-group > .command-title input[type="checkbox"]'));

      if (!parentCheckbox || childCheckboxes.length === 0) return;

      const allChecked = childCheckboxes.every(cb => cb.checked);
      const someChecked = childCheckboxes.some(cb => cb.checked || cb.indeterminate);

      parentCheckbox.checked = allChecked;
      parentCheckbox.indeterminate = someChecked && !allChecked;
    }
    
    /**
     * アップロードされたJSONファイルを処理する
     * @param {Event} event - ファイル変更イベント
     * @private
     */
    _handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const customData = JSON.parse(e.target.result);
          if (this._validateCustomProblemData(customData)) {
            this._addCustomProblemSet(customData);
            alert(CONFIG.MESSAGES.CUSTOM_PROBLEM_ADDED);
          }
        } catch (error) {
          console.error('My問題の読み込みに失敗しました:', error);
          alert(CONFIG.MESSAGES.JSON_PARSE_ERROR(error.message));
        } finally {
          event.target.value = '';
        }
      };
      reader.onerror = () => {
        alert(CONFIG.MESSAGES.FILE_READ_ERROR);
        event.target.value = '';
      };
      reader.readAsText(file);
    }

    /**
     * カスタム問題データの形式をバリデーションする
     * @param {object} data - 読み込んだJSONデータ
     * @returns {boolean} バリデーションが成功すればtrue
     * @throws {Error} データ形式が不正な場合
     * @private
     */
    _validateCustomProblemData(data) {
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error('JSONのルートはオブジェクト形式である必要があります。');
      }
      if (Object.keys(data).length === 0) {
        throw new Error('JSONファイルに問題セットが含まれていません。');
      }
      for (const [key, problemSet] of Object.entries(data)) {
        if (this.initialProblemData[key] || this.customProblemData[key]) {
          throw new Error(`問題セットのキー "${key}" は既に使用されています。JSONファイル内のキー名を変更してください。`);
        }
        if (typeof problemSet.name !== 'string' || !problemSet.name.trim()) {
          throw new Error(`問題セット "${key}" に、必須プロパティ "name" (文字列) がありません。`);
        }
        if (!Array.isArray(problemSet.problems)) {
          throw new Error(`問題セット "${key}" に、必須プロパティ "problems" (配列) がありません。`);
        }
        for (const [i, problem] of problemSet.problems.entries()) {
          if (typeof problem.id === 'undefined' || typeof problem.question !== 'string' || !Array.isArray(problem.answers)) {
            throw new Error(`問題セット "${key}" の ${i + 1} 番目の問題の形式が正しくありません。(id, question, answersは必須です)`);
          }
        }
      }
      return true;
    }

    /**
     * カスタム問題セットを追加する
     * @param {object} customData - 追加する問題データ
     * @private
     */
    _addCustomProblemSet(customData) {
      Object.assign(this.customProblemData, customData);
      this._saveCustomProblemsToStorage();
      this.renderSidebar();
      this.startNewSession();
    }
    
    _loadCustomProblemsFromStorage() {
      const storedData = localStorage.getItem(CONFIG.STORAGE_KEYS.CUSTOM_PROBLEMS);
      if (storedData) {
        try {
          return JSON.parse(storedData);
        } catch (error) {
          console.error('My問題の読み込みに失敗しました:', error);
        }
      }
      return {};
    }

    _saveCustomProblemsToStorage() {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.CUSTOM_PROBLEMS, JSON.stringify(this.customProblemData));
      } catch (error) {
        console.error('My問題の保存に失敗しました:', error);
        alert('My問題の保存に失敗しました。');
      }
    }
    
    _resetCustomProblems() {
      this.customProblemData = {};
      localStorage.removeItem(CONFIG.STORAGE_KEYS.CUSTOM_PROBLEMS);
      alert(CONFIG.MESSAGES.CUSTOM_PROBLEM_DELETED);
      this.renderSidebar();
      this.startNewSession();
    }
    
    /**
     * 新しい学習セッションを開始する
     */
    startNewSession() {
      if (this.currentApp) {
        this.currentApp.destroy();
      }

      const selectedProblemIds = new Set();
      this.ui.dom.problemSelectorList.querySelectorAll('.problem-checklist input[type="checkbox"]:checked').forEach(cb => {
        if (cb.dataset.problemId) selectedProblemIds.add(cb.dataset.problemId);
      });
      
      const allProblemData = { ...this.initialProblemData, ...this.customProblemData };
      const problemsToLoad = [];
      Object.entries(allProblemData).forEach(([commandKey, commandData]) => {
        commandData.problems.forEach(problem => {
          if (selectedProblemIds.has(`${commandKey}:${problem.id}`)) {
            problemsToLoad.push({ ...problem, commandKey: commandKey });
          }
        });
      });
      
      this.ui.resetUIForNewSession();
      
      if (problemsToLoad.length > 0) {
        this.currentApp = new TerminalApp('customSelection', problemsToLoad, this.ui);
      } else {
        this.currentApp = null;
        this.ui.dom.problemElement.textContent = CONFIG.MESSAGES.SESSION_START;
      }
    }
  }
  
  // --- アプリケーションの起動 ---
  new AppController();

});