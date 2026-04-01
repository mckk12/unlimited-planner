import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar'
import AppRoutes from './router/routes';

function App() {
  return (
    <div className="App flex min-h-screen flex-col bg-slate-900 text-slate-200">
      <Navbar />
      <main className="flex flex-col flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

export default App
