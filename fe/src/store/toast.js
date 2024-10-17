import {create} from 'zustand'

export const useToast = create((set) => ({
    type: '',
    show: false,
    message: '',
    showMessage: (type, message) => {
        set({ show: true, type, message })
        setTimeout(() => set({ show: false, message: '' }), 5000)
    },
    hideMessage: () => set({ show: false, message: '' }),
}))