import { createContext, useReducer, useContext, useEffect } from "react";

const InvoiceContext = createContext();

const initialState = {
  invoices: [],
  selectedId: null,
  filter: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_INVOICES":
      return { ...state, invoices: action.payload };

    case "ADD_INVOICE":
      return { ...state, invoices: [...state.invoices, action.payload] };

    case "UPDATE_INVOICE":
      return {
        ...state,
        invoices: state.invoices.map(inv =>
          inv.id === action.payload.id ? action.payload : inv
        ),
      };

    case "DELETE_INVOICE":
      return {
        ...state,
        invoices: state.invoices.filter(i => i.id !== state.selectedId),
        selectedId: null,
      };

    case "SET_SELECTED":
      return { ...state, selectedId: action.payload };

    case "SET_FILTER":
      return { ...state, filter: action.payload };

    default:
      return state;
  }
}

export const InvoiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // persist
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(state.invoices));
  }, [state.invoices]);

  return (
    <InvoiceContext.Provider value={{ state, dispatch }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => useContext(InvoiceContext);