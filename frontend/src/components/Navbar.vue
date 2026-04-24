<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- 左侧：Logo/标题 -->
      <router-link to="/" class="navbar-logo">
        <span class="logo-mark">喵</span>
        <span>猫咪星球</span>
      </router-link>

      <div class="navbar-links">
        <router-link to="/">首页</router-link>
        <router-link v-if="userStore.isLoggedIn" to="/cats">猫咪相册</router-link>
      </div>

      <!-- 右侧：用户信息 -->
      <div class="navbar-user">
        <template v-if="userStore.isLoggedIn">
          <el-dropdown @command="handleCommand">
            <div class="user-card">
              <div class="user-avatar-wrap">
                <el-avatar :size="42" :src="userStore.userInfo?.avatar || ''">
                  <el-icon><User /></el-icon>
                </el-avatar>
              </div>
              <div class="user-copy">
                <span class="user-label">猫咪主人</span>
                <span class="username">{{ userStore.userInfo?.username }}</span>
              </div>
              <span class="user-entry">进入小窝</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon> 个人中心
                </el-dropdown-item>
                <el-dropdown-item command="cats">
                  <el-icon><Orange /></el-icon> 我的猫咪
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>

        <template v-else>
          <el-button round type="primary" @click="$router.push('/login')">
            登录
          </el-button>
          <el-button round plain @click="$router.push('/register')">
            注册
          </el-button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { Orange, User, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'cats':
      router.push('/cats')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background: rgba(255, 250, 241, 0.78);
  border-bottom: 1px solid rgba(123, 86, 63, 0.12);
  backdrop-filter: blur(18px);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--color-ink);
  text-decoration: none;
}

.navbar-logo:hover {
  color: var(--color-coral);
}

.logo-mark {
  width: 42px;
  height: 42px;
  border-radius: 16px 16px 20px 20px;
  background: linear-gradient(135deg, var(--color-honey), var(--color-coral));
  color: #fffaf1;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 22px;
  box-shadow: 0 10px 24px rgba(239, 127, 97, 0.28);
}

.navbar-links {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar-links a {
  color: var(--color-muted);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
}

.navbar-links a:hover,
.navbar-links a.router-link-active {
  color: var(--color-coral);
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.el-dropdown-menu) {
  padding: 8px;
  border: 1px solid rgba(123, 86, 63, 0.1);
  border-radius: 20px;
  background: rgba(255, 251, 244, 0.96);
  box-shadow: 0 18px 38px rgba(116, 74, 48, 0.14);
  overflow: hidden;
}

:deep(.el-popper.is-light) {
  border: none;
  background: transparent;
  overflow: hidden;
}

:deep(.el-popper.is-light .el-popper__arrow::before) {
  border: 1px solid rgba(123, 86, 63, 0.1);
  background: rgba(255, 251, 244, 0.96);
}

:deep(.el-dropdown-menu__item) {
  min-width: 180px;
  margin: 2px 0;
  border-radius: 14px;
  color: var(--color-ink);
  font-weight: 700;
  transition: background-color 0.2s, color 0.2s, transform 0.2s;
}

:deep(.el-dropdown-menu__item .el-icon) {
  color: var(--color-coral);
}

:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  color: var(--color-ink);
  background: rgba(239, 127, 97, 0.1);
}

:deep(.el-dropdown-menu__item:not(.is-disabled):hover) {
  color: var(--color-ink);
  background: linear-gradient(135deg, rgba(246, 189, 95, 0.18), rgba(239, 127, 97, 0.12));
  transform: translateX(2px);
}

:deep(.el-dropdown-menu__item--divided) {
  border-top-color: rgba(123, 86, 63, 0.08);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 10px 8px 8px;
  border: 1px solid rgba(123, 86, 63, 0.1);
  border-radius: 999px;
  background: rgba(255, 252, 244, 0.8);
  box-shadow: 0 10px 24px rgba(116, 74, 48, 0.08);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.user-card:hover {
  border-color: rgba(239, 127, 97, 0.22);
  box-shadow: 0 14px 30px rgba(116, 74, 48, 0.12);
  transform: translateY(-1px);
}

.user-avatar-wrap {
  padding: 4px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(246, 189, 95, 0.32), rgba(239, 127, 97, 0.26));
}

.user-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-label {
  color: var(--color-coral);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.username {
  font-size: 14px;
  color: var(--color-ink);
  font-weight: 800;
  line-height: 1.3;
}

.user-entry {
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

@media (max-width: 720px) {
  .navbar-container {
    height: auto;
    padding: 14px 16px;
    flex-wrap: wrap;
  }

  .navbar-links {
    order: 3;
    width: 100%;
    flex-basis: 100%;
  }

  .navbar-logo {
    font-size: 22px;
  }

  .user-entry {
    display: none;
  }
}
</style>
