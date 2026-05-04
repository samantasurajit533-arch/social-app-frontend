import React, { useEffect } from 'react'
import SearchUser from '../SerchUser/SearchUser'
import PopularUserCard from './PopularUserCard'
import { Card, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { searchUserAction } from '../../pages/Redux/Auth/auth.action'

const HomeRight = () => {
  const dispatch = useDispatch();
  
  // Get both the search results AND the logged-in user
  const { searchUser, loading, user: currentUser } = useSelector(store => store.auth);

  useEffect(() => {
    dispatch(searchUserAction("a")); 
  }, [dispatch]);
  const suggestions = searchUser?.filter(user => user.id !== currentUser?.id) || [];

  return (
    <div className='hidden lg:block w-full px-5'> 
      <div className='sticky top-5 space-y-5'>
        
        <SearchUser />
        
        <Card className='p-5 shadow-sm border border-gray-100 !rounded-xl bg-white'>
          <div className='flex justify-between pb-3 items-center'>
            <p className='font-semibold text-sm opacity-70 uppercase tracking-tight'>
              Suggestions for you
            </p>
            <p className='text-xs font-bold text-blue-600 cursor-pointer hover:underline'>
              View All
            </p>
          </div>

          <div className="space-y-1"> 
            {loading ? (
              <div className='flex justify-center py-5'>
                <CircularProgress size={24} thickness={4} />
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.slice(0, 5).map((item) => (
                <div key={item.id} className='hover:bg-gray-50 rounded-lg transition-all'> 
                  <PopularUserCard user={item} />
                </div>
              ))
            ) : (
              <div className='py-5 text-center'>
                <p className='text-xs text-gray-400 font-medium'>No suggestions found</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default HomeRight
