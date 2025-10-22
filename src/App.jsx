import Header from "./components/Header";
import Row from "./components/Row";
import "./App.css"; 

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header />
      <main className="pt-2">
        <Row title="Impressionism (The Met)" />
        <Row title="Photography (AIC)" />
      </main>
    </div>
  );
}

export default App;