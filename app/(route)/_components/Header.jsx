"use client";
import { Button } from '@/components/ui/button'
import { BellDot, Search } from 'lucide-react'
import React, {useState , useEffect} from 'react'
import Image from 'next/image'



function Header() {


    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);


    const handleScroll = () => {
        if (typeof window !== "undefined") {
            const scrollY = window.scrollY;

            if(scrollY > 0)
            {
                setIsVisible(scrollY <= lastScrollY || scrollY < 0); // Hiển thị nếu cuộn lên hoặc ở đầu trang
            }
            setLastScrollY(scrollY);
        }
    };

    const [isOpen, setIsOpen] = useState(false); // Để điều khiển việc mở menu

    const toggleMenu = () => {
      setIsOpen(!isOpen); // Thay đổi trạng thái mở hoặc đóng menu
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

  return (
    <div className={`p-3  md:grid-cols-3 bg-white flex justify-between fixed top-0 left-0 w-full z-50 md:grid
    transition-transform duration-1000 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-16'}`}
    >
        <div className='p-3'>
            <a href="/">
            <Image 
                src="/minhrom.png"
                alt='mylogo'
                width={100  }
                height={100}
                layout="intrinsic" 
            />
            </a>
            
        </div>
       
       
        
        <div className='flex gap-3 border justify-between h-11 mt-2
        p-2 rounded-[24px] cursor-text hover:border-cyan-400 
        sm:w-[230px] 
        lg:w-[409px]
        '> 
            <input className='outline-none w-full sm:text-sm md:text-base lg:text-lg ' style={{ cursor: 'text' }} 
             type="text" placeholder='What do you want to learn ?' />
             <Search className='h-7 p-1 w-7 rounded-[24px] bg-orange-600 text-white '/>
        </div>
        <div className='flex items-center gap-4 md:justify-end'>
            <BellDot className='text-gray-500'/>
            <Button> Get Started </Button>
        </div>
    </div>
  )
}

export default Header