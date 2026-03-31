export default function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <input
        className="border rounded px-3 py-1"
        placeholder="Search..."
      />

      <div className="flex gap-4">
        <button>🔔</button>
        <button>👤 Admin</button>
      </div>
    </div>
  );
}