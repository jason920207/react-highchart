import logo from './logo.svg';
import './App.css';
import AppLayout from './AppLayout'
import AppBar from './AppBar'
import { AppProvider } from './AppProvider'
import Settings from './Settings'
import Content from './Shared/Content'
import Dashboard from './Dashboard';
import React from 'react'

function App() {
  return (
    <AppLayout className="App">
      <AppProvider>
        <AppBar />
        <Content>
          <Settings />
          <Dashboard />
        </Content>
      </AppProvider>
    </AppLayout>
  );
}

export default App;
