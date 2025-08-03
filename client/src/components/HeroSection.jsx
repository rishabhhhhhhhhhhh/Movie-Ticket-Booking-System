import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/bg.png")] bg-cover bg-center h-screen'>

            <img src="/yashRajFilms.png" alt="" className='max-h-25 lg:h-25 mt-20' />

            <img
                src="/war2_logo.png"
                alt="WAR 2 Logo"
                className="h-30 md:h-40 lg:h-40 object-contain"
            />


            <div className='flex items-center gap-4 text-gray-300'>
                <span>Action | Thriller | Drama</span>
                <div className='flex items-center gap-1'>
                    <CalendarIcon className='w-4.5 h-4.5' />2025
                </div>
                <div className='flex items-center gap-1'>
                    <ClockIcon className='w-4.5 h-4.5' />2h 49m
                </div>
            </div>
            <p className='max-w-md text-gray-300'>Agent Kabir, once India’s most elite operative, has turned rogue and is now feared as the nation’s greatest villain. In response, India deploys its deadliest operative, Vikram, a relentless Special Units officer described as a "Terminator" in human form. Their perilous face-off unfolds across the globe—high-stakes, high‑voltage, and emotionally taxing.</p>
            <button onClick={() => navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
                Explore Movies!
                <ArrowRight className='w-5 h-5' />
            </button>


        </div>
    )
}

export default HeroSection