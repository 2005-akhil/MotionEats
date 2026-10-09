
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { RESTAURANTS, getRestaurantById } from '../../data/restaurants.js';
import styles from './VoiceControl.module.css';

export function VoiceControl() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();

  const recognitionRef = useRef(null);
  const pathnameRef = useRef(location.pathname);
  pathnameRef.current = location.pathname;

  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  const dispatchNavigation = (direction) => {
    window.dispatchEvent(
      new CustomEvent('motioneats:navigation', {
        detail: { direction },
      })
    );
  };

  const normalize = (text) =>
    text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

  const cleanSearchTerm = (text) =>
    text
      .replace(/^show\s+some\s+food\s+items?\s+like\s+/i, '')
      .replace(/^show\s+food\s+items?\s+like\s+/i, '')
      .replace(/^(show|find|search)\s+(me\s+)?/i, '')
      .replace(/^open\s+/i, '')
      .replace(/^(give me|i want|take me to)\s+/i, '')
      .trim();

  const findRestaurant = (spokenName) => {
    const term = normalize(
      spokenName.replace(/^restaurant\s+/i, '')
    );

    if (!term) return null;

    return (
      RESTAURANTS.find((restaurant) => normalize(restaurant.name) === term) ||
      RESTAURANTS.find((restaurant) => normalize(restaurant.name).includes(term)) ||
      null
    );
  };

  const parseCheckoutField = (command) => {
    const patterns = [
      { field: 'name', regex: /^(?:my\s+)?name\s+(?:is\s+)?(.+)$/i },
      { field: 'email', regex: /^(?:my\s+)?email\s+(?:is\s+)?(.+)$/i },
      {
        field: 'phone',
        regex: /^(?:(?:my\s+)?phone(?:\s+number)?|mobile(?:\s+number)?)\s+(?:is\s+)?(.+)$/i,
      },
      { field: 'address', regex: /^(?:my\s+)?address\s+(?:is\s+)?(.+)$/i },
      { field: 'city', regex: /^(?:my\s+)?city\s+(?:is\s+)?(.+)$/i },
      {
        field: 'zip',
        regex: /^(?:(?:my\s+)?zip(?:\s+code)?|postal\s+code|postcode)\s+(?:is\s+)?(.+)$/i,
      },
    ];

    for (const { field, regex } of patterns) {
      const match = command.match(regex);

      if (match?.[1]?.trim()) {
        let value = match[1].trim();

        if (field === 'email') {
          value = value
            .replace(/\s+at\s+/gi, '@')
            .replace(/\s+dot\s+/gi, '.')
            .replace(/\s+/g, '');
        }

        return { field, value };
      }
    }

    return null;
  };

  const handleBuyVoiceCommand = (command) => {
    // Buying is restricted to the restaurant currently being viewed.
    const routeMatch = pathnameRef.current.match(/^\/restaurant\/([^/]+)\/?$/i);
    const restaurant = routeMatch
      ? getRestaurantById(decodeURIComponent(routeMatch[1]))
      : null;

    const match = command.match(
      /^(buy|by|order|purchase|get|add)\s+(?:me\s+)?(.+)$/i
    );

    if (!match) return false;

    let foodName = match[2].trim();
    let quantity = 1;

    const quantityMatch = foodName.match(/^(\d+)\s+(.+)$/);

    if (quantityMatch) {
      quantity = Math.min(20, Math.max(1, Number(quantityMatch[1])));
      foodName = quantityMatch[2].trim();
    }

    if (!restaurant) {
      // Do not silently add an item from a different restaurant.
      navigate(`/restaurants?q=${encodeURIComponent(foodName)}`);
      return true;
    }

    const term = normalize(foodName);
    const menu = restaurant.menu || [];

    const item =
      menu.find((entry) => normalize(entry.name) === term) ||
      menu.find((entry) => normalize(entry.name).includes(term));

    if (!item) {
      navigate(`/restaurant/${restaurant.id}`);
      window.dispatchEvent(
        new CustomEvent('motioneats:voice-message', {
          detail: {
            message: `I couldn't find ${foodName} at ${restaurant.name}. Please check the menu.`,
          },
        })
      );
      return true;
    }

    for (let i = 0; i < quantity; i += 1) {
      addItem(item, restaurant);
    }

    navigate('/checkout');
    return true;
  };

  const handleCommand = (rawCommand) => {
    const command = rawCommand.toLowerCase().trim();
    if (!command) return;

    // Checkout field filling and order submission.
    if (pathnameRef.current === '/checkout') {
      if (/^(place order|place the order|submit order|confirm order)$/i.test(command)) {
        window.dispatchEvent(new CustomEvent('motioneats:place-order'));
        return;
      }

      const fieldUpdate = parseCheckoutField(command);

      if (fieldUpdate) {
        window.dispatchEvent(
          new CustomEvent('motioneats:voice-field', {
            detail: fieldUpdate,
          })
        );
        return;
      }
    }

    if (/\bscroll up\b/.test(command)) {
      window.scrollBy({ top: -500, behavior: 'smooth' });
      return;
    }

    if (/\bscroll down\b/.test(command)) {
      window.scrollBy({ top: 500, behavior: 'smooth' });
      return;
    }

    if (['back', 'go back', 'previous'].includes(command)) {
      dispatchNavigation('back');
      return;
    }

    if (['next', 'go next'].includes(command)) {
      dispatchNavigation('next');
      return;
    }

    if (['home', 'go home'].includes(command)) {
      navigate('/');
      return;
    }

    if (['cart', 'go to cart', 'show cart'].includes(command)) {
      navigate('/cart');
      return;
    }

    if (['checkout', 'go to checkout'].includes(command)) {
      navigate('/checkout');
      return;
    }

    // "Open Pizza Palace" opens the restaurant itself.
    const openMatch = command.match(/^open\s+(.+)$/i);

    if (openMatch) {
      const restaurant = findRestaurant(openMatch[1]);

      if (restaurant) {
        navigate(`/restaurant/${restaurant.id}`);
      } else {
        navigate(`/restaurants?q=${encodeURIComponent(openMatch[1])}`);
      }
      return;
    }

    // Buy/order an item only from the restaurant page currently open.
    if (handleBuyVoiceCommand(command)) return;

    // Food discovery searches restaurant results instead of buying globally.
    const searchPrefix =
      /^(show|find|search|give me|i want|take me to)\b/i;

    if (searchPrefix.test(command)) {
      const term = cleanSearchTerm(command);

      if (term) {
        navigate(`/restaurants?q=${encodeURIComponent(term)}`);
      }
      return;
    }

    const foodWords = [
      'burger', 'burgers', 'pizza', 'pizzas', 'biryani',
      'noodles', 'pasta', 'momos', 'momo', 'sandwich', 'sandwiches',
      'wrap', 'wraps', 'roll', 'rolls', 'shawarma', 'fried chicken',
      'chicken', 'dosa', 'dosas', 'idli', 'idlis', 'paneer', 'thali',
      'fried rice', 'manchurian', 'samosa', 'samosas', 'tacos', 'taco',
      'cake', 'cakes', 'ice cream', 'dessert', 'desserts', 'coffee',
      'juice', 'milkshake', 'milkshakes', 'salad', 'salads',
    ];

    const matchedFood = foodWords.find((food) => command.includes(food));

    if (matchedFood) {
      navigate(`/restaurants?q=${encodeURIComponent(matchedFood)}`);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result?.[0]?.transcript?.trim();

      if (transcript) handleCommand(transcript);
    };

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch {
        // Ignore attempts to start recognition when it is already starting.
      }
    }
  };

  if (!supported) {
    return (
      <div className={styles.unsupported}>
        Voice control is not supported in this browser.
      </div>
    );
  }

  return (
    <div className={styles.voiceControl}>
      <button
        type="button"
        className={`${styles.voiceButton} ${listening ? styles.listening : ''}`}
        onClick={toggleListening}
        aria-label={listening ? 'Stop voice control' : 'Start voice control'}
      >
        🎙️ {listening ? 'Listening…' : 'Voice'}
      </button>

      {listening && (
        <details className={styles.voicePanel}>
          <summary>🎤 Voice examples</summary>
          <div className={styles.voiceExamples}>
            <strong>Try saying:</strong>
            <span>“scroll up”</span>
            <span>“scroll down”</span>
            <span>“show me pizza”</span>
            <span>“show some food items like pizza”</span>
            <span>“open Pizza Palace”</span>
            <span>“buy pepperoni pizza”</span>
            <span>“order 2 margherita pizza”</span>
            <span>“go to cart”</span>
            <span>“go to checkout”</span>
            <span>On checkout: “my name is Akhil”</span>
            <span>On checkout: “my email is name at gmail dot com”</span>
            <span>On checkout: “my phone is…”</span>
            <span>On checkout: “my address is…”</span>
            <span>On checkout: “my city is…”</span>
            <span>On checkout: “my ZIP is…”</span>
            <span>On checkout: “place order”</span>
          </div>
        </details>
      )}
    </div>
  );
}