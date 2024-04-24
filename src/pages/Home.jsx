import {useEffect} from 'react'

const Home = () => {
    useEffect(()=>{
        window.location.href = "/booking"
    },[])
  return (
    <div>Home</div>
  )
}

export default Home