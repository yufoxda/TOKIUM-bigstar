import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css'

import Dashboard from './components/Dashboard'
import Home from './components/Home'

function App() {
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState([])
  const API_BASE_URL = 'http://localhost:3000'

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/hello`)
      .then((res) => res.json())
      .then((posts) => setPosts(posts))
  }, [])

  return (
    <>
      <div>
      <BrowserRouter>
        <Switch>
          <Route exact path={"/"} component={Home} />
          <Route exact path={"/dashboard"} component={Dashboard} />
        </Switch>
      </BrowserRouter>
      </div>
    </>
  )
}

export default App
