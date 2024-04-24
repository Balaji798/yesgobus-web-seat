import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        navigate("/busbooking?from=Bangalore&to=Mysore&date=2024-04-24&bus_id=990215994")
    },[])
  return (
    <div>Home</div>
  )
}

export default Home