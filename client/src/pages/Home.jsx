import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import HomeCourse from '../components/HomeCourse'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
    <Navbar/>
    <Banner/>
    <HomeCourse/>
    <Testimonials/>
    <Footer/>
    </>
  )
}

export default Home