import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        loading: false,
        error: null
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }

        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            state.chats[chatId].messages.push({ content, role })
        },

       addMessages: (state, action) => {
    const { chatId, messages } = action.payload

    // safety check
    if (!state.chats[chatId]) {
        state.chats[chatId] = {
            id: chatId,
            title: "New Chat",
            messages: [],
            lastUpdated: new Date().toISOString()
        }
    }

    state.chats[chatId].messages.push(...messages)
},
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        deleteChat: (state, action) => {
            const chatId = action.payload
            delete state.chats[chatId]
            if (state.currentChatId === chatId) {
                state.currentChatId = null
            }
        },

    }
})

export const { createNewChat, addMessages, addNewMessage, setChats, setCurrentChatId, setLoading, setError, deleteChat } = chatSlice.actions
export default chatSlice.reducer