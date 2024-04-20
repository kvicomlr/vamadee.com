import {BrowserRouter as Router, Routes, Route,Navigate} from "react-router-dom"
import {Home } from "./routes/Routes"
import {Login} from "./routes/Routes"
import {Register} from "./routes/Routes"
import Layout from "./layouts/Layout"
const App = () => {


  return (
  <Router>
    <Routes>
      <Route path="/" element={
        <Layout>
          <Home />
        </Layout>
      }/>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Register/>}/>
    </Routes>
  </Router>
  )
}

export default App