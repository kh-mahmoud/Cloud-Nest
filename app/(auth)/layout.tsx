import Image from "next/image";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex">
      <section className="bg-brand hidden w-1/2 lg:flex items-center justify-center xl:w-2/5 ">
        <div className="flex max-w-[430px] flex-col justify-center space-y-9 ">

          <div className="flex space-x-3 items-center">
            <Image
              src="/assets/icons/logo-full-revert.svg"
              alt="favicon"
              width={250}
              height={250}
            />
          </div>

          <div className="space-y-2 text-white">
            <h1 className="h1">
              Manage Your Files with Ease
            </h1>
            <p className="body-1">
              Store, organize, and access your documents effortlessly all in one secure place.
            </p>
          </div>

          <Image
            src="/assets/images/files.png"
            alt="files"
            width={342}
            height={342}
            className="transition-all hover:scale-105 hover:rotate-2"
          />

        </div>
      </section>

      <section className="flex flex-1 flex-col items-center lg:justify-center lg:p10 lg:py-0 py-10  bg-white">
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="favicon"
            width={224}
            height={82}
          />
        </div>
        {children}
      </section>


    </div>
  );
}
