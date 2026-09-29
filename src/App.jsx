import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <span className="brand-mark">P</span>
          <span>PivotFit</span>
        </div>

        <nav className="nav-links">
          <button className="nav-link active">Home</button>
          <button className="nav-link">Workouts</button>
          <button className="nav-link">Progress</button>
          <button className="nav-link">Profile</button>
        </nav>
      </header>

      <main className="dashboard">
        <section className="welcome">
          <p className="eyebrow">DASHBOARD</p>
          <h1>Ready to train?</h1>
          <p>
            Stay on track, adjust when you need to, and keep moving forward.
          </p>
        </section>

        <section className="workout-card">
          <div className="workout-card-header">
            <div>
              <p className="eyebrow">TODAY'S WORKOUT</p>
              <h2>Chest + Triceps</h2>
            </div>

            <span className="status-badge">Scheduled</span>
          </div>

          <div className="workout-meta">
            <span>6 exercises</span>
            <span>•</span>
            <span>~60 min</span>
          </div>

          <button className="primary-button">Start Workout</button>
        </section>

        <section className="dashboard-grid">
          <article className="stat-card">
            <p className="eyebrow">THIS WEEK</p>
            <strong>3</strong>
            <span>Workouts completed</span>
          </article>

          <article className="stat-card">
            <p className="eyebrow">CONSISTENCY</p>
            <strong>75%</strong>
            <span>Weekly goal</span>
          </article>

          <article className="stat-card">
            <p className="eyebrow">NEXT UP</p>
            <strong>Back + Biceps</strong>
            <span>Tomorrow</span>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;