import './App.css';
import {Register, Login} from './pages'
import {Routes, Route} from 'react-router-dom'

const App = ()=>{
    return (
        <div>
            <Routes>
                <Route path={"/"} element={<Register/>}/>
                <Route path={"/login"} element={<Login/>}/>
            </Routes>
        </div>
    )
}

export default App;
