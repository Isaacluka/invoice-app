import Badge from "../ui/Badge";

export default function InvoiceListItem({ invoice, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-lg flex justify-between items-center cursor-pointer hover:border-purple-500 border"
    >
      <div className="flex gap-8">
        <p className="font-bold">#{invoice.id}</p>
        <p className="text-gray-400">{invoice.billTo.name}</p>
      </div>

      <div className="flex gap-6 items-center">
        <p className="font-bold">£ {invoice.total}</p>
        <Badge status={invoice.status} />
      </div>
    </div>
  );
}