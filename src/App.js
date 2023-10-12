import logo from './logo.svg';
import './App.css';
import Landlayout from './layout/Landlayout';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'


function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route exact path="/" element={<Landlayout></Landlayout>}></Route>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
