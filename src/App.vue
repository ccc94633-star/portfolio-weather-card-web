<script setup>
import { computed, onMounted, ref } from 'vue'
import cloudImage from './images/cloud.jpg'
import rainImage from './images/rain.jpg'
import summerImage from './images/summer.jpg'

const weatherCards = ref([])
const selectedCity = ref('')
const isLoading = ref(true)
const errorMessage = ref('')

const getWeatherValue = (elements, elementName) => {
  const element = elements.find((item) => item.elementName === elementName)

  return element?.time[0]?.parameter?.parameterName ?? '無資料'
}

const getWeatherVisual = (description) => {
  if (description.includes('雷')) {
    return { icon: '⛈️', image: rainImage, imageAlt: '雨水落在綠葉上的景色', imagePosition: 'center 48%' }
  }

  if (description.includes('雨')) {
    return { icon: '🌧️', image: rainImage, imageAlt: '雨水落在綠葉上的景色', imagePosition: 'center 48%' }
  }

  if (description.includes('晴')) {
    return { icon: '☀️', image: summerImage, imageAlt: '陽光下的海灘景色', imagePosition: 'center 72%' }
  }

  if (description.includes('雲') || description.includes('陰')) {
    return { icon: '☁️', image: cloudImage, imageAlt: '藍天下的雲海景色', imagePosition: 'center 54%' }
  }

  return { icon: '🌤️', image: cloudImage, imageAlt: '藍天下的雲海景色', imagePosition: 'center 54%' }
}

const cityOptions = computed(() => {
  return weatherCards.value.map((card) => card.city)
})

const selectedCard = computed(() => {
  return weatherCards.value.find((card) => card.city === selectedCity.value) ?? null
})

const fetchWeather = async () => {
  try {

    const response = await fetch('/api/weather')

    if (!response.ok) {
      throw new Error(`API 錯誤：${response.status}`)
    }

    const data = await response.json()

    weatherCards.value = data.records.location.map((location) => {
      const elements = location.weatherElement
      const description = getWeatherValue(elements, 'Wx')
      const visual = getWeatherVisual(description)

      return {
        city: location.locationName,
        description,
        icon: visual.icon,
        image: visual.image,
        imageAlt: visual.imageAlt,
        imagePosition: visual.imagePosition,
        rain: getWeatherValue(elements, 'PoP'),
        minTemperature: getWeatherValue(elements, 'MinT'),
        maxTemperature: getWeatherValue(elements, 'MaxT'),
        comfort: getWeatherValue(elements, 'CI'),
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
    <div class="watercolor-field" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <header class="hero">
      <p class="eyebrow">TAIWAN WEATHER JOURNEY</p>
      <h1>島嶼天氣旅行</h1>
      <p>選一座城市，讀一頁今天的島嶼風景。</p>
    </header>

    <section class="filter-panel">
      <label for="city-filter">想看看哪裡的天氣？</label>

      <div class="select-wrap">
        <select id="city-filter" v-model="selectedCity" :disabled="isLoading">
          <option disabled value="">
            {{ isLoading ? '正在整理縣市……' : '請選擇縣市' }}
          </option>

          <option v-for="city in cityOptions" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>
    </section>

    <p v-if="errorMessage" class="status error">
      {{ errorMessage }}
    </p>

    <section v-else class="weather-stage" aria-live="polite">
      <Transition name="card-grow" mode="out-in">
        <article v-if="selectedCard" :key="selectedCard.city" class="weather-card">
          <div class="paint-stroke paint-stroke-yellow"></div>
          <div class="paint-stroke paint-stroke-green"></div>
        <div class="botanical" aria-hidden="true">
          <svg viewBox="0 0 180 230" role="presentation">
            <g class="stems">
              <path d="M82 232 C80 181 77 116 72 38" />
              <path d="M84 230 C94 176 110 129 128 88" />
              <path d="M78 230 C67 186 54 151 38 119" />
              <path d="M80 188 C60 168 47 147 42 126" />
              <path d="M79 166 C101 148 116 124 123 99" />
              <path d="M77 139 C59 121 51 99 51 79" />
              <path d="M76 111 C92 97 103 78 108 60" />
              <path d="M104 151 C126 143 142 128 150 111" />
              <path d="M60 169 C43 165 27 151 20 136" />
            </g>

            <g class="leaves">
              <ellipse cx="70" cy="190" rx="6" ry="15" transform="rotate(-43 70 190)" />
              <ellipse cx="91" cy="181" rx="6" ry="16" transform="rotate(42 91 181)" />
              <ellipse cx="57" cy="162" rx="5" ry="14" transform="rotate(-55 57 162)" />
              <ellipse cx="105" cy="151" rx="6" ry="15" transform="rotate(53 105 151)" />
              <ellipse cx="45" cy="143" rx="5" ry="13" transform="rotate(-51 45 143)" />
              <ellipse cx="119" cy="128" rx="5" ry="14" transform="rotate(45 119 128)" />
              <ellipse cx="57" cy="118" rx="5" ry="13" transform="rotate(-42 57 118)" />
              <ellipse cx="94" cy="97" rx="5" ry="13" transform="rotate(48 94 97)" />
              <ellipse cx="48" cy="91" rx="4" ry="11" transform="rotate(-38 48 91)" />
              <ellipse cx="137" cy="132" rx="5" ry="12" transform="rotate(52 137 132)" />
              <ellipse cx="31" cy="150" rx="5" ry="12" transform="rotate(-58 31 150)" />
              <ellipse cx="108" cy="75" rx="4" ry="11" transform="rotate(42 108 75)" />
            </g>

            <g class="flower flower-large" transform="translate(72 35)">
              <ellipse class="petal petal-light" cx="0" cy="-13" rx="7" ry="14" />
              <ellipse class="petal" cx="12" cy="-7" rx="7" ry="14" transform="rotate(60 12 -7)" />
              <ellipse class="petal petal-deep" cx="12" cy="7" rx="7" ry="14" transform="rotate(120 12 7)" />
              <ellipse class="petal petal-light" cx="0" cy="13" rx="7" ry="14" />
              <ellipse class="petal" cx="-12" cy="7" rx="7" ry="14" transform="rotate(60 -12 7)" />
              <ellipse class="petal petal-deep" cx="-12" cy="-7" rx="7" ry="14" transform="rotate(120 -12 -7)" />
              <circle class="flower-center" r="6" />
              <circle class="pollen" cx="-2" cy="-2" r="1.5" />
            </g>

            <g class="flower" transform="translate(129 84) scale(.78)">
              <ellipse class="petal" cx="0" cy="-13" rx="7" ry="14" />
              <ellipse class="petal petal-light" cx="12" cy="-7" rx="7" ry="14" transform="rotate(60 12 -7)" />
              <ellipse class="petal petal-deep" cx="12" cy="7" rx="7" ry="14" transform="rotate(120 12 7)" />
              <ellipse class="petal" cx="0" cy="13" rx="7" ry="14" />
              <ellipse class="petal petal-light" cx="-12" cy="7" rx="7" ry="14" transform="rotate(60 -12 7)" />
              <ellipse class="petal" cx="-12" cy="-7" rx="7" ry="14" transform="rotate(120 -12 -7)" />
              <circle class="flower-center" r="6" />
            </g>

            <g class="flower" transform="translate(38 116) scale(.62)">
              <ellipse class="petal petal-light" cx="0" cy="-13" rx="7" ry="14" />
              <ellipse class="petal" cx="12" cy="-7" rx="7" ry="14" transform="rotate(60 12 -7)" />
              <ellipse class="petal petal-deep" cx="12" cy="7" rx="7" ry="14" transform="rotate(120 12 7)" />
              <ellipse class="petal" cx="0" cy="13" rx="7" ry="14" />
              <ellipse class="petal petal-light" cx="-12" cy="7" rx="7" ry="14" transform="rotate(60 -12 7)" />
              <ellipse class="petal" cx="-12" cy="-7" rx="7" ry="14" transform="rotate(120 -12 -7)" />
              <circle class="flower-center" r="6" />
            </g>

            <g class="buds">
              <circle cx="108" cy="58" r="5" />
              <circle cx="151" cy="109" r="4" />
              <circle cx="20" cy="135" r="4" />
            </g>

            <g class="mimosa-stems">
              <path d="M75 232 C78 186 91 142 111 101 C124 74 128 47 126 17" />
              <path d="M78 232 C92 199 114 174 144 148 C157 137 165 119 169 99" />
              <path d="M83 203 C65 174 54 145 55 116 C55 94 48 75 36 60" />
              <path d="M93 165 C112 153 130 139 143 121" />
              <path d="M106 119 C91 96 83 72 85 49" />
              <path d="M120 78 C109 66 104 51 106 37" />
              <path d="M146 146 C139 128 138 111 142 94" />
              <path d="M60 139 C43 130 31 117 25 101" />
            </g>

            <g class="mimosa-puffs">
              <circle cx="126" cy="18" r="5.5" />
              <circle cx="118" cy="28" r="6.5" />
              <circle cx="132" cy="31" r="4.5" />
              <circle cx="108" cy="39" r="5" />
              <circle cx="139" cy="42" r="6" />
              <circle cx="101" cy="52" r="7" />
              <circle cx="124" cy="54" r="4" />
              <circle cx="88" cy="65" r="5" />
              <circle cx="113" cy="70" r="6.5" />
              <circle cx="83" cy="82" r="4.5" />

              <circle cx="169" cy="99" r="5" />
              <circle cx="157" cy="108" r="7" />
              <circle cx="171" cy="114" r="4" />
              <circle cx="145" cy="121" r="5.5" />
              <circle cx="163" cy="128" r="6" />
              <circle cx="138" cy="138" r="4.5" />
              <circle cx="153" cy="145" r="7" />
              <circle cx="132" cy="153" r="5" />
              <circle cx="145" cy="162" r="4" />

              <circle cx="36" cy="60" r="4.5" />
              <circle cx="46" cy="72" r="6" />
              <circle cx="31" cy="82" r="4" />
              <circle cx="54" cy="91" r="6.5" />
              <circle cx="25" cy="101" r="5" />
              <circle cx="43" cy="110" r="4.5" />
              <circle cx="57" cy="118" r="7" />
              <circle cx="34" cy="124" r="5.5" />
              <circle cx="62" cy="136" r="4" />
            </g>

            <g class="mimosa-muted">
              <circle cx="78" cy="96" r="3.5" />
              <circle cx="95" cy="108" r="4" />
              <circle cx="117" cy="131" r="3" />
              <circle cx="102" cy="151" r="4.5" />
              <circle cx="79" cy="164" r="3" />
              <circle cx="124" cy="178" r="3.5" />
            </g>

            <g class="mimosa-dust">
              <circle cx="145" cy="20" r="1.5" />
              <circle cx="151" cy="35" r="1" />
              <circle cx="94" cy="29" r="1.2" />
              <circle cx="76" cy="56" r="1.5" />
              <circle cx="66" cy="77" r="1" />
              <circle cx="178" cy="90" r="1.5" />
              <circle cx="175" cy="139" r="1" />
              <circle cx="157" cy="174" r="1.5" />
              <circle cx="26" cy="49" r="1.2" />
              <circle cx="16" cy="75" r="1" />
              <circle cx="14" cy="117" r="1.5" />
              <circle cx="29" cy="141" r="1" />
            </g>

            <g class="ginkgo-branches">
              <path d="M82 232 C91 190 106 153 126 116 C143 84 151 49 150 13" />
              <path d="M86 217 C66 190 58 160 60 131 C62 103 55 78 42 57" />
              <path d="M105 158 C130 149 151 133 166 112" />
              <path d="M119 129 C100 109 91 87 91 66" />
              <path d="M139 82 C124 65 117 48 118 31" />
            </g>

            <g class="ginkgo-leaves">
              <g transform="translate(150 14) rotate(13) scale(.56)">
                <path class="ginkgo-leaf" d="M0 0 C-4 -12 -22 -13 -29 -31 C-16 -48 16 -48 29 -31 C22 -13 5 -12 0 0 Z" />
                <path class="ginkgo-vein" d="M0 -1 L0 -35 M0 -5 L-17 -31 M0 -5 L17 -31" />
              </g>
              <g transform="translate(118 32) rotate(-21) scale(.5)">
                <path class="ginkgo-leaf ginkgo-leaf-light" d="M0 0 C-4 -12 -22 -13 -29 -31 C-16 -48 16 -48 29 -31 C22 -13 5 -12 0 0 Z" />
                <path class="ginkgo-vein" d="M0 -1 L0 -35 M0 -5 L-17 -31 M0 -5 L17 -31" />
              </g>
              <g transform="translate(141 83) rotate(18) scale(.82)">
                <path class="ginkgo-leaf" d="M0 0 C-5 -13 -25 -14 -33 -34 C-18 -53 18 -53 33 -34 C25 -14 5 -13 0 0 Z" />
                <path class="ginkgo-vein" d="M0 -1 L0 -39 M0 -6 L-20 -34 M0 -6 L20 -34" />
              </g>
              <g transform="translate(91 67) rotate(-17) scale(.6)">
                <path class="ginkgo-leaf ginkgo-leaf-light" d="M0 0 C-4 -12 -22 -13 -29 -31 C-16 -48 16 -48 29 -31 C22 -13 5 -12 0 0 Z" />
                <path class="ginkgo-vein" d="M0 -1 L0 -35 M0 -5 L-17 -31 M0 -5 L17 -31" />
              </g>
              <g transform="translate(60 132) rotate(-31) scale(.72)">
                <path class="ginkgo-leaf" d="M0 0 C-5 -13 -25 -14 -33 -34 C-18 -53 18 -53 33 -34 C25 -14 5 -13 0 0 Z" />
                <path class="ginkgo-vein" d="M0 -1 L0 -39 M0 -6 L-20 -34 M0 -6 L20 -34" />
              </g>
              <g transform="translate(166 113) rotate(30) scale(.55)">
                <path class="ginkgo-leaf ginkgo-leaf-deep" d="M0 0 C-4 -12 -22 -13 -29 -31 C-16 -48 16 -48 29 -31 C22 -13 5 -12 0 0 Z" />
                <path class="ginkgo-vein" d="M0 -1 L0 -35 M0 -5 L-17 -31 M0 -5 L17 -31" />
              </g>
            </g>
          </svg>
        </div>

        <figure class="weather-visual">
          <img
            :src="selectedCard.image"
            :alt="selectedCard.imageAlt"
            :style="{ objectPosition: selectedCard.imagePosition }"
          />
        </figure>

        <header class="card-header">
            <div>
              <p class="card-label">TODAY IN TAIWAN</p>
              <div class="city-title">
                <h2>{{ selectedCard.city }}</h2>
                <span class="weather-icon">{{ selectedCard.icon }}</span>
              </div>
            </div>
          </header>

        <div class="forecast-row">
          <div class="condition-copy">
            <p class="description">{{ selectedCard.description }}</p>
            <p class="comfort">{{ selectedCard.comfort }}</p>
          </div>

          <div class="quick-facts">
            <p>
              <span>最低溫</span>
              <strong>{{ selectedCard.minTemperature }}°C</strong>
            </p>
            <p>
              <span>降雨</span>
              <strong>{{ selectedCard.rain }}%</strong>
            </p>
          </div>
        </div>

        <div class="temperature">
          <span>最高溫</span>
          <strong>{{ selectedCard.maxTemperature }}°C</strong>
        </div>
      </article>
      </Transition>
    </section>
  </main>
</template>

<style scoped>

body{
  font-family: Georgia, "Noto Serif TC", serif;
}

:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  min-width: 320px;
  color: #334039;
  background:
    radial-gradient(circle at 18% 18%, rgb(247 197 62 / 13%), transparent 25%),
    linear-gradient(145deg, #fffdf8, #f7f5ed 62%, #edf1e8);
  font-family: "Noto Sans TC", "PingFang TC", sans-serif;
  overflow-x: hidden;
}

.weather-page {
  position: relative;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  width: min(920px, calc(100% - 40px));
  height: 100svh;
  margin: 0 auto;
  padding: clamp(34px, 6vh, 64px) 0 24px;
  overflow: hidden;
}

.hero {
  position: relative;
  z-index: 1;
  justify-self: center;
  width: 100%;
  max-width: 620px;
  margin-bottom: clamp(22px, 3.5vh, 34px);
  text-align: center;
}

.eyebrow {
  margin: 0 0 10px;
  color: #bd8a19;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.hero h1 {
  margin: 0;
  font-family: Georgia, "Noto Serif TC", serif;
  font-size: clamp(2.45rem, 6vw, 4.7rem);
  line-height: 1;
  letter-spacing: 0.04em;
}

.hero>p:last-child {
  margin-bottom: 0;
  color: #718078;
  line-height: 1.8;
}

.filter-panel {
  position: relative;
  z-index: 2;
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 18px;
  width: fit-content;
  padding: 9px 10px 9px 20px;
  border: 1px solid rgb(111 129 115 / 16%);
  border-radius: 18px;
  background: rgb(255 255 255 / 68%);
  box-shadow: 0 14px 40px rgb(80 91 83 / 8%);
  backdrop-filter: blur(12px);
}

.filter-panel label {
  color: #536158;
  font-size: 0.88rem;
  font-weight: 600;
}

.filter-panel select {
  width: 190px;
  padding: 10px 38px 10px 14px;
  border: 0;
  border-radius: 12px;
  color: inherit;
  background: #f3edda;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.weather-stage {
  display: grid;
  min-height: 0;
  place-items: start center;
  padding-top: clamp(18px, 4vh, 38px);
}

.weather-card {
  position: relative;
  width: min(100%, 560px);
  min-height: 250px;
  padding: 27px 36px 24px;
  overflow: hidden;
  border: 1px solid rgb(177 158 106 / 20%);
  border-radius: 30px 9px 30px 9px;
  color: #465044;
  background: rgb(255 253 247 / 94%);
  box-shadow:
    0 22px 55px rgb(65 77 68 / 13%),
    inset 0 0 0 7px rgb(255 255 255 / 42%);
}

.paint-stroke,
.botanical {
  display: none;
}

.weather-visual {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 42%;
  margin: 0;
  overflow: hidden;
  border-radius: 0 9px 30px 0;
  background: #ebe7db;
}

.weather-visual::after {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, #fffdf7 0, rgb(255 253 247 / 72%) 10%, transparent 38%),
    linear-gradient(180deg, rgb(255 255 255 / 8%), rgb(76 75 64 / 8%));
  content: "";
  pointer-events: none;
}

.weather-visual img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.82) contrast(0.92) brightness(1.04);
  transition: opacity 260ms ease, transform 500ms ease;
}

.weather-card:hover .weather-visual img {
  transform: scale(1.025);
}

.paint-stroke {
  position: absolute;
  filter: blur(0.25px);
}

.paint-stroke-yellow {
  top: -28px;
  right: -18px;
  width: 238px;
  height: 192px;
  opacity: 0.3;
  background:
    repeating-linear-gradient(0deg, transparent 0 15px, rgb(114 94 58 / 12%) 16px),
    linear-gradient(138deg, #f4e9c9, #e5d4a9 58%, #f7efdc);
  clip-path: polygon(9% 5%, 83% 0, 100% 14%, 92% 49%, 100% 87%, 67% 100%, 31% 91%, 0 98%, 8% 55%, 0 24%);
  transform: rotate(3deg);
}

.paint-stroke-green {
  right: -36px;
  bottom: -27px;
  width: 270px;
  height: 190px;
  opacity: 0.3;
  background:
    radial-gradient(ellipse at 22% 37%, #d2cec0 0 16%, transparent 17%),
    radial-gradient(ellipse at 49% 55%, #b7b4aa 0 9%, transparent 11%),
    radial-gradient(ellipse at 72% 24%, #e6dfcd 0 18%, transparent 20%),
    radial-gradient(ellipse at 81% 77%, #c3bda9 0 15%, transparent 17%),
    linear-gradient(135deg, #ebe7dc, #c9c5b9 52%, #eee8d8);
  clip-path: polygon(12% 3%, 48% 12%, 79% 0, 100% 27%, 91% 55%, 100% 88%, 66% 100%, 39% 91%, 7% 100%, 0 63%, 11% 35%);
  transform: rotate(-2deg);
}

.paint-stroke::before,
.paint-stroke::after {
  position: absolute;
  border-radius: 50%;
  background: currentColor;
  content: "";
}

.paint-stroke-yellow::before {
  top: 42px;
  left: 23px;
  width: 112px;
  height: 72px;
  border: 1px solid rgb(112 91 58 / 28%);
  border-radius: 2px;
  color: transparent;
  box-shadow: 7px 7px 0 rgb(255 250 235 / 36%);
}

.paint-stroke-yellow::after {
  right: 4px;
  bottom: 9px;
  width: 78px;
  height: 54px;
  color: #f2bf3f;
  opacity: 0.52;
  filter: blur(10px);
}

.botanical {
  position: absolute;
  right: 4px;
  bottom: 10px;
  width: 205px;
  height: 225px;
  opacity: 0.91;
  filter: drop-shadow(0 6px 5px rgb(67 82 67 / 8%));
}

.botanical svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.botanical :deep(.mimosa-stems),
.botanical :deep(.mimosa-puffs),
.botanical :deep(.mimosa-muted),
.botanical :deep(.mimosa-dust),
.botanical :deep(.ginkgo-branches),
.botanical :deep(.ginkgo-leaves) {
  display: none;
}

.botanical :deep(.ginkgo-branches) {
  fill: none;
  stroke: #66665f;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.25;
  opacity: 0.78;
}

.botanical :deep(.ginkgo-branches path:nth-child(2n)) {
  stroke: #8a877c;
  stroke-width: 1;
}

.botanical :deep(.ginkgo-leaf) {
  fill: #efb52f;
  stroke: #b98a32;
  stroke-linejoin: round;
  stroke-width: 0.65;
  opacity: 0.82;
}

.botanical :deep(.ginkgo-leaf-light) {
  fill: #f7cf68;
  opacity: 0.68;
}

.botanical :deep(.ginkgo-leaf-deep) {
  fill: #dda020;
}

.botanical :deep(.ginkgo-vein) {
  fill: none;
  stroke: #b18332;
  stroke-linecap: round;
  stroke-width: 0.65;
  opacity: 0.55;
}

.botanical :deep(.mimosa-stems) {
  fill: none;
  stroke: #4e534d;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.35;
  opacity: 0.88;
}

.botanical :deep(.mimosa-stems path:nth-child(2n)) {
  stroke: #6e7168;
  stroke-width: 1.05;
}

.botanical :deep(.mimosa-puffs) {
  fill: #f0b51c;
  opacity: 0.9;
}

.botanical :deep(.mimosa-puffs circle:nth-child(3n)) {
  fill: #ffd34f;
}

.botanical :deep(.mimosa-puffs circle:nth-child(4n)) {
  fill: #dda014;
  opacity: 0.78;
}

.botanical :deep(.mimosa-muted) {
  fill: #858579;
  opacity: 0.65;
}

.botanical :deep(.mimosa-dust) {
  fill: #e7aa13;
  opacity: 0.82;
}

.botanical :deep(.stems) {
  fill: none;
  stroke: #66745a;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.35;
}

.botanical :deep(.stems path:nth-child(2n)) {
  stroke: #859174;
  stroke-width: 1.15;
}

.botanical :deep(.leaves) {
  fill: #788867;
  opacity: 0.74;
}

.botanical :deep(.leaves ellipse:nth-child(3n)) {
  fill: #9fac8a;
}

.botanical :deep(.petal) {
  fill: #efb32f;
  stroke: #d88b1e;
  stroke-width: 0.45;
  opacity: 0.86;
}

.botanical :deep(.petal-light) {
  fill: #f8cd57;
}

.botanical :deep(.petal-deep) {
  fill: #df8f1f;
}

.botanical :deep(.flower-center) {
  fill: #92591d;
  stroke: #6f461d;
  stroke-width: 0.8;
}

.botanical :deep(.pollen) {
  fill: #ffe58a;
}

.botanical :deep(.buds) {
  fill: #e9aa2e;
  stroke: #778269;
  stroke-width: 1;
}

.watercolor-field {
  position: fixed;
  z-index: -1;
  right: 4vw;
  bottom: -8vh;
  display: flex;
  gap: 14px;
  height: 78vh;
  opacity: 0.14;
  transform: rotate(2deg);
}

.watercolor-field span {
  width: clamp(54px, 8vw, 96px);
  background: linear-gradient(180deg, transparent, #f2bd3c 8% 92%, transparent);
  clip-path: polygon(14% 0, 91% 4%, 79% 38%, 100% 66%, 84% 100%, 3% 94%, 18% 61%, 0 28%);
}

.watercolor-field span:nth-child(2) {
  background: linear-gradient(180deg, transparent, #a9c1ab 9% 93%, transparent);
  transform: translateY(8vh);
}

.watercolor-field span:nth-child(3) {
  background: linear-gradient(180deg, transparent, #f5cc55 7% 90%, transparent);
  transform: translateY(-3vh);
}

.card-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 12px;
}

.city-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-label {
  margin: 0 0 8px;
  color: #b28019;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.card-header h2 {
  margin: 0;
  font-family: Georgia, "Noto Serif TC", serif;
  font-size: 1.9rem;
}

.weather-icon {
  display: grid;
  width: 51px;
  height: 51px;
  place-items: center;
  border: 1px solid rgb(180 145 55 / 18%);
  border-radius: 50%;
  background: rgb(255 252 236 / 75%);
  font-size: 1.8rem;
}

.forecast-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  width: 55%;
  margin: 15px 0 10px;
}

.condition-copy {
  min-width: 0;
}

.description {
  margin: 0;
  color: #68776e;
  font-size: 0.9rem;
  font-weight: 600;
}

.comfort {
  margin: 3px 0 0;
  color: #869087;
  font-size: 0.7rem;
  white-space: nowrap;
}

.quick-facts {
  display: flex;
  justify-self: start;
  flex-shrink: 0;
  gap: 30px;
}

.quick-facts p {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: max-content;
  margin: 0;
  padding-left: 10px;
  border-left: 1px solid rgb(38 51 45 / 12%);
}

.quick-facts span {
  color: rgb(38 51 45 / 56%);
  font-size: 0.8rem;
}

.quick-facts strong {
  color: #465044;
  font-size: 1rem;
  white-space: nowrap;
}

.temperature {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: baseline;
  gap: 40px;
  margin-bottom: 0;
}

.temperature strong {
  font-family: Georgia, serif;
  font-size: 3.25rem;
  font-weight: 500;
  line-height: 1;
}

.temperature span {
  color: rgb(38 51 45 / 70%);
  font-size: 0.72rem;
}

.status {
  justify-self: center;
  margin: 14px 0 0;
  color: #a33c32;
  font-size: 0.85rem;
}

.card-grow-enter-active,
.card-grow-leave-active {
  transition: opacity 320ms ease, transform 420ms cubic-bezier(0.2, 0.75, 0.2, 1);
}

.card-grow-enter-from,
.card-grow-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.92);
}

@media (max-width: 600px) {
  .weather-page {
    width: min(100% - 28px, 920px);
    padding-top: 30px;
  }

  .filter-panel {
    align-items: stretch;
    flex-direction: column;
    width: 100%;
    padding: 13px;
  }

  .filter-panel select {
    width: 100%;
  }

  .weather-stage {
    place-items: start center;
    padding-top: 18px;
  }

  .weather-card {
    min-height: 255px;
    padding: 22px 24px;
  }

  .paint-stroke-yellow {
    top: -18px;
    right: -35px;
    bottom: auto;
    width: 190px;
    height: 142px;
  }

  .paint-stroke-green {
    right: 52px;
    bottom: 28px;
    width: 135px;
    height: 102px;
  }

  .botanical {
    right: -5px;
    bottom: 9px;
    width: 170px;
    height: 195px;
  }

  .forecast-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 7px;
    width: 64%;
  }

  .watercolor-field {
    right: -70px;
  }
}
</style>
