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

window.addEventListener('DOMContentLoaded', () => {

  'use strict';

    /**
     * Application-wide constants and configuration.
     */
    const CONFIG = {
      SELECTORS: {
        body: 'body',
        problemSelectorList: '#problem-selector-list',
        themeSelect: '#themeSelect',
        langSelect: '#langSelect',
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
        settingsBtn: '#settingsBtn',
        settingsModal: '#settingsModal',
        closeSettingsBtn: '#closeSettingsBtn',
        exportAllSettingsBtn: '#exportAllSettingsBtn',
        restoreSettingsUpload: '#restoreSettingsUpload',
        settingsRestoreFeedback: '#settings-restore-feedback',
        bookmarkFilterBtn: '#bookmarkFilterBtn',
      },
      STORAGE_KEYS: {
        CUSTOM_PROBLEMS: 'linux-terminal-custom-problems',
        THEME: 'linux-terminal-theme',
        LANGUAGE: 'linux-terminal-language',
        BOOKMARK_PREFIX: 'linux-terminal-bookmarks',
        SIDEBAR_WIDTH: 'linux-command-trainer-sidebar-width',
      },
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
      THEMES: {
        LIGHT: 'light',
        DARK: 'dark',
        UBUNTU: 'ubuntu',
        POWERSHELL: 'powershell',
        SEPIA: 'sepia'
      },
      DATA_ATTRS: {
        PROBLEM_ID: 'data-problem-id',
        PROBLEM_INDEX: 'data-problem-index',
        I18N_KEY: 'data-i18n-key',
        I18N_FORMAT: 'data-i18n-format',
      },
      DEFAULT_THEME: 'light',
      DEFAULT_LANG: 'ja',
      PROMPT_BASE_TEXT: 'user@linux:',
      TERMINAL_HISTORY_LIMIT: 50,
      MIN_SIDEBAR_WIDTH: 200,
      BACKUP_VERSION: '1.0.0',
    };

    /**
     * Internationalization (i18n) data for UI text and problem sets.
     */
    const I18N = {
      ja: {
        appTitle: 'Command Trainer <Beta Version>',
        manageMyProblems: 'My問題を管理',
        settingsBtnLabel: '設定',
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
        wizardStep1: '1. 問題の追加',
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
        settingsTitle: '設定',
        settingsExportTitle: '設定をエクスポート',
        settingsExportDesc: '現在の「My問題」、苦手チェックの状態、テーマ設定などを一つのファイルにバックアップします。',
        wizardRestoreTitle: 'バックアップから復元',
        wizardRestoreDesc: 'エクスポートした設定ファイル（.json）を読み込んで、My問題や苦手チェックの状態を復元します。',
        wizardRestoreBtn: '設定ファイルを選択',
        wizardExportAllBtn: '全設定を出力',
        closeBtn: '閉じる',
        bookmarkFilterBtn: '苦手のみ',
        linuxCommandCategory: 'Linuxコマンド',
        scenarioCategory: 'シナリオ編',
        myProblemsCategory: 'My問題',
        problemLabel: '問題',
        objectiveLabel: '目的',
        answerLabel: '答え',
        explanationLabel: '説明',
        outputLabel: '（想定される出力）',
        stepLabel: 'ステップ',
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
          NOTHING_TO_EXPORT: 'エクスポートする設定データがありません。',
          WIZARD_UPLOAD_SUCCESS: (filename) => `ファイル「${filename}」を読み込みました。「次へ」進んでください。`,
          WIZARD_UPLOAD_SUCCESS_MULTI_JA: (count) => `✅ ${count} 件のファイルが正常に読み込まれました。「次へ」進んでください。`,
          WIZARD_UPLOAD_FAIL_MULTI_JA: (count) => `❌ ${count} 件のファイルの読み込みに失敗しました。`,
          RESTORE_SUCCESS: '設定を正常に復元しました。ページをリロードします。',
          RESTORE_INVALID_FILE: '無効な設定ファイルです。形式を確認してください。',
        },
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
        appTitle: 'Command Trainer <Beta Version>',
        manageMyProblems: 'Manage My Problems',
        settingsBtnLabel: 'Settings',
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
        wizardStep1: '1. Add Problems',
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
        settingsTitle: 'Settings',
        settingsExportTitle: 'Export Settings',
        settingsExportDesc: 'Back up your "My Problems", bookmark status, theme settings, and more to a single file.',
        wizardRestoreTitle: 'Restore from Backup',
        wizardRestoreDesc: 'Load an exported settings file (.json) to restore your "My Problems" and bookmark status.',
        wizardRestoreBtn: 'Select Settings File',
        wizardExportAllBtn: 'Export All Settings',
        closeBtn: 'Close',
        bookmarkFilterBtn: 'Bookmarked Only',
        linuxCommandCategory: 'Linux Commands',
        scenarioCategory: 'Scenarios',
        myProblemsCategory: 'My Problems',
        problemLabel: 'Problem',
        objectiveLabel: 'Objective',
        answerLabel: 'Answer',
        explanationLabel: 'Explanation',
        outputLabel: '(Expected Output)',
        stepLabel: 'Step',
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
          NOTHING_TO_EXPORT: 'There is no settings data to export.',
          WIZARD_UPLOAD_SUCCESS: (filename) => `File "${filename}" loaded. Please proceed to "Next".`,
          WIZARD_UPLOAD_SUCCESS_MULTI_EN: (count) => `✅ ${count} files successfully loaded. Please proceed to Next.`,
          WIZARD_UPLOAD_FAIL_MULTI_EN: (count) => `❌ ${count} files failed to load.`,
          RESTORE_SUCCESS: 'Settings successfully restored. The page will now reload.',
          RESTORE_INVALID_FILE: 'Invalid settings file. Please check the file format.',
        },
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

    class UIManager {
      constructor(appController) {
        this.appController = appController;
        this.dom = {};
        this._cacheDOMElements();
      }

      _cacheDOMElements() {
        for (const [key, selector] of Object.entries(CONFIG.SELECTORS)) {
          const elements = document.querySelectorAll(selector);
          this.dom[key] = elements.length > 1 ? Array.from(elements) : elements[0];
        }
      }

      printToScreen(text = '', className = '') {
        const line = document.createElement('div');
        if (className) {
          const span = document.createElement('span');
          span.className = className;
          span.textContent = text;
          line.appendChild(span);
        } else {
          line.innerHTML = text;
        }
        this.dom.screen.appendChild(line);
        this.scrollToBottom();
      }

      scrollToBottom() {
        this.dom.screen.scrollTop = this.dom.screen.scrollHeight;
      }

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

      lockInput(inputElement) {
        const parent = inputElement.parentElement;
        if (!parent) return;
        const executedCmdText = document.createElement('span');
        executedCmdText.className = CONFIG.CSS_CLASSES.EXECUTED_COMMAND;
        executedCmdText.textContent = inputElement.value;
        parent.replaceChild(executedCmdText, inputElement);
      }

      updateProblemDisplay(problem, currentIndex, totalProblems, stepIndex = 0) {
        const i18n = I18N[this.appController.currentLang];
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

      clearSolutionDisplay() {
        this.dom.solutionDisplayElement.innerHTML = '';
        this.dom.solutionDisplayElement.hidden = true;
      }

      showSolutionDisplay(problem, isScenario = false, stepIndex = 0) {
        const i18n = I18N[this.appController.currentLang];
        const { SUCCESS, EXPLANATION } = CONFIG.CSS_CLASSES;
        let solutionText = '';
        let problemToShow = isScenario && problem?.steps ? problem.steps[stepIndex] : problem;
        if (problemToShow) {
          const answers = problemToShow.answers.join(' / ');
          solutionText += `<span class="${SUCCESS}">${i18n.answerLabel}: ${answers}</span><br>`;
          if (problemToShow.explanation) solutionText += `<span class="${EXPLANATION}">${i18n.explanationLabel}: ${problemToShow.explanation}</span><br>`;
          if (problemToShow.output) solutionText += `<span class="${EXPLANATION}">${i18n.outputLabel}<br>${problemToShow.output}</span>`;
        } else {
          solutionText = `<span class="${SUCCESS}">${i18n.messages.ALL_COMPLETE}</span>`;
        }
        this.dom.solutionDisplayElement.innerHTML = solutionText;
        this.dom.solutionDisplayElement.hidden = false;
      }

      renderSidebar() {
        const { problemSelectorList } = this.dom;
        const { currentLang, initialProblemData, customProblemData } = this.appController;
        const i18n = I18N[currentLang];
        problemSelectorList.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const standardProblems = {};
        const scenarioProblems = {};
        Object.entries(initialProblemData).forEach(([key, data]) => {
          (key.startsWith('scenario-') ? scenarioProblems : standardProblems)[key] = data;
        });
        const linuxCommandSection = this._createCategorySection(i18n.linuxCommandCategory, false);
        Object.entries(standardProblems).forEach(([key, data]) => {
          linuxCommandSection.content.appendChild(this._createProblemGroupEl(key, data));
        });
        if (Object.keys(scenarioProblems).length > 0) {
          const scenarioSection = this._createCategorySection(i18n.scenarioCategory, true);
          Object.entries(scenarioProblems).forEach(([key, data]) => {
            scenarioSection.content.appendChild(this._createProblemGroupEl(key, data));
          });
          linuxCommandSection.content.appendChild(scenarioSection.container);
        }
        fragment.appendChild(linuxCommandSection.container);
        if (Object.keys(customProblemData).length > 0) {
          const customProblemSection = this._createCategorySection(i18n.myProblemsCategory, true);
          Object.entries(customProblemData).forEach(([key, data]) => {
            customProblemSection.content.appendChild(this._createProblemGroupEl(key, data));
          });
          fragment.appendChild(customProblemSection.container);
        }
        problemSelectorList.appendChild(fragment);
        problemSelectorList.querySelectorAll('.command-group').forEach(group => {
          this.appController._updateParentCheckboxState(group);
        });
      }

      _createCategorySection(categoryName, isInitiallyClosed) {
        const container = document.createElement('div');
        container.className = `command-group ${isInitiallyClosed ? CONFIG.CSS_CLASSES.CLOSED : ''}`;
        const title = document.createElement('div');
        title.className = 'command-title';
        const groupCheckbox = document.createElement('input');
        groupCheckbox.type = 'checkbox';
        groupCheckbox.style.marginRight = '8px';
        groupCheckbox.addEventListener('click', e => e.stopPropagation());
        title.append(groupCheckbox, document.createTextNode(categoryName));
        const contentList = document.createElement('div');
        contentList.className = 'problem-checklist';
        contentList.style.paddingLeft = '0';
        contentList.style.margin = '0';
        title.addEventListener('click', (e) => {
          if (e.target !== groupCheckbox) container.classList.toggle(CONFIG.CSS_CLASSES.CLOSED);
        });
        groupCheckbox.addEventListener('change', (e) => {
          contentList.querySelectorAll('input[type="checkbox"]').forEach(child => {
            child.checked = e.target.checked;
            child.indeterminate = false;
          });
          this.appController.startNewSession();
        });
        container.append(title, contentList);
        return { container: container, content: contentList };
      }

      _createProblemGroupEl(commandKey, commandData) {
        const group = document.createElement('div');
        group.className = `command-group ${CONFIG.CSS_CLASSES.CLOSED}`;
        const title = document.createElement('div');
        title.className = 'command-title';
        const groupCheckbox = document.createElement('input');
        groupCheckbox.type = 'checkbox';
        groupCheckbox.style.marginRight = '8px';
        title.append(groupCheckbox, document.createTextNode(commandData.name));
        const list = this._createProblemListEl(commandKey, commandData.problems);
        title.addEventListener('click', (e) => {
          if(e.target !== groupCheckbox) group.classList.toggle(CONFIG.CSS_CLASSES.CLOSED);
        });
        groupCheckbox.addEventListener('click', e => e.stopPropagation());
        groupCheckbox.addEventListener('change', () => {
          list.querySelectorAll('input[type="checkbox"]').forEach(child => child.checked = groupCheckbox.checked);
          this.appController.startNewSession();
        });
        list.addEventListener('change', (e) => {
          if (e.target.type === 'checkbox') {
            this.appController._updateParentCheckboxState(group);
            let parent = group.parentElement?.closest('.command-group');
            while(parent) {
              this.appController._updateParentCheckboxState(parent);
              parent = parent.parentElement?.closest('.command-group');
            }
            this.appController.startNewSession();
          }
        });
        group.append(title, list);
        return group;
      }

      _createProblemListEl(commandKey, problems) {
        const list = document.createElement('ul');
        list.className = 'problem-checklist';
        const bookmarkKey = `${CONFIG.STORAGE_KEYS.BOOKMARK_PREFIX}_${commandKey}`;
        const bookmarkedIds = new Set(JSON.parse(localStorage.getItem(bookmarkKey) || '[]'));
        problems.forEach(problem => {
          list.appendChild(this._createProblemListItemEl(commandKey, problem, bookmarkedIds));
        });
        return list;
      }

      _createProblemListItemEl(commandKey, problem, bookmarkedIds) {
        const i18n = I18N[this.appController.currentLang];
        const uniqueId = `${commandKey}:${problem.id}`;
        const listItem = document.createElement('li');
        const label = document.createElement('label');
        label.id = `sidebar-problem-${uniqueId.replace(':', '-')}`;
        if (bookmarkedIds.has(uniqueId) && problem.type !== 'scenario') {
          label.classList.add(CONFIG.CSS_CLASSES.BOOKMARKED);
        }
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.problemId = uniqueId;
        const questionText = problem.question || problem.objective;
        const shortText = `${i18n.problemLabel} ${problem.id}: ${questionText.substring(0, 20)}...`;
        label.append(checkbox, document.createTextNode(shortText));
        listItem.appendChild(label);
        return listItem;
      }

      renderProblemNavigation(problems, jumpToProblemCallback) {
        this.dom.problemNavList.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const groupedProblems = problems.reduce((acc, problem, index) => {
          const setName = problem.setName || 'Other Problems';
          if (!acc[setName]) acc[setName] = [];
          acc[setName].push({ ...problem, originalIndex: index });
          return acc;
        }, {});
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

      updateProblemNavigation(problems, currentIndex, bookmarkedIds, getUniqueIdCallback, completedIndices) {
        const { CURRENT, COMPLETED, BOOKMARKED } = CONFIG.CSS_CLASSES;
        const navBtns = this.dom.problemNavList.querySelectorAll('.problem-nav-btn');
        navBtns.forEach(btn => {
          const index = parseInt(btn.dataset.problemIndex, 10);
          const problem = problems[index];
          btn.classList.remove(CURRENT, COMPLETED, BOOKMARKED);
          if (completedIndices.has(index)) {
            btn.classList.add(COMPLETED);
          }
          if (index === currentIndex) {
            btn.classList.add(CURRENT);
          }
          const uniqueId = getUniqueIdCallback(problem);
          if (uniqueId && bookmarkedIds.has(uniqueId)) {
            btn.classList.add(BOOKMARKED);
          }
        });
        const total = problems.length;
        const completedCount = completedIndices.size;
        const progressPercent = total > 0 ? (completedCount / total) * 100 : 0;
        if (this.dom.progressText && this.dom.progressBar) {
          const format = this.dom.progressText.dataset.i18nFormat;
          this.dom.progressText.textContent = format
            .replace('{0}', completedCount)
            .replace('{1}', total);
          this.dom.progressBar.style.width = `${progressPercent}%`;
        }
      }

      resetUIForNewSession() {
        this.dom.screen.innerHTML = '';
        this.dom.problemElement.textContent = I18N[this.appController.currentLang].loading;
        this.dom.solutionDisplayElement.hidden = true;
        this.dom.problemNavList.innerHTML = '';
      }
    }

    class ThemeManager {
      constructor(bodyElement, themeSelectElement) {
        this.body = bodyElement;
        this.themeSelect = themeSelectElement;
        this.THEME_CLASSES = Object.values(CONFIG.THEMES)
          .filter(t => t !== CONFIG.DEFAULT_THEME)
          .map(t => `${t}-theme`);
      }

      applyTheme(themeName) {
        this.body.classList.remove(...this.THEME_CLASSES);
        if (themeName !== CONFIG.DEFAULT_THEME) {
          this.body.classList.add(`${themeName}-theme`);
        }
        this.themeSelect.value = themeName;
      }

      saveTheme(themeName) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, themeName);
      }

      loadSavedTheme() {
        const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || CONFIG.DEFAULT_THEME;
        this.applyTheme(savedTheme);
      }
    }

    class LayoutManager {
      constructor(domElements) {
        this.dom = domElements;
      }

      initialize() {
        this.initSidebarResizer();
        this.initTerminalHeightSync();
      }

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

      initTerminalHeightSync() {
        const { problemCard, terminal } = this.dom;
        const resizeObserver = new ResizeObserver(entries => {
          window.requestAnimationFrame(() => {
            if (!entries.length) return;
            const newHeight = entries[0].contentBoxSize ? entries[0].contentBoxSize[0].blockSize : entries[0].contentRect.height;
            problemCard.style.height = `${newHeight}px`;
          });
        });
        resizeObserver.observe(terminal);
      }
    }

    class TerminalApp {
      constructor(commandSetName, problems, uiManager, isFirstLoad, lang) {
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

      _initState() {
        this.state = {
          currentProblemIndex: 0,
          commandHistory: [],
          historyPointer: -1,
          currentInput: null,
          bookmarkedProblemIds: new Set(),
          isScenarioMode: false,
          currentStepIndex: 0,
          virtualFileSystem: this._createInitialVFS(),
          currentWorkingDirectory: '~',
          completedProblemIndices: new Set(),
        };
      }

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

      _handleScenarioInput(command) {
        const currentProblem = this.problems[this.state.currentProblemIndex];
        const currentStep = currentProblem.steps[this.state.currentStepIndex];
        if (this._isAnswerCorrect(command, currentStep.answers)) {
          this._simulateCommandEffect(command);
          if (currentStep.successMessage) this.ui.printToScreen(currentStep.successMessage, CONFIG.CSS_CLASSES.SUCCESS);
          if(currentStep.output) this.ui.printToScreen(currentStep.output, CONFIG.CSS_CLASSES.EXPLANATION);
          this.state.currentStepIndex++;
          if (this.state.currentStepIndex >= currentProblem.steps.length) {
            this.ui.printToScreen(`\n${currentProblem.finalMessage}\n`, CONFIG.CSS_CLASSES.SUCCESS);
            this.state.completedProblemIndices.add(this.state.currentProblemIndex);
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

      _handleStandardInput(command) {
        const currentProblem = this.problems[this.state.currentProblemIndex];
        if (!currentProblem) {
          this.ui.printToScreen("All problems have been completed. Please reset.", CONFIG.CSS_CLASSES.ERROR);
        } else if (this._isAnswerCorrect(command, currentProblem.answers)) {
          this.state.completedProblemIndices.add(this.state.currentProblemIndex);
          if (currentProblem.output) this.ui.printToScreen(currentProblem.output, CONFIG.CSS_CLASSES.EXPLANATION);
          this.state.currentProblemIndex++;
          this._displayCurrentProblem();
        } else {
          this.ui.printToScreen(`bash: ${command}: command not correct`, CONFIG.CSS_CLASSES.ERROR);
        }
      }

      _isAnswerCorrect(input, answers) {
        const normalize = (s) => s.trim().replace(/\s+/g, ' ');
        const normalizedInput = normalize(input);
        return answers.some((answer) => normalize(answer) === normalizedInput);
      }

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

      _prevProblem() { this._moveProblem(-1, this.i18n.messages.PREV_PROBLEM_SUCCESS, this.i18n.messages.PREV_PROBLEM_FAIL); }
      _nextProblem() { this._moveProblem(1, this.i18n.messages.NEXT_PROBLEM_SUCCESS, this.i18n.messages.NEXT_PROBLEM_FAIL); }

      _moveProblem(direction, successMessage, boundaryMessage) {
        const newIndex = this.state.currentProblemIndex + direction;
        if (newIndex >= 0 && newIndex < this.problems.length) {
          this._changeProblem(newIndex);
          this.ui.printToScreen(`\n(${successMessage})\n`, CONFIG.CSS_CLASSES.MUTED);
        } else {
          this.ui.printToScreen(`\n${boundaryMessage}\n`, CONFIG.CSS_CLASSES.ERROR);
        }
      }

      _jumpToProblem(event) {
        const newIndex = parseInt(event.target.dataset.problemIndex, 10);
        this._changeProblem(newIndex);
        this.ui.printToScreen(`\n(${this.i18n.messages.JUMP_TO_PROBLEM(newIndex + 1)})\n`, CONFIG.CSS_CLASSES.MUTED);
      }

      _changeProblem(newIndex) {
        this.ui.clearSolutionDisplay();
        this.state.currentProblemIndex = newIndex;
        this._displayCurrentProblem();
        this.state.currentInput?.focus();
      }

      _displayCurrentProblem() {
        const { currentProblemIndex } = this.state;
        const currentProblem = this.problems[currentProblemIndex];
        this.state.isScenarioMode = false;
        this.state.currentStepIndex = 0;
        this.ui.clearSolutionDisplay();
        if (currentProblem) {
          if (currentProblem.type === 'scenario') {
            this.state.isScenarioMode = true;
            this.state.virtualFileSystem = this._createInitialVFS();
            this.state.currentWorkingDirectory = '~';
          }
          this.ui.updateProblemDisplay(currentProblem, currentProblemIndex, this.problems.length, this.state.currentStepIndex);
          const uniqueId = this._getUniqueProblemId(currentProblem);
          this.ui.dom.bookmarkCheck.checked = uniqueId ? this.state.bookmarkedProblemIds.has(uniqueId) : false;
          this.ui.dom.bookmarkCheck.disabled = this.state.isScenarioMode;
        } else {
          this.ui.updateProblemDisplay(null);
          this.ui.dom.bookmarkCheck.checked = false;
          this.ui.dom.bookmarkCheck.disabled = true;
        }
        this._updateProblemNavigation();
      }

      _updateProblemNavigation() {
        this.ui.updateProblemNavigation(
          this.problems,
          this.state.currentProblemIndex,
          this.state.bookmarkedProblemIds,
          (problem) => this._getUniqueProblemId(problem),
          this.state.completedProblemIndices
        );
      }

      _loadBookmarks() {
        try {
          const savedBookmarks = localStorage.getItem(this.bookmarkStorageKey) || '[]';
          this.state.bookmarkedProblemIds = new Set(JSON.parse(savedBookmarks));
        } catch (e) { console.error("Failed to parse bookmarks:", e); this.state.bookmarkedProblemIds = new Set(); }
      }

      _saveBookmarks() {
        localStorage.setItem(this.bookmarkStorageKey, JSON.stringify(Array.from(this.state.bookmarkedProblemIds)));
      }

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

      _addCommandToHistory(command) {
        if (!command) return;
        this.state.commandHistory.push(command);
        if (this.state.commandHistory.length > CONFIG.TERMINAL_HISTORY_LIMIT) this.state.commandHistory.shift();
        this.state.historyPointer = this.state.commandHistory.length;
      }

      _navigateHistory(inputElement, direction) {
        const { commandHistory } = this.state;
        if (commandHistory.length === 0) return;
        if (direction === 'up' && this.state.historyPointer > 0) this.state.historyPointer--;
        else if (direction === 'down' && this.state.historyPointer < commandHistory.length) this.state.historyPointer++;
        inputElement.value = commandHistory[this.state.historyPointer] || '';
      }

      _getUniqueProblemId(problem) {
        if (!problem || typeof problem.commandKey === 'undefined' || typeof problem.id === 'undefined') return null;
        return `${problem.commandKey}:${problem.id}`;
      }

      _createNewPromptLine() {
        const path = this.state.currentWorkingDirectory;
        const promptText = `${CONFIG.PROMPT_BASE_TEXT}${path}$ `;
        return this.ui.createNewPromptLine(promptText);
      }

      _printWelcomeMessages() {
        const { SUCCESS } = CONFIG.CSS_CLASSES;
        this.ui.printToScreen('# Welcome to Command Trainer!', SUCCESS);
        this.ui.printToScreen('# Enter a command and press Enter.', SUCCESS);
        this.ui.printToScreen('# If correct, you will proceed to the next problem.', SUCCESS);
        this.ui.printToScreen('');
      }

      async _playBootAnimation(isReboot = false) {
        const { SUCCESS } = CONFIG.CSS_CLASSES;
        const bootSequence = [
          { text: 'Booting Linux Learning Environment...', delay: 50 }, { text: '[    0.023456] Loading kernel modules...', delay: 100 }, { text: '[    0.123456] Loading problem sets...', delay: 150 }, { text: '[    0.234567] Starting virtual file system...', delay: 150 }, { text: `[<span class="${SUCCESS}">  OK  </span>] Reached target Basic System.`, delay: 80 }, { text: `[<span class="${SUCCESS}">  OK  </span>] Started Learning Services.`, delay: 80 }, { text: `[<span class="${SUCCESS}">  OK  </span>] System ready - Created by kikkun.`, delay: 100 }, { text: '', delay: 200 },
        ];
        const rebootSequence = [
          { text: 'Rebooting system...', delay: 50 }, { text: '[    0.045678] Stopping Network Manager...', delay: 100 }, { text: '[    0.123456] Unmounting file systems...', delay: 150 }, { text: '[    0.234567] System shutdown complete.', delay: 200 }, { text: '', delay: 300 },
        ];
        const messagesToPlay = isReboot ? [...rebootSequence, ...bootSequence] : bootSequence;
        for (const msg of messagesToPlay) {
          this.ui.printToScreen(msg.text, msg.text.includes(SUCCESS) ? null : '');
          await new Promise(resolve => setTimeout(resolve, msg.delay));
        }
      }

      _createInitialVFS() {
        return { '~': { type: 'directory', children: {} } };
      }

      _createVFSNode(type, content = '', permissions = 'rw-r--r--') {
        const node = { type, permissions };
        if (type === 'directory') node.children = {};
        else node.content = content;
        return node;
      }

      _resolvePath(path, startNode = this.state.virtualFileSystem['~']) {
        if (path.startsWith('~/')) path = path.substring(2);
        else if (path === '~') return this.state.virtualFileSystem['~'];
        let current = startNode;
        const parts = path.split('/').filter(p => p);
        for (const part of parts) {
          if (current?.type === 'directory' && current.children[part]) {
            current = current.children[part];
          } else {
            return null;
          }
        }
        return current;
      }

      _simulateCommandEffect(command) {
        const parts = command.trim().split(/\s+/);
        const cmd = parts[0];
        const cwdNode = this._resolvePath(this.state.currentWorkingDirectory);
        switch(cmd) {
          case 'mkdir':
            for (let i = 1; i < parts.length; i++) cwdNode.children[parts[i]] = this._createVFSNode('directory');
            break;
          case 'touch':
            for (let i = 1; i < parts.length; i++) {
              let content = (parts[i] === 'server.conf') ? "HOSTNAME=prod-server\nPORT=8080" : '';
              cwdNode.children[parts[i]] = this._createVFSNode('file', content);
            }
            break;
          case 'cd':
            const targetDir = parts[1];
            if (cwdNode.children[targetDir]?.type === 'directory') this.state.currentWorkingDirectory += `/${targetDir}`;
            break;
          case 'mv':
            const source = parts[1], dest = parts[2];
            if (cwdNode.children[source]) {
              const destNode = cwdNode.children[dest];
              if (destNode?.type === 'directory') destNode.children[source] = cwdNode.children[source];
              else cwdNode.children[dest] = cwdNode.children[source];
              delete cwdNode.children[source];
            }
            break;
          case 'rm':
            if (cwdNode.children[parts[1]]) delete cwdNode.children[parts[1]];
            break;
          case 'chmod':
            const targetFile = parts[2];
            if (cwdNode.children[targetFile]) cwdNode.children[targetFile].permissions = 'rwxr-xr-x';
            break;
          case 'cat':
            const redirectIndex = parts.indexOf('>');
            if (redirectIndex > -1) {
              const sourceFile = parts[redirectIndex - 1];
              const destFile = parts[redirectIndex + 1];
              if (cwdNode.children[sourceFile]?.type === 'file') {
                cwdNode.children[destFile] = this._createVFSNode('file', cwdNode.children[sourceFile].content);
              }
            }
            break;
        }
        if (command.includes('&&')) {
          const commands = command.split('&&').map(c => c.trim());
          if (commands[0].startsWith('mkdir') && commands[1].startsWith('cd')) {
            const dirName = commands[0].split(' ')[1];
            cwdNode.children[dirName] = this._createVFSNode('directory');
            this.state.currentWorkingDirectory += `/${dirName}`;
          }
        }
      }
    }

    class WizardManager {
      constructor(appController) {
        this.appController = appController;
        this.ui = appController.ui;
        this.state = {
          currentStep: 1,
          stagedData: {},
          initialData: {},
        };
        this._bindEvents();
      }

      open() {
        this.state.initialData = JSON.parse(JSON.stringify(this.appController.customProblemData));
        this.state.stagedData = JSON.parse(JSON.stringify(this.appController.customProblemData));
        this.navigateToStep(1);
        this.ui.dom.wizardModal.classList.add(CONFIG.CSS_CLASSES.VISIBLE);
      }

      close() {
        this.ui.dom.wizardModal.classList.remove(CONFIG.CSS_CLASSES.VISIBLE);
        this.ui.dom.customProblemUpload.value = '';
      }

      navigateToStep(stepNumber) {
        this.state.currentStep = stepNumber;
        const { wizardProgressSteps, wizardSteps, wizardPrevBtn, wizardNextBtn, wizardCompleteBtn } = this.ui.dom;
        wizardProgressSteps.forEach(step => {
          const stepNum = parseInt(step.dataset.step, 10);
          step.classList.remove(CONFIG.CSS_CLASSES.ACTIVE, CONFIG.CSS_CLASSES.COMPLETED);
          if (stepNum < stepNumber) step.classList.add(CONFIG.CSS_CLASSES.COMPLETED);
          else if (stepNum === stepNumber) step.classList.add(CONFIG.CSS_CLASSES.ACTIVE);
        });
        wizardSteps.forEach(step => {
          step.classList.toggle(CONFIG.CSS_CLASSES.ACTIVE, parseInt(step.dataset.step, 10) === stepNumber);
        });
        if (stepNumber === 1) this._renderStep1();
        if (stepNumber === 2) this._renderStep2();
        if (stepNumber === 3) this._renderStep3();
        wizardPrevBtn.style.display = (stepNumber === 1) ? 'none' : 'inline-flex';
        wizardNextBtn.style.display = (stepNumber === 3) ? 'none' : 'inline-flex';
        wizardCompleteBtn.style.display = (stepNumber === 3) ? 'inline-flex' : 'none';
      }

      _renderStep1() { this.ui.dom.wizardUploadFeedback.innerHTML = ''; }
      _renderStep2() { this.renderCustomProblemsList(this.state.stagedData); }
      _renderStep3() { this.renderConfirmationSummary(); }

      renderCustomProblemsList(data) {
        const { wizardProblemList } = this.ui.dom;
        const i18n = I18N[this.appController.currentLang];
        wizardProblemList.innerHTML = '';
        if (Object.keys(data).length === 0) {
          wizardProblemList.innerHTML = i18n.messages.NO_CUSTOM_PROBLEMS;
          return;
        }
        const fragment = document.createDocumentFragment();
        for (const [setKey, setData] of Object.entries(data)) {
          const setEl = document.createElement('div');
          setEl.className = 'wizard-problem-set';
          setEl.dataset.setKey = setKey;
          const questionText = (problem) => problem.question || problem.objective;
          setEl.innerHTML = `
            <div class="wizard-problem-set__header">
              <span>${setData.name}</span>
              <button class="button button--danger button--icon" data-action="delete-set" title="Delete this problem set">×</button>
            </div>
            <ul class="wizard-problem-set__list">
              ${setData.problems.map(problem => `
                <li class="wizard-problem-item" data-problem-id="${problem.id}">
                  <span class="wizard-problem-item__text">
                    ID ${problem.id}: ${questionText(problem).substring(0, 50)}...
                  </span>
                  <button class="button button--danger button--icon" data-action="delete-problem" title="Delete this problem">×</button>
                </li>
              `).join('')}
            </ul>`;
          fragment.appendChild(setEl);
        }
        wizardProblemList.appendChild(fragment);
      }

      renderConfirmationSummary() {
        const summaryEl = this.ui.dom.wizardConfirmationSummary;
        const initialKeys = new Set(Object.keys(this.state.initialData));
        const stagedKeys = new Set(Object.keys(this.state.stagedData));
        const i18n = I18N[this.appController.currentLang];
        const addedSets = [...stagedKeys].filter(k => !initialKeys.has(k));
        const removedSets = [...initialKeys].filter(k => !stagedKeys.has(k));
        const modifiedSets = [...stagedKeys].filter(k => initialKeys.has(k) && JSON.stringify(this.state.initialData[k]) !== JSON.stringify(this.state.stagedData[k]));
        let html = '<ul>';
        let hasChanges = false;
        if (addedSets.length > 0) {
          hasChanges = true;
          html += `<li><strong class="${CONFIG.CSS_CLASSES.SUCCESS}">${i18n.currentLang === 'ja' ? '追加セット' : 'Added sets'}:</strong> ${addedSets.map(k => this.state.stagedData[k].name).join(', ')}</li>`;
        }
        if (removedSets.length > 0) {
          hasChanges = true;
          html += `<li><strong class="${CONFIG.CSS_CLASSES.ERROR}">${i18n.currentLang === 'ja' ? '削除セット' : 'Removed sets'}:</strong> ${removedSets.map(k => this.state.initialData[k].name).join(', ')}</li>`;
        }
        modifiedSets.forEach(key => {
          hasChanges = true;
          const initialCount = this.state.initialData[key].problems.length;
          const stagedCount = this.state.stagedData[key].problems.length;
          html += `<li><strong class="${CONFIG.CSS_CLASSES.HINT}">${i18n.currentLang === 'ja' ? '変更セット' : 'Modified set'} "${this.state.stagedData[key].name}":</strong> 問題数が ${initialCount} から ${stagedCount} に変更されます。</li>`;
        });
        if (!hasChanges) html += `<li>${i18n.currentLang === 'ja' ? '変更はありません。' : 'No changes detected.'}</li>`;
        summaryEl.innerHTML = html + '</ul>';
      }

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
        wizardModal.addEventListener('click', (e) => { if (e.target === wizardModal) this.close(); });
        customProblemUpload.addEventListener('change', (e) => this._handleFileUpload(e));
        wizardDeleteAllBtn.addEventListener('click', () => {
          this.state.stagedData = {};
          this._renderStep2();
        });
        wizardProblemList.addEventListener('click', (e) => {
          const button = e.target.closest('button[data-action]');
          const header = e.target.closest('.wizard-problem-set__header');
          const problemSetEl = e.target.closest('.wizard-problem-set');
          if (button) {
            const action = button.dataset.action;
            if (action === 'delete-set') this._handleDeleteSet(problemSetEl);
            else if (action === 'delete-problem') this._handleDeleteProblem(problemSetEl, button.closest('.wizard-problem-item'));
          } else if (header) {
            problemSetEl.classList.toggle('is-closed');
          }
        });
        this._bindTooltipEvents();
      }

      _handleFileUpload(event) {
        const files = event.target.files;
        if (files.length === 0) return;
        let successCount = 0;
        let failCount = 0;
        const failedFiles = [];
        const i18n = I18N[this.appController.currentLang];
        const filePromises = Array.from(files).map(file =>
          new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const customData = JSON.parse(e.target.result);
                this.appController._validateCustomProblemData(customData, this.state.stagedData);
                Object.assign(this.state.stagedData, customData);
                successCount++;
              } catch (error) {
                console.error(`Failed to load from ${file.name}:`, error);
                failCount++;
                failedFiles.push(`${file.name} (${error.message || i18n.messages.FILE_READ_ERROR})`);
              } finally {
                resolve();
              }
            };
            reader.onerror = () => {
              failCount++;
              failedFiles.push(`${file.name} (${i18n.messages.FILE_READ_ERROR})`);
              resolve();
            };
            reader.readAsText(file);
          })
        );
        Promise.all(filePromises).then(() => {
          this._displayUploadFeedback(successCount, failCount, failedFiles);
          event.target.value = '';
        });
      }

      _displayUploadFeedback(successCount, failCount, failedFiles) {
        const { wizardUploadFeedback } = this.ui.dom;
        const { currentLang } = this.appController;
        const i18n = I18N[currentLang];
        const { SUCCESS, ERROR } = CONFIG.CSS_CLASSES;
        let feedbackMessage = '';
        if (successCount > 0) {
          const msgKey = `WIZARD_UPLOAD_SUCCESS_MULTI_${currentLang.toUpperCase()}`;
          const successMsg = i18n.messages[msgKey] ? i18n.messages[msgKey](successCount) : i18n.messages.WIZARD_UPLOAD_SUCCESS_MULTI_EN(successCount);
          feedbackMessage += `<span class="${SUCCESS}">${successMsg}</span><br>`;
        }
        if (failCount > 0) {
          const msgKey = `WIZARD_UPLOAD_FAIL_MULTI_${currentLang.toUpperCase()}`;
          const failMsg = i18n.messages[msgKey] ? i18n.messages[msgKey](failCount) : i18n.messages.WIZARD_UPLOAD_FAIL_MULTI_EN(failCount);
          feedbackMessage += `<span class="${ERROR}">${failMsg}</span>`;
          feedbackMessage += `<div style="margin-top: 5px; padding-left: 10px; color: var(--color-red-accent); font-size: 11px;">${failedFiles.join('<br>')}</div>`;
        }
        wizardUploadFeedback.innerHTML = feedbackMessage;
      }

      _bindTooltipEvents() {
        const container = this.ui.dom.wizardModal.querySelector(CONFIG.SELECTORS.tooltipContainer);
        const tooltip = this.ui.dom.jsonFormatTooltip;
        if (container && tooltip) {
          container.addEventListener('mouseenter', () => tooltip.classList.add(CONFIG.CSS_CLASSES.VISIBLE));
          container.addEventListener('mouseleave', () => tooltip.classList.remove(CONFIG.CSS_CLASSES.VISIBLE));
        }
      }

      _handleDeleteSet(problemSetEl) {
        delete this.state.stagedData[problemSetEl.dataset.setKey];
        this._renderStep2();
      }

      _handleDeleteProblem(problemSetEl, problemItemEl) {
        const setKey = problemSetEl.dataset.setKey;
        const problemId = parseInt(problemItemEl.dataset.problemId, 10);
        this.state.stagedData[setKey].problems = this.state.stagedData[setKey].problems.filter(p => p.id !== problemId);
        if (this.state.stagedData[setKey].problems.length === 0) {
          delete this.state.stagedData[setKey];
        }
        this._renderStep2();
      }
    }

    class AppController {
      constructor() {
        this.currentLang = localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || CONFIG.DEFAULT_LANG;
        this.ui = new UIManager(this);
        this.themeManager = new ThemeManager(this.ui.dom.body, this.ui.dom.themeSelect);
        this.wizardManager = new WizardManager(this);
        this.initialProblemData = I18N[this.currentLang].problemData;
        this.customProblemData = this._loadCustomProblemsFromStorage();
        this.currentApp = null;
        this.isFirstLoad = true;
        this.isBookmarkFilterActive = false;
        new LayoutManager(this.ui.dom).initialize();
        this._init();
      }

      _init() {
        this._applyLanguage();
        this.themeManager.loadSavedTheme();
        this.ui.renderSidebar();
        this._bindGlobalEvents();
        this._bindSettingsModalEvents();
        this.startNewSession();
      }

      _applyLanguage() {
        const langData = I18N[this.currentLang];
        document.documentElement.lang = this.currentLang;
        document.querySelectorAll(`[${CONFIG.DATA_ATTRS.I18N_KEY}]`).forEach(el => {
          const key = el.dataset.i18nKey;
          const text = langData[key] || I18N['en'][key];
          if (text && typeof text === 'string') {
            if (el.classList.contains('button--icon')) {
              el.title = text;
              el.setAttribute('aria-label', text);
            } else {
              el.textContent = text;
            }
          }
        });
        this.ui.dom.langSelect.value = this.currentLang;
      }

      _bindGlobalEvents() {
        this.ui.dom.themeSelect.addEventListener('change', (e) => {
          this.themeManager.applyTheme(e.target.value);
          this.themeManager.saveTheme(e.target.value);
        });
        this.ui.dom.langSelect.addEventListener('change', (e) => {
          localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, e.target.value);
          location.reload();
        });
        this.ui.dom.bookmarkFilterBtn.addEventListener('change', (e) => this._handleBookmarkFilterChange(e));
      }

      _handleBookmarkFilterChange(e) {
        this.isBookmarkFilterActive = e.target.checked;
        this.startNewSession();
      }

      _bindSettingsModalEvents() {
        const { settingsBtn, settingsModal, closeSettingsBtn, exportAllSettingsBtn, restoreSettingsUpload } = this.ui.dom;
        const openModal = () => settingsModal.classList.add(CONFIG.CSS_CLASSES.VISIBLE);
        const closeModal = () => settingsModal.classList.remove(CONFIG.CSS_CLASSES.VISIBLE);
        settingsBtn.addEventListener('click', openModal);
        closeSettingsBtn.addEventListener('click', closeModal);
        settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeModal(); });
        exportAllSettingsBtn.addEventListener('click', () => this._handleExportAllSettings());
        restoreSettingsUpload.addEventListener('change', (e) => this._handleRestoreSettings(e));
      }

      startNewSession() {
        if (this.currentApp) {
          this.currentApp.destroy();
        }
        let selectedProblemIds = new Set(
          Array.from(this.ui.dom.problemSelectorList.querySelectorAll(`input[type="checkbox"][${CONFIG.DATA_ATTRS.PROBLEM_ID}]:checked`))
            .map(cb => cb.dataset.problemId)
        );
        if (this.isBookmarkFilterActive) {
          const allBookmarks = new Set();
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(CONFIG.STORAGE_KEYS.BOOKMARK_PREFIX)) {
              try {
                const bookmarkedIds = JSON.parse(localStorage.getItem(key) || '[]');
                bookmarkedIds.forEach(id => allBookmarks.add(id));
              } catch (e) {
                console.error(`Error parsing bookmarks from key: ${key}`, e);
              }
            }
          }
          selectedProblemIds = new Set([...selectedProblemIds].filter(id => allBookmarks.has(id)));
        }
        const allProblemData = { ...this.initialProblemData, ...this.customProblemData };
        const problemsToLoad = [];
        Object.entries(allProblemData).forEach(([commandKey, commandData]) => {
          commandData.problems.forEach(problem => {
            if (selectedProblemIds.has(`${commandKey}:${problem.id}`)) {
              problemsToLoad.push({ ...problem, commandKey: commandKey, setName: commandData.name });
            }
          });
        });
        this.ui.resetUIForNewSession();
        if (problemsToLoad.length > 0) {
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
        this.isFirstLoad = false;
      }

      commitWizardChanges(newData) {
        this.customProblemData = newData;
        this._saveCustomProblemsToStorage();
        this.ui.renderSidebar();
        this.startNewSession();
        alert(I18N[this.currentLang].messages.CUSTOM_PROBLEM_ADDED);
      }

      _handleExportAllSettings() {
        const backupData = {
          version: CONFIG.BACKUP_VERSION,
          customProblems: this._loadCustomProblemsFromStorage(),
          bookmarks: {},
          settings: {
            theme: localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || CONFIG.DEFAULT_THEME,
            language: localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || CONFIG.DEFAULT_LANG,
            sidebarWidth: localStorage.getItem(CONFIG.STORAGE_KEYS.SIDEBAR_WIDTH) || null,
          }
        };
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith(CONFIG.STORAGE_KEYS.BOOKMARK_PREFIX)) {
            backupData.bookmarks[key] = JSON.parse(localStorage.getItem(key) || '[]');
          }
        }
        if (Object.keys(backupData.customProblems).length === 0 && Object.keys(backupData.bookmarks).length === 0) {
          alert(I18N[this.currentLang].messages.NOTHING_TO_EXPORT);
          return;
        }
        this._downloadJson(backupData, 'command-trainer-backup.json');
      }

      _handleRestoreSettings(event) {
        const file = event.target.files[0];
        const feedbackEl = this.ui.dom.settingsRestoreFeedback;
        const i18n = I18N[this.currentLang];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            if (data.version && data.customProblems && data.bookmarks && data.settings) {
              this._applyRestoredData(data);
              feedbackEl.innerHTML = `<span class="${CONFIG.CSS_CLASSES.SUCCESS}">${i18n.messages.RESTORE_SUCCESS}</span>`;
              setTimeout(() => location.reload(), 1500);
            } else {
              throw new Error('Invalid file structure.');
            }
          } catch (error) {
            console.error('Failed to restore settings:', error);
            feedbackEl.innerHTML = `<span class="${CONFIG.CSS_CLASSES.ERROR}">${i18n.messages.RESTORE_INVALID_FILE}</span>`;
          } finally {
            event.target.value = '';
          }
        };
        reader.onerror = () => {
          feedbackEl.innerHTML = `<span class="${CONFIG.CSS_CLASSES.ERROR}">${i18n.messages.FILE_READ_ERROR}</span>`;
          event.target.value = '';
        };
        reader.readAsText(file);
      }

      _applyRestoredData(data) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.CUSTOM_PROBLEMS, JSON.stringify(data.customProblems));
        Object.keys(localStorage)
          .filter(key => key.startsWith(CONFIG.STORAGE_KEYS.BOOKMARK_PREFIX))
          .forEach(key => localStorage.removeItem(key));
        for (const [key, value] of Object.entries(data.bookmarks)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, data.settings.theme);
        localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, data.settings.language);
        if(data.settings.sidebarWidth) localStorage.setItem(CONFIG.STORAGE_KEYS.SIDEBAR_WIDTH, data.settings.sidebarWidth);
      }

      _downloadJson(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      _loadCustomProblemsFromStorage() {
        try {
          return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.CUSTOM_PROBLEMS) || '{}');
        } catch (error) {
          console.error('Failed to load My Problems:', error);
          return {};
        }
      }

      _saveCustomProblemsToStorage() {
        try {
          localStorage.setItem(CONFIG.STORAGE_KEYS.CUSTOM_PROBLEMS, JSON.stringify(this.customProblemData));
        } catch (error) {
          console.error('Failed to save My Problems:', error);
        }
      }

      _validateCustomProblemData(data, existingData = {}) {
        if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new Error('JSONのルートはオブジェクトである必要があります。');
        if (Object.keys(data).length === 0) throw new Error('JSONファイルに問題セットが含まれていません。');
        const allExistingSets = {...this.initialProblemData, ...existingData};
        const allExistingNames = new Set(Object.values(allExistingSets).map(set => set.name));
        const allExistingKeys = new Set(Object.keys(allExistingSets));
        for (const [key, set] of Object.entries(data)) {
          if (allExistingKeys.has(key)) throw new Error(`問題セットのキー "${key}" は既に使用されています。`);
          if (typeof set.name !== 'string' || !set.name.trim()) throw new Error(`セット "${key}" に "name" がありません。`);
          if (allExistingNames.has(set.name)) throw new Error(`問題セット名 "${set.name}" は既に使用されています。ユニークな名前に変更してください。`);
          if (!Array.isArray(set.problems)) throw new Error(`セット "${key}" に "problems" 配列がありません。`);
          for (const [i, problem] of set.problems.entries()) {
            const isScenario = problem.type === 'scenario';
            const hasBaseProps = typeof problem.id !== 'undefined' && (isScenario ? typeof problem.objective === 'string' : typeof problem.question === 'string');
            const hasAnswerProps = isScenario ? Array.isArray(problem.steps) : Array.isArray(problem.answers);
            if (!hasBaseProps || !hasAnswerProps) throw new Error(`セット "${key}" 内の問題 ${i+1} の形式が正しくありません。`);
          }
          allExistingKeys.add(key);
          allExistingNames.add(set.name);
        }
        return true;
      }

      _updateParentCheckboxState(groupEl) {
        const parentCheckbox = groupEl.querySelector(':scope > .command-title input[type="checkbox"]');
        if (!parentCheckbox) return;
        const childCheckboxes = Array.from(
          groupEl.querySelectorAll(
            ':scope > .problem-checklist > li > label > input[type="checkbox"],' +
            ':scope > .problem-checklist > .command-group > .command-title > input[type="checkbox"]'
          )
        );
        if (childCheckboxes.length === 0) return;
        const allChecked = childCheckboxes.every(cb => cb.checked && !cb.indeterminate);
        const someChecked = childCheckboxes.some(cb => cb.checked || cb.indeterminate);
        parentCheckbox.checked = allChecked;
        parentCheckbox.indeterminate = someChecked && !allChecked;
      }
    }

    new AppController();

  });
