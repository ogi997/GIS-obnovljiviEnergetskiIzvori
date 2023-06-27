
//router 
import {BrowserRouter, Routes, Route} from 'react-router-dom';

//pages & styles
import './App.css';
import 'animate.css';
import Register from './pages/Register/Register';
import Mapa from './pages/Map/Mapa';
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import NotFound from './pages/NotFound/NotFound';
import Navbar from './components/Navbar';

function App() {

    return (

        <div>
            <BrowserRouter>

                <Navbar/>
                
                <Routes>

                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/map" element={<Mapa/>}/>
                    <Route path="*" element={<NotFound/>}/>

                </Routes>

            </BrowserRouter>

        </div>

    );
}

export default App;
