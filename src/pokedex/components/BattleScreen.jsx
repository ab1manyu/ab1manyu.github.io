import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getRandomUnovaPokemon, getPokemonByName, UNOVA_COUNT, TYPE_COLORS } from "../data/unovaPokemon";
import { catchPokemon } from "../db/pokemonDB";
import styles from "./BattleScreen.module.css";

const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

function getSpriteUrl(id) {
  return `${SPRITE_BASE}${id}.png`;
}

export default function BattleScreen({ caughtIds, onCatch }) {
  const [wildPokemon, setWildPokemon] = useState(null);
  const [guess, setGuess] = useState("");
  const [phase, setPhase] = useState("guessing"); // guessing | caught | wrong | ran_away | all_caught
  const [wrongCount, setWrongCount] = useState(0);
  const [message, setMessage] = useState("A wild Pokémon appeared!");
  const [revealed, setRevealed] = useState(false);
  const [spriteLoaded, setSpriteLoaded] = useState(false);
  const inputRef = useRef(null);
  const caughtIdsRef = useRef(caughtIds);

  useEffect(() => {
    caughtIdsRef.current = caughtIds;
  }, [caughtIds]);

  // Typing effect for message
  const [displayedMessage, setDisplayedMessage] = useState("");
  useEffect(() => {
    setDisplayedMessage("");
    if (!message) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedMessage(message.slice(0, i + 1));
      i++;
      if (i >= message.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [message]);

  const spawnNewPokemon = useCallback(() => {
    const ids = [...caughtIdsRef.current];
    if (ids.length >= UNOVA_COUNT) {
      setPhase("all_caught");
      return;
    }
    const pokemon = getRandomUnovaPokemon(ids);
    setWildPokemon(pokemon);
    setGuess("");
    setPhase("guessing");
    setRevealed(false);
    setSpriteLoaded(false);
    setMessage(`A wild Pokémon appeared!`);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)
      .then(r => r.json())
      .then(d => {
        const typeName = d.types[0].type.name;
        const hex = TYPE_COLORS[typeName] || "#e53935";
        document.documentElement.style.setProperty('--theme-color', hex);
        const h = hex.replace("#", "");
        const rgb = `${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}`;
        document.documentElement.style.setProperty('--theme-color-rgb', rgb);
      })
      .catch(() => {
        document.documentElement.style.setProperty('--theme-color', "#e53935");
        document.documentElement.style.setProperty('--theme-color-rgb', "229, 57, 53");
      });

    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const isMatch = useMemo(() => {
    if (!wildPokemon || phase === "caught" || phase === "ran_away") return false;
    const normalizedGuess = guess.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    if (!normalizedGuess) return false;
    const actualName = wildPokemon.name.toLowerCase().replace(/[^a-z]/g, "");
    return normalizedGuess === actualName;
  }, [guess, wildPokemon, phase]);

  useEffect(() => {
    if (!wildPokemon || phase === "caught" || phase === "ran_away" || phase === "wrong") return;
    if (isMatch) {
      setMessage(`A wild ${wildPokemon.name} appeared!`);
    } else {
      setMessage(`A wild Pokémon appeared!`);
    }
  }, [isMatch, phase, wildPokemon]);

  useEffect(() => {
    spawnNewPokemon();
  }, [spawnNewPokemon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wildPokemon || phase === "caught" || phase === "ran_away") return;

    if (isMatch) {
      setPhase("caught");
      setRevealed(true);
      setMessage(`You caught ${capitalize(wildPokemon.name)}!`);
      await catchPokemon(wildPokemon.id);
      await onCatch();
      setTimeout(() => spawnNewPokemon(), 3200);
    } else {
      // Wrong
      const newCount = wrongCount + 1;
      setWrongCount(newCount);
      setPhase("wrong");
      const hints = [
        "That's not it!",
        "Not quite… look carefully!",
        "Are you sure that's even a Pokémon?",
        "Wrong!",
      ];
      const hint = hints[Math.min(newCount - 1, hints.length - 1)];
      setMessage(hint);
      const typingTime = hint.length * 25;
      setTimeout(() => {
        setPhase("idle");
        setMessage(`A wild Pokémon appeared!`);
      }, typingTime + 1200);
      setGuess("");
    }
  };

  const handleSkip = () => {
    if (phase === "caught" || phase === "ran_away") return;
    setPhase("ran_away");
    setRevealed(false);
    setMessage("Got away safely!");
    setTimeout(() => {
      setWrongCount(0);
      spawnNewPokemon();
    }, 2500);
  };

  const getWordleDisplay = () => {
    if (!wildPokemon) return "???";
    if (revealed || phase === "caught" || isMatch) {
      return wildPokemon.name.toUpperCase().split("").join(" ");
    }

    const actual = wildPokemon.name.toLowerCase();
    const typed = guess.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");

    return actual.split("").map((char, i) => {
      if (/[^a-z]/.test(char)) return char;
      const typedChar = typed[i];
      if (typedChar === char) return char.toUpperCase();
      return "\u00A0";
    }).join(" ");
  };

  if (phase === "all_caught") {
    return (
      <div className={styles.battle}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.allCaught}>
          <div className={styles.trophy}>🏆</div>
          <h2 className={styles.allCaughtTitle}>POKÉDEX COMPLETE!</h2>
          <p className={styles.allCaughtSub}>You've caught all 156 Unova Pokémon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.battle}>
      {/* Background grid */}
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.arena}>
        <div className={styles.wildBanner}>
          <span className={`${styles.wildName} ${isMatch ? styles.wildNameMatch : ""} ${wildPokemon?.name.length > 11 ? styles.wildNameMini : wildPokemon?.name.length > 9 ? styles.wildNameSmall : ""}`}>
            {getWordleDisplay()}
          </span>
        </div>

        {/* Sprite area */}
        <div className={`${styles.spriteArea} ${phase === "caught" ? styles.spriteAreaCaught : ""}`}>
          {wildPokemon && (
            <>
              {!spriteLoaded && (
                <div className={styles.spriteLoader}>
                  <span className={styles.spriteLoaderSpinner} />
                </div>
              )}
              <img
                key={wildPokemon.id}
                src={getSpriteUrl(wildPokemon.id)}
                alt={(revealed || isMatch) ? wildPokemon.name : "silhouetted Pokémon"}
                className={`${styles.sprite} ${spriteLoaded ? styles.spriteVisible : ""} ${(revealed || isMatch) ? styles.spriteRevealed : (phase === "ran_away" ? styles.spriteRanAway : styles.spriteSilhouette)}`}
                onLoad={() => setSpriteLoaded(true)}
                draggable={false}
              />
            </>
          )}
        </div>

        {/* Message box */}
        <div className={`${styles.messageBox} ${phase === "wrong" ? styles.messageBoxWrong : ""} ${phase === "caught" ? styles.messageBoxCaught : ""}`}>
          <p className={styles.messageText} aria-live="polite">
            {displayedMessage}
          </p>
        </div>

        {/* Input area */}
        <form className={`${styles.guessForm} ${(phase === "caught" || phase === "ran_away") ? styles.hiddenForm : ""}`} onSubmit={handleSubmit} autoComplete="off">
          <div className={`${styles.inputWrapper} ${phase === "wrong" ? styles.inputShake : ""}`}>
            <span className={styles.inputPrefix}>▶</span>
            <input
              ref={inputRef}
              id="pokemon-guess-input"
              type="text"
              className={styles.guessInput}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Who's that Pokémon?"
              autoComplete="off"
              spellCheck={false}
              aria-label="Type the Pokémon's name"
              disabled={phase === "caught"}
            />
          </div>
          <div className={styles.buttonRow}>
            <button
              id="catch-submit-button"
              type="submit"
              className={`${styles.catchButton} ${isMatch ? styles.catchButtonMatch : ""}`}
              disabled={!guess.trim() || phase === "caught"}
            >
              <span className={styles.pokeballBtn} aria-hidden="true">◉</span>
              CATCH!
            </button>
            <button
              id="run-away-button"
              type="button"
              className={styles.runButton}
              onClick={handleSkip}
            >
              RUN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
