import logo from './logo.svg';
import './App.css';
import AppLayout from './AppLayout'
import AppBar from './AppBar'
import { AppProvider } from './AppProvider'
import Settings from './Settings'


function App() {
  return (
    <AppLayout className="App">
      <AppProvider>
        <AppBar />
        <Settings />
      </AppProvider>
    </AppLayout>
  );
}

export default App;
