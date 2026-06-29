import React from 'react'
import Header from '@/components/homepage/header'
import ReviveHelps from '@/components/homepage/revive_helps'
import ReviveWorks from '@/components/homepage/revive_works'
import Questions from '@/components/homepage/questions'
import AccessPlatform from '@/components/homepage/AccessPlatform'
import Footer from '@/components/footer'

const HomePage = () => {
  return (
    <div>
      <Header />
      <ReviveWorks />
      <ReviveHelps />
      <Questions />

      {/* New Section */}
      <AccessPlatform />

      <Footer />
    </div>
  )
}

export default HomePage