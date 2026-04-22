# KANASA サイト改修 — Claude Code 作業手順書
> 対象者：城間 脩平  
> 前提：Mac / ターミナル操作 / GitHub + Netlify 環境

---

## ⚠️ この手順書を読む前に

- コマンドは**全文コピペ**してください。手打ちは間違いの原因になります
- コマンドを貼り付けたら **Return キーを押す** まで実行されません
- わからないことが出たら、この手順書を Claude.ai に貼って質問してください

---

## 📋 STEP 0 — はじめる前の確認

### 確認事項チェック
- [ ] Claude Pro プランに加入している（必須）
- [ ] Mac のターミナルが開ける
- [ ] kanasa-conditioning.com の GitHub リポジトリにアクセスできる
- [ ] `KANASA_creative_rebuild_prompt_v4.1.md` をダウンロード済み

---

## 💾 STEP 1 — Claude Code のインストール（初回のみ）

### 1-1. ターミナルを開く
```
Cmd + Space → 「ターミナル」と入力 → Return
```

### 1-2. Claude Code をインストール
以下をターミナルにコピペして Return：
```bash
curl -fsSL https://claude.ai/install.sh | bash
```
インストール完了のメッセージが出るまで待つ（1〜2分）。

### 1-3. インストール確認
```bash
claude --version
```
バージョン番号が表示されれば成功。  
`command not found` と出た場合：ターミナルをいったん閉じて再度開き、もう一度試す。

### 1-4. ログイン
```bash
claude
```
ブラウザが自動で開く → Claude.ai に使っているアカウント（shiroma.srm@icloud.com）でログイン → 「Authenticate」ボタンをクリック → ターミナルに戻って Return。

**これ以降、1-1〜1-4 は次回以降不要です。**

---

## 📁 STEP 2 — プロンプトファイルをリポジトリに配置

### 2-1. リポジトリの場所を確認する
ターミナルで以下を入力して、どこにリポジトリがあるか探す：
```bash
find ~ -name "*.html" -path "*kanasa*" 2>/dev/null | head -5
```
表示されたパスの一部（例：`/Users/shiroma/kanasa-conditioning`）がリポジトリの場所。

### 2-2. リポジトリに移動する
```bash
cd /Users/（あなたのユーザー名）/（リポジトリのフォルダ名）
```
**例：**
```bash
cd ~/kanasa-conditioning
```

> 💡 **わからない場合の方法**  
> Finder でリポジトリフォルダを開く → フォルダをターミナルにドラッグ＆ドロップ → 自動でパスが入力される → Return

### 2-3. プロンプト保存用フォルダを作成
```bash
mkdir -p .claude
```

### 2-4. プロンプトファイルを配置
ダウンロードした `KANASA_creative_rebuild_prompt_v4.1.md` を Finder で `.claude` フォルダに移動する。

**確認コマンド（ファイルが入っているか確認）：**
```bash
ls .claude/
```
`KANASA_creative_rebuild_prompt_v4.1.md` が表示されれば OK。

---

## 🌿 STEP 3 — 作業ブランチを作成（ロールバック保険）

**これを必ず先にやること。何かあっても元に戻せます。**

```bash
git checkout -b rebuild-v4
```

`Switched to a new branch 'rebuild-v4'` と表示されれば OK。

> ⚠️ **このコマンドをやらないと元に戻せなくなります。必ず実行してください。**

---

## 🚀 STEP 4 — Claude Code を起動してプロンプトを投入

### 4-1. Claude Code をリポジトリ内で起動
```bash
claude
```
ウェルカム画面が表示されたら準備完了。

### 4-2. 最初のメッセージを投入（コピペするだけ）
以下を **そのままコピペ** して Return：

```
@.claude/KANASA_creative_rebuild_prompt_v4.1.md

このプロンプトに従って作業してください。
まず Phase 0（事前調査）から開始してください。
Phase 0 が完了したら必ず停止して、調査結果を報告してください。
Phase 0 の承認なしに Phase 1 へ進まないでください。
```

Claude が動き始めます。完了するまで待ちます（5〜10分程度）。

---

## ✅ STEP 5 — Phase ごとの確認と承認

### Phase 0 完了後
Claude が報告してきたら、内容を読む。  
問題なければ：
```
Phase 0 の内容を確認しました。Phase 1（index.html の実装）へ進んでください。
完了したら必ず停止して報告してください。
```

問題があれば：
```
○○のキャッチコピーが抽出リストに入っていません。追加してから Phase 1 へ進んでください。
```

### Phase 1 完了後
Claude が報告してきたら：
```
Phase 1 の完了報告を確認しました。
CHANGELOG.md の内容も確認します。
問題なければ次のフェーズへ進みます。
```

**CHANGELOG.md の確認方法：**
```bash
cat CHANGELOG.md
```
または Finder で `.claude` フォルダを開いて確認。

---

## 🌐 STEP 6 — プレビュー確認（Netlify）

### 6-1. 変更をコミット＆プッシュ
```bash
git add .
git commit -m "Phase 1: index.html rebuild"
git push origin rebuild-v4
```

### 6-2. Netlify でプレビュー URL を確認
Netlify ダッシュボード（app.netlify.com）→ サイトを開く → 「Deploys」タブ → `rebuild-v4` ブランチのプレビュー URL をクリック。

> 💡 Netlify がブランチを自動検知しない場合は、ダッシュボードの「Branch deploys」設定で `rebuild-v4` を追加する。

### 6-3. スマホでも確認（必須）
iPhone で上記プレビュー URL を開いて、表示が崩れていないか確認。

---

## 📬 STEP 7 — フォーム送信テスト（必須）

プレビュー URL でフォームに **テスト内容を送信** して、`info@kanasa-conditioning.com` に届くか確認。

届かない場合 → Claude Code に以下を送る：
```
フォームの送信テストをしましたが、メールが届きませんでした。
Netlify Forms の設定を確認して修正してください。
```

---

## ✨ STEP 8 — 本番反映（全 Phase 完了後のみ）

全 Phase の確認が取れたら、`rebuild-v4` ブランチを `main` にマージする：

```bash
git checkout main
git merge rebuild-v4
git push origin main
```

Netlify が自動でデプロイします（1〜3分）。  
本番 URL（kanasa-conditioning.com）で最終確認。

---

## 🔄 STEP 9 — 問題があった場合のロールバック（元に戻す）

何か問題があって元に戻したい場合：

### 作業ブランチにいる場合（まだ main にマージしていない）
```bash
git checkout main
```
これだけで元の状態に戻ります。`rebuild-v4` ブランチはそのまま残ります。

### すでに main にマージしてしまった場合
```bash
git log --oneline -5
```
直前のコミット ID（例：`a1b2c3d`）を確認して：
```bash
git revert a1b2c3d
git push origin main
```

---

## 💬 STEP 10 — Claude Code との日常的なやり取り

### よく使うコマンド
| やりたいこと | 入力内容 |
|---|---|
| 前の会話を続ける | `claude --continue` |
| 一時停止（Claudeを止める） | `Esc キー` |
| Claude Code を終了する | `/exit` |
| ヘルプを見る | `/help` |
| 現在地を確認する | `pwd` |

### Phase の進め方（テンプレート）
```
Phase ○ の内容を確認しました。OKです。次の Phase ○+1 へ進んでください。
完了したら停止して報告してください。
```

### 修正を依頼するとき
```
○○ セクションのアニメーションが速すぎます。
duration を現在の値の 1.5 倍にしてください。
他の箇所は変更しないでください。
```

### セッションをまたぐとき（翌日再開する場合）
```bash
claude --continue
```
その後：
```
前回の作業の続きです。CHANGELOG.md の内容を確認して、
次は Phase ○ から再開してください。
```

---

## ❓ よくあるトラブル

### 「command not found: claude」と出る
```bash
source ~/.zshrc
```
を実行してから再度 `claude` を試す。

### 「permission denied」と出る
リポジトリフォルダにいるか確認：
```bash
pwd
```
`/Users/（ユーザー名）/（リポジトリ名）` と表示されれば OK。

### Claude が止まらずどんどん進んでしまう
`Esc キー` を押して止め、以下を送る：
```
一度停止してください。現在の状態を報告してから、承認を待ってください。
```

### ブランチがわからなくなった
```bash
git branch
```
現在いるブランチに `*` がついて表示されます。

---

## 📊 作業全体のタイムライン（目安）

| Phase | 内容 | 所要時間 | あなたの作業 |
|---|---|---|---|
| Phase 0 | 現サイト調査 | 10〜15分 | 報告を読んで承認 |
| Phase 1 | トップページ再構築 | 30〜60分 | PC・スマホで確認 |
| Phase 2 | 下層・分離ページ | 30〜60分 | 各ページ確認 |
| Phase 3 | 全体統一・最終調整 | 20〜40分 | 最終確認 |
| 本番反映 | merge & deploy | 5分 | フォームテスト |

**合計目安：2〜4時間（確認待ちの時間を除く）**

---

*手順書 Version 1.0 — KANASA Conditioning Studio 専用*
