import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login on mount
    navigate('/login')
  }, [navigate])

  return null
}

export default Home
