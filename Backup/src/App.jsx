import { Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'; 
import Header from './pages/Header';
import Projects from './pages/projects';
import DragDrop from './pages/DragDrop';
import Board from './pages/Board';

function App() {
  const location = useLocation();
  
  // Check if the current path is either '/' or '/CurrentProject/:name/:id'
  const showHeader = location.pathname === '/' || location.pathname.startsWith('/CurrentProject');

  return (
    <div>
      <TransitionGroup>
        {/* Conditionally render the Header based on the route */}
        {showHeader && < Header/>}
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={300} // Duration of the animation in milliseconds
        >
          <Routes location={location}>
            <Route path="/" element={<Projects />} />
            <Route path='/CurrentProject/:name/:id' element={<DragDrop />} />
            <Route path='/Board/:id' element={<Board />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;
