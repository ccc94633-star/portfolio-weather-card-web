<script setup>
import { computed, onMounted, ref } from 'vue'

const weatherCards = ref([])
const selectedCity = ref('全部縣市')
const isLoading = ref(true)
const errorMessage = ref('')

const themes = ['sunset', 'breeze', 'forest', 'mechanical']

const getWeatherValue = (elements, elementName) => {
  const element = elements.find((item) => item.elementName === elementName)

  return element?.time[0]?.parameter?.parameterName ?? '無資料'
}

const getWeatherIcon = (description) => {
  if (description.includes('雷')) return '⛈️'
  if (description.includes('雨')) return '🌧️'
  if (description.includes('晴')) return '☀️'
  if (description.includes('雲')) return '☁️'

  return '🌤️'
}

const cityOptions = computed(() => {
  return weatherCards.value.map((card) => card.city)
})

const filteredCards = computed(() => {
  if (selectedCity.value === '全部縣市') {
    return weatherCards.value
  }

  return weatherCards.value.filter((card) => card.city === selectedCity.value)
})

const fetchWeather = async () => {
  try {
    
    const response = await fetch('/api/weather')

    if (!response.ok) {
      throw new Error(`API 錯誤：${response.status}`)
    }

    const data = await response.json()

    weatherCards.value = data.records.location.map((location, index) => {
      const elements = location.weatherElement
      const description = getWeatherValue(elements, 'Wx')

      return {
        city: location.locationName,
        description,
        icon: getWeatherIcon(description),
        rain: getWeatherValue(elements, 'PoP'),
        minTemperature: getWeatherValue(elements, 'MinT'),
        maxTemperature: getWeatherValue(elements, 'MaxT'),
        comfort: getWeatherValue(elements, 'CI'),
        theme: themes[index % themes.length],
      }
    })
  } catch (error) {
    console.error(error)
    errorMessage.value = '無法取得天氣資料，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchWeather)
</script>

<template>
  <main class="weather-page">
    <header class="hero">
      <p class="eyebrow">TAIWAN WEATHER JOURNEY</p>
      <h1>島嶼天氣旅行</h1>
      <p>在風、森林與雲朵之間，尋找今天的城市風景。</p>
    </header>

    <section class="filter-panel">
      <label for="city-filter">選擇縣市</label>

      <select id="city-filter" v-model="selectedCity">
        <option>全部縣市</option>

        <option v-for="city in cityOptions" :key="city" :value="city">
          {{ city }}
        </option>
      </select>
    </section>

    <p v-if="isLoading" class="status">正在收集島嶼上的天氣……</p>

    <p v-else-if="errorMessage" class="status error">
      {{ errorMessage }}
    </p>

    <section v-else class="weather-grid">
      <article
        v-for="card in filteredCards"
        :key="card.city"
        class="weather-card"
        :class="`theme-${card.theme}`"
      >
        <div class="card-decoration"></div>

        <header class="card-header">
          <div>
            <p class="card-label">今日天氣</p>
            <h2>{{ card.city }}</h2>
          </div>

          <span class="weather-icon">{{ card.icon }}</span>
        </header>

        <p class="description">{{ card.description }}</p>

        <div class="temperature">
          <strong>{{ card.maxTemperature }}°</strong>
          <span>／{{ card.minTemperature }}°C</span>
        </div>

        <div class="weather-details">
          <p>
            <span>降雨機率</span>
            <strong>{{ card.rain }}%</strong>
          </p>

          <p>
            <span>體感</span>
            <strong>{{ card.comfort }}</strong>
          </p>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  min-width: 320px;
  color: #26332d;
  background:
    radial-gradient(circle at 15% 10%, #fff8d8 0, transparent 25%),
    linear-gradient(160deg, #eaf5ef, #f8efd9);
  font-family: "Noto Sans TC", "PingFang TC", sans-serif;
}

.weather-page {
  width: min(1180px, calc(100% - 40px));
  min-height: 100vh;
  margin: 0 auto;
  padding: 72px 0;
}

.hero {
  max-width: 680px;
  margin-bottom: 38px;
}

.eyebrow {
  margin: 0 0 10px;
  color: #ba6c47;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.hero h1 {
  margin: 0;
  font-family: Georgia, "Noto Serif TC", serif;
  font-size: clamp(2.5rem, 7vw, 5rem);
  line-height: 1;
  letter-spacing: 0.04em;
}

.hero > p:last-child {
  color: #64716a;
  line-height: 1.8;
}

.filter-panel {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 36px;
}

.filter-panel label {
  font-weight: 700;
}

.filter-panel select {
  min-width: 180px;
  padding: 12px 42px 12px 16px;
  border: 1px solid rgb(38 51 45 / 18%);
  border-radius: 999px;
  color: inherit;
  background: rgb(255 255 255 / 72%);
  font: inherit;
  cursor: pointer;
  box-shadow: 0 8px 24px rgb(58 68 62 / 8%);
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.weather-card {
  --card-top: #fff7dd;
  --card-bottom: #edb774;
  --accent: #9a442d;

  position: relative;
  min-height: 340px;
  padding: 26px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 55%);
  border-radius: 30px;
  color: #27342e;
  background: linear-gradient(145deg, var(--card-top), var(--card-bottom));
  box-shadow:
    0 18px 40px rgb(46 59 52 / 15%),
    inset 0 1px 0 rgb(255 255 255 / 70%);
  transition:
    transform 220ms ease,
    box-shadow 220ms ease;
}

.weather-card:hover {
  transform: translateY(-8px) rotate(-0.5deg);
  box-shadow: 0 28px 52px rgb(46 59 52 / 22%);
}

.theme-sunset {
  --card-top: #fff0bd;
  --card-bottom: #e5835f;
  --accent: #8d382d;
}

.theme-breeze {
  --card-top: #e9f8ff;
  --card-bottom: #87c9d8;
  --accent: #17697a;
}

.theme-forest {
  --card-top: #e7f1cf;
  --card-bottom: #7fac76;
  --accent: #315f3a;
}

.theme-mechanical {
  --card-top: #dce7e7;
  --card-bottom: #9ba69d;
  --accent: #584a36;
}

.card-decoration {
  position: absolute;
  right: -45px;
  bottom: -55px;
  width: 180px;
  height: 180px;
  border: 2px solid rgb(255 255 255 / 40%);
  border-radius: 46% 54% 65% 35%;
  background: rgb(255 255 255 / 12%);
  transform: rotate(22deg);
}

.card-decoration::before,
.card-decoration::after {
  position: absolute;
  content: "";
  border-radius: 50%;
  background: rgb(255 255 255 / 24%);
}

.card-decoration::before {
  top: -25px;
  left: 25px;
  width: 45px;
  height: 45px;
}

.card-decoration::after {
  top: 22px;
  left: -50px;
  width: 70px;
  height: 70px;
}

.card-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-label {
  margin: 0 0 8px;
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.card-header h2 {
  margin: 0;
  font-family: Georgia, "Noto Serif TC", serif;
  font-size: 2rem;
}

.weather-icon {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 22px;
  background: rgb(255 255 255 / 35%);
  font-size: 2.2rem;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 65%);
}

.description {
  position: relative;
  min-height: 48px;
  margin: 32px 0 8px;
  color: var(--accent);
  font-weight: 700;
}

.temperature {
  position: relative;
  display: flex;
  align-items: baseline;
  margin-bottom: 30px;
}

.temperature strong {
  font-family: Georgia, serif;
  font-size: 3.8rem;
  font-weight: 500;
  line-height: 1;
}

.temperature span {
  color: rgb(38 51 45 / 70%);
  font-size: 1rem;
}

.weather-details {
  position: relative;
  display: grid;
  gap: 10px;
}

.weather-details p {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 0;
  padding-top: 10px;
  border-top: 1px solid rgb(38 51 45 / 12%);
  font-size: 0.86rem;
}

.weather-details span {
  color: rgb(38 51 45 / 68%);
}

.weather-details strong {
  text-align: right;
}

.status {
  padding: 40px;
  border-radius: 24px;
  background: rgb(255 255 255 / 60%);
  text-align: center;
}

.error {
  color: #a33c32;
}

@media (max-width: 600px) {
  .weather-page {
    width: min(100% - 28px, 1180px);
    padding: 42px 0;
  }

  .filter-panel {
    align-items: stretch;
    flex-direction: column;
  }

  .filter-panel select {
    width: 100%;
  }
}
</style>
