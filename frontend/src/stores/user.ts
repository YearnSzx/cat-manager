import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<User | null>(
    JSON.parse(localStorage.getItem('userInfo') || 'null')
  )

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)

  // 方法：设置用户信息
  const setUserInfo = (newToken: string, newUserInfo: User) => {
    token.value = newToken
    userInfo.value = newUserInfo
    localStorage.setItem('token', newToken)
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
  }

  // 方法：退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setUserInfo,
    logout
  }
})
