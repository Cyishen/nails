const Footer = () => {
  return (
    <footer className='bg-white h-20 relative border-t border-gray-200'>
      <div className='min-h-64 p-10'>
        <div className='h-full flex flex-col md:justify-between justify-center items-center'>
          <div className='flex flex-col items-center justify-center'>
            <div className='flex space-x-8 cursor-pointer'>
              <div className="text-muted-foreground hover:text-gray-60">
                <p>About us</p>
              </div>

              <div className='text-muted-foreground hover:text-gray-600'>
                Terms
              </div>

              <div className='text-muted-foreground hover:text-gray-600'>
                Privacy Policy
              </div>
            </div>

            <div className="flex flex-row gap-4 p-5 justify-center sm:justify-start">
              <img 
                src="/media/applestore.svg"
                alt="logo"
                width={140}
                height={40}
              />
              <img 
                src="/media/googleplay.svg"
                alt="logo"
                width={160}
                height={40}
              />
            </div>
          </div>

          <div className='text-center md:text-left pb-2 md:pb-0'>
            <p className='text-muted-foreground'>
              &copy; {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
