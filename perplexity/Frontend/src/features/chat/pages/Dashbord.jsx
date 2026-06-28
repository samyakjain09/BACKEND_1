import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../../auth/hook/useAuth'
import remarkGfm from 'remark-gfm'
import { 
  Plus, 
  MessageSquare, 
  User, 
  Send, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Trash2,
  ChevronRight,
  Bot,
  UserCircle,
  Loader2
} from 'lucide-react'
import { setCurrentChatId } from '../chat.slice'
import TypingIndicator from '../components/TypingIndicator'

const Dashboard = () => {
  const chat = useChat()
  const auth = useAuth()
  const dispatch = useDispatch()
  const [chatInput, setChatInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const loading = useSelector((state) => state.chat.loading)
  const user = useSelector((state) => state.auth.user)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage || loading) return
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats[currentChatId]?.messages, loading, currentChatId])

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setSidebarOpen(false)
  }

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null))
    setSidebarOpen(false)
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this chat?')) {
      chat.handleDeleteChat(chatId)
    }
  }

  const currentChat = chats[currentChatId]

  return (
    <main className='flex h-screen w-full overflow-hidden bg-[#0a0c14] text-slate-200 font-sans'>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform bg-[#0d111a] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className='p-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20'>
              <Bot className='w-5 h-5 text-white' />
            </div>
            <h1 className='text-xl font-bold tracking-tight text-white'>Perplexity</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className='md:hidden p-2 text-slate-400 hover:text-white'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* New Chat Button */}
        <div className='px-4 mb-6'>
          <button
            onClick={handleNewChat}
            className='w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 transition-all duration-200 group'
          >
            <Plus className='w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform' />
            <span className='text-sm font-medium'>New Conversation</span>
          </button>
        </div>

        {/* Chat List */}
        <div className='flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar'>
          <div className='px-3 mb-2'>
            <p className='text-[10px] font-bold uppercase tracking-wider text-slate-500'>Recent Chats</p>
          </div>
          {Object.values(chats).length === 0 ? (
            <div className='px-3 py-10 text-center'>
              <MessageSquare className='w-8 h-8 text-slate-700 mx-auto mb-2 opacity-20' />
              <p className='text-xs text-slate-500'>No history yet</p>
            </div>
          ) : (
            Object.values(chats).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)).map((chatItem) => (
              <div key={chatItem.id} className='group relative'>
                <button
                  onClick={() => openChat(chatItem.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left
                    ${currentChatId === chatItem.id ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'hover:bg-white/5 text-slate-400 border border-transparent'}
                  `}
                >
                  <MessageSquare className={`w-4 h-4 shrink-0 ${currentChatId === chatItem.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className='text-sm truncate flex-1 pr-6'>{chatItem.title || 'Untitled Chat'}</span>
                </button>
                <button 
                  onClick={(e) => handleDeleteChat(e, chatItem.id)}
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-600 hover:text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity'
                >
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              </div>
            ))
          )}
        </div>

        {/* User Profile Footer */}
        <div className='p-4 border-t border-white/5 bg-[#0a0c14]/50'>
          <div className='flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group'>
            <div className='w-9 h-9 rounded-full bg-linear-to-tr from-slate-700 to-slate-600 flex items-center justify-center border border-white/10'>
              <User className='w-5 h-5 text-slate-300' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-white truncate'>{user?.username || 'Guest User'}</p>
              <p className='text-[10px] text-slate-500 truncate'>{user?.email || 'Sign in to sync'}</p>
            </div>
            <div className='flex items-center gap-1'>
              <button className='p-1.5 text-slate-500 hover:text-white transition-colors'>
                <Settings className='w-4 h-4' />
              </button>
              <button 
                onClick={auth.handleLogout}
                className='p-1.5 text-slate-500 hover:text-red-400 transition-colors md:hidden'
                title='Sign Out'
              >
                <LogOut className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className='flex-1 flex flex-col relative h-full bg-[#0a0c14]'>
        
        {/* Header */}
        <header className='h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0c14]/80 backdrop-blur-md sticky top-0 z-30'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors'
            >
              <Menu className='w-6 h-6' />
            </button>
            <div className='flex items-center gap-2'>
              <Bot className='w-5 h-5 text-indigo-500 md:hidden' />
              <h2 className='text-sm font-semibold text-white truncate max-w-[200px] md:max-w-md'>
                {currentChat?.title || 'New Conversation'}
              </h2>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='h-4 w-px bg-white/10 mx-1 hidden sm:block'></div>
            <button 
              onClick={auth.handleLogout}
              className='flex items-center gap-2 px-3 py-1.5 bg-white/5 text-slate-400 rounded-lg text-xs font-medium hover:bg-white/10 hover:text-white transition-all border border-white/10'
            >
              <LogOut className='w-3 h-3' />
              <span className='hidden xs:block'>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className='h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center max-w-2xl mx-auto'>
              <div className='w-16 h-16 sm:w-20 sm:h-20 bg-indigo-500/10 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 animate-pulse'>
                <Bot className='w-8 h-8 sm:w-10 sm:h-10 text-indigo-500' />
              </div>
              <h3 className='text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight'>How can I help you today?</h3>
              <p className='text-sm sm:text-base text-slate-400 leading-relaxed mb-8 max-w-md'>
                I'm Perplexity, your intelligent assistant. Ask me anything from writing code to summarizing complex topics.
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl'>
                {[
                  "Explain quantum computing in simple terms",
                  "Write a React component for a dashboard",
                  "Help me plan a 3-day trip to Tokyo",
                  "What are the best practices for SEO?"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setChatInput(suggestion)}
                    className='text-left p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 group flex items-center gap-3 shadow-sm'
                  >
                    <div className='p-1.5 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors shrink-0'>
                      <MessageSquare className='w-3.5 h-3.5 text-indigo-400' />
                    </div>
                    <p className='text-xs sm:text-sm text-slate-300 group-hover:text-white line-clamp-2'>{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className='max-w-4xl mx-auto w-full pt-8 pb-4 space-y-8 px-4 md:px-6'>
              {currentChat.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-slate-700 shadow-lg' 
                      : 'bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg'
                  }`}>
                    {message.role === 'user' ? <UserCircle className='w-5 h-5 text-white' /> : <Bot className='w-5 h-5 text-white' />}
                  </div>
                  
                  <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`
                        rounded-2xl px-5 py-3.5 text-sm md:text-[15px] leading-relaxed shadow-sm
                        ${message.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-[#161b26] text-slate-200 border border-white/5 rounded-tl-none'
                        }
                      `}
                    >
                      {message.role === 'user' ? (
                        <p className='whitespace-pre-wrap'>{message.content}</p>
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className='mb-4 last:mb-0'>{children}</p>,
                            ul: ({ children }) => <ul className='mb-4 list-disc pl-6 space-y-2'>{children}</ul>,
                            ol: ({ children }) => <ol className='mb-4 list-decimal pl-6 space-y-2'>{children}</ol>,
                            li: ({ children }) => <li>{children}</li>,
                            code: ({ inline, children }) => (
                              inline 
                                ? <code className='bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-sm'>{children}</code>
                                : <div className='relative group'>
                                    <code className='block bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto text-sm font-mono my-4 text-indigo-200'>{children}</code>
                                  </div>
                            ),
                            pre: ({ children }) => <pre className='contents'>{children}</pre>,
                            h1: ({ children }) => <h1 className='text-xl font-bold mb-4 text-white tracking-tight'>{children}</h1>,
                            h2: ({ children }) => <h2 className='text-lg font-bold mb-3 text-white tracking-tight'>{children}</h2>,
                            h3: ({ children }) => <h3 className='text-md font-bold mb-2 text-white tracking-tight'>{children}</h3>,
                            blockquote: ({ children }) => <blockquote className='border-l-4 border-indigo-500 pl-4 italic my-4 text-slate-400'>{children}</blockquote>,
                            table: ({ children }) => (
                              <div className='overflow-x-auto my-4'>
                                <table className='w-full border-collapse border border-white/10'>{children}</table>
                              </div>
                            ),
                            th: ({ children }) => <th className='bg-white/5 border border-white/10 px-4 py-2 text-left font-semibold'>{children}</th>,
                            td: ({ children }) => <td className='border border-white/10 px-4 py-2 text-sm text-slate-400'>{children}</td>
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    <span className='text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-medium'>
                      {message.role === 'user' ? 'You' : 'Perplexity'}
                    </span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className='flex gap-4 md:gap-6 items-start'>
                  <div className='shrink-0 w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center'>
                    <Bot className='w-5 h-5 text-white' />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <TypingIndicator />
                    <span className='text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-medium'>Perplexity is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className='h-36 md:h-44' />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-[#0a0c14] via-[#0a0c14] to-transparent pt-8 pb-4 sm:pb-6 px-4 z-20'>
          <div className='max-w-4xl mx-auto'>
            <form 
              onSubmit={handleSubmitMessage} 
              className='relative flex items-end gap-2 bg-[#161b26]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-indigo-500/50 transition-all group'
            >
              <textarea
                rows='1'
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmitMessage(e)
                  }
                }}
                placeholder='Message Perplexity...'
                className='flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 py-3 px-4 resize-none min-h-[52px] max-h-[200px] text-[15px] custom-scrollbar'
              />
              <button
                type='submit'
                disabled={!chatInput.trim() || loading}
                className='mb-1.5 mr-1.5 p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed group-hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20'
              >
                {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : <Send className='w-5 h-5' />}
              </button>
            </form>
            <p className='text-center text-[10px] text-slate-500 mt-3'>
              Perplexity can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}

export default Dashboard

