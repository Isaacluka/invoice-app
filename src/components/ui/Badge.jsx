export default function Badge({ status }) {
  const styles = {
    paid: "bg-green-100 text-green-600",
    pending: "bg-orange-100 text-orange-600",
    draft: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`px-4 py-2 rounded-md text-xs font-bold ${styles[status]}`}>
      {status}
    </span>
  );
}