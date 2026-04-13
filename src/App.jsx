import './index.css';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import CookieBanner from './components/CookieBanner';
import Hero from './components/Hero';
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
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <CookieBanner />
    </>
  );
}
