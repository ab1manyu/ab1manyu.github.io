import { useCallback, useEffect, useRef, useState } from "react";
import { generateKaiCards, PACK_SIZE, PACKS } from "./data/kaiCardsData";
import KaiCard from "./components/KaiCard";
import BoosterPack from "./components/BoosterPack";
import styles from "./styles/KaiCards.module.css";

const FLY_MS = 450;
const DISMISS_DRAG = 90; // px dragged up to throw a card away
const STORAGE_KEY = "kai-cards-collection";

// A card's identity for collecting: its art (all legendaries of a pack share one)
const cardKey = (card) => card.image;

// Collection lives in sessionStorage for the duration of a visit only:
// it is wiped whenever the page mounts (refresh or coming back to it).
function freshCollection() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
  return {};
}

function saveCollection(collection) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  } catch {
    /* storage unavailable */
  }
}

export default function KaiCardsCore() {
  const [selected, setSelected] = useState(null);
  const [cards, setCards] = useState([]);
  const [collection, setCollection] = useState(freshCollection); // { packId: [cardKey] }
  const [newKeys, setNewKeys] = useState([]); // keys first collected this pack
  const [packKey, setPackKey] = useState(0);
  const [opened, setOpened] = useState(false); // pack ripped, cards rising
  const [packGone, setPackGone] = useState(false);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const drag = useRef({ startY: 0, moved: false, active: false });
  const dragYRef = useRef(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const onRipped = useCallback(() => {
    setOpened(true);
    later(() => setPackGone(true), 900);
  }, []);

  const dismiss = useCallback(() => {
    if (leaving || !opened || index >= cards.length) return;
    setLeaving(true);
    setDragging(false);
    later(() => {
      if (index + 1 >= cards.length && selected) {
        const prev = collection[selected.id] ?? [];
        const pulled = [...new Set(cards.map(cardKey))];
        const next = {
          ...collection,
          [selected.id]: [...new Set([...prev, ...pulled])],
        };
        setNewKeys(pulled.filter((k) => !prev.includes(k)));
        setCollection(next);
        saveCollection(next);
      }
      setIndex((i) => i + 1);
      setLeaving(false);
      setDragY(0);
      dragYRef.current = 0;
    }, FLY_MS);
  }, [leaving, opened, index, cards, selected, collection]);

  const onDown = (e) => {
    if (leaving) return;
    drag.current = { startY: e.clientY, moved: false, active: true };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (!drag.current.active) return;
    const dy = e.clientY - drag.current.startY;
    if (Math.abs(dy) > 6) drag.current.moved = true;
    dragYRef.current = Math.min(0, dy);
    setDragY(dragYRef.current);
  };
  const onUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (!drag.current.moved || dragYRef.current < -DISMISS_DRAG) {
      dismiss();
    } else {
      setDragging(false);
      setDragY(0);
    }
  };

  const newPack = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSelected(null);
    setCards([]);
    setNewKeys([]);
    setOpened(false);
    setPackGone(false);
    setIndex(0);
    setLeaving(false);
    setDragY(0);
    setPackKey((k) => k + 1);
  };

  const onSelect = useCallback((pack) => {
    setSelected(pack);
    setCards(generateKaiCards(PACK_SIZE, pack));
  }, []);

  // Overview order: legendary first, then new cards, then the rest (stable)
  const summaryCards = [...cards].sort((a, b) => {
    const score = (c) =>
      (c.isLegendary ? 2 : 0) + (newKeys.includes(cardKey(c)) ? 1 : 0);
    return score(b) - score(a);
  });

  const finished = cards.length > 0 && index >= cards.length;

  const cardStyle = (idx) => {
    const depth = idx - index - (leaving ? 1 : 0);
    if (idx === index) {
      if (leaving) {
        return {
          transform: "translateY(-125vh) rotate(-4deg)",
          transition: `transform ${FLY_MS}ms cubic-bezier(0.5, 0, 0.9, 0.6)`,
          zIndex: 50,
        };
      }
      return {
        transform: `translateY(${dragY}px) rotate(${dragY * 0.01}deg)`,
        transition: dragging ? "none" : "transform 0.3s ease",
        zIndex: 50,
      };
    }
    return {
      transform: `translateY(${-depth * 10}px) scale(${1 - depth * 0.035})`,
      transition: "transform 0.4s ease",
      zIndex: 20 - depth,
    };
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center pt-20 pb-10 px-4 select-none ${styles.stage}`}
    >
      <div className={styles.glow} />

      <p className={styles.caption}>
        {!selected
          ? "Choose a pack to rip open"
          : !opened
            ? "Opening…"
            : finished
              ? "Pack opened"
              : `${index + 1} / ${cards.length} · swipe or tap to flip through`}
      </p>

      {!finished && (
        <div className={styles.row}>
          {PACKS.map((pack) => {
            const isSelected = selected?.id === pack.id;
            const hidden = selected && !isSelected;
            return (
              <div
                key={pack.id}
                className={`${styles.arena} ${isSelected ? styles.arenaSelected : ""} ${
                  hidden ? styles.arenaHidden : ""
                }`}
              >
                {isSelected && (
                  <>
                    {/* cards sit inside the pack and rise as it opens */}
                    <div
                      className={`${styles.deck} ${opened ? styles.deckOpen : ""}`}
                    >
                      {opened && cards[index]?.isLegendary && (
                        <div
                          className={`${styles.legendFx} ${
                            leaving ? styles.legendFxOut : ""
                          }`}
                          aria-hidden="true"
                        >
                          <div className={styles.rays} />
                          <div className={styles.halo} />
                          {Array.from({ length: 12 }, (_, i) => (
                            <span
                              key={i}
                              className={styles.spark}
                              style={{
                                left: `${8 + ((i * 37) % 84)}%`,
                                animationDelay: `${(i % 6) * 0.35}s`,
                                animationDuration: `${2.2 + (i % 4) * 0.5}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                      {cards.map((card, idx) => {
                        if (idx < index) return null;
                        if (idx - index > 3) return null;
                        const top = idx === index;
                        return (
                          <div
                            key={card.id}
                            className={styles.slot}
                            style={cardStyle(idx)}
                            {...(top && opened
                              ? {
                                  onPointerDown: onDown,
                                  onPointerMove: onMove,
                                  onPointerUp: onUp,
                                  onPointerCancel: onUp,
                                  role: "button",
                                  tabIndex: 0,
                                  "aria-label": "Next card",
                                  onKeyDown: (e) => {
                                    if (
                                      e.key === "Enter" ||
                                      e.key === " " ||
                                      e.key === "ArrowUp"
                                    ) {
                                      e.preventDefault();
                                      dismiss();
                                    }
                                  },
                                }
                              : {})}
                          >
                            <KaiCard card={card} totalCards={cards.length} />
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {!(isSelected && packGone) && (
                  <BoosterPack
                    key={`${pack.id}-${packKey}`}
                    pack={pack}
                    disabled={!!selected}
                    onSelect={onSelect}
                    onRipped={onRipped}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {finished && selected && (
        <div className={styles.summary}>
          <div className={styles.grid}>
            {summaryCards.map((card, i) => (
              <div
                key={card.id}
                className={styles.miniWrap}
                style={{ animationDelay: `${i * 110}ms` }}
              >
                <div className={styles.miniCard}>
                  <KaiCard card={card} totalCards={cards.length} />
                </div>
                {newKeys.includes(cardKey(card)) && (
                  <span className={styles.newBadge}>NEW</span>
                )}
              </div>
            ))}
          </div>

          <div
            className={styles.collection}
            style={{ animationDelay: `${cards.length * 110 + 150}ms` }}
          >
            <div className={styles.collectionHead}>
              <span>{selected.name} collection</span>
              <span>
                {(collection[selected.id] ?? []).length} /{" "}
                {selected.images.length + 1}
              </span>
            </div>
            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{
                  width: `${((collection[selected.id] ?? []).length / (selected.images.length + 1)) * 100}%`,
                }}
              />
            </div>
            <p className={styles.collectionNote}>
              {newKeys.length > 0
                ? `${newKeys.length} new this pull`
                : "No new cards this pull"}
            </p>
          </div>
        </div>
      )}

      <div className={styles.footerSlot}>
        {finished && (
          <button type="button" className={styles.again} onClick={newPack}>
            Open another pack
          </button>
        )}
      </div>
    </div>
  );
}
