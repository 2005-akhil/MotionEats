import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, restaurant } = action.payload;
      const existing = state.items.find(i => i.id === item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        deliveryFee: restaurant.deliveryFee,
        items: [...state.items, { ...item, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
        ...(state.items.filter(i => i.id !== action.payload).length === 0
          ? { restaurantId: null, restaurantName: null, deliveryFee: 0 }
          : {}),
      };
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter(i => i.id !== id);
        return {
          ...state,
          items: newItems,
          ...(newItems.length === 0 ? { restaurantId: null, restaurantName: null, deliveryFee: 0 } : {}),
        };
      }
      return {
        ...state,
        items: state.items.map(i => i.id === id ? { ...i, quantity } : i),
      };
    }
    case 'CLEAR_CART':
      return { items: [], restaurantId: null, restaurantName: null, deliveryFee: 0 };
    default:
      return state;
  }
}

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
  deliveryFee: 0,
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((item, restaurant) => {
    dispatch({ type: 'ADD_ITEM', payload: { item, restaurant } });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + state.deliveryFee;
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      restaurantId: state.restaurantId,
      restaurantName: state.restaurantName,
      deliveryFee: state.deliveryFee,
      subtotal,
      total,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
