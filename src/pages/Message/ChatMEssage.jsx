import React from 'react'

const ChatMEssage = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-sm ${
        isCurrentUser ? 'bg-[#181d26] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-black rounded-tl-none'
      }`}>
        {message.image && (
          <img src={message.image} alt="sent" className='w-full h-auto rounded-lg mb-2 object-cover max-h-60' />
        )}
        <p className='leading-relaxed'>{message.content}</p>
      </div>
    </div>
  )
}

export default ChatMEssage;
