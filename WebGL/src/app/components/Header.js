export default function Header() {
  return (
    <header className="header">
      <div className="font-bold text-lg">Pebbles</div>
      <div className="flex gap-4">
        <a href="https://github.com/rmguney/Pebbles" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
          GitHub
        </a>
      </div>
    </header>
  );
}
