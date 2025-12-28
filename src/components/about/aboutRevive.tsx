import React from 'react'
import Image from 'next/image'

const AboutRevive = () => {
    const features = [
        {
            icon: "💰",
            title: "Best Exchange Rates",
            description: "Get the most value for your recyclable materials with our competitive pricing"
        },
        {
            icon: "🌱",
            title: "Eco-Friendly",
            description: "Contribute to a sustainable future by reducing waste and promoting recycling"
        },
        {
            icon: "🚚",
            title: "Doorstep Collection", 
            description: "Convenient pickup service right from your home - no need to travel"
        },
        {
            icon: "⚡",
            title: "Instant Payment",
            description: "Get paid immediately after verification - no waiting periods"
        },
        {
            icon: "🔒",
            title: "Safe & Reliable",
            description: "Trusted by thousands with secure transactions and professional service"
        },
        {
            icon: "🏆",
            title: "Quality Assurance",
            description: "Rigorous sorting and verification ensures only the best recycled materials"
        }
    ]

    return (
        <div className='bg-[#386641] py-16 md:py-24'>
            <div className='max-w-6xl mx-auto px-6 md:px-12 lg:px-24'>
                {/* Header Section */}
                <div className='flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-16'>
                    <div className='lg:w-1/2 text-white'>
                        <h2 className='text-3xl md:text-4xl lg:text-5xl font-semibold mb-8'>
                            About Revive
                        </h2>
                        <div className='space-y-6'>
                            <p className='text-base md:text-lg leading-relaxed'>
                                Revive helps you recycle your waste while offering the best exchange rates. 
                                We&apos;re committed to turning your scrap into value through reliable, high-quality 
                                recycling services.
                            </p>
                            <p className='text-sm md:text-base leading-relaxed opacity-90'>
                                Our mission is to create a sustainable ecosystem where waste becomes a valuable 
                                resource, benefiting both individuals and the environment.
                            </p>
                        </div>
                    </div>
                    
                    <div className='lg:w-1/2 flex justify-center'>
                        <div className='relative'>
                            <div className='w-64 h-64 md:w-80 md:h-80 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm'>
                                <Image 
                                    src="/logo.png" 
                                    alt="Revive Ecotech Logo" 
                                    width={160} 
                                    height={160}
                                    className="rounded-full"
                                />
                            </div>
                            {/* Decorative circles */}
                            <div className='absolute -top-4 -right-4 w-16 h-16 bg-white bg-opacity-20 rounded-full'></div>
                            <div className='absolute -bottom-6 -left-6 w-12 h-12 bg-white bg-opacity-20 rounded-full'></div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default AboutRevive
