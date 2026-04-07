import { useState, useEffect } from "react";
import { comparisons, getOverallScore, categories } from "./data";
import "./App.css";

function getMatchColor(percent) {
  if (percent >= 85) return { bg: "rgba(255,0,51,0.25)", border: "#ff0033", text: "#ff4466" };
  if (percent >= 70) return { bg: "rgba(255,102,0,0.25)", border: "#ff6600", text: "#ff8833" };
  if (percent >= 55) return { bg: "rgba(255,255,0,0.2)", border: "#ffff00", text: "#ffff44" };
  return { bg: "rgba(57,255,20,0.2)", border: "#39ff14", text: "#66ff44" };
}

function getScoreColor(score) {
  if (score >= 80) return "#ff0033";
  if (score >= 60) return "#ff6600";
  if (score >= 40) return "#ffff00";
  return "#39ff14";
}

function getVerdict(score) {
  if (score >= 85) return "WE'RE ALREADY THERE, SCROTE";
  if (score >= 75) return "BASICALLY A DOCUMENTARY AT THIS POINT";
  if (score >= 60) return "APPROACHING FULL IDIOCRACY";
  if (score >= 40) return "HALFWAY TO BRAWNDO TOWN";
  return "THERE'S STILL HOPE... MAYBE";
}

function ComparisonCard({ item }) {
  const colors = getMatchColor(item.matchPercent);

  return (
    <div className="comparison-card">
      <div className="card-side card-movie">
        <div className="card-side-label label-movie">
          <span>&#127902;</span> IDIOCRACY (THE MOVIE)
        </div>
        <div className="card-side-title movie-title">{item.movieTitle}</div>
        <div className="card-year">YEAR {item.movieYear}</div>
        <div className="card-description">{item.movieDescription}</div>
      </div>

      <div className="card-center">
        <div className="vs-arrows">VS</div>
        <div
          className="match-circle"
          style={{
            background: colors.bg,
            borderColor: colors.border,
            color: colors.text,
            border: `2px solid ${colors.border}`,
          }}
        >
          {item.matchPercent}%
        </div>
        <div className="match-label">MATCH</div>
        <div className="category-tag">{item.category}</div>
      </div>

      <div className="card-side card-reality">
        <div className="card-side-label label-reality">
          <span>&#127758;</span> REALITY (RIGHT NOW)
        </div>
        <div className="card-side-title reality-title">{item.realTitle}</div>
        <div className="card-description">{item.realDescription}</div>
        <div className="card-source">
          <a href={item.realUrl} target="_blank" rel="noopener noreferrer">
            &#128279; {item.realSource}
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [filter, setFilter] = useState("ALL");
  const [animatedScore, setAnimatedScore] = useState(0);
  const score = getOverallScore();

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    let raf;

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out curve to match the CSS transition
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedScore(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    // small delay to match the bar's start
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [score]);

  const filtered =
    filter === "ALL"
      ? comparisons
      : comparisons.filter((c) => c.category === filter);

  const scoreColor = getScoreColor(score);

  return (
    <>
      <div className="scanlines" />

      <div className="ticker-bar">
        <div className="ticker-text">
          &#9888;&#65039; BREAKING: ELECTROLYTES CONFIRMED AS WHAT PLANTS CRAVE
          &#8226; COSTCO LAW SCHOOL NOW ACCEPTING APPLICATIONS &#8226;
          UPGRADE TO BRAWNDO PREMIUM FOR EXTRA ELECTROLYTES &#8226;
          REHABILITATION SEASON 47 PREMIERS TUESDAY &#8226;
          BROUGHT TO YOU BY CARL'S JR &#8226;
          MONDAY NIGHT REHABILITATION RATINGS AT ALL-TIME HIGH &#8226;
          SECRETARY OF STATE SPONSORED BY MOUNTAIN DEW &#8226;
          IF YOU DON'T SMOKE TARRYLTONS YOU'RE STUPID &#8226;
        </div>
      </div>

      <section className="hero">
        <h1 className="hero-title">ARE WE IDIOCRACY YET?</h1>
        <p className="hero-subtitle">
          Tracking how close reality is to Mike Judge's 2006 prophecy
        </p>
        <p className="brought-to-you">
          BROUGHT TO YOU BY CARL'S JR.
        </p>
      </section>

      <section className="score-section">
        <div className="score-label">IDIOCRACY PROXIMITY INDEX</div>
        <div className="score-meter">
          <div className="score-track">
            <div
              className="score-fill"
              style={{
                width: `${animatedScore}%`,
                background: `linear-gradient(90deg, #39ff14, ${scoreColor})`,
              }}
            />
          </div>
          <div className="score-labels">
            <span>FUNCTIONAL SOCIETY</span>
            <span>FULL IDIOCRACY</span>
          </div>
        </div>
        <div className="score-number" style={{ color: scoreColor }}>
          {animatedScore}%
        </div>
        <div className="score-verdict">{getVerdict(score)}</div>
      </section>

      <div className="filter-bar">
        {["ALL", ...categories].map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="comparisons">
        {filtered.map((item) => (
          <ComparisonCard key={item.id} item={item} />
        ))}
      </div>

      <footer className="footer">
        <div className="footer-text">
          "I like money." — Frito Pendejo
        </div>
        <div className="footer-sub">
          GO AWAY, I'M BATIN'
        </div>
        <div className="footer-disclaimer">
          This is a satirical website inspired by Mike Judge's Idiocracy (2006).
          All real-world references are sourced from public news reporting.
          Not affiliated with 20th Century Fox or any Brawndo subsidiaries.
        </div>
      </footer>
    </>
  );
}

export default App;
