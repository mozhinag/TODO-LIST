import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Form from './pages/Form';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />
          <Route
            path="/form"
            element={<Form />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
