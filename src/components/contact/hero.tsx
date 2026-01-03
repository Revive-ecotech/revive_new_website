"use client"
import React, { useState } from 'react'
import { Mail, MapPin, Send, Sparkles } from 'lucide-react'
import Lottie from 'lottie-react'
import contact from '../../../public/contact.json'
import Navbar from '../navbar'

const ContactHero = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })

    const [focusedField, setFocusedField] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission here
        console.log('Form submitted:', formData)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className='flex flex-col bg-[#f5faf6] m-3 md:m-8 rounded-2xl border border-neutral-200 px-3 overflow-hidden'>
            <Navbar />
            <div className="relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#386641]/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#253612]/5 rounded-full blur-3xl -z-10" />

                <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    {/* Header Section - Enhanced */}
                    <div className="text-center mb-16 md:mb-20">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#253612] mb-6 leading-tight">
                            Contact Us At<br />
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Have questions about recycling or our services? We&apos;d love to hear from you.<br className="hidden sm:block" />
                            Send us a message and we&apos;ll respond as soon as possible.
                        </p>
                    </div>

                    {/* Main Content Grid - Redesigned */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 mb-16">
                        {/* Left Side - Contact Form (3 columns) */}
                        <div className="lg:col-span-3 bg-gradient-to-br from-white to-gray-50/50 rounded-[2.5rem] shadow-xl p-8 md:p-10 lg:p-12 border border-gray-100/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#386641] to-[#253612] rounded-2xl flex items-center justify-center">
                                    <Send className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#253612]">
                                        Send Message
                                    </h2>
                                    <p className="text-sm text-gray-500">We&apos;ll get back to you within 24 hours</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-[#253612] mb-3">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            className={`w-full px-5 py-4 rounded-2xl border-2 bg-white text-black focus:outline-none transition-all duration-300 ${focusedField === 'name'
                                                ? 'border-[#386641] shadow-lg shadow-[#386641]/10 scale-[1.02]'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            placeholder="Your Name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-[#253612] mb-3">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            required
                                            className={`w-full px-5 py-4 rounded-2xl border-2 bg-white text-black focus:outline-none transition-all duration-300 ${focusedField === 'email'
                                                ? 'border-[#386641] shadow-lg shadow-[#386641]/10 scale-[1.02]'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-[#253612] mb-3">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('phone')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`w-full px-5 py-4 rounded-2xl border-2 bg-white text-black focus:outline-none transition-all duration-300 ${focusedField === 'phone'
                                            ? 'border-[#386641] shadow-lg shadow-[#386641]/10 scale-[1.02]'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="+91 00000 00000"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-[#253612] mb-3">
                                        Your Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        rows={6}
                                        className={`w-full px-5 py-4 rounded-2xl border-2 bg-white text-black focus:outline-none transition-all duration-300 resize-none ${focusedField === 'message'
                                            ? 'border-[#386641] shadow-lg shadow-[#386641]/10 scale-[1.02]'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#386641] text-white py-5 px-8 rounded-2xl hover:shadow-xl hover:shadow-[#386641]/30 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg hover:scale-[1.02]"
                                >
                                    Send Message
                                    <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>

                        {/* Right Side - Contact Info & Image (2 columns) */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Image Placeholder - Moved to top */}
                            <div className="relative bg-gradient-to-br from-[#fff9eb] to-[#f5f0e1] rounded-[2.5rem] overflow-hidden group h-[300px] border border-[#386641]/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#386641]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Lottie
                                        animationData={contact}
                                        loop={true}
                                        className="w-full h-full scale-125"
                                        style={{
                                            maxWidth: '400px',
                                            margin: 'auto',
                                            filter: 'drop-shadow(0 10px 15px rgba(56, 102, 65, 0.1))'
                                        }}
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm">
                                    <p className="text-[#253612] font-semibold text-lg text-center">Get in Touch</p>
                                </div>
                            </div>

                            {/* Contact Information Cards - Compact Design */}
                            <div className="space-y-4">
                                <div className="group bg-gradient-to-br from-[#386641] to-[#2d5033] text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold mb-1 opacity-90">Email Us</h3>
                                            <p className="text-white/95 text-sm font-medium">reviveecotech@gmail.com</p>
                                        </div>
                                    </div>
                                </div>


                                <div className="group bg-gradient-to-br from-[#386641] to-[#2d5033] text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold mb-1 opacity-90">Visit Us</h3>
                                            <p className="text-white/95 text-sm font-medium">VDC Visakhapatnam Campus
                                                Ground Floor, GIM PG-Block</p>
                                            <p className="text-white/70 text-xs mt-0.5">GITAM University Gandhi Nagar, Visakhapatnam Andhra Pradesh- 530045


                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section - Redesigned */}
                    <div className="relative bg-gradient-to-br from-[#386641] via-[#2f5738] to-[#253612] rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 lg:p-20 text-center overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                                <Sparkles className="w-4 h-4 text-white" />
                                <span className="text-sm font-medium text-white">Join the Movement</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                                Ready to Start Recycling?
                            </h2>
                            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Join thousands of others who are making a difference by recycling and earning rewards.
                            </p>
                            <button className="group bg-white text-[#253612] py-5 px-10 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg inline-flex items-center gap-3 hover:scale-105 hover:shadow-2xl">
                                Download the App
                                <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactHero
