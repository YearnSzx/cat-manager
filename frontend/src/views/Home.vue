<template>
  <div class="home">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">For every tiny paw print</p>
        <h1>把每只猫咪，都写进温柔的日常里</h1>
        <p class="description">
          这里不是冰冷的管理后台，而是属于毛孩子的小小星球。
          收藏它们的照片、生日、体重和每一次值得纪念的瞬间。
        </p>

        <div class="hero-buttons">
          <el-button
            v-if="!userStore.isLoggedIn"
            type="primary"
            size="large"
            round
            @click="$router.push('/register')"
          >
            创建我的猫咪星球
          </el-button>
          <el-button
            size="large"
            round
            @click="$router.push(userStore.isLoggedIn ? '/cats' : '/login')"
          >
            {{ userStore.isLoggedIn ? '进入猫咪相册' : '先去登录' }}
          </el-button>
        </div>
      </div>

      <div class="hero-card">
        <div class="cat-window">
          <div class="sun"></div>
          <div class="cat-face">
            <span class="ear ear-left"></span>
            <span class="ear ear-right"></span>
            <span class="eye eye-left"></span>
            <span class="eye eye-right"></span>
            <span class="nose"></span>
            <span class="whisker whisker-left"></span>
            <span class="whisker whisker-right"></span>
          </div>
        </div>
        <div class="memory-note">
          <span>今日小记</span>
          <strong>晒太阳 2 小时，撒娇 7 次</strong>
        </div>
      </div>
    </section>

    <section class="features">
      <article class="feature-card">
        <span>01</span>
        <h3>猫咪相册</h3>
        <p>上传照片后，列表会像相册一样展示每只猫咪，而不是普通表格。</p>
      </article>
      <article class="feature-card">
        <span>02</span>
        <h3>成长档案</h3>
        <p>生日、体重、毛色、绝育情况都放在同一张温柔的小卡片里。</p>
      </article>
      <article class="feature-card">
        <span>03</span>
        <h3>专属空间</h3>
        <p>登录后只看到自己的猫咪，每个家庭都有独立的毛孩子收藏夹。</p>
      </article>
    </section>

    <section class="quote">
      <p>“养猫不是拥有一只宠物，而是被一份柔软的信任选择。”</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.home {
  overflow: hidden;
}

.hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: 92px 20px 70px;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  align-items: center;
  gap: 48px;
}

.hero-copy {
  animation: rise-in 0.8s ease both;
}

.eyebrow {
  margin: 0 0 18px;
  color: var(--color-coral);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.hero h1 {
  max-width: 720px;
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(46px, 7vw, 86px);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: 0.02em;
}

.description {
  max-width: 610px;
  margin: 28px 0 0;
  color: var(--color-muted);
  font-size: 18px;
  line-height: 1.9;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 36px;
}

.hero-card {
  position: relative;
  padding: 22px;
  border: 1px solid var(--color-border);
  border-radius: 42px;
  background: rgba(255, 252, 244, 0.7);
  box-shadow: var(--shadow-soft);
  animation: float-in 0.9s ease 0.12s both;
}

.cat-window {
  position: relative;
  min-height: 430px;
  border-radius: 32px;
  background:
    radial-gradient(circle at 24% 22%, rgba(255, 255, 255, 0.75), transparent 18%),
    linear-gradient(150deg, #ffe0bb 0%, #f7b58a 46%, #b9d7bc 100%);
  overflow: hidden;
}

.cat-window::before,
.cat-window::after {
  position: absolute;
  content: "";
  border-radius: 999px;
  background: rgba(255, 250, 241, 0.36);
}

.cat-window::before {
  width: 260px;
  height: 260px;
  right: -90px;
  bottom: -70px;
}

.cat-window::after {
  width: 130px;
  height: 130px;
  left: 32px;
  bottom: 48px;
}

.sun {
  position: absolute;
  width: 92px;
  height: 92px;
  top: 44px;
  right: 52px;
  border-radius: 50%;
  background: #fff3ad;
  box-shadow: 0 0 60px rgba(255, 243, 173, 0.8);
}

.cat-face {
  position: absolute;
  left: 50%;
  bottom: 58px;
  width: 260px;
  height: 220px;
  border-radius: 48% 48% 42% 42%;
  background: #fff8ef;
  box-shadow: inset 0 -16px 0 rgba(239, 127, 97, 0.08);
  transform: translateX(-50%);
}

.ear {
  position: absolute;
  top: -44px;
  width: 88px;
  height: 88px;
  background: #fff8ef;
  clip-path: polygon(50% 0, 0 100%, 100% 100%);
}

.ear-left {
  left: 24px;
  transform: rotate(-18deg);
}

.ear-right {
  right: 24px;
  transform: rotate(18deg);
}

.eye {
  position: absolute;
  top: 88px;
  width: 18px;
  height: 28px;
  border-radius: 999px;
  background: var(--color-ink);
}

.eye-left {
  left: 82px;
}

.eye-right {
  right: 82px;
}

.nose {
  position: absolute;
  left: 50%;
  top: 126px;
  width: 22px;
  height: 16px;
  border-radius: 50% 50% 60% 60%;
  background: var(--color-coral);
  transform: translateX(-50%);
}

.whisker {
  position: absolute;
  top: 136px;
  width: 74px;
  height: 2px;
  background: rgba(48, 37, 31, 0.45);
}

.whisker-left {
  left: 28px;
  transform: rotate(8deg);
}

.whisker-right {
  right: 28px;
  transform: rotate(-8deg);
}

.memory-note {
  position: absolute;
  right: 0;
  bottom: 34px;
  max-width: 260px;
  padding: 18px 20px;
  border-radius: 24px;
  background: rgba(255, 250, 241, 0.94);
  box-shadow: var(--shadow-card);
  transform: translateX(18px);
}

.memory-note span {
  display: block;
  color: var(--color-coral);
  font-size: 13px;
  font-weight: 800;
}

.memory-note strong {
  display: block;
  margin-top: 6px;
  color: var(--color-ink);
  font-size: 17px;
}

.features {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 70px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.feature-card {
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: 30px;
  background: var(--color-card);
  box-shadow: var(--shadow-card);
}

.feature-card span {
  color: var(--color-coral);
  font-weight: 900;
}

.feature-card h3 {
  margin: 18px 0 10px;
  color: var(--color-ink);
  font-size: 24px;
}

.feature-card p {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.8;
}

.quote {
  margin: 0 auto 80px;
  max-width: 900px;
  padding: 0 20px;
  text-align: center;
}

.quote p {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(30px, 5vw, 52px);
  line-height: 1.25;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float-in {
  from {
    opacity: 0;
    transform: translateY(28px) rotate(2deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}

@media (max-width: 900px) {
  .hero,
  .features {
    grid-template-columns: 1fr;
  }

  .hero {
    padding-top: 58px;
  }

  .cat-window {
    min-height: 360px;
  }

  .memory-note {
    right: 20px;
    transform: none;
  }
}
</style>
