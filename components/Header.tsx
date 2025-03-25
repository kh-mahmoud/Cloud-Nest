import React from 'react';
import { Button } from './ui/button';
import { signoutUser } from '@/lib/actions/user.action';
import { LogOut } from 'lucide-react';
import { FileUploader } from './FileUploader';
import Search from './Search';


type headerNavProps = {
    ownerId: string,
    accountId: string
}

const Header = ({ ownerId, accountId }: headerNavProps) => {
    return (
        <header className='header'>
            <Search/>
            <div className='header-wrapper'>
                <FileUploader ownerId={ownerId} accountId={accountId} />
                
                <form action={async () => {
                    'use server'
                    await signoutUser()
                }}>
                    <Button type='submit' className='sign-out-button '>
                        <LogOut width={24} height={24} className="text-brand" />
                    </Button>
                </form>
            </div>
        </header>
    );
}

export default Header;
