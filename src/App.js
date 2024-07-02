import logo from './logo.svg';
import './App.css';
import TopSection from './components/TopSection';
import ListContainer from './components/ListContainer';



function App() {
  return (
    <div className="App">
      {/* <h1 className="text-6xl font-movie">Muvys</h1> */}
      <TopSection />
      <ListContainer />
      
    </div>
  );
}

export default App;
