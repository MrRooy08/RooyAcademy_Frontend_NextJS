import React from 'react'

import Header from './_components/Header'

function layout({children}) {
  return (
    <div>
       
        <div className=''>
            <Header/>
           <div className='mt-20'>
           {children}
           </div>
           
        </div>
    </div>
    
  )
}

export default layout