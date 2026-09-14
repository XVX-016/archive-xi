import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export type CartItem = {
  product_id: string;
  name: string;
  /** Price in paise (integer). Display only — never trusted at checkout. */
  price: number;
  image: string;
  quantity: number;
  slug?: string;
};

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { product_id: string } }
  | { type: "UPDATE_QTY"; payload: { product_id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" };

type CartContextValue = {
  items: CartItem[];
  drawerOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (product_id: string) => void;
  updateQty: (product_id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  /** Total number of individual units across all line items */
  totalItems: number;
  /** Raw paise subtotal — display only, never sent to server as authoritative price */
  subtotalPaise: number;
};

// ─── Reducer ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "archivexi_cart_v1";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.payload };

    case "ADD_ITEM": {
      const qty = action.payload.quantity ?? 1;
      const existing = state.items.find(
        (i) => i.product_id === action.payload.product_id,
      );
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          i.product_id === action.payload.product_id
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      } else {
        const { quantity: _q, ...rest } = { ...action.payload, quantity: qty };
        void _q; // quantity is included via rest spread above
        items = [...state.items, { ...rest, quantity: qty }];
      }
      return { ...state, items };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => i.product_id !== action.payload.product_id,
        ),
      };

    case "UPDATE_QTY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => i.product_id !== action.payload.product_id,
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product_id === action.payload.product_id
            ? { ...i, quantity: action.payload.quantity }
            : i,
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "OPEN_DRAWER":
      return { ...state, drawerOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, drawerOpen: false };

    default:
      return state;
  }
}

const initialState: CartState = { items: [], drawerOpen: false };

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on first mount (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      // Corrupt storage — ignore and start fresh
    }
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }, [state.items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) =>
      dispatch({ type: "ADD_ITEM", payload: item }),
    [],
  );

  const removeItem = useCallback(
    (product_id: string) => dispatch({ type: "REMOVE_ITEM", payload: { product_id } }),
    [],
  );

  const updateQty = useCallback(
    (product_id: string, quantity: number) =>
      dispatch({ type: "UPDATE_QTY", payload: { product_id, quantity } }),
    [],
  );

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const openDrawer = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotalPaise = state.items.reduce(
    (acc, i) => acc + i.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        drawerOpen: state.drawerOpen,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openDrawer,
        closeDrawer,
        totalItems,
        subtotalPaise,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

/** Format paise as Indian rupee string, e.g. 980000 → "₹9,800" */
export function formatINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
