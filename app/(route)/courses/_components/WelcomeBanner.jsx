import React from 'react'

function WelcomeBanner() {
  return (
    <div className='flex  items-center
    rounded-xl p-5'>
        {/* <Image src='../'
        width={100}
        height={100}
        /> */}
        <div>
            <h2 className='font-bold text-[29px]'> Welcome  to 
                <span className='text-primary'> Rooy Education </span> 
                 Academy
            </h2>
            <h2 className='text-gray-500'> Explore, Learn and Build All Real Life 
                Projects </h2>
        </div>
    </div> 
  )
}

export default WelcomeBanner