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

window.addEventListener('load', () => {

'use strict';

//document.addEventListener('DOMContentLoaded', () => {

  /**
   * アプリケーション全体で使用する設定値
   * @const
   */
  const CONFIG = {
    // DOM要素のセレクタ
    SELECTORS: {
      body: 'body',
      problemSelectorList: '#problem-selector-list',
      themeSelect: '#themeSelect',
      langSelect: '#langSelect', // New
      openWizardBtn: '#openWizardBtn',
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
      progressText: '#progress-text',
      progressBar: '#progress-bar',
      wizardModal: '#customProblemWizard',
      wizardContent: '.wizard-content',
      wizardSteps: '.wizard-step',
      wizardProgressSteps: '.wizard-progress-step',
      wizardPrevBtn: '#wizardPrevBtn',
      wizardNextBtn: '#wizardNextBtn',
      wizardCompleteBtn: '#wizardCompleteBtn',
      closeWizardBtn: '#closeWizardBtn',
      wizardProblemList: '#wizardProblemList',
      customProblemUpload: '#customProblemUpload',
      jsonFormatTooltip: '#jsonFormatTooltip',
      tooltipContainer: '.tooltip-container',
      wizardUploadFeedback: '#wizard-upload-feedback',
      wizardConfirmationSummary: '#wizard-confirmation-summary',
      wizardDeleteAllBtn: '#wizardDeleteAllBtn',
    },
    // ローカルストレージで使用するキー
    STORAGE_KEYS: {
      CUSTOM_PROBLEMS: 'linux-terminal-custom-problems',
      THEME: 'linux-terminal-theme',
      LANGUAGE: 'linux-terminal-language', // New
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
      ACTIVE: 'is-active',
    },
    // テーマ名
    THEMES: {
      LIGHT: 'light',
      DARK: 'dark',
      UBUNTU: 'ubuntu',
      POWERSHELL: 'powershell',
      SEPIA: 'sepia'
    },
    DEFAULT_THEME: 'light',
    DEFAULT_LANG: 'ja',
    PROMPT_BASE_TEXT: 'user@linux:',
    TERMINAL_HISTORY_LIMIT: 50,
    MIN_SIDEBAR_WIDTH: 200,
  };
  
  /**
   * 国際化(i18n)データ
   * UIテキスト、メッセージ、問題データを格納
   * @const
   */
  const I18N = {
    ja: {
      // UI Texts
      appTitle: 'Command Trainer〈Beta Version〉',
      manageMyProblems: 'My問題を管理',
      themeLight: 'ライトテーマ',
      themeDark: 'ダークテーマ',
      themeUbuntu: 'Ubuntu風テーマ',
      themePowerShell: 'PowerShell風テーマ',
      themeSepia: 'セピアテーマ',
      problemSetTitle: '問題セット',
      problemTitle: '問題',
      bookmarkLabel: '苦手チェック',
      loading: '読み込み中...',
      prevBtn: '前へ',
      nextBtn: '次へ',
      showAnsBtn: '答えを見る',
      resetBtn: 'リセット',
      problemListTitle: '問題一覧',
      progressLabel: '進捗: {0} / {1}',
      wizardTitle: 'My問題 管理ウィザード',
      wizardStep1: '1. JSON読み込み',
      wizardStep2: '2. 問題の整理',
      wizardStep3: '3. 確認',
      wizardAddProblems: '新しい問題を追加',
      wizardUploadDesc: '学習させたいコマンド問題のJSONファイルをアップロードしてください。',
      wizardSelectJson: 'JSONファイルを選択',
      jsonFormatTitle: '読み込むJSONファイルの形式:',
      jsonFormatNote: '- ルートはオブジェクトです。\n- "new-command-set"の部分は、他の問題セットと重複しないキーにしてください。\n- 各問題のid, question, answersは必須です。',
      wizardCurrentProblems: '現在のMy問題',
      wizardDeleteAll: '全削除',
      wizardManageDesc: '追加した問題セットの確認や、不要な問題・問題セットの削除ができます。',
      wizardConfirmTitle: '変更内容の確認',
      wizardConfirmDesc: '以下の内容でMy問題を更新します。「完了」ボタンを押すと変更が保存されます。',
      wizardBackBtn: '戻る',
      wizardCancelBtn: 'キャンセル',
      wizardNextBtn: '次へ',
      wizardCompleteBtn: '完了',
      scenarioCategory: 'シナリオ編',
      myProblemsCategory: 'My問題',
      problemLabel: '問題',
      objectiveLabel: '目的',
      answerLabel: '答え',
      explanationLabel: '説明',
      outputLabel: '（想定される出力）',
      stepLabel: 'ステップ',
      // Messages
      messages: {
          ALL_COMPLETE: '全てのコマンドを学習しました！<br>右下のリセットボタンで最初から再挑戦できます。',
          SESSION_START: 'サイドバーで学習したい問題にチェックを入れてください。',
          PREV_PROBLEM_SUCCESS: '前の問題に戻りました',
          PREV_PROBLEM_FAIL: '最初の問題です。これ以上は戻れません。',
          NEXT_PROBLEM_SUCCESS: '次の問題に進みました',
          NEXT_PROBLEM_FAIL: '最後の問題です。次へは進めません。',
          JUMP_TO_PROBLEM: (index) => `問題 ${index} に移動しました`,
          CUSTOM_PROBLEM_ADDED: 'My問題セットが正常に追加されました！',
          CUSTOM_PROBLEM_DELETED: 'My問題を削除しました。',
          CUSTOM_PROBLEM_ALL_DELETED: 'すべてのMy問題を削除しました。',
          FILE_READ_ERROR: 'ファイルの読み込みに失敗しました。',
          JSON_PARSE_ERROR: (errorMsg) => `エラー: ${errorMsg}\nJSONの形式を確認してください。`,
          SCENARIO_INCORRECT: 'コマンドが正しくありません。現在のステップの指示を確認してください。',
          NO_CUSTOM_PROBLEMS: '<p class="text--muted">現在、My問題はありません。<br>JSONファイルをアップロードして追加できます。</p>',
          WIZARD_UPLOAD_SUCCESS: (filename) => `ファイル「${filename}」を読み込みました。「次へ」進んでください。`,
          WIZARD_UPLOAD_SUCCESS_MULTI_JA: (count) => `✅ ${count} 件のファイルが正常に読み込まれました。「次へ」進んでください。`,
          WIZARD_UPLOAD_FAIL_MULTI_JA: (count) => `❌ ${count} 件のファイルの読み込みに失敗しました。`,
      },
      // Problem Data
      problemData: {
          "ls-default": {
            name: "ls 編",
            problems: [
              { id: 1, question: "隠しファイルを含めてすべてのファイルを表示してください。", answers: ["ls -a"], explanation: "ls -a で '.' や '..' を含めた隠しファイルを表示できます。", output: ".  ..  test.txt  -test.txt  docs" },
              { id: 2, question: "ファイルやディレクトリの詳細情報（パーミッション・サイズなど）を表示してください。", answers: ["ls -l"], explanation: "ls -l で詳細情報付きのリスト表示ができます。", output: "-rw-r--r-- 1 user user   120 Sep  6 12:00 test.txt\n-rw-r--r-- 1 user user   512 Sep  6 12:05 -test.txt\ndrwxr-xr-x 2 user user  4096 Sep  6 12:10 docs" },
              { id: 3, question: "隠しファイルを含め、詳細情報（パーミッション・サイズなど）を表示してください。", answers: ["ls -la", "ls -al"], explanation: "ls -la または ls -al で隠しファイルを含む詳細リスト表示ができます。", output: "drwxr-xr-x   3 user user  4096 Sep  6 12:15 .\ndrwxr-xr-x  22 user user  4096 Sep  6 12:15 ..\n-rw-r--r--   1 user user   120 Sep  6 12:00 test.txt\n-rw-r--r--   1 user user   512 Sep  6 12:05 -test.txt\ndrwxr-xr-x   2 user user  4096 Sep  6 12:10 docs" }
            ]
          },
          "cd-default": {
              name: "cd 編",
              problems: [
              { id: 1, question: "カレントディレクトリにある `docs` ディレクトリに移動してください。", answers: ["cd docs"], explanation: "`cd [ディレクトリ名]`で指定したディレクトリに移動できます。\n<span class='text--muted'>(プロンプトのパスは変わりませんが、docsディレクトリに移動したと想定してください)</span>", output: "" },
              { id: 2, question: "一つ上の階層のディレクトリ（親ディレクトリ）に移動してください。", answers: ["cd .."], explanation: "`..` は親ディレクトリを表します。`cd ..` で一つ上の階層に移動できます。\n<span class='text--muted'>(親ディレクトリに戻ったと想定してください)</span>", output: "" },
              { id: 3, question: "ホームディレクトリに移動してください。（2通りの答え方があります）", answers: ["cd ~", "cd"], explanation: "`~` はホームディレクトリを表す特殊な記号です。また、`cd`コマンドを引数なしで実行した場合もホームディレクトリに移動します。\n<span class='text--muted'>(ホームディレクトリに戻ったと想定してください)</span>", output: "" }
              ]
          },
          "scenario-basic": {
              name: "シナリオ編：プロジェクト準備",
              problems: [
                  {
                      id: 1,
                      type: "scenario",
                      "objective": "新しいWebプロジェクトの初期設定を行う",
                      steps: [
                          { id: "1-1", question: "まず、'my-website' という名前のディレクトリを作成してください。", answers: ["mkdir my-website"], successMessage: "'my-website'ディレクトリを作成しました。" },
                          { id: "1-2", question: "次に、作成した 'my-website' ディレクトリに移動してください。", answers: ["cd my-website"], successMessage: "カレントディレクトリが 'my-website' になりました。" },
                          { id: "1-3", question: "このディレクトリ内に、'index.html' と 'style.css' という2つの空ファイルを作成してください。", answers: ["touch index.html style.css", "touch style.css index.html"], successMessage: "2つのファイルを作成しました。" },
                          { id: "1-4", question: "最後に、現在のディレクトリにあるファイルの一覧を詳細形式で表示して、正しく作成されたか確認してください。", answers: ["ls -l"], output: "-rw-r--r-- 1 user user 0 Sep 11 13:30 index.html\n-rw-r--r-- 1 user user 0 Sep 11 13:30 style.css" }
                      ],
                      finalMessage: "お疲れ様でした！プロジェクトの初期設定が完了しました。"
                  }
              ]
          },
          "scenario-file-management": {
              name: "シナリオ編：ファイル整理",
              problems: [
                  {
                      id: 2,
                      type: "scenario",
                      objective: "雑多なファイルを種類ごとに整理する",
                      steps: [
                          { id: "2-1", question: "作業用の 'downloads' ディレクトリを作成してください。", answers: ["mkdir downloads"], successMessage: "'downloads' ディレクトリを作成しました。" },
                          { id: "2-2", question: "作成した 'downloads' ディレクトリに移動してください。", answers: ["cd downloads"], successMessage: "'downloads' に移動しました。" },
                          { id: "2-3", question: "整理対象のファイルとして 'report.docx', 'photo.jpg', 'temp.log' の3つを作成してください。", answers: ["touch report.docx photo.jpg temp.log"], successMessage: "3つのファイルを作成しました。" },
                          { id: "2-4", question: "ファイルを格納するための 'documents' と 'images' ディレクトリを一度に作成してください。", answers: ["mkdir documents images"], successMessage: "2つのディレクトリを作成しました。" },
                          { id: "2-5", question: "'report.docx' を 'documents' ディレクトリに移動してください。", answers: ["mv report.docx documents"], successMessage: "ファイルを 'documents' に移動しました。" },
                          { id: "2-6", question: "'photo.jpg' の名前を 'family_photo.jpg' に変更してください。", answers: ["mv photo.jpg family_photo.jpg"], successMessage: "ファイル名を変更しました。" },
                          { id: "2-7", question: "名前を変更した 'family_photo.jpg' を 'images' ディレクトリに移動してください。", answers: ["mv family_photo.jpg images"], successMessage: "ファイルを 'images' に移動しました。" },
                          { id: "2-8", question: "不要になった 'temp.log' ファイルを削除してください。", answers: ["rm temp.log"], successMessage: "'temp.log' を削除しました。" },
                          { id: "2-9", question: "最後に 'ls' を実行して、整理後のディレクトリ一覧を確認してください。", answers: ["ls"], output: "documents  images" }
                      ],
                      finalMessage: "素晴らしい！ファイルの整理が完了しました。"
                  }
              ]
          },
          "scenario-permissions": {
              name: "シナリオ編：権限管理",
              problems: [
                  {
                      id: 3,
                      type: "scenario",
                      objective: "スクリプトファイルに実行権限を付与する",
                      steps: [
                          { id: "3-1", question: "スクリプトを管理する 'scripts' ディレクトリを作成し、そこに移動してください。", answers: ["mkdir scripts && cd scripts"], successMessage: "'scripts' を作成し、移動しました。" },
                          { id: "3-2", question: "'deploy.sh' という名前のスクリプトファイルを新規作成してください。", answers: ["touch deploy.sh"], successMessage: "'deploy.sh' を作成しました。" },
                          { id: "3-3", question: "まず、現在の権限を確認するために `ls -l` を実行してください。", answers: ["ls -l"], output: "-rw-r--r-- 1 user user 0 Sep 11 14:00 deploy.sh" },
                          { id: "3-4", question: "'deploy.sh' ファイルに実行権限を追加してください。", answers: ["chmod +x deploy.sh", "chmod 755 deploy.sh"], successMessage: "実行権限を付与しました。" },
                          { id: "3-5", question: "権限が正しく変更されたか、もう一度 `ls -l` を実行して確認してください。", answers: ["ls -l"], output: "-rwxr-xr-x 1 user user 0 Sep 11 14:00 deploy.sh" }
                      ],
                      finalMessage: "完璧です！スクリプトを実行する準備が整いました。"
                  }
              ]
          },
          "scenario-redirect": {
              name: "シナリオ編：設定のバックアップ",
              problems: [
                  {
                      id: 4,
                      type: "scenario",
                      objective: "設定ファイルの内容を確認し、リダイレクションでバックアップを作成する",
                      steps: [
                          { id: "4-1", question: "設定ファイルを置くための 'config' ディレクトリを作成し、そこに移動してください。", answers: ["mkdir config && cd config"], successMessage: "'config' を作成し、移動しました。" },
                          { id: "4-2", question: "'server.conf' という設定ファイルを作成してください。", answers: ["touch server.conf"], successMessage: "'server.conf' を作成しました。" },
                          { id: "4-3", question: "まず、`cat server.conf` を実行して設定ファイルの中身を確認してください。(中身は自動で設定されます)", answers: ["cat server.conf"], output: "HOSTNAME=prod-server\nPORT=8080" },
                          { id: "4-4", question: "`cat` とリダイレクション `>` を使って、`server.conf` の内容を `server.conf.bak` という新しいファイルに書き込んでください。", answers: ["cat server.conf > server.conf.bak"], successMessage: "リダイレクションを使ってバックアップファイルを作成しました。" },
                          { id: "4-5", question: "バックアップが作成されたか `ls` で確認してください。", answers: ["ls"], output: "server.conf  server.conf.bak" }
                      ],
                      finalMessage: "見事です！リダイレクションを使いこなせていますね。"
                  }
              ]
          }
      }
    },
    en: {
      // UI Texts
      appTitle: 'Command Trainer <Beta Version>',
      manageMyProblems: 'Manage My Problems',
      themeLight: 'Light Theme',
      themeDark: 'Dark Theme',
      themeUbuntu: 'Ubuntu Theme',
      themePowerShell: 'PowerShell Theme',
      themeSepia: 'Sepia Theme',
      problemSetTitle: 'Problem Sets',
      problemTitle: 'Problem',
      bookmarkLabel: 'Bookmark',
      loading: 'Loading...',
      prevBtn: 'Prev',
      nextBtn: 'Next',
      showAnsBtn: 'Answer',
      resetBtn: 'Reset',
      problemListTitle: 'Problem List',
      progressLabel: 'Progress: {0} / {1}',
      wizardTitle: 'My Problems Management Wizard',
      wizardStep1: '1. Load JSON',
      wizardStep2: '2. Organize Problems',
      wizardStep3: '3. Confirmation',
      wizardAddProblems: 'Add New Problems',
      wizardUploadDesc: 'Please upload a JSON file of command problems you want to learn.',
      wizardSelectJson: 'Select JSON file',
      jsonFormatTitle: 'Format of the JSON file to load:',
      jsonFormatNote: '- The root must be an object.\n- The key, like "new-command-set", must be unique and not conflict with other problem sets.\n- `id`, `question`, and `answers` are mandatory for each problem.',
      wizardCurrentProblems: 'Current My Problems',
      wizardDeleteAll: 'Delete All',
      wizardManageDesc: 'You can check the added problem sets and delete unnecessary problems or sets.',
      wizardConfirmTitle: 'Confirm Changes',
      wizardConfirmDesc: 'My Problems will be updated with the following content. Press "Complete" to save the changes.',
      wizardBackBtn: 'Back',
      wizardCancelBtn: 'Cancel',
      wizardNextBtn: 'Next',
      wizardCompleteBtn: 'Complete',
      scenarioCategory: 'Scenarios',
      myProblemsCategory: 'My Problems',
      problemLabel: 'Problem',
      objectiveLabel: 'Objective',
      answerLabel: 'Answer',
      explanationLabel: 'Explanation',
      outputLabel: '(Expected Output)',
      stepLabel: 'Step',
      // Messages
      messages: {
          ALL_COMPLETE: 'Congratulations! You have completed all the commands!<br>You can try again from the beginning with the reset button at the bottom right.',
          SESSION_START: 'Please check the problems you want to learn in the sidebar.',
          PREV_PROBLEM_SUCCESS: 'Returned to the previous problem.',
          PREV_PROBLEM_FAIL: 'This is the first problem. Cannot go back further.',
          NEXT_PROBLEM_SUCCESS: 'Moved to the next problem.',
          NEXT_PROBLEM_FAIL: 'This is the last problem. Cannot go further.',
          JUMP_TO_PROBLEM: (index) => `Jumped to problem ${index}.`,
          CUSTOM_PROBLEM_ADDED: 'My Problem set has been successfully added!',
          CUSTOM_PROBLEM_DELETED: 'My Problem has been deleted.',
          CUSTOM_PROBLEM_ALL_DELETED: 'All My Problems have been deleted.',
          FILE_READ_ERROR: 'Failed to read the file.',
          JSON_PARSE_ERROR: (errorMsg) => `Error: ${errorMsg}\nPlease check the JSON format.`,
          SCENARIO_INCORRECT: 'Incorrect command. Please check the instructions for the current step.',
          NO_CUSTOM_PROBLEMS: '<p class="text--muted">There are currently no "My Problems".<br>You can add them by uploading a JSON file.</p>',
          WIZARD_UPLOAD_SUCCESS: (filename) => `File "${filename}" loaded. Please proceed to "Next".`,
          WIZARD_UPLOAD_SUCCESS_MULTI_EN: (count) => `✅ ${count} files successfully loaded. Please proceed to Next.`,
          WIZARD_UPLOAD_FAIL_MULTI_EN: (count) => `❌ ${count} files failed to load.`,
      },
      // Problem Data
      problemData: {
          "ls": {
              name: "ls Chapter",
              problems: [
                  { id: 1, question: "Display all files, including hidden files.", answers: ["ls -a"], explanation: "`ls -a` displays hidden files, including '.' and '..'.", output: ".  ..  test.txt  -test.txt  docs" },
                  { id: 2, question: "Display detailed information about files and directories (permissions, size, etc.).", answers: ["ls -l"], explanation: "`ls -l` provides a long listing format with detailed information.", output: "-rw-r--r-- 1 user user   120 Sep  6 12:00 test.txt\n-rw-r--r-- 1 user user   512 Sep  6 12:05 -test.txt\ndrwxr-xr-x 2 user user  4096 Sep  6 12:10 docs" },
                  { id: 3, question: "Display detailed information, including hidden files.", answers: ["ls -la", "ls -al"], explanation: "`ls -la` or `ls -al` shows a detailed list including hidden files.", output: "drwxr-xr-x   3 user user  4096 Sep  6 12:15 .\ndrwxr-xr-x  22 user user  4096 Sep  6 12:15 ..\n-rw-r--r--   1 user user   120 Sep  6 12:00 test.txt\n-rw-r--r--   1 user user   512 Sep  6 12:05 -test.txt\ndrwxr-xr-x   2 user user  4096 Sep  6 12:10 docs" }
              ]
          },
          "cd": {
              name: "cd Chapter",
              problems: [
                  { id: 1, question: "Navigate into the `docs` directory located in the current directory.", answers: ["cd docs"], explanation: "Use `cd [directory_name]` to move into a specified directory.\n<span class='text--muted'>(Assume you have moved to the docs directory, although the prompt path will not change)</span>", output: "" },
                  { id: 2, question: "Move up to the parent directory.", answers: ["cd .."], explanation: "`..` represents the parent directory. `cd ..` moves you one level up.\n<span class='text--muted'>(Assume you have returned to the parent directory)</span>", output: "" },
                  { id: 3, question: "Return to the home directory. (There are two ways to do this)", answers: ["cd ~", "cd"], explanation: "`~` is a special character representing the home directory. Running `cd` without any arguments also takes you to the home directory.\n<span class='text--muted'>(Assume you have returned to the home directory)</span>", output: "" }
              ]
          },
          "scenario-basic": {
              name: "Scenario: Project Setup",
              problems: [
                  {
                      id: 1,
                      type: "scenario",
                      "objective": "Perform initial setup for a new web project",
                      steps: [
                          { id: "1-1", question: "First, create a directory named 'my-website'.", answers: ["mkdir my-website"], successMessage: "Created 'my-website' directory." },
                          { id: "1-2", question: "Next, navigate into the created 'my-website' directory.", answers: ["cd my-website"], successMessage: "Current directory is now 'my-website'." },
                          { id: "1-3", question: "Inside this directory, create two empty files named 'index.html' and 'style.css'.", answers: ["touch index.html style.css", "touch style.css index.html"], successMessage: "Created two files." },
                          { id: "1-4", question: "Finally, display a detailed list of files in the current directory to verify they were created correctly.", answers: ["ls -l"], output: "-rw-r--r-- 1 user user 0 Sep 11 13:30 index.html\n-rw-r--r-- 1 user user 0 Sep 11 13:30 style.css" }
                      ],
                      finalMessage: "Well done! The initial project setup is complete."
                  }
              ]
          },
          "scenario-file-management": {
              name: "Scenario: File Organization",
              problems: [
                  {
                      id: 2,
                      type: "scenario",
                      objective: "Organize various files by type",
                      steps: [
                          { id: "2-1", question: "Create a 'downloads' directory for your work.", answers: ["mkdir downloads"], successMessage: "Created 'downloads' directory." },
                          { id: "2-2", question: "Navigate into the created 'downloads' directory.", answers: ["cd downloads"], successMessage: "Moved into 'downloads'." },
                          { id: "2-3", question: "Create three files to be organized: 'report.docx', 'photo.jpg', and 'temp.log'.", answers: ["touch report.docx photo.jpg temp.log"], successMessage: "Created three files." },
                          { id: "2-4", question: "Create 'documents' and 'images' directories at once to store the files.", answers: ["mkdir documents images"], successMessage: "Created two directories." },
                          { id: "2-5", question: "Move 'report.docx' into the 'documents' directory.", answers: ["mv report.docx documents"], successMessage: "Moved file to 'documents'." },
                          { id: "2-6", question: "Rename 'photo.jpg' to 'family_photo.jpg'.", answers: ["mv photo.jpg family_photo.jpg"], successMessage: "Renamed the file." },
                          { id: "2-7", question: "Move the renamed 'family_photo.jpg' into the 'images' directory.", answers: ["mv family_photo.jpg images"], successMessage: "Moved file to 'images'." },
                          { id: "2-8", question: "Delete the unnecessary 'temp.log' file.", answers: ["rm temp.log"], successMessage: "Deleted 'temp.log'." },
                          { id: "2-9", question: "Finally, run `ls` to confirm the organized directory list.", answers: ["ls"], output: "documents  images" }
                      ],
                      finalMessage: "Excellent! File organization is complete."
                  }
              ]
          },
          "scenario-permissions": {
              name: "Scenario: Permission Management",
              problems: [
                  {
                      id: 3,
                      type: "scenario",
                      objective: "Grant execution permission to a script file",
                      steps: [
                          { id: "3-1", question: "Create a 'scripts' directory to manage scripts and navigate into it.", answers: ["mkdir scripts && cd scripts"], successMessage: "Created and moved into 'scripts'." },
                          { id: "3-2", question: "Create a new script file named 'deploy.sh'.", answers: ["touch deploy.sh"], successMessage: "Created 'deploy.sh'." },
                          { id: "3-3", question: "First, run `ls -l` to check the current permissions.", answers: ["ls -l"], output: "-rw-r--r-- 1 user user 0 Sep 11 14:00 deploy.sh" },
                          { id: "3-4", question: "Add execute permission to the 'deploy.sh' file.", answers: ["chmod +x deploy.sh", "chmod 755 deploy.sh"], successMessage: "Granted execute permission." },
                          { id: "3-5", question: "Run `ls -l` again to confirm that the permissions have been changed correctly.", answers: ["ls -l"], output: "-rwxr-xr-x 1 user user 0 Sep 11 14:00 deploy.sh" }
                      ],
                      finalMessage: "Perfect! The script is now ready to be executed."
                  }
              ]
          },
          "scenario-redirect": {
              name: "Scenario: Configuration Backup",
              problems: [
                  {
                      id: 4,
                      type: "scenario",
                      objective: "Check the content of a configuration file and create a backup using redirection",
                      steps: [
                          { id: "4-1", question: "Create a 'config' directory for configuration files and navigate into it.", answers: ["mkdir config && cd config"], successMessage: "Created and moved into 'config'." },
                          { id: "4-2", question: "Create a configuration file named 'server.conf'.", answers: ["touch server.conf"], successMessage: "'server.conf' を作成しました。" },
                          { id: "4-3", question: "First, run `cat server.conf` to check the contents of the configuration file. (Content is set automatically)", answers: ["cat server.conf"], output: "HOSTNAME=prod-server\nPORT=8080" },
                          { id: "4-4", question: "Use `cat` and redirection `>` to write the content of `server.conf` to a new file named `server.conf.bak`.", answers: ["cat server.conf > server.conf.bak"], successMessage: "Created a backup file using redirection." },
                          { id: "4-5", question: "Run `ls` to confirm that the backup has been created.", answers: ["ls"], output: "server.conf  server.conf.bak" }
                      ],
                      finalMessage: "Great job! You are mastering redirection."
                  }
              ]
          }
      }
    }
  };


  /**
   * @class UIManager
   * UIの描画やDOM操作を管理するクラス
   */
  class UIManager {
    constructor(appController) {
      this.appController = appController;
      this.dom = {};
      this._cacheDOMElements();
    }

    /**
     * 頻繁に使用するDOM要素をキャッシュする
     * @private
     */
    _cacheDOMElements() {
      for (const [key, selector] of Object.entries(CONFIG.SELECTORS)) {
        const elements = document.querySelectorAll(selector);
        this.dom[key] = elements.length > 1 ? Array.from(elements) : elements[0];
      }
    }

    /**
     * ターミナル画面にテキストを出力する
     * @param {string} [text=''] - 出力するテキスト
     * @param {string} [className=''] - テキストに適用するCSSクラス名
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
     * 新しいプロンプト行を作成し、入力フィールドを返す
     * @param {string} promptText - プロンプトに表示するテキスト
     * @returns {HTMLInputElement} 作成された入力フィールド
     */
    createNewPromptLine(promptText) {
      const promptLine = document.createElement('div');
      promptLine.className = 'terminal__prompt-line';

      const prompt = document.createElement('span');
      prompt.className = 'terminal__prompt';
      prompt.textContent = promptText;

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
     * 入力フィールドをロック（無効化）し、入力されたコマンドをテキストとして表示する
     * @param {HTMLInputElement} inputElement - ロックする入力フィールド
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
     * @param {object} problem - 表示する問題オブジェクト
     * @param {number} currentIndex - 現在の問題インデックス
     * @param {number} totalProblems - 全問題数
     * @param {number} [stepIndex=0] - シナリオ問題の場合のステップインデックス
     */
    updateProblemDisplay(problem, currentIndex, totalProblems, stepIndex = 0) {
      const currentLang = this.appController.currentLang;
      const i18n = I18N[currentLang];

      if (!problem) {
        this.dom.problemElement.innerHTML = i18n.messages.ALL_COMPLETE;
        return;
      }
      const { PROBLEM_NUM, HINT } = CONFIG.CSS_CLASSES;
      let html = `<span class="${PROBLEM_NUM}">${i18n.problemLabel} ${currentIndex + 1} / ${totalProblems}:</span><br>`;

      if (problem.type === 'scenario') {
          html += `<b>${i18n.objectiveLabel}: ${problem.objective}</b><br><br>`;
          html += `<span class="${HINT}">${i18n.stepLabel} ${stepIndex + 1} / ${problem.steps.length}:</span><br>${problem.steps[stepIndex].question}`;
      } else {
          html += problem.question;
      }
      this.dom.problemElement.innerHTML = html;
    }

    /**
     * 解答表示エリアをクリアする
     */
    clearSolutionDisplay() {
      this.dom.solutionDisplayElement.innerHTML = '';
      this.dom.solutionDisplayElement.style.display = 'none';
    }

    /**
     * 解答表示エリアに問題の答えや解説を表示する
     * @param {object} problem - 解答を表示する問題オブジェクト
     * @param {boolean} [isScenario=false] - シナリオ問題かどうか
     * @param {number} [stepIndex=0] - シナリオ問題のステップインデックス
     */
    showSolutionDisplay(problem, isScenario = false, stepIndex = 0) {
      const currentLang = this.appController.currentLang;
      const i18n = I18N[currentLang];
      const { SUCCESS, EXPLANATION } = CONFIG.CSS_CLASSES;
      let solutionText = '';

      let problemToShow = problem;
      if (isScenario && problem && problem.steps) {
          problemToShow = problem.steps[stepIndex];
      }

      if (problemToShow) {
        const answers = problemToShow.answers.join(' / ');
        solutionText += `<span class="${SUCCESS}">${i18n.answerLabel}: ${answers}</span><br>`;
        if (problemToShow.explanation) solutionText += `<span class="${EXPLANATION}">${i18n.explanationLabel}: ${problemToShow.explanation}</span><br>`;
        if (problemToShow.output) solutionText += `<span class="${EXPLANATION}">${i18n.outputLabel}<br>${problemToShow.output}</span>`;
      } else {
        solutionText = `<span class="${SUCCESS}">${i18n.messages.ALL_COMPLETE}</span>`;
      }
      this.dom.solutionDisplayElement.innerHTML = solutionText;
      this.dom.solutionDisplayElement.style.display = 'block';
    }

    /**
     * 問題一覧ナビゲーションを描画する
     * @param {Array<object>} problems - 全問題の配列
     * @param {Function} jumpToProblemCallback - 問題クリック時に実行するコールバック関数
     */
    renderProblemNavigation(problems, jumpToProblemCallback) {
      this.dom.problemNavList.innerHTML = '';
      const fragment = document.createDocumentFragment();

      // 問題セット名で問題をグループ化する
      const groupedProblems = problems.reduce((acc, problem, index) => {
          const setName = problem.setName || 'Other Problems';
          if (!acc[setName]) {
              acc[setName] = [];
          }
          acc[setName].push({ ...problem, originalIndex: index });
          return acc;
      }, {});

      // グループごとにナビゲーションボタンを生成
      for (const setName in groupedProblems) {
          const groupContainer = document.createElement('div');
          groupContainer.className = 'problem-nav-group';

          const groupTitle = document.createElement('h4');
          groupTitle.className = 'problem-nav-group__title';
          groupTitle.textContent = setName;
          groupContainer.appendChild(groupTitle);

          groupedProblems[setName].forEach(problemData => {
              const navBtn = document.createElement('button');
              navBtn.className = 'problem-nav-btn';
              navBtn.textContent = problemData.id;
              navBtn.dataset.problemIndex = problemData.originalIndex;
              navBtn.title = problemData.question || problemData.objective;
              navBtn.addEventListener('click', (e) => jumpToProblemCallback(e));
              groupContainer.appendChild(navBtn);
          });
          fragment.appendChild(groupContainer);
      }

      this.dom.problemNavList.appendChild(fragment);
    }

    /**
     * 問題一覧ナビゲーションの表示状態（現在位置、完了、ブックマーク）を更新する
     * @param {Array<object>} problems - 全問題の配列
     * @param {number} currentIndex - 現在の問題インデックス
     * @param {Set<string>} bookmarkedIds - ブックマークされた問題IDのセット
     * @param {Function} getUniqueIdCallback - 問題オブジェクトからユニークIDを取得するコールバック
     */
    updateProblemNavigation(problems, currentIndex, bookmarkedIds, getUniqueIdCallback) {
      const { CURRENT, COMPLETED, BOOKMARKED } = CONFIG.CSS_CLASSES;
      const navBtns = this.dom.problemNavList.querySelectorAll('.problem-nav-btn');
      navBtns.forEach(btn => {
          const index = parseInt(btn.dataset.problemIndex, 10);
          const problem = problems[index];
          btn.classList.remove(CURRENT, COMPLETED, BOOKMARKED);

          if (index < currentIndex) btn.classList.add(COMPLETED);
          else if (index === currentIndex) btn.classList.add(CURRENT);

          const uniqueId = getUniqueIdCallback(problem);
          if (uniqueId && bookmarkedIds.has(uniqueId)) {
              btn.classList.add(BOOKMARKED);
          }
      });

      // 進捗バーを更新
      const total = problems.length;
      const completedCount = Math.min(currentIndex, total);
      const progressPercent = total > 0 ? (completedCount / total) * 100 : 0;

      if (this.dom.progressText && this.dom.progressBar) {
          const format = this.dom.progressText.dataset.i18nFormat;
          this.dom.progressText.textContent = format
              .replace('{0}', completedCount)
              .replace('{1}', total);
        this.dom.progressBar.style.width = `${progressPercent}%`;
      }
    }

    /**
     * 新しいセッション開始時にUIをリセットする
     */
    resetUIForNewSession() {
      this.dom.screen.innerHTML = '';
      this.dom.problemElement.textContent = I18N[this.appController.currentLang].loading;
      this.dom.solutionDisplayElement.style.display = 'none';
      this.dom.problemNavList.innerHTML = '';
    }
  }

  /**
   * @class ThemeManager
   * アプリケーションのテーマ切り替えを管理するクラス
   */
  class ThemeManager {
      constructor(bodyElement, themeSelectElement) {
          this.body = bodyElement;
          this.themeSelect = themeSelectElement;
          this.THEME_CLASSES = Object.values(CONFIG.THEMES)
            .filter(t => t !== CONFIG.DEFAULT_THEME)
            .map(t => `${t}-theme`);
      }

      /**
       * 指定されたテーマを適用する
       * @param {string} themeName - 適用するテーマ名
       */
      applyTheme(themeName) {
          this.body.classList.remove(...this.THEME_CLASSES);
          if (themeName !== CONFIG.DEFAULT_THEME) {
              this.body.classList.add(`${themeName}-theme`);
          }
          this.themeSelect.value = themeName;
      }

      /**
       * 現在のテーマをローカルストレージに保存する
       * @param {string} themeName - 保存するテーマ名
       */
      saveTheme(themeName) {
          localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, themeName);
      }

      /**
       * ローカルストレージから保存されたテーマを読み込んで適用する
       */
      loadSavedTheme() {
          const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || CONFIG.DEFAULT_THEME;
          this.applyTheme(savedTheme);
      }
  }

  /**
   * @class LayoutManager
   * サイドバーのリサイズなど、レイアウトに関する機能を管理するクラス
   */
  class LayoutManager {
      constructor(domElements) {
          this.dom = domElements;
      }

      /**
       * レイアウト関連の機能を初期化する
       */
      initialize() {
          this.initSidebarResizer();
          this.initTerminalHeightSync();
      }

      /**
       * サイドバーの幅をリサイズ可能にする機能を初期化する
       * @private
       */
      initSidebarResizer() {
          const { resizer, mainContent, body } = this.dom;

          // 保存されたサイドバーの幅を復元
          const savedWidth = localStorage.getItem(CONFIG.STORAGE_KEYS.SIDEBAR_WIDTH);
          if (savedWidth) {
              mainContent.style.gridTemplateColumns = `${savedWidth} 4px 1fr`;
          }

          // マウス移動でリサイズする処理
          const resize = (e) => {
              e.preventDefault();
              const rect = mainContent.getBoundingClientRect();
              let newWidth = e.clientX - rect.left;
              if (newWidth < CONFIG.MIN_SIDEBAR_WIDTH) newWidth = CONFIG.MIN_SIDEBAR_WIDTH;
              mainContent.style.gridTemplateColumns = `${newWidth}px 4px 1fr`;
          };

          // リサイズ終了時の処理
          const stopResize = () => {
              window.removeEventListener('mousemove', resize);
              window.removeEventListener('mouseup', stopResize);
              body.classList.remove(CONFIG.CSS_CLASSES.RESIZING);
              const currentWidth = mainContent.style.gridTemplateColumns.split(' ')[0];
              localStorage.setItem(CONFIG.STORAGE_KEYS.SIDEBAR_WIDTH, currentWidth);
          };

          // リサイズ開始のイベントリスナー
          resizer.addEventListener('mousedown', (e) => {
              e.preventDefault();
              window.addEventListener('mousemove', resize);
              window.addEventListener('mouseup', stopResize);
              body.classList.add(CONFIG.CSS_CLASSES.RESIZING);
          });
      }

      /**
       * ターミナルと問題カードの高さを同期させる機能を初期化する
       * @private
       */
      initTerminalHeightSync() {
          const { problemCard, terminal } = this.dom;
          // ターミナルの高さが変更されたら、問題カードの高さも同じにする
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
   * @class TerminalApp
   * コマンド学習のメインアプリケーションロジックを管理するクラス
   */
  class TerminalApp {
    constructor(commandSetName, problems, uiManager, isFirstLoad = false, lang) {
      this.commandSetName = commandSetName;
      this.problems = problems;
      this.ui = uiManager;
      this.isFirstLoad = isFirstLoad;
      this.lang = lang;
      this.i18n = I18N[lang];
      this.bookmarkStorageKey = `${CONFIG.STORAGE_KEYS.BOOKMARK_PREFIX}_${this.commandSetName}`;

      this._initState();
      this._init();
    }

    /**
     * アプリケーションの状態を初期化する
     * @private
     */
    _initState() {
      this.state = {
        currentProblemIndex: 0,
        commandHistory: [],
        historyPointer: -1,
        currentInput: null,
        bookmarkedProblemIds: new Set(),
        isScenarioMode: false,
        currentStepIndex: 0,
        virtualFileSystem: this._createInitialVFS(), // 仮想ファイルシステム
        currentWorkingDirectory: '~', // 現在のディレクトリ
      };
    }

    /**
     * 仮想ファイルシステムの初期状態を作成する
     * @private
     * @returns {object} 初期化された仮想ファイルシステムオブジェクト
     */
    _createInitialVFS() {
      return {
          '~': { type: 'directory', children: {} }
      };
    }

    /**
     * 仮想ファイルシステムのノード（ファイルまたはディレクトリ）を作成する
     * @private
     */
    _createVFSNode(type, content = '', permissions = 'rw-r--r--') {
      const node = { type, permissions };
      if (type === 'directory') {
          node.children = {};
      } else {
          node.content = content;
      }
      return node;
    }

    /**
     * TerminalAppの初期化処理
     * @private
     */
    async _init() {
      this._loadBookmarks();
      this.ui.renderProblemNavigation(this.problems, (e) => this._jumpToProblem(e));
      this._bindEvents();
      if (this.isFirstLoad) {
        await this._playBootAnimation(false);
      }
      this._displayCurrentProblem();
      this._printWelcomeMessages();
      this.state.currentInput = this._createNewPromptLine();
    }

    /**
     * 新しいプロンプト行を作成し、入力フィールドを返す（カレントディレクトリパス付き）
     * @private
     * @returns {HTMLInputElement} 作成された入力フィールド
     */
    _createNewPromptLine() {
        const path = this.state.currentWorkingDirectory;
        const promptText = `${CONFIG.PROMPT_BASE_TEXT}${path}$ `;
        return this.ui.createNewPromptLine(promptText);
    }

    /**
     * UI要素にイベントリスナーをバインドする
     * @private
     */
    _bindEvents() {
      const { prevBtn, nextBtn, showAnsBtn, resetBtn, screen, bookmarkCheck } = this.ui.dom;

      this._eventHandlers = {
          handlePrevClick: () => this._prevProblem(),
          handleNextClick: () => this._nextProblem(),
          handleShowAnsClick: () => this.ui.showSolutionDisplay(
              this.problems[this.state.currentProblemIndex],
              this.state.isScenarioMode,
              this.state.currentStepIndex
          ),
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
     * このインスタンスが不要になった際にイベントリスナーを削除する
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
     * ユーザーが入力したコマンドを処理する
     * @param {string} command - 入力されたコマンド文字列
     * @private
     */
    _handleCommandInput(command) {
      this._addCommandToHistory(command);
      this.ui.clearSolutionDisplay();

      if (this.state.isScenarioMode) {
          this._handleScenarioInput(command);
      } else {
          this._handleStandardInput(command);
      }

      if(this.state.currentProblemIndex < this.problems.length) {
          this.state.currentInput = this._createNewPromptLine();
      }
    }

    /**
     * シナリオモードでのコマンド入力を処理する
     * @param {string} command - 入力されたコマンド文字列
     * @private
     */
    _handleScenarioInput(command) {
      const currentProblem = this.problems[this.state.currentProblemIndex];
      const currentStep = currentProblem.steps[this.state.currentStepIndex];

      if (this._isAnswerCorrect(command, currentStep.answers)) {
          // コマンド実行をシミュレーションして仮想ファイルシステムを更新
          this._simulateCommandEffect(command);
          if (currentStep.successMessage) {
            this.ui.printToScreen(currentStep.successMessage, CONFIG.CSS_CLASSES.SUCCESS);
          }
          if(currentStep.output) {
              this.ui.printToScreen(currentStep.output, CONFIG.CSS_CLASSES.EXPLANATION);
          }

          this.state.currentStepIndex++;

          // シナリオの全ステップが完了したかチェック
          if (this.state.currentStepIndex >= currentProblem.steps.length) {
              this.ui.printToScreen(`\n${currentProblem.finalMessage}\n`, CONFIG.CSS_CLASSES.SUCCESS);
              this.state.isScenarioMode = false;
              this.state.currentProblemIndex++;
              this._displayCurrentProblem();
          } else {
              this.ui.updateProblemDisplay(currentProblem, this.state.currentProblemIndex, this.problems.length, this.state.currentStepIndex);
          }
      } else {
          this.ui.printToScreen(this.i18n.messages.SCENARIO_INCORRECT, CONFIG.CSS_CLASSES.ERROR);
      }
    }

    /**
     * 通常モードでのコマンド入力を処理する
     * @param {string} command - 入力されたコマンド文字列
     * @private
     */
    _handleStandardInput(command) {
      const currentProblem = this.problems[this.state.currentProblemIndex];
      if (!currentProblem) {
        this.ui.printToScreen("All problems have been completed. Please reset.", CONFIG.CSS_CLASSES.ERROR);
      } else if (this._isAnswerCorrect(command, currentProblem.answers)) {
        if (currentProblem.output) {
          this.ui.printToScreen(currentProblem.output, CONFIG.CSS_CLASSES.EXPLANATION);
        }
        this.state.currentProblemIndex++;
        this._displayCurrentProblem();
      } else {
        this.ui.printToScreen(`bash: ${command}: command not correct`, CONFIG.CSS_CLASSES.ERROR);
      }
    }

    /**
     * 入力されたコマンドが正解かどうかを判定する
     * @param {string} input - ユーザーの入力
     * @param {Array<string>} answers - 正解の配列
     * @returns {boolean} 正解ならtrue
     * @private
     */
    _isAnswerCorrect(input, answers) {
      const normalize = (s) => s.trim().replace(/\s+/g, ' ');
      const normalizedInput = normalize(input);
      return answers.some((answer) => normalize(answer) === normalizedInput);
    }

    /**
     * 指定されたインデックスの問題に切り替える
     * @param {number} newIndex - 切り替え先のインデックス
     * @private
     */
    _changeProblem(newIndex) {
      this.ui.clearSolutionDisplay();
      this.state.currentProblemIndex = newIndex;
      this._displayCurrentProblem();
      this.state.currentInput?.focus();
    }

    /** 前の問題へ */
    _prevProblem() { this._moveProblem(-1, this.i18n.messages.PREV_PROBLEM_SUCCESS, this.i18n.messages.PREV_PROBLEM_FAIL); }
    /** 次の問題へ */
    _nextProblem() { this._moveProblem(1, this.i18n.messages.NEXT_PROBLEM_SUCCESS, this.i18n.messages.NEXT_PROBLEM_FAIL); }

    /**
     * 問題を前後に移動する汎用メソッド
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
     * 問題一覧ナビゲーションから特定の問題にジャンプする
     * @param {Event} event - クリックイベント
     * @private
     */
    _jumpToProblem(event) {
      const newIndex = parseInt(event.target.dataset.problemIndex, 10);
      this._changeProblem(newIndex);
      this.ui.printToScreen(`\n(${this.i18n.messages.JUMP_TO_PROBLEM(newIndex + 1)})\n`, CONFIG.CSS_CLASSES.MUTED);
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
      this.state.currentInput = this._createNewPromptLine();
    }

    /**
     * 現在の問題を画面に表示する
     * @private
     */
    _displayCurrentProblem() {
      const { currentProblemIndex } = this.state;
      const currentProblem = this.problems[currentProblemIndex];

      this.state.isScenarioMode = false;
      this.state.currentStepIndex = 0;
      this.ui.clearSolutionDisplay();

      if (currentProblem) {
          // シナリオ問題の場合、モードを切り替え、仮想ファイルシステムをリセット
          if (currentProblem.type === 'scenario') {
              this.state.isScenarioMode = true;
              this.state.virtualFileSystem = this._createInitialVFS();
              this.state.currentWorkingDirectory = '~';
          }
          this.ui.updateProblemDisplay(currentProblem, currentProblemIndex, this.problems.length, this.state.currentStepIndex);

          // ブックマーク状態を更新
          const uniqueId = this._getUniqueProblemId(currentProblem);
          this.ui.dom.bookmarkCheck.checked = uniqueId ? this.state.bookmarkedProblemIds.has(uniqueId) : false;
          this.ui.dom.bookmarkCheck.disabled = this.state.isScenarioMode;
      } else {
          // 全ての問題が完了した場合
          this.ui.updateProblemDisplay(null);
          this.ui.dom.bookmarkCheck.checked = false;
          this.ui.dom.bookmarkCheck.disabled = true;
      }
      this._updateProblemNavigation();
    }

    /**
     * 問題一覧ナビゲーションの表示を更新する
     * @private
     */
    _updateProblemNavigation() {
      this.ui.updateProblemNavigation(this.problems, this.state.currentProblemIndex, this.state.bookmarkedProblemIds, (problem) => this._getUniqueProblemId(problem));
    }

    /**
     * 問題オブジェクトからユニークなIDを生成する
     * @param {object} problem - 問題オブジェクト
     * @returns {string|null} ユニークID（例: "ls:1"）
     * @private
     */
    _getUniqueProblemId(problem) {
      if (!problem || typeof problem.commandKey === 'undefined' || typeof problem.id === 'undefined') return null;
      return `${problem.commandKey}:${problem.id}`;
    }

    /**
     * ターミナル画面でのキーボード入力を処理する
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
        case 'ArrowUp': e.preventDefault(); this._navigateHistory(input, 'up'); break;
        case 'ArrowDown': e.preventDefault(); this._navigateHistory(input, 'down'); break;
        case 'l': if (e.ctrlKey) { e.preventDefault(); this.ui.dom.screen.innerHTML = ''; this.state.currentInput = this._createNewPromptLine(); } break;
      }
    }

    /**
     * コマンド履歴に入力を追加する
     * @param {string} command - 追加するコマンド
     * @private
     */
    _addCommandToHistory(command) {
      if (!command) return;
      this.state.commandHistory.push(command);
      if (this.state.commandHistory.length > CONFIG.TERMINAL_HISTORY_LIMIT) this.state.commandHistory.shift();
      this.state.historyPointer = this.state.commandHistory.length;
    }

    /**
     * コマンド履歴を上下キーで辿る
     * @param {HTMLInputElement} inputElement - 入力フィールド
     * @param {'up'|'down'} direction - 辿る方向
     * @private
     */
    _navigateHistory(inputElement, direction) {
      const { commandHistory } = this.state;
      if (commandHistory.length === 0) return;
      if (direction === 'up' && this.state.historyPointer > 0) this.state.historyPointer--;
      else if (direction === 'down' && this.state.historyPointer < commandHistory.length) this.state.historyPointer++;
      inputElement.value = commandHistory[this.state.historyPointer] || '';
    }

    /**
     * ローカルストレージからブックマークを読み込む
     * @private
     */
    _loadBookmarks() {
      try {
        const savedBookmarks = localStorage.getItem(this.bookmarkStorageKey) || '[]';
        this.state.bookmarkedProblemIds = new Set(JSON.parse(savedBookmarks));
      } catch (e) { console.error("Failed to parse bookmarks:", e); this.state.bookmarkedProblemIds = new Set(); }
    }

    /**
     * 現在のブックマーク状態をローカルストレージに保存する
     * @private
     */
    _saveBookmarks() {
      localStorage.setItem(this.bookmarkStorageKey, JSON.stringify(Array.from(this.state.bookmarkedProblemIds)));
    }

    /**
     * 現在の問題のブックマーク状態を切り替える
     * @private
     */
    _toggleBookmark() {
      const currentProblem = this.problems[this.state.currentProblemIndex];
      if (!currentProblem || this.state.isScenarioMode) return;
      const uniqueId = this._getUniqueProblemId(currentProblem);
      if (!uniqueId) return;
      this.ui.dom.bookmarkCheck.checked ? this.state.bookmarkedProblemIds.add(uniqueId) : this.state.bookmarkedProblemIds.delete(uniqueId);
      this._saveBookmarks();
      this._updateProblemNavigation();
      const sidebarLabel = document.getElementById(`sidebar-problem-${currentProblem.commandKey}-${currentProblem.id}`);
      if (sidebarLabel) sidebarLabel.classList.toggle(CONFIG.CSS_CLASSES.BOOKMARKED, this.ui.dom.bookmarkCheck.checked);
    }

    /**
     * 仮想ファイルシステム内でパスを解決する
     * @private
     */
    _resolvePath(path, startNode = this.state.virtualFileSystem['~']) {
        if (path.startsWith('~/')) {
            path = path.substring(2);
        } else if (path === '~') {
            return this.state.virtualFileSystem['~'];
        }

        let current = startNode;
        const parts = path.split('/').filter(p => p);
        for (const part of parts) {
            if (current && current.type === 'directory' && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        return current;
    }

    /**
     * シナリオ問題で実行されたコマンドの効果を仮想ファイルシステムに反映させる
     * @param {string} command - 実行されたコマンド
     * @private
     */
    _simulateCommandEffect(command) {
      const parts = command.trim().split(/\s+/);
      const cmd = parts[0];
      const cwdNode = this._resolvePath(this.state.currentWorkingDirectory);

      switch(cmd) {
          case 'mkdir':
              for (let i = 1; i < parts.length; i++) {
                  cwdNode.children[parts[i]] = this._createVFSNode('directory');
              }
              break;
          case 'touch':
              for (let i = 1; i < parts.length; i++) {
                  let content = '';
                  if (parts[i] === 'server.conf') content = "HOSTNAME=prod-server\nPORT=8080";
                  cwdNode.children[parts[i]] = this._createVFSNode('file', content);
              }
              break;
          case 'cd':
              const targetDir = parts[1];
              if (cwdNode.children[targetDir] && cwdNode.children[targetDir].type === 'directory') {
                  this.state.currentWorkingDirectory += `/${targetDir}`;
              }
              break;
          case 'mv':
              const source = parts[1];
              const dest = parts[2];
              if (cwdNode.children[source]) {
                  const destNode = cwdNode.children[dest];
                  if (destNode && destNode.type === 'directory') {
                      destNode.children[source] = cwdNode.children[source];
                  } else {
                      cwdNode.children[dest] = cwdNode.children[source];
                  }
                  delete cwdNode.children[source];
              }
              break;
          case 'rm':
              if (cwdNode.children[parts[1]]) {
                  delete cwdNode.children[parts[1]];
              }
              break;
          case 'chmod':
              const targetFile = parts[2];
              if (cwdNode.children[targetFile]) {
                  cwdNode.children[targetFile].permissions = 'rwxr-xr-x';
              }
              break;
          case 'cat':
              const redirectIndex = parts.indexOf('>');
              if (redirectIndex > -1) {
                  const sourceFile = parts[redirectIndex - 1];
                  const destFile = parts[redirectIndex + 1];
                  if (cwdNode.children[sourceFile] && cwdNode.children[sourceFile].type === 'file') {
                      const content = cwdNode.children[sourceFile].content;
                      cwdNode.children[destFile] = this._createVFSNode('file', content);
                  }
              }
              break;
      }
      // "&&" を使った複合コマンドの簡易的な対応
      if (command.includes('&&')) {
          const commands = command.split('&&').map(c => c.trim());
          if (commands[0].startsWith('mkdir') && commands[1].startsWith('cd')) {
              const dirName = commands[0].split(' ')[1];
              cwdNode.children[dirName] = this._createVFSNode('directory');
              this.state.currentWorkingDirectory += `/${dirName}`;
          }
      }
    }

    /**
     * ターミナルにウェルカムメッセージを表示する
     * @private
     */
    _printWelcomeMessages() {
      const { SUCCESS } = CONFIG.CSS_CLASSES;
      this.ui.printToScreen('# Welcome to Command Trainer!', SUCCESS);
      this.ui.printToScreen('# Enter a command and press Enter.', SUCCESS);
      this.ui.printToScreen('# If correct, you will proceed to the next problem.', SUCCESS);
      this.ui.printToScreen('');
    }

    /**
     * ターミナルの起動アニメーションを再生する
     * @param {boolean} [isReboot=false] - 再起動アニメーションかどうか
     * @private
     */
    async _playBootAnimation(isReboot = false) {
      const bootSequence = [
        { text: 'Booting Linux Learning Environment...', delay: 50 }, { text: '[    0.023456] Loading kernel modules...', delay: 100 }, { text: '[    0.123456] Loading problem sets...', delay: 150 }, { text: '[    0.234567] Starting virtual file system...', delay: 150 }, { text: `[<span class="${CONFIG.CSS_CLASSES.SUCCESS}">  OK  </span>] Reached target Basic System.`, delay: 80 }, { text: `[<span class="${CONFIG.CSS_CLASSES.SUCCESS}">  OK  </span>] Started Learning Services.`, delay: 80 }, { text: `[<span class="${CONFIG.CSS_CLASSES.SUCCESS}">  OK  </span>] System ready - Created by kikkun.`, delay: 100 }, { text: '', delay: 200 },
      ];
      const rebootSequence = [
        { text: 'Rebooting system...', delay: 50 }, { text: '[    0.045678] Stopping Network Manager...', delay: 100 }, { text: '[    0.123456] Unmounting file systems...', delay: 150 }, { text: '[    0.234567] System shutdown complete.', delay: 200 }, { text: '', delay: 300 },
      ];
      const messagesToPlay = isReboot ? [...rebootSequence, ...bootSequence] : bootSequence;
      for (const msg of messagesToPlay) {
        this.ui.printToScreen(msg.text);
        await new Promise(resolve => setTimeout(resolve, msg.delay));
      }
    }
  }

  /**
   * @class WizardManager
   * 「My問題」の管理ウィザード（モーダル）の動作を管理するクラス
   */
  class WizardManager {
      constructor(appController) {
          this.appController = appController;
          this.ui = appController.ui;
          this.state = {
              currentStep: 1, // 現在のステップ
              stagedData: {}, // 編集中のカスタム問題データ
              initialData: {}, // ウィザードを開いた時点でのデータ
          };
          this._bindEvents();
      }

      /**
       * ウィザードを開く
       */
      open() {
          // 現在のカスタム問題データをディープコピーして保持
          this.state.initialData = JSON.parse(JSON.stringify(this.appController.customProblemData));
          this.state.stagedData = JSON.parse(JSON.stringify(this.appController.customProblemData));

          this.navigateToStep(1);
          this.ui.dom.wizardModal.classList.add(CONFIG.CSS_CLASSES.VISIBLE);
      }

      /**
       * ウィザードを閉じる
       */
      close() {
          this.ui.dom.wizardModal.classList.remove(CONFIG.CSS_CLASSES.VISIBLE);
          this.ui.dom.customProblemUpload.value = ''; // ファイル選択をリセット
      }

      /**
       * 指定されたステップに移動する
       * @param {number} stepNumber - 移動先のステップ番号
       */
      navigateToStep(stepNumber) {
          this.state.currentStep = stepNumber;

          // サイドバーの進捗表示を更新
          this.ui.dom.wizardProgressSteps.forEach(step => {
              const stepNum = parseInt(step.dataset.step, 10);
              step.classList.remove(CONFIG.CSS_CLASSES.ACTIVE, CONFIG.CSS_CLASSES.COMPLETED);
              if (stepNum < stepNumber) {
                  step.classList.add(CONFIG.CSS_CLASSES.COMPLETED);
              } else if (stepNum === stepNumber) {
                  step.classList.add(CONFIG.CSS_CLASSES.ACTIVE);
              }
          });

          // メインコンテンツの表示を切り替え
          this.ui.dom.wizardSteps.forEach(step => {
              step.classList.toggle(CONFIG.CSS_CLASSES.ACTIVE, parseInt(step.dataset.step, 10) === stepNumber);
          });

          // 各ステップの内容を描画
          if(stepNumber === 1) this._renderStep1();
          if(stepNumber === 2) this._renderStep2();
          if(stepNumber === 3) this._renderStep3();

          // フッターのボタン表示を制御
          this.ui.dom.wizardPrevBtn.style.display = (stepNumber === 1) ? 'none' : 'inline-flex';
          this.ui.dom.wizardNextBtn.style.display = (stepNumber === 3) ? 'none' : 'inline-flex';
          this.ui.dom.wizardCompleteBtn.style.display = (stepNumber === 3) ? 'inline-flex' : 'none';
      }

      /** ステップ1の表示を準備 */
      _renderStep1() {
        this.ui.dom.wizardUploadFeedback.innerHTML = '';
      }
      /** ステップ2の表示を準備（問題リストを描画） */
      _renderStep2() {
        this.renderCustomProblemsList(this.state.stagedData);
      }
      /** ステップ3の表示を準備（確認サマリーを描画） */
      _renderStep3() {
        this.renderConfirmationSummary();
      }

      /**
       * カスタム問題のリストをウィザード内に描画する
       * @param {object} data - 描画するカスタム問題データ
       */
      renderCustomProblemsList(data) {
          const { wizardProblemList } = this.ui.dom;

          if (Object.keys(data).length === 0) {
              wizardProblemList.innerHTML = I18N[this.appController.currentLang].messages.NO_CUSTOM_PROBLEMS;
              return;
          }

          let html = '';
          for (const [setKey, setData] of Object.entries(data)) {
              html += `
              <div class="wizard-problem-set" data-set-key="${setKey}">
                  <div class="wizard-problem-set__header">
                      <span>${setData.name}</span>
                      <button class="button button--danger button--icon" data-action="delete-set" title="Delete this problem set">×</button>
                  </div>
                  <ul class="wizard-problem-set__list">
              `;
              setData.problems.forEach(problem => {
                  const question = problem.question || problem.objective;
                  html += `
                      <li class="wizard-problem-item" data-problem-id="${problem.id}">
                          <span class="wizard-problem-item__text">
                              ID ${problem.id}: ${question.substring(0, 50)}...
                          </span>
                          <button class="button button--danger button--icon" data-action="delete-problem" title="Delete this problem">×</button>
                      </li>`;
              });
              html += '</ul></div>';
          }
          wizardProblemList.innerHTML = html;
      }

      /**
       * 変更内容のサマリーを描画する
       */
      renderConfirmationSummary() {
          const summaryEl = this.ui.dom.wizardConfirmationSummary;
          const initialKeys = new Set(Object.keys(this.state.initialData));
          const stagedKeys = new Set(Object.keys(this.state.stagedData));

          let addedSets = [...stagedKeys].filter(k => !initialKeys.has(k));
          let removedSets = [...initialKeys].filter(k => !stagedKeys.has(k));
          let modifiedSets = [...stagedKeys].filter(k => initialKeys.has(k));

          let html = '<ul>';
          let hasChanges = false;

          if(addedSets.length > 0) {
              hasChanges = true;
              html += `<li><strong class="${CONFIG.CSS_CLASSES.SUCCESS}">${I18N[this.appController.currentLang].currentLang === 'ja' ? '追加されたセット' : 'Added sets'}:</strong> ${addedSets.map(k => this.state.stagedData[k].name).join(', ')}</li>`;
          }
          if(removedSets.length > 0) {
              hasChanges = true;
              html += `<li><strong class="${CONFIG.CSS_CLASSES.ERROR}">${I18N[this.appController.currentLang].currentLang === 'ja' ? '削除されたセット' : 'Removed sets'}:</strong> ${removedSets.map(k => this.state.initialData[k].name).join(', ')}</li>`;
          }

          modifiedSets.forEach(key => {
              const initialProblems = this.state.initialData[key].problems.length;
              const stagedProblems = this.state.stagedData[key].problems.length;
              if(initialProblems !== stagedProblems) {
                  hasChanges = true;
                  html += `<li><strong class="${CONFIG.CSS_CLASSES.HINT}">${I18N[this.appController.currentLang].currentLang === 'ja' ? '変更されたセット' : 'Modified set'} "${this.state.stagedData[key].name}":</strong> Problem count will change from ${initialProblems} to ${stagedProblems}.</li>`;
              }
          });

          if (!hasChanges) {
              html += `<li>${I18N[this.appController.currentLang].currentLang === 'ja' ? '変更はありません。' : 'No changes detected.'}</li>`;
          }

          html += '</ul>';
          summaryEl.innerHTML = html;
      }

      /**
       * ウィザード関連のイベントリスナーをバインドする
       * @private
       */
      _bindEvents() {
          const { openWizardBtn, closeWizardBtn, wizardModal, wizardProblemList, customProblemUpload, wizardPrevBtn, wizardNextBtn, wizardCompleteBtn, wizardDeleteAllBtn } = this.ui.dom;

          openWizardBtn.addEventListener('click', () => this.open());
          closeWizardBtn.addEventListener('click', () => this.close());
          wizardPrevBtn.addEventListener('click', () => this.navigateToStep(this.state.currentStep - 1));
          wizardNextBtn.addEventListener('click', () => this.navigateToStep(this.state.currentStep + 1));
          wizardCompleteBtn.addEventListener('click', () => {
              this.appController.commitWizardChanges(this.state.stagedData);
              this.close();
          });

          // モーダルの外側クリックで閉じる
          wizardModal.addEventListener('click', (e) => {
              if (e.target === wizardModal) this.close();
          });

          customProblemUpload.addEventListener('change', (e) => this._handleFileUpload(e));

          wizardDeleteAllBtn.addEventListener('click', () => {
              this.state.stagedData = {};
              this._renderStep2();
          });

          // 問題リスト内のイベント（アコーディオン、削除）
          wizardProblemList.addEventListener('click', (e) => {
              const target = e.target;
              const problemSetEl = target.closest('.wizard-problem-set');
              if (!problemSetEl) return;

              // ヘッダー部分（ボタン以外）をクリックで開閉
              if(target.closest('.wizard-problem-set__header') && !target.matches('button')) {
                 problemSetEl.classList.toggle('is-closed');
              }

              if (target.dataset.action === 'delete-set') {
                  this._handleDeleteSet(problemSetEl);
              } else if (target.dataset.action === 'delete-problem') {
                  const problemItemEl = target.closest('.wizard-problem-item');
                  this._handleDeleteProblem(problemSetEl, problemItemEl);
              }
          });
          this._bindTooltipEvents();
      }

      /**
       * JSONファイルのアップロードを処理する (複数ファイル対応に修正)
       * @param {Event} event - changeイベント
       * @private
       */
      _handleFileUpload(event) {
        const files = event.target.files;
        const feedbackEl = this.ui.dom.wizardUploadFeedback;
        const currentLang = this.appController.currentLang;
        const i18nMessages = I18N[currentLang].messages;
        
        if (files.length === 0) return;

        let successCount = 0;
        let failCount = 0;
        const failedFiles = [];

        const filePromises = Array.from(files).map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const customData = JSON.parse(e.target.result);
                        
                        // 検証 (stagedData全体とのキー重複チェック)
                        this.appController._validateCustomProblemData(customData, this.state.stagedData);

                        // 検証が通ったら stagedData にマージ
                        Object.assign(this.state.stagedData, customData);
                        successCount++;
                        resolve();
                    } catch (error) {
                        console.error(`Failed to load My Problems from ${file.name}:`, error);
                        failCount++;
                        // エラーメッセージからファイル名とエラー内容を記録
                        failedFiles.push(`${file.name} (${error.message || i18nMessages.FILE_READ_ERROR})`);
                        resolve(); 
                    }
                };
                reader.onerror = () => {
                    failCount++;
                    failedFiles.push(`${file.name} (${i18nMessages.FILE_READ_ERROR})`);
                    resolve();
                };
                reader.readAsText(file);
            });
        });

        // すべてのファイルの処理が完了するのを待つ
        Promise.all(filePromises).then(() => {
            let feedbackMessage = '';
            const SUCCESS = CONFIG.CSS_CLASSES.SUCCESS;
            const ERROR = CONFIG.CSS_CLASSES.ERROR;

            if (successCount > 0) {
                const successMsgKey = currentLang === 'ja' ? 'WIZARD_UPLOAD_SUCCESS_MULTI_JA' : 'WIZARD_UPLOAD_SUCCESS_MULTI_EN';
                feedbackMessage += `<span class="${SUCCESS}">${i18nMessages[successMsgKey](successCount)}</span>`;
            }
            
            if (failCount > 0) {
                const failMsgKey = currentLang === 'ja' ? 'WIZARD_UPLOAD_FAIL_MULTI_JA' : 'WIZARD_UPLOAD_FAIL_MULTI_EN';
                
                if (successCount > 0) {
                    feedbackMessage += `<br>`; // 成功と失敗の間に改行を入れる
                }
                
                feedbackMessage += `<span class="${ERROR}">${i18nMessages[failMsgKey](failCount)}</span>`;
                feedbackMessage += `<div style="margin-top: 5px; padding-left: 10px; color: var(--color-red-accent); font-size: 11px;">${failedFiles.join('<br>')}</div>`;
            }

            if (successCount === 0 && failCount > 0) {
                // 全て失敗した場合のフィードバック調整
                feedbackMessage = `<span class="${ERROR}">すべてのファイルの読み込みに失敗しました。詳細を確認してください。</span>`;
                feedbackMessage += `<div style="margin-top: 5px; padding-left: 10px; color: var(--color-red-accent); font-size: 11px;">${failedFiles.join('<br>')}</div>`;
            }


            feedbackEl.innerHTML = feedbackMessage;
            event.target.value = ''; // ファイル選択をリセット
        });
      }

      /**
       * JSONフォーマットのツールチップの表示イベントをバインドする
       * @private
       */
      _bindTooltipEvents() {
          const container = this.ui.dom.wizardModal.querySelector(CONFIG.SELECTORS.tooltipContainer);
          const tooltip = this.ui.dom.jsonFormatTooltip;
          if (container && tooltip) {
              container.addEventListener('mouseenter', () => tooltip.classList.add(CONFIG.CSS_CLASSES.VISIBLE));
              container.addEventListener('mouseleave', () => tooltip.classList.remove(CONFIG.CSS_CLASSES.VISIBLE));
          }
      }

      /**
       * 問題セットの削除を処理する
       * @private
       */
      _handleDeleteSet(problemSetEl) {
          const setKey = problemSetEl.dataset.setKey;
          delete this.state.stagedData[setKey];
          this._renderStep2();
      }

      /**
       * 個別の問題の削除を処理する
       * @private
       */
      _handleDeleteProblem(problemSetEl, problemItemEl) {
          const setKey = problemSetEl.dataset.setKey;
          const problemId = parseInt(problemItemEl.dataset.problemId, 10);
          // 問題をフィルタリングして削除
          this.state.stagedData[setKey].problems = this.state.stagedData[setKey].problems.filter(p => p.id !== problemId);
          // セット内の問題が0になったらセット自体を削除
          if (this.state.stagedData[setKey].problems.length === 0) {
              delete this.state.stagedData[setKey];
          }
          this._renderStep2();
      }
  }

  /**
   * @class AppController
   * アプリケーション全体を初期化し、各マネージャークラスを統括するクラス
   */
  class AppController {
    constructor() {
      this.currentLang = localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || CONFIG.DEFAULT_LANG;
      this.ui = new UIManager(this);
      this.themeManager = new ThemeManager(this.ui.dom.body, this.ui.dom.themeSelect);
      this.wizardManager = new WizardManager(this);
      this.initialProblemData = I18N[this.currentLang].problemData;
      this.customProblemData = this._loadCustomProblemsFromStorage();
      this.currentApp = null; // 現在実行中のTerminalAppインスタンス
      this.isFirstLoad = true; // 初回読み込みフラグ

      new LayoutManager(this.ui.dom).initialize();

      this._init();
    }

    /**
     * アプリケーションの初期化
     * @private
     */
    _init() {
      this._applyLanguage();
      this.themeManager.loadSavedTheme();
      this.renderSidebar();
      this._bindGlobalEvents();
      this.startNewSession();
    }

    /**
     * UIのテキストを選択された言語に更新する
     * @private
     */
    _applyLanguage() {
      const langData = I18N[this.currentLang];
      document.documentElement.lang = this.currentLang;
      document.querySelectorAll('[data-i18n-key]').forEach(el => {
          const key = el.dataset.i18nKey;
          if (langData[key] && typeof langData[key] === 'string') {
              el.textContent = langData[key];
          }
      });
      this.ui.dom.langSelect.value = this.currentLang;
    }

    /**
     * グローバルなイベントリスナー（テーマ・言語切り替えなど）をバインドする
     * @private
     */
    _bindGlobalEvents() {
      this.ui.dom.themeSelect.addEventListener('change', (e) => {
          this.themeManager.applyTheme(e.target.value);
          this.themeManager.saveTheme(e.target.value);
      });
      this.ui.dom.langSelect.addEventListener('change', (e) => {
          this.currentLang = e.target.value;
          localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, this.currentLang);
          this.initialProblemData = I18N[this.currentLang].problemData;
          this._applyLanguage();
          this.renderSidebar();
          this.startNewSession();
      });
    }

    /**
     * サイドバーの問題選択リストを描画する
     */
    renderSidebar() {
      const { problemSelectorList } = this.ui.dom;
      const i18n = I18N[this.currentLang];
      problemSelectorList.innerHTML = '';

      const fragment = document.createDocumentFragment();

      // 標準問題とシナリオ問題を分類
      const standardProblems = {};
      const scenarioProblems = {};
      Object.entries(this.initialProblemData).forEach(([key, data]) => {
          if (key.startsWith('scenario-')) {
              scenarioProblems[key] = data;
          } else {
              standardProblems[key] = data;
          }
      });

      // 標準問題を描画
      Object.entries(standardProblems).forEach(([key, data]) => {
        fragment.appendChild(this._createProblemGroupEl(key, data, true));
      });

      // シナリオ問題を描画
      if (Object.keys(scenarioProblems).length > 0) {
          fragment.appendChild(this._createScenarioSection(scenarioProblems));
      }

      // カスタム問題（My問題）を描画
      if (Object.keys(this.customProblemData).length > 0) {
        fragment.appendChild(this._createCustomProblemSection());
      }

      problemSelectorList.appendChild(fragment);

      // 親チェックボックスの状態を更新
      problemSelectorList.querySelectorAll('.command-group').forEach(group => {
        this._updateParentCheckboxState(group);
      });
    }

    /**
     * シナリオ問題のセクション（アコーディオン）を作成する
     * @private
     */
    _createScenarioSection(scenarioProblems) {
      const { CLOSED } = CONFIG.CSS_CLASSES;
      const scenarioContainer = document.createElement('div');
      scenarioContainer.className = `command-group ${CLOSED}`;

      const title = document.createElement('div');
      title.className = 'command-title';
      title.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') return;
        scenarioContainer.classList.toggle(CLOSED);
      });

      const groupCheckbox = document.createElement('input');
      groupCheckbox.type = 'checkbox';
      groupCheckbox.style.marginRight = '8px';

      const titleText = document.createElement('span');
      titleText.textContent = I18N[this.currentLang].scenarioCategory;

      title.append(groupCheckbox, titleText);

      const listContainer = document.createElement('div');
      listContainer.className = 'problem-checklist';
      listContainer.style.paddingLeft = '0';
      listContainer.style.margin = '0';

      Object.entries(scenarioProblems).forEach(([key, data]) => {
        listContainer.appendChild(this._createProblemGroupEl(key, data, false));
      });

      // 親チェックボックスで子要素を全選択/解除
      groupCheckbox.addEventListener('change', (e) => {
        listContainer.querySelectorAll('input[type="checkbox"]').forEach(child => child.checked = e.target.checked);
        this.startNewSession();
      });

      scenarioContainer.append(title, listContainer);
      return scenarioContainer;
    }

    /**
     * My問題のセクション（アコーディオン）を作成する
     * @private
     */
    _createCustomProblemSection() {
      const { CLOSED } = CONFIG.CSS_CLASSES;
      const customContainer = document.createElement('div');
      customContainer.className = `command-group`;

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
      titleText.textContent = I18N[this.currentLang].myProblemsCategory;

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
     * 1つの問題グループ（例: ls編）のDOM要素を作成する
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
     * 問題グループのタイトル部分のDOM要素を作成する
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
     * 個別の問題チェックボックスリストのDOM要素を作成する
     * @private
     */
    _createProblemList(commandKey, problems) {
      const { BOOKMARKED } = CONFIG.CSS_CLASSES;
      // ブックマーク情報を読み込み、サイドバーに反映
      const allBookmarksKey = `${CONFIG.STORAGE_KEYS.BOOKMARK_PREFIX}_customSelection`;
      const allBookmarkedIds = new Set(JSON.parse(localStorage.getItem(allBookmarksKey) || '[]'));
      const i18n = I18N[this.currentLang];
      
      const list = document.createElement('ul');
      list.className = 'problem-checklist';

      problems.forEach(problem => {
        const uniqueId = `${commandKey}:${problem.id}`;
        const listItem = document.createElement('li');
        const label = document.createElement('label');
        label.id = `sidebar-problem-${uniqueId.replace(':', '-')}`;
        if (allBookmarkedIds.has(uniqueId) && problem.type !== 'scenario') {
          label.classList.add(BOOKMARKED);
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.problemId = uniqueId;

        const text = document.createElement('span');
        const questionText = problem.question || problem.objective;
        text.textContent = `${i18n.problemLabel} ${problem.id}: ${questionText.substring(0, 20)}...`;

        label.append(checkbox, text);
        listItem.appendChild(label);
        list.appendChild(listItem);
      });
      return list;
    }

    /**
     * 問題グループのイベントリスナー（アコーディオン、チェックボックス）を設定する
     * @private
     */
    _attachGroupEventListeners(titleEl, groupEl, checkboxEl, listEl) {
      // タイトルクリックで開閉
      titleEl.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') return;
        groupEl.classList.toggle(CONFIG.CSS_CLASSES.CLOSED);
      });

      // 親チェックボックスのクリックイベントが伝播しないようにする
      checkboxEl.addEventListener('click', e => e.stopPropagation());
      // 親チェックボックスで子を一括選択/解除
      checkboxEl.addEventListener('change', (e) => {
        listEl.querySelectorAll('input[type="checkbox"]').forEach(child => child.checked = e.target.checked);
        this.startNewSession();
      });

      // 子チェックボックスの変更で親の状態を更新し、セッションを開始
      listEl.addEventListener('change', (e) => {
          if (e.target.type === 'checkbox') {
              this._updateParentCheckboxState(groupEl);
              // ネストされたグループの場合、さらにその親も更新
              const parentContainer = groupEl.closest('.command-group').parentElement?.closest('.command-group');
              if (parentContainer) {
                this._updateParentCheckboxState(parentContainer);
              }
              this.startNewSession();
          }
      });
    }

    /**
     * 子チェックボックスの状態に応じて親チェックボックスの状態（チェック、不確定）を更新する
     * @private
     */
    _updateParentCheckboxState(groupEl) {
      const parentCheckbox = groupEl.querySelector(':scope > .command-title input[type="checkbox"]');
      const childCheckboxes = Array.from(
        groupEl.querySelectorAll(
          ':scope > .problem-checklist > li > label > input[type="checkbox"],' +
          ':scope > .problem-checklist > .command-group > .command-title > input[type="checkbox"]'
        )
      );
      if (!parentCheckbox || childCheckboxes.length === 0) return;

      const allChecked = childCheckboxes.every(cb => cb.checked);
      const someChecked = childCheckboxes.some(cb => cb.checked || cb.indeterminate);

      parentCheckbox.checked = allChecked;
      parentCheckbox.indeterminate = someChecked && !allChecked;
    }

    /**
     * アップロードされたカスタム問題データの形式を検証する
     * @param {object} data - 検証するデータ
     * @param {object} [existingData={}] - 既存のカスタム問題データ（キーの重複チェック用）
     * @returns {boolean} 検証に成功すればtrue
     * @throws {Error} データ形式が不正な場合にエラーを投げる
     * @private
     */
    _validateCustomProblemData(data, existingData = {}) {
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error('JSON root must be an object.');
      }
      if (Object.keys(data).length === 0) {
        throw new Error('JSON file contains no problem sets.');
      }
      const allExistingKeys = {...this.initialProblemData, ...existingData};
      for (const [key, problemSet] of Object.entries(data)) {
        if (allExistingKeys[key]) {
          throw new Error(`Problem set key "${key}" is already in use. Please change the key name in your JSON file.`);
        }
        if (typeof problemSet.name !== 'string' || !problemSet.name.trim()) {
          throw new Error(`Problem set "${key}" is missing the required property "name" (string).`);
        }
        if (!Array.isArray(problemSet.problems)) {
          throw new Error(`Problem set "${key}" is missing the required property "problems" (array).`);
        }
        for (const [i, problem] of problemSet.problems.entries()) {
          if (problem.type === 'scenario') {
              if(typeof problem.objective !== 'string' || !Array.isArray(problem.steps)) {
                  throw new Error(`Scenario problem "${key}" format is incorrect (objective and steps are required).`);
              }
          } else {
              if (typeof problem.id === 'undefined' || typeof problem.question !== 'string' || !Array.isArray(problem.answers)) {
                  throw new Error(`The format of the ${i + 1}-th problem in set "${key}" is incorrect (id, question, answers are required).`);
              }
          }
        }
      }
      return true;
    }

    /**
     * ウィザードでの変更を確定し、データを保存・UIを更新する
     * @param {object} newData - 新しいカスタム問題データ
     */
    commitWizardChanges(newData) {
        this.customProblemData = newData;
        this._saveCustomProblemsToStorage();
        this.renderSidebar();
        this.startNewSession();
        alert(I18N[this.currentLang].messages.CUSTOM_PROBLEM_ADDED);
    }

    /**
     * ローカルストレージからカスタム問題を読み込む
     * @private
     */
    _loadCustomProblemsFromStorage() {
      const storedData = localStorage.getItem(CONFIG.STORAGE_KEYS.CUSTOM_PROBLEMS);
      if (storedData) {
        try {
          return JSON.parse(storedData);
        } catch (error) {
          console.error('Failed to load My Problems:', error);
        }
      }
      return {};
    }

    /**
     * カスタム問題をローカルストレージに保存する
     * @private
     */
    _saveCustomProblemsToStorage() {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.CUSTOM_PROBLEMS, JSON.stringify(this.customProblemData));
      } catch (error) {
        console.error('Failed to save My Problems:', error);
        alert('Failed to save My Problems.');
      }
    }

    /**
     * 新しい学習セッションを開始する（問題の選択が変更されたときに呼び出される）
     */
    startNewSession() {
      // 既存のセッションがあれば破棄
      if (this.currentApp) {
        this.currentApp.destroy();
      }

      // サイドバーでチェックされた問題IDを収集
      const selectedProblemIds = new Set();
      this.ui.dom.problemSelectorList.querySelectorAll('.problem-checklist input[type="checkbox"]:checked').forEach(cb => {
        if (cb.dataset.problemId) selectedProblemIds.add(cb.dataset.problemId);
      });

      const allProblemData = { ...this.initialProblemData, ...this.customProblemData };
      const problemsToLoad = [];
      // 選択されたIDに基づいて問題データを抽出
      Object.entries(allProblemData).forEach(([commandKey, commandData]) => {
        commandData.problems.forEach(problem => {
          if (selectedProblemIds.has(`${commandKey}:${problem.id}`)) {
            problemsToLoad.push({ ...problem, commandKey: commandKey, setName: commandData.name });
          }
        });
      });

      this.ui.resetUIForNewSession();

      // 読み込む問題があれば、新しいTerminalAppインスタンスを作成
      if (problemsToLoad.length > 0) {
        // 初回読み込みフラグと現在の言語を渡す
        this.currentApp = new TerminalApp('customSelection', problemsToLoad, this.ui, this.isFirstLoad, this.currentLang);
      } else {
        this.currentApp = null;
        this.ui.dom.problemElement.textContent = I18N[this.currentLang].messages.SESSION_START;
        if(this.ui.dom.progressText && this.ui.dom.progressBar) {
            const format = this.ui.dom.progressText.dataset.i18nFormat;
            this.ui.dom.progressText.textContent = format.replace('{0}', 0).replace('{1}', 0);
            this.ui.dom.progressBar.style.width = '0%';
        }
      }

      // 初回読み込みフラグを更新
      this.isFirstLoad = false;
    }
  }

  // アプリケーションの開始
  new AppController();

});
