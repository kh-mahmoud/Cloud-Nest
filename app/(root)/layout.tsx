'use server'

import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster"




export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const currentUser = await getCurrentUser()


  if (!currentUser) redirect("/sign-in")

  return (
    <main className="min-h-screen flex">

      <Sidebar {...currentUser} />
      <section className="w-full">
        <MobileNav {...currentUser} />
        <Header ownerId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content">
          {children}
        </div>
      </section>
      <Toaster />


    </main>
  );
}
