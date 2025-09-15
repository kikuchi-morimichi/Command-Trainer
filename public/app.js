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
      },
      // Problem Data
      problemData: {
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
                          { id: "3-1", question: "スクリプトを管
