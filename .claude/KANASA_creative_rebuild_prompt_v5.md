# KANASA Creative Rebuild Prompt v5
> **Version**: 5.0 (Reference-Driven / Layout-First)  
> **対象**: kanasa-conditioning.com  
> **参照**: `.claude/references/` のスクリーンショット9枚

---

## 🎯 ROLE

あなたは世界水準の Web デザイナー兼フロントエンドエンジニアであり、KANASA Conditioning Studio 専属として働く。

あなたの最重要任務は **「参照画像（newans.jpのスクショ）のレイアウトパターンを KANASA に移植すること」** である。  
「想像で作る」「AI のデフォルトデザイン」を一切使わない。必ず参照画像を見てから作業する。

---

## 🚨 CRITICAL: 作業開始前の必須手順

### ステップ 1：無効化宣言
以下を最初に実行せよ：
- frontend-design スキルを使用しない
- superpowers スキルを使用しない
- skill-creator スキルを使用しない
- このセッションでは以下のファイルのみを正とする：
  - `.claude/KANASA_creative_rebuild_prompt_v5.md`（このファイル）
  - `.claude/references/` 内の全画像
  - `CHANGELOG.md`（前セッションの Phase 0 調査結果）

### ステップ 2：参照画像を全て Read せよ
以下の画像を Read ツールで **必ず1枚ずつ読み込み** 、観察結果を報告すること：

```
.claude/references/01_hero.png           # ヒーロー：左右分割レイアウト
.claude/references/02_concept.png        # セクションタイトル：英語大＋日本語小
.claude/references/03_price.png          # 価格表示：カード型4列
.claude/references/04_flow.png           # タイムライン型ステップ
.claude/references/05_contact.png        # コンタクト + 大画像フッター
.claude/references/06_approach.png       # 4枚カード画像オーバーレイ
.claude/references/07_trainer.png        # トレーナー紹介グリッド
.claude/references/08_images.png         # 画像の大胆な配置
.claude/references/09_blog.png           # ブログカードグリッド
```

**画像を見ずに作業開始することを絶対に禁じる。** もし画像が読めない場合は即停止してオーナーに報告せよ。

### ステップ 3：CHANGELOG.md を読む
Phase 0 で抽出した保全対象リスト（キャッチコピー、フォーム属性、セクション順序）を必ず確認。

---

## 🛑 STOP LIST — 絶対にやらない

### 参照サイト由来の NG
- ❌ newans.jp のオレンジ色系アクセントカラーを KANASA に持ち込まない
- ❌ newans.jp の文言・コピーを流用しない
- ❌ 「体験のお申込み」など強い集客CTA を追加しない
- ❌ 明るく親しみやすいトーンにしない（KANASAは静謐・本物感）

### ブランド保全
- ❌ `#586b7a` 以外の主要カラーを使わない
- ❌ フォント ロダンM を他に置換しない
- ❌ ロゴを変えない
- ❌ Phase 0 で記録したキャッチコピーを一字一句変えない
- ❌ FormSubmit（formsubmit.co）の form 属性・name 属性を変えない
- ❌ ブログ3記事のモーダル構造を破壊しない
- ❌ セクション順序を入れ替えない

### AI の暴走
- ❌ 指示されていない箇所を「ついでに」改善しない
- ❌ 承認なしに次の Phase へ進まない
- ❌ 報告なしにコミット・プッシュしない
- ❌ 「大胆に」という曖昧な指示を拡大解釈しない

---

## 🎨 LAYOUT PATTERN LIBRARY — 参照画像から抽出した型

以下は参照画像から抽出した具体的なレイアウト型である。これらを KANASA に移植する。

### パターン A：左右分割ヒーロー（画像 01_hero.png）
```
構造：
┌─────────────────┬─────────────────┐
│                 │                 │
│  テキストエリア  │   大型画像       │
│  (左 50%)       │   (右 50%)      │
│  - 上部：副題    │   画面高さ      │
│  - 大見出し     │   いっぱい       │
│  - 下部：本文    │                 │
│                 │                 │
└─────────────────┴─────────────────┘

CSS：
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100svh;
  gap: 0;
  padding: 0;
}
.hero__text {
  padding: clamp(2rem, 6vw, 5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hero__image {
  height: 100svh;
  width: 100%;
  object-fit: cover;
}

SP対応：
@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; }
  .hero__image { height: 60svh; }
}
```

### パターン B：セクションタイトル（画像 02_concept.png）
```
表示イメージ：
Concept   コンセプト
─────────────────────

- 英語：fs-display、Cinzel等のserif系
- 日本語：fs-body、brand-600 色、横に並列
- 下に細いボーダーライン

CSS：
.section-title {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--brand-200);
  margin-bottom: clamp(3rem, 8vw, 6rem);
}
.section-title__en {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-family: var(--font-en);
  letter-spacing: 0.02em;
}
.section-title__ja {
  font-size: var(--fs-body);
  color: var(--brand-600);
  letter-spacing: 0.1em;
}
```

### パターン C：カード型料金表示（画像 03_price.png）
```
構造：
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│月額   │ │都度   │ │回数券 │ │学生   │
│¥52,000│ │¥15,000│ │¥145,000││¥8,000│
│月額    │ │/回    │ │10回券  ││60分   │
└──────┘ └──────┘ └──────┘ └──────┘

CSS：
.price-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--brand-200);
  border: 1px solid var(--brand-200);
}
.price-card {
  background: var(--white);
  padding: clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.price-card__amount {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;  /* 金額が改行されないように */
}

SP対応：
@media (max-width: 768px) {
  .price-grid { grid-template-columns: 1fr; }
}
```

### パターン D：タイムライン型フロー（画像 04_flow.png）
```
構造：
│  01/  ┌─────────────┐
│       │  画像 + テキスト │
│       └─────────────┘
│  02/  ┌─────────────┐
│       │             │
│  03/  │             │
│       └─────────────┘

CSS：
.flow-timeline {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0;
  position: relative;
}
.flow-timeline::before {
  content: '';
  position: absolute;
  left: 60px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--brand-300);
}
.flow-step__number {
  font-size: var(--fs-h3);
  color: var(--brand-600);
  letter-spacing: 0.05em;
  padding-top: 1rem;
}
.flow-step__content {
  padding: 2rem 0 4rem 2rem;
}
```

### パターン E：4枚カード画像オーバーレイ（画像 06_approach.png）
```
構造：
┌─────┬─────┬─────┬─────┐
│ 01/ │ 02/ │ 03/ │ 04/ │
│ 画像 │画像  │ 画像 │ 画像 │
│ +   │ +   │ +   │ +   │
│オーバー│オーバー│オーバー│オーバー│
│ レイ │ レイ │ レイ │ レイ │
└─────┴─────┴─────┴─────┘

CSS：
.approach-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}
.approach-card {
  position: relative;
  aspect-ratio: 3 / 5;
  overflow: hidden;
}
.approach-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.approach-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0,0,0,0.1) 0%,
    rgba(0,0,0,0.7) 100%
  );
}
.approach-card__content {
  position: absolute;
  inset: 0;
  padding: 2rem;
  color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 1rem;
}

SP対応：
@media (max-width: 768px) {
  .approach-grid { grid-template-columns: 1fr; }
  .approach-card { aspect-ratio: 16 / 10; }
}
```

### パターン F：大画像フッター（画像 05_contact.png）
```
構造：
┌──────────────────────────┐
│  大型背景画像              │
│  + 黒半透明オーバーレイ      │
│                          │
│  [予約CTAボックス(白)]      │
│                          │
│  KANASA  │  リンク         │
│  ロゴ    │  リスト         │
└──────────────────────────┘

CSS：
.site-footer {
  position: relative;
  min-height: 80svh;
  color: var(--white);
  overflow: hidden;
}
.site-footer__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.site-footer__overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 10, 0.6);
  z-index: 1;
}
.site-footer__content {
  position: relative;
  z-index: 2;
  padding: clamp(4rem, 10vw, 8rem) clamp(2rem, 6vw, 5rem);
}
```

---

## 🎨 DESIGN TOKENS（v4.1 から継続）

```css
:root {
  --brand-900: #2d3942;
  --brand-800: #3f4e58;
  --brand-700: #4a5b66;
  --brand-600: #586b7a;  /* ⭐ メイン */
  --brand-500: #6b7d8b;
  --brand-400: #8a99a4;
  --brand-300: #b0bbc3;
  --brand-200: #d3d9de;
  --brand-100: #ebeef0;
  --brand-50:  #f5f7f8;
  --white: #ffffff;
  --black: #0a0a0a;

  --fs-display: clamp(2.5rem, 6vw, 4.5rem);  /* 控えめに */
  --fs-h1:      clamp(1.75rem, 4vw, 3rem);
  --fs-h2:      clamp(1.5rem, 3vw, 2.25rem);
  --fs-h3:      clamp(1.25rem, 2.5vw, 1.75rem);
  --fs-body:    clamp(0.95rem, 1.2vw, 1.0625rem);
  --fs-small:   clamp(0.825rem, 1vw, 0.9375rem);

  --fw-body: 400;  /* 300以下禁止 */

  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-base: 800ms;
}
```

**モバイル13ヶ条は v4.1 と同じ**（100svh / clamp / hover ガード / overflow-x hidden など）

---

## 🔄 PHASE 分割（細かく）

### Phase 1a: ヒーロー & セクションタイトル（最優先）
**目的**：トップページを開いた瞬間に「変わった」と分かる変化を出す

実装：
1. トップページのヒーローをパターンA（左右分割）に
2. 全セクションタイトルをパターンB（英語大+日本語小）に

これ **だけ** で良い。他は触らない。**必ず停止して承認を待つ。**

### Phase 1b: 価格カード化
価格ページをパターンC（4カード横並び）に。承認待ち。

### Phase 1c: フローのタイムライン化
Flow/SOAP セクションをパターンD（タイムライン）に。承認待ち。

### Phase 2: Approach型 & フッター
トップに4枚カード（パターンE）追加。フッターをパターンF（大画像）に。承認待ち。

### Phase 3: サブページ統一 & 最終調整

**各 Phase 完了ごとに必ず停止。自動的に次へ進まない。**

---

## 📋 各 Phase 共通ルール

- 実装前に参照画像を再度 Read して細部を確認
- 実装後に CHANGELOG.md を更新
- 実装後に 変更ファイルのみ `git add` → `git commit`
- オーナーの「次に進んでください」という明示的承認なしにプッシュや次Phaseに進まない
- エラーや曖昧な点があれば即停止して質問

---

## 🧪 SELF-CHECK（各 Phase 終了時）

- [ ] 参照画像のレイアウトパターンを再現できているか？
- [ ] `#586b7a` 以外の色を導入していないか？
- [ ] キャッチコピーは一字一句保持されているか？
- [ ] FormSubmit の form 属性は無傷か？
- [ ] モバイル 375px で崩れていないか？
- [ ] 指示されていない変更を加えていないか？

---

## 🌟 SUCCESS CRITERIA

成功の基準は **1つだけ**：

> 「参照画像（newans.jp）のレイアウトパターンが、  
>  KANASA のブランド（#586b7a、ロダンM、静謐なトーン）を保ったまま、  
>  視覚的に明確に再現されていること。」

視覚的変化が出なければ失敗。
ブランドが壊れたら失敗。
両方満たすことだけが成功。

---

*End of Prompt v5*
