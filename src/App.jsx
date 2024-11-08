import { Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'; 
import DragDrop from './pages/DragDrop';
import Board from './pages/Board';
import Projects from './pages/Projects';
import NewDrag from './pages/NewDrag';

function App() {
  const location = useLocation();

  return (
    <div>
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={300}
          unmountOnExit
        >
          <Routes location={location}>
            <Route path="/" element={<Projects />} />
            <Route path='/CurrentProject/:name/:id' element={<DragDrop />} />
            <Route path='/Board/:id' element={<Board />} />
            {/* <Route path='/Board/:id' element={<NewDrag />}  /> */}
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}
   
export default App;
