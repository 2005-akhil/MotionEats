import { useState } from 'react';
import { Zap, Camera, ShieldCheck, Hand, Sparkles, Mic } from 'lucide-react';
import { useMotion, MOTION_STATE } from '../context/MotionContext.jsx';
import { useMotionController } from '../hooks/useMotionController.jsx';
import styles from './MotionHelpPage.module.css';

export function MotionHelpPage() {
  const { motionState, faceDetected } = useMotion();
  const { toggle } = useMotionController();
  const [testClickCount, setTestClickCount] = useState(0);
  const [lastNavigation, setLastNavigation] = useState(null);

  const isActive = motionState === MOTION_STATE.ACTIVE;

  const testNavigation = (direction) => {
    setLastNavigation(direction);
    window.dispatchEvent(
      new CustomEvent('motioneats:navigation', {
        detail: { direction },
      })
    );

    setTimeout(() => {
      setLastNavigation(null);
    }, 1000);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.pill}>
            <Zap size={15} /> Hands-Free Experience
          </span>

          <h1 className={styles.title}>
            Motion Control Guide & Settings
          </h1>

          <p className={styles.subtitle}>
            MotionEats lets you browse, choose food, add to cart,
            and checkout hands-free using gestures or voice commands.
          </p>

          <div className={styles.toggleWrap}>
            <button
              className={`${styles.toggleBtn} ${isActive ? styles.btnActive : ''}`}
              onClick={toggle}
            >
              <Zap size={18} />
              {isActive
                ? 'Disable Motion Control'
                : 'Enable Motion Control Now'}
            </button>

            <span className={styles.statusNote}>
              Status: <strong>{motionState}</strong>{' '}
              {faceDetected ? '· Face Detected' : ''}
            </span>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Sparkles size={20} className={styles.iconAccent} />
            Live Gesture Tester
          </h2>

          <p className={styles.sectionDesc}>
            Enable motion control above, then test the controls below.
          </p>

          <div className={styles.testGrid}>
            <div className={styles.testCard}>
              <div className={styles.testCardHeader}>
                <span className={styles.gestureIcon}>🤏</span>
                <div>
                  <strong>Pinch-to-Click Test</strong>
                  <p>
                    Point at the button and pinch thumb + index together.
                  </p>
                </div>
              </div>

              <button
                className={styles.targetBtn}
                onClick={() => setTestClickCount(c => c + 1)}
              >
                Pinch Me! (Clicked: {testClickCount})
              </button>
            </div>

            <div className={styles.testCard}>
              <div className={styles.testCardHeader}>
                <span className={styles.gestureIcon}>✊ 🖐️</span>
                <div>
                  <strong>Next / Back Test</strong>
                  <p>
                    Use a fist for Next or an open palm for Back.
                  </p>
                </div>
              </div>

              <div className={styles.swipeBox}>
                {lastNavigation ? (
                  <span className={styles.swipeSuccess}>
                    Sent: {lastNavigation}
                  </span>
                ) : (
                  <span className={styles.swipePrompt}>
                    Waiting for Next / Back...
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button
                  className={styles.targetBtn}
                  onClick={() => testNavigation('back')}
                >
                  🖐️ Back
                </button>

                <button
                  className={styles.targetBtn}
                  onClick={() => testNavigation('next')}
                >
                  ✊ Next
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Hand size={20} className={styles.iconAccent} />
            Gesture Reference
          </h2>

          <div className={styles.gestureGrid}>
            <GestureCard
              icon="☝️"
              title="Point"
              action="Controls virtual cursor"
              desc="Extend your index finger. The cursor follows your fingertip."
            />

            <GestureCard
              icon="🤏"
              title="Pinch"
              action="Clicks the focused element"
              desc="Bring your index fingertip and thumb tip together to click."
            />

            <GestureCard
              icon="👍"
              title="Thumbs Up"
              action="Scrolls up"
              desc="Hold a thumbs-up gesture to move the page upward."
            />

            <GestureCard
              icon="👎"
              title="Thumbs Down"
              action="Scrolls down"
              desc="Hold a thumbs-down gesture to move the page downward."
            />

            <GestureCard
              icon="✊"
              title="Fist"
              action="Next"
              desc="Make a fist to move forward. On the home page it opens Restaurants; elsewhere it follows browser forward history."
            />

            <GestureCard
              icon="🖐️"
              title="Open Palm"
              action="Back"
              desc="Show an open palm to go back to the previous page."
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Mic size={20} className={styles.iconAccent} />
            Voice Commands
          </h2>

          <p className={styles.sectionDesc}>
            Turn on the Voice button and speak naturally.
          </p>

          <div className={styles.gestureGrid}>
            <GestureCard
              icon="🎙️"
              title="Scroll"
              action="Say “scroll up” or “scroll down”"
              desc="Moves the current page without touching the mouse."
            />

            <GestureCard
              icon="🎙️"
              title="Navigation"
              action="Say “next” or “go back”"
              desc="Uses the same Next and Back navigation as the hand gestures."
            />

            <GestureCard
              icon="🍔"
              title="Food Search"
              action="Say “show me burger”"
              desc="Opens the restaurant results and searches for the food. You can also say “show some food items like burger”."
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.infoBanner}>
            <div className={styles.infoBlock}>
              <div className={styles.infoIconWrap}>
                <ShieldCheck size={26} className={styles.infoIcon} />
              </div>

              <div>
                <h3>In-Browser Privacy</h3>
                <p>
                  Hand tracking runs in the browser. Voice recognition
                  depends on the browser's speech-recognition service.
                </p>
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoIconWrap}>
                <Camera size={26} className={styles.infoIcon} />
              </div>

              <div>
                <h3>Fallback Guarantee</h3>
                <p>
                  Mouse, keyboard, and touch controls remain available
                  even when motion or voice control is disabled.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function GestureCard({ icon, title, action, desc }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardIcon}>{icon}</span>

        <div>
          <h3 className={styles.cardTitle}>{title}</h3>
          <span className={styles.cardAction}>{action}</span>
        </div>
      </div>

      <p className={styles.cardDesc}>{desc}</p>
    </div>
  );
}
