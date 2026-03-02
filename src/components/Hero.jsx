export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-pink-700 p-8">
      <h1 className="text-5xl font-bold text-white mb-6">AI Capability Games</h1>
      <p className="text-xl text-pink-200 mb-8">Explore and unlock AI capabilities through interactive games</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href="/labyrinth" className="bg-pink-800 hover:bg-pink-600 text-white p-6 rounded-lg transition-colors text-center">
          <h2 className="text-2xl font-semibold">Labyrinth</h2>
          <p>Navigate the decision tree</p>
        </a>
        <a href="/codex" className="bg-pink-800 hover:bg-pink-600 text-white p-6 rounded-lg transition-colors text-center">
          <h2 className="text-2xl font-semibold">Celestial Codex</h2>
          <p>Connect the stars</p>
        </a>
        <a href="/progressorium" className="bg-pink-800 hover:bg-pink-600 text-white p-6 rounded-lg transition-colors text-center">
          <h2 className="text-2xl font-semibold">Progressorium</h2>
          <p>Unlock the skill tree</p>
        </a>
        <a href="/wheel" className="bg-pink-800 hover:bg-pink-600 text-white p-6 rounded-lg transition-colors text-center">
          <h2 className="text-2xl font-semibold">Wheel of Misfortune</h2>
          <p>Spin for a surprise</p>
        </a>
      </div>
    </div>
  );
}