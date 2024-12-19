import React from 'react'
import Image from 'next/image'
import Videocard from './ui/videocard'
import { Button } from './ui/button'

function FrontPage() {
    return (
        <div className='flex gap-16 max-w-7xl  items-center justify-between my-16'>

            <div className='w-1/2 flex items-center justify-center'>

                <Videocard />

            </div>
            <div className='w-1/2 flex items-end flex-col justify-center'>
                <h1 className='text-4xl font-bold leading-relaxed text-right'> Build an NFT-Driven Ecosystem for Your Most Loyal Fans </h1>
                <h1 className='text-6xl font-bold text-[#125CFE] '>

                    <Button className=' text-lg font-semibold py-6 px-6 rounded-full '> Create Now </Button>

                </h1>
            </div>





        </div>
    )
}

export default FrontPage