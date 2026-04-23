import { InvoiceProvider } from "./context/InvoiceContext";
import InvoicePage from "./components/invoice/InvoicePage";

export default function App() {
  return (
    <InvoiceProvider>
      <div className="min-h-screen bg-gray-100">
        <InvoicePage />
      </div>
    </InvoiceProvider>
  );
}