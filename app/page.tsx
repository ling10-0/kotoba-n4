"use client";

import { useEffect, useMemo, useState } from "react";

type Word = {
  id: number;
  kanji: string;
  kana: string;
  meaning: string;
  example: string;
  translation: string;
};

type RecordItem = {
  date: string;
  score: number;
  total: number;
  completed: boolean;
  sentences: string[];
  checkIn: "done" | "partial" | "missed";
};

type AppData = {
  learnedIds: number[];
  records: RecordItem[];
  mistakes: Record<string, number>;
};

type QuizItem = {
  word: Word;
  prompt: string;
  answer: string;
  kind: "日翻中" | "中翻日" | "讀音" | "填空";
  options?: string[];
};

const WORDS: Word[] = [
  { id: 1, kanji: "会社", kana: "かいしゃ", meaning: "公司", example: "私は会社で働いています。", translation: "我在公司工作。" },
  { id: 2, kanji: "約束", kana: "やくそく", meaning: "約定、約會", example: "友達と約束があります。", translation: "我和朋友有約。" },
  { id: 3, kanji: "遅れる", kana: "おくれる", meaning: "遲到、延誤", example: "電車が遅れました。", translation: "電車誤點了。" },
  { id: 4, kanji: "準備", kana: "じゅんび", meaning: "準備", example: "試験の準備をします。", translation: "準備考試。" },
  { id: 5, kanji: "必要", kana: "ひつよう", meaning: "必要", example: "パスポートが必要です。", translation: "需要護照。" },
  { id: 6, kanji: "特に", kana: "とくに", meaning: "特別、尤其", example: "私は特に猫が好きです。", translation: "我尤其喜歡貓。" },
  { id: 7, kanji: "最近", kana: "さいきん", meaning: "最近", example: "最近忙しいです。", translation: "最近很忙。" },
  { id: 8, kanji: "利用する", kana: "りようする", meaning: "使用、利用", example: "図書館を利用します。", translation: "使用圖書館。" },
  { id: 9, kanji: "選ぶ", kana: "えらぶ", meaning: "選擇", example: "好きな色を選びます。", translation: "選擇喜歡的顏色。" },
  { id: 10, kanji: "運転", kana: "うんてん", meaning: "駕駛、開車", example: "父は車を運転します。", translation: "爸爸開車。" },
  { id: 11, kanji: "簡単", kana: "かんたん", meaning: "簡單", example: "この問題は簡単です。", translation: "這個問題很簡單。" },
  { id: 12, kanji: "難しい", kana: "むずかしい", meaning: "困難、難", example: "日本語は難しいです。", translation: "日文很難。" },
  { id: 13, kanji: "安い", kana: "やすい", meaning: "便宜", example: "この店は安いです。", translation: "這家店很便宜。" },
  { id: 14, kanji: "高い", kana: "たかい", meaning: "昂貴、高", example: "このかばんは高いです。", translation: "這個包包很貴。" },
  { id: 15, kanji: "丈夫", kana: "じょうぶ", meaning: "耐用、健康", example: "この靴は丈夫です。", translation: "這雙鞋很耐穿。" },
  { id: 16, kanji: "便利", kana: "べんり", meaning: "方便", example: "スマホは便利です。", translation: "智慧型手機很方便。" },
  { id: 17, kanji: "不便", kana: "ふべん", meaning: "不方便", example: "ここは交通が不便です。", translation: "這裡交通不方便。" },
  { id: 18, kanji: "有名", kana: "ゆうめい", meaning: "有名", example: "京都は有名な町です。", translation: "京都是有名的城市。" },
  { id: 19, kanji: "大切", kana: "たいせつ", meaning: "重要、珍貴", example: "家族は大切です。", translation: "家人很重要。" },
  { id: 20, kanji: "安心", kana: "あんしん", meaning: "放心、安心", example: "先生がいるので安心です。", translation: "因為有老師，所以很安心。" },
  { id: 21, kanji: "経験", kana: "けいけん", meaning: "經驗", example: "日本で働いた経験があります。", translation: "我有在日本工作的經驗。" },
  { id: 22, kanji: "説明", kana: "せつめい", meaning: "說明", example: "先生が文法を説明します。", translation: "老師說明文法。" },
  { id: 23, kanji: "連絡", kana: "れんらく", meaning: "聯絡", example: "あとで連絡します。", translation: "稍後再聯絡。" },
  { id: 24, kanji: "間に合う", kana: "まにあう", meaning: "趕得上、來得及", example: "電車に間に合いました。", translation: "趕上電車了。" },
  { id: 25, kanji: "続ける", kana: "つづける", meaning: "繼續", example: "毎日勉強を続けます。", translation: "每天持續學習。" },
  { id: 26, kanji: "決める", kana: "きめる", meaning: "決定", example: "旅行の日を決めました。", translation: "決定了旅行日期。" },
  { id: 27, kanji: "直す", kana: "なおす", meaning: "修理、改正", example: "間違いを直してください。", translation: "請改正錯誤。" },
  { id: 28, kanji: "調べる", kana: "しらべる", meaning: "調查、查詢", example: "言葉の意味を調べます。", translation: "查詢單字的意思。" },
  { id: 29, kanji: "迎える", kana: "むかえる", meaning: "迎接", example: "駅で友達を迎えます。", translation: "去車站接朋友。" },
  { id: 30, kanji: "申し込む", kana: "もうしこむ", meaning: "申請、報名", example: "日本語の試験に申し込みます。", translation: "報名日文考試。" },
  { id: 31, kanji: "予定", kana: "よてい", meaning: "預定、計畫", example: "週末の予定はありますか。", translation: "週末有安排嗎？" },
  { id: 32, kanji: "残念", kana: "ざんねん", meaning: "遺憾、可惜", example: "会えなくて残念です。", translation: "沒能見面很可惜。" },
  { id: 33, kanji: "間違える", kana: "まちがえる", meaning: "弄錯", example: "答えを間違えました。", translation: "答錯了。" },
  { id: 34, kanji: "足りる", kana: "たりる", meaning: "足夠", example: "時間は十分足ります。", translation: "時間很充足。" },
  { id: 35, kanji: "比べる", kana: "くらべる", meaning: "比較", example: "二つの商品を比べます。", translation: "比較兩個商品。" },
];

const INITIAL_DATA: AppData = {
  learnedIds: WORDS.slice(0, 20).map((word) => word.id),
  records: [
    { date: "2026-07-18", score: 4, total: 5, completed: true, sentences: ["バスは便利です。", "この写真は大切です。", "警察がいるので安心です。"], checkIn: "done" },
    { date: "2026-07-19", score: 7, total: 10, completed: true, sentences: [], checkIn: "done" },
  ],
  mistakes: { "準備": 1, "難しい": 1, "不便": 1, "簡単": 1 },
};

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/[。、，,.\s]/g, "");

function questionFor(word: Word, index: number): QuizItem {
  const kinds = ["日翻中", "中翻日", "讀音", "填空"] as const;
  const kind = kinds[index % kinds.length];
  if (kind === "日翻中") return { word, kind, prompt: `${word.kanji}（${word.kana}）的中文意思是？`, answer: word.meaning.split("、")[0] };
  if (kind === "中翻日") return { word, kind, prompt: `「${word.meaning.split("、")[0]}」的日文是？`, answer: word.kanji };
  if (kind === "讀音") return { word, kind, prompt: `${word.kanji} 的假名怎麼念？`, answer: word.kana };
  const distractors = WORDS.filter((item) => item.id !== word.id).slice(index, index + 2).map((item) => item.kanji);
  return {
    word,
    kind,
    prompt: word.example.replace(word.kanji, "（　　）"),
    answer: word.kanji,
    options: [word.kanji, ...distractors].sort((a, b) => a.localeCompare(b)),
  };
}

export default function Home() {
  const [data, setData] = useState<AppData | null>(null);
  const [tab, setTab] = useState<"today" | "progress" | "mistakes">("today");
  const [step, setStep] = useState(0);
  const [checkIn, setCheckIn] = useState<RecordItem["checkIn"] | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [sentences, setSentences] = useState(["", "", ""]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("kotoba-n4-data");
    setData(saved ? JSON.parse(saved) : INITIAL_DATA);
  }, []);

  useEffect(() => {
    if (data) window.localStorage.setItem("kotoba-n4-data", JSON.stringify(data));
  }, [data]);

  const isWeekly = data ? (data.records.length + 1) % 7 === 0 : false;
  const lastThree = data?.records.slice(-3) ?? [];
  const recentAccuracy = lastThree.length
    ? lastThree.reduce((sum, item) => sum + item.score / item.total, 0) / lastThree.length
    : 0.8;
  const newWordCount = recentAccuracy < 0.7 ? 7 : lastThree.length === 3 && lastThree.every((item) => item.score / item.total > 0.9) ? 12 : 10;
  const todayNewWords = useMemo(() => {
    if (!data || isWeekly) return [];
    const unseen = WORDS.filter((word) => !data.learnedIds.includes(word.id));
    return unseen.slice(0, newWordCount);
  }, [data, isWeekly, newWordCount]);

  const quiz = useMemo(() => {
    if (!data) return [];
    const known = WORDS.filter((word) => data.learnedIds.includes(word.id));
    const weighted = [...known].sort((a, b) => (data.mistakes[b.kanji] ?? 0) - (data.mistakes[a.kanji] ?? 0));
    const total = isWeekly ? 20 : 5;
    return Array.from({ length: total }, (_, index) => questionFor(weighted[index % weighted.length], index));
  }, [data, isWeekly]);

  if (!data) return <main className="loading">正在整理今天的學習內容…</main>;

  const correctCount = answers.reduce((count, item, index) => {
    const accepted = quiz[index]?.word.meaning.split("、") ?? [];
    return count + (normalize(item) === normalize(quiz[index]?.answer ?? "") || accepted.some((value) => normalize(value) === normalize(item)) ? 1 : 0);
  }, 0);

  function submitAnswer(value = answer) {
    if (!value.trim()) return;
    setAnswers((items) => [...items, value]);
    setAnswer("");
    if (quizIndex < quiz.length - 1) setQuizIndex((index) => index + 1);
    else setStep(isWeekly ? 3 : 2);
  }

  function finishDay() {
    const mistakes = { ...data!.mistakes };
    answers.forEach((item, index) => {
      const q = quiz[index];
      const accepted = q.word.meaning.split("、");
      const correct = normalize(item) === normalize(q.answer) || accepted.some((value) => normalize(value) === normalize(item));
      if (!correct) mistakes[q.word.kanji] = (mistakes[q.word.kanji] ?? 0) + 1;
    });
    const learnedIds = [...new Set([...data!.learnedIds, ...todayNewWords.map((word) => word.id)])];
    const today = new Date().toISOString().slice(0, 10);
    const record: RecordItem = { date: today, score: correctCount, total: quiz.length, completed: true, sentences, checkIn: checkIn ?? "partial" };
    setData({ learnedIds, mistakes, records: [...data!.records.filter((item) => item.date !== today), record] });
    setStep(4);
  }

  function resetDemo() {
    if (!window.confirm("要清除這台裝置上的學習紀錄，回到示範初始狀態嗎？")) return;
    setData(INITIAL_DATA);
    setStep(0);
    setAnswers([]);
    setQuizIndex(0);
    setCheckIn(null);
  }

  const todayLabel = new Intl.DateTimeFormat("zh-TW", { month: "long", day: "numeric", weekday: "short" }).format(new Date());
  const accuracy = data.records.length ? Math.round((data.records.reduce((sum, record) => sum + record.score, 0) / data.records.reduce((sum, record) => sum + record.total, 0)) * 100) : 0;
  const streak = data.records.slice().reverse().findIndex((record) => !record.completed);
  const mistakeRows = Object.entries(data.mistakes).sort((a, b) => b[1] - a[1]);

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => setTab("today")} aria-label="回到今天">
          <span className="brand-mark">こ</span>
          <span><strong>Kotoba 日課</strong><small>N4 每日單字教練</small></span>
        </button>
        <div className="streak">🔥 連續 {streak < 0 ? data.records.length : streak} 天</div>
      </header>

      <nav className="tabs" aria-label="主要導覽">
        <button className={tab === "today" ? "active" : ""} onClick={() => setTab("today")}>今日學習</button>
        <button className={tab === "progress" ? "active" : ""} onClick={() => setTab("progress")}>學習進度</button>
        <button className={tab === "mistakes" ? "active" : ""} onClick={() => setTab("mistakes")}>易錯詞</button>
      </nav>

      {tab === "today" && (
        <section className="page">
          <div className="hero">
            <div>
              <p className="eyebrow">{todayLabel} · Day {data.records.length + 1}</p>
              <h1>{isWeekly ? "本週的成果，今天收進口袋。" : "每天一點點，日文就會留下來。"}</h1>
              <p>{isWeekly ? "今天不增加新詞，用 20 題把這週的記憶重新整理。" : `今天約 15–20 分鐘：回報、${quiz.length} 題複習、${todayNewWords.length} 個單字、3 句造句。`}</p>
            </div>
            <div className="day-ring"><strong>{Math.min(100, Math.round((step / 4) * 100))}%</strong><span>今日進度</span></div>
          </div>

          <div className="stepper">
            {["昨日回報", isWeekly ? "週測驗" : "複習測驗", isWeekly ? "整理錯詞" : "今日單字", "造句", "完成"].map((label, index) => (
              <div className={index <= step ? "done" : ""} key={label}><span>{index < step ? "✓" : index + 1}</span><small>{label}</small></div>
            ))}
          </div>

          {step === 0 && (
            <article className="card focus-card">
              <p className="card-kicker">STEP 1 · 昨日回報</p>
              <h2>昨天的任務完成得怎麼樣？</h2>
              <p className="muted">誠實回報就好。沒完成也沒關係，今天會自動縮小任務。</p>
              <div className="choice-grid">
                {[
                  ["done", "✓", "全部完成", "測驗、單字和造句都完成"],
                  ["partial", "◐", "完成一部分", "有學習，但還留了一些"],
                  ["missed", "—", "還沒開始", "今天先做最小版本"],
                ].map(([value, icon, title, text]) => (
                  <button key={value} className={checkIn === value ? "choice selected" : "choice"} onClick={() => setCheckIn(value as RecordItem["checkIn"])}>
                    <span>{icon}</span><strong>{title}</strong><small>{text}</small>
                  </button>
                ))}
              </div>
              <button className="primary" disabled={!checkIn} onClick={() => setStep(1)}>開始今天的複習 →</button>
            </article>
          )}

          {step === 1 && quiz[quizIndex] && (
            <article className="card quiz-card">
              <div className="quiz-meta"><span>{quiz[quizIndex].kind}</span><strong>{quizIndex + 1} / {quiz.length}</strong></div>
              <div className="progress-track"><i style={{ width: `${((quizIndex + 1) / quiz.length) * 100}%` }} /></div>
              <h2>{quiz[quizIndex].prompt}</h2>
              {quiz[quizIndex].options ? (
                <div className="option-list">
                  {quiz[quizIndex].options!.map((option) => <button key={option} onClick={() => submitAnswer(option)}>{option}</button>)}
                </div>
              ) : (
                <form onSubmit={(event) => { event.preventDefault(); submitAnswer(); }}>
                  <label htmlFor="answer">你的答案</label>
                  <input id="answer" autoFocus value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="輸入中文、漢字或假名" />
                  <button className="primary" type="submit">送出答案</button>
                </form>
              )}
              <button className="text-button" onClick={() => setShowHelp(!showHelp)}>⌨ 日文 9 鍵小提示</button>
              {showHelp && <div className="tip">小字：先打 ゆ／つ，再按「小」變成 ゅ／っ。濁音：先打 へ，再按 ゛變成 べ。</div>}
            </article>
          )}

          {step === 2 && !isWeekly && (
            <section>
              <div className="section-heading"><div><p className="card-kicker">STEP 3 · 今日單字</p><h2>今天的 {todayNewWords.length} 個新詞</h2></div><span className="adaptive">依近期正確率 {Math.round(recentAccuracy * 100)}% 調整</span></div>
              <div className="word-grid">
                {todayNewWords.map((word, index) => (
                  <article className="word-card" key={word.id}>
                    <span className="word-number">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{word.kanji}</h3><p className="kana">{word.kana}</p>
                    <strong>{word.meaning}</strong>
                    <div className="example"><p>{word.example}</p><small>{word.translation}</small></div>
                  </article>
                ))}
              </div>
              <button className="primary wide" onClick={() => setStep(3)}>我讀完了，開始造句 →</button>
            </section>
          )}

          {step === 2 && isWeekly && (
            <article className="card focus-card">
              <p className="card-kicker">本週測驗結果</p><h2>{correctCount} / {quiz.length} 題答對</h2>
              <p className="muted">今天不增加新詞。先把錯題收進易錯詞，下週會優先再考。</p>
              <button className="primary" onClick={() => setStep(3)}>整理並完成本週複習 →</button>
            </article>
          )}

          {step === 3 && (
            <article className="card sentence-card">
              <p className="card-kicker">STEP 4 · 造句練習</p>
              <h2>{isWeekly ? "寫下這週最想記住的 3 句" : "用今天的詞，寫 3 句自己的日文"}</h2>
              <p className="muted">{isWeekly ? "可以使用本週任何單字。" : `建議使用：${todayNewWords.slice(0, 3).map((word) => `${word.kanji}（${word.kana}）`).join("、")}`}</p>
              {sentences.map((sentence, index) => (
                <label className="sentence-input" key={index}><span>{index + 1}</span><input value={sentence} onChange={(event) => setSentences((items) => items.map((item, i) => i === index ? event.target.value : item))} placeholder="輸入一句日文…" /></label>
              ))}
              <button className="primary" disabled={sentences.some((item) => !item.trim())} onClick={finishDay}>完成今天的學習 ✓</button>
            </article>
          )}

          {step === 4 && (
            <article className="card complete-card">
              <span className="celebrate">よくできました！</span>
              <h2>今天完成了。</h2>
              <div className="result-number"><strong>{correctCount}/{quiz.length}</strong><span>測驗成績</span></div>
              <p>錯題已經加入易錯詞。明天會依這次表現，自動安排最適合的單字量。</p>
              <button className="secondary" onClick={() => setTab("progress")}>查看我的進度</button>
            </article>
          )}
        </section>
      )}

      {tab === "progress" && (
        <section className="page">
          <div className="section-heading"><div><p className="eyebrow">LEARNING LOG</p><h1>你的學習進度</h1></div></div>
          <div className="stat-grid">
            <article><small>累積學習</small><strong>{data.records.length}<span> 天</span></strong></article>
            <article><small>累積單字</small><strong>{data.learnedIds.length}<span> 個</span></strong></article>
            <article><small>平均正確率</small><strong>{accuracy}<span>%</span></strong></article>
          </div>
          <article className="card">
            <h2>最近紀錄</h2>
            <div className="history-list">
              {data.records.slice().reverse().map((record, index) => (
                <div key={`${record.date}-${index}`}><span className="history-dot">✓</span><div><strong>{record.date}</strong><small>{record.total === 20 ? "週複習" : "每日學習"} · 造句 {record.sentences.filter(Boolean).length} 句</small></div><b>{record.score}/{record.total}</b></div>
              ))}
            </div>
          </article>
          <button className="danger-link" onClick={resetDemo}>重設這台裝置的示範資料</button>
        </section>
      )}

      {tab === "mistakes" && (
        <section className="page">
          <div className="section-heading"><div><p className="eyebrow">REVIEW FIRST</p><h1>易錯詞整理</h1><p className="muted">答錯越多次，之後的複習測驗越優先出現。</p></div></div>
          <div className="mistake-list">
            {mistakeRows.length ? mistakeRows.map(([kanji, count]) => {
              const word = WORDS.find((item) => item.kanji === kanji);
              return <article key={kanji}><div><h3>{kanji} <span>{word?.kana}</span></h3><p>{word?.meaning}</p></div><div className="mistake-count"><strong>{count}</strong><small>次答錯</small></div></article>;
            }) : <article><p>目前沒有易錯詞，太棒了！</p></article>}
          </div>
        </section>
      )}
      <footer>資料只保存在這台裝置的瀏覽器 · Kotoba 日課 MVP</footer>
    </main>
  );
}
