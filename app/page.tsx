import DropZone from '../components/DropZone';

export default function Home() {
  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">
        Audio Silence Remover
      </h1>
      <p className="text-center mb-6">
        Remove silence from your audio — fast and free
      </p>
      <div className="max-w-xl mx-auto">
        <DropZone />
      </div>
    </main>
  );
}
