export default function Header() {
  return (
    <header className="bg-[#121212] text-white py-3 px-6 flex justify-between items-center border-b border-[#2a2a2a]">
      <div className="font-bold text-lg">Pebbles</div>
      <div className="flex gap-4">
        <a href="https://github.com/rmguney/Pebbles" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
          GitHub
        </a>
      </div>
    </header>
  );
}
