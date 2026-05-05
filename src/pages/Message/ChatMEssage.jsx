import React from 'react'

const ChatMEssage = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex w-full mb-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-4 py-2.5 text-sm max-w-[85%] sm:max-w-[70%] shadow-sm tracking-wide leading-relaxed transition-all ${
        isCurrentUser 
          ? 'bg-[#1e293b] text-slate-100 rounded-2xl rounded-tr-sm' 
          : 'bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm'
      }`}>
        {message.image && (
          <div className="rounded-xl overflow-hidden mb-2 max-h-64 border border-black/5">
            <img src={message.image} alt="Sent media" className='w-full h-auto object-cover' />
          </div>
        )}
        <p className='whitespace-pre-wrap break-words'>{message.content}</p>
      </div>
    </div>
  )
}

export default ChatMEssage;
