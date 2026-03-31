export default function StatsCards() {
  const stats = [
    { title: "Users", value: 1200 },
    { title: "Employers", value: 300 },
    { title: "Jobs", value: 560 },
    { title: "Applications", value: 2100 },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white shadow rounded-xl p-6"
        >
          <h2 className="text-gray-500">{s.title}</h2>
          <p className="text-3xl font-bold">{s.value}</p>
        </div>
      ))}
    </div>
  );
}