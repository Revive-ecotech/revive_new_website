import React from 'react'
import { AnimatedTooltipPreview } from '@/components/homepage/tooltip'
import Navbar from '../navbar'
import Link from 'next/link'
import Image from 'next/image'
const Header = () => {
    return (
        <div className='flex flex-col bg-[#f5faf6] m-3 md:m-8 rounded-2xl border border-neutral-200 items-center px-3 overflow-hidden h-[900px] md:h-[1000px]' >
            <Navbar />
            <div className='flex flex-col md:flex-row gap-7 items-center mt-14' >
                <AnimatedTooltipPreview />
                <div className='text-xs text-neutral-500'>
                    Trusted by thousands of people
                </div>
            </div>
            <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 mx-auto px-5 sm:px-2 ">
                <div className="flex flex-col items-center justify-center mt-5 md:mt-10 text-center font-semibold">
                    <div className="text-4xl md:text-5xl lg:text-7xl text-[#253612] font-sans">
                        Recycling for the Future
                    </div>
                    <div className="text-sm md:text-lg font-sans font-extralight mt-10 lg:px-32 text-[#343434]">
                        Revive bridges the gap between industries and recyclers — turning industrial waste into opportunity while empowering communities and protecting the planet.
                    </div>
                </div>
            </div>
            <div className='flex flex-col md:flex-row gap-7 items-center mt-8 text-sm w-full  px-3 sm:px-10 md:px-0 md:w-auto'>
                <Link
                    href="#"
                    className="flex w-full md:w-auto justify-center px-5 py-3 flex-row gap-3 items-center rounded-3xl bg-[#253612] text-white hover:bg-[#364f1b] shadow-sm shadow-neutral-500"
                >
                    <Image src="/logo_android.svg" alt="Android" width={15} height={15} className='invert' />
                    Download for Android
                </Link>
                <Link
                    href="#"
                    className="flex w-full md:w-auto justify-center px-5 py-3 flex-row gap-3 items-center rounded-3xl bg-[#253612] text-white hover:bg-[#364f1b] shadow-sm shadow-neutral-500"
                >
                    <Image src="/logo_apple.svg" alt="iOS" width={15} height={15} className='invert' />
                    Download for iOS
                </Link>
            </div>
            <div className="w-full flex justify-center items-center mt-1 ">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        width: '100%',
                        maxWidth: '800px',
                    }}
                >
                    <source src="/showcase2.mp4" type="video/mp4" />
                </video>
            </div>

        </div>
    )
}

export default Header
