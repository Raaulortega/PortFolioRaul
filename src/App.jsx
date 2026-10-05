import './index.css';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import CookieBanner from './components/CookieBanner';
import SkyJourney from './components/SkyJourney';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <SkyJourney />
      <main className="valley-content">
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
